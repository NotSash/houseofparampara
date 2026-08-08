import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Playfair_Display, Lato } from 'next/font/google'
import { StructuredData } from '@/components/structured-data'
import { ThemeProvider } from '@/components/theme-provider'
import './globals.css'

const playfair = Playfair_Display({
  variable: '--font-playfair',
  subsets: ['latin'],
  display: 'swap',
})

const lato = Lato({
  variable: '--font-lato',
  weight: ['300', '400', '700'],
  subsets: ['latin'],
  display: 'swap',
})

/*
 * The live origin, in one place.
 *
 * `metadataBase` used to point at `houseofparampara.example`, a domain that
 * does not exist. Every canonical URL and every Open Graph image resolved to
 * nothing, which meant **link previews on WhatsApp and Instagram were broken**.
 * For a business whose customers arrive almost entirely through those two
 * channels, that was the most expensive bug on the site.
 *
 * Temporary Vercel domain for now. When the real one is bought, this is the
 * only line that needs to change. Note the spelling: the deployment really is
 * `houseoofparampara` with a double o, verified live.
 */
const SITE_URL = 'https://houseoofparampara.vercel.app'

export const metadata: Metadata = {
  title: 'House of Parampara | Heritage Gifts, Hampers & Nostalgic Keepsakes',
  description:
    'Discover House of Parampara: curated, customizable nostalgia-inspired return gifts, hampers, and keepsakes for weddings, festivals, and family traditions. Handcrafted in Tamil Nadu. Some Bonds Are Timeless.',
  metadataBase: new URL(SITE_URL),
  alternates: { canonical: '/' },
  keywords: [
    'return gifts',
    'wedding return gifts',
    'hampers',
    'heritage gifts',
    'Tamil Nadu',
    'handcrafted gifts',
    'festival gifts',
    'keepsakes',
  ],
  openGraph: {
    title: 'House of Parampara | Some Bonds Are Timeless',
    description:
      'Curated, customizable nostalgia-inspired return gifts, hampers, and keepsakes for weddings, festivals, and family traditions. Handcrafted in Tamil Nadu.',
    type: 'website',
    url: SITE_URL,
    siteName: 'House of Parampara',
    locale: 'en_IN',
    /*
     * A raster image, deliberately. This pointed at `placeholder.svg` after
     * Phase 2, and no major social platform renders an SVG preview, so a
     * shared link would have shown no image at all. 1200x630 is the size
     * WhatsApp, Instagram, Facebook and X all expect.
     *
     * JPEG rather than PNG: the file is a photograph-like logo on a cream
     * field, which PNG stores badly. Measured 196 KB as PNG against 38 KB as
     * JPEG at quality 88, with no visible difference at preview size.
     */
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'House of Parampara, handcrafted heritage gift hampers from Tamil Nadu',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'House of Parampara | Some Bonds Are Timeless',
    description:
      'Curated, customizable nostalgia-inspired return gifts and hampers. Handcrafted in Tamil Nadu.',
    images: ['/images/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
  },
  /*
   * Sized icons, not the 1024x1024 source.
   *
   * Both of these pointed at `emblem.png`, a 2,001 KB image. A browser renders
   * a favicon at 16 to 32 pixels, so this shipped two megabytes on every page
   * view, in every tab, to draw something the size of a fingernail. The 32px
   * version is 1.8 KB.
   *
   * The Apple touch icon is flattened onto the site's light background because
   * iOS composites transparency onto black, which would have shown a dark
   * square behind the emblem.
   */
  icons: {
    icon: '/images/emblem-32.png',
    apple: '/images/apple-touch-icon.png',
  },
}

export const viewport: Viewport = {
  colorScheme: 'light dark',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#fdfbf7' },
    { media: '(prefers-color-scheme: dark)', color: '#15100d' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${playfair.variable} ${lato.variable} bg-background`}
    >
      <body className="font-sans antialiased">
        <StructuredData />
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange={false}
        >
          {children}
        </ThemeProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
