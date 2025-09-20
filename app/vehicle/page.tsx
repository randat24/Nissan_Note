"use client";

import React, { useState, useEffect } from "react";
import { Download, Bell, Info, Wrench } from "lucide-react";
import { db } from "@/lib/dexie-schema-extended";
import { exportData, importData } from "@/lib/export-import";
import type { Vehicle } from "@/lib/types";
import { Icon } from "@/components/Icon";
import { BottomNav } from "@/components/BottomNav";

export default function VehiclePage() {
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

  const handleVehicleUpdate = async (field: keyof Vehicle, value: string | number | boolean) => {
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
    return (
      <div style={{padding: '2rem', textAlign: 'center'}}>
        <div style={{color: '#6b7280'}}>Загрузка…</div>
      </div>
    );
  }

  return (
    <div style={{minHeight: '100vh', paddingBottom: '5rem'}}>
      {/* Header */}
      <header style={{padding: '1.5rem', background: 'linear-gradient(135deg, #dbeafe 0%, #ffffff 50%, #f3e8ff 100%)'}}>
        <h1 className="gradient-text" style={{fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem'}}>Настройки авто</h1>
        <p style={{color: '#6b7280', fontSize: '1rem'}}>Управление информацией об автомобиле и настройками</p>
      </header>

      <div style={{padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1.5rem'}}>
        {/* Vehicle Info */}
        <div className="card-modern" style={{padding: '1.5rem'}}>
          <h2 style={{fontWeight: '600', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.125rem'}}>
            <Info style={{width: '20px', height: '20px'}} /> Информация об авто
          </h2>
          <div style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
            <div>
              <label style={{display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem', color: '#374151'}}>
                Год выпуска
              </label>
              <input
                type="number"
                value={vehicle.year || ""}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleVehicleUpdate("year", parseInt(e.target.value))
                }
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '0.5rem',
                  border: '1px solid #d1d5db',
                  backgroundColor: 'white'
                }}
              />
            </div>
            
            <div>
              <label style={{display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem', color: '#374151'}}>
                Двигатель
              </label>
              <input
                value={vehicle.engine || ""}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleVehicleUpdate("engine", e.target.value)}
                placeholder="HR15"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '0.5rem',
                  border: '1px solid #d1d5db',
                  backgroundColor: 'white'
                }}
              />
            </div>
            
            <div>
              <label style={{display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem', color: '#374151'}}>
                Трансмиссия
              </label>
              <select
                value={vehicle.transmission || ""}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  handleVehicleUpdate("transmission", e.target.value)
                }
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '0.5rem',
                  border: '1px solid #d1d5db',
                  backgroundColor: 'white'
                }}
              >
                <option value="">Выберите тип</option>
                <option value="MT">МКПП</option>
                <option value="AT">АКПП</option>
                <option value="CVT">Вариатор</option>
              </select>
            </div>
            
            <div>
              <label style={{display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem', color: '#374151'}}>
                Текущий пробег
              </label>
              <div style={{display: 'flex', gap: '0.5rem'}}>
                <input
                  type="number"
                  value={vehicle.currentMileage}
                  onChange={(e) =>
                    handleVehicleUpdate(
                      "currentMileage",
                      parseInt(e.target.value)
                    )
                  }
                  style={{
                    flex: 1,
                    padding: '0.75rem',
                    borderRadius: '0.5rem',
                    border: '1px solid #d1d5db',
                    backgroundColor: 'white'
                  }}
                />
                <select
                  value={vehicle.unitDistance}
                  onChange={(e) =>
                    handleVehicleUpdate("unitDistance", e.target.value as any)
                  }
                  style={{
                    width: '80px',
                    padding: '0.75rem',
                    borderRadius: '0.5rem',
                    border: '1px solid #d1d5db',
                    backgroundColor: 'white'
                  }}
                >
                  <option value="km">km</option>
                  <option value="mi">mi</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="card-modern" style={{padding: '1.5rem'}}>
          <h2 style={{fontWeight: '600', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.125rem'}}>
            <Bell style={{width: '20px', height: '20px'}} /> Уведомления
          </h2>
          <div style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
              <label style={{fontSize: '0.875rem', fontWeight: '500', color: '#374151'}}>
                Push‑уведомления
              </label>
              <button
                onClick={requestNotifications}
                style={{
                  width: '44px',
                  height: '24px',
                  borderRadius: '12px',
                  backgroundColor: settings.notificationsEnabled ? '#2563eb' : '#d1d5db',
                  border: 'none',
                  cursor: 'pointer',
                  position: 'relative',
                  transition: 'background-color 0.2s'
                }}
              >
                <div style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  backgroundColor: 'white',
                  position: 'absolute',
                  top: '2px',
                  left: settings.notificationsEnabled ? '22px' : '2px',
                  transition: 'left 0.2s'
                }}></div>
              </button>
            </div>
            
            <div>
              <label style={{display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem', color: '#374151'}}>
                Предупреждать за (дней)
              </label>
              <input
                type="number"
                value={settings.soonThresholdDays}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    soonThresholdDays: parseInt(e.target.value),
                  })
                }
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '0.5rem',
                  border: '1px solid #d1d5db',
                  backgroundColor: 'white'
                }}
              />
            </div>
            
            <div>
              <label style={{display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem', color: '#374151'}}>
                Предупреждать за (km)
              </label>
              <input
                type="number"
                value={settings.soonThresholdDistance}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    soonThresholdDistance: parseInt(e.target.value),
                  })
                }
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '0.5rem',
                  border: '1px solid #d1d5db',
                  backgroundColor: 'white'
                }}
              />
            </div>
          </div>
        </div>

        {/* Data Management */}
        <div className="card-modern" style={{padding: '1.5rem'}}>
          <h2 style={{fontWeight: '600', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.125rem'}}>
            <Wrench style={{width: '20px', height: '20px'}} /> Управление данными
          </h2>
          <div style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
            <button
              className="btn-secondary"
              onClick={handleExport}
              style={{
                width: '100%',
                padding: '0.75rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem'
              }}
            >
              <Download style={{width: '16px', height: '16px'}} /> Экспорт данных (JSON)
            </button>
            
            <div>
              <label style={{display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem', color: '#374151'}}>
                Импорт данных
              </label>
              <input
                type="file"
                accept=".json"
                onChange={handleImport}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '0.5rem',
                  border: '1px solid #d1d5db',
                  backgroundColor: 'white'
                }}
              />
            </div>
          </div>
        </div>

        {/* About */}
        <div className="card-modern" style={{padding: '1.5rem'}}>
          <h2 style={{fontWeight: '600', marginBottom: '1rem', fontSize: '1.125rem'}}>О приложении</h2>
          <div style={{fontSize: '0.875rem', color: '#6b7280', display: 'flex', flexDirection: 'column', gap: '0.25rem'}}>
            <p>Nissan Note Service Tracker v1.0</p>
            <p>Личный журнал обслуживания</p>
            <p style={{fontSize: '0.75rem', marginTop: '0.5rem'}}>© 2025 • Built with ❤️ for Note owners</p>
          </div>
        </div>
      </div>
      
      <BottomNav active="vehicle" />
    </div>
  );
}