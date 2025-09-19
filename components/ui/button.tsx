import * as React from 'react';

/**
 * Button component supporting different variants and sizes.
 */
export function Button({
  className = '',
  variant = 'default',
  size = 'md',
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}) {
  const base =
    'inline-flex items-center justify-center rounded-lg font-medium transition focus:outline-none';
  const v =
    variant === 'outline'
      ? 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
      : variant === 'ghost'
      ? 'bg-transparent text-gray-700 hover:bg-gray-100'
      : 'bg-neutral-900 text-white hover:bg-neutral-800';
  const s =
    size === 'sm'
      ? 'text-sm px-3 py-1.5'
      : size === 'lg'
      ? 'text-base px-5 py-3'
      : 'text-sm px-4 py-2';
  return <button className={`${base} ${v} ${s} ${className}`} {...props} />;
}