"use client";

import { useEffect, useState } from 'react';
import { db } from '@/lib/db';
import type { MaintenanceTemplate } from '@/lib/types';
import { Card } from '@/components/ui/card';
import { BottomNav } from '@/components/BottomNav';

/**
 * Catalog page lists all maintenance templates for the Note with
 * their intervals and links to detailed pages.
 */
export default function CatalogPage() {
  const [templates, setTemplates] = useState<MaintenanceTemplate[]>([]);
  useEffect(() => {
    (async () => {
      const list = await db.templates.toArray();
      setTemplates(list);
    })();
  }, []);
  return (
    <div className="container mx-auto max-w-md pt-4 pb-24 space-y-4">
      <h1 className="text-lg font-semibold">Каталог ТО</h1>
      <div className="grid gap-2">
        {templates.map((tpl) => (
          <Card key={tpl.id} className="p-4">
            <a href={`/catalog/${tpl.id}`} className="block">
              <div className="font-medium text-sm mb-1">{tpl.title}</div>
              <div className="text-xs text-gray-500">
                {tpl.intervalDistance
                  ? `Интервал: ${tpl.intervalDistance.toLocaleString('uk-UA')} mi`
                  : ''}
                {tpl.intervalDistance && tpl.intervalMonths ? ' · ' : ''}
                {tpl.intervalMonths ? `${tpl.intervalMonths} мес.` : ''}
              </div>
            </a>
          </Card>
        ))}
      </div>
      <BottomNav active="catalog" />
    </div>
  );
}