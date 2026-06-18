'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { Menu, X } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { cn } from '@/lib/utils'
import { waLink, GENERIC_WA_MESSAGE } from '@/lib/constants'
import { WhatsAppIcon } from '@/components/icons'

const NAV_LINKS = [
  { label: 'Our Story', href: '#story' },
  { label: 'Why Parampara', href: '#why' },
  { label: 'Collections', href: '#collections' },
  { label: 'Build Your Hamper', href: '#builder' },
  { label: 'The Unboxing Ritual', href: '#unboxing' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'Contact', href: '#contact' },
]

export function SiteNav() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-all duration-500',
        scrolled
          ? 'border-b border-border/70 bg-background/70 backdrop-blur-md shadow-warm-sm'
          : 'border-b border-transparent bg-transparent',
      )}
    >
      <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 sm:px-8">
        <a href="#top" className="flex items-center gap-3" aria-label="House of Parampara home">
          <Image
            src="/images/emblem.png"
            alt="House of Parampara emblem"
            width={52}
            height={52}
            className="h-12 w-12 rounded-full"
            priority
          />
          <span className="hidden flex-col leading-none sm:flex">
            <span
              className={cn(
                'font-serif text-lg tracking-wide transition-colors',
                scrolled ? 'text-foreground' : 'text-ivory',
              )}
            >
              House of Parampara
            </span>
            <span
              className={cn(
                'mt-1 text-[0.62rem] uppercase tracking-[0.32em] transition-colors',
                scrolled ? 'text-muted-foreground' : 'text-gold-soft/90',
              )}
            >
              Some Bonds Are Timeless
            </span>
          </span>
        </a>

        <div className="hidden items-center gap-7 lg:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={cn(
                'group relative text-sm transition-colors',
                scrolled
                  ? 'text-foreground/80 hover:text-primary'
                  : 'text-ivory/85 hover:text-ivory',
              )}
            >
              {link.label}
              <span className="absolute -bottom-1.5 left-0 h-px w-0 bg-gold transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <a
            href={waLink(GENERIC_WA_MESSAGE)}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground shadow-warm-sm transition-transform hover:-translate-y-0.5 sm:inline-flex"
          >
            <WhatsAppIcon className="h-4 w-4" />
            Chat With Us
          </a>
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            className={cn(
              'inline-flex h-11 w-11 items-center justify-center rounded-full transition-colors lg:hidden',
              scrolled
                ? 'text-foreground hover:bg-muted'
                : 'text-ivory hover:bg-ivory/10',
            )}
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="paper-grain fixed inset-0 z-50 flex flex-col bg-background lg:hidden"
          >
            <div className="flex h-20 items-center justify-between px-5">
              <span className="font-serif text-lg text-foreground">
                House of Parampara
              </span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close menu"
                className="inline-flex h-11 w-11 items-center justify-center rounded-full text-foreground hover:bg-muted"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="flex flex-1 flex-col justify-center gap-1 px-8">
              {NAV_LINKS.map((link, i) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.06 * i + 0.1 }}
                  className="border-b border-border/60 py-4 font-serif text-3xl text-foreground"
                >
                  {link.label}
                </motion.a>
              ))}
              <a
                href={waLink(GENERIC_WA_MESSAGE)}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setOpen(false)}
                className="mt-8 inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-4 text-base font-medium text-primary-foreground shadow-warm"
              >
                <WhatsAppIcon className="h-5 w-5" />
                Chat With Us
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
