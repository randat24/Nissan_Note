import * as React from 'react';

/**
 * Badge component for displaying small status labels.
 */
export function Badge({ className = '', ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${className}`}
      {...props}
    />
  );
}