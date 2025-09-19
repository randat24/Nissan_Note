"use client";

// Fuel expenses page. Tracks fuel fill-ups, calculates consumption,
// summarises average/best/worst consumption, and displays a chart of recent
// consumption values. Users can add new refuelling records via a bottom
// sheet form. Navigation links to other expense pages and global pages
// are provided at the bottom with monochrome icons.

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Fuel,
  TrendingDown,
  TrendingUp,
  MapPin,
  BarChart3,
  Info,
  Plus,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { db } from "@/lib/dexie-schema-extended";
import { addFuelRecord, getFuelStatistics } from "@/lib/expense-service";
import type { FuelRecord } from "@/types/expenses";
import { Icon } from "@/components/Icon";

interface FuelEntryCardProps {
  record: FuelRecord;
  onClick: () => void;
}

function FuelEntryCard({ record, onClick }: FuelEntryCardProps) {
  const consumptionColor = record.consumption
    ? record.consumption <= 7
      ? "text-green-600"
      : record.consumption <= 9
      ? "text-yellow-600"
      : "text-red-600"
    : "text-gray-400";
  return (
    <Card
      className="p-3 cursor-pointer hover:shadow-md transition-all"
      onClick={onClick}
    >
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Fuel className="w-4 h-4 text-gray-500" />
            <span className="font-medium text-sm">{record.station}</span>
          </div>
          <div className="text-xs text-gray-600 space-y-1">
            <p>
              {new Date(record.date).toLocaleDateString("ru-UA")} •{' '}
              {record.mileage.toLocaleString()} км
            </p>
            <p>
              {record.liters} л {record.fuelType} @ {record.pricePerLiter}{' '}
              грн/л
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="font-semibold text-lg">
            {record.totalPrice.toLocaleString()} грн
          </p>
          {record.consumption && (
            <p className={`text-xs font-medium ${consumptionColor}`}>
              {record.consumption.toFixed(1)} л/100км
            </p>
          )}
        </div>
      </div>
    </Card>
  );
}

export default function FuelPage() {
  const router = useRouter();
  const [records, setRecords] = useState<FuelRecord[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [lastMileage, setLastMileage] = useState(0);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    mileage: "",
    previousMileage: "",
    liters: "",
    pricePerLiter: "",
    totalPrice: "",
    station: "",
    fuelType: "A95" as const,
    fullTank: true,
  });

  // Popular gas stations in Ukraine
  const stations = [
    "WOG",
    "OKKO",
    "UPG",
    "SOCAR",
    "Shell",
    "KLO",
    "БРСМ",
    "ANP",
    "Другая",
  ];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const fuel = await db.fuelRecords
      .where("vehicleId")
      .equals("note-01")
      .reverse()
      .toArray();
    setRecords(fuel);
    if (fuel.length > 0) {
      setLastMileage(fuel[0].mileage);
      setFormData((prev) => ({ ...prev, previousMileage: fuel[0].mileage.toString() }));
    }
    const statistics = await getFuelStatistics("note-01");
    setStats(statistics);
  };

  const handleSubmit = async () => {
    const liters = parseFloat(formData.liters);
    const pricePerLiter = parseFloat(formData.pricePerLiter);
    const totalPrice = formData.totalPrice
      ? parseFloat(formData.totalPrice)
      : liters * pricePerLiter;
    await addFuelRecord({
      vehicleId: "note-01",
      date: formData.date,
      mileage: parseInt(formData.mileage),
      previousMileage: formData.previousMileage
        ? parseInt(formData.previousMileage)
        : undefined,
      liters,
      pricePerLiter,
      totalPrice,
      station: formData.station,
      fuelType: formData.fuelType,
      fullTank: formData.fullTank,
      note: "",
    });
    setIsSheetOpen(false);
    // Reset fields except date and fuelType
    setFormData({
      date: new Date().toISOString().split("T")[0],
      mileage: "",
      previousMileage: formData.fullTank
        ? formData.mileage
        : formData.previousMileage,
      liters: "",
      pricePerLiter: "",
      totalPrice: "",
      station: "",
      fuelType: formData.fuelType,
      fullTank: true,
    });
    loadData();
  };

  // Auto-calculate total when liters or price changes
  useEffect(() => {
    if (formData.liters && formData.pricePerLiter) {
      const total = parseFloat(formData.liters) * parseFloat(formData.pricePerLiter);
      setFormData((prev) => ({ ...prev, totalPrice: total.toFixed(2) }));
    }
  }, [formData.liters, formData.pricePerLiter]);

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white border-b px-4 py-3">
        <div className="flex items-center gap-3">
          <button onClick={() => router.back()}>
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-semibold flex-1">Учёт топлива</h1>
          <Button size="sm" onClick={() => setIsSheetOpen(true)}>
            <Plus className="w-4 h-4 mr-1" />
            Заправка
          </Button>
        </div>
      </div>
      <div className="p-4 space-y-4">
        {/* Main Stats */}
        {stats && (
          <>
            <Card className="p-4 bg-gradient-to-r from-red-500 to-orange-500 text-white">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm opacity-90">Средний расход</p>
                  <p className="text-3xl font-bold mt-1">
                    {stats.avgConsumption.toFixed(1)} л/100км
                  </p>
                  <div className="flex items-center gap-4 mt-2 text-sm">
                    <span className="flex items-center gap-1">
                      <TrendingDown className="w-4 h-4" /> Лучший:{" "}
                      {stats.bestConsumption.toFixed(1)}
                    </span>
                    <span className="flex items-center gap-1">
                      <TrendingUp className="w-4 h-4" /> Худший:{" "}
                      {stats.worstConsumption.toFixed(1)}
                    </span>
                  </div>
                </div>
                <Fuel className="w-8 h-8 opacity-50" />
              </div>
            </Card>
            <div className="grid grid-cols-2 gap-2">
              <Card className="p-3">
                <p className="text-xs text-gray-500">Всего заправлено</p>
                <p className="font-semibold text-lg">
                  {stats.totalLiters.toFixed(0)} л
                </p>
                <p className="text-sm text-gray-600">
                  {stats.totalCost.toLocaleString()} грн
                </p>
              </Card>
              <Card className="p-3">
                <p className="text-xs text-gray-500">Средняя цена</p>
                <p className="font-semibold text-lg">
                  {stats.avgPrice.toFixed(2)} грн/л
                </p>
                <p className="text-sm text-gray-600">
                  {stats.costPerKm.toFixed(2)} грн/км
                </p>
              </Card>
            </div>
            {stats.favoriteStation && (
              <Card className="p-3 bg-blue-50">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-blue-600" />
                  <span className="text-sm">
                    Частая АЗС: <span className="font-medium">{stats.favoriteStation}</span>
                  </span>
                </div>
              </Card>
            )}
          </>
        )}
        {/* Consumption Chart */}
        {records.length > 5 && (
          <Card className="p-4">
            <h3 className="font-semibold mb-3 flex items-center gap-2 text-sm">
              <BarChart3 className="w-4 h-4" /> Динамика расхода (последние 10)
            </h3>
            <div className="flex items-end gap-1 h-24">
              {records
                .slice(0, 10)
                .reverse()
                .map((record, idx) => {
                  if (!record.consumption) return null;
                  const height = (record.consumption / 12) * 100; // assume max 12 l/100km
                  const color = record.consumption <= 7
                    ? "bg-green-500"
                    : record.consumption <= 9
                    ? "bg-yellow-500"
                    : "bg-red-500";
                  return (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-1">
                      <div className="text-xs">
                        {record.consumption.toFixed(1)}
                      </div>
                      <div
                        className={`${color} w-full rounded-t`}
                        style={{ height: `${height}%`, minHeight: "4px" }}
                      />
                    </div>
                  );
                })}
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Зелёный: ≤7 л/100км • Жёлтый: 7‑9 л/100км • Красный: &gt;9 л/100км
            </p>
          </Card>
        )}
        {/* Recent Records */}
        <div>
          <h3 className="font-semibold mb-3">История заправок</h3>
          {records.length > 0 ? (
            <div className="space-y-2">
              {records.map((record) => (
                <FuelEntryCard key={record.id} record={record} onClick={() => {}} />
              ))}
            </div>
          ) : (
            <Card className="p-8 text-center text-gray-500">
              <Fuel className="w-12 h-12 mx-auto mb-2 text-gray-300" />
              Нет записей о заправках
            </Card>
          )}
        </div>
      </div>
      {/* Add Fuel Sheet */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent
          side="bottom"
          className="h-[85vh] overflow-y-auto"
        >
          <SheetHeader>
            <SheetTitle>Новая заправка</SheetTitle>
            <SheetDescription>Добавьте информацию о заправке</SheetDescription>
          </SheetHeader>
          <div className="mt-6 space-y-4">
            {/* Date and Mileage */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="date">Дата</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) =>
                    setFormData({ ...formData, date: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="mileage">Пробег сейчас (км) *</Label>
                <Input
                  id="mileage"
                  type="number"
                  placeholder={lastMileage.toString()}
                  value={formData.mileage}
                  onChange={(e) =>
                    setFormData({ ...formData, mileage: e.target.value })
                  }
                />
              </div>
            </div>
            {/* Full Tank */}
            <Card className="p-3 bg-yellow-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Info className="w-4 h-4 text-yellow-600" />
                  <Label htmlFor="fullTank">Полный бак?</Label>
                </div>
                <Switch
                  id="fullTank"
                  checked={formData.fullTank}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, fullTank: checked })
                  }
                />
              </div>
              <p className="text-xs text-gray-600 mt-2">
                Для расчёта расхода нужны данные между полными баками
              </p>
            </Card>
            {/* Previous Mileage (for consumption) */}
            {formData.fullTank && (
              <div>
                <Label htmlFor="previousMileage">Пробег прошлой заправки (км)</Label>
                <Input
                  id="previousMileage"
                  type="number"
                  placeholder="Для расчёта расхода"
                  value={formData.previousMileage}
                  onChange={(e) =>
                    setFormData({ ...formData, previousMileage: e.target.value })
                  }
                />
                {formData.previousMileage && formData.mileage && (
                  <p className="text-sm text-gray-600 mt-1">
                    Проехали: {parseInt(formData.mileage) - parseInt(formData.previousMileage)} км
                  </p>
                )}
              </div>
            )}
            {/* Station */}
            <div>
              <Label htmlFor="station">АЗС *</Label>
              <Select
                value={formData.station}
                onValueChange={(value) => setFormData({ ...formData, station: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Выберите АЗС" />
                </SelectTrigger>
                <SelectContent>
                  {stations.map((station) => (
                    <SelectItem key={station} value={station}>
                      {station}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {/* Fuel Type */}
            <div>
              <Label htmlFor="fuelType">Тип топлива</Label>
              <Select
                value={formData.fuelType}
                onValueChange={(value) => setFormData({ ...formData, fuelType: value as any })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="A92">А‑92</SelectItem>
                  <SelectItem value="A95">А‑95</SelectItem>
                  <SelectItem value="A95+">А‑95+</SelectItem>
                  <SelectItem value="Diesel">Дизель</SelectItem>
                  <SelectItem value="Gas">Газ</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {/* Liters and Price */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="liters">Литров *</Label>
                <Input
                  id="liters"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={formData.liters}
                  onChange={(e) =>
                    setFormData({ ...formData, liters: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="pricePerLiter">Цена за литр *</Label>
                <Input
                  id="pricePerLiter"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={formData.pricePerLiter}
                  onChange={(e) =>
                    setFormData({ ...formData, pricePerLiter: e.target.value })
                  }
                />
              </div>
            </div>
            {/* Total Price (auto-calculated) */}
            <div>
              <Label htmlFor="totalPrice">Итого (грн)</Label>
              <Input
                id="totalPrice"
                type="number"
                step="0.01"
                value={formData.totalPrice}
                onChange={(e) =>
                  setFormData({ ...formData, totalPrice: e.target.value })
                }
                className="font-semibold text-lg"
              />
            </div>
            {/* Preview consumption */}
            {formData.fullTank && formData.previousMileage && formData.mileage && formData.liters && (
              <Card className="p-3 bg-green-50">
                <p className="text-sm font-medium">Расход будет:</p>
                <p className="text-2xl font-bold text-green-600">
                  {(
                    (parseFloat(formData.liters) /
                      (parseInt(formData.mileage) - parseInt(formData.previousMileage))) *
                    100
                  ).toFixed(1)}{' '}
                  л/100км
                </p>
              </Card>
            )}
            <Button
              className="w-full"
              size="lg"
              onClick={handleSubmit}
              disabled={
                !formData.mileage ||
                !formData.liters ||
                !formData.pricePerLiter ||
                !formData.station
              }
            >
              Сохранить заправку
            </Button>
          </div>
        </SheetContent>
      </Sheet>
      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
        <div className="container mx-auto max-w-md grid grid-cols-5 text-center py-2 text-xs">
          {[
            { key: "home", href: "/", label: "Домой", icon: "home" },
            { key: "expenses", href: "/expenses", label: "Расходы", icon: "expenses" },
            { key: "fuel", href: "/expenses/fuel", label: "Топливо", icon: "fuel", active: true },
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