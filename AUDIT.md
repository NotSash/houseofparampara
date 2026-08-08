# House of Parampara: audit

Read every file. 2,496 lines across 27 files. Findings ordered by what costs
the business money, not by what is easiest to fix.

**Method note:** everything below was measured, not assumed. Where I nearly
reported something wrongly, it is recorded as such.

---

## The honest summary first

**This is a good site.** The writing is genuinely strong, the structure is
sensible, and the technical foundation is clean: `next/image` used everywhere
with zero raw `<img>` tags, alt text on all 11 images, reduced motion respected
in 10 places, and a real content layer so text can be edited without touching
components.

It has three problems: **it is extremely heavy, it cannot be found on Google,
and it stops short of actually taking an order.**

---

## BLOCKERS: these cost sales today

### B1. The site ships 58 MB of images, and optimisation is switched off

`next.config.mjs` sets `images: { unoptimized: true }`. Next.js would normally
convert to WebP and resize per device. That is disabled, so every PNG ships at
full size.

Measured:

| | Size |
| --- | --- |
| Total `public/images` | **58 MB** |
| Above the fold (hero + emblem) | **3.1 MB** |
| Heaviest single file | 2.1 MB |
| Files over 1 MB | most of 39 |

**The favicon is a 2 MB PNG.** It loads on every page view, in every tab.

This audience is on Indian mobile data. 3.1 MB before a single word is readable
is roughly 10 to 20 seconds on a slow 4G connection. Most people leave.

**Fix:** remove `unoptimized: true`, convert to WebP, generate a real favicon
at 32px. Expect the above-fold weight to drop from 3.1 MB to under 200 KB.
Nothing about the design changes.

### B2. `typescript: { ignoreBuildErrors: true }`

Type errors cannot fail the build. On a site where prices are calculated, a
type error is a wrong number in a customer's WhatsApp message.

### B3. There is no way to place an order, only to start a conversation

Every path ends at WhatsApp: 8 `waLink` calls, 2 Instagram links, no other
destination. That is a legitimate choice for a small business, and for a first
version it is probably right.

But it means: no order record, no payment, no confirmation, and someone must
manually reply to every enquiry. **The site is a brochure with a calculator
attached.** Worth deciding deliberately rather than by default.

---

## HIGH: these limit growth

### H1. The site cannot be found

- `metadataBase` points at **`https://houseofparampara.example`**, a
  placeholder domain that does not exist. Every canonical URL and Open Graph
  image resolves to nothing, so **link previews on WhatsApp and Instagram will
  be broken**, which matters enormously for a business that lives on those two
  channels.
- No `sitemap.xml`, no `robots.txt`.
- No structured data. A gifting business should have `Product` and
  `LocalBusiness` schema so Google can show prices and location.
- `generator: 'v0.app'` is still in the metadata, announcing the site was
  generated.

### H2. Single page, so there is nothing to rank

Everything is one route with anchor links. Five collections and eight hampers
all live at `/`. Someone searching "wedding return gifts Tamil Nadu" has no
page to land on.

**Each collection deserves its own URL.** This is the single biggest
opportunity on the site, and the content to fill those pages already exists.

### H3. No trust signals anywhere

Grep found no testimonials, no photographs of real work, no delivery
information, no returns policy, no pricing explanation beyond item totals.

For a new business asking for money, the unanswered questions are: has anyone
else bought this, when will it arrive, what if it breaks, do you deliver to my
city. **Missing answers are why people close the tab.**

### H4. No minimum order or bulk pricing

The builder computes a per-hamper total. But return gifts are bought in
quantities of 50 to 200 for weddings. There is no quantity input, no bulk
discount, no minimum order value. **The highest-value customer cannot express
what they want to buy.**

---

## MEDIUM

### M1. 37 em dashes across 12 files

Already on the list as item 3. Concentrated in `lib/data.ts` (14).

### M2. `maximumScale: 5` in the viewport

Caps how far a user can zoom. It is above the accessibility minimum, so not a
violation, but there is no reason to limit it at all.

### M3. No 404 page, no loading states, no error boundary

Any route other than `/` gets the Next.js default. Nothing exists for a failed
image or a slow connection.

### M4. Analytics only in production, and only Vercel

Fine, but there is no event tracking. **Nobody knows how many people open the
builder, or how many reach WhatsApp.** Without that, every future design
decision is a guess.

---

## Corrections to my own findings

Recorded because I nearly reported both as defects:

- **"No `<h1>` on the site"** — false. There is one, in `hero.tsx`, written as
  `<motion.h1>` so a naive grep for `<h1` misses it. Heading order is correct:
  one h1, then h2s, then h3s.
- **"The builder lets you send an empty hamper"** — false. Both WhatsApp CTAs
  are disabled at `selectedItems.length === 0`.

---

## What is genuinely good, and should not be touched

- **The writing.** "Small boxes, full of big memories" is better copy than most
  funded startups manage. The emotional positioning is the product.
- **`lib/data.ts`.** 5 collections, 8 hampers, 24 items, all editable in one
  file with a comment explaining it is for the business owner. Genuinely
  thoughtful.
- **Accessibility foundations.** Alt text everywhere, reduced motion in 10
  places, `focus-visible` styles present.
- **`next/image` everywhere.** Zero raw `<img>`. The optimisation is only
  disabled by config, so B1 is a one-line fix.
- **The hamper builder concept.** Interactive pricing that composes a WhatsApp
  message is smart, and it is the one thing here a competitor does not have.

---

## Suggested order

1. **B1 image weight** — biggest impact, lowest risk, no design change
2. **Placeholders and em dashes** (items 2 and 3 on the user's list)
3. **H1 metadata** — real domain, sitemap, remove the generator tag
4. **The redesign** (items 1 and 4)
5. **H2 collection pages** — the growth unlock, but a bigger change
6. **H3/H4 trust and bulk** — needs decisions from the business owner
