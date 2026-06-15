import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Activity, Users, CreditCard, Calendar } from 'lucide-react';

export const Landing: React.FC = () => {
  const navigate = useNavigate();

  const features = [
    { icon: Users, title: 'Gestione Iscritti', desc: 'Anagrafica completa, certificati medici e storico presenze.' },
    { icon: CreditCard, title: 'Abbonamenti & Pagamenti', desc: 'Rinnovi automatici, fatturazione e integrazione Stripe.' },
    { icon: Calendar, title: 'Prenotazioni Corsi', desc: 'Calendario interattivo per classi e personal trainer.' },
    { icon: Activity, title: 'Report & Statistiche', desc: 'Analisi dettagliate su entrate, presenze e trend.' },
  ];

  return (
    <div className="animate-fade-in">
      {/* Navbar */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem 5%', background: 'var(--bg-surface)', borderBottom: '1px solid var(--border-color)', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 'bold', fontSize: '1.5rem', color: 'var(--accent)' }}>
          <Activity size={28} /> Jumpers
        </div>
        <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
          <a href="#features" style={{ color: 'var(--text-primary)', textDecoration: 'none', fontWeight: 500 }}>Funzionalità</a>
          <a href="#pricing" style={{ color: 'var(--text-primary)', textDecoration: 'none', fontWeight: 500 }}>Prezzi</a>
          <button className="btn btn-primary" onClick={() => navigate('/app')}>Accedi alla Demo</button>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={{ padding: '6rem 5%', textAlign: 'center', background: 'linear-gradient(180deg, var(--bg-surface) 0%, var(--bg-primary) 100%)' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div className="badge badge-info" style={{ marginBottom: '1.5rem', display: 'inline-block' }}>
            🚀 La nuova era del fitness management
          </div>
          <h1 style={{ fontSize: '3.5rem', marginBottom: '1.5rem', lineHeight: 1.2 }}>
            Gestisci la tua palestra con <span style={{ color: 'var(--accent)' }}>semplicità</span>
          </h1>
          <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', marginBottom: '2.5rem', lineHeight: 1.6 }}>
            Jumpers Fitness è il gestionale completo per centri fitness. Iscritti, abbonamenti, prenotazioni e fatturazione, tutto in un unico posto.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', animationDelay: '0.2s' }} className="animate-slide-up">
            <button className="btn btn-primary" style={{ padding: '1rem 2rem', fontSize: '1.125rem' }} onClick={() => navigate('/app')}>
              Apri la Dashboard <ArrowRight size={20} />
            </button>
            <button className="btn btn-secondary" style={{ padding: '1rem 2rem', fontSize: '1.125rem' }} onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}>
              Scopri di più
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" style={{ padding: '6rem 5%' }}>
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Tutto ciò che ti serve</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.125rem' }}>Strumenti potenti pensati per farti risparmiare tempo.</p>
        </div>
        <div className="grid-4">
          {features.map((f, i) => (
            <div key={i} className="card" style={{ textAlign: 'center', padding: '2rem' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '16px', background: 'var(--accent-light)', color: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                <f.icon size={32} />
              </div>
              <h3 style={{ marginBottom: '1rem' }}>{f.title}</h3>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.5 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" style={{ padding: '6rem 5%', background: 'var(--bg-surface)' }}>
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Piani Semplici e Trasparenti</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.125rem' }}>Scegli il piano perfetto per il tuo centro.</p>
        </div>
        <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <div className="card" style={{ width: '350px', padding: '2.5rem' }}>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Starter</h3>
            <div style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>€39<span style={{ fontSize: '1rem', color: 'var(--text-secondary)', fontWeight: 'normal' }}>/mese</span></div>
            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 2rem 0', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><CheckCircle2 size={20} className="text-success" /> Fino a 200 iscritti</li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><CheckCircle2 size={20} className="text-success" /> Gestione abbonamenti</li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><CheckCircle2 size={20} className="text-success" /> Supporto email</li>
            </ul>
            <button className="btn btn-secondary" style={{ width: '100%' }} onClick={() => navigate('/app')}>Inizia Gratis</button>
          </div>
          <div className="card" style={{ width: '350px', padding: '2.5rem', border: '2px solid var(--accent)', transform: 'scale(1.05)' }}>
            <div className="badge badge-info" style={{ position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)' }}>Più Popolare</div>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Pro</h3>
            <div style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>€79<span style={{ fontSize: '1rem', color: 'var(--text-secondary)', fontWeight: 'normal' }}>/mese</span></div>
            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 2rem 0', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><CheckCircle2 size={20} className="text-success" /> Iscritti illimitati</li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><CheckCircle2 size={20} className="text-success" /> Prenotazioni App</li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><CheckCircle2 size={20} className="text-success" /> Fatturazione elettronica</li>
            </ul>
            <button className="btn btn-primary" style={{ width: '100%' }} onClick={() => navigate('/app')}>Inizia Gratis</button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ padding: '3rem 5%', borderTop: '1px solid var(--border-color)', textAlign: 'center', color: 'var(--text-secondary)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '1rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>
          <Activity size={24} /> Jumpers Fitness
        </div>
        <p>© {new Date().getFullYear()} Jumpers Fitness. Tutti i diritti riservati.</p>
      </footer>
    </div>
  );
};
