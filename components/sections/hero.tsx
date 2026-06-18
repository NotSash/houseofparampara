"use client"

import Image from "next/image"
import { motion } from "motion/react"
import { Magnetic } from "@/components/magnetic"
import { ArrowDown, Sparkles } from "lucide-react"

export function Hero() {
  return (
    <section id="top" className="relative isolate overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0 -z-10">
        <Image
          src="/images/hero.png"
          alt="A glowing brass oil lamp surrounded by jasmine flowers in warm evening light"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/70 to-background/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/40" />
      </div>

      <div className="mx-auto flex min-h-[100svh] max-w-6xl flex-col justify-center px-5 pb-24 pt-32 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-2xl"
        >
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-4 py-1.5 text-xs uppercase tracking-[0.25em] text-muted-foreground backdrop-blur-sm">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            Heirloom gifting, reimagined
          </div>

          <h1 className="text-balance font-serif text-4xl leading-[1.05] text-foreground sm:text-6xl lg:text-7xl">
            Gifts that carry the <span className="italic text-primary">warmth of home</span>
          </h1>

          <p className="mt-6 max-w-xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
            House of Parampara curates handcrafted hampers rooted in South Indian tradition — every diya, every
            jasmine sachet, every handwritten note a quiet keeper of memory.
          </p>

          <div className="mt-9 flex flex-col gap-4 sm:flex-row sm:items-center">
            <Magnetic>
              <a
                href="#builder"
                className="inline-flex items-center justify-center rounded-full bg-primary px-7 py-3.5 text-sm font-medium tracking-wide text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Build your hamper
              </a>
            </Magnetic>
            <a
              href="#collections"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-border bg-card/40 px-7 py-3.5 text-sm font-medium tracking-wide text-foreground backdrop-blur-sm transition-colors hover:bg-card"
            >
              Explore collections
            </a>
          </div>
        </motion.div>
      </div>

      {/* Scroll cue */}
      <motion.a
        href="#story"
        aria-label="Scroll to story"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-muted-foreground sm:flex"
      >
        <span className="text-[10px] uppercase tracking-[0.3em]">Scroll</span>
        <motion.span
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.8, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
        >
          <ArrowDown className="h-4 w-4" />
        </motion.span>
      </motion.a>
    </section>
  )
}
