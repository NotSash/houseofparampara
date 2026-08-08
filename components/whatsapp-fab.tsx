"use client"

import { useEffect, useState } from "react"
import { AnimatePresence, motion } from "motion/react"
import { WhatsAppIcon } from "@/components/icons"
import { waLink, GENERIC_WA_MESSAGE } from "@/lib/constants"

export function WhatsAppFab() {
  const [scrolled, setScrolled] = useState(false)
  const [builderBarVisible, setBuilderBarVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 600)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  /*
   * Stand down while the builder's own order bar is on screen.
   *
   * Both are round WhatsApp buttons anchored to the bottom right, so on a
   * phone this one landed directly on top of the "Order" button and covered
   * the word. Caught by screenshot: every audit number was green while one
   * control was sitting on another.
   *
   * The builder bar is the better button of the two at that moment, because it
   * carries the actual hamper and total. So the generic one yields.
   */
  useEffect(() => {
    const bar = document.querySelector("#builder .sticky")
    if (!bar) return
    const io = new IntersectionObserver(
      ([entry]) => setBuilderBarVisible(entry.isIntersecting),
      { threshold: 0.1 },
    )
    io.observe(bar)
    return () => io.disconnect()
  }, [])

  const show = scrolled && !builderBarVisible

  return (
    <AnimatePresence>
      {show && (
        <motion.a
          href={waLink(GENERIC_WA_MESSAGE)}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat with us on WhatsApp"
          initial={{ opacity: 0, scale: 0.6, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.6, y: 20 }}
          transition={{ type: "spring", stiffness: 300, damping: 22 }}
          className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/30 transition-transform hover:scale-105"
        >
          <span className="absolute inset-0 animate-ping rounded-full bg-primary/40" aria-hidden="true" />
          <WhatsAppIcon className="relative h-6 w-6" />
        </motion.a>
      )}
    </AnimatePresence>
  )
}
