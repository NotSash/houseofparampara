import Image from "next/image"
import { ArrowRight } from "lucide-react"
import { collections } from "@/lib/data"
import { Reveal, StaggerGroup, StaggerItem } from "@/components/reveal"
import { SectionEyebrow, SealDivider } from "@/components/section-eyebrow"

export function CollectionsShowcase() {
  return (
    <section id="collections" className="paper-grain relative py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <SectionEyebrow>The Collections</SectionEyebrow>
        <Reveal delay={0.05}>
          <h2 className="mx-auto mt-5 max-w-2xl text-balance text-center font-serif text-3xl leading-tight text-foreground sm:text-4xl lg:text-5xl">
            Five worlds of heritage gifting
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mx-auto mt-5 max-w-xl text-pretty text-center leading-relaxed text-muted-foreground">
            Each collection holds its own mood and memory. Explore them, then build your own hamper — choosing only
            the pieces that speak to you.
          </p>
        </Reveal>

        <StaggerGroup className="mt-16 flex flex-col gap-6">
          {collections.map((c, i) => (
            <StaggerItem key={c.id}>
              <article
                className={`group grid items-center gap-0 overflow-hidden rounded-3xl border border-border bg-card shadow-warm-sm transition-shadow duration-500 hover:shadow-warm md:grid-cols-2 ${
                  i % 2 === 1 ? "md:[&>div:first-child]:order-2" : ""
                }`}
              >
                <div className="relative aspect-[16/11] overflow-hidden md:aspect-auto md:h-full md:min-h-[22rem]">
                  <Image
                    src={c.image || "/placeholder.svg"}
                    alt={c.alt}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="p-8 sm:p-10">
                  <span className="eyebrow">{`Collection ${String(i + 1).padStart(2, "0")}`}</span>
                  <h3 className="mt-3 font-serif text-2xl text-foreground sm:text-3xl">{c.name}</h3>
                  <p className="mt-2 font-serif text-lg italic text-primary">{c.tagline}</p>
                  <p className="mt-4 leading-relaxed text-muted-foreground">{c.intro}</p>
                  <div className="mt-6 flex flex-wrap gap-2">
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
                    className="mt-7 inline-flex items-center gap-2 text-sm font-medium text-primary transition-colors hover:text-maroon"
                  >
                    Build from this collection
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </a>
                </div>
              </article>
            </StaggerItem>
          ))}
        </StaggerGroup>

        <div className="mt-16">
          <SealDivider />
        </div>
      </div>
    </section>
  )
}
