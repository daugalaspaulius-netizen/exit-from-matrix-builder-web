import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Exit From Matrix',
  description: 'Decentralized governance & voting platform',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-black text-white">{children}</body>
    </html>
  )
}
