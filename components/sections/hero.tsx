"use client"

import { useRef } from "react"
import Image from "next/image"
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react"
import { Magnetic } from "@/components/magnetic"
import { WhatsAppIcon } from "@/components/icons"
import { waLink, GENERIC_WA_MESSAGE } from "@/lib/constants"

const TRUST = ["Handcrafted in Tamil Nadu", "Fully customizable", "Wax-sealed & gift-ready"]

export function Hero() {
  const reduce = useReducedMotion()
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  })
  const imgY = useTransform(scrollYProgress, [0, 1], ["0%", reduce ? "0%" : "18%"])
  const imgScale = useTransform(scrollYProgress, [0, 1], [1, reduce ? 1 : 1.12])
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", reduce ? "0%" : "-12%"])
  const contentOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0])

  return (
    <section ref={ref} id="top" className="relative isolate min-h-[100svh] overflow-hidden">
      {/* Parallax background image */}
      <motion.div style={{ y: imgY, scale: imgScale }} className="absolute inset-0 -z-20 origin-center">
        <Image
          src="/images/hero.png"
          alt="A glowing brass oil lamp surrounded by jasmine flowers in warm evening light"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      </motion.div>

      {/* Rich, cinematic dark overlays — keep the imagery visible while text stays legible */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-tr from-[rgba(15,10,8,0.94)] via-[rgba(15,10,8,0.6)] to-[rgba(15,10,8,0.2)]" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-background via-background/10 to-transparent" />
      {/* Soft candlelit glow accent */}
      <div className="pointer-events-none absolute -right-24 top-1/3 -z-10 h-96 w-96 rounded-full bg-[radial-gradient(circle,rgba(226,184,115,0.22),transparent_70%)] blur-2xl" />

      <motion.div
        style={{ y: contentY, opacity: contentOpacity }}
        className="mx-auto flex min-h-[100svh] max-w-6xl flex-col justify-center px-5 pb-24 pt-28 sm:px-8 sm:pt-32"
      >
        <div className="max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center gap-2.5 rounded-full border border-[#e2b873]/30 bg-white/5 px-4 py-1.5 text-[0.7rem] uppercase tracking-[0.28em] text-[#f0e6d6]/90 backdrop-blur-md"
          >
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#e2b873]" />
            Heirloom gifting, reimagined
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="mt-6 text-balance font-serif text-[2.6rem] leading-[1.04] text-[#f6efe3] sm:text-6xl lg:text-7xl"
          >
            Gifts that carry the{" "}
            <span className="relative inline-block italic text-[#e2b873]">
              warmth of home
              <span className="absolute -bottom-1 left-0 h-px w-full bg-gradient-to-r from-transparent via-[#e2b873]/70 to-transparent" />
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.16, ease: [0.16, 1, 0.3, 1] }}
            className="mt-6 max-w-xl text-pretty text-base leading-relaxed text-[#ece0d0]/80 sm:text-lg"
          >
            House of Parampara curates handcrafted hampers rooted in South Indian tradition — every diya, every
            jasmine sachet, every handwritten note a quiet keeper of memory.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.24, ease: [0.16, 1, 0.3, 1] }}
            className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center"
          >
            <Magnetic>
              <a
                href="#builder"
                className="shimmer-sweep inline-flex w-full items-center justify-center rounded-full bg-[#b9543a] px-7 py-3.5 text-sm font-medium tracking-wide text-[#fbf1e4] shadow-[0_18px_40px_-16px_rgba(185,84,58,0.8)] transition-transform hover:-translate-y-0.5 sm:w-auto"
              >
                Build your hamper
              </a>
            </Magnetic>
            <a
              href={waLink(GENERIC_WA_MESSAGE)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-[#f0e6d6]/25 bg-white/5 px-7 py-3.5 text-sm font-medium tracking-wide text-[#f0e6d6] backdrop-blur-md transition-colors hover:bg-white/10 sm:w-auto"
            >
              <WhatsAppIcon className="h-4 w-4" />
              Chat with us
            </a>
          </motion.div>

          {/* Trust strip */}
          <motion.ul
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.9, delay: 0.4 }}
            className="mt-10 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-[#ece0d0]/70"
          >
            {TRUST.map((t, i) => (
              <li key={t} className="flex items-center gap-5">
                {i > 0 && <span aria-hidden className="hidden h-1 w-1 rounded-full bg-[#e2b873]/60 sm:inline-block" />}
                <span className="flex items-center gap-2">
                  <span aria-hidden className="h-1 w-1 rounded-full bg-[#e2b873] sm:hidden" />
                  {t}
                </span>
              </li>
            ))}
          </motion.ul>
        </div>
      </motion.div>

      {/* Scroll cue */}
      <motion.a
        href="#story"
        aria-label="Scroll to story"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.1, duration: 0.8 }}
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-[#ece0d0]/70 sm:flex"
      >
        <span className="text-[10px] uppercase tracking-[0.3em]">Scroll</span>
        <span className="flex h-9 w-5 items-start justify-center rounded-full border border-[#ece0d0]/30 p-1">
          <span className="animate-scroll-nudge h-1.5 w-1.5 rounded-full bg-[#e2b873]" />
        </span>
      </motion.a>
    </section>
  )
}
