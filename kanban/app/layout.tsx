import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Cursor Project Master Kanban',
  description: 'Cursor Project Master - AI-Powered Development Interface',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
