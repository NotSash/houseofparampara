// Contrast for text that sits on top of a photograph.
//
//   npx next start -p 3903
//   export LD_LIBRARY_PATH=$HOME/.localroot/root/usr/lib/x86_64-linux-gnu
//   node scripts/image-contrast-audit.mjs
//
// WHY THIS EXISTS. scripts/contrast-audit.mjs composites CSS background
// colours on a canvas. It cannot read a photograph, so it reports that text as
// UNMEASURABLE instead of guessing. This script measures those cases properly.
//
// METHOD. For each element, hide the text with `visibility: hidden` (which
// leaves the layout and the backdrop exactly as they were), screenshot the box
// the text occupied, then find the lightest and the darkest pixel in that
// backdrop. The text colour is checked against BOTH, so the number reported is
// the worst spot in the image, not the average. Averages hide the failure.
//
// TRAP: an element below the fold has an empty clip rectangle and Playwright
// throws. Scroll it into view first.
//
// TRAP 2: TARGETS ARE NOT INDEPENDENT. Scrolling to reach one target changes
// the page state for later ones. The nav swaps to a light "scrolled" skin once
// the page moves, so by the time the nav entries were reached the audit was
// measuring the scrolled skin over a cream page and reporting a comfortable
// pass, while the over-hero skin it was supposed to check went unmeasured.
// Proved by injecting near-black nav text: true contrast 1.14:1, audit still
// said 8.10. Anything marked `atTop` is therefore measured from a fresh scroll
// position at the very top of the page.

import { chromium } from 'playwright'

const URL = process.env.URL ?? 'http://localhost:3903/'
const TARGETS = [
  // `atTop: true` means the page must be scrolled back to 0 before measuring,
  // because the element's appearance depends on scroll position.
  ['nav wordmark over hero', 'header span.font-serif', { atTop: true }],
  ['nav link over hero', 'header a[href="#story"]', { atTop: true }],
  ['hero heading', 'h1'],
  ['hero paragraph', '#top p'],
  // Target the label SPANS, not the whole bar. The bar's box is mostly gaps
  // and icons, so sampling it measured the gold icon against itself and
  // reported 1.03:1 for text that is actually fine.
  ['hero assurance label', '[data-audit="hero-trust"] span'],
  ['hero primary button', '#top a[href="#collections"]'],
  ['closing heading', '#contact h2'],
  ['closing paragraph', '#contact p'],
]

const srgb = (c) => {
  c /= 255
  return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
}
const lum = (r, g, b) => 0.2126 * srgb(r) + 0.7152 * srgb(g) + 0.0722 * srgb(b)
const ratio = (a, b) => {
  const [hi, lo] = [a, b].sort((x, y) => y - x)
  return (hi + 0.05) / (lo + 0.05)
}

const browser = await chromium.launch()
let fails = 0

for (const [vw, label] of [[1440, 'desktop'], [390, 'mobile']]) {
  const page = await browser.newPage({ viewport: { width: vw, height: 900 }, reducedMotion: 'reduce' })
  await page.goto(URL, { waitUntil: 'load' })
  await page.waitForTimeout(1200)
  console.log(`\n=== ${label} ${vw}px ===`)

  for (const [name, sel, opts = {}] of TARGETS) {
    if (opts.atTop) {
      await page.evaluate(() => window.scrollTo(0, 0))
      // The nav cross-fades between skins, so wait for that to finish or the
      // sample lands mid-transition.
      await page.waitForTimeout(700)
    }
    const el = await page.$(sel)
    if (!el) {
      console.log(`  ${name}: not present`)
      continue
    }
    // Something hidden at this breakpoint is not a defect, it is responsive
    // design. Skip it rather than timing out.
    if (!(await el.isVisible())) {
      console.log(`  ${name}: hidden at this width, skipped`)
      continue
    }
    if (!opts.atTop) await el.scrollIntoViewIfNeeded()
    await page.waitForTimeout(700)
    const box = await el.boundingBox()
    if (!box || box.width < 2 || box.height < 2) {
      console.log(`  ${name}: no box`)
      continue
    }
    const info = await el.evaluate((e) => {
      const cs = getComputedStyle(e)
      return { color: cs.color, size: parseFloat(cs.fontSize), weight: parseInt(cs.fontWeight, 10) || 400 }
    })
    // Read the text colour through a canvas so lab() and oklch() resolve.
    const rgb = await page.evaluate((c) => {
      const cv = document.createElement('canvas')
      cv.width = cv.height = 1
      const x = cv.getContext('2d')
      x.fillStyle = '#000'
      x.fillStyle = c
      x.globalCompositeOperation = 'copy'
      x.fillRect(0, 0, 1, 1)
      const d = x.getImageData(0, 0, 1, 1).data
      return [d[0], d[1], d[2], d[3] / 255]
    }, info.color)

    await el.evaluate((e) => (e.style.visibility = 'hidden'))
    await page.waitForTimeout(120)
    const buf = await page.screenshot({ clip: box })
    await el.evaluate((e) => (e.style.visibility = ''))

    const { PNG } = await import('pngjs')
    const png = PNG.sync.read(buf)
    let lo = 1
    let hi = 0
    let loPx = null
    let hiPx = null
    for (let i = 0; i < png.data.length; i += 4) {
      const l = lum(png.data[i], png.data[i + 1], png.data[i + 2])
      if (l < lo) { lo = l; loPx = [png.data[i], png.data[i + 1], png.data[i + 2]] }
      if (l > hi) { hi = l; hiPx = [png.data[i], png.data[i + 1], png.data[i + 2]] }
    }

    // Semi transparent text blends with whatever is behind it.
    const blend = (bg) => [0, 1, 2].map((k) => rgb[k] * rgb[3] + bg[k] * (1 - rgb[3]))
    const rDark = ratio(lum(...blend(loPx)), lo)
    const rLight = ratio(lum(...blend(hiPx)), hi)
    const worst = Math.min(rDark, rLight)
    const large = info.size >= 24 || (info.size >= 18.66 && info.weight >= 700)
    const need = large ? 3 : 4.5
    const ok = worst >= need
    if (!ok) fails++
    console.log(
      `  ${ok ? 'PASS' : 'FAIL'} ${name}: worst ${worst.toFixed(2)} (need ${need}) ` +
        `${info.size}px/${info.weight}  [darkest spot ${rDark.toFixed(2)}, lightest spot ${rLight.toFixed(2)}]`,
    )
  }
  await page.close()
}

await browser.close()
console.log(`\nOVER-IMAGE FAILURES: ${fails}`)
process.exit(fails > 0 ? 1 : 0)
