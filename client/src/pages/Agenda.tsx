import React, { useState, useEffect } from 'react';
import { CalendarDays, Plus, Clock, MapPin } from 'lucide-react';
import { Modal } from '../components/Modal';
import { useToast } from '../components/Toast';

interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  type: 'Meeting' | 'Manutenzione' | 'Altro';
}

const DEMO_EVENTS: Event[] = [
  { id: '1', title: 'Riunione Staff', date: new Date().toISOString().split('T')[0], time: '14:00', location: 'Ufficio Principale', type: 'Meeting' },
  { id: '2', title: 'Controllo Caldaia', date: new Date(Date.now() + 86400000).toISOString().split('T')[0], time: '09:00', location: 'Sala Macchine', type: 'Manutenzione' },
];

export const Agenda: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    const isDemo = localStorage.getItem('jumpers_demo_data') === 'true';
    if (isDemo) setEvents(DEMO_EVENTS);
  }, []);

  const handleAddEvent = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newEvent: Event = {
      id: Math.random().toString(36).substr(2, 9),
      title: formData.get('title') as string,
      date: formData.get('date') as string,
      time: formData.get('time') as string,
      location: formData.get('location') as string,
      type: formData.get('type') as any,
    };
    setEvents([...events, newEvent].sort((a, b) => new Date(`${a.date}T${a.time}`).getTime() - new Date(`${b.date}T${b.time}`).getTime()));
    showToast('Evento aggiunto all\'agenda', 'success');
    setIsModalOpen(false);
  };

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2>Agenda & Appuntamenti</h2>
        <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
          <Plus size={20} /> Nuovo Evento
        </button>
      </div>

      {events.length === 0 ? (
        <div className="empty-state">
          <CalendarDays size={64} className="empty-state-icon" />
          <h3>Nessun evento in programma</h3>
          <p>La tua agenda è vuota. Aggiungi riunioni o appuntamenti.</p>
          <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>Aggiungi Evento</button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {events.map(event => (
            <div key={event.id} className="card" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', padding: '1rem 1.5rem' }}>
              <div style={{ textAlign: 'center', minWidth: '80px', borderRight: '1px solid var(--border-color)', paddingRight: '1.5rem' }}>
                <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
                  {new Date(event.date).toLocaleDateString('it-IT', { month: 'short' })}
                </div>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--accent)' }}>
                  {new Date(event.date).getDate()}
                </div>
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={{ margin: 0, marginBottom: '0.5rem' }}>{event.title}</h3>
                <div style={{ display: 'flex', gap: '1.5rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Clock size={14} /> {event.time}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><MapPin size={14} /> {event.location}</span>
                </div>
              </div>
              <div>
                <span className={`badge ${event.type === 'Meeting' ? 'badge-info' : event.type === 'Manutenzione' ? 'badge-warning' : 'badge-success'}`}>
                  {event.type}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Nuovo Evento">
        <form onSubmit={handleAddEvent}>
          <div className="modal-body">
            <div className="form-group">
              <label className="form-label">Titolo Evento</label>
              <input type="text" name="title" className="form-control" required />
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
              <label className="form-label">Luogo</label>
              <input type="text" name="location" className="form-control" required />
            </div>
            <div className="form-group">
              <label className="form-label">Tipo</label>
              <select name="type" className="form-control">
                <option value="Meeting">Meeting</option>
                <option value="Manutenzione">Manutenzione</option>
                <option value="Altro">Altro</option>
              </select>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>Annulla</button>
            <button type="submit" className="btn btn-primary">Salva Evento</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};