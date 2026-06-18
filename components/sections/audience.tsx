import Image from "next/image"
import { SectionEyebrow } from "@/components/section-eyebrow"
import { Reveal } from "@/components/reveal"

const AUDIENCE = [
  "The daughter who lives far from home, and wants to send a piece of it.",
  "The friend who believes a gift should mean something, not just cost something.",
  "The grandchild gathering stories before they fade.",
  "Anyone who finds themselves missing rituals they once took for granted.",
]

export function Audience() {
  return (
    <section id="who" className="scroll-mt-24 py-16 md:py-28">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-5 lg:grid-cols-2 lg:gap-16">
        <Reveal className="order-2 lg:order-1">
          <SectionEyebrow>Who It&apos;s For</SectionEyebrow>
          <h2 className="mt-4 font-serif text-4xl leading-tight text-balance md:text-5xl">
            For those who carry tradition quietly
          </h2>
          <p className="mt-4 text-pretty leading-relaxed text-muted-foreground">
            Parampara is for the people caught between a fast-moving world and a
            slow-burning longing for the things that raised them.
          </p>
          <ul className="mt-8 space-y-4">
            {AUDIENCE.map((line, i) => (
              <Reveal key={i} delay={i * 0.06} as="li" className="flex gap-3">
                <span
                  aria-hidden="true"
                  className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary"
                />
                <span className="text-pretty leading-relaxed text-foreground/90">
                  {line}
                </span>
              </Reveal>
            ))}
          </ul>
        </Reveal>

        <Reveal className="order-1 lg:order-2">
          <div className="relative aspect-[4/5] overflow-hidden rounded-3xl border border-border">
            <Image
              src="/images/who.png"
              alt="A young woman at home in warm light, surrounded by a few heirloom objects"
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/30 to-transparent" />
          </div>
        </Reveal>
      </div>
    </section>
  )
}
