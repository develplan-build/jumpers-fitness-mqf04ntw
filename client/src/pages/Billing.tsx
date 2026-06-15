import React, { useState, useEffect } from 'react';
import { CreditCard, Download, ExternalLink, CheckCircle } from 'lucide-react';
import { useToast } from '../components/Toast';
import { HAS_BACKEND, API_URL } from '../config';

interface Invoice {
  id: string;
  date: string;
  amount: number;
  status: 'Pagata' | 'In Attesa' | 'Scaduta';
  plan: string;
}

const DEMO_INVOICES: Invoice[] = [
  { id: 'INV-2023-001', date: '2023-10-01', amount: 39, status: 'Pagata', plan: 'Pro Plan' },
  { id: 'INV-2023-002', date: '2023-11-01', amount: 39, status: 'Pagata', plan: 'Pro Plan' },
  { id: 'INV-2023-003', date: '2023-12-01', amount: 39, status: 'In Attesa', plan: 'Pro Plan' },
];

export const Billing: React.FC = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const { showToast } = useToast();

  useEffect(() => {
    const isDemo = localStorage.getItem('jumpers_demo_data') === 'true';
    if (isDemo) setInvoices(DEMO_INVOICES);
  }, []);

  const handleCheckout = async (priceId: string, planName: string) => {
    if (!HAS_BACKEND) {
      showToast(`Modalità Demo: Checkout per ${planName} simulato. Configura Stripe nel backend per i pagamenti reali.`, 'info');
      return;
    }
    try {
      const res = await fetch(`${API_URL}/api/stripe/checkout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId })
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        showToast(data.error || 'Errore durante il checkout', 'error');
      }
    } catch (err) {
      showToast('Errore di connessione al server', 'error');
    }
  };

  const handleDownload = (id: string) => {
    showToast(`Download fattura ${id} avviato`, 'success');
  };

  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: '3rem' }}>
        <h2 style={{ marginBottom: '1.5rem' }}>Il tuo Abbonamento</h2>
        <div className="grid-3">
          <div className="card" style={{ border: '1px solid var(--accent)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ margin: 0 }}>Piano Attuale: Pro</h3>
              <span className="badge badge-success">Attivo</span>
            </div>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>39€ / mese. Prossimo rinnovo: 01 Gennaio 2024</p>
            <button className="btn btn-secondary" style={{ width: '100%' }} onClick={() => handleCheckout('price_pro_demo', 'Pro Plan')}>
              Gestisci su Stripe <ExternalLink size={16} />
            </button>
          </div>
          <div className="card" style={{ opacity: 0.7 }}>
            <h3 style={{ margin: 0, marginBottom: '1rem' }}>Upgrade a Premium</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>59€ / mese. Sedi illimitate e API custom.</p>
            <button className="btn btn-primary" style={{ width: '100%' }} onClick={() => handleCheckout('price_premium_demo', 'Premium Plan')}>
              Effettua Upgrade
            </button>
          </div>
        </div>
      </div>

      <div>
        <h2 style={{ marginBottom: '1.5rem' }}>Storico Fatture</h2>
        {invoices.length === 0 ? (
          <div className="empty-state">
            <CreditCard size={64} className="empty-state-icon" />
            <h3>Nessuna fattura presente</h3>
            <p>Le tue fatture appariranno qui dopo il primo pagamento.</p>
          </div>
        ) : (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>ID Fattura</th>
                  <th>Data</th>
                  <th>Piano</th>
                  <th>Importo</th>
                  <th>Stato</th>
                  <th style={{ textAlign: 'right' }}>Azione</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map(invoice => (
                  <tr key={invoice.id}>
                    <td style={{ fontWeight: 500 }}>{invoice.id}</td>
                    <td>{invoice.date}</td>
                    <td>{invoice.plan}</td>
                    <td>€ {invoice.amount.toFixed(2)}</td>
                    <td>
                      <span className={`badge ${invoice.status === 'Pagata' ? 'badge-success' : invoice.status === 'Scaduta' ? 'badge-danger' : 'badge-warning'}`}>
                        {invoice.status}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button className="btn-icon" onClick={() => handleDownload(invoice.id)} title="Scarica PDF">
                        <Download size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};