import React, { useState, useEffect } from 'react';
import { CheckSquare, Check, X } from 'lucide-react';
import { useToast } from '../components/Toast';

interface Request {
  id: string;
  employee: string;
  type: string;
  description: string;
  date: string;
  status: 'pending' | 'approved' | 'rejected';
}

const DEMO_REQUESTS: Request[] = [
  { id: '1', employee: 'Marco T.', type: 'Ferie', description: 'Richiesta ferie dal 10 al 15 Agosto', date: '2023-07-20', status: 'pending' },
  { id: '2', employee: 'Sara L.', type: 'Rimborso', description: 'Acquisto materiale pulizia (50€)', date: '2023-07-22', status: 'pending' },
  { id: '3', employee: 'Alex B.', type: 'Cambio Turno', description: 'Cambio turno con Marco per il 25/07', date: '2023-07-18', status: 'approved' },
];

export const Approvals: React.FC = () => {
  const [requests, setRequests] = useState<Request[]>([]);
  const { showToast } = useToast();

  useEffect(() => {
    const isDemo = localStorage.getItem('jumpers_demo_data') === 'true';
    if (isDemo) setRequests(DEMO_REQUESTS);
  }, []);

  const handleAction = (id: string, action: 'approved' | 'rejected') => {
    setRequests(requests.map(r => r.id === id ? { ...r, status: action } : r));
    showToast(`Richiesta ${action === 'approved' ? 'approvata' : 'rifiutata'}`, action === 'approved' ? 'success' : 'info');
  };

  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: '2rem' }}>
        <h2>Approvazioni in Sospeso</h2>
      </div>

      {requests.length === 0 ? (
        <div className="empty-state">
          <CheckSquare size={64} className="empty-state-icon" />
          <h3>Nessuna richiesta</h3>
          <p>Non ci sono richieste in attesa di approvazione.</p>
        </div>
      ) : (
        <div className="grid-3">
          {requests.map(req => (
            <div key={req.id} className="card" style={{ borderLeft: `4px solid ${req.status === 'pending' ? 'var(--warning)' : req.status === 'approved' ? 'var(--success)' : 'var(--danger)'}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <span className="badge badge-info">{req.type}</span>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{req.date}</span>
              </div>
              <h4 style={{ margin: 0, marginBottom: '0.5rem' }}>{req.employee}</h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>{req.description}</p>
              
              {req.status === 'pending' ? (
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button className="btn btn-secondary" style={{ flex: 1, color: 'var(--danger)', borderColor: 'var(--danger)' }} onClick={() => handleAction(req.id, 'rejected')}>
                    <X size={16} /> Rifiuta
                  </button>
                  <button className="btn btn-primary" style={{ flex: 1, background: 'var(--success)', borderColor: 'var(--success)' }} onClick={() => handleAction(req.id, 'approved')}>
                    <Check size={16} /> Approva
                  </button>
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '0.5rem', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-sm)', color: req.status === 'approved' ? 'var(--success)' : 'var(--danger)', fontWeight: 'bold' }}>
                  {req.status === 'approved' ? 'Approvata' : 'Rifiutata'}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};