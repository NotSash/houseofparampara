"use client"

import { useRef } from "react"
import Image from "next/image"
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react"
import { ArrowRight, Gift, PenLine, Package, Flower2 } from "lucide-react"
import { Magnetic } from "@/components/magnetic"
import { hero, reveal, STAGGER } from "@/lib/motion"

/*
 * The four assurances under the hero.
 *
 * Previously a bare row of text inside the hero column, competing with the
 * paragraph above it. They now sit on their own full-width band, which is the
 * right call: they are a different KIND of information from the pitch, so they
 * get their own surface rather than being another line of copy.
 *
 * Each carries an icon AND a label. The icon alone would be decoration; the
 * label alone would be a wall of small text.
 */
const ASSURANCES = [
  { icon: Flower2, label: "Rooted in\ntradition" },
  { icon: Gift, label: "Thoughtfully\ncurated" },
  { icon: PenLine, label: "Customisable\ngifting" },
  { icon: Package, label: "Gift-ready\npackaging" },
]

export function Hero() {
  const reduce = useReducedMotion()
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  })

  /*
   * The photograph drifts a little slower than the page, which reads as depth.
   *
   * Deliberately gentle: 8%, where the old full-bleed background used 18%. A
   * contained image showing its own edges cannot move far before the gap at
   * its border becomes visible; a full-bleed background could hide that.
   */
  const imgY = useTransform(scrollYProgress, [0, 1], ["0%", reduce ? "0%" : "8%"])
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", reduce ? "0%" : "-6%"])

  /*
   * ORDER ON A PHONE.
   *
   * Measured on 390x844: with the photograph in its natural grid position it
   * started at y=768 and the hero ran to 1238px, so the single most persuasive
   * thing on the page was effectively invisible on the device most of this
   * traffic arrives from.
   *
   * A first attempt using Tailwind `order-*` utilities did nothing, because
   * `order` only reorders SIBLINGS and the headline lives inside the copy
   * column. Verified after that change: the image was still sixth.
   *
   * The working approach is structural. Below `lg` the layout is one flat flex
   * column and the two copy wrappers use `display: contents`, so they dissolve
   * and their children become direct children of that column. That lets the
   * photograph sit between the headline and the body copy without duplicating
   * a single element. At `lg` the wrappers become real blocks again and the
   * copy is reunited into one left-hand column.
   */
  return (
    <section ref={ref} id="top" className="relative isolate overflow-hidden bg-[#1a120c]">
      {/*
       * The warm room behind everything.
       *
       * The previous hero used the product photograph as a full-bleed
       * background under a heavy dark scrim, which made the product both the
       * subject and unreadable. Now the photograph is an object on the page
       * and the background is only atmosphere: a warm gradient and two soft
       * light sources. Nothing here competes with the text because nothing
       * here has detail.
       */}
      <div className="absolute inset-0 -z-20 bg-[linear-gradient(115deg,#150e09_0%,#241812_45%,#3a2519_100%)]" />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-32 top-0 -z-10 h-[42rem] w-[42rem] rounded-full bg-[radial-gradient(circle,rgba(226,184,115,0.20),transparent_68%)] blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-40 bottom-0 -z-10 h-[34rem] w-[34rem] rounded-full bg-[radial-gradient(circle,rgba(168,70,44,0.16),transparent_70%)] blur-3xl"
      />

      <motion.div
        style={{ y: contentY }}
        className="mx-auto max-w-6xl px-5 pb-6 pt-24 sm:px-8 sm:pt-28 lg:pb-8 lg:pt-28"
      >
        <div className="flex flex-col gap-8 lg:grid lg:grid-cols-[1fr_1.05fr] lg:grid-rows-[auto_auto] lg:items-center lg:gap-x-14 lg:gap-y-0">
          {/* ------------------------------------------ copy, part one */}
          <div className="contents lg:col-start-1 lg:row-start-1 lg:flex lg:max-w-xl lg:flex-col lg:self-end">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={reveal}
              className="inline-flex items-center gap-2.5 self-start rounded-full border border-[#e2b873]/30 bg-white/5 px-4 py-1.5 text-[0.7rem] uppercase tracking-[0.28em] text-[#f0e6d6]/90 backdrop-blur-md"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-[#e2b873]" />
              Heirloom gifting, reimagined
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 26 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...hero, delay: 0.08 }}
              className="mt-6 text-balance font-serif text-[2.4rem] leading-[1.06] text-[#f6efe3] sm:text-5xl lg:text-[3.4rem]"
            >
              Gifts that carry the{" "}
              <span className="italic text-[#e2b873]">warmth of home</span>
            </motion.h1>
          </div>

          {/* ----------------------------------------------- photograph */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ ...hero, delay: 0.1 }}
            className="lg:col-start-2 lg:row-span-2 lg:row-start-1"
          >
            <motion.div
              style={{ y: imgY }}
              className="relative aspect-[4/3] overflow-hidden rounded-3xl shadow-[0_40px_80px_-30px_rgba(0,0,0,0.85)] ring-1 ring-[#e2b873]/20"
            >
              <Image
                src="/images/hero-hamper.jpg"
                alt="An open House of Parampara gift hamper containing decorative tins, a jasmine pouch, a small brass lamp and fresh jasmine flowers, beside a lit brass oil lamp"
                fill
                priority
                sizes="(min-width: 1024px) 52vw, 100vw"
                className="object-cover"
              />
              {/*
               * A whisper of warmth over the photograph so it belongs to the
               * dark room rather than sitting on it as a bright rectangle.
               * Kept very light: the product must stay clearly visible, which
               * was the whole failing of the old full-bleed treatment.
               */}
              <div
                aria-hidden
                className="absolute inset-0 bg-[linear-gradient(200deg,transparent_55%,rgba(26,18,12,0.35)_100%)]"
              />
            </motion.div>
          </motion.div>

          {/* ------------------------------------------ copy, part two */}
          <div className="contents lg:col-start-1 lg:row-start-2 lg:mt-6 lg:block lg:max-w-xl lg:self-start">
            {/*
             * A divider with a small ornament, from the reference. It does
             * real work: it separates the headline from the body copy so the
             * eye registers them as two different things.
             */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ ...hero, delay: 0.14 }}
              aria-hidden
              className="flex items-center gap-3"
            >
              <span className="h-px w-16 bg-gradient-to-r from-[#e2b873]/60 to-transparent" />
              <Flower2 className="h-3.5 w-3.5 text-[#e2b873]/70" />
              <span className="h-px w-16 bg-gradient-to-l from-[#e2b873]/60 to-transparent" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...hero, delay: 0.18 }}
              className="mt-6 space-y-4 text-pretty text-base leading-relaxed text-[#ece0d0]/85 sm:text-lg"
            >
              <p>
                House of Parampara brings together meaningful gifts inspired by
                Indian traditions, celebrations and the little rituals that make
                a house feel like home.
              </p>
              <p>
                From thoughtfully chosen return gifts to curated hampers and
                heirloom-inspired pieces, every gift is made to be remembered.
              </p>
            </motion.div>

            {/*
             * The pull quote. This is the brand's actual point of view, so it
             * is set apart rather than buried in the body copy.
             */}
            <motion.blockquote
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...hero, delay: 0.26 }}
              className="mt-7 flex gap-4 border-l-2 border-[#e2b873]/40 pl-5"
            >
              <Flower2 className="mt-1 h-4 w-4 shrink-0 text-[#e2b873]/70" aria-hidden />
              <p className="font-serif text-base italic leading-relaxed text-[#f0e6d6]/90 sm:text-lg">
                We do not believe a gift should be forgotten once the wrapping is
                opened. We believe the best gifts become part of a story.
              </p>
            </motion.blockquote>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...hero, delay: 0.34 }}
              className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center"
            >
              <Magnetic>
                <a
                  href="#collections"
                  className="shimmer-sweep group inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-[#a8462c] px-7 text-sm font-medium tracking-wide text-[#fbf1e4] shadow-[0_18px_40px_-16px_rgba(168,70,44,0.8)] transition-transform hover:-translate-y-0.5 active:translate-y-0 motion-reduce:hover:translate-y-0 sm:w-auto"
                >
                  Explore our collections
                  <ArrowRight
                    className="h-4 w-4 transition-transform group-hover:translate-x-0.5 motion-reduce:group-hover:translate-x-0"
                    aria-hidden
                  />
                </a>
              </Magnetic>
              <a
                href="#builder"
                className="inline-flex min-h-12 w-full items-center justify-center rounded-full border border-[#f0e6d6]/30 bg-white/5 px-7 text-sm font-medium tracking-wide text-[#f0e6d6] backdrop-blur-md transition-colors hover:bg-white/10 sm:w-auto"
              >
                Build your hamper
              </a>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/*
       * ---------------------------------------------------- assurance bar
       *
       * Full width, its own translucent surface, at the foot of the hero.
       *
       * On a phone this is a 2x2 grid rather than a horizontal scroller,
       * because four short labels fit comfortably and a scroller would hide
       * half of them behind an interaction nobody is prompted to perform.
       */}
      <div className="relative mx-auto max-w-6xl px-5 pb-12 sm:px-8 lg:pb-14">
        <motion.ul
          initial="hidden"
          animate="shown"
          variants={{ shown: { transition: { staggerChildren: STAGGER, delayChildren: 0.45 } } }}
          data-audit="hero-trust"
          className="grid grid-cols-2 gap-x-4 gap-y-5 rounded-2xl border border-[#e2b873]/20 bg-[#f6efe3]/[0.07] px-5 py-5 backdrop-blur-md sm:px-7 lg:grid-cols-4 lg:gap-6"
        >
          {ASSURANCES.map(({ icon: Icon, label }) => (
            <motion.li
              key={label}
              variants={{
                hidden: { opacity: 0, y: 10 },
                shown: { opacity: 1, y: 0, transition: reveal },
              }}
              className="flex items-center gap-3"
            >
              <Icon className="h-6 w-6 shrink-0 text-[#e2b873]" aria-hidden />
              <span className="whitespace-pre-line text-xs font-medium uppercase leading-snug tracking-[0.14em] text-[#f0e6d6]">
                {label}
              </span>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </section>
  )
}
