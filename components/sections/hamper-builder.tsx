"use client"

import { useMemo, useState } from "react"
import Image from "next/image"
import { AnimatePresence, motion } from "motion/react"
import { Check, Plus, Minus } from "lucide-react"
import { collections, type Collection, type SubHamper } from "@/lib/data"
import { formatPrice, waLink } from "@/lib/constants"
import { SectionEyebrow } from "@/components/section-eyebrow"
import { Reveal } from "@/components/reveal"
import { WhatsAppIcon } from "@/components/icons"
import { cn } from "@/lib/utils"

export function HamperBuilder() {
  const [activeCollectionId, setActiveCollectionId] = useState(collections[0].id)
  const activeCollection =
    collections.find((c) => c.id === activeCollectionId) ?? collections[0]

  const [activeSubId, setActiveSubId] = useState(activeCollection.subHampers[0].id)
  const activeSub =
    activeCollection.subHampers.find((s) => s.id === activeSubId) ??
    activeCollection.subHampers[0]

  // Selected item ids per sub-hamper, initialised lazily from defaults.
  const [selections, setSelections] = useState<Record<string, Set<string>>>({})

  function getSelected(sub: SubHamper): Set<string> {
    if (selections[sub.id]) return selections[sub.id]
    return new Set(sub.items.filter((i) => i.defaultChecked).map((i) => i.id))
  }

  function toggleItem(sub: SubHamper, itemId: string) {
    setSelections((prev) => {
      const current = new Set(prev[sub.id] ?? getSelected(sub))
      if (current.has(itemId)) current.delete(itemId)
      else current.add(itemId)
      return { ...prev, [sub.id]: current }
    })
  }

  function selectCollection(c: Collection) {
    setActiveCollectionId(c.id)
    setActiveSubId(c.subHampers[0].id)
  }

  const selected = getSelected(activeSub)

  const { itemsTotal, total, selectedItems } = useMemo(() => {
    const chosen = activeSub.items.filter((i) => selected.has(i.id))
    const itemsTotal = chosen.reduce((sum, i) => sum + i.price, 0)
    return {
      selectedItems: chosen,
      itemsTotal,
      total: itemsTotal + activeSub.packagingFee,
    }
  }, [activeSub, selected])

  const checkoutMessage = useMemo(() => {
    const lines = [
      "Hi House of Parampara! I'd like to order this hamper:",
      "",
      `Collection: ${activeCollection.name}`,
      `Hamper: ${activeSub.name}`,
      "",
      "Items:",
      ...selectedItems.map((i) => `• ${i.name} — ${formatPrice(i.price)}`),
      "",
      `Packaging: ${formatPrice(activeSub.packagingFee)}`,
      `Estimated total: ${formatPrice(total)}`,
    ]
    return lines.join("\n")
  }, [activeCollection, activeSub, selectedItems, total])

  return (
    <section id="builder" className="relative scroll-mt-24 overflow-hidden py-20 md:py-28">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_0%,color-mix(in_oklch,var(--color-primary)_8%,transparent),transparent)]" />
      <div className="relative mx-auto max-w-6xl px-5">
        <Reveal className="mx-auto max-w-2xl text-center">
          <SectionEyebrow>Build Your Hamper</SectionEyebrow>
          <h2 className="mt-4 font-serif text-4xl leading-tight text-balance md:text-5xl">
            Curate a gift, piece by piece
          </h2>
          <p className="mt-4 text-pretty leading-relaxed text-muted-foreground">
            Choose a collection, pick a hamper, and add or remove the keepsakes
            that feel right. Your total updates as you go, then send it to us on
            WhatsApp to confirm.
          </p>
        </Reveal>

        {/* Collection tabs */}
        <Reveal className="mt-10">
          <div className="flex flex-wrap justify-center gap-2">
            {collections.map((c) => {
              const active = c.id === activeCollectionId
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => selectCollection(c)}
                  className={cn(
                    "rounded-full border px-4 py-2 text-sm transition-colors",
                    active
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-card/60 text-muted-foreground hover:border-primary/40 hover:text-foreground",
                  )}
                >
                  {c.name}
                </button>
              )
            })}
          </div>
        </Reveal>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_22rem]">
          {/* Left: sub-hamper picker + items */}
          <div>
            {activeCollection.subHampers.length > 1 && (
              <div className="mb-6 flex flex-wrap gap-2">
                {activeCollection.subHampers.map((s) => {
                  const active = s.id === activeSubId
                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setActiveSubId(s.id)}
                      className={cn(
                        "rounded-lg border px-3 py-1.5 text-sm transition-colors",
                        active
                          ? "border-primary/60 bg-primary/10 text-foreground"
                          : "border-border bg-card/40 text-muted-foreground hover:text-foreground",
                      )}
                    >
                      {s.name}
                    </button>
                  )
                })}
              </div>
            )}

            <AnimatePresence mode="wait">
              <motion.div
                key={activeSub.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              >
                <p className="mb-5 max-w-xl text-pretty leading-relaxed text-muted-foreground">
                  {activeSub.intro}
                </p>
                <ul className="grid gap-3 sm:grid-cols-2">
                  {activeSub.items.map((item) => {
                    const isOn = selected.has(item.id)
                    return (
                      <li key={item.id}>
                        <button
                          type="button"
                          onClick={() => toggleItem(activeSub, item.id)}
                          aria-pressed={isOn}
                          className={cn(
                            "group flex w-full gap-3 rounded-xl border p-3 text-left transition-all",
                            isOn
                              ? "border-primary/50 bg-card shadow-sm"
                              : "border-border bg-card/40 hover:border-primary/30",
                          )}
                        >
                          <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-muted">
                            <Image
                              src={item.image || "/placeholder.svg"}
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
                              <span className="shrink-0 text-sm font-semibold text-primary">
                                {formatPrice(item.price)}
                              </span>
                            </div>
                            <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
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
                      </li>
                    )
                  })}
                </ul>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right: sticky summary */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <h3 className="font-serif text-2xl">{activeSub.name}</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {activeCollection.name}
              </p>

              <div className="my-5 h-px bg-border" />

              <ul className="space-y-2.5">
                <AnimatePresence initial={false}>
                  {selectedItems.map((i) => (
                    <motion.li
                      key={i.id}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="flex items-center justify-between gap-3 text-sm"
                    >
                      <span className="truncate text-muted-foreground">{i.name}</span>
                      <span className="shrink-0 tabular-nums text-foreground">
                        {formatPrice(i.price)}
                      </span>
                    </motion.li>
                  ))}
                </AnimatePresence>
                {selectedItems.length === 0 && (
                  <li className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Minus className="h-4 w-4" /> No items selected yet
                  </li>
                )}
              </ul>

              <div className="my-5 h-px bg-border" />

              <dl className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <dt className="text-muted-foreground">Items subtotal</dt>
                  <dd className="tabular-nums">{formatPrice(itemsTotal)}</dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-muted-foreground">Packaging</dt>
                  <dd className="tabular-nums">{formatPrice(activeSub.packagingFee)}</dd>
                </div>
              </dl>

              <div className="mt-4 flex items-end justify-between rounded-xl bg-secondary px-4 py-3">
                <span className="text-sm font-medium text-secondary-foreground">
                  Estimated total
                </span>
                <motion.span
                  key={total}
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="font-serif text-2xl tabular-nums text-secondary-foreground"
                >
                  {formatPrice(total)}
                </motion.span>
              </div>

              <a
                href={waLink(checkoutMessage)}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3.5 text-sm font-medium text-primary-foreground transition-transform hover:scale-[1.02] active:scale-100",
                  selectedItems.length === 0 && "pointer-events-none opacity-50",
                )}
              >
                <WhatsAppIcon className="h-4 w-4" />
                Send hamper on WhatsApp
              </a>
              <p className="mt-3 text-center text-xs leading-relaxed text-muted-foreground">
                Prices are indicative. We&apos;ll confirm final details and
                personalisation over WhatsApp.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
