import type { Metadata } from 'next'
import { Inter, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from '@/components/ui/sonner'
import './globals.css'

const _inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const _geistMono = Geist_Mono({ subsets: ['latin'], variable: '--font-geist-mono' })

export const metadata: Metadata = {
  title: 'Codeeit SSL Generator - Free SSL Certificates',
  description: 'Generate free SSL certificates powered by Let\'s Encrypt. Fast, simple, and beginner-friendly SSL for your website.',
  openGraph: {
    title: 'Codeeit SSL Generator - Free SSL Certificates',
    description: 'Generate free SSL certificates powered by Let\'s Encrypt. Fast, simple, and beginner-friendly SSL for your website.',
    url: 'https://codeeit.co.tz',
    siteName: 'Codeeit Technologies',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Codeeit SSL Generator - Free SSL Certificates',
    description: 'Generate free SSL certificates powered by Let\'s Encrypt. Fast, simple, and beginner-friendly SSL for your website.',
  },
  icons: {
    icon: [
      { url: '/images/codeeit-logo.png' },
    ],
  },
}

export const viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#0f172a' },
    { media: '(prefers-color-scheme: dark)', color: '#0f172a' },
  ],
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="bg-background" suppressHydrationWarning>
      <body className="font-sans antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
