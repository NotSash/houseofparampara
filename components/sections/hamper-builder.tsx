"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import Image from "next/image"
import { AnimatePresence, motion } from "motion/react"
import { Check, Minus, Plus } from "lucide-react"
import {
  optionPrice,
  publishedCollections,
  type Collection,
  type HamperItem,
  type SubHamper,
} from "@/lib/data"
import { formatPrice, waLink } from "@/lib/constants"
import { SectionEyebrow } from "@/components/section-eyebrow"
import { Reveal } from "@/components/reveal"
import { WhatsAppIcon } from "@/components/icons"
import { AnimatedPrice } from "@/components/animated-price"
import { DUR_BASE, DUR_FAST, EASE, EASE_EXIT, exitDuration } from "@/lib/motion"
import { cn } from "@/lib/utils"

/*
 * Quantity limits.
 *
 * The upper bound is high on purpose. Return gifts for weddings sell in 50 to
 * 200 units, and before this the builder had no quantity input at all, so the
 * highest-value customer on the site could not express what they wanted to
 * buy. A cap of 10 would recreate that problem in a smaller way.
 */
const MIN_QTY = 1
const MAX_QTY = 500

export function HamperBuilder() {
  const [activeCollectionId, setActiveCollectionId] = useState(
    publishedCollections[0].id,
  )
  const activeCollection =
    publishedCollections.find((c) => c.id === activeCollectionId) ??
    publishedCollections[0]

  const [activeSubId, setActiveSubId] = useState(activeCollection.subHampers[0].id)
  const activeSub =
    activeCollection.subHampers.find((s) => s.id === activeSubId) ??
    activeCollection.subHampers[0]

  /*
   * Quantity per item id, across every sub-hamper.
   *
   * An item is SELECTED when it has an entry here. Quantity and selection used
   * to be two separate ideas (a Set of ids, then a count), which allows the
   * impossible state of "selected, quantity zero". One map cannot express that.
   */
  const [quantities, setQuantities] = useState<Record<string, number>>({})

  /*
   * Chosen size per item id, for items that carry `options`.
   *
   * One card covers every size of a design, the way a clothing card covers
   * S through XL. The dropdown picks the size, the quantity stepper picks
   * how many. Missing entries fall back to the first option.
   */
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({})

  function optionOf(item: HamperItem): string | undefined {
    if (!item.options || item.options.length === 0) return undefined
    return selectedOptions[item.id] ?? item.options[0].label
  }

  function priceOf(item: HamperItem): number {
    return optionPrice(item, optionOf(item))
  }

  /** A free handwritten note. Confirmed by the owner as free of charge. */
  const [wantsNote, setWantsNote] = useState(false)
  const [noteText, setNoteText] = useState("")

  const isSelected = (itemId: string) => quantities[itemId] !== undefined

  function toggleItem(itemId: string) {
    setQuantities((prev) => {
      const next = { ...prev }
      if (next[itemId] !== undefined) delete next[itemId]
      else next[itemId] = 1
      return next
    })
  }

  function setQuantity(itemId: string, value: number) {
    // Clamping here rather than in the input means a pasted "9999" or a typed
    // "0" cannot reach the total or the WhatsApp message.
    const clamped = Math.min(MAX_QTY, Math.max(MIN_QTY, Math.round(value) || MIN_QTY))
    setQuantities((prev) => ({ ...prev, [itemId]: clamped }))
  }

  const selectCollection = useCallback((c: Collection) => {
    setActiveCollectionId(c.id)
    setActiveSubId(c.subHampers[0].id)
  }, [])

  /*
   * Open a specific collection when the page is reached as `#builder=<id>`.
   *
   * Before this, every link into the builder just scrolled to the section,
   * which always showed the FIRST collection. Clicking "Build from this
   * collection" on collection 4 silently gave you collection 1.
   *
   * A hash rather than a query string keeps it a same-page anchor with no
   * navigation, and keeps the link meaningful if someone copies it to a friend.
   */
  useEffect(() => {
    const applyHash = () => {
      const match = /^#builder=(.+)$/.exec(window.location.hash)
      if (!match) return
      const wanted = decodeURIComponent(match[1])
      const found = publishedCollections.find((c) => c.id === wanted)
      if (!found) return
      selectCollection(found)
      // No element has the id `builder=x`, so the browser cannot scroll to it.
      document.getElementById("builder")?.scrollIntoView({ behavior: "smooth" })
    }
    applyHash()
    window.addEventListener("hashchange", applyHash)
    return () => window.removeEventListener("hashchange", applyHash)
  }, [selectCollection])

  /*
   * The order.
   *
   * NO PACKAGING FEE. Confirmed by the owner: the price shown is the product
   * only and basic primary packing is included. The builder used to add a
   * separate 150 to 300 on top, which would have overstated every total.
   */
  const { total, totalUnits, chosen } = useMemo(() => {
    const chosen = activeSub.items
      .filter((i) => isSelected(i.id))
      .map((i) => {
        const option = optionOf(i)
        const unit = optionPrice(i, option)
        return { item: i, qty: quantities[i.id] ?? 1, option, unit }
      })
    return {
      chosen,
      total: chosen.reduce((sum, { unit, qty }) => sum + unit * qty, 0),
      totalUnits: chosen.reduce((sum, { qty }) => sum + qty, 0),
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeSub, quantities, selectedOptions])

  const checkoutMessage = useMemo(() => {
    const lines = [
      "Hi House of Parampara! I would like to order:",
      "",
      ...chosen.map(
        ({ item, qty, option, unit }) =>
          `${qty} x ${item.name}${option ? ` (${option})` : ""} at ${formatPrice(unit)} each = ${formatPrice(unit * qty)}`,
      ),
      "",
      `Total: ${formatPrice(total)} for ${totalUnits} ${totalUnits === 1 ? "piece" : "pieces"}`,
    ]
    if (wantsNote) {
      lines.push("", "Please include a handwritten note:")
      lines.push(noteText.trim() ? `"${noteText.trim()}"` : "(I will share the wording with you)")
    }
    lines.push("", "Please confirm availability and delivery for my location.")
    return lines.join("\n")
  }, [chosen, total, totalUnits, wantsNote, noteText])

  const nothingChosen = chosen.length === 0

  return (
    // NOTE: no `overflow-hidden` on this section. It clipped nothing (measured:
    // 0px overflow on both sides) but it DOES make `position: sticky` inert on
    // every descendant, which is why the mobile order bar once rendered at
    // y=912 inside an 844px viewport, i.e. never on screen at all.
    <section id="builder" className="relative scroll-mt-24 py-16 md:py-28">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_0%,color-mix(in_oklch,var(--color-primary)_8%,transparent),transparent)]" />
      <div className="relative mx-auto max-w-6xl px-5">
        <Reveal className="mx-auto max-w-2xl text-center">
          <SectionEyebrow>Build Your Order</SectionEyebrow>
          <h2 className="mt-4 font-serif text-4xl leading-tight text-balance md:text-5xl">
            Choose your pieces
          </h2>
          <p className="mt-4 text-pretty leading-relaxed text-muted-foreground">
            Tick the pieces you would like and set how many of each. Your total
            updates as you go, then send it to us on WhatsApp and we will
            confirm availability and delivery.
          </p>
        </Reveal>

        {/*
         * The collection row only appears when there is more than one
         * published collection. With a single collection it would be a row of
         * one button that does nothing, which reads as a broken control.
         */}
        {publishedCollections.length > 1 && (
          <Reveal className="mt-10">
            <div className="flex flex-wrap justify-center gap-2">
              {publishedCollections.map((c) => {
                const active = c.id === activeCollectionId
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => selectCollection(c)}
                    aria-pressed={active}
                    className={cn(
                      // min-h-11 is 44px, the minimum comfortable tap target.
                      "inline-flex min-h-11 items-center gap-2 rounded-full border px-4 text-sm transition-colors",
                      "active:scale-[0.97] motion-reduce:active:scale-100",
                      active
                        ? "border-primary bg-primary font-semibold text-primary-foreground"
                        : "border-border bg-card/60 text-muted-foreground hover:border-primary/40 hover:text-foreground",
                    )}
                  >
                    {/* A tick, so the choice is not signalled by colour alone. */}
                    {active && <Check className="h-3.5 w-3.5" aria-hidden="true" />}
                    {c.name}
                  </button>
                )
              })}
            </div>
          </Reveal>
        )}

        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_22rem]">
          {/* ------------------------------------------- items */}
          <div className="min-w-0">
            {activeCollection.subHampers.length > 1 && (
              <div className="mb-6 flex flex-wrap gap-2">
                {activeCollection.subHampers.map((s) => {
                  const active = s.id === activeSubId
                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setActiveSubId(s.id)}
                      aria-pressed={active}
                      className={cn(
                        "inline-flex min-h-11 items-center gap-2 rounded-lg border px-3 text-sm transition-colors",
                        "active:scale-[0.97] motion-reduce:active:scale-100",
                        active
                          ? "border-primary/60 bg-primary/10 font-semibold text-foreground"
                          : "border-border bg-card/40 text-muted-foreground hover:text-foreground",
                      )}
                    >
                      {active && <Check className="h-3.5 w-3.5" aria-hidden="true" />}
                      {s.name}
                    </button>
                  )
                })}
              </div>
            )}

            {/* `mode="wait"` serialises exit and entrance, so the pair has to
                fit the 500ms ceiling TOGETHER. DUR_BASE plus its 65% exit
                measured 456 to 513ms, straddling the limit. DUR_FAST plus its
                65% exit measures 345 to 369ms with the ratio intact. */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSub.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6, transition: { duration: exitDuration(DUR_FAST), ease: EASE_EXIT } }}
                transition={{ duration: DUR_FAST, ease: EASE }}
              >
                <p className="mb-5 max-w-xl text-pretty leading-relaxed text-muted-foreground">
                  {activeSub.intro}
                </p>

                <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {activeSub.items.map((item) => {
                    const isOn = isSelected(item.id)
                    const qty = quantities[item.id] ?? 1
                    return (
                      <li key={item.id} className="min-w-0">
                        {/*
                         * A CARD, not a button.
                         *
                         * The card holds a toggle AND, once ticked, a quantity
                         * stepper. Nesting buttons inside a button is invalid
                         * HTML and the inner controls become unreachable by
                         * keyboard, so the outer element is a plain div and the
                         * toggle is its own full-width button.
                         */}
                        <div
                          className={cn(
                            "flex h-full flex-col rounded-xl border transition-all",
                            isOn
                              ? "border-primary/50 bg-card shadow-sm"
                              : "border-border bg-card/40 hover:border-primary/30",
                          )}
                        >
                          <button
                            type="button"
                            onClick={() => toggleItem(item.id)}
                            aria-pressed={isOn}
                            className={cn(
                              "group flex w-full gap-3 rounded-xl p-3 text-left",
                              "active:scale-[0.98] motion-reduce:active:scale-100",
                            )}
                          >
                            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-muted">
                              <Image
                                src={item.image || "/images/placeholder.svg"}
                                alt={item.alt}
                                fill
                                sizes="64px"
                                className="object-cover"
                              />
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-start justify-between gap-2">
                                <span className="text-sm font-medium leading-snug text-foreground">
                                  {item.name}
                                </span>
                                <span className="shrink-0 text-sm font-semibold text-primary-ink">
                                  {formatPrice(priceOf(item))}
                                </span>
                              </div>
                              <p className="mt-1 line-clamp-2 text-base leading-relaxed text-muted-foreground sm:text-sm">
                                {item.description}
                              </p>
                            </div>
                            <span
                              className={cn(
                                "mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border transition-colors",
                                isOn
                                  ? "border-primary bg-primary text-primary-foreground"
                                  : "border-border text-muted-foreground group-hover:border-primary/50",
                              )}
                              aria-hidden="true"
                            >
                              {isOn ? <Check className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
                            </span>
                          </button>

                          {/*
                           * Size dropdown, only for items that carry options.
                           *
                           * Always visible so the size can be picked before
                           * ticking. Picking a size ticks the item too, the
                           * way choosing a clothing size implies wanting it.
                           * `text-base` because iOS zooms fields under 16px,
                           * `min-h-11` keeps the 44px tap target.
                           */}
                          {item.options && item.options.length > 0 && (
                            <div className="flex items-center justify-between gap-3 px-3 pb-1">
                              <label
                                htmlFor={`size-${item.id}`}
                                className="text-sm text-muted-foreground"
                              >
                                Size
                              </label>
                              <select
                                id={`size-${item.id}`}
                                value={optionOf(item)}
                                onChange={(e) => {
                                  const label = e.target.value
                                  setSelectedOptions((prev) => ({ ...prev, [item.id]: label }))
                                  setQuantities((prev) =>
                                    prev[item.id] !== undefined ? prev : { ...prev, [item.id]: 1 },
                                  )
                                }}
                                aria-label={`Size for ${item.name}`}
                                className="min-h-11 rounded-lg border border-border bg-background px-3 text-base text-foreground"
                              >
                                {item.options.map((o) => (
                                  <option key={o.label} value={o.label}>
                                    {o.label} at {formatPrice(o.price)}
                                  </option>
                                ))}
                              </select>
                            </div>
                          )}

                          {/*
                           * The quantity stepper appears only once the item is
                           * ticked. Showing a stepper on an unticked item would
                           * imply you can set a quantity without choosing it.
                           */}
                          {isOn && (
                            <div className="flex items-center justify-between gap-3 border-t border-border/70 px-3 py-2">
                              <label
                                htmlFor={`qty-${item.id}`}
                                className="text-sm text-muted-foreground"
                              >
                                Quantity
                              </label>
                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => setQuantity(item.id, qty - 1)}
                                  disabled={qty <= MIN_QTY}
                                  aria-label={`Decrease quantity of ${item.name}`}
                                  className="flex h-11 w-11 items-center justify-center rounded-lg border border-border text-foreground transition-colors hover:border-primary/50 disabled:opacity-40 active:scale-95 motion-reduce:active:scale-100"
                                >
                                  <Minus className="h-4 w-4" aria-hidden="true" />
                                </button>
                                {/*
                                 * A real number input, so a wedding order of
                                 * 150 can be typed rather than tapped 149
                                 * times. `text-base` because iOS zooms the page
                                 * when a field under 16px takes focus.
                                 */}
                                <input
                                  id={`qty-${item.id}`}
                                  type="number"
                                  inputMode="numeric"
                                  min={MIN_QTY}
                                  max={MAX_QTY}
                                  value={qty}
                                  onChange={(e) => setQuantity(item.id, Number(e.target.value))}
                                  className="h-11 w-16 rounded-lg border border-border bg-background text-center text-base tabular-nums text-foreground"
                                />
                                <button
                                  type="button"
                                  onClick={() => setQuantity(item.id, qty + 1)}
                                  disabled={qty >= MAX_QTY}
                                  aria-label={`Increase quantity of ${item.name}`}
                                  className="flex h-11 w-11 items-center justify-center rounded-lg border border-border text-foreground transition-colors hover:border-primary/50 disabled:opacity-40 active:scale-95 motion-reduce:active:scale-100"
                                >
                                  <Plus className="h-4 w-4" aria-hidden="true" />
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </li>
                    )
                  })}
                </ul>
              </motion.div>
            </AnimatePresence>

            {/* --------------------------------- free handwritten note */}
            <div className="mt-6 rounded-xl border border-border bg-card/40 p-4">
              <label className="flex items-start gap-3">
                {/*
                 * The visible box stays 20px, because a 44px checkbox would
                 * dominate the row. The BUTTON area around it is 44px so it can
                 * actually be hit with a thumb: measured 20x20 before this.
                 * `-m-3` pulls the padding back out of the layout so the row
                 * keeps its original spacing.
                 */}
                <span className="-m-3 flex h-11 w-11 shrink-0 items-center justify-center p-3">
                  <input
                    type="checkbox"
                    checked={wantsNote}
                    onChange={(e) => setWantsNote(e.target.checked)}
                    className="h-5 w-5 accent-[var(--primary)]"
                  />
                </span>
                <span>
                  <span className="text-sm font-medium text-foreground">
                    Add a handwritten note
                  </span>
                  {/*
                   * "Free" is stated as a word, not implied by the absence of a
                   * price. An option with no price next to it reads as "price
                   * not shown yet" on a page where everything else is priced.
                   */}
                  <span className="ml-2 rounded-full bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground">
                    Free
                  </span>
                  <span className="mt-1 block text-base leading-relaxed text-muted-foreground sm:text-sm">
                    We will write your message by hand and tuck it into the
                    parcel, at no extra cost.
                  </span>
                </span>
              </label>

              {wantsNote && (
                <div className="mt-3">
                  <label htmlFor="note-text" className="sr-only">
                    What should the note say?
                  </label>
                  <textarea
                    id="note-text"
                    value={noteText}
                    onChange={(e) => setNoteText(e.target.value)}
                    rows={3}
                    maxLength={300}
                    placeholder="What should the note say? You can also tell us on WhatsApp."
                    className="w-full rounded-lg border border-border bg-background p-3 text-base leading-relaxed text-foreground placeholder:text-muted-foreground"
                  />
                  <p className="mt-1 text-sm text-muted-foreground">
                    {noteText.length} of 300 characters
                  </p>
                </div>
              )}
            </div>

            {/* ------------------------- mobile sticky order bar */}
            <div className="sticky bottom-3 z-30 mt-6 lg:hidden">
              <div className="flex items-center gap-3 rounded-2xl border border-border bg-card/95 p-3 pl-4 shadow-warm backdrop-blur-md">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm text-muted-foreground">
                    {totalUnits} {totalUnits === 1 ? "piece" : "pieces"}
                  </p>
                  <AnimatedPrice
                    value={total}
                    className="block font-serif text-xl leading-none tabular-nums text-foreground"
                  />
                </div>
                <a
                  href={waLink(checkoutMessage)}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-disabled={nothingChosen}
                  className={cn(
                    "flex min-h-11 shrink-0 items-center gap-2 rounded-full bg-primary px-5 text-sm font-medium text-primary-foreground transition-transform active:scale-95 motion-reduce:active:scale-100",
                    nothingChosen && "pointer-events-none opacity-50",
                  )}
                >
                  <WhatsAppIcon className="h-4 w-4" />
                  Order
                </a>
              </div>
            </div>
          </div>

          {/* ------------------------------------------- summary */}
          <div className="min-w-0 lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <h3 className="font-serif text-2xl">Your order</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {activeCollection.name}
              </p>

              <div className="my-5 h-px bg-border" />

              <ul className="space-y-2.5">
                <AnimatePresence initial={false}>
                  {chosen.map(({ item, qty, option, unit }) => (
                    <motion.li
                      key={item.id}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: DUR_FAST, ease: EASE }}
                      className="flex items-baseline justify-between gap-3 text-sm"
                    >
                      <span className="min-w-0 truncate text-muted-foreground">
                        <span className="tabular-nums text-foreground">{qty}</span>
                        {" x "}
                        {item.name}
                        {option ? ` (${option})` : ""}
                      </span>
                      <span className="shrink-0 tabular-nums text-foreground">
                        {formatPrice(unit * qty)}
                      </span>
                    </motion.li>
                  ))}
                </AnimatePresence>
                {nothingChosen && (
                  <li className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Minus className="h-4 w-4" aria-hidden="true" /> Nothing chosen yet
                  </li>
                )}
                {wantsNote && (
                  <li className="flex items-baseline justify-between gap-3 text-sm">
                    <span className="truncate text-muted-foreground">
                      Handwritten note
                    </span>
                    <span className="shrink-0 font-medium text-primary-ink">Free</span>
                  </li>
                )}
              </ul>

              <div className="my-5 h-px bg-border" />

              {/*
               * No packaging line. Confirmed by the owner: the price is the
               * product only and basic primary packing is included, so adding
               * a fee here would overstate every total.
               */}
              <div className="flex items-end justify-between rounded-xl bg-secondary px-4 py-3">
                <span className="text-sm font-medium text-secondary-foreground">
                  Total
                </span>
                <AnimatedPrice
                  value={total}
                  className="font-serif text-2xl tabular-nums text-secondary-foreground"
                />
              </div>

              <a
                href={waLink(checkoutMessage)}
                target="_blank"
                rel="noopener noreferrer"
                aria-disabled={nothingChosen}
                className={cn(
                  "mt-5 flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-primary px-6 text-sm font-medium text-primary-foreground transition-transform hover:scale-[1.02] active:scale-100 motion-reduce:hover:scale-100",
                  nothingChosen && "pointer-events-none opacity-50",
                )}
              >
                <WhatsAppIcon className="h-4 w-4" />
                Send order on WhatsApp
              </a>
              <p className="mt-3 text-center text-base leading-relaxed text-muted-foreground sm:text-sm">
                Prices include basic packing. We will confirm availability,
                delivery and any personalisation with you on WhatsApp.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
