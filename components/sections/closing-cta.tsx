import Image from "next/image"
import { Reveal } from "@/components/reveal"
import { Magnetic } from "@/components/magnetic"
import { WhatsAppIcon } from "@/components/icons"
import { waLink, GENERIC_WA_MESSAGE } from "@/lib/constants"

export function ClosingCta() {
  return (
    <section id="contact" className="relative scroll-mt-24 overflow-hidden bg-[#5c2c20] py-20 text-[#fbf1e4] md:py-32 dark:bg-[#190f0b]">
      <div className="pointer-events-none absolute inset-0 opacity-[0.08] dark:opacity-[0.14]">
        <Image src="/images/hero.png" alt="" fill className="object-cover" />
      </div>
      {/* Warm terracotta glow — gives the dark contact section depth instead of flat brightness */}
      <div className="pointer-events-none absolute inset-0 opacity-0 dark:opacity-100 dark:bg-[radial-gradient(75%_60%_at_50%_-5%,rgba(185,84,58,0.4),transparent_70%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#e2b873]/40 to-transparent" />
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
              className="inline-flex items-center justify-center rounded-full bg-[#fbf1e4] px-8 py-4 text-sm font-medium text-[#2b231f] shadow-lg transition-transform hover:scale-[1.03]"
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
