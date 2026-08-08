// Walk the page by keyboard and check every focus ring.
//
//   npx next start -p 3915
//   export LD_LIBRARY_PATH=$HOME/.localroot/root/usr/lib/x86_64-linux-gnu
//   node scripts/focus-audit.mjs
//
// WHY. A focus ring is the only way a keyboard user knows where they are. It
// must be present, at least 2px, and visible against whatever is behind it.
//
// TRAP THIS SCRIPT ALREADY CAUGHT: Tailwind's utility layer sets outline-color
// to currentColor. A rule inside @layer base loses to it, so the nav links
// rendered a WHITE 3px ring on a near-white bar. Every numeric property was
// correct; only the resolved colour was wrong. Check the resolved colour, not
// the declaration.

import { chromium } from 'playwright'

const URL = process.env.URL ?? 'http://localhost:3915/'
const MIN_WIDTH = 2
const MIN_CONTRAST = 3

const srgb = (c) => {
  c /= 255
  return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
}
const lum = ([r, g, b]) => 0.2126 * srgb(r) + 0.7152 * srgb(g) + 0.0722 * srgb(b)
const contrast = (a, b) => {
  const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x)
  return (hi + 0.05) / (lo + 0.05)
}

const browser = await chromium.launch()
let fails = 0

for (const [vw, label] of [[1440, 'desktop'], [390, 'mobile']]) {
  const page = await browser.newPage({ viewport: { width: vw, height: 900 }, reducedMotion: 'reduce' })
  await page.goto(URL, { waitUntil: 'load' })
  await page.waitForTimeout(1200)
  console.log(`\n=== ${label} ${vw}px ===`)

  const seen = new Set()
  let checked = 0
  for (let i = 0; i < 40; i++) {
    await page.keyboard.press('Tab')
    await page.waitForTimeout(60)
    const r = await page.evaluate(() => {
      const e = document.activeElement
      if (!e || e === document.body) return null
      const cs = getComputedStyle(e)
      const cv = document.createElement('canvas')
      cv.width = cv.height = 1
      const x = cv.getContext('2d')
      const px = (c) => {
        x.fillStyle = '#000'
        x.fillStyle = c
        x.globalCompositeOperation = 'copy'
        x.fillRect(0, 0, 1, 1)
        const d = x.getImageData(0, 0, 1, 1).data
        return [d[0], d[1], d[2], d[3] / 255]
      }
      // What sits immediately behind the ring: the nearest opaque ancestor.
      let bg = [255, 255, 255, 1]
      for (let n = e; n; n = n.parentElement) {
        const c = px(getComputedStyle(n).backgroundColor)
        if (c[3] > 0.5) { bg = c; break }
      }
      const box = e.getBoundingClientRect()
      return {
        id: e.tagName + ':' + (e.textContent || e.getAttribute('aria-label') || '').trim().slice(0, 34),
        width: parseFloat(cs.outlineWidth),
        style: cs.outlineStyle,
        ring: px(cs.outlineColor),
        inner: px(cs.getPropertyValue('--focus-inner').trim() || '#ffffff'),
        bg,
        h: box.height,
        w: box.width,
      }
    })
    if (!r) break
    if (seen.has(r.id)) break
    seen.add(r.id)
    checked++

    // The ring is two-tone: an inner keyline plus the gold outline. It passes
    // if EITHER tone clears 3:1 against what is behind it, because both are
    // drawn and the eye only needs one of them to separate.
    const c = Math.max(contrast(r.ring, r.bg), contrast(r.inner, r.bg))
    const problems = []
    if (r.style === 'none' || r.width < MIN_WIDTH) problems.push(`ring ${r.width}px ${r.style}`)
    if (c < MIN_CONTRAST) problems.push(`ring contrast ${c.toFixed(2)} (need ${MIN_CONTRAST})`)
    if (problems.length) {
      fails++
      console.log(`  FAIL ${r.id}  ${problems.join(', ')}`)
    }
  }
  console.log(`  walked ${checked} focusable elements`)
  await page.close()
}

await browser.close()
console.log(`\nFOCUS FAILURES: ${fails}`)
process.exit(fails > 0 ? 1 : 0)
