import * as React from 'react';

/**
 * Basic label component.
 */
export function Label({ className = '', ...props }: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return <label className={`text-sm font-medium text-gray-700 ${className}`} {...props} />;
}