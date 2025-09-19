import * as React from 'react';

/**
 * Simple card component with a white background and border.
 */
export function Card({ className = '', ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={`bg-white border border-gray-200 rounded-xl ${className}`} {...props} />;
}