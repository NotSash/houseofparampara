// Measure the hamper builder: tap targets, press feedback, sticky bar, and
// how long a tab switch actually takes.
//
//   npx next start -p 4010
//   export LD_LIBRARY_PATH=$HOME/.localroot/root/usr/lib/x86_64-linux-gnu
//   node scripts/builder-audit.mjs
//
// WHY EACH CHECK EXISTS. Every one of these caught a real defect the first
// time it was run:
//
//   tap targets   collection chips were 38px and hamper chips 34px, both under
//                 the 44px minimum
//   sticky bar    the mobile order bar reported y=912 inside an 844px
//                 viewport. `overflow-hidden` on the section makes
//                 `position: sticky` inert on every descendant, so the bar
//                 never appeared. It clipped nothing: measured 0px overflow.
//   press state   item cards had NO press feedback. `transform` stayed
//                 `none` on pointer down.
//   tab switch    831ms to settle, because AnimatePresence mode="wait" runs
//                 exit THEN enter, serialising two 400ms animations.
//
// TRAP: measure the sticky bar only AFTER scrolling past it, otherwise it is
// in its normal flow position and looks fine either way.

import { chromium } from 'playwright'

const URL = process.env.URL ?? 'http://localhost:4010/'
const MIN_TAP = 44
const MIN_GAP = 8
const MAX_SETTLE = 500

const browser = await chromium.launch()
let fails = 0
const fail = (m) => {
  fails++
  console.log(`  FAIL ${m}`)
}

// ------------------------------------------------------------ tap targets
{
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 })
  await page.goto(URL, { waitUntil: 'load' })
  await page.evaluate(() => document.querySelector('#builder').scrollIntoView())
  await page.waitForTimeout(2000)

  console.log('\n=== tap targets, 390px ===')
  const targets = await page.evaluate(() =>
    [...document.querySelectorAll('#builder button, #builder a')]
      .map((el) => {
        const r = el.getBoundingClientRect()
        return { t: (el.textContent || '').trim().slice(0, 24), w: Math.round(r.width), h: Math.round(r.height) }
      })
      .filter((x) => x.w > 0),
  )
  for (const t of targets) if (t.h < MIN_TAP) fail(`${t.h}px tall (need ${MIN_TAP}): "${t.t}"`)
  console.log(`  checked ${targets.length} controls`)

  const gaps = await page.evaluate(() =>
    [...document.querySelectorAll('#builder .flex-wrap')].flatMap((row) => {
      const k = [...row.children].map((c) => c.getBoundingClientRect())
      const g = []
      for (let i = 1; i < k.length; i++) {
        if (Math.abs(k[i].top - k[i - 1].top) < 2) g.push(Math.round(k[i].left - k[i - 1].right))
      }
      return g
    }),
  )
  for (const g of gaps) if (g < MIN_GAP) fail(`gap of ${g}px between chips (need ${MIN_GAP})`)
  console.log(`  checked ${gaps.length} gaps`)

  // -------------------------------------------------------- sticky bar
  console.log('\n=== mobile order bar ===')
  // A weak version of this check (scroll once, is it on screen?) PASSED while
  // the bar was broken, because at that one scroll position it happened to be
  // in flow near the bottom. Stickiness means it stays pinned as the page
  // moves, so measure it at two positions and require it to hold.
  // A sticky element correctly UNPINS once its container scrolls past: it
  // leaves with the item list it belongs to. That is not a defect, so only
  // measure while the container still has room below the viewport.
  const probeBar = async (dy) => {
    await page.evaluate((d) => window.scrollBy(0, d), dy)
    await page.waitForTimeout(500)
    return page.evaluate(() => {
      const el = document.querySelector('#builder .sticky')
      if (!el) return null
      const r = el.getBoundingClientRect()
      return {
        top: Math.round(r.top),
        vh: window.innerHeight,
        containerHasRoom: el.parentElement.getBoundingClientRect().bottom > window.innerHeight,
      }
    })
  }
  const samples = []
  for (let i = 0; i < 8; i++) {
    const s2 = await probeBar(120)
    if (!s2) break
    if (s2.containerHasRoom) samples.push(s2)
  }
  if (!samples.length) fail('no sticky order bar found, or it never had room to pin')
  else {
    const offscreen = samples.filter((x) => x.top > x.vh)
    const tops = samples.map((x) => x.top)
    const drift = Math.max(...tops) - Math.min(...tops)
    if (offscreen.length) {
      fail(`order bar is off screen while its container is still in view: tops ${tops.join(', ')} ` +
           `in a ${samples[0].vh}px viewport`)
    } else if (drift > 24) {
      fail(`order bar is not sticky: it drifted ${drift}px up the viewport (tops ${tops.join(', ')}) ` +
           `while its container still had room, so it scrolls away instead of pinning`)
    } else {
      console.log(`  pinned at top ${tops.join(', ')} of ${samples[0].vh}px across ${samples.length} scroll steps`)
    }
  }
  // ------------------------------------------- overlapping fixed controls
  // The floating WhatsApp button and the builder's own "Order" button are both
  // round WhatsApp buttons pinned bottom right, so the floating one landed on
  // top of the other and covered the word "Order". Every numeric check was
  // green; only a screenshot showed it. Now it is measured.
  console.log('\n=== controls overlapping the order bar ===')
  // TRAP: the floating button only appears past 600px of scroll, and this
  // probe runs after the sticky loop has already moved the page. Re-settle
  // first, otherwise the button is simply absent and the check passes for the
  // wrong reason.
  await page.evaluate(() => document.querySelector('#builder').scrollIntoView())
  await page.waitForTimeout(900)
  await page.evaluate(() => window.scrollBy(0, 360))
  await page.waitForTimeout(900)
  const overlaps = await page.evaluate(() => {
    const bar = document.querySelector('#builder .sticky')
    if (!bar) return []
    const br = bar.getBoundingClientRect()
    if (br.top > window.innerHeight || br.bottom < 0) return []
    return [...document.querySelectorAll('a, button')]
      .filter((el) => {
        if (bar.contains(el)) return false
        const cs = getComputedStyle(el)
        if (cs.position !== 'fixed') return false
        if (cs.visibility === 'hidden' || parseFloat(cs.opacity) < 0.05) return false
        const r = el.getBoundingClientRect()
        if (r.width < 2) return false
        return !(br.right < r.left || br.left > r.right || br.bottom < r.top || br.top > r.bottom)
      })
      .map((el) => (el.getAttribute('aria-label') || el.textContent || '').trim().slice(0, 30))
  })
  for (const o of overlaps) fail(`a fixed control overlaps the order bar: "${o}"`)
  if (!overlaps.length) console.log('  nothing overlaps the order bar')

  await page.close()
}

// ------------------------------------------------------------ press state
{
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
  await page.goto(URL, { waitUntil: 'load' })
  await page.evaluate(() => document.querySelector('#builder').scrollIntoView())
  await page.waitForTimeout(1500)

  console.log('\n=== press feedback ===')
  // TRAP: Tailwind v4 compiles `scale-[0.98]` to the standalone `scale`
  // property, NOT to `transform`. Reading only `transform` reports "none" and
  // declares a working press state broken. Read both.
  const read = () =>
    page.evaluate(() => {
      const b = document.querySelector('#builder li button')
      const c = getComputedStyle(b)
      return `transform:${c.transform} scale:${c.scale}`
    })
  const rest = await read()
  await page.hover('#builder li button')
  await page.mouse.down()
  await page.waitForTimeout(90)
  const pressed = await read()
  await page.mouse.up()
  if (rest === pressed) fail(`item card does not react to pointer down (stays "${rest}")`)
  else console.log(`  item card: ${rest} -> ${pressed}`)

  // ---------------------------------------------------------- tab switch
  console.log('\n=== hamper tab switch ===')
  const buttons = await page.$$('#builder button')
  let target = null
  for (const b of buttons) if ((await b.textContent()).trim() === 'Hamper 2') target = b
  if (!target) {
    console.log('  Hamper 2 not present, skipped')
  } else {
    // MEASURE INSIDE THE PAGE. Polling from Node round-trips over the
    // devtools protocol on every sample, which costs 30 to 60ms each and made
    // this reading straddle the limit: the same unchanged build measured 482,
    // 485, 524 and 532ms on four consecutive runs. That is the probe's
    // resolution, not the animation. A requestAnimationFrame loop inside the
    // page samples every frame with no round trip.
    //
    // It also stops the clock when motion STOPS, not after an extra settling
    // window, so the number is the animation's real duration.
    await page.evaluate(() => {
      window.__settle = null
      const el = () => document.querySelector('#builder ul')
      const probe = () => {
        const u = el()
        if (!u) return 0
        const r = u.getBoundingClientRect()
        return r.top + parseFloat(getComputedStyle(u.parentElement).opacity) * 1000
      }
      const t0 = performance.now()
      let last = probe()
      let stillSince = null
      let moved = false
      const tick = () => {
        const now = performance.now()
        const v = probe()
        if (Math.abs(v - last) < 0.3) {
          // TRAP: this loop starts BEFORE the click, so the first frames are
          // legitimately still. Without `moved`, it stopped the clock
          // immediately and reported a 3ms animation. Only start looking for
          // stillness once something has actually moved.
          if (moved) {
            if (stillSince === null) stillSince = now
            if (now - stillSince > 50) {
              window.__settle = Math.round(stillSince - t0)
              return
            }
          }
        } else {
          moved = true
          stillSince = null
        }
        last = v
        if (now - t0 < 4000) requestAnimationFrame(tick)
        else window.__settle = 4000
      }
      requestAnimationFrame(tick)
    })
    await target.click()
    await page.waitForFunction(() => window.__settle !== null, null, { timeout: 6000 })
    const settle = await page.evaluate(() => window.__settle)
    if (settle > MAX_SETTLE) fail(`tab switch takes ${settle}ms to settle (max ${MAX_SETTLE})`)
    else console.log(`  settles in ${settle}ms`)
  }

  // ------------------------------------------------- total actually counts
  console.log('\n=== running total ===')
  const price = await page.$('#builder [data-price]')
  if (!price) fail('no [data-price] total found, the animated total is not mounted')
  else {
    const before = await price.textContent()
    await page.click('#builder li button')
    await page.waitForTimeout(40)
    const mid = await price.textContent()
    await page.waitForTimeout(600)
    const after = await price.textContent()
    if (before === after) fail('total did not change when an item was toggled')
    else if (mid === after) {
      fail(`total jumped straight to its new value (${before} to ${after}) instead of counting`)
    } else {
      console.log(`  counts: ${before} -> ${mid} -> ${after}`)
    }
  }
  await page.close()
}

await browser.close()
console.log(`\nBUILDER FAILURES: ${fails}`)
process.exit(fails > 0 ? 1 : 0)
