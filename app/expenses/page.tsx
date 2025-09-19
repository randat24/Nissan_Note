"use client";

// Top-level expenses page. This page acts as an entry point to the
// expenses subsystem. It provides quick links to the fuel tracking and
// reporting pages. In future versions it could also allow adding
// one‑off expenses across categories. A custom bottom navigation bar
// highlights the Expenses tab.

import { Icon } from "@/components/Icon";
import { useRouter } from "next/navigation";

export default function ExpensesPage() {
  const router = useRouter();
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-white border-b px-4 py-3">
        <h1 className="text-xl font-semibold">Расходы</h1>
      </div>
      <div className="p-4 space-y-4">
        <div
          className="card p-4 flex justify-between items-center cursor-pointer hover:bg-gray-50"
          onClick={() => router.push("/expenses/fuel")}
        >
          <div>
            <h2 className="font-semibold text-base">Учёт топлива</h2>
            <p className="text-sm text-gray-600 mt-1">
              Добавляйте заправки и следите за расходом
            </p>
          </div>
          <Icon name="fuel" className="w-6 h-6 text-gray-400" />
        </div>
        <div
          className="card p-4 flex justify-between items-center cursor-pointer hover:bg-gray-50"
          onClick={() => router.push("/expenses/reports")}
        >
          <div>
            <h2 className="font-semibold text-base">Отчёты</h2>
            <p className="text-sm text-gray-600 mt-1">
              Анализируйте свои расходы и стоимость мили
            </p>
          </div>
          <Icon name="reports" className="w-6 h-6 text-gray-400" />
        </div>
      </div>
      {/* Bottom navigation specific to expenses */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
        <div className="container mx-auto max-w-md grid grid-cols-5 text-center py-2 text-xs">
          {[
            { key: "home", href: "/", label: "Домой", icon: "home" },
            { key: "expenses", href: "/expenses", label: "Расходы", icon: "expenses", active: true },
            { key: "fuel", href: "/expenses/fuel", label: "Топливо", icon: "fuel" },
            { key: "reports", href: "/expenses/reports", label: "Отчёты", icon: "reports" },
            { key: "vehicle", href: "/vehicle", label: "Авто", icon: "vehicle" },
          ].map((item) => (
            <a
              key={item.key}
              href={item.href}
              className={`flex flex-col items-center justify-center gap-1 ${
                item.active ? "text-neutral-900 font-semibold" : "text-gray-500"
              }`}
            >
              <Icon name={item.icon as any} className="w-5 h-5" />
              <span>{item.label}</span>
            </a>
          ))}
        </div>
      </nav>
    </div>
  );
}