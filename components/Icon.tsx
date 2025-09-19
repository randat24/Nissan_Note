import React from 'react';

/**
 * A simple set of monochrome SVG icons used throughout the
 * application. These icons are sized via the `className` prop
 * and inherit the current text color via `currentColor`.
 */
export function Icon({ name, className }: { name: 'home' | 'journal' | 'catalog' | 'parts' | 'vehicle' | 'expenses' | 'fuel' | 'reports'; className?: string }) {
  // Base attributes applied to all icons.
  const props = {
    className,
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.75,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    viewBox: '0 0 24 24',
  };
  switch (name) {
    case 'home':
      return (
        <svg {...props}>
          <path d="M3 10.5 12 3l9 7.5" />
          <path d="M5 10v9a1 1 0 0 0 1 1h4v-5h4v5h4a1 1 0 0 0 1-1v-9" />
        </svg>
      );
    case 'journal':
      return (
        <svg {...props}>
          <rect x="4" y="3" width="16" height="18" rx="2" />
          <path d="M8 7h8M8 11h8M8 15h8" />
        </svg>
      );
    case 'catalog':
      return (
        <svg {...props}>
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <path d="M3 10h18" />
          <path d="M9 5v14" />
        </svg>
      );
    case 'parts':
      return (
        <svg {...props}>
          <path d="M4 8l4-4v12l-4-4h8" />
          <circle cx="14" cy="12" r="4" />
          <path d="M14 8v8" />
        </svg>
      );
    case 'vehicle':
      return (
        <svg {...props}>
          <path d="M3 12l2-5a2 2 0 0 1 2-1h10a2 2 0 0 1 2 1l2 5" />
          <path d="M5 12h14" />
          <circle cx="7.5" cy="17" r="1.5" />
          <circle cx="16.5" cy="17" r="1.5" />
        </svg>
      );
    case 'expenses':
      return (
        <svg {...props}>
          <rect x="3" y="4" width="18" height="16" rx="2" />
          <path d="M7 8h10M7 12h10M7 16h6" />
        </svg>
      );
    case 'fuel':
      return (
        <svg {...props}>
          <path d="M3 7a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v11H3z" />
          <path d="M13 10l4-2v9" />
          <path d="M17 11h2a2 2 0 0 1 2 2v5" />
          <circle cx="7" cy="10" r="1.5" />
        </svg>
      );
    case 'reports':
      return (
        <svg {...props}>
          <path d="M4 19V5a1 1 0 0 1 1-1h14" />
          <rect x="6" y="7" width="12" height="12" rx="2" />
          <path d="M9 15v-4M12 15v-2M15 15v-6" />
        </svg>
      );
    default:
      return <svg {...props}><circle cx="12" cy="12" r="9" /></svg>;
  }
}