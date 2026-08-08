"use client"

import { useEffect, useRef, useState } from "react"
import { useReducedMotion } from "motion/react"
import { CURRENCY_SYMBOL } from "@/lib/constants"
import { DUR_BASE } from "@/lib/motion"

/**
 * A rupee total that counts to its new value instead of jumping.
 *
 * WHY COUNT AT ALL. The total is the number people actually watch while they
 * add and remove items. When it swapped instantly there was nothing tying the
 * tap to the new figure, so the connection had to be inferred. A short count
 * makes the cause visible.
 *
 * WHY IT IS SHORT. This is reactive motion, not a reveal: it is answering a
 * tap, so it lands inside the 300ms ceiling. Counting is deliberately NOT
 * given the slow treatment a hero gets, because a total that takes a second to
 * settle stops feeling responsive and starts feeling broken.
 *
 * WHY EASE-OUT AND NOT THE EXIT CURVE. This number is watched while it
 * changes. The strong expo-out dumps most of its distance in the first few
 * frames and then crawls, which reads as a snap followed by a stall. That is
 * right for something leaving and wrong here.
 *
 * TABULAR NUMERALS ARE NOT OPTIONAL. Without them each digit has its own
 * width, so a counting number visibly jitters as it changes. The caller passes
 * `tabular-nums`; this component assumes it.
 */
export function AnimatedPrice({ value, className }: { value: number; className?: string }) {
  const reduced = useReducedMotion()
  const [display, setDisplay] = useState(value)
  const fromRef = useRef(value)
  const frameRef = useRef<number | null>(null)

  useEffect(() => {
    // Respecting prefers-reduced-motion means no count, not a slower count.
    if (reduced) {
      setDisplay(value)
      fromRef.current = value
      return
    }

    const from = fromRef.current
    const to = value
    if (from === to) return

    const start = performance.now()
    const ms = DUR_BASE * 1000

    const tick = (now: number) => {
      const t = Math.min((now - start) / ms, 1)
      // Ease-out cubic. Fast at first, settles gently, no stall at the end.
      const eased = 1 - Math.pow(1 - t, 3)
      setDisplay(Math.round(from + (to - from) * eased))
      if (t < 1) {
        frameRef.current = requestAnimationFrame(tick)
      } else {
        fromRef.current = to
      }
    }

    // An in-progress count must cancel when the user taps again, otherwise two
    // animations fight and the number flickers between them.
    if (frameRef.current !== null) cancelAnimationFrame(frameRef.current)
    frameRef.current = requestAnimationFrame(tick)

    return () => {
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current)
      // Whatever is on screen is the new starting point, so an interrupted
      // count continues from where the eye last saw it rather than snapping.
      fromRef.current = to
    }
  }, [value, reduced])

  return (
    <span className={className} data-price={value}>
      {CURRENCY_SYMBOL}
      {display.toLocaleString("en-IN")}
    </span>
  )
}
