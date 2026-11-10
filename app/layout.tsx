import type { Metadata } from 'next'
import { Inter, Merriweather } from 'next/font/google'
import './globals.css'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const merriweather = Merriweather({ 
  weight: ['300', '400', '700', '900'],
  subsets: ['latin'],
  variable: '--font-merriweather',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Iten Municipality | County Government of Elgeyo Marakwet',
    template: '%s | Iten Municipality'
  },
  description: 'Official website of Iten Municipality, County Government of Elgeyo Marakwet. A Town of Choice for Sports, Tourism and Investment.',
  keywords: [
    'Iten Municipality',
    'Elgeyo Marakwet',
    'Kenya Municipality',
    'Home of Champions',
    'Iten Kenya',
    'Athletics Capital',
    'County Government',
    'Municipal Services',
  ],
  authors: [{ name: 'Iten Municipality' }],
  creator: 'Iten Municipality',
  publisher: 'County Government of Elgeyo Marakwet',
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: 'website',
    locale: 'en_KE',
    url: 'https://iten.go.ke',
    title: 'Iten Municipality | County Government of Elgeyo Marakwet',
    description: 'Official website of Iten Municipality. A Town of Choice for Sports, Tourism and Investment.',
    siteName: 'Iten Municipality',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Iten Municipality',
    description: 'Official website of Iten Municipality, County Government of Elgeyo Marakwet.',
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${merriweather.variable}`}>
      <body className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}
