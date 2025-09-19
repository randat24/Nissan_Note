"use client";

// This page provides analytical reports for expenses, fuel and maintenance.
// It summarises yearly totals, half‑year summaries and upcoming recurring expenses.
// The design follows the mobile‑first aesthetic used across the app, with
// monochrome icons and a fixed bottom navigation bar.

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  FileText,
  Download,
  PieChart,
  BarChart3,
  DollarSign,
  Fuel as FuelIcon,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Icon } from "@/components/Icon";
import {
  getYearlyReport,
  getExpenseSummary,
  getUpcomingRecurring,
} from "@/lib/expense-service";
import type { YearlyReport, ExpenseSummary } from "@/types/expenses";

export default function ReportsPage() {
  const router = useRouter();
  // Use the current year by default
  const [year, setYear] = useState(new Date().getFullYear());
  const [yearlyReport, setYearlyReport] = useState<YearlyReport | null>(null);
  const [halfYearReport, setHalfYearReport] = useState<ExpenseSummary | null>(null);
  const [upcomingExpenses, setUpcomingExpenses] = useState<any[]>([]);

  // Load data whenever the selected year changes
  useEffect(() => {
    const loadReports = async () => {
      // Fetch the yearly report summarising fuel and expenses
      const yearly = await getYearlyReport("note-01", year);
      setYearlyReport(yearly);

      // Determine half‑year range: January–June or July–December based on current date
      const currentMonth = new Date().getMonth();
      const halfYearStart = currentMonth >= 6 ? `${year}-07-01` : `${year}-01-01`;
      const halfYearEnd = currentMonth >= 6 ? `${year}-12-31` : `${year}-06-30`;
      const label = currentMonth >= 6 ? "Второе полугодие" : "Первое полугодие";

      const half = await getExpenseSummary(
        "note-01",
        halfYearStart,
        halfYearEnd,
        label
      );
      setHalfYearReport(half);

      // Load upcoming recurring expenses within the next 60 days
      const upcoming = await getUpcomingRecurring("note-01");
      setUpcomingExpenses(upcoming);
    };
    loadReports();
  }, [year]);

  // Handle export of the yearly report to JSON
  const exportReport = (type: "year" | "month" | "halfyear") => {
    if (type === "year" && yearlyReport) {
      const data = {
        period: `${year} год`,
        totalExpenses: yearlyReport.totalExpenses,
        totalMileage: yearlyReport.totalMileage,
        costPerKm: yearlyReport.costPerKm,
        monthly: yearlyReport.monthlyData,
        topExpenses: yearlyReport.topExpenses,
      };
      const filename = `note-expenses-${year}.json`;
      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  // If data hasn't loaded yet, show a simple loading state
  if (!yearlyReport || !halfYearReport) {
    return <div className="p-4">Загрузка отчётов…</div>;
  }

  // Prepare derived values for display
  const yearlyTotal = yearlyReport.totalExpenses;
  const monthlyAvg = yearlyTotal / 12;
  const totalKm = yearlyReport.totalMileage;
  const costPerKm = yearlyReport.costPerKm;

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white border-b px-4 py-3 flex items-center justify-between">
        <h1 className="text-xl font-semibold">Отчёты</h1>
        <Select value={year.toString()} onValueChange={(v) => setYear(parseInt(v))}>
          <SelectTrigger className="w-24">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {[2023, 2024, 2025, 2026].map((y) => (
              <SelectItem key={y} value={y.toString()}>
                {y}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="p-4 space-y-4">
        {/* Year Summary Card */}
        <Card className="p-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm opacity-80">Итоги {year} года</p>
              <p className="text-3xl font-bold mt-1">
                {yearlyTotal.toLocaleString()} грн
              </p>
            </div>
            <FileText className="w-8 h-8 opacity-50" />
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-white/20 rounded-lg p-2 text-center">
              <p className="text-xs opacity-90">В месяц</p>
              <p className="font-semibold">
                {Math.round(monthlyAvg).toLocaleString()}
              </p>
            </div>
            <div className="bg-white/20 rounded-lg p-2 text-center">
              <p className="text-xs opacity-90">Пробег</p>
              <p className="font-semibold">
                {totalKm.toLocaleString()} км
              </p>
            </div>
            <div className="bg-white/20 rounded-lg p-2 text-center">
              <p className="text-xs opacity-90">грн/км</p>
              <p className="font-semibold">
                {costPerKm.toFixed(2)}
              </p>
            </div>
          </div>
        </Card>

        {/* Quick Reports */}
        <div className="grid grid-cols-2 gap-2">
          {/* Month report: show current month expenses from yearlyReport */}
          <Card className="p-3">
            <h3 className="text-sm font-medium mb-2">Месячный отчёт</h3>
            <p className="text-xl font-bold mb-2">
              {/* Use current month index based on current date */}
              {yearlyReport.monthlyData[new Date().getMonth()].expenses.toLocaleString()} грн
            </p>
            <Button
              size="sm"
              variant="outline"
              className="w-full"
              onClick={() => exportReport("month")}
            >
              <Download className="w-3 h-3 mr-1" />
              Скачать
            </Button>
          </Card>
          {/* Half-year report */}
          <Card className="p-3">
            <h3 className="text-sm font-medium mb-2">Полугодие</h3>
            <p className="text-xl font-bold mb-2">
              {halfYearReport.totalAmount.toLocaleString()} грн
            </p>
            <Button
              size="sm"
              variant="outline"
              className="w-full"
              onClick={() => exportReport("halfyear")}
            >
              <Download className="w-3 h-3 mr-1" />
              Скачать
            </Button>
          </Card>
        </div>

        {/* Breakdown by Category */}
        <Card className="p-4">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <PieChart className="w-4 h-4" /> Структура расходов за год
          </h3>
          <div className="space-y-2">
            {halfYearReport.byCategory.slice(0, 5).map((cat) => (
              <div
                key={cat.category}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500" />
                  <span className="text-sm">{cat.category}</span>
                </div>
                <div className="text-right">
                  <span className="font-medium">
                    {cat.amount.toLocaleString()} грн
                  </span>
                  <span className="text-xs text-gray-500 ml-2">
                    ({cat.percentage.toFixed(1)}%)
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Monthly Trend */}
        <Card className="p-4">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <BarChart3 className="w-4 h-4" /> Помесячная динамика
          </h3>
          <div className="space-y-2">
            {yearlyReport.monthlyData.map((month) => {
              const monthName = new Date(year, month.month - 1).toLocaleDateString(
                "ru-UA",
                { month: "long" }
              );
              const percentage = monthlyAvg > 0 ? ((month.expenses - monthlyAvg) / monthlyAvg) * 100 : 0;
              return (
                <div
                  key={month.month}
                  className="flex items-center justify-between py-1"
                >
                  <span className="text-sm capitalize">{monthName}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">
                      {month.expenses.toLocaleString()} грн
                    </span>
                    {percentage !== 0 && (
                      <span
                        className={`text-xs ${
                          percentage > 0 ? "text-red-600" : "text-green-600"
                        }`}
                      >
                        {percentage > 0 ? "+" : ""}
                        {percentage.toFixed(0)}%
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Cost Breakdown */}
        <Card className="p-4">
          <h3 className="font-semibold mb-3">Себестоимость километра</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm">Топливо</span>
              <span className="font-medium">
                {(
                  yearlyReport.monthlyData.reduce((sum, m) => sum + m.fuel, 0) /
                  (totalKm || 1)
                ).toFixed(2)} грн/км
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">ТО и ремонт</span>
              <span className="font-medium">
                {(
                  yearlyReport.monthlyData.reduce(
                    (sum, m) => sum + m.maintenance,
                    0
                  ) /
                  (totalKm || 1)
                ).toFixed(2)} грн/км
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Прочее</span>
              <span className="font-medium">
                {(
                  yearlyReport.monthlyData.reduce((sum, m) => sum + m.other, 0) /
                  (totalKm || 1)
                ).toFixed(2)} грн/км
              </span>
            </div>
            <div className="pt-2 border-t flex justify-between items-center">
              <span className="font-medium">Итого</span>
              <span className="font-bold text-lg">
                {costPerKm.toFixed(2)} грн/км
              </span>
            </div>
          </div>
        </Card>

        {/* Upcoming recurring expenses */}
        {upcomingExpenses.length > 0 && (
          <Card className="p-4">
            <h3 className="font-semibold mb-3">
              Предстоящие регулярные платежи
            </h3>
            <div className="space-y-2">
              {upcomingExpenses.map((expense) => (
                <div
                  key={expense.id}
                  className="flex justify-between items-center py-2 border-b last:border-0"
                >
                  <div>
                    <p className="text-sm font-medium">
                      {expense.description}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(expense.nextDate).toLocaleDateString("ru-UA")}
                    </p>
                  </div>
                    <span className="font-semibold">
                      {expense.amount.toLocaleString()} грн
                    </span>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Export actions */}
        <Card className="p-4">
          <h3 className="font-semibold mb-3">Экспорт данных</h3>
          <div className="space-y-2">
            <Button
              variant="outline"
              className="w-full"
              onClick={() => exportReport("year")}
            >
              <Download className="w-4 h-4 mr-2" />
              Скачать годовой отчёт (JSON)
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => {
                // PDF generation is not implemented; we notify for now
                alert("Функция PDF в разработке");
              }}
            >
              <FileText className="w-4 h-4 mr-2" />
              Сформировать PDF отчёт
            </Button>
          </div>
        </Card>
      </div>
      {/* Bottom navigation specific to expenses */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
        <div className="container mx-auto max-w-md grid grid-cols-5 text-center py-2 text-xs">
          {[
            { key: "home", href: "/", label: "Домой", icon: "home" },
            { key: "expenses", href: "/expenses", label: "Расходы", icon: "expenses" },
            { key: "fuel", href: "/expenses/fuel", label: "Топливо", icon: "fuel" },
            { key: "reports", href: "/expenses/reports", label: "Отчёты", icon: "reports", active: true },
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