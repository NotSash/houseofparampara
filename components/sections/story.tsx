import Image from "next/image"
import { Reveal } from "@/components/reveal"
import { SectionEyebrow, WaxSeal } from "@/components/section-eyebrow"

export function Story() {
  return (
    <section id="story" className="paper-grain relative overflow-hidden py-16 sm:py-28">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 sm:px-8 lg:grid-cols-2 lg:gap-16">
        <Reveal className="relative">
          <div className="relative aspect-[4/5] overflow-hidden rounded-3xl shadow-warm">
            <Image
              src="/images/story.png"
              alt="An elderly grandmother's hands gently holding a grandchild's hands in warm light"
              fill
              className="object-cover"
            />
          </div>
          {/* floating seal */}
          <div className="absolute -right-4 -top-4 hidden sm:block">
            <WaxSeal size={92} className="shadow-warm" />
          </div>
        </Reveal>

        <div>
          <SectionEyebrow align="left">Our Story</SectionEyebrow>
          <Reveal delay={0.05}>
            <h2 className="mt-5 text-balance font-serif text-3xl leading-tight text-foreground sm:text-4xl lg:text-5xl">
              Some bonds are <span className="italic text-primary">timeless</span>
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-6 text-pretty leading-relaxed text-muted-foreground">
              House of Parampara was born from a simple longing — to hold on to the small rituals that once filled
              our homes. The flicker of a brass diya at dusk. The fragrance of jasmine drifting through an evening.
              A kolam traced at the threshold before sunrise.
            </p>
          </Reveal>
          <Reveal delay={0.15}>
            <p className="mt-4 text-pretty leading-relaxed text-muted-foreground">
              We craft each hamper by hand, the slow way, so that what you give carries more than objects — it carries
              memory, meaning, and the warmth of where we come from. Every piece is a quiet keeper of stories, waiting
              to be passed on.
            </p>
          </Reveal>
          <Reveal delay={0.2}>
            <figure className="mt-8 border-l-2 border-gold pl-6">
              <blockquote className="font-serif text-xl italic leading-relaxed text-foreground sm:text-2xl">
                {"\u201CWe don\u2019t sell products. We pass on the feeling of home.\u201D"}
              </blockquote>
            </figure>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
