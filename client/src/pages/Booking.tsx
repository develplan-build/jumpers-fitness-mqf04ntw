import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, Plus, Clock, Users, Trash2 } from 'lucide-react';
import { Modal } from '../components/Modal';
import { useToast } from '../components/Toast';

interface Session {
  id: string;
  title: string;
  instructor: string;
  date: string;
  time: string;
  capacity: number;
  booked: number;
}

const DEMO_SESSIONS: Session[] = [
  { id: '1', title: 'Crossfit WOD', instructor: 'Marco T.', date: new Date().toISOString().split('T')[0], time: '18:00', capacity: 20, booked: 18 },
  { id: '2', title: 'Yoga Flow', instructor: 'Sara L.', date: new Date().toISOString().split('T')[0], time: '19:30', capacity: 15, booked: 15 },
  { id: '3', title: 'Spinning', instructor: 'Alex B.', date: new Date(Date.now() + 86400000).toISOString().split('T')[0], time: '07:00', capacity: 25, booked: 10 },
];

export const Booking: React.FC = () => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    const isDemo = localStorage.getItem('jumpers_demo_data') === 'true';
    if (isDemo) setSessions(DEMO_SESSIONS);
  }, []);

  const handleAddSession = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newSession: Session = {
      id: Math.random().toString(36).substr(2, 9),
      title: formData.get('title') as string,
      instructor: formData.get('instructor') as string,
      date: formData.get('date') as string,
      time: formData.get('time') as string,
      capacity: parseInt(formData.get('capacity') as string, 10),
      booked: 0,
    };
    setSessions([...sessions, newSession]);
    showToast('Sessione creata con successo', 'success');
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Eliminare questa sessione?')) {
      setSessions(sessions.filter(s => s.id !== id));
      showToast('Sessione eliminata', 'info');
    }
  };

  const handleBook = (id: string) => {
    setSessions(sessions.map(s => {
      if (s.id === id) {
        if (s.booked >= s.capacity) {
          showToast('Sessione al completo', 'error');
          return s;
        }
        showToast('Prenotazione confermata', 'success');
        return { ...s, booked: s.booked + 1 };
      }
      return s;
    }));
  };

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2>Calendario Corsi</h2>
        <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
          <Plus size={20} /> Nuova Sessione
        </button>
      </div>

      {sessions.length === 0 ? (
        <div className="empty-state">
          <CalendarIcon size={64} className="empty-state-icon" />
          <h3>Nessuna sessione programmata</h3>
          <p>Crea la tua prima classe per permettere ai clienti di prenotarsi.</p>
          <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>Crea Sessione</button>
        </div>
      ) : (
        <div className="grid-3">
          {sessions.map(session => (
            <div key={session.id} className="card" style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <div>
                  <h3 style={{ margin: 0, color: 'var(--accent)' }}>{session.title}</h3>
                  <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>con {session.instructor}</span>
                </div>
                <button className="btn-icon" onClick={() => handleDelete(session.id)}><Trash2 size={16} className="text-danger" /></button>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem', flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)' }}>
                  <CalendarIcon size={16} /> <span>{session.date}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)' }}>
                  <Clock size={16} /> <span>{session.time}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: session.booked >= session.capacity ? 'var(--danger)' : 'var(--success)' }}>
                  <Users size={16} /> <span>{session.booked} / {session.capacity} prenotati</span>
                </div>
              </div>

              <button 
                className="btn btn-secondary" 
                style={{ width: '100%' }} 
                onClick={() => handleBook(session.id)}
                disabled={session.booked >= session.capacity}
              >
                {session.booked >= session.capacity ? 'Al Completo' : 'Prenota Posto'}
              </button>
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Nuova Sessione">
        <form onSubmit={handleAddSession}>
          <div className="modal-body">
            <div className="form-group">
              <label className="form-label">Nome Corso</label>
              <input type="text" name="title" className="form-control" required placeholder="es. Crossfit WOD" />
            </div>
            <div className="form-group">
              <label className="form-label">Istruttore</label>
              <input type="text" name="instructor" className="form-control" required />
            </div>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <div className="form-group" style={{ flex: 1 }}>
                <label className="form-label">Data</label>
                <input type="date" name="date" className="form-control" required />
              </div>
              <div className="form-group" style={{ flex: 1 }}>
                <label className="form-label">Ora</label>
                <input type="time" name="time" className="form-control" required />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Capacità Massima</label>
              <input type="number" name="capacity" className="form-control" required min="1" defaultValue="20" />
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>Annulla</button>
            <button type="submit" className="btn btn-primary">Crea Sessione</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};