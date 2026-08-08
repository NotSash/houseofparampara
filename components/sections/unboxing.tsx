import Image from "next/image"
import { SectionEyebrow } from "@/components/section-eyebrow"
import { Reveal } from "@/components/reveal"
import { SwipeRow, SwipeItem } from "@/components/swipe-row"

const PACKAGES = [
  {
    name: "The Heirloom Box",
    desc: "A rigid ivory box lined with deep maroon tissue and sealed with our gold wax emblem, made to be kept long after the gift is opened.",
    image: "/images/placeholder.svg",
    alt: "An ivory rigid gift box lined with maroon tissue and a gold wax seal",
  },
  {
    name: "The Artisan Wrap",
    desc: "Kraft paper, natural twine and a hand-stamped tag: understated, earthy, and quietly beautiful.",
    image: "/images/placeholder.svg",
    alt: "A kraft paper box wrapped in twine with a hand-stamped tag",
  },
  {
    name: "The Potli Pouch",
    desc: "A soft cloth drawstring pouch, block-printed by hand, inspired by the tamboolam bags passed between hands at celebrations.",
    image: "/images/placeholder.svg",
    alt: "A block-printed cloth potli drawstring pouch",
  },
]

export function Unboxing() {
  return (
    <section id="unboxing" className="scroll-mt-24 bg-secondary/40 py-16 md:py-28">
      <div className="mx-auto max-w-6xl px-5">
        <Reveal className="mx-auto max-w-2xl text-center">
          <SectionEyebrow>The Unboxing</SectionEyebrow>
          <h2 className="mt-4 font-serif text-3xl leading-tight text-balance sm:text-4xl md:text-5xl">
            The wrapping is part of the memory
          </h2>
          <p className="mt-4 text-pretty leading-relaxed text-muted-foreground">
            Every hamper arrives in packaging chosen to be opened slowly, and
            kept long after. Choose the finish that suits the moment.
          </p>
        </Reveal>

        <SwipeRow count={PACKAGES.length} gridClassName="grid-cols-3" className="mt-12">
          {PACKAGES.map((p) => (
            <SwipeItem key={p.name}>
              <article className="group h-full overflow-hidden rounded-2xl border border-border bg-card shadow-warm-sm transition-all duration-[240ms] hover:-translate-y-1.5 hover:shadow-warm">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={p.image || "/placeholder.svg"}
                    alt={p.alt}
                    fill
                    sizes="(min-width: 768px) 33vw, 80vw"
                    className="object-cover transition-transform duration-[400ms] group-hover:scale-105"
                  />
                </div>
                <div className="p-6">
                  <h3 className="font-serif text-2xl">{p.name}</h3>
                  <p className="mt-2 text-pretty text-base leading-relaxed text-muted-foreground sm:text-sm">
                    {p.desc}
                  </p>
                </div>
              </article>
            </SwipeItem>
          ))}
        </SwipeRow>
      </div>
    </section>
  )
}
