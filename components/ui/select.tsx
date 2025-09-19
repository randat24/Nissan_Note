'use client';
import * as React from 'react';

type ContextType = {
  value?: string;
  setValue?: (v: string) => void;
  open: boolean;
  setOpen: (o: boolean) => void;
  labels: Record<string, string>;
  registerLabel: (v: string, l: string) => void;
};

const SelectContext = React.createContext<ContextType>({
  open: false,
  setOpen: () => {},
  labels: {},
  registerLabel: () => {},
});

/**
 * Root select component. Wraps trigger and content components.
 */
export function Select({ value, onValueChange, children }: { value?: string; onValueChange?: (v: string) => void; children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);
  const [labels, setLabels] = React.useState<Record<string, string>>({});
  return (
    <SelectContext.Provider
      value={{
        value,
        setValue: onValueChange,
        open,
        setOpen,
        labels,
        registerLabel: (v, l) => setLabels((p) => ({ ...p, [v]: l })),
      }}
    >
      {children}
    </SelectContext.Provider>
  );
}

/**
 * Component for the trigger that toggles the select content.
 */
export function SelectTrigger({ className = '', children }: { className?: string; children: React.ReactNode }) {
  const { setOpen } = React.useContext(SelectContext);
  return (
    <button
      type="button"
      className={`h-10 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-left text-sm ${className}`}
      onClick={() => setOpen(true)}
    >
      {children}
    </button>
  );
}

/**
 * Displays the current value or placeholder.
 */
export function SelectValue({ placeholder }: { placeholder?: string }) {
  const { value, labels } = React.useContext(SelectContext);
  if (value) return <span>{labels[value] || value}</span>;
  return <span className="text-gray-400">{placeholder || ''}</span>;
}

/**
 * Container for the select options. Renders as a modal bottom sheet on mobile.
 */
export function SelectContent({ children }: { children: React.ReactNode }) {
  const { open, setOpen } = React.useContext(SelectContext);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50" onClick={() => setOpen(false)}>
      <div className="absolute inset-0 bg-black/30" />
      <div className="absolute bottom-0 left-0 right-0 mx-auto max-w-md rounded-t-2xl bg-white p-2 shadow-lg">
        {children}
      </div>
    </div>
  );
}

/**
 * Individual option within the select content.
 */
export function SelectItem({ value, children }: { value: string; children: React.ReactNode }) {
  const { setValue, setOpen, registerLabel } = React.useContext(SelectContext);
  React.useEffect(() => {
    registerLabel(value, String(children));
  }, [value, children]);
  return (
    <div
      role="option"
      className="cursor-pointer rounded-md px-3 py-2 text-sm hover:bg-gray-100"
      onClick={() => {
        setValue && setValue(value);
        setOpen(false);
      }}
    >
      {children}
    </div>
  );
}