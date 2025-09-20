import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Nissan Note Tracker',
  description: 'Личный бортовой журнал Nissan Note',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body style={{
        minHeight: '100dvh',
        background: 'linear-gradient(135deg, #f8fafc 0%, #dbeafe 50%, #e0e7ff 100%)',
        color: '#0f172a',
        WebkitFontSmoothing: 'antialiased',
        MozOsxFontSmoothing: 'grayscale'
      }} suppressHydrationWarning>
        <div style={{maxWidth: '1200px', margin: '0 auto', padding: '0 1rem', paddingBottom: '5rem'}}>{children}</div>
      </body>
    </html>
  )
}