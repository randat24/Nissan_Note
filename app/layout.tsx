import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Nissan Note Tracker',
  description: 'Личный бортовой журнал Nissan Note',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body className="min-h-screen" suppressHydrationWarning={true}>
        {children}
      </body>
    </html>
  );
}