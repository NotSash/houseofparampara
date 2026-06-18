import Image from "next/image"
import { ArrowRight } from "lucide-react"
import { collections } from "@/lib/data"
import { Reveal } from "@/components/reveal"
import { SectionEyebrow, SealDivider } from "@/components/section-eyebrow"
import { SwipeRow, SwipeItem } from "@/components/swipe-row"

export function CollectionsShowcase() {
  return (
    <section id="collections" className="paper-grain relative py-16 sm:py-28">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <SectionEyebrow>The Collections</SectionEyebrow>
        <Reveal delay={0.05}>
          <h2 className="mx-auto mt-5 max-w-2xl text-balance text-center font-serif text-3xl leading-tight text-foreground sm:text-4xl lg:text-5xl">
            Five worlds of heritage gifting
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mx-auto mt-5 max-w-xl text-pretty text-center leading-relaxed text-muted-foreground">
            Each collection holds its own mood and memory. Swipe through, then build your own hamper — choosing only
            the pieces that speak to you.
          </p>
        </Reveal>

        <SwipeRow
          count={collections.length}
          gridClassName="grid-cols-2 lg:grid-cols-3"
          className="mt-12 sm:mt-14"
        >
          {collections.map((c, i) => (
            <SwipeItem key={c.id}>
              <article className="group flex h-full flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-warm-sm transition-all duration-500 hover:-translate-y-1.5 hover:shadow-warm">
                <div className="relative aspect-[5/4] overflow-hidden sm:aspect-[4/3]">
                  <Image
                    src={c.image || "/placeholder.svg"}
                    alt={c.alt}
                    fill
                    sizes="(min-width: 1024px) 33vw, 80vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal/45 to-transparent" />
                  <span className="absolute left-3 top-3 rounded-full bg-black/35 px-2.5 py-1 text-[0.6rem] uppercase tracking-[0.18em] text-ivory/90 backdrop-blur-sm">
                    {`No. ${String(i + 1).padStart(2, "0")}`}
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-5 sm:p-6">
                  <h3 className="font-serif text-xl leading-tight text-foreground sm:text-2xl">{c.name}</h3>
                  <p className="mt-1 font-serif text-sm italic text-accent">{c.tagline}</p>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{c.intro}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {c.subHampers.map((s) => (
                      <span
                        key={s.id}
                        className="rounded-full border border-border bg-secondary/50 px-3 py-1 text-xs text-secondary-foreground"
                      >
                        {s.name}
                      </span>
                    ))}
                  </div>
                  <a
                    href="#builder"
                    className="mt-auto inline-flex items-center gap-2 pt-6 text-sm font-medium text-primary transition-colors hover:text-maroon"
                  >
                    Build from this collection
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </a>
                </div>
              </article>
            </SwipeItem>
          ))}
        </SwipeRow>

        <div className="mt-14">
          <SealDivider />
        </div>
      </div>
    </section>
  )
}
