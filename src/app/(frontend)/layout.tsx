import React from 'react'
import './globals.css'

export const metadata = {
  title: 'GravityOverdose — design that bends gravity',
  description: 'Independent design & engineering studio.',
}

export const viewport = {
  colorScheme: 'dark' as const,
  themeColor: '#000000',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body>{children}</body>
    </html>
  )
}
