"use client";

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { db } from '@/lib/db';
import type { MaintenanceTemplate, ServiceRecord, Vehicle } from '@/lib/types';
import { computeNextDue, computeStatus } from '@/lib/logic';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BottomNav } from '@/components/BottomNav';

interface PageProps {
  params: { id: string };
}

/**
 * Detailed view for a single maintenance template. Shows intervals,
 * specifications, next service prediction, and service history.
 */
export default function CatalogDetailPage({ params }: PageProps) {
  const id = params.id;
  const [template, setTemplate] = useState<MaintenanceTemplate | null>(null);
  const [records, setRecords] = useState<ServiceRecord[]>([]);
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const tpl = await db.templates.get(id);
      setTemplate(tpl || null);
      const recs = await db.records.where('templateId').equals(id).reverse().toArray();
      setRecords(recs);
      const v = await db.vehicles.get('note-01');
      setVehicle(v || null);
    })();
  }, [id]);

  const todayISO = useMemo(() => new Date().toISOString().slice(0, 10), []);

  // Compute next due and status based on last record
  const nextData = useMemo(() => {
    if (!template) return { status: 'ok', nextServiceDate: undefined, nextServiceMileage: undefined } as {
      status: 'ok' | 'soon' | 'overdue';
      nextServiceDate?: string;
      nextServiceMileage?: number;
    };
    const last = records[0];
    const { nextServiceDate, nextServiceMileage } = computeNextDue(
      last?.date,
      last?.mileage,
      template.intervalMonths,
      template.intervalDistance
    );
    const currentMileage = vehicle?.currentMileage || 0;
    const status = computeStatus(todayISO, currentMileage, nextServiceDate, nextServiceMileage);
    return { status, nextServiceDate, nextServiceMileage };
  }, [template, records, vehicle, todayISO]);

  function StatusBadge({ status }: { status: 'ok' | 'soon' | 'overdue' }) {
    const label = status === 'ok' ? 'OK' : status === 'soon' ? 'Скоро' : 'Просрочено';
    const cls =
      status === 'ok'
        ? 'bg-green-50 text-green-700 border-green-200'
        : status === 'soon'
        ? 'bg-yellow-50 text-yellow-800 border-yellow-200'
        : 'bg-red-50 text-red-700 border-red-200';
    return <Badge className={`border ${cls}`}>{label}</Badge>;
  }

  if (!template) {
    return (
      <div className="container mx-auto max-w-md pt-4 pb-24">
        <p className="text-center text-gray-500">Запись не найдена.</p>
        <BottomNav active="catalog" />
      </div>
    );
  }
  return (
    <div className="container mx-auto max-w-md pt-4 pb-24 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold">{template.title}</h1>
        <StatusBadge status={nextData.status as any} />
      </div>
      {/* Interval and notes */}
      <Card className="p-4">
        <div className="text-sm text-gray-700">Интервал</div>
        <div className="text-sm">
          {template.intervalDistance
            ? `${template.intervalDistance.toLocaleString('uk-UA')} км`
            : '—'}
          {template.intervalDistance && template.intervalMonths ? ' · ' : ''}
          {template.intervalMonths ? `${template.intervalMonths} мес.` : ''}
        </div>
        {template.notes && (
          <p className="text-sm text-gray-600 mt-2">{template.notes}</p>
        )}
        {template.sourceUrl && (
          <a
            href={template.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-blue-600 underline mt-2 inline-block"
          >
            Открыть гайд StartMyCar
          </a>
        )}
      </Card>
      {/* Next service prediction */}
      <Card className="p-4">
        <div className="text-sm text-gray-700">Следующее обслуживание</div>
        <div className="text-sm">
          {typeof nextData.nextServiceMileage === 'number'
            ? `км: ${nextData.nextServiceMileage.toLocaleString('uk-UA')}`
            : '—'}
          {nextData.nextServiceMileage && nextData.nextServiceDate ? ' · ' : ''}
          {nextData.nextServiceDate
            ? `до ${new Date(nextData.nextServiceDate).toLocaleDateString('ru-UA')}`
            : ''}
        </div>
        <div className="text-xs text-gray-500 mt-1">
          Текущий пробег: {vehicle?.currentMileage?.toLocaleString('uk-UA') || 0} км
        </div>
      </Card>
      {/* History */}
      <div className="space-y-2">
        <div className="text-sm font-semibold">История</div>
        {records.length === 0 && (
          <p className="text-sm text-gray-500">Пока нет записей.</p>
        )}
        {records.map((r) => (
          <Card key={r.id} className="p-3 flex items-center justify-between">
            <div className="text-sm">
              {new Date(r.date).toLocaleDateString('ru-UA')} · {r.mileage.toLocaleString('uk-UA')} км
            </div>
            <div className="text-sm text-gray-500">
              {r.cost ? `${r.cost.toLocaleString('uk-UA')} грн` : ''}
            </div>
          </Card>
        ))}
      </div>
      {/* Navigation */}
      <BottomNav active="catalog" />
    </div>
  );
}