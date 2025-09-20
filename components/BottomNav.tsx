import Link from 'next/link'
import { Icon } from './Icon'

type Tab = 'home' | 'journal' | 'catalog' | 'parts' | 'vehicle' | 'expenses' | 'fuel' | 'reports'

export function BottomNav({ active }: { active: Tab }) {
  const items: Array<{ key: Tab; href: string; label: string; icon: Tab }> = [
    { key: 'home',     href: '/',            label: 'Домой',     icon: 'home' },
    { key: 'journal',  href: '/journal',     label: 'Журнал',    icon: 'journal' },
    { key: 'catalog',  href: '/catalog',     label: 'Каталог',   icon: 'catalog' },
    { key: 'parts',    href: '/parts',       label: 'Запчасти',  icon: 'parts' },
    { key: 'vehicle',  href: '/vehicle',     label: 'Авто',      icon: 'vehicle' },
  ]

  return (
    <nav style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      zIndex: 40,
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(8px)',
      borderTop: '1px solid rgba(0, 0, 0, 0.05)'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 1rem'
      }}>
        <ul style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(5, 1fr)',
          padding: '0.5rem 0',
          margin: 0,
          listStyle: 'none'
        }}>
          {items.map((item) => {
            const isActive =
              active === item.key ||
              (['fuel','reports','expenses'].includes(active) && item.key === 'parts')

            return (
              <li key={item.key} style={{display: 'flex', justifyContent: 'center'}}>
                <Link
                  href={item.href}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '0.25rem',
                    fontSize: '0.75rem',
                    textDecoration: 'none',
                    color: isActive ? '#2563eb' : '#6b7280',
                    transition: 'color 0.2s'
                  }}
                >
                  <Icon name={item.icon} size={24} />
                  <span>{item.label}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      </div>
    </nav>
  )
}