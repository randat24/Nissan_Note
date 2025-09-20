"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Plus,
  ExternalLink,
  Check,
  ShoppingCart,
  Package,
  AlertCircle,
} from "lucide-react";
import { db } from "@/lib/dexie-schema-extended";
import type { PartLink, MaintenanceTemplate } from "@/lib/types";
import { Icon } from "@/components/Icon";
import { BottomNav } from "@/components/BottomNav";

interface PartCardProps {
  part: PartLink;
  template?: MaintenanceTemplate;
  onStatusChange: (id: string, status: PartLink["status"]) => void;
}

// Card component for a single part link with modern design
function PartCard({ part, template, onStatusChange }: PartCardProps) {
  const statusConfig = {
    need: {
      label: "Нужно",
      color: "#fee2e2",
      textColor: "#dc2626",
      borderColor: "#fecaca",
      icon: <AlertCircle style={{width: '16px', height: '16px'}} />,
    },
    in_cart: {
      label: "В корзине",
      color: "#fef3c7",
      textColor: "#d97706",
      borderColor: "#fed7aa",
      icon: <ShoppingCart style={{width: '16px', height: '16px'}} />,
    },
    bought: {
      label: "Куплено",
      color: "#dbeafe",
      textColor: "#2563eb",
      borderColor: "#bfdbfe",
      icon: <Package style={{width: '16px', height: '16px'}} />,
    },
    installed: {
      label: "Установлено",
      color: "#dcfce7",
      textColor: "#16a34a",
      borderColor: "#bbf7d0",
      icon: <Check style={{width: '16px', height: '16px'}} />,
    },
  } as const;
  
  const config = (part.status && statusConfig[part.status]) || statusConfig.need;
  
  return (
    <div className="card-modern" style={{padding: '1rem', marginBottom: '0.75rem'}}>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem'}}>
        <div style={{flex: 1}}>
          <h3 style={{fontWeight: '600', fontSize: '0.875rem', color: '#111827', marginBottom: '0.25rem'}}>
            {part.title}
          </h3>
          {template && (
            <p style={{fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.25rem'}}>
              {template.title}
            </p>
          )}
          {part.spec && (
            <p style={{fontSize: '0.75rem', color: '#374151'}}>
              {part.spec}
            </p>
          )}
        </div>
        <div style={{
          backgroundColor: config.color,
          color: config.textColor,
          border: `1px solid ${config.borderColor}`,
          borderRadius: '9999px',
          padding: '0.25rem 0.5rem',
          fontSize: '0.75rem',
          fontWeight: '500',
          display: 'flex',
          alignItems: 'center',
          gap: '0.25rem'
        }}>
          {config.icon}
          <span>{config.label}</span>
        </div>
      </div>
      
      <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
        <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem'}}>
          {part.price && (
            <span style={{fontWeight: '600', color: '#111827'}}>
              {part.price} {part.currency || "грн"}
            </span>
          )}
          <a
            href={part.url}
            target="_blank"
            rel="noopener noreferrer"
            style={{color: '#2563eb', textDecoration: 'none'}}
            onClick={(e) => e.stopPropagation()}
          >
            <ExternalLink style={{width: '16px', height: '16px'}} />
          </a>
        </div>
        
        <select
          value={part.status || "need"}
          onChange={(e) => onStatusChange(part.id, e.target.value as any)}
          style={{
            padding: '0.25rem 0.5rem',
            borderRadius: '0.375rem',
            border: '1px solid #d1d5db',
            backgroundColor: 'white',
            fontSize: '0.75rem',
            minWidth: '120px'
          }}
        >
          <option value="need">Нужно</option>
          <option value="in_cart">В корзине</option>
          <option value="bought">Куплено</option>
          <option value="installed">Установлено</option>
        </select>
      </div>
    </div>
  );
}

export default function PartsPage() {
  const router = useRouter();
  const [parts, setParts] = useState<PartLink[]>([]);
  const [templates, setTemplates] = useState<Map<string, MaintenanceTemplate>>(new Map());
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [formData, setFormData] = useState({
    templateId: "",
    title: "",
    spec: "",
    url: "",
    price: "",
    currency: "UAH" as const,
    status: "need" as const,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const partsData = await db.partLinks.toArray();
    setParts(partsData);
    const temps = await db.templates.toArray();
    setTemplates(new Map(temps.map((t) => [t.id, t])));
  };

  const handleStatusChange = async (id: string, status: PartLink["status"]) => {
    await db.partLinks.update(id, { status });
    loadData();
  };

  const handleSavePart = async () => {
    const newPart: PartLink = {
      id: crypto.randomUUID(),
      templateId: formData.templateId,
      title: formData.title,
      spec: formData.spec,
      url: formData.url,
      price: formData.price ? parseFloat(formData.price) : undefined,
      currency: formData.currency,
      status: formData.status,
    };
    await db.partLinks.add(newPart);
    setIsSheetOpen(false);
    setFormData({
      templateId: "",
      title: "",
      spec: "",
      url: "",
      price: "",
      currency: "UAH",
      status: "need",
    });
    loadData();
  };

  const filteredParts = activeTab === "all" ? parts : parts.filter((p) => p.status === activeTab);
  const totalPrice = filteredParts
    .filter((p) => p.status !== "installed")
    .reduce((sum, p) => sum + (p.price || 0), 0);

  return (
    <div style={{minHeight: '100vh', paddingBottom: '5rem'}}>
      {/* Header */}
      <header style={{padding: '1.5rem', background: 'linear-gradient(135deg, #dbeafe 0%, #ffffff 50%, #f3e8ff 100%)'}}>
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem'}}>
          <h1 className="gradient-text" style={{fontSize: '2rem', fontWeight: 'bold'}}>Запчасти и ссылки</h1>
          <button 
            className="btn-primary"
            onClick={() => setIsSheetOpen(true)}
            style={{padding: '0.5rem 1rem', fontSize: '0.875rem'}}
          >
            <Plus style={{width: '16px', height: '16px', marginRight: '0.25rem'}} />
            Добавить
          </button>
        </div>
        
        {totalPrice > 0 && (
          <div style={{
            backgroundColor: '#dbeafe',
            borderRadius: '0.5rem',
            padding: '0.75rem',
            textAlign: 'center',
            marginBottom: '1rem',
            fontSize: '0.875rem'
          }}>
            <span style={{color: '#374151'}}>К покупке: </span>
            <span style={{fontWeight: '600', color: '#111827'}}>{totalPrice.toLocaleString()} грн</span>
          </div>
        )}
        
        {/* Tabs */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(5, 1fr)',
          gap: '0.25rem',
          backgroundColor: '#f3f4f6',
          padding: '0.25rem',
          borderRadius: '0.5rem'
        }}>
          {[
            { value: "all", label: "Все" },
            { value: "need", label: "Нужно" },
            { value: "in_cart", label: "Корзина" },
            { value: "bought", label: "Куплено" },
            { value: "installed", label: "Готово" }
          ].map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              style={{
                padding: '0.5rem',
                borderRadius: '0.375rem',
                fontSize: '0.75rem',
                fontWeight: '500',
                backgroundColor: activeTab === tab.value ? 'white' : 'transparent',
                color: activeTab === tab.value ? '#111827' : '#6b7280',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </header>
      
      {/* Parts List */}
      <div style={{padding: '1rem'}}>
        {filteredParts.length > 0 ? (
          <div>
            {filteredParts.map((part) => (
              <PartCard
                key={part.id}
                part={part}
                template={templates.get(part.templateId)}
                onStatusChange={handleStatusChange}
              />
            ))}
          </div>
        ) : (
          <div className="card-modern" style={{padding: '2rem', textAlign: 'center', color: '#6b7280'}}>
            <Package style={{width: '3rem', height: '3rem', margin: '0 auto 0.5rem', color: '#d1d5db'}} />
            Нет запчастей в этой категории
          </div>
        )}
      </div>

      {/* Add Part Modal */}
      {isSheetOpen && (
        <div style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          height: '85vh',
          backgroundColor: 'white',
          borderTopLeftRadius: '1rem',
          borderTopRightRadius: '1rem',
          padding: '1.5rem',
          overflowY: 'auto',
          zIndex: 50
        }}>
          <div style={{marginBottom: '1.5rem'}}>
            <h2 style={{fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.5rem'}}>Добавить запчасть</h2>
            <p style={{fontSize: '0.875rem', color: '#6b7280'}}>Сохраните ссылку на нужную деталь</p>
          </div>
          
          <div style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
            <div>
              <label style={{display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem'}}>
                Узел
              </label>
              <select
                value={formData.templateId}
                onChange={(e) => setFormData({ ...formData, templateId: e.target.value })}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '0.5rem',
                  border: '1px solid #d1d5db',
                  backgroundColor: 'white'
                }}
              >
                <option value="">Выберите узел</option>
                {Array.from(templates.values()).map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.title}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label style={{display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem'}}>
                Название детали
              </label>
              <input
                placeholder="Castrol Edge 5W-30"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
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
              <label style={{display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem'}}>
                Спецификация
              </label>
              <input
                placeholder="API SN, ACEA C3"
                value={formData.spec}
                onChange={(e) => setFormData({ ...formData, spec: e.target.value })}
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
              <label style={{display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem'}}>
                Ссылка
              </label>
              <input
                type="url"
                placeholder="https://..."
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '0.5rem',
                  border: '1px solid #d1d5db',
                  backgroundColor: 'white'
                }}
              />
            </div>
            
            <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem'}}>
              <div>
                <label style={{display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem'}}>
                  Цена
                </label>
                <input
                  type="number"
                  placeholder="1200"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
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
                <label style={{display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem'}}>
                  Статус
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '0.5rem',
                    border: '1px solid #d1d5db',
                    backgroundColor: 'white'
                  }}
                >
                  <option value="need">Нужно купить</option>
                  <option value="in_cart">В корзине</option>
                  <option value="bought">Куплено</option>
                  <option value="installed">Установлено</option>
                </select>
              </div>
            </div>
            
            <div style={{display: 'flex', gap: '1rem', marginTop: '1rem'}}>
              <button
                onClick={() => setIsSheetOpen(false)}
                style={{
                  flex: 1,
                  padding: '0.75rem',
                  borderRadius: '0.5rem',
                  border: '1px solid #d1d5db',
                  backgroundColor: 'white',
                  color: '#374151',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}
              >
                Отмена
              </button>
              <button
                onClick={handleSavePart}
                disabled={!formData.templateId || !formData.title || !formData.url}
                className="btn-primary"
                style={{
                  flex: 1,
                  padding: '0.75rem',
                  opacity: (!formData.templateId || !formData.title || !formData.url) ? 0.5 : 1
                }}
              >
                Сохранить
              </button>
            </div>
          </div>
        </div>
      )}
      
      <BottomNav active="parts" />
    </div>
  );
}