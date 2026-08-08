# House of Parampara: phase plan

One phase per conversation. Findings and reasoning in `AUDIT.md`.

---

## THE ROUTINE, every conversation without exception

**BEFORE TOUCHING ANY CODE:**

1. **Read `/home/user/_for-myself/skills/ui-rules.md` in full, and say in the
   reply that it was read.** Not "if it seems relevant". Any visual change at
   all, including a one-line CSS tweak. Skipping this is how deliberate
   decisions get logged as defects and intentional choices get "fixed".
2. Read `AUDIT.md` and this file. Never rely on remembered context.
3. Restore the environment. `node_modules` does not survive workspace
   snapshots: `npx --yes pnpm@10.14.0 install --frozen-lockfile`

**IMPORTANT about ui-rules.md:** its "Rules we already satisfy" section
describes **VulnSight**, a dark security tool, not this site. Contrast, touch
targets and focus rings were measured there and **do not transfer**. Re-measure
here before believing any of it.

**WHILE WORKING:**

- **Measure, do not assume.** Screenshot, grep the built CSS, count the pixels.
  Several confident suspicions on the last project were disproved by checking.
  This audit already produced two: the missing `<h1>` and the empty-hamper bug
  both turned out to be false.
- **Write the defect down before fixing it.** Not while looking at it.
- **Prove every new test can fail** by breaking the thing on purpose, then
  restoring it. A green test that has never been watched go red is not
  evidence.
- **Numeric checks are not enough for motion.** Every duration on VulnSight was
  correct while the animation was invisible. Measure the frame-by-frame curve,
  or ask the user to look.

**END OF EVERY CONVERSATION:**

- Update this file. Rewrite the relevant lines, never append a diary.
- Leave the build green: `pnpm build` must pass.
- Say honestly what is done and what is not. Do not tick a box early.

---

## Phase 0: audit — DONE

Read all 2,496 lines across 27 files. `AUDIT.md` holds 3 blockers, 4 high, 4
medium, plus two corrections where I nearly reported a non-defect.

---

## Phase 1: weight and correctness — DONE

**Measured over the wire on a running production build:**

| | Before | After |
| --- | --- | --- |
| Above the fold (phone, 390px) | **3,131 KB** | **18.6 KB** |
| Hero image | 1,156,446 bytes | 13,140 bytes (AVIF) |
| Favicon | 2,001 KB | 1.8 KB |
| All 23 images on the page | n/a | 721 KB |

**168x smaller above the fold, 99.4% saved.** Target was under 300 KB.

- [x] Removed `images: { unoptimized: true }`, enabled AVIF and WebP.
- [x] Did NOT bulk-convert the source PNGs. Unnecessary once the optimiser is
      on: Next converts, resizes and caches on demand. Converting by hand would
      have added 39 files to maintain for no gain.
- [x] Favicon: the emblem was a **2,001 KB, 1024x1024 PNG rendered at 48 to
      52px**, used in the nav, the footer, every section eyebrow, AND as the
      favicon on every page view in every tab. Now `emblem-32.png` (1.8 KB) for
      the tab, `emblem-192.png` (42 KB) for the UI, and a flattened
      `apple-touch-icon.png` because iOS composites transparency onto black.
- [x] Removed `typescript: { ignoreBuildErrors: true }`. **Build passes clean**,
      so nothing was being hidden.
- [x] Added missing `sizes` to two `fill` images (`closing-cta`, `story`).
      Without it next/image assumes 100vw at every breakpoint. Swept every
      `<Image fill>` to confirm none remain.
- [x] Moved 20 unused design screenshots (7.6 MB) out of the repo root into
      `docs/design-references/`. Verified none were referenced; the root
      `hero.png` was a different file from `public/images/hero.png`.

**Not verified:** no browser in this workspace, so I could not screenshot.
Structural checks pass (all 23 images return 200, icons wired, no raw PNGs
bypassing the optimiser) but **a human should confirm it still looks right.**

---

## Phase 2: placeholders and copy — DONE

**Images**

- [x] One placeholder for everything: `public/images/placeholder.svg`, **1,695
      bytes**. SVG rather than PNG so it scales to any size from one file and
      cannot reintroduce the weight problem Phase 1 fixed.
- [x] 28 product images in `lib/data.ts` plus 10 section images in components,
      all repointed. Alt text updated to match.
- [x] **Deleted all 38 unused images. `public/images`: 58 MB to 92 KB.**

**Measured bug found by looking, not by building.** The hero overlay was tuned
for a dark photograph. Against a pale placeholder the hero text measured
**3.13:1**, which scrapes past the large-text threshold and **fails for body
copy**. Darkened the placeholder: now **13.93:1**, passing both.

**Names and prose**

- [x] Collection 1-5, Hamper 1-7, Product 1-23. Counts verified against
      `tagline`, `packagingFee` and `defaultChecked` rather than trusting the
      rename script. (The audit's "8 hampers, 24 items" was wrong: it counted
      the TypeScript type declarations at the top of the file.)
- [x] 23 item descriptions, 5 taglines, 5 collection intros, 7 hamper intros,
      all placeholder. No real product prose remains in `lib/data.ts`.

**Em dashes**

- [x] **All 30 user-facing em dashes removed**, across `lib/data.ts` and 9
      components. Each replaced individually: a blanket swap to commas creates
      run-ons and a blanket swap to colons reads like documentation. The 7 that
      remain are code comments, which never reach a visitor.
- [x] `scripts/check-copy.mjs` guards against regression. It strips comments
      before checking, so comments stay exempt.
- [x] **Proved failable in both directions:** reintroducing a dash in real copy
      exits 1 with the file and line; a dash in a comment still exits 0.

---

## Phase 3: findability — DONE

Domain: **`https://houseoofparampara.vercel.app`** (temporary Vercel, real one
not bought yet). Note the double o; verified live, returns 200. The single-o
spelling 404s, so this is not a typo.

- [x] **Fixed `metadataBase`.** It pointed at `houseofparampara.example`, which
      does not exist, so every canonical URL and Open Graph image resolved to
      nothing. **Link previews on WhatsApp and Instagram were broken**, which
      for this business is the two channels that matter most. Verified fixed:
      `og:url`, `og:image` and `canonical` all now resolve to the live domain.
- [x] **Created a real Open Graph image.** After Phase 2 this pointed at
      `placeholder.svg`, and **no major social platform renders an SVG
      preview**, so a shared link would have shown no image at all.
      `og-image.png` is 1200x630 (the size WhatsApp, Instagram, Facebook and X
      expect) and 3.6 KB.
- [x] Removed `generator: 'v0.app'`.
- [x] Added Twitter card, `og:site_name`, `og:locale: en_IN`, keywords,
      explicit `robots`, and a canonical URL.
- [x] `app/sitemap.ts` and `app/robots.ts`. Both build as real routes and were
      fetched to confirm their contents.
- [x] `components/structured-data.tsx`: `LocalBusiness` JSON-LD, parsed back
      out of the served HTML to confirm it is valid.

**One decision worth keeping:** the structured data asserts only facts that are
actually true. No street address, no opening hours, no precise price range,
because those have not been decided. **Inventing them would be worse than
omitting them**: a wrong address sends a real customer to the wrong place, and
fabricated markup can get penalised.

**`SITE_URL` is a single constant in `app/layout.tsx`.** When the real domain
is bought, that line plus the two in `sitemap.ts` and `robots.ts` are the only
changes needed.

---

## Phase 4: the redesign

The user's items 1 and 4, and the largest piece of work. Split across several
conversations. **Read `ui-rules.md` before each one.**

### 4A. Establish a motion vocabulary — DONE

**Measured before:** seven Framer durations (0.9 x4, 0.85, 0.8, 0.7 x2, 0.35,
0.3, 0.2), two easing curves used interchangeably with no rule, and reactive
elements running at 500 to 700ms.

- [x] `lib/motion.ts` and matching CSS custom properties in `globals.css`.
      Two curves with assigned meanings, five durations, one stagger, one exit
      ratio. Two sources is not ideal, but Framer cannot read a custom property
      at keyframe time, so the alternative is worse.
- [x] **The real bug: reactive motion was far too slow.** Card hover was
      **500ms** and image zoom **700ms**. ui-rules caps micro-interactions at
      300ms, and a card that takes 700ms to acknowledge a pointer feels broken
      rather than elegant. **Measured in the browser after the fix: 240ms and
      400ms.**
- [x] Every magic number replaced with a token. Verified none remain.
- [x] Curves given jobs. `EASE` (0.22, 1, 0.36, 1) is the default for anything
      arriving or watched changing size. `EASE_EXIT` (0.16, 1, 0.3, 1) is the
      strong expo-out, for things leaving and for the hero entrance only.
- [x] `EXIT_RATIO = 0.65` with `exitDuration()`, so exits cannot drift out of
      the 60 to 70% band by hand-tuning.

**The hero deliberately stays slow** at 900ms. It is content revealing itself,
nothing is waiting on it, and the unhurried arrival suits the brand. That is
the documented exception to the 300ms rule, not a violation of it.

**Type checking earned its keep.** An import landed in three files but not the
fourth (hero.tsx uses double quotes, my patch assumed single), and the build
caught it immediately. Before Phase 1 that error was suppressed.

### 4B. Typography and spacing — DONE

**Audited by measuring computed styles in a real browser at 1440 and 390.**

**Already good, deliberately not touched:** Playfair Display for headings with
Lato for body is a sound pairing. The scale is coherent (72/60/48/24/20/18
display, 18/16/14 body) and the hero h1 clamps 72 to 41.6 on mobile, which is
correct responsive behaviour. Headings measure 19 to 25 characters per line,
which is right for display type; recorded so nobody later "fixes" it by making
them wider.

- [x] **Raised five pieces of real product copy from 12px to 14px**: the item
      description and sticky-bar summary in the builder, the checkout
      footnote, collection tag pills, and the hero trust line. The
      wedding-gift buyer skews older, and 12px on a phone is genuine work to
      read.
- [x] Raised the 10px scroll cue to 12px.
- [x] **Left the remaining small text alone after checking what it was.** The
      12px instances are section eyebrows, decorative numerals ("No. 01") and
      the copyright line: labels, not copy anyone reads. Raising those would
      flatten the hierarchy for no gain.
- [x] **Found the cause of inconsistent line-heights.** A global
      `p { line-height: 1.75 }` was fighting every `leading-*` utility, which
      is why identically sized text measured 1.50 in one place and 1.63 in
      another. Set to 1.6: still generous, but tight enough that a three line
      paragraph reads as one block.

**Defect found by looking, not by building.** The placeholder SVG carried a
"Photograph coming soon" caption. Fine on a product card, but the same file is
the full-bleed hero background, where it scaled to enormous and **collided with
the hero copy**. Removed the caption entirely: the box glyph says "image goes
here" at any size, and a placeholder should never compete with real content.

### 4C. Colour, contrast, depth

- [x] **Measure contrast on a canvas**, not by eye. 85 tokens exist in
      `globals.css`, none verified on this site
- [x] Check both light and dark themes
- [x] Colour must never be the only carrier of meaning

**Result.** Three audit scripts now exist, each proved able to fail:

| Script | Command | What it measures |
| --- | --- | --- |
| `scripts/contrast-audit.mjs` | `pnpm check:contrast` | Every text node, both themes, 1440 and 390 |
| `scripts/image-contrast-audit.mjs` | `pnpm check:contrast-image` | Text sitting on a photograph |
| `scripts/focus-audit.mjs` | `pnpm check:focus` | Keyboard walk, ring width and ring contrast |
| `scripts/builder-audit.mjs` | `pnpm check:builder` | Tap targets, sticky bar, press states, tab timing |
| `scripts/mobile-audit.mjs` | `pnpm check:mobile` | Whole page at 360, 390, 430: taps, gaps, text size, overflow |

Measured before: **152 text failures** across the two themes. Now **0 of 253**
measurable text nodes fail, 0 over-image failures, 0 focus failures.

Colour changes, all measured, not chosen by eye:

- `--muted-foreground` light `#857467` to `#6b5d52`. Was 4.48:1 on a card,
  under the 4.5 line, and it carries most of the body copy on the page.
- `--accent` light `#b08641` to `#8a6522`. Was 3.32:1 as text.
- Added `--primary-ink`, a text-weight version of the brand colour, separate
  from the fill colour. Dark theme was using one value for both: `#b9543a`
  measured 3.62:1 as text on a card AND only 4.28:1 behind white button text.
  Now `#a8462c` fills and `#e08768` writes, 5.3:1 and 6.5:1.
- The eyebrow labels followed the raw `--gold`, which failed in light at
  3.21:1. They now follow `--accent`.
- Hero CTA `#b9543a` to `#a8462c`.
- The "No. 01" collection badge went from 9.6px on `bg-black/35` (2.26:1) to
  12px on `bg-black/65`.
- The nav strapline went from 9.92px `gold-soft/90` (1.37:1) to 11.2px `gold`.

**Defect found by measuring, not by looking:** the hero scroll cue was
**2.25:1**. It is pale text positioned at `bottom-6`, which puts it inside the
128px white fade at the bottom of the hero, so light text was sitting on a
light wash. Moved to `bottom-36`, clear of the fade. Now 8.87:1.

**Defect found by looking, not by measuring:** the focus ring rendered as a
**square around a pill button**. `border-radius: inherit` overwrote the
button's own radius. Every number in the focus audit was green while this was
on screen. Removed the line; outline already follows the element shape.

**Defect found in the built CSS:** the focus ring was **white on a near-white
nav bar**. Tailwind's utility layer sets `outline-color` to `currentColor` and
beat the rule I had put inside `@layer base`. Resolved colour measured
`rgba(255,255,255,0.85)` while the declaration said `var(--ring)`. The rule now
lives outside `@layer base`. The ring is two-tone, an inner keyline in
`--focus-inner` plus the gold outline, so it survives landing on a pale page or
on a dark filled button.

**Colour is no longer the only carrier of meaning.** The selected collection
and the selected hamper in the builder were signalled by fill colour alone.
Both now carry a tick glyph, a semibold weight, and `aria-pressed`.

### 4D. The hamper builder

The one thing a competitor does not have, and the only interactive surface.

- [x] Make selection feel physical: real press states, immediate feedback
- [x] Animate the running total, since it is the number people watch
- [x] Smooth the collection and hamper tab switches
- [x] Verify it is genuinely usable one-handed on a phone

**Result.** `scripts/builder-audit.mjs`, run with `pnpm check:builder`. Six
checks, every one of them proved able to go red. Measured before: **7
failures**. Now 0.

**The worst defect on the site so far: the mobile order bar never appeared.**
It measured at y=912 inside an 844px viewport, so it was permanently below the
fold. Cause: `overflow-hidden` on the builder section makes `position: sticky`
inert on every descendant. It was clipping nothing at all, measured at 0px
overflow on both sides. On a phone, which is where the Instagram traffic lands,
the running total and the order button were simply not reachable without
scrolling to the bottom of the page.

Also fixed:

- **Tap targets.** Collection chips were 38px and hamper chips 34px, both under
  the 44px minimum. Now `min-h-11`. Gaps were already 8px.
- **No press state at all** on the item cards. `transform` stayed `none` on
  pointer down, so a tap produced no acknowledgement other than the tick. All
  three control types now press. Everything is paired with
  `motion-reduce:active:scale-100`.
- **Tab switches took 831ms to settle.** `AnimatePresence mode="wait"` runs the
  exit and then the entrance, so a nominal 400ms became 800ms of waiting on
  every tab press, far past the 300ms point where an interface stops feeling
  responsive. The exit now runs at the 65% ratio on the departing curve, the
  entrance at `DUR_BASE`. Measures 458 to 488ms end to end.
- **The total now counts** instead of swapping. New `components/animated-price.tsx`.
  It counts over `DUR_BASE` (240ms) on an ease-out cubic, cancels a count in
  progress when you tap again, and honours `prefers-reduced-motion` by not
  counting at all. The previous version was a keyed fade that destroyed and
  recreated the number, so the old figure disappeared before the new one
  arrived and nothing linked the tap to the result.

**Defect found by looking, which every green number missed:** the floating
WhatsApp button sat directly on top of the builder's own "Order" button and
covered the word. Two round WhatsApp buttons, same bottom-right corner. The FAB
now stands down while the order bar is on screen, via an IntersectionObserver.
The audit gained an overlap check afterwards, so this class of defect is
measured from now on.

**Two of my own checks were wrong and were caught by breaking them.** The
press-state check read `transform`, but Tailwind v4 compiles `scale-[0.98]` to
the standalone `scale` property, so a working press state reported as broken.
The overlap check ran before the floating button's 600px scroll threshold, so
it passed because the button was absent rather than because nothing overlapped.
Neither would have been found without deliberately breaking the code first.

### 4E. Mobile

Most of this traffic will arrive from an Instagram link on a phone.

- [x] Measure tap targets: **44px minimum, 8px gaps**
- [x] Test at 360, 390 and 430px wide
- [x] Body text never below 16px, or iOS zooms the page on focus

**Result.** `scripts/mobile-audit.mjs`, run with `pnpm check:mobile`. Checks
tap targets, gaps, prose size and horizontal overflow at 360, 390 and 430.
Measured before: **144 failures**. Now 0 across all three widths, 51 controls
checked at each. All four checks proved able to go red.

Real defects fixed:

- **The carousel dots were 8x8px.** The single hardest thing on the site to
  hit with a thumb, and there are five of them per row. The visible dot is
  still 8px, because a bigger dot would dominate the row, but the button
  around it is now 44px square with the padding pulled back out of the layout
  so the row keeps its height. They also gained `aria-current`.
- **Footer social icons were 40x40**, just under the line. Now 44.
- **The Instagram handle link was 131x20.** It looks identical, but it now has
  a 44px tap height.
- **Body prose was 14px on phones** in five places: pillar descriptions,
  collection intros, product descriptions, packaging descriptions and the
  footer blurb. Raised to 16px on phones only, staying at 14px from `sm:` up
  where the column is narrower relative to the text.
- **The footer colophon was 12px.** Raised to 14px.

**On the 16px rule, honestly.** The usual argument for it is that iOS Safari
zooms the page when you focus an input under 16px. **This site has no form
inputs**, so that argument does not apply here and I am not going to pretend it
does. The reason to raise the text is simply that 14px body copy on a phone is
tiring to read. The footer colophon is exempted at 14px and tagged
`data-audit="colophon"` so the exemption is visible in the code rather than
hidden by quietly lowering the threshold for the whole site.

**Three false positives in my own audit, found and fixed before trusting it:**
a decorative glow positioned off the edge inside an `overflow-hidden` parent is
clipped by the browser and scrolls nothing; button captions and italic serif
taglines are not body prose; and the hero trust strip is chips, not sentences.
Reporting those would have buried the fifteen real findings under a hundred
lines of noise.

---

## Phase 5: what is missing

The user's item 5. Needs business decisions, not just code.

- [ ] **Quantity and bulk pricing.** Return gifts sell in 50 to 200 units for
      weddings. There is no quantity input, so **the highest-value customer
      cannot express what they want to buy.**
- [ ] **Trust signals.** No testimonials, no delivery information, no returns
      policy. For a new business asking for money, these absences are why
      people close the tab.
- [ ] **Per-collection pages.** Everything is one route, so there is nothing to
      rank. The content for five pages already exists.
- [ ] **Event tracking.** Nobody currently knows how many people open the
      builder or reach WhatsApp, so every design decision after this is a
      guess.
- [ ] 404 page, loading states, error boundary

**Questions for the business owner:** real domain, whether orders should ever
leave WhatsApp, delivery areas and timelines, whether bulk enquiries are
wanted.

---

## Phase 6: verification

- [ ] Build green, no type errors suppressed
- [ ] Lighthouse on mobile, before and after recorded
- [ ] Accessibility pass, measured not assumed
- [ ] Both themes, all breakpoints
- [ ] Ask the user to look, because they have twice caught real defects that
      passing tests missed

---

## Copy and imagery pass (owner requested)

Four wording changes, one behaviour change, four real photographs.

### Wording

| Where | Was | Now |
| --- | --- | --- |
| Closing headline | Some things should never be forgotten | Some bonds are timeless |
| Footer tagline | Heritage keepsakes and curated hampers that carry the rituals, flavours and stories of home, thoughtfully made and gently passed on | Thoughtful gifts rooted in tradition, made to carry memories from one generation to the next |
| Section eyebrow, nav, footer | Why Parampara | Why House of Parampara |

The closing headline now echoes the strapline already sitting under the logo in
the nav, so the page opens and closes on the same phrase.

### The collection links were lying

**Defect.** Both "Build from this collection" on each card and the collection
list in the footer were plain `#builder` and `#collections` anchors. They
scrolled to the right place but the builder always showed the FIRST collection.
Clicking "Build from this collection" on Collection 4 silently gave you
Collection 1. The scroll worked and the page looked correct, so nothing caught
it.

Links are now `#builder=<collection-id>` and the builder selects the matching
collection on load and on `hashchange`. A hash rather than a query string keeps
it a same-page anchor with no navigation, and keeps the link meaningful if
someone copies it to a friend.

`scripts/deeplink-audit.mjs`, `pnpm check:deeplink`. Reads the ids from the
links the page actually renders rather than a hardcoded list, so adding a
collection cannot leave it passing against a stale set. **10 links verified, 5
cards and 5 footer.** Proved failable: reverting the handler produced exactly
the original bug, 4 of 5 landing on Collection 1.

### Photographs

The four "Why House of Parampara" cards were all the grey placeholder. They now
carry real images matched to the existing alt text and the site's warm palette:
jasmine on a red threshold beside a kolam, betel leaves passing between two
generations of hands, a grandmother and grandchild, and a wax-sealed fabric
parcel. Cropped to the card's 4:3 and sized 800x600, which covers the ~300px
render at 2x with nothing wasted. **416 KB for all four.**

These are generated images, not photographs of real stock. They are a
convincing stand-in for launch and should be replaced with real product and
lifestyle photography when it exists.

### Two measurement bugs found in my own tooling

- **`scripts/deeplink-audit.mjs` named a constant `URL`**, shadowing the global
  `URL` constructor, and died halfway through with "URL is not a constructor".
- **The builder's tab-switch timer was too coarse to trust.** It polled from
  Node, round-tripping over the devtools protocol every sample. The same
  unchanged build measured 482, 485, 524 and 532ms on four consecutive runs
  against a 500ms limit, so the check passed or failed at random. Rewritten to
  sample every frame inside the page with `requestAnimationFrame`. That
  exposed a second bug: the loop started before the click, saw the legitimately
  still frames beforehand, and reported a 3ms animation. Fixed by requiring
  motion before looking for stillness.

With an honest measurement the switch really was 456 to 513ms, straddling the
limit rather than merely appearing to. `mode="wait"` serialises exit and
entrance, so the pair must fit 500ms **together**. Moved from `DUR_BASE` to
`DUR_FAST` plus its 65% exit: 264ms nominal, **measured 345 to 369ms across
five runs**, with the exit-faster-than-enter ratio intact.

### Verification

All six audits pass: contrast, over-image contrast, focus, mobile, builder,
deep links. Copy check clean, 0 broken images on desktop and mobile.

---

## Hero fixes (owner spotted, both real)

Two defects the owner found by looking at the live site. Both were genuine, and
both had been sitting in front of me across several passes.

### Two identical WhatsApp buttons above the fold

Measured at 1564x702: the nav's "Chat With Us" at x=1241,y=20 and the hero's
"Chat with us" at x=424,y=488. **Same destination, same prefilled message,
both on the first screen.**

A pair of buttons should offer a choice. When the second repeats the first it
adds a decision without adding an option, and it competes with the one action
that matters in the hero: opening the builder.

The nav button stays, because it is persistent and reachable from anywhere.
The hero's secondary is now **"See the collections"**, pointing at
`#collections`, which is the genuine second thing a first-time visitor wants:
look before committing.

Swept the rest of the page afterwards rather than fixing only what was
reported. Five WhatsApp links remain and all are contextually distinct:
nav, builder sticky bar, builder summary, closing CTA, footer. Verified the two
inside the builder never appear on screen together, the sticky bar has scrolled
away by the time the summary button arrives.

### The white beam under the hero

A **128px cream gradient**, measured as `linear-gradient(to top,
rgb(253,251,247), transparent)`, fading up into a near black hero.

Cream against `#15100d` is not a blend, it is a bright edge. It read as a
horizontal beam of light with no source, and it washed out the trust strip
sitting just above it.

The section below supplies its own `--background`, so the hero did not need to
be wiped with that colour at all. It now settles into its own dark base
(`#15100d`) and the next section brings its own colour, so there is no seam.
Confirmed by screenshot at the boundary: a clean dark to cream edge.

### Note to self

Both of these were visible in every hero screenshot taken during Phase 4. The
audits were all green because neither is a measurable property: nothing counts
duplicate calls to action, and nothing judges whether a gradient is ugly.
**Green audits are a floor, not a verdict.** The owner has now caught four real
defects that passing checks missed.

---

## Hero rebuilt to the owner's reference

The owner supplied a reference design and asked for the hero to match it,
including the photograph.

### What changed

The old hero used a product photograph as a **full-bleed background under a
heavy dark scrim**, which made the product simultaneously the subject and
unreadable. The reference does the opposite: the photograph is a contained
object beside the copy, and the background is only atmosphere.

- **New photograph**, generated to match the reference: an open kraft hamper
  with a gold-foil monogram lid, patterned tins, a jasmine pouch, a brass lamp
  and fresh jasmine, lit by a brass oil lamp. Saved as JPEG, not PNG: **2,828
  KB as PNG became 227 KB**, and it ships as **34.7 KB AVIF** over the wire.
- **Two-column layout**, copy left, photograph right, on its own rounded card
  with a gold keyline and a deep shadow.
- **Two paragraphs and a pull quote**, replacing the single block. The quote is
  the brand's actual point of view, so it gets a gold rule and italic serif
  rather than being buried in body copy.
- **An assurance bar** across the foot of the hero: rooted in tradition,
  thoughtfully curated, customisable gifting, gift-ready packaging. Each has an
  icon AND a label, because an icon alone is decoration and a label alone is a
  wall of small text. 2x2 on a phone rather than a scroller, since four short
  labels fit and a scroller would hide half of them.
- Buttons are now **Explore our collections** and **Build your hamper**, both
  min 48px tall.

### Two real defects found by measuring, not by eye

**The headline wrapped to three lines at 1440**, pushing the hero to 1011px in a
900px viewport so the assurance bar fell below the fold. `text-6xl` was too
large for the column. Now 863px, everything visible on a laptop.

**On a phone the photograph started at y=768**, below the body copy, the quote
and both buttons. The most persuasive thing on the page was invisible on the
device most of this traffic arrives from. Now third, at y=296, straight after
the headline.

Fixing that took two attempts, both recorded because the first was wrong:

1. Tailwind `order-*` utilities. **Did nothing**, because `order` only reorders
   siblings and the headline lives inside the copy column. Verified: image
   still sixth.
2. `display: contents` on the copy wrappers. Correct for phones, but it
   dissolved the wrappers for grid purposes at every size, so the desktop
   layout scrambled, headline in the right column, image in the left, hero
   1102px. Caught by screenshot.
3. `contents` below `lg` **plus explicit `col-start` / `row-start` placement**
   at `lg`. Works at both sizes with no duplicated markup.

### Three bugs in my own audits, all found by breaking things on purpose

The new hero made two audits fail. **None of the failures were real.**

- **`contrast-audit` reported 1.03:1 for every nav link.** The nav is
  `position: fixed` and transparent, so walking its ancestors lands on the
  cream `<body>` while the thing actually behind it is the dark hero. Measured
  by sampling real pixels: **15.67:1**. Fixed elements are now handed to the
  pixel audit instead of being guessed at.
- **`image-contrast-audit` reported 1.03:1 for the assurance bar.** It
  screenshotted the whole `<ul>`, whose box is mostly gaps and gold icons, so
  it measured an icon against itself. Now targets the label spans.
- **The worst one: targets were not independent.** Scrolling to reach one
  target changed the page for later ones. The nav swaps to a light skin once
  the page moves, so by the time the nav entries ran, the audit was measuring
  the scrolled skin over a cream page and reporting a comfortable pass, while
  the over-hero skin went unmeasured entirely.

  Proved by injecting near-black nav text over the dark hero. True contrast,
  calculated by hand: **1.14:1**. The audit said **8.10:1 and passed.** After
  adding an `atTop` flag that resets scroll before measuring, it reports
  **1.14:1 and fails**, matching the hand calculation exactly.

  This is the sharpest example yet of a green check that was not evidence. It
  had been passing since the day it was written, for the wrong reason.

### Verification

All six audits pass, copy check clean, hero ships as 34.7 KB AVIF.

---

## Real branding, and a hero image that is not invented

### The hero image had a fake logo

The first generated hamper carried an invented monogram on the lid: a scrolled
crest with meaningless letters. Passable as an image, wrong as a brand asset.
A customer would see a logo that is not theirs.

Regenerated using BOTH the owner's reference photograph and the real logo file
as inputs, so the lid now carries the actual House of Parampara mark: the serif
P in its gold arc with the floral vine and oil lamp, above the wordmark and
"Some bonds are timeless". Contents match the reference: pink and gold tin with
a pearl finial, blue floral tin, lotus-stamped jasmine pouch, gold-lidded jar,
brass lamp, "Handcrafted with love" card, jasmine.

Cropped to the card's 4:3 with the window biased **30% off the top rather than
centred**, so the logo on the upright lid is never what gets trimmed.
2,505 KB source becomes 241 KB on disk and **38.9 KB AVIF** over the wire.

### Logo, favicon and social image now come from the real artwork

All derived from the supplied file rather than redrawn:

| Asset | Note |
| --- | --- |
| `emblem-192.png` | Nav and footer mark, 48 KB |
| `emblem-32.png` | Favicon, 2.9 KB |
| `apple-touch-icon.png` | 180px, flattened onto cream because iOS composites transparency onto black |
| `logo-full.jpg` | Emblem plus wordmark, auto-trimmed of surrounding cream |
| `og-image.jpg` | 1200x630 social preview |

**The emblem is masked to a circle with a transparent surround.** The source is
square on cream, and the nav renders it inside a `rounded-full` frame, so the
cream corners would have shown as pale wedges against the dark hero. The mask
is drawn at 4x and downsampled, which keeps the edge smooth rather than jagged.

**The social image is JPEG, not PNG.** It is a photograph-like logo on a cream
field, which PNG stores badly: measured **196 KB as PNG against 38 KB as JPEG**
at quality 88, no visible difference at preview size. Both `layout.tsx` and
`structured-data.tsx` were repointed.

### Verification

All six audits pass, copy check clean, emblem and favicon confirmed loading
from the served page.

---

## The Legacy Collection goes live

Six real products, quantities, no packaging fee, free handwritten note.
All specified by the business owner and confirmed by the user before building.

### Data

`lib/data.ts` rewritten. The Legacy Collection holds six products at 1299,
2099, 1699, 2599, 1499 and 1299, each pointing at its real photograph in
`public/images/legacy/`.

- **`packagingFee` removed from the type entirely.** The owner confirmed the
  price is the product only and basic primary packing is included. The builder
  was adding 150 to 300 on top, so every total it had ever shown was wrong for
  this collection. Removing it from the type rather than setting it to zero
  means it cannot silently come back.
- **A `published` flag was added.** The other four collections still hold
  invented names and prices from the demo, so they are hidden rather than
  deleted: the structure survives for when real products arrive. Components
  now import `publishedCollections`, never the raw list, because importing the
  raw list is precisely how a placeholder leaks onto a live page.
- **Nothing is ticked by default.** These are six separate products, not
  components of one hamper. Pre-ticking would put money in a basket the
  customer did not choose, and pre-ticking all six would open at 10,494.
- **Names remain "Legacy Collection 1" to "6".** The owner has been asked for
  real names. Placeholder numbers sell nothing, but inventing evocative names
  would be fiction printed beside a real price.

### The builder

- **Quantity per item**, 1 to 500. A real number field, so a wedding order of
  150 can be typed rather than tapped 149 times. Clamped in the handler, so a
  pasted 9999 or a typed 0 can never reach the total or the WhatsApp message.
- **Selection and quantity are one map, not two pieces of state.** A Set of ids
  plus a separate count allows the impossible state "selected, quantity zero".
- **The item card is a div, not a button.** It now contains a toggle and a
  stepper, and nesting buttons inside a button is invalid HTML that makes the
  inner controls unreachable by keyboard.
- **Free handwritten note**, with an optional 300 character message. The word
  "Free" is stated on a badge rather than implied by an absent price, because
  on a page where everything else is priced, no price reads as "not decided
  yet".
- The collection chip row **hides itself when only one collection is
  published**, since a row of one button that does nothing reads as broken.

Verified end to end in the browser: ticking LC1 at 150 and LC2 at 1 produced
**196,949**, matching 1299x150 + 2099 exactly, and the WhatsApp message carried
both lines, the unit prices, the total, the piece count and the note.

### Three defects found, and two of them were in my own audits

**Real defect: the note checkbox was 20x20**, under the 44px minimum. The
visible box stays 20px, because a 44px checkbox would dominate the row, but it
now sits in a 44px hit area with the padding pulled back out of the layout.

**Real defect: 4px gaps inside the quantity stepper**, half the 8px minimum.
Three targets that close together read as one blob, and a mis-tap on a quantity
control means ordering the wrong number of things.

**My audit was wrong twice.**

1. `mobile-audit` measured the `<input>` and ignored its 44px padded wrapper and
   its 316x80 label, reporting a comfortable target as 20x20.
2. Relaxing that rule then made the audit **blind**. Shrinking the quantity
   steppers to 24px produced zero failures. The cause was worse than the
   relaxation: **the steppers only exist once an item is ticked**, and the audit
   only loaded and scrolled, so it had never measured them at all. The audit now
   ticks an item and opens the note before measuring. Re-broken to confirm: it
   reports the 24px steppers and fails.

That second one is the pattern from the handoff note again. The check was green
because it was not looking, not because the page was correct.

`deeplink-audit` also needed updating: it required a collection chip, which no
longer exists when a single collection is published. It now checks the chip
only when a chip row is present.

### Verification

All seven audits pass. Copy check clean.

---

## Real product names

The owner sent the names as a price list. Each was matched to a photograph by
price, and she separately confirmed LC1 is the Lakshmi Kumkum Chest, which
settles the only ambiguity: two products share the 1299 price.

| File | Price | Name |
| --- | --- | --- |
| `lc-1.jpg` | 1299 | Lakshmi Kumkum Chest |
| `lc-2.jpg` | 2099 | Vaibhavam Kumkum Chest |
| `lc-3.jpg` | 1699 | Lakshmi Treasure Chest |
| `lc-4.jpg` | 2599 | Lakshmi Chariot Chest |
| `lc-5.jpg` | 1499 | Peacock Kumkum Chest |
| `lc-6.jpg` | 1299 | Vinayakar Kumkum Chest |

**The match was checked against the photographs, not trusted on price alone.**
Three of the six names describe their subject, and all three agree with the
image sitting at that price:

- `lc-4` "Chariot": the piece on wheels drawn by elephants
- `lc-5` "Peacock": the piece with peacocks fanned around the lid
- `lc-6` "Vinayakar": the piece with Ganesha seated on the lid

Three independent confirmations out of six is good evidence the ordering is
right rather than a coincidence. Had any one disagreed, the whole mapping would
have been suspect.

Verified as rendered: all six names and prices correct in the cards, and the
WhatsApp message carries the real name. No name wraps or clips at 1440.

`/home/user/uploads` deleted at the user's request.

All seven audits pass.

---

## The real logo, everywhere

The owner pointed out that only the favicon had actually changed.

**They were right, and the reason matters.** The nav and footer were showing
the round emblem next to the words "House of Parampara" and the strapline
**typed out in the site's own fonts**. That is a recreation, not the logo:
different letterforms, different letter spacing, no gold rules, no ornaments.
Swapping the emblem file made the small circle correct while the thing beside
it stayed an imitation.

### Files built from the supplied artwork

The logo arrived as a JPEG on flat cream, which cannot sit on a dark header.

- **Alpha was derived from distance to the measured cream** (250, 237, 220)
  rather than keying one channel, because the gold is close to cream in red and
  a channel key eats it.
- **The ink was un-composited**, recovering the true colour instead of leaving
  it blended with cream, otherwise every edge carries a pale halo on dark.

| File | Use |
| --- | --- |
| `logo-full.png` | Stacked, transparent, dark ink. Footer. |
| `logo-light.png` | Same, dark ink recoloured to ivory. Gold untouched. |
| `logo-h.png` | Horizontal lockup for the nav. |
| `logo-h-light.png` | Horizontal, light. Nav over the hero. |

### Two measurements that changed the design

**The stacked logo is 1.22:1 and does not fit a nav bar.** Dropped into the
80px header it rendered **68px wide** and the wordmark was a smudge. The nav now
uses a horizontal lockup built from the same artwork, emblem and wordmark set
side by side. Measured after: **193px, then 237px** once sized properly.

**The strapline had to go from the nav lockup only.** At 52px tall it rendered
about 4px high and read as dirt. It remains at full size in the footer.

**The footer logo was 78px wide** in a column with room for far more. Now 180px,
using the full stacked artwork including the strapline.

### On dark versus light

The header is transparent over a near-black hero at the top of the page and a
cream bar once scrolled. Both logos are present and **cross-faded** on the
existing 240ms token, so the change reads as the header shifting rather than
the logo flickering.

`section-eyebrow.tsx` still uses `emblem-192.png`, correctly: it is a small
decorative seal between sections, where the round emblem alone is the right
mark and a full lockup would be unreadable.

All seven audits pass.
