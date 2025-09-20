import { Icon } from '@/components/Icon'
import { BottomNav } from '@/components/BottomNav'

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <header style={{position: 'relative', padding: '2rem 0', overflow: 'hidden'}}>
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(135deg, #dbeafe 0%, #ffffff 50%, #f3e8ff 100%)'
        }}></div>
        <div style={{position: 'relative'}}>
          <h1 style={{
            fontSize: '3rem', 
            fontWeight: 'bold', 
            marginBottom: '0.75rem',
            background: 'linear-gradient(to right, #2563eb, #7c3aed)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>Мій Nissan Note</h1>
          <p style={{color: '#6b7280', fontSize: '1.125rem'}}>Ключові показники та останні події</p>
          <div style={{marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: '#6b7280'}}>
            <div style={{
              width: '8px', 
              height: '8px', 
              backgroundColor: '#10b981', 
              borderRadius: '50%',
              animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
            }}></div>
            <span>Система активна</span>
          </div>
        </div>
      </header>

      {/* KPI Cards */}
      <section style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '2rem'}}>
        <div style={{
          background: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(12px)',
          borderRadius: '1rem',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          transition: 'all 0.3s ease',
          padding: '1.5rem',
          cursor: 'pointer',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '3px',
            background: 'linear-gradient(90deg, #3b82f6, #8b5cf6)',
            borderRadius: '2px'
          }}></div>
          <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
            <div style={{display: 'flex', alignItems: 'center', gap: '0.75rem'}}>
              <div style={{padding: '0.75rem', backgroundColor: '#dbeafe', borderRadius: '0.75rem', transition: 'all 0.2s'}}>
                <Icon name="vehicle" size={24} className="text-blue-600" />
              </div>
              <div>
                <div style={{color: '#6b7280', fontWeight: '500'}}>Пробіг</div>
                <div style={{fontSize: '1.5rem', fontWeight: 'bold', color: '#111827'}}>79 815 mi</div>
              </div>
            </div>
            <div style={{textAlign: 'right'}}>
              <div style={{fontSize: '0.75rem', color: '#059669', backgroundColor: '#dcfce7', padding: '0.25rem 0.5rem', borderRadius: '9999px'}}>Оновлено сьогодні</div>
            </div>
          </div>
        </div>

        <div style={{
          background: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(12px)',
          borderRadius: '1rem',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          transition: 'all 0.3s ease',
          padding: '1.5rem',
          cursor: 'pointer',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '3px',
            background: 'linear-gradient(90deg, #3b82f6, #8b5cf6)',
            borderRadius: '2px'
          }}></div>
          <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
            <div style={{display: 'flex', alignItems: 'center', gap: '0.75rem'}}>
              <div style={{padding: '0.75rem', backgroundColor: '#fed7aa', borderRadius: '0.75rem', transition: 'all 0.2s'}}>
                <Icon name="journal" size={24} className="text-orange-600" />
              </div>
              <div>
                <div style={{color: '#6b7280', fontWeight: '500'}}>Наступне ТО</div>
                <div style={{fontSize: '1.5rem', fontWeight: 'bold', color: '#111827'}}>через 1 200 mi</div>
              </div>
            </div>
            <div style={{textAlign: 'right'}}>
              <div style={{fontSize: '0.75rem', color: '#ea580c', backgroundColor: '#fed7aa', padding: '0.25rem 0.5rem', borderRadius: '9999px'}}>Масло, фільтр</div>
            </div>
          </div>
        </div>

        <div style={{
          background: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(12px)',
          borderRadius: '1rem',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          transition: 'all 0.3s ease',
          padding: '1.5rem',
          cursor: 'pointer',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '3px',
            background: 'linear-gradient(90deg, #3b82f6, #8b5cf6)',
            borderRadius: '2px'
          }}></div>
          <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
            <div style={{display: 'flex', alignItems: 'center', gap: '0.75rem'}}>
              <div style={{padding: '0.75rem', backgroundColor: '#dcfce7', borderRadius: '0.75rem', transition: 'all 0.2s'}}>
                <Icon name="fuel" size={24} className="text-green-600" />
              </div>
              <div>
                <div style={{color: '#6b7280', fontWeight: '500'}}>Середня витрата</div>
                <div style={{fontSize: '1.5rem', fontWeight: 'bold', color: '#111827'}}>7.2 л/100 mi</div>
              </div>
            </div>
            <div style={{textAlign: 'right'}}>
              <div style={{fontSize: '0.75rem', color: '#6b7280'}}>Краща: 6.4 • Гірша: 9.1</div>
            </div>
          </div>
        </div>
      </section>

      {/* Content Cards */}
      <section style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem'}}>
        <div style={{
          background: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(12px)',
          borderRadius: '1rem',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          transition: 'all 0.3s ease',
          padding: '1.5rem'
        }}>
          <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem'}}>
            <h2 style={{fontSize: '1.25rem', fontWeight: 'bold', color: '#111827'}}>Останні заправки</h2>
            <a href="/expenses/fuel" style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '0.75rem',
              background: 'linear-gradient(to right, #2563eb, #1d4ed8)',
              color: 'white',
              padding: '0.5rem 1rem',
              fontWeight: '600',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
              transition: 'all 0.2s ease',
              textDecoration: 'none',
              fontSize: '0.875rem'
            }}>
              <Icon name="fuel" size={16} style={{marginRight: '0.5rem'}} />
              Додати
            </a>
          </div>
          <div style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '1rem',
              backgroundColor: '#f9fafb',
              borderRadius: '0.75rem',
              transition: 'all 0.2s',
              cursor: 'pointer'
            }}>
              <div style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
                <div style={{padding: '0.5rem', backgroundColor: '#dbeafe', borderRadius: '0.5rem'}}>
                  <Icon name="fuel" size={20} className="text-blue-600" />
                </div>
                <div>
                  <div style={{fontWeight: '600', color: '#111827'}}>WOG • A95 — 32.5 л</div>
                  <div style={{fontSize: '0.875rem', color: '#6b7280'}}>18.09.2025 • 127 980 mi</div>
                </div>
              </div>
              <div style={{textAlign: 'right'}}>
                <div style={{fontWeight: 'bold', color: '#111827'}}>1 840 ₴</div>
                <div style={{fontSize: '0.75rem', color: '#16a34a'}}>56.6 ₴/л</div>
              </div>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '1rem',
              backgroundColor: '#f9fafb',
              borderRadius: '0.75rem',
              transition: 'all 0.2s',
              cursor: 'pointer'
            }}>
              <div style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
                <div style={{padding: '0.5rem', backgroundColor: '#dbeafe', borderRadius: '0.5rem'}}>
                  <Icon name="fuel" size={20} className="text-blue-600" />
                </div>
                <div>
                  <div style={{fontWeight: '600', color: '#111827'}}>OKKO • A95 — 28.1 л</div>
                  <div style={{fontSize: '0.875rem', color: '#6b7280'}}>10.09.2025 • 127 400 mi</div>
                </div>
              </div>
              <div style={{textAlign: 'right'}}>
                <div style={{fontWeight: 'bold', color: '#111827'}}>1 590 ₴</div>
                <div style={{fontSize: '0.75rem', color: '#16a34a'}}>56.6 ₴/л</div>
              </div>
            </div>
          </div>
        </div>

        <div style={{
          background: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(12px)',
          borderRadius: '1rem',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          transition: 'all 0.3s ease',
          padding: '1.5rem'
        }}>
          <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem'}}>
            <h2 style={{fontSize: '1.25rem', fontWeight: 'bold', color: '#111827'}}>Ближчі роботи</h2>
            <a href="/journal" style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '0.75rem',
              background: '#f1f5f9',
              color: '#374151',
              padding: '0.5rem 1rem',
              fontWeight: '500',
              transition: 'all 0.2s ease',
              textDecoration: 'none',
              fontSize: '0.875rem'
            }}>
              <Icon name="journal" size={16} style={{marginRight: '0.5rem'}} />
              В журнал
            </a>
          </div>
          <div style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
            <div style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '1rem',
              padding: '1rem',
              backgroundColor: '#fff7ed',
              borderRadius: '0.75rem',
              border: '1px solid #fed7aa'
            }}>
              <div style={{padding: '0.5rem', backgroundColor: '#fed7aa', borderRadius: '0.5rem'}}>
                <Icon name="parts" size={20} className="text-orange-600" />
              </div>
              <div style={{flex: 1}}>
                <div style={{fontWeight: '600', color: '#111827', marginBottom: '0.25rem'}}>Заміна масла та фільтра</div>
                <div style={{fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem'}}>через ~1200 mi або 1 місяць</div>
                <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                  <div style={{flex: 1, backgroundColor: '#e5e7eb', borderRadius: '9999px', height: '0.5rem'}}>
                    <div style={{backgroundColor: '#f97316', height: '0.5rem', borderRadius: '9999px', width: '75%'}}></div>
                  </div>
                  <span style={{fontSize: '0.75rem', color: '#ea580c', fontWeight: '500'}}>75%</span>
                </div>
              </div>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '1rem',
              padding: '1rem',
              backgroundColor: '#f9fafb',
              borderRadius: '0.75rem'
            }}>
              <div style={{padding: '0.5rem', backgroundColor: '#f3f4f6', borderRadius: '0.5rem'}}>
                <Icon name="parts" size={20} className="text-gray-600" />
              </div>
              <div style={{flex: 1}}>
                <div style={{fontWeight: '600', color: '#111827', marginBottom: '0.25rem'}}>Перевірка гальмівної рідини</div>
                <div style={{fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem'}}>через ~3 місяці</div>
                <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                  <div style={{flex: 1, backgroundColor: '#e5e7eb', borderRadius: '9999px', height: '0.5rem'}}>
                    <div style={{backgroundColor: '#9ca3af', height: '0.5rem', borderRadius: '9999px', width: '25%'}}></div>
                  </div>
                  <span style={{fontSize: '0.75rem', color: '#6b7280', fontWeight: '500'}}>25%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <BottomNav active="home" />
    </>
  )
}