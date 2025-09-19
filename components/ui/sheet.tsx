'use client';
import * as React from 'react';

interface SheetContextValue {
  open: boolean;
  setOpen: (o: boolean) => void;
}

const SheetContext = React.createContext<SheetContextValue | null>(null);

/**
 * Root sheet component controlling open state.
 */
export function Sheet({ open, onOpenChange, children }: { open: boolean; onOpenChange: (o: boolean) => void; children: React.ReactNode }) {
  return <SheetContext.Provider value={{ open, setOpen: onOpenChange }}>{children}</SheetContext.Provider>;
}

/**
 * Wraps the sheet content. Renders nothing when closed.
 */
export function SheetContent({ side = 'bottom', className = '', children }: { side?: 'bottom' | 'right' | 'left'; className?: string; children: React.ReactNode }) {
  const ctx = React.useContext(SheetContext);
  if (!ctx || !ctx.open) return null;
  const handleBackdropClick = () => ctx.setOpen(false);
  const panelClass = side === 'bottom' ? 'left-0 right-0 bottom-0' : side === 'right' ? 'top-0 bottom-0 right-0' : 'top-0 bottom-0 left-0';
  return (
    <div className="fixed inset-0 z-50" onClick={handleBackdropClick}>
      <div className="absolute inset-0 bg-black/30" />
      <div
        className={`absolute ${panelClass} mx-auto max-w-md rounded-t-2xl bg-white p-4 shadow-lg ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}

export function SheetHeader({ children }: { children: React.ReactNode }) {
  return <div className="space-y-1">{children}</div>;
}

export function SheetTitle({ children }: { children: React.ReactNode }) {
  return <div className="text-base font-semibold">{children}</div>;
}

export function SheetDescription({ children }: { children: React.ReactNode }) {
  return <div className="text-sm text-gray-600">{children}</div>;
}