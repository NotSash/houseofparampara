// Measure text contrast on the running site, in both themes, at two widths.
//
//   npx next build && npx next start -p 3900
//   export LD_LIBRARY_PATH=$HOME/.localroot/root/usr/lib/x86_64-linux-gnu
//   node scripts/contrast-audit.mjs
//
// HOW IT MEASURES. Colours in globals.css are oklch and several panels are
// translucent, so a naive string parse is wrong. Every colour is painted onto
// a real canvas and read back as rgba, which makes the browser do the colour
// conversion. Backgrounds are then composited down the ancestor chain in the
// same order the browser paints them, so a translucent card over a cream page
// gives the colour the eye actually sees.
//
// TRAP: images and gradients cannot be sampled this way. Elements whose own
// or whose ancestors' background-image is not `none` are reported separately
// as UNMEASURABLE rather than being silently passed.
//
// TRAP 2: the hero photograph is an <img> element, NOT a CSS background, so a
// background-image check alone misses it and reports every hero line as a
// contrast failure at about 1.0. Any real <img> or <video> whose box contains
// the text box also counts as unmeasurable.
//
// TRAP 3: a POSITION:FIXED element has no useful ancestor background. Walking
// its parents lands on <body>, which is cream, while the thing actually behind
// it on screen is whatever it happens to be floating over. The transparent nav
// sits over the dark hero and this method reported 1.03:1 for every link.
// Measured properly by screenshotting the pixels behind one: 15.67:1. Fixed
// elements are handed to the pixel-sampling audit instead of being guessed at
// here.

import { chromium } from 'playwright'

const URL = process.env.URL ?? 'http://localhost:3900/'
const MIN_NORMAL = 4.5
const MIN_LARGE = 3.0

const browser = await chromium.launch()

const audit = async (theme, viewport) => {
  // Reduced motion so scroll-reveal elements are not caught mid-fade. Without
  // this, anything still animating reports a contrast ratio of exactly 1.
  const page = await browser.newPage({ viewport, deviceScaleFactor: 1, reducedMotion: 'reduce' })
  await page.goto(URL, { waitUntil: 'load' })
  await page.evaluate((t) => {
    localStorage.setItem('theme', t)
  }, theme)
  await page.reload({ waitUntil: 'load' })
  await page.waitForTimeout(1200)
  // Load everything below the fold before measuring.
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 500) {
      window.scrollTo(0, y)
      await new Promise((r) => setTimeout(r, 120))
    }
    window.scrollTo(0, 0)
  })
  await page.waitForTimeout(800)

  const results = await page.evaluate(
    ({ MIN_NORMAL, MIN_LARGE }) => {
      const cv = document.createElement('canvas')
      cv.width = cv.height = 1
      const ctx = cv.getContext('2d', { willReadFrequently: true })

      const toRGBA = (color) => {
        ctx.clearRect(0, 0, 1, 1)
        ctx.fillStyle = '#000'
        ctx.fillStyle = color
        ctx.globalCompositeOperation = 'copy'
        ctx.fillRect(0, 0, 1, 1)
        ctx.globalCompositeOperation = 'source-over'
        const d = ctx.getImageData(0, 0, 1, 1).data
        return [d[0], d[1], d[2], d[3] / 255]
      }

      const over = (fg, bg) => {
        const a = fg[3] + bg[3] * (1 - fg[3])
        if (a === 0) return [0, 0, 0, 0]
        return [
          (fg[0] * fg[3] + bg[0] * bg[3] * (1 - fg[3])) / a,
          (fg[1] * fg[3] + bg[1] * bg[3] * (1 - fg[3])) / a,
          (fg[2] * fg[3] + bg[2] * bg[3] * (1 - fg[3])) / a,
          a,
        ]
      }

      const lum = ([r, g, b]) => {
        const f = (c) => {
          c /= 255
          return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
        }
        return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b)
      }

      const ratio = (a, b) => {
        const [l1, l2] = [lum(a), lum(b)].sort((x, y) => y - x)
        return (l1 + 0.05) / (l2 + 0.05)
      }

      const visible = (el) => {
        const cs = getComputedStyle(el)
        if (cs.visibility === 'hidden' || cs.display === 'none') return false
        if (parseFloat(cs.opacity) < 0.1) return false
        const r = el.getBoundingClientRect()
        return r.width > 0 && r.height > 0
      }

      const label = (el) => {
        const cls = (el.getAttribute('class') || '').slice(0, 60)
        return `${el.tagName.toLowerCase()}${cls ? '.' + cls.replace(/\s+/g, '.') : ''}`
      }

      let animating = 0
      const fails = []
      const unmeasurable = []
      const passes = []

      for (const el of document.querySelectorAll('body *')) {
        // Only elements with their own direct text.
        const text = [...el.childNodes]
          .filter((n) => n.nodeType === 3)
          .map((n) => n.textContent.trim())
          .join(' ')
          .trim()
        if (!text) continue
        if (!visible(el)) continue

        const cs = getComputedStyle(el)
        let fg = toRGBA(cs.color)
        // Inherited element opacity dims the text against its backdrop. A
        // chain opacity under 0.99 nearly always means a scroll reveal has not
        // finished, not a design decision, so those are skipped and counted.
        let chainOpacity = 1
        let node = el
        while (node && node !== document.documentElement) {
          chainOpacity *= parseFloat(getComputedStyle(node).opacity)
          node = node.parentElement
        }
        if (chainOpacity < 0.99) {
          animating++
          continue
        }

        // Composite the background stack from the page root upward.
        const chain = []
        for (let n = el; n; n = n.parentElement) chain.push(n)
        let hasImage = false
        // A fixed-position ancestor means the real backdrop is not in this
        // element's parent chain. Hand it to the pixel audit.
        for (let n = el; n; n = n.parentElement) {
          if (getComputedStyle(n).position === 'fixed') { hasImage = true; break }
        }
        if (!hasImage) {
          const tr = el.getBoundingClientRect()
          for (const m of document.querySelectorAll('img, video, canvas')) {
            const mr = m.getBoundingClientRect()
            if (mr.width < 2 || mr.height < 2) continue
            if (m.contains(el)) continue
            if (
              mr.left <= tr.left + 1 &&
              mr.top <= tr.top + 1 &&
              mr.right >= tr.right - 1 &&
              mr.bottom >= tr.bottom - 1
            ) {
              hasImage = true
              break
            }
          }
        }
        let bg = [255, 255, 255, 1]
        for (const n of chain.reverse()) {
          const s = getComputedStyle(n)
          if (s.backgroundImage && s.backgroundImage !== 'none') hasImage = true
          const c = toRGBA(s.backgroundColor)
          if (c[3] > 0) bg = over(c, bg)
        }

        const size = parseFloat(cs.fontSize)
        const weight = parseInt(cs.fontWeight, 10) || 400
        const large = size >= 24 || (size >= 18.66 && weight >= 700)
        const need = large ? MIN_LARGE : MIN_NORMAL
        const r = ratio(over(fg, bg), bg)

        const row = {
          text: text.slice(0, 48),
          sel: label(el),
          size,
          weight,
          ratio: Math.round(r * 100) / 100,
          need,
        }
        if (hasImage) unmeasurable.push(row)
        else if (r < need) fails.push(row)
        else passes.push(row)
      }
      return { fails, unmeasurable, passCount: passes.length, animating }
    },
    { MIN_NORMAL, MIN_LARGE },
  )

  const tag = `${theme} @ ${viewport.width}`
  console.log(`\n=== ${tag} ===`)
  console.log(`pass ${results.passCount}, fail ${results.fails.length}, over an image ${results.unmeasurable.length}, skipped mid-animation ${results.animating}`)
  for (const f of results.fails) {
    console.log(`  FAIL ${f.ratio} (need ${f.need}) ${f.size}px/${f.weight}  ${f.sel}`)
    console.log(`       "${f.text}"`)
  }
  for (const u of results.unmeasurable) {
    console.log(`  OVER-IMAGE ${u.size}px ${u.sel} "${u.text}"`)
  }
  await page.close()
  return results.fails.length
}

let totalFails = 0
for (const theme of ['light', 'dark']) {
  for (const viewport of [{ width: 1440, height: 900 }, { width: 390, height: 844 }]) {
    totalFails += await audit(theme, viewport)
  }
}
await browser.close()
console.log(`\nTOTAL FAILURES: ${totalFails}`)
process.exit(totalFails > 0 ? 1 : 0)
