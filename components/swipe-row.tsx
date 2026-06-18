'use client'

import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'

/**
 * A mobile-first horizontal snap carousel with progress dots.
 * On >= `gridFrom` breakpoint the same children render as a normal grid
 * (pass the grid classes via `gridClassName`).
 */
export function SwipeRow({
  children,
  count,
  gridClassName,
  itemClassName,
  className,
}: {
  children: React.ReactNode
  count: number
  /** Grid layout classes applied at the md breakpoint and up. */
  gridClassName?: string
  /** Width/sizing applied to each item only in the mobile carousel. */
  itemClassName?: string
  className?: string
}) {
  const scrollerRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)
  const [isCarousel, setIsCarousel] = useState(true)

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)')
    const update = () => setIsCarousel(!mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  function onScroll() {
    const el = scrollerRef.current
    if (!el) return
    const children = Array.from(el.children) as HTMLElement[]
    const center = el.scrollLeft + el.clientWidth / 2
    let nearest = 0
    let min = Infinity
    children.forEach((child, i) => {
      const childCenter = child.offsetLeft + child.offsetWidth / 2
      const dist = Math.abs(childCenter - center)
      if (dist < min) {
        min = dist
        nearest = i
      }
    })
    setActive(nearest)
  }

  function goTo(i: number) {
    const el = scrollerRef.current
    if (!el) return
    const child = el.children[i] as HTMLElement | undefined
    if (child) {
      el.scrollTo({ left: child.offsetLeft - 16, behavior: 'smooth' })
    }
  }

  return (
    <div className={className}>
      <div
        ref={scrollerRef}
        onScroll={onScroll}
        className={cn(
          'no-scrollbar -mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-2',
          'md:mx-0 md:snap-none md:overflow-visible md:px-0 md:pb-0',
          gridClassName && `md:grid ${gridClassName} md:gap-6`,
        )}
      >
        {children}
      </div>

      {/* Progress dots — carousel only */}
      {isCarousel && count > 1 && (
        <div className="mt-5 flex items-center justify-center gap-2 md:hidden">
          {Array.from({ length: count }).map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Go to item ${i + 1}`}
              className={cn(
                'h-2 rounded-full transition-all duration-300',
                i === active ? 'w-6 bg-primary' : 'w-2 bg-border',
              )}
            />
          ))}
        </div>
      )}
    </div>
  )
}

/** Wrapper for a single carousel item — fixed peek width on mobile, auto on desktop. */
export function SwipeItem({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        'w-[78%] shrink-0 snap-center sm:w-[58%] md:w-auto md:shrink',
        className,
      )}
    >
      {children}
    </div>
  )
}
