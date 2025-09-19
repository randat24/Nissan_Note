"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar, MapPin, FileText } from 'lucide-react';
import { Card } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { db } from '@/lib/dexie-schema-extended';
import type { ServiceRecord, MaintenanceTemplate } from '@/lib/types';
import { BottomNav } from '@/components/BottomNav';

/**
 * A single entry in the maintenance journal. Displays the date as a badge and
 * shows mileage, location and note details. Clicking the card navigates to
 * the corresponding maintenance template page.
 */
interface TimelineItemProps {
  record: ServiceRecord;
  template: MaintenanceTemplate;
  onClick: () => void;
}

function TimelineItem({ record, template, onClick }: TimelineItemProps) {
  const formatMonth = (date: string) =>
    new Date(date).toLocaleDateString('ru-UA', { month: 'short' }).toUpperCase();
  const formatDay = (date: string) => new Date(date).getDate();
  return (
    <div className="flex gap-3">
      {/* Date badge */}
      <div className="flex-shrink-0 text-center">
        <div className="bg-blue-500 text-white rounded-lg px-3 py-2">
          <div className="text-xs">{formatMonth(record.date)}</div>
          <div className="text-xl font-bold">{formatDay(record.date)}</div>
        </div>
      </div>
      {/* Content card */}
      <Card className="flex-1 p-3 cursor-pointer hover:shadow-md transition-all" onClick={onClick}>
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-medium">{template.title}</h3>
          {record.cost && (
            <span className="text-sm font-semibold text-gray-700">{record.cost} грн</span>
          )}
        </div>
        <div className="space-y-1 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <Calendar className="w-3 h-3" />
            {record.mileage.toLocaleString()} mi
          </div>
          {record.location && (
            <div className="flex items-center gap-2">
              <MapPin className="w-3 h-3" />
              {record.location}
            </div>
          )}
          {record.note && (
            <div className="flex items-center gap-2">
              <FileText className="w-3 h-3" />
              {record.note}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}

/**
 * Journal page displays all service records with filtering options by
 * maintenance item and time period. A summary of record count, total
 * spending and average cheque is shown. Uses Dexie to load data from
 * IndexedDB.
 */
export default function JournalPage() {
  const router = useRouter();
  const [records, setRecords] = useState<ServiceRecord[]>([]);
  const [templates, setTemplates] = useState<Map<string, MaintenanceTemplate>>(new Map());
  const [filterTemplate, setFilterTemplate] = useState('all');
  const [filterPeriod, setFilterPeriod] = useState('all');

  useEffect(() => {
    loadData();
  }, []);

  /**
   * Loads records and templates from the IndexedDB database. Records are
   * reversed to have the newest first. Templates are stored in a map for
   * quick lookup.
   */
  async function loadData() {
    const recs = await db.records
      .where('vehicleId')
      .equals('note-01')
      .reverse()
      .toArray();
    const temps = await db.templates.toArray();
    setRecords(recs);
    setTemplates(new Map(temps.map((t) => [t.id, t])));
  }

  /**
   * Applies filtering by template and period to the list of service records.
   */
  function getFilteredRecords() {
    let filtered = [...records];
    if (filterTemplate !== 'all') {
      filtered = filtered.filter((r) => r.templateId === filterTemplate);
    }
    const now = new Date();
    if (filterPeriod === 'month') {
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      filtered = filtered.filter((r) => new Date(r.date) >= monthAgo);
    } else if (filterPeriod === 'quarter') {
      const quarterAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
      filtered = filtered.filter((r) => new Date(r.date) >= quarterAgo);
    } else if (filterPeriod === 'year') {
      const yearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
      filtered = filtered.filter((r) => new Date(r.date) >= yearAgo);
    }
    return filtered;
  }

  const filteredRecords = getFilteredRecords();
  const totalCost = filteredRecords.reduce((sum, r) => sum + (r.cost || 0), 0);
  const avgCost = filteredRecords.length > 0 ? Math.round(totalCost / filteredRecords.length) : 0;

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-white border-b px-4 py-3">
        <h1 className="text-xl font-semibold mb-3">Журнал обслуживания</h1>
        {/* Summary stats */}
        <div className="grid grid-cols-3 gap-2 mb-3">
          <div className="bg-gray-50 rounded-lg p-2 text-center">
            <div className="text-xs text-gray-500">Записей</div>
            <div className="text-lg font-semibold">{filteredRecords.length}</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-2 text-center">
            <div className="text-xs text-gray-500">Потрачено</div>
            <div className="text-lg font-semibold">{totalCost.toLocaleString()} грн</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-2 text-center">
            <div className="text-xs text-gray-500">Ср. чек</div>
            <div className="text-lg font-semibold">{avgCost.toLocaleString()} грн</div>
          </div>
        </div>
        {/* Filters */}
        <div className="grid grid-cols-2 gap-2">
          <Select value={filterTemplate} onValueChange={setFilterTemplate}>
            <SelectTrigger className="h-9">
              <SelectValue placeholder="Все узлы" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Все узлы</SelectItem>
              {Array.from(templates.values()).map((t) => (
                <SelectItem key={t.id} value={t.id}>
                  {t.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={filterPeriod} onValueChange={setFilterPeriod}>
            <SelectTrigger className="h-9">
              <SelectValue placeholder="Весь период" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Весь период</SelectItem>
              <SelectItem value="month">Месяц</SelectItem>
              <SelectItem value="quarter">Квартал</SelectItem>
              <SelectItem value="year">Год</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      {/* Timeline */}
      <div className="p-4">
        {filteredRecords.length > 0 ? (
          <div className="space-y-4">
            {filteredRecords.map((record) => {
              const template = templates.get(record.templateId);
              if (!template) return null;
              return (
                <TimelineItem
                  key={record.id}
                  record={record}
                  template={template}
                  onClick={() => {
                    router.push(`/catalog/${template.id}`);
                  }}
                />
              );
            })}
          </div>
        ) : (
          <Card className="p-8 text-center text-gray-500">
            <Calendar className="w-12 h-12 mx-auto mb-2 text-gray-300" />
            Нет записей за выбранный период
          </Card>
        )}
      </div>
      {/* Bottom navigation */}
      <BottomNav active="journal" />
    </div>
  );
}