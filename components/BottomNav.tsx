import React from 'react';
import { Icon } from './Icon';

/**
 * Bottom navigation bar used across multiple pages. Pass in the active
 * route key to highlight the corresponding nav item. The component
 * renders simple anchor tags; navigation is performed via full page
 * reloads. If you wish to use client-side navigation, replace the
 * anchors with Link components from next/navigation.
 */
export function BottomNav({ active }: { active: 'home' | 'journal' | 'catalog' | 'parts' | 'vehicle' | 'expenses' | 'fuel' | 'reports' }) {
  // Define the routes and their labels/icons. Some routes share the
  // same underlying page (e.g., the top-level expenses page), but we
  // differentiate on the nav for clarity.
  const items: Array<{ key: typeof active; href: string; label: string; icon: typeof active }> = [
    { key: 'home', href: '/', label: 'Домой', icon: 'home' },
    { key: 'journal', href: '/journal', label: 'Журнал', icon: 'journal' },
    { key: 'catalog', href: '/catalog', label: 'Каталог', icon: 'catalog' },
    { key: 'parts', href: '/parts', label: 'Запчасти', icon: 'parts' },
    { key: 'vehicle', href: '/vehicle', label: 'Авто', icon: 'vehicle' },
  ];
  // If the active route corresponds to a sub-route under expenses (fuel or reports),
  // treat it as the parts slot for layout consistency; however, the active
  // highlight still applies.
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
      <div className="container mx-auto max-w-md grid grid-cols-5 text-center py-2 text-xs">
        {items.map((item) => {
          const isActive = active === item.key || (active === 'fuel' && item.key === 'parts') || (active === 'reports' && item.key === 'parts') || (active === 'expenses' && item.key === 'parts');
          return (
            <a
              key={item.key}
              href={item.href}
              className={`flex flex-col items-center justify-center gap-1 ${
                isActive ? 'text-neutral-900 font-semibold' : 'text-gray-500'
              }`}
            >
              <Icon name={item.icon} className="w-5 h-5" />
              <span>{item.label}</span>
            </a>
          );
        })}
      </div>
    </nav>
  );
}