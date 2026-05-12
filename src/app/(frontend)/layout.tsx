import React from 'react'
import './globals.css'

export const metadata = {
  title: 'GravityOverdose — design that bends gravity',
  description: 'Independent design & engineering studio.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
