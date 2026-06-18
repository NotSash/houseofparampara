import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Playfair_Display, Lato } from 'next/font/google'
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

export const metadata: Metadata = {
  title:
    'House of Parampara | Heritage Gifts, Hampers & Nostalgic Keepsakes — Some Bonds Are Timeless',
  description:
    'Discover House of Parampara — curated, customizable nostalgia-inspired return gifts, hampers, and keepsakes for weddings, festivals, and family traditions. Handcrafted in Tamil Nadu. Some Bonds Are Timeless.',
  generator: 'v0.app',
  metadataBase: new URL('https://houseofparampara.example'),
  openGraph: {
    title: 'House of Parampara | Some Bonds Are Timeless',
    description:
      'Curated, customizable nostalgia-inspired return gifts, hampers, and keepsakes for weddings, festivals, and family traditions. Handcrafted in Tamil Nadu.',
    type: 'website',
    images: [{ url: '/images/hero.png', width: 1200, height: 630 }],
  },
  icons: {
    icon: '/images/emblem.png',
    apple: '/images/emblem.png',
  },
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#5C2C20',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${lato.variable} bg-background`}
    >
      <body className="font-sans antialiased">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
