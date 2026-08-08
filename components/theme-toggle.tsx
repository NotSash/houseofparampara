'use client'

import { useEffect, useState } from 'react'
import { useTheme } from 'next-themes'
import { motion } from 'motion/react'
import { cn } from '@/lib/utils'

export function ThemeToggle({
  className,
  variant = 'solid',
}: {
  className?: string
  /** 'solid' for use over solid backgrounds; 'over-hero' for the translucent nav over the dark hero. */
  variant?: 'solid' | 'over-hero'
}) {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  const isDark = resolvedTheme === 'dark'

  function toggle() {
    setTheme(isDark ? 'light' : 'dark')
  }

  // Render a stable placeholder until mounted to avoid hydration mismatch.
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={
        !mounted
          ? 'Toggle theme'
          : isDark
            ? 'Switch to light theme'
            : 'Switch to dark theme'
      }
      suppressHydrationWarning
      className={cn(
        'relative inline-flex h-11 w-11 items-center justify-center rounded-full border transition-colors',
        variant === 'solid'
          ? 'border-border bg-card/70 text-foreground hover:border-accent/50 hover:text-accent'
          : 'border-ivory/25 bg-ivory/10 text-ivory backdrop-blur-sm hover:bg-ivory/20',
        className,
      )}
    >
      {mounted && (
        <motion.span
          key={isDark ? 'moon' : 'sun'}
          initial={{ scale: 0.4, opacity: 0, rotate: -90 }}
          animate={{ scale: 1, opacity: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 260, damping: 18 }}
          className="flex items-center justify-center"
        >
          {isDark ? <MoonIcon /> : <SunIcon />}
        </motion.span>
      )}
    </button>
  )
}

function SunIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
    </svg>
  )
}

function MoonIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  )
}
