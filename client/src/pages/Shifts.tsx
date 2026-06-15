import React, { useState, useEffect } from 'react';
import { Clock, Plus, User } from 'lucide-react';
import { Modal } from '../components/Modal';
import { useToast } from '../components/Toast';

interface Shift {
  id: string;
  employee: string;
  role: string;
  date: string;
  startTime: string;
  endTime: string;
}

const DEMO_SHIFTS: Shift[] = [
  { id: '1', employee: 'Marco T.', role: 'Personal Trainer', date: new Date().toISOString().split('T')[0], startTime: '08:00', endTime: '14:00' },
  { id: '2', employee: 'Sara L.', role: 'Reception', date: new Date().toISOString().split('T')[0], startTime: '14:00', endTime: '22:00' },
];

export const Shifts: React.FC = () => {
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    const isDemo = localStorage.getItem('jumpers_demo_data') === 'true';
    if (isDemo) setShifts(DEMO_SHIFTS);
  }, []);

  const handleAddShift = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newShift: Shift = {
      id: Math.random().toString(36).substr(2, 9),
      employee: formData.get('employee') as string,
      role: formData.get('role') as string,
      date: formData.get('date') as string,
      startTime: formData.get('startTime') as string,
      endTime: formData.get('endTime') as string,
    };
    setShifts([...shifts, newShift].sort((a, b) => new Date(`${a.date}T${a.startTime}`).getTime() - new Date(`${b.date}T${b.startTime}`).getTime()));
    showToast('Turno assegnato', 'success');
    setIsModalOpen(false);
  };

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2>Turni Staff</h2>
        <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
          <Plus size={20} /> Assegna Turno
        </button>
      </div>

      {shifts.length === 0 ? (
        <div className="empty-state">
          <Clock size={64} className="empty-state-icon" />
          <h3>Nessun turno programmato</h3>
          <p>Organizza gli orari del tuo staff.</p>
          <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>Assegna Turno</button>
        </div>
      ) : (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Data</th>
                <th>Dipendente</th>
                <th>Ruolo</th>
                <th>Orario</th>
              </tr>
            </thead>
            <tbody>
              {shifts.map(shift => (
                <tr key={shift.id}>
                  <td>{shift.date}</td>
                  <td style={{ fontWeight: 500, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <User size={16} color="var(--accent)" /> {shift.employee}
                  </td>
                  <td><span className="badge badge-info">{shift.role}</span></td>
                  <td>{shift.startTime} - {shift.endTime}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Assegna Turno">
        <form onSubmit={handleAddShift}>
          <div className="modal-body">
            <div className="form-group">
              <label className="form-label">Dipendente</label>
              <input type="text" name="employee" className="form-control" required />
            </div>
            <div className="form-group">
              <label className="form-label">Ruolo</label>
              <input type="text" name="role" className="form-control" required />
            </div>
            <div className="form-group">
              <label className="form-label">Data</label>
              <input type="date" name="date" className="form-control" required />
            </div>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <div className="form-group" style={{ flex: 1 }}>
                <label className="form-label">Inizio</label>
                <input type="time" name="startTime" className="form-control" required />
              </div>
              <div className="form-group" style={{ flex: 1 }}>
                <label className="form-label">Fine</label>
                <input type="time" name="endTime" className="form-control" required />
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>Annulla</button>
            <button type="submit" className="btn btn-primary">Salva Turno</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};