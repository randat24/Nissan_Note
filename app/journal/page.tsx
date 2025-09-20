"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar, MapPin, FileText } from 'lucide-react';
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
    <div style={{display: 'flex', gap: '0.75rem', marginBottom: '1rem'}}>
      {/* Date badge */}
      <div style={{flexShrink: 0, textAlign: 'center'}}>
        <div style={{
          backgroundColor: '#2563eb',
          color: 'white',
          borderRadius: '0.5rem',
          padding: '0.75rem',
          minWidth: '60px'
        }}>
          <div style={{fontSize: '0.75rem'}}>{formatMonth(record.date)}</div>
          <div style={{fontSize: '1.25rem', fontWeight: 'bold'}}>{formatDay(record.date)}</div>
        </div>
      </div>
      {/* Content card */}
      <div 
        className="card-modern" 
        style={{flex: 1, padding: '1rem', cursor: 'pointer'}}
        onClick={onClick}
      >
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem'}}>
          <h3 style={{fontWeight: '600', fontSize: '1rem'}}>{template.title}</h3>
          {record.cost && (
            <span style={{fontSize: '0.875rem', fontWeight: '600', color: '#374151'}}>{record.cost} грн</span>
          )}
        </div>
        <div style={{display: 'flex', flexDirection: 'column', gap: '0.25rem'}}>
          <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: '#6b7280'}}>
            <Calendar style={{width: '12px', height: '12px'}} />
            {record.mileage.toLocaleString()} mi
          </div>
          {record.location && (
            <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: '#6b7280'}}>
              <MapPin style={{width: '12px', height: '12px'}} />
              {record.location}
            </div>
          )}
          {record.note && (
            <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: '#6b7280'}}>
              <FileText style={{width: '12px', height: '12px'}} />
              {record.note}
            </div>
          )}
        </div>
      </div>
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
    <div style={{minHeight: '100vh', paddingBottom: '5rem'}}>
      {/* Header */}
      <header style={{padding: '1.5rem', background: 'linear-gradient(135deg, #dbeafe 0%, #ffffff 50%, #f3e8ff 100%)'}}>
        <h1 className="gradient-text" style={{fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem'}}>Журнал обслуживания</h1>
        
        {/* Summary stats */}
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem', marginBottom: '1rem'}}>
          <div className="card-modern" style={{padding: '1rem', textAlign: 'center'}}>
            <div style={{fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.25rem'}}>Записей</div>
            <div style={{fontSize: '1.5rem', fontWeight: 'bold', color: '#111827'}}>{filteredRecords.length}</div>
          </div>
          <div className="card-modern" style={{padding: '1rem', textAlign: 'center'}}>
            <div style={{fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.25rem'}}>Потрачено</div>
            <div style={{fontSize: '1.5rem', fontWeight: 'bold', color: '#111827'}}>{totalCost.toLocaleString()} грн</div>
          </div>
          <div className="card-modern" style={{padding: '1rem', textAlign: 'center'}}>
            <div style={{fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.25rem'}}>Ср. чек</div>
            <div style={{fontSize: '1.5rem', fontWeight: 'bold', color: '#111827'}}>{avgCost.toLocaleString()} грн</div>
          </div>
        </div>
        
        {/* Filters */}
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem'}}>
          <select 
            value={filterTemplate} 
            onChange={(e) => setFilterTemplate(e.target.value)}
            style={{
              padding: '0.75rem',
              borderRadius: '0.5rem',
              border: '1px solid #d1d5db',
              backgroundColor: 'white',
              fontSize: '0.875rem'
            }}
          >
            <option value="all">Все узлы</option>
            {Array.from(templates.values()).map((t) => (
              <option key={t.id} value={t.id}>
                {t.title}
              </option>
            ))}
          </select>
          <select 
            value={filterPeriod} 
            onChange={(e) => setFilterPeriod(e.target.value)}
            style={{
              padding: '0.75rem',
              borderRadius: '0.5rem',
              border: '1px solid #d1d5db',
              backgroundColor: 'white',
              fontSize: '0.875rem'
            }}
          >
            <option value="all">Весь период</option>
            <option value="month">Месяц</option>
            <option value="quarter">Квартал</option>
            <option value="year">Год</option>
          </select>
        </div>
      </header>
      
      {/* Timeline */}
      <div style={{padding: '1rem'}}>
        {filteredRecords.length > 0 ? (
          <div>
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
          <div className="card-modern" style={{padding: '2rem', textAlign: 'center', color: '#6b7280'}}>
            <Calendar style={{width: '3rem', height: '3rem', margin: '0 auto 0.5rem', color: '#d1d5db'}} />
            Нет записей за выбранный период
          </div>
        )}
      </div>
      
      {/* Bottom navigation */}
      <BottomNav active="journal" />
    </div>
  );
}