import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, Users } from 'lucide-react';
import { Modal } from '../components/Modal';
import { useToast } from '../components/Toast';

interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  plan: string;
  status: 'Attivo' | 'Scaduto' | 'Sospeso';
}

const DEMO_CLIENTS: Client[] = [
  { id: '1', name: 'Mario Rossi', email: 'mario@example.com', phone: '333-1234567', plan: 'Pro', status: 'Attivo' },
  { id: '2', name: 'Laura Bianchi', email: 'laura@example.com', phone: '333-7654321', plan: 'Basic', status: 'Scaduto' },
  { id: '3', name: 'Giuseppe Verdi', email: 'giuseppe@example.com', phone: '333-9876543', plan: 'Premium', status: 'Attivo' },
];

export const CRM: React.FC = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const { showToast } = useToast();

  useEffect(() => {
    const isDemo = localStorage.getItem('jumpers_demo_data') === 'true';
    if (isDemo) setClients(DEMO_CLIENTS);
  }, []);

  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newClient: Client = {
      id: editingClient ? editingClient.id : Math.random().toString(36).substr(2, 9),
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      plan: formData.get('plan') as string,
      status: formData.get('status') as any,
    };

    if (editingClient) {
      setClients(clients.map(c => c.id === editingClient.id ? newClient : c));
      showToast('Cliente aggiornato con successo', 'success');
    } else {
      setClients([...clients, newClient]);
      showToast('Cliente aggiunto con successo', 'success');
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Sei sicuro di voler eliminare questo cliente?')) {
      setClients(clients.filter(c => c.id !== id));
      showToast('Cliente eliminato', 'info');
    }
  };

  const openModal = (client?: Client) => {
    setEditingClient(client || null);
    setIsModalOpen(true);
  };

  const filteredClients = clients.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div style={{ position: 'relative', width: '300px' }}>
          <Search size={20} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
          <input 
            type="text" 
            placeholder="Cerca cliente..." 
            className="form-control" 
            style={{ paddingLeft: '2.5rem' }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="btn btn-primary" onClick={() => openModal()}>
          <Plus size={20} /> Nuovo Cliente
        </button>
      </div>

      {clients.length === 0 ? (
        <div className="empty-state">
          <Users size={64} className="empty-state-icon" />
          <h3>Nessun cliente trovato</h3>
          <p>Inizia ad aggiungere i tuoi iscritti per gestire i loro abbonamenti.</p>
          <button className="btn btn-primary" onClick={() => openModal()}>Aggiungi il primo cliente</button>
        </div>
      ) : (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Email</th>
                <th>Telefono</th>
                <th>Piano</th>
                <th>Stato</th>
                <th style={{ textAlign: 'right' }}>Azioni</th>
              </tr>
            </thead>
            <tbody>
              {filteredClients.map(client => (
                <tr key={client.id}>
                  <td style={{ fontWeight: 500 }}>{client.name}</td>
                  <td style={{ color: 'var(--text-secondary)' }}>{client.email}</td>
                  <td>{client.phone}</td>
                  <td><span className="badge badge-info">{client.plan}</span></td>
                  <td>
                    <span className={`badge ${client.status === 'Attivo' ? 'badge-success' : client.status === 'Scaduto' ? 'badge-danger' : 'badge-warning'}`}>
                      {client.status}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <button className="btn-icon" onClick={() => openModal(client)}><Edit2 size={18} /></button>
                    <button className="btn-icon" onClick={() => handleDelete(client.id)}><Trash2 size={18} className="text-danger" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingClient ? 'Modifica Cliente' : 'Nuovo Cliente'}>
        <form onSubmit={handleSave}>
          <div className="modal-body">
            <div className="form-group">
              <label className="form-label">Nome Completo</label>
              <input type="text" name="name" className="form-control" defaultValue={editingClient?.name} required />
            </div>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input type="email" name="email" className="form-control" defaultValue={editingClient?.email} required />
            </div>
            <div className="form-group">
              <label className="form-label">Telefono</label>
              <input type="tel" name="phone" className="form-control" defaultValue={editingClient?.phone} required />
            </div>
            <div className="form-group">
              <label className="form-label">Piano Abbonamento</label>
              <select name="plan" className="form-control" defaultValue={editingClient?.plan || 'Basic'}>
                <option value="Basic">Basic</option>
                <option value="Pro">Pro</option>
                <option value="Premium">Premium</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Stato</label>
              <select name="status" className="form-control" defaultValue={editingClient?.status || 'Attivo'}>
                <option value="Attivo">Attivo</option>
                <option value="Sospeso">Sospeso</option>
                <option value="Scaduto">Scaduto</option>
              </select>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>Annulla</button>
            <button type="submit" className="btn btn-primary">Salva Cliente</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};