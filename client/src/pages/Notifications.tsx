import React, { useState, useEffect } from 'react';
import { Bell, CheckCircle2 } from 'lucide-react';
import { useToast } from '../components/Toast';

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
}

const DEMO_NOTIFS: Notification[] = [
  { id: '1', title: 'Nuovo Iscritto', message: 'Mario Rossi si è appena iscritto al piano Pro.', time: '10 min fa', read: false },
  { id: '2', title: 'Pagamento Fallito', message: 'Il rinnovo di Laura Bianchi è fallito.', time: '1 ora fa', read: false },
  { id: '3', title: 'Sistema', message: 'Backup settimanale completato con successo.', time: 'Ieri', read: true },
];

export const Notifications: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { showToast } = useToast();

  useEffect(() => {
    const isDemo = localStorage.getItem('jumpers_demo_data') === 'true';
    if (isDemo) setNotifications(DEMO_NOTIFS);
  }, []);

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
    showToast('Tutte le notifiche segnate come lette', 'success');
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2>Centro Notifiche {unreadCount > 0 && <span className="badge badge-danger" style={{ marginLeft: '0.5rem' }}>{unreadCount} nuove</span>}</h2>
        {unreadCount > 0 && (
          <button className="btn btn-secondary" onClick={markAllAsRead}>
            Segna tutte come lette
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="empty-state">
          <Bell size={64} className="empty-state-icon" />
          <h3>Nessuna notifica</h3>
          <p>Sei aggiornato su tutto.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '800px' }}>
          {notifications.map(notif => (
            <div key={notif.id} className="card" style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', opacity: notif.read ? 0.7 : 1, borderLeft: notif.read ? 'none' : '4px solid var(--accent)' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: notif.read ? 'var(--bg-secondary)' : 'var(--accent-light)', color: notif.read ? 'var(--text-secondary)' : 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Bell size={20} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                  <h4 style={{ margin: 0, fontWeight: notif.read ? 500 : 600 }}>{notif.title}</h4>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{notif.time}</span>
                </div>
                <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{notif.message}</p>
              </div>
              {!notif.read && (
                <button className="btn-icon" onClick={() => markAsRead(notif.id)} title="Segna come letta">
                  <CheckCircle2 size={20} className="text-success" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};