// Every link that claims to open a collection must actually open it.
//
//   npx next start -p 4200
//   export LD_LIBRARY_PATH=$HOME/.localroot/root/usr/lib/x86_64-linux-gnu
//   node scripts/deeplink-audit.mjs
//
// WHY THIS EXISTS. "Build from this collection" on every card, and the
// collection list in the footer, both used to be plain `#builder` and
// `#collections` anchors. They scrolled to the section, which always showed
// the FIRST collection. Clicking that link on collection 4 silently handed you
// collection 1, so the link actively lied. Nothing caught it, because the
// scroll worked and the page looked fine.
//
// The links are now `#builder=<collection-id>` and a handler in the builder
// selects the matching collection.
//
// TRAP: do not hardcode the collection ids here. Read them from the links the
// page actually renders, so adding or renaming a collection cannot leave this
// check silently passing against a stale list.
//
// TRAP 2: the collection chip row is HIDDEN when only one collection is
// published, because a row containing a single button that does nothing reads
// as a broken control. This check used to require a chip and so failed against
// a correct page. What actually matters is that the builder is showing the
// right collection, which the summary line states either way. The chip is only
// checked when a chip row exists.

import { chromium } from 'playwright'

// NOTE: not called `URL`. That shadows the global URL constructor and the
// script dies with "URL is not a constructor" halfway through.
const BASE = process.env.URL ?? 'http://localhost:4200/'
const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' })

await page.goto(BASE, { waitUntil: 'load' })
await page.waitForTimeout(1200)

// Collect every deep link on the page, from both the footer and the cards.
await page.evaluate(async () => {
  for (let y = 0; y < document.body.scrollHeight; y += 500) {
    window.scrollTo(0, y)
    await new Promise((r) => setTimeout(r, 90))
  }
})
await page.waitForTimeout(600)

const links = await page.evaluate(() =>
  [...document.querySelectorAll('a[href^="#builder="]')].map((a) => ({
    href: a.getAttribute('href'),
    // The card link says "Build from this collection", so the collection name
    // has to come from the card heading rather than the link text.
    label: (a.closest('article')?.querySelector('h3')?.textContent || a.textContent || '').trim(),
    where: a.closest('footer') ? 'footer' : 'card',
  })),
)

console.log(`found ${links.length} deep links`)
let fails = 0

for (const l of links) {
  await page.goto(new URL(l.href, BASE).href, { waitUntil: 'load' })
  await page.waitForTimeout(1300)
  const selected = await page.evaluate(() => {
    // Only the chips in the collection row, not the item toggles, which also
    // carry aria-pressed.
    const row = document.querySelector('#builder .flex.flex-wrap.justify-center')
    const chip = row?.querySelector('button[aria-pressed="true"]')
    return {
      hasChipRow: Boolean(row),
      chip: chip ? chip.textContent.trim() : null,
      summary: document.querySelector('#builder h3 + p')?.textContent.trim() ?? null,
    }
  })
  const chipOk = !selected.hasChipRow || selected.chip === l.label
  const ok = chipOk && selected.summary === l.label
  if (!ok) {
    fails++
    console.log(`  FAIL ${l.where} link ${l.href}`)
    console.log(
      `       expected "${l.label}", builder shows summary "${selected.summary}"` +
        (selected.hasChipRow ? ` and chip "${selected.chip}"` : ' (no chip row, single collection)'),
    )
  } else {
    console.log(`  PASS ${l.where.padEnd(6)} ${l.href} opens "${l.label}"`)
  }
}

await browser.close()
console.log(`\nDEEP LINK FAILURES: ${fails}`)
process.exit(fails > 0 ? 1 : 0)
