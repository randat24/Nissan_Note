"use client";

// Vehicle settings page. Allows editing vehicle information (year, engine,
// transmission, current mileage, units) and managing data import/export.
// Also includes toggle for push notifications and configuration of
// thresholds for "soon" reminders. Uses Dexie for data persistence and
// reuses shared UI components. A monochrome bottom navigation bar is
// provided at the bottom.

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Download, Bell, Info, Wrench } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { db } from "@/lib/dexie-schema-extended";
import { exportData, importData } from "@/lib/export-import";
import type { Vehicle } from "@/lib/types";
import { Icon } from "@/components/Icon";

export default function VehiclePage() {
  const router = useRouter();
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [settings, setSettings] = useState({
    notificationsEnabled: false,
    soonThresholdDays: 30,
    soonThresholdDistance: 500,
  });

  useEffect(() => {
    loadVehicle();
  }, []);

  const loadVehicle = async () => {
    const veh = await db.vehicles.get("note-01");
    setVehicle(veh || null);
  };

  const handleVehicleUpdate = async (field: keyof Vehicle, value: any) => {
    if (!vehicle) return;
    await db.vehicles.update(vehicle.id, { [field]: value });
    loadVehicle();
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      await importData(file);
      alert("Данные успешно импортированы");
      loadVehicle();
    } catch (error: any) {
      alert("Ошибка импорта: " + (error?.message || error));
    }
  };

  const handleExport = async () => {
    await exportData();
  };

  const requestNotifications = async () => {
    if ("Notification" in window) {
      const permission = await Notification.requestPermission();
      setSettings({
        ...settings,
        notificationsEnabled: permission === "granted",
      });
    }
  };

  if (!vehicle) {
    return <div className="p-4">Загрузка…</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-white border-b px-4 py-3">
        <h1 className="text-xl font-semibold">Настройки авто</h1>
      </div>
      <div className="p-4 space-y-4">
        {/* Vehicle Info */}
        <Card className="p-4">
          <h2 className="font-semibold mb-3 flex items-center gap-2">
            <Info className="w-4 h-4" /> Информация об авто
          </h2>
          <div className="space-y-3">
            <div>
              <Label htmlFor="year">Год выпуска</Label>
              <Input
                id="year"
                type="number"
                value={vehicle.year || ""}
                onChange={(e) =>
                  handleVehicleUpdate("year", parseInt(e.target.value))
                }
              />
            </div>
            <div>
              <Label htmlFor="engine">Двигатель</Label>
              <Input
                id="engine"
                value={vehicle.engine || ""}
                onChange={(e) => handleVehicleUpdate("engine", e.target.value)}
                placeholder="HR15"
              />
            </div>
            <div>
              <Label htmlFor="transmission">Трансмиссия</Label>
              <Select
                value={vehicle.transmission || ""}
                onValueChange={(value) =>
                  handleVehicleUpdate("transmission", value as any)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Выберите тип" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MT">МКПП</SelectItem>
                  <SelectItem value="AT">АКПП</SelectItem>
                  <SelectItem value="CVT">Вариатор</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="mileage">Текущий пробег</Label>
              <div className="flex gap-2">
                <Input
                  id="mileage"
                  type="number"
                  value={vehicle.currentMileage}
                  onChange={(e) =>
                    handleVehicleUpdate(
                      "currentMileage",
                      parseInt(e.target.value)
                    )
                  }
                />
                <Select
                  value={vehicle.unitDistance}
                  onValueChange={(value) =>
                    handleVehicleUpdate("unitDistance", value as any)
                  }
                >
                  <SelectTrigger className="w-24">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="km">км</SelectItem>
                    <SelectItem value="mi">mi</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </Card>
        {/* Notifications */}
        <Card className="p-4">
          <h2 className="font-semibold mb-3 flex items-center gap-2">
            <Bell className="w-4 h-4" /> Уведомления
          </h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="notifications">Push‑уведомления</Label>
              <Switch
                id="notifications"
                checked={settings.notificationsEnabled}
                onCheckedChange={requestNotifications}
              />
            </div>
            <div>
              <Label htmlFor="soonDays">Предупреждать за (дней)</Label>
              <Input
                id="soonDays"
                type="number"
                value={settings.soonThresholdDays}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    soonThresholdDays: parseInt(e.target.value),
                  })
                }
              />
            </div>
            <div>
              <Label htmlFor="soonDistance">Предупреждать за (км)</Label>
              <Input
                id="soonDistance"
                type="number"
                value={settings.soonThresholdDistance}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    soonThresholdDistance: parseInt(e.target.value),
                  })
                }
              />
            </div>
          </div>
        </Card>
        {/* Data Management */}
        <Card className="p-4">
          <h2 className="font-semibold mb-3 flex items-center gap-2">
            <Wrench className="w-4 h-4" /> Управление данными
          </h2>
          <div className="space-y-3">
            <Button
              variant="outline"
              className="w-full"
              onClick={handleExport}
            >
              <Download className="w-4 h-4 mr-2" /> Экспорт данных (JSON)
            </Button>
            <div>
              <Label htmlFor="import" className="block mb-2">
                Импорт данных
              </Label>
              <Input
                id="import"
                type="file"
                accept=".json"
                onChange={handleImport}
              />
            </div>
          </div>
        </Card>
        {/* About */}
        <Card className="p-4">
          <h2 className="font-semibold mb-3">О приложении</h2>
          <div className="text-sm text-gray-600 space-y-1">
            <p>Nissan Note Service Tracker v1.0</p>
            <p>Личный журнал обслуживания</p>
            <p className="text-xs mt-2">© 2025 • Built with ❤️ for Note owners</p>
          </div>
        </Card>
      </div>
      {/* Bottom navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
        <div className="container mx-auto max-w-md grid grid-cols-5 text-center py-2 text-xs">
          {[
            { key: "home", href: "/", label: "Домой", icon: "home" },
            { key: "journal", href: "/journal", label: "Журнал", icon: "journal" },
            { key: "catalog", href: "/catalog", label: "Каталог", icon: "catalog" },
            { key: "parts", href: "/parts", label: "Запчасти", icon: "parts" },
            { key: "vehicle", href: "/vehicle", label: "Авто", icon: "vehicle", active: true },
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