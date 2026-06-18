import Image from "next/image"
import { Reveal } from "@/components/reveal"
import { Magnetic } from "@/components/magnetic"
import { WhatsAppIcon } from "@/components/icons"
import { waLink, GENERIC_WA_MESSAGE } from "@/lib/constants"

export function ClosingCta() {
  return (
    <section id="contact" className="relative scroll-mt-24 overflow-hidden bg-primary py-24 text-primary-foreground md:py-32">
      <div className="pointer-events-none absolute inset-0 opacity-[0.08]">
        <Image src="/images/hero.png" alt="" fill className="object-cover" />
      </div>
      <div className="relative mx-auto max-w-3xl px-5 text-center">
        <Reveal>
          <p className="font-serif text-sm uppercase tracking-[0.3em] text-primary-foreground/70">
            House of Parampara
          </p>
          <h2 className="mt-6 font-serif text-4xl leading-[1.1] text-balance md:text-6xl">
            Some things should never be forgotten
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-pretty leading-relaxed text-primary-foreground/80">
            Send a hamper that carries more than its contents — a little of
            home, a little of who you are, gently wrapped and passed on.
          </p>
        </Reveal>
        <Reveal delay={0.12} className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Magnetic>
            <a
              href="#builder"
              className="inline-flex items-center justify-center rounded-full bg-card px-8 py-4 text-sm font-medium text-foreground transition-transform hover:scale-[1.03]"
            >
              Build your hamper
            </a>
          </Magnetic>
          <a
            href={waLink(GENERIC_WA_MESSAGE)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-primary-foreground/30 px-8 py-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-foreground/10"
          >
            <WhatsAppIcon className="h-4 w-4" />
            Talk to us
          </a>
        </Reveal>
      </div>
    </section>
  )
}
