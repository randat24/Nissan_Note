import type { MaintenanceTemplate } from '@/lib/types';
import seedTemplates from '@/lib/seed';
import { BottomNav } from '@/components/BottomNav';
import { Icon } from '@/components/Icon';

/**
 * Catalog page lists all maintenance templates for the Note with
 * their intervals and links to detailed pages.
 */
export default function CatalogPage() {
  const templates = seedTemplates as MaintenanceTemplate[];

  return (
    <div style={{minHeight: '100vh', paddingBottom: '5rem'}}>
      {/* Header */}
      <header style={{padding: '1.5rem', background: 'linear-gradient(135deg, #dbeafe 0%, #ffffff 50%, #f3e8ff 100%)'}}>
        <h1 className="gradient-text" style={{fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem'}}>Каталог ТО</h1>
        <p style={{color: '#6b7280', fontSize: '1rem'}}>Все виды обслуживания для вашего Nissan Note</p>
      </header>

      {/* Templates Grid */}
      <div style={{padding: '1rem', display: 'grid', gap: '1rem'}}>
        {templates.map((tpl) => (
          <a key={tpl.id} href={`/catalog/${tpl.id}`} style={{textDecoration: 'none'}}>
            <div className="card-modern" style={{padding: '1.5rem', cursor: 'pointer'}}>
              <div style={{display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem'}}>
                <div style={{
                  padding: '0.75rem',
                  backgroundColor: '#dbeafe',
                  borderRadius: '0.75rem'
                }}>
                  <Icon name="parts" size={24} className="text-blue-600" />
                </div>
                <div style={{flex: 1}}>
                  <h3 style={{fontWeight: '600', fontSize: '1.125rem', color: '#111827', marginBottom: '0.25rem'}}>
                    {tpl.title}
                  </h3>
                  <div style={{fontSize: '0.875rem', color: '#6b7280'}}>
                    {tpl.intervalDistance
                      ? `Интервал: ${tpl.intervalDistance.toLocaleString('uk-UA')} ${tpl.unitDistance || 'mi'}`
                      : ''}
                    {tpl.intervalDistance && tpl.intervalMonths ? ' · ' : ''}
                    {tpl.intervalMonths ? `${tpl.intervalMonths} мес.` : ''}
                  </div>
                </div>
                <div style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  backgroundColor: '#e5e7eb',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <div style={{
                    width: '8px',
                    height: '8px',
                    backgroundColor: '#9ca3af',
                    borderRadius: '50%'
                  }}></div>
                </div>
              </div>
              
              {(tpl as any).description && (
                <p style={{fontSize: '0.875rem', color: '#6b7280', lineHeight: '1.4'}}>
                  {(tpl as any).description}
                </p>
              )}
            </div>
          </a>
        ))}
      </div>
      
      <BottomNav active="catalog" />
    </div>
  );
}