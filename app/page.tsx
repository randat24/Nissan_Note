"use client";

import { useEffect, useMemo, useState } from 'react';
import { db } from '@/lib/db';
import type { MaintenanceTemplate, ServiceRecord, Vehicle } from '@/lib/types';
import { computeNextDue, computeStatus } from '@/lib/logic';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BottomNav } from '@/components/BottomNav';

/**
 * Home page showing the status of all maintenance items for the Note.
 */
export default function HomePage() {
  const [templates, setTemplates] = useState<MaintenanceTemplate[]>([]);
  const [records, setRecords] = useState<ServiceRecord[]>([]);
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);

  useEffect(() => {
    (async () => {
      const t = await db.templates.toArray();
      const r = await db.records.toArray();
      const v = await db.vehicles.get('note-01');
      setTemplates(t);
      setRecords(r);
      setVehicle(v || null);
    })();
  }, []);

  const todayISO = useMemo(() => new Date().toISOString().slice(0, 10), []);

  // Compute status rows only when data changes.
  const rows = useMemo(() => {
    return templates.map((tpl) => {
      // Find the most recent record for this template
      const recsForTpl = records.filter((r) => r.templateId === tpl.id);
      const last = recsForTpl.sort((a, b) => (a.date > b.date ? -1 : 1))[0];
      const { nextServiceDate, nextServiceMileage } = computeNextDue(
        last?.date,
        last?.mileage,
        tpl.intervalMonths,
        tpl.intervalDistance
      );
      const currentMileage = vehicle?.currentMileage || 0;
      const status = computeStatus(
        todayISO,
        currentMileage,
        nextServiceDate,
        nextServiceMileage
      );
      const nextText = [
        typeof nextServiceMileage === 'number'
          ? `км: ${nextServiceMileage.toLocaleString('uk-UA')}`
          : null,
        nextServiceDate ? `до ${new Date(nextServiceDate).toLocaleDateString('ru-UA')}` : null,
      ]
        .filter(Boolean)
        .join(' · ');
      const lastText = last
        ? `${new Date(last.date).toLocaleDateString('ru-UA')} · ${last.mileage.toLocaleString('uk-UA')} км`
        : undefined;
      return { tpl, status, nextText, lastText };
    });
  }, [templates, records, vehicle, todayISO]);

  // Sort rows: overdue first, then soon, then ok.
  const sorted = useMemo(() => {
    return rows.sort((a, b) => {
      const order = { overdue: 0, soon: 1, ok: 2 } as const;
      return order[a.status] - order[b.status];
    });
  }, [rows]);

  const overdue = sorted.filter((r) => r.status === 'overdue');
  const soon = sorted.filter((r) => r.status === 'soon');
  const ok = sorted.filter((r) => r.status === 'ok');

  function StatusBadge({ status }: { status: 'ok' | 'soon' | 'overdue' }) {
    const label = status === 'ok' ? 'OK' : status === 'soon' ? 'Скоро' : 'Просрочено';
    const cls =
      status === 'ok'
        ? 'bg-green-50 text-green-700 border-green-200'
        : status === 'soon'
        ? 'bg-yellow-50 text-yellow-800 border-yellow-200'
        : 'bg-red-50 text-red-700 border-red-200';
    return (
      <Badge className={`border ${cls}`}>{label}</Badge>
    );
  }

  return (
    <div className="container mx-auto max-w-md pt-4 pb-24 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div>
          <div className="text-xs text-gray-500">Nissan Note</div>
          <div className="text-lg font-semibold">
            Пробег: {vehicle?.currentMileage?.toLocaleString('uk-UA') || 0} км
          </div>
        </div>
        <div className="text-xs text-gray-500">
          {new Date().toLocaleDateString('ru-UA')}
        </div>
      </div>
      {/* Quick link to journal */}
      <div className="flex justify-end">
        <a
          href="/journal"
          className="inline-flex items-center rounded-lg px-4 py-2 text-sm font-medium border border-gray-200 bg-blue-600 text-white hover:bg-blue-700"
        >
          + Запись
        </a>
      </div>
      {/* Overdue section */}
      {overdue.length > 0 && (
        <section>
          <h2 className="text-sm font-semibold text-red-700 mb-2">
            Просрочено ({overdue.length})
          </h2>
          <div className="space-y-2">
            {overdue.map(({ tpl, status, nextText, lastText }) => (
              <Card
                key={tpl.id}
                className="p-4 flex gap-3 items-start"
              >
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-sm">
                      {tpl.title}
                    </h3>
                    <StatusBadge status={status} />
                  </div>
                  {nextText && (
                    <p className="text-sm text-gray-600 mt-1">
                      Следующая: {nextText}
                    </p>
                  )}
                  {lastText && (
                    <p className="text-xs text-gray-500 mt-1">
                      Последняя: {lastText}
                    </p>
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  <a
                    href={`/catalog/${tpl.id}`}
                    className="inline-flex items-center justify-center rounded-lg px-3 py-2 text-sm border border-gray-200 bg-white hover:bg-gray-50"
                  >
                    Открыть
                  </a>
                </div>
              </Card>
            ))}
          </div>
        </section>
      )}
      {/* Soon section */}
      {soon.length > 0 && (
        <section>
          <h2 className="text-sm font-semibold text-yellow-700 mb-2">
            Скоро ({soon.length})
          </h2>
          <div className="space-y-2">
            {soon.map(({ tpl, status, nextText, lastText }) => (
              <Card
                key={tpl.id}
                className="p-4 flex gap-3 items-start"
              >
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-sm">
                      {tpl.title}
                    </h3>
                    <StatusBadge status={status} />
                  </div>
                  {nextText && (
                    <p className="text-sm text-gray-600 mt-1">
                      Следующая: {nextText}
                    </p>
                  )}
                  {lastText && (
                    <p className="text-xs text-gray-500 mt-1">
                      Последняя: {lastText}
                    </p>
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  <a
                    href={`/catalog/${tpl.id}`}
                    className="inline-flex items-center justify-center rounded-lg px-3 py-2 text-sm border border-gray-200 bg-white hover:bg-gray-50"
                  >
                    Открыть
                  </a>
                </div>
              </Card>
            ))}
          </div>
        </section>
      )}
      {/* OK section */}
      {ok.length > 0 && (
        <section>
          <h2 className="text-sm font-semibold text-gray-700 mb-2">
            Остальное ({ok.length})
          </h2>
          <div className="space-y-2">
            {ok.map(({ tpl, status, nextText, lastText }) => (
              <Card
                key={tpl.id}
                className="p-4 flex gap-3 items-start"
              >
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-sm">
                      {tpl.title}
                    </h3>
                    <StatusBadge status={status} />
                  </div>
                  {nextText && (
                    <p className="text-sm text-gray-600 mt-1">
                      Следующая: {nextText}
                    </p>
                  )}
                  {lastText && (
                    <p className="text-xs text-gray-500 mt-1">
                      Последняя: {lastText}
                    </p>
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  <a
                    href={`/catalog/${tpl.id}`}
                    className="inline-flex items-center justify-center rounded-lg px-3 py-2 text-sm border border-gray-200 bg-white hover:bg-gray-50"
                  >
                    Открыть
                  </a>
                </div>
              </Card>
            ))}
          </div>
        </section>
      )}
      {/* Bottom navigation */}
      <BottomNav active="home" />
    </div>
  );
}