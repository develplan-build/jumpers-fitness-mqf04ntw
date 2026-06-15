import React, { useState, useEffect } from 'react';
import { Users, CreditCard, Calendar, TrendingUp } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const DEMO_DATA = {
  kpis: [
    { title: 'Iscritti Attivi', value: '1,245', trend: '+12%', icon: Users, color: 'var(--info)' },
    { title: 'Entrate Mensili', value: '€ 45,200', trend: '+8%', icon: CreditCard, color: 'var(--success)' },
    { title: 'Prenotazioni Oggi', value: '156', trend: '+24%', icon: Calendar, color: 'var(--warning)' },
    { title: 'Tasso di Rinnovo', value: '89%', trend: '+2%', icon: TrendingUp, color: 'var(--accent)' }
  ],
  revenueData: [
    { name: 'Gen', value: 35000 }, { name: 'Feb', value: 38000 }, { name: 'Mar', value: 42000 },
    { name: 'Apr', value: 41000 }, { name: 'Mag', value: 45000 }, { name: 'Giu', value: 48000 }
  ],
  attendanceData: [
    { name: 'Lun', value: 120 }, { name: 'Mar', value: 150 }, { name: 'Mer', value: 180 },
    { name: 'Gio', value: 140 }, { name: 'Ven', value: 160 }, { name: 'Sab', value: 90 }, { name: 'Dom', value: 60 }
  ]
};

const EMPTY_DATA = {
  kpis: [
    { title: 'Iscritti Attivi', value: '0', trend: '0%', icon: Users, color: 'var(--info)' },
    { title: 'Entrate Mensili', value: '€ 0', trend: '0%', icon: CreditCard, color: 'var(--success)' },
    { title: 'Prenotazioni Oggi', value: '0', trend: '0%', icon: Calendar, color: 'var(--warning)' },
    { title: 'Tasso di Rinnovo', value: '0%', trend: '0%', icon: TrendingUp, color: 'var(--accent)' }
  ],
  revenueData: [],
  attendanceData: []
};

export const Dashboard: React.FC = () => {
  const [data, setData] = useState(EMPTY_DATA);

  useEffect(() => {
    const isDemo = localStorage.getItem('jumpers_demo_data') === 'true';
    setData(isDemo ? DEMO_DATA : EMPTY_DATA);
  }, []);

  return (
    <div className="animate-fade-in">
      <div className="grid-3" style={{ marginBottom: '2rem' }}>
        {data.kpis.map((kpi, i) => (
          <div key={i} className="card" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: `${kpi.color}20`, color: kpi.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <kpi.icon size={24} />
            </div>
            <div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '0.25rem' }}>{kpi.title}</p>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
                <h3 style={{ fontSize: '1.5rem', margin: 0 }}>{kpi.value}</h3>
                <span style={{ color: kpi.trend.startsWith('+') ? 'var(--success)' : 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: 500 }}>
                  {kpi.trend}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid-3" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))' }}>
        <div className="card">
          <h3 style={{ marginBottom: '1.5rem' }}>Andamento Entrate</h3>
          {data.revenueData.length > 0 ? (
            <div style={{ height: '300px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data.revenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                  <XAxis dataKey="name" stroke="var(--text-secondary)" />
                  <YAxis stroke="var(--text-secondary)" />
                  <Tooltip contentStyle={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: '8px' }} />
                  <Line type="monotone" dataKey="value" stroke="var(--accent)" strokeWidth={3} dot={{ r: 4, fill: 'var(--accent)' }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="empty-state" style={{ padding: '2rem' }}>
              <TrendingUp size={48} className="empty-state-icon" />
              <p>Nessun dato finanziario disponibile.</p>
            </div>
          )}
        </div>

        <div className="card">
          <h3 style={{ marginBottom: '1.5rem' }}>Presenze Settimanali</h3>
          {data.attendanceData.length > 0 ? (
            <div style={{ height: '300px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.attendanceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                  <XAxis dataKey="name" stroke="var(--text-secondary)" />
                  <YAxis stroke="var(--text-secondary)" />
                  <Tooltip contentStyle={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: '8px' }} cursor={{ fill: 'var(--bg-secondary)' }} />
                  <Bar dataKey="value" fill="var(--info)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="empty-state" style={{ padding: '2rem' }}>
              <Users size={48} className="empty-state-icon" />
              <p>Nessun dato sulle presenze.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};