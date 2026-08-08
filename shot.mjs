// Screenshot the running site and report genuinely broken images.
//
//   npx next build && npx next start -p 3300
//   export LD_LIBRARY_PATH=$HOME/.localroot/root/usr/lib/x86_64-linux-gnu
//   node shot.mjs
//
// TRAP 1: the Chromium binary does not survive a workspace clear, but the
// ~/.localroot system libs do. After reinstalling Chromium the versioned .so
// files exist WITHOUT their .so.N symlinks, so it fails with
// "libatk-1.0.so.0: cannot open shared object file". Recreate the symlinks in
// ~/.localroot/root/usr/lib/x86_64-linux-gnu first.
//
// TRAP 2: images below the fold are lazy-loaded. A naive broken-image check
// reports about 11 false positives. Scroll the whole page before measuring.
//
// TRAP 3: the story section seal is `hidden sm:block`, so on mobile it never
// loads. That is CORRECT. Zero-size images with a display:none ancestor are
// filtered out below rather than reported.
//
// TRAP 4: never put a glob containing a star followed by a slash inside a
// block comment here. It closes the comment and the script fails to parse.

import { chromium } from 'playwright'

const URL = process.env.URL ?? 'http://localhost:4220/'
const browser = await chromium.launch()

for (const [name, viewport, dpr] of [
  ['desktop', { width: 1440, height: 900 }, 1],
  ['mobile', { width: 390, height: 844 }, 2],
]) {
  const page = await browser.newPage({ viewport, deviceScaleFactor: dpr })
  await page.goto(URL, { waitUntil: 'load' })
  await page.waitForTimeout(2000)
  await page.screenshot({ path: `/tmp/${name}-hero.png` })

  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 500) {
      window.scrollTo(0, y)
      await new Promise((r) => setTimeout(r, 150))
    }
  })
  await page.waitForTimeout(4000)
  await page.screenshot({ path: `/tmp/${name}-full.png`, fullPage: true })

  const broken = await page.evaluate(() =>
    [...document.querySelectorAll('img')]
      .filter((i) => !i.complete || i.naturalWidth === 0)
      .filter((i) => {
        // Deliberately hidden images never load. Not a defect.
        let el = i.parentElement
        while (el) {
          if (getComputedStyle(el).display === 'none') return false
          el = el.parentElement
        }
        return true
      })
      .map((i) => i.currentSrc || i.src),
  )
  const total = await page.evaluate(() => document.querySelectorAll('img').length)
  console.log(`${name}: ${broken.length} genuinely broken of ${total}`)
  for (const u of broken) console.log('   ', u.slice(-70))
  await page.close()
}

await browser.close()
