import Image from "next/image"
import { Reveal, StaggerGroup, StaggerItem } from "@/components/reveal"
import { SectionEyebrow } from "@/components/section-eyebrow"

const PILLARS = [
  {
    title: "Rooted in Memory",
    body: "Jasmine, kolams, and the lamp at dusk — we revive the small sensory rituals that defined home.",
    image: "/images/pillar-memories.png",
    alt: "Fresh jasmine flowers beside a white kolam pattern on a red threshold",
  },
  {
    title: "Made with Meaning",
    body: "Every gesture matters. Each hamper is built around a feeling — gratitude, blessing, belonging.",
    image: "/images/pillar-meaning.png",
    alt: "Two pairs of hands exchanging betel leaves in a gesture of care",
  },
  {
    title: "Timeless Bonds",
    body: "Gifts that travel between generations, carrying recipes, voices, and stories forward.",
    image: "/images/pillar-bonds.png",
    alt: "A grandmother and grandchild together in warm light",
  },
  {
    title: "Thoughtful Gifting",
    body: "Hand-finished, wax-sealed, and wrapped to be remembered — gifting as an act of love.",
    image: "/images/pillar-gifting.png",
    alt: "A fabric-wrapped gift with a wax-seal tag and dried flowers",
  },
]

export function Pillars() {
  return (
    <section id="why" className="relative bg-secondary/40 py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <SectionEyebrow>Why Parampara</SectionEyebrow>
        <Reveal delay={0.05}>
          <h2 className="mx-auto mt-5 max-w-2xl text-balance text-center font-serif text-3xl leading-tight text-foreground sm:text-4xl lg:text-5xl">
            More than a gift — a feeling you can hold
          </h2>
        </Reveal>

        <StaggerGroup className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {PILLARS.map((p) => (
            <StaggerItem key={p.title}>
              <article className="group h-full overflow-hidden rounded-3xl border border-border bg-card shadow-warm-sm transition-all duration-500 hover:-translate-y-1.5 hover:shadow-warm">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={p.image || "/placeholder.svg"}
                    alt={p.alt}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal/40 to-transparent" />
                </div>
                <div className="p-6">
                  <h3 className="font-serif text-xl text-foreground">{p.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{p.body}</p>
                </div>
              </article>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </div>
    </section>
  )
}
