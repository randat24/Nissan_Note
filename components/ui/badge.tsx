import * as React from 'react';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'outline' | 'secondary' | 'destructive';
}

/**
 * Badge component for displaying small status labels.
 */
export function Badge({ className = '', variant = 'default', ...props }: BadgeProps) {
  const variantClasses = {
    default: 'bg-blue-500 text-white border-blue-500',
    outline: 'bg-transparent text-gray-700 border-gray-300',
    secondary: 'bg-gray-100 text-gray-800 border-gray-200',
    destructive: 'bg-red-500 text-white border-red-500',
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${variantClasses[variant]} ${className}`}
      {...props}
    />
  );
}