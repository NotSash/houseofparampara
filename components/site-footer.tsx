import Image from "next/image"
import { collections } from "@/lib/data"
import { waLink, GENERIC_WA_MESSAGE, INSTAGRAM_URL, FACEBOOK_URL } from "@/lib/constants"
import { WhatsAppIcon } from "@/components/icons"

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-6xl px-5 py-16">
        <div className="grid gap-10 md:grid-cols-[1.5fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-3">
              <Image
                src="/images/emblem.png"
                alt="House of Parampara emblem"
                width={48}
                height={48}
                className="h-12 w-12"
              />
              <span className="font-serif text-xl">House of Parampara</span>
            </div>
            <p className="mt-4 max-w-sm text-pretty text-sm leading-relaxed text-muted-foreground">
              Heritage keepsakes and curated hampers that carry the rituals,
              flavours and stories of home — thoughtfully made, gently passed on.
            </p>
            <div className="mt-6 flex items-center gap-3">
              <a
                href={waLink(GENERIC_WA_MESSAGE)}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Chat on WhatsApp"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary"
              >
                <WhatsAppIcon className="h-4 w-4" />
              </a>
              <a
                href={INSTAGRAM_URL}
                aria-label="Instagram"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4" aria-hidden="true">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </a>
              <a
                href={FACEBOOK_URL}
                aria-label="Facebook"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true">
                  <path d="M14 9h3V6h-3c-2.2 0-4 1.8-4 4v2H7v3h3v7h3v-7h3l1-3h-4v-2c0-.6.4-1 1-1z" />
                </svg>
              </a>
            </div>
          </div>

          <nav aria-label="Collections">
            <h3 className="font-serif text-lg">Collections</h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              {collections.map((c) => (
                <li key={c.id}>
                  <a
                    href="#collections"
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
                { label: "Why Parampara", href: "#why" },
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

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row">
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
