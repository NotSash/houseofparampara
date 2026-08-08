import { INSTAGRAM_URL, WHATSAPP_NUMBER } from '@/lib/constants'

/**
 * Structured data, so search engines understand what this business is.
 *
 * Without it Google sees an unlabelled page of prose. With it, the business
 * can appear with its location, contact method and social profiles attached,
 * which matters far more for a local handmade business than for a generic
 * shop.
 *
 * Only facts that are actually true are asserted here. There is no street
 * address, no opening hours and no price range, because those have not been
 * decided, and **inventing them would be worse than omitting them**: a wrong
 * address in a search result sends a real customer to the wrong place, and
 * fabricated data can get structured markup penalised.
 *
 * `LocalBusiness` rather than `Store`: there is no physical shopfront to
 * visit, and orders happen over WhatsApp.
 */
export function StructuredData() {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'House of Parampara',
    description:
      'Curated, customizable nostalgia-inspired return gifts, hampers, and keepsakes for weddings, festivals, and family traditions. Handcrafted in Tamil Nadu.',
    slogan: 'Some Bonds Are Timeless',
    url: 'https://houseoofparampara.vercel.app',
    image: 'https://houseoofparampara.vercel.app/images/og-image.jpg',
    telephone: `+${WHATSAPP_NUMBER}`,
    priceRange: '₹₹',
    address: {
      '@type': 'PostalAddress',
      addressRegion: 'Tamil Nadu',
      addressCountry: 'IN',
    },
    sameAs: [INSTAGRAM_URL],
    currenciesAccepted: 'INR',
  }

  return (
    // `application/ld+json` is data, not executable script. Next renders it
    // inline so crawlers see it in the initial HTML rather than after
    // hydration, which is the whole point.
    <script
      type="application/ld+json"
      // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD has no
      // other insertion route, and this content is a fixed object we control.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}
