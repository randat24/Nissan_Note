"use client";

// Parts page: allows users to track spare parts, links, and status. It integrates
// with the Dexie database to persist part links across sessions. Users can
// filter parts by status, see the total amount left to purchase, and add new
// parts via a bottom sheet. The UI is mobile‑first and uses the shared UI
// components defined in `components/ui`.

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
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { db } from "@/lib/dexie-schema-extended";
import type { PartLink, MaintenanceTemplate } from "@/lib/types";
import { Icon } from "@/components/Icon";

interface PartCardProps {
  part: PartLink;
  template?: MaintenanceTemplate;
  onStatusChange: (id: string, status: PartLink["status"]) => void;
}

// Card component for a single part link. Shows the part name, optional
// template title, specification, price, and link. The status can be
// changed via a dropdown. Colors are subtle and monochrome, following the
// black‑and‑white icon theme. Icons are provided by lucide-react.
function PartCard({ part, template, onStatusChange }: PartCardProps) {
  const statusConfig = {
    need: {
      label: "Нужно",
      color: "bg-red-100 text-red-800 border-red-200",
      icon: <AlertCircle className="w-4 h-4" />,
    },
    in_cart: {
      label: "В корзине",
      color: "bg-yellow-100 text-yellow-800 border-yellow-200",
      icon: <ShoppingCart className="w-4 h-4" />,
    },
    bought: {
      label: "Куплено",
      color: "bg-blue-100 text-blue-800 border-blue-200",
      icon: <Package className="w-4 h-4" />,
    },
    installed: {
      label: "Установлено",
      color: "bg-green-100 text-green-800 border-green-200",
      icon: <Check className="w-4 h-4" />,
    },
  } as const;
  const config = (part.status && statusConfig[part.status]) || statusConfig.need;
  return (
    <Card className="p-3">
      <div className="flex justify-between items-start mb-2">
        <div className="flex-1">
          <h3 className="font-medium text-sm">{part.title}</h3>
          {template && (
            <p className="text-xs text-gray-500">{template.title}</p>
          )}
          {part.spec && (
            <p className="text-xs text-gray-600 mt-1">{part.spec}</p>
          )}
        </div>
        <Badge className={config.color}>
          {config.icon}
          <span className="ml-1">{config.label}</span>
        </Badge>
      </div>
      <div className="flex items-center justify-between mt-3">
        <div className="flex items-center gap-2 text-sm">
          {part.price && (
            <span className="font-semibold">
              {part.price} {part.currency || "грн"}
            </span>
          )}
          <a
            href={part.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800"
            onClick={(e) => e.stopPropagation()}
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
        <Select
          value={part.status || "need"}
          onValueChange={(value) => onStatusChange(part.id, value as any)}
        >
          <SelectTrigger className="w-32 h-8">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="need">Нужно</SelectItem>
            <SelectItem value="in_cart">В корзине</SelectItem>
            <SelectItem value="bought">Куплено</SelectItem>
            <SelectItem value="installed">Установлено</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </Card>
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
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-white border-b px-4 py-3">
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-xl font-semibold">Запчасти и ссылки</h1>
          <Button size="sm" onClick={() => setIsSheetOpen(true)}>
            <Plus className="w-4 h-4 mr-1" />
            Добавить
          </Button>
        </div>
        {totalPrice > 0 && (
          <div className="bg-blue-50 rounded-lg p-2 text-center mb-3 text-sm">
            <span className="text-gray-600">К покупке: </span>
            <span className="font-semibold">{totalPrice.toLocaleString()} грн</span>
          </div>
        )}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-5 w-full">
            <TabsTrigger value="all">Все</TabsTrigger>
            <TabsTrigger value="need">Нужно</TabsTrigger>
            <TabsTrigger value="in_cart">Корзина</TabsTrigger>
            <TabsTrigger value="bought">Куплено</TabsTrigger>
            <TabsTrigger value="installed">Готово</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      <div className="p-4">
        {filteredParts.length > 0 ? (
          <div className="space-y-2">
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
          <Card className="p-8 text-center text-gray-500">
            <Package className="w-12 h-12 mx-auto mb-2 text-gray-300" />
            Нет запчастей в этой категории
          </Card>
        )}
      </div>
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent side="bottom" className="h-[85vh] overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Добавить запчасть</SheetTitle>
            <SheetDescription>
              Сохраните ссылку на нужную деталь
            </SheetDescription>
          </SheetHeader>
          <div className="mt-6 space-y-4">
            <div>
              <Label htmlFor="template">Узел</Label>
              <Select
                value={formData.templateId}
                onValueChange={(value) => setFormData({ ...formData, templateId: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Выберите узел" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from(templates.values()).map((t) => (
                    <SelectItem key={t.id} value={t.id}>
                      {t.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="title">Название детали</Label>
              <Input
                id="title"
                placeholder="Castrol Edge 5W-30"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="spec">Спецификация</Label>
              <Input
                id="spec"
                placeholder="API SN, ACEA C3"
                value={formData.spec}
                onChange={(e) => setFormData({ ...formData, spec: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="url">Ссылка</Label>
              <Input
                id="url"
                type="url"
                placeholder="https://..."
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="price">Цена</Label>
                <Input
                  id="price"
                  type="number"
                  placeholder="1200"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="status">Статус</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => setFormData({ ...formData, status: value as any })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="need">Нужно купить</SelectItem>
                    <SelectItem value="in_cart">В корзине</SelectItem>
                    <SelectItem value="bought">Куплено</SelectItem>
                    <SelectItem value="installed">Установлено</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button
              className="w-full"
              onClick={handleSavePart}
              disabled={
                !formData.templateId || !formData.title || !formData.url
              }
            >
              Сохранить
            </Button>
          </div>
        </SheetContent>
      </Sheet>
      {/* Custom bottom navigation for parts page */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
        <div className="container mx-auto max-w-md grid grid-cols-5 text-center py-2 text-xs">
          {[
            { key: "home", href: "/", label: "Домой", icon: "home" },
            { key: "journal", href: "/journal", label: "Журнал", icon: "journal" },
            { key: "catalog", href: "/catalog", label: "Каталог", icon: "catalog" },
            { key: "parts", href: "/parts", label: "Запчасти", icon: "parts", active: true },
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