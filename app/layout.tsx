import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Nissan Note Tracker',
  description: 'Личный бортовой журнал Nissan Note',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-screen" suppressHydrationWarning={true}>
        {children}
      </body>
    </html>
  );
}