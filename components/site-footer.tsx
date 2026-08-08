import Image from "next/image"
import { publishedCollections } from "@/lib/data"
import { waLink, GENERIC_WA_MESSAGE, INSTAGRAM_URL, INSTAGRAM_HANDLE } from "@/lib/constants"
import { WhatsAppIcon } from "@/components/icons"

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-6xl px-5 py-16">
        <div className="grid gap-10 md:grid-cols-[1.5fr_1fr_1fr]">
          <div>
            {/* The real logo, not the emblem plus retyped text. The footer is
                on the cream background, so the dark artwork is used as drawn. */}
            <Image
              src="/images/logo-full.png"
              alt="House of Parampara"
              width={560}
              height={460}
              /*
               * The footer column is wide, so the full STACKED artwork is used
               * here, strapline included, rather than the compressed
               * horizontal lockup the nav needs. Measured at h-16 it came out
               * 78px wide and the wordmark was unreadable; 180px gives the
               * three lines room to be read.
               */
              className="h-auto w-[180px]"
            />
            <p className="mt-4 max-w-sm text-pretty text-base leading-relaxed sm:text-sm text-muted-foreground">
              Thoughtful gifts rooted in tradition, made to carry memories from
              one generation to the next.
            </p>
            <div className="mt-6 flex items-center gap-3">
              <a
                href={waLink(GENERIC_WA_MESSAGE)}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Chat on WhatsApp"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary-ink"
              >
                <WhatsAppIcon className="h-4 w-4" />
              </a>
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram, parampara_giftings"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary-ink"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4" aria-hidden="true">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </a>
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 items-center text-sm text-muted-foreground transition-colors hover:text-primary-ink"
              >
                {INSTAGRAM_HANDLE}
              </a>
            </div>
          </div>

          <nav aria-label="Collections">
            <h3 className="font-serif text-lg">Collections</h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              {publishedCollections.map((c) => (
                <li key={c.id}>
                  <a
                    href={`#builder=${encodeURIComponent(c.id)}`}
                    className="text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {c.name}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Explore">
            <h3 className="font-serif text-lg">Explore</h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              {[
                { label: "Our Story", href: "#story" },
                { label: "Why House of Parampara", href: "#why" },
                { label: "Build a Hamper", href: "#builder" },
                { label: "Packaging", href: "#unboxing" },
                { label: "Contact", href: "#contact" },
              ].map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    className="text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div
          data-audit="colophon"
          className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-border pt-6 text-sm text-muted-foreground sm:flex-row"
        >
          <p>
            &copy; {new Date().getFullYear()} House of Parampara. Made with care
            in India.
          </p>
          <p>Reviving traditions, one keepsake at a time.</p>
        </div>
      </div>
    </footer>
  )
}
