'use client';
import * as React from 'react';

/**
 * Toggle switch component implemented as a checkbox.
 */
export function Switch(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="inline-flex items-center cursor-pointer">
      <input type="checkbox" className="sr-only peer" {...props} />
      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-neutral-400 rounded-full peer peer-checked:bg-neutral-900 transition">
        <div className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform peer-checked:translate-x-5" />
      </div>
    </label>
  );
}