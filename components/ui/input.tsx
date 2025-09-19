import * as React from 'react';

/**
 * Base input component with subtle styling.
 */
export function Input({ className = '', ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={`w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-neutral-400 ${className}`}
      {...props}
    />
  );
}