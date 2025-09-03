import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Poetry Generator - Create Beautiful Poems with AI',
  description: 'Generate unique, personalized poems using advanced AI. Choose themes, styles, and moods to create beautiful poetry instantly.',
  keywords: ['poetry', 'poem generator', 'AI poetry', 'creative writing', 'haiku', 'sonnet'],
  authors: [{ name: 'Poetry Generator' }],
  openGraph: {
    title: 'Poetry Generator - Create Beautiful Poems with AI',
    description: 'Generate unique, personalized poems using advanced AI',
    type: 'website',
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
          {children}
        </div>
      </body>
    </html>
  )
}