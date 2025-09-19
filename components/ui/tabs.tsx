'use client';
import * as React from 'react';

interface TabsContextValue {
  value: string;
  onValueChange: (v: string) => void;
}
const TabsContext = React.createContext<TabsContextValue | null>(null);

export interface TabsProps {
  value: string;
  onValueChange: (v: string) => void;
  children: React.ReactNode;
  className?: string;
}

/**
 * Root Tabs component providing context for triggers and content.
 */
export function Tabs({ value, onValueChange, children, className = '' }: TabsProps) {
  return (
    <div className={className}>
      <TabsContext.Provider value={{ value, onValueChange }}>{children}</TabsContext.Provider>
    </div>
  );
}

export function TabsList({ className = '', children }: { className?: string; children: React.ReactNode }) {
  return <div className={`flex rounded-lg bg-gray-100 ${className}`}>{children}</div>;
}

export function TabsTrigger({ value, children }: { value: string; children: React.ReactNode }) {
  const ctx = React.useContext(TabsContext);
  if (!ctx) return null;
  const active = ctx.value === value;
  return (
    <button
      className={`flex-1 rounded-md px-3 py-2 text-sm transition ${active ? 'bg-white shadow-sm font-medium' : 'text-gray-600'}`}
      onClick={() => ctx.onValueChange(value)}
    >
      {children}
    </button>
  );
}

export interface TabsContentProps {
  value: string;
  children: React.ReactNode;
  className?: string;
}

export function TabsContent({ value, children, className = '' }: TabsContentProps) {
  const ctx = React.useContext(TabsContext);
  if (!ctx || ctx.value !== value) return null;
  return <div className={`mt-3 ${className}`}>{children}</div>;
}