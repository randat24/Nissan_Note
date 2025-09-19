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
    fill: 'currentColor',
    viewBox: '0 0 24 24',
  };
  switch (name) {
    case 'home':
      return (
        <svg {...props}>
          <path d="M12.707 2.293a1 1 0 00-1.414 0l-7 7A1 1 0 005 11h1v9a1 1 0 001 1h3a1 1 0 001-1v-6h2v6a1 1 0 001 1h3a1 1 0 001-1v-9h1a1 1 0 00.707-1.707l-7-7z" />
        </svg>
      );
    case 'journal':
      return (
        <svg {...props}>
          <path d="M6 2a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V4a2 2 0 00-2-2H6zm2 5h8a1 1 0 110 2H8a1 1 0 110-2zm0 4h8a1 1 0 110 2H8a1 1 0 110-2zm0 4h5a1 1 0 110 2H8a1 1 0 110-2z" />
        </svg>
      );
    case 'catalog':
      return (
        <svg {...props}>
          <path d="M5 4a2 2 0 00-2 2v12a2 2 0 002 2h14a2 2 0 002-2V6a2 2 0 00-2-2H5zm0 4V6h14v2H5zm4 2v8H5v-8h4zm2 0h8v8h-8v-8z" />
        </svg>
      );
    case 'parts':
      return (
        <svg {...props}>
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      );
    case 'vehicle':
      return (
        <svg {...props}>
          <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.22.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z" />
        </svg>
      );
    case 'expenses':
      return (
        <svg {...props}>
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
        </svg>
      );
    case 'fuel':
      return (
        <svg {...props}>
          <path d="M19.77 7.23l.01-.01-3.72-3.72L15 4.56l2.11 2.11c-.94.36-1.61 1.26-1.61 2.33 0 1.38 1.12 2.5 2.5 2.5.36 0 .69-.08 1-.21v7.21c0 .55-.45 1-1 1s-1-.45-1-1V14c0-1.1-.9-2-2-2h-1V5c0-1.1-.9-2-2-2H6c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h6c1.1 0 2-.9 2-2v-2h1c0 1.66 1.34 3 3 3s3-1.34 3-3V9c0-.69-.28-1.32-.73-1.77zM12 10H6V5h6v5z" />
        </svg>
      );
    case 'reports':
      return (
        <svg {...props}>
          <path d="M5 9.2h3V19H5zM10.6 5h2.8v14h-2.8zm5.6 8H19v6h-2.8z" />
        </svg>
      );
    default:
      return <svg {...props}><circle cx="12" cy="12" r="9" /></svg>;
  }
}