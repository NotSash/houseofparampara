// Measure the whole page on a phone: tap targets, gaps, text size, overflow.
//
//   npx next start -p 4100
//   export LD_LIBRARY_PATH=$HOME/.localroot/root/usr/lib/x86_64-linux-gnu
//   node scripts/mobile-audit.mjs
//
// WHY THESE FOUR THINGS.
//
//   tap targets    44px is the smallest control most people hit reliably with
//                  a thumb. Below that the miss rate climbs sharply.
//   gaps           two 44px buttons 2px apart are still one ambiguous blob.
//                  8px minimum between adjacent controls.
//   16px body text iOS Safari ZOOMS THE PAGE when you focus an input whose
//                  text is under 16px, and the zoom is not undone afterwards.
//                  It also applies to reading comfort generally.
//   overflow       anything wider than the viewport produces a horizontal
//                  scrollbar, which on a phone means the page slides sideways
//                  under the thumb while trying to scroll down.
//
// Runs at 360 (small Android), 390 (iPhone) and 430 (iPhone Pro Max).
//
// TRAP 1: scroll the whole page before measuring. Content below the fold has
// not been revealed and its animated ancestors are still at opacity 0, so
// everything reports zero size and the audit passes for the wrong reason.
//
// TRAP 2: only measure the SMALL text that is actual prose. Eyebrows, numerals
// and legal lines are labels, they are read once and are allowed to be small.
// Judging them by the 16px rule produces noise that buries the real findings.
//
// TRAP 3: a control inside a horizontally scrolling carousel is legitimately
// allowed to sit outside the viewport. Measure overflow against the scroll
// container, not the window.
//
// TRAP 7: CONTROLS THAT ONLY EXIST AFTER AN INTERACTION ARE NEVER MEASURED.
// The quantity steppers appear only once an item is ticked, so an audit that
// merely loads and scrolls never sees them. Proved by shrinking them to 24px:
// the audit still reported 0 failures. The builder is now put into a realistic
// state, one item ticked, before anything is measured.
//
// TRAP 6: THE HIT AREA IS NOT ALWAYS THE ELEMENT. A 20px checkbox wrapped in a
// 44px padded span, or wrapped in a <label>, is a 44px target: tapping the
// padding or the label text activates it. Measuring the <input> alone reported
// 20x20 for a control that is genuinely comfortable to hit. Measured on the
// note checkbox: input 20x20, wrapper 44x44, label 316x80. The effective
// target is the nearest ancestor that is either a <label> for this control or
// a padded wrapper, so that is what gets measured.
//
// TRAP 4: a decorative blob positioned off the edge INSIDE an `overflow-hidden`
// parent is clipped by the browser and causes no scrolling. Reporting it wastes
// the reader's attention on a non-defect. Only report overflow that the
// document actually scrolls to reach.
//
// TRAP 5: "prose under 16px" must exclude labels, or the output is 40 lines of
// noise. A link whose whole body is a call to action ("Build from this
// collection") is a button caption, not a paragraph. Taglines set in italic
// serif are display text. Both are excluded deliberately, and the exclusions
// are narrow enough to state out loud.

import { chromium } from 'playwright'

const URL = process.env.URL ?? 'http://localhost:4100/'
const MIN_TAP = 44
const MIN_GAP = 8
const MIN_BODY = 16
const WIDTHS = [360, 390, 430]

const browser = await chromium.launch()
let fails = 0

for (const width of WIDTHS) {
  const page = await browser.newPage({
    viewport: { width, height: 844 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
    reducedMotion: 'reduce',
  })
  await page.goto(URL, { waitUntil: 'load' })
  await page.waitForTimeout(1200)
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 400) {
      window.scrollTo(0, y)
      await new Promise((r) => setTimeout(r, 90))
    }
    window.scrollTo(0, 0)
  })
  await page.waitForTimeout(900)

  // Put the builder into a realistic state so conditionally rendered controls
  // (the quantity steppers, the note textarea) actually exist to be measured.
  const firstItem = await page.$('#builder li button[aria-pressed]')
  if (firstItem) {
    await firstItem.click()
    await page.waitForTimeout(400)
  }
  const noteBox = await page.$('#builder input[type="checkbox"]')
  if (noteBox) {
    await noteBox.check()
    await page.waitForTimeout(400)
  }
  await page.evaluate(() => window.scrollTo(0, 0))
  await page.waitForTimeout(300)

  console.log(`\n=== ${width}px ===`)
  const before = fails

  const result = await page.evaluate(
    ({ MIN_TAP, MIN_GAP, MIN_BODY }) => {
      const visible = (el) => {
        const cs = getComputedStyle(el)
        if (cs.display === 'none' || cs.visibility === 'hidden') return false
        const r = el.getBoundingClientRect()
        return r.width > 0 && r.height > 0
      }
      const name = (el) =>
        (el.getAttribute('aria-label') || el.textContent || el.tagName).trim().replace(/\s+/g, ' ').slice(0, 34)

      // ---- tap targets
      const small = []
      const controls = [...document.querySelectorAll('a, button, input, select, textarea, [role="button"]')].filter(visible)
      // The box a finger can actually land on, which may be an ancestor.
      const hitArea = (el) => {
        let best = el.getBoundingClientRect()
        const label = el.closest('label')
        if (label) {
          const lr = label.getBoundingClientRect()
          if (lr.width >= best.width && lr.height >= best.height) best = lr
        }
        // A wrapper that exists only to pad this control counts too.
        const parent = el.parentElement
        if (parent && parent.children.length === 1) {
          const pr = parent.getBoundingClientRect()
          if (pr.width >= best.width && pr.height >= best.height) best = pr
        }
        return best
      }

      for (const el of controls) {
        // An inline link inside a paragraph is a word, not a button. Only
        // standalone controls are held to the 44px rule.
        const inProse = el.closest('p, li:not([class])') && getComputedStyle(el).display.includes('inline')
        if (inProse) continue
        const r = hitArea(el)
        if (r.height < MIN_TAP || r.width < MIN_TAP) {
          small.push({ n: name(el), w: Math.round(r.width), h: Math.round(r.height) })
        }
      }

      // ---- gaps between adjacent controls
      const tight = []
      for (let i = 0; i < controls.length; i++) {
        for (let j = i + 1; j < controls.length; j++) {
          const a = controls[i]
          const b = controls[j]
          if (a.contains(b) || b.contains(a)) continue
          const ra = a.getBoundingClientRect()
          const rb = b.getBoundingClientRect()
          const dx = Math.max(0, Math.max(ra.left - rb.right, rb.left - ra.right))
          const dy = Math.max(0, Math.max(ra.top - rb.bottom, rb.top - ra.bottom))
          if (dx === 0 && dy === 0) continue // overlapping or nested, not a gap
          const gap = dx > 0 && dy > 0 ? Math.hypot(dx, dy) : Math.max(dx, dy)
          if (gap < MIN_GAP) tight.push({ a: name(a), b: name(b), gap: Math.round(gap) })
        }
      }

      // ---- prose smaller than 16px
      const tiny = []
      for (const el of document.querySelectorAll('p, li, dd, dt, span, div, a')) {
        const own = [...el.childNodes]
          .filter((n) => n.nodeType === 3)
          .map((n) => n.textContent.trim())
          .join(' ')
          .trim()
        if (own.length < 25) continue // labels and numerals, not prose
        if (!visible(el)) continue
        const cs = getComputedStyle(el)
        const size = parseFloat(cs.fontSize)
        // Uppercase tracked-out text is a label by construction.
        if (cs.textTransform === 'uppercase') continue
        // A link whose entire content is its own label is a button caption.
        if (el.closest('a, button') && own === (el.closest('a, button').textContent || '').trim()) continue
        // Italic serif taglines are display text, not body copy.
        if (cs.fontStyle === 'italic') continue
        // Items in the hero trust strip are chips, not sentences.
        if (el.closest('[data-audit="hero-trust"]')) continue
        // The footer colophon (copyright, tagline) is fine print: read once, by
        // almost nobody, and conventionally set smaller. It was 12px, which is
        // too small for anything; it is now 14px. Exempting it from the 16px
        // rule is a judgement call and is recorded here rather than hidden by
        // quietly lowering the threshold for the whole site.
        if (el.closest('[data-audit="colophon"]')) continue
        if (size < MIN_BODY) tiny.push({ t: own.slice(0, 44), size })
      }

      // ---- horizontal overflow
      const wide = []
      const vw = document.documentElement.clientWidth
      for (const el of document.querySelectorAll('body *')) {
        if (!visible(el)) continue
        const r = el.getBoundingClientRect()
        if (r.width < 2) continue
        // Inside a horizontal scroller, or clipped by an overflow-hidden
        // ancestor, being off to the side causes no scrolling and is not a
        // defect.
        let excused = false
        for (let n = el.parentElement; n; n = n.parentElement) {
          const ov = getComputedStyle(n).overflowX
          if (ov === 'auto' || ov === 'scroll' || ov === 'hidden' || ov === 'clip') { excused = true; break }
        }
        if (excused) continue
        if (r.right > vw + 1 || r.left < -1) {
          wide.push({ n: name(el), left: Math.round(r.left), right: Math.round(r.right) })
        }
      }

      return {
        small,
        tight,
        tiny,
        wide,
        controls: controls.length,
        docScroll: document.documentElement.scrollWidth,
        vw,
      }
    },
    { MIN_TAP, MIN_GAP, MIN_BODY },
  )

  for (const s of result.small) {
    fails++
    console.log(`  FAIL tap target ${s.w}x${s.h} (need ${MIN_TAP}): "${s.n}"`)
  }
  // The same pair reports at every width; collapse to unique pairs.
  const seenPairs = new Set()
  for (const t of result.tight) {
    const key = `${t.a}|${t.b}`
    if (seenPairs.has(key)) continue
    seenPairs.add(key)
    fails++
    console.log(`  FAIL gap ${t.gap}px (need ${MIN_GAP}) between "${t.a}" and "${t.b}"`)
  }
  for (const t of result.tiny) {
    fails++
    console.log(`  FAIL prose at ${t.size}px (need ${MIN_BODY}): "${t.t}"`)
  }
  for (const w of result.wide) {
    fails++
    console.log(`  FAIL overflows viewport (${w.left} to ${w.right}, viewport ${result.vw}): "${w.n}"`)
  }
  if (result.docScroll > result.vw + 1) {
    fails++
    console.log(`  FAIL page scrolls horizontally: ${result.docScroll}px of content in ${result.vw}px`)
  }
  if (fails === before) console.log(`  clean, ${result.controls} controls checked`)

  await page.close()
}

await browser.close()
console.log(`\nMOBILE FAILURES: ${fails}`)
process.exit(fails > 0 ? 1 : 0)
