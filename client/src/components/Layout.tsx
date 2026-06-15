import React, { useState, useEffect } from 'react';
import { Outlet, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Users, Calendar, FileText, Bell, 
  CreditCard, Trello, CalendarDays, Folder, Clock, 
  CheckSquare, MessageSquare, Menu, X, Moon, Sun, LogOut, Database
} from 'lucide-react';
import { HAS_BACKEND } from '../config';
import { useToast } from './Toast';

const NAV_ITEMS = [
  { path: '/app', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/app/crm', label: 'CRM Clienti', icon: Users },
  { path: '/app/booking', label: 'Prenotazioni', icon: Calendar },
  { path: '/app/reports', label: 'Report & Export', icon: FileText },
  { path: '/app/billing', label: 'Fatturazione', icon: CreditCard },
  { path: '/app/kanban', label: 'Task Kanban', icon: Trello },
  { path: '/app/agenda', label: 'Agenda', icon: CalendarDays },
  { path: '/app/documents', label: 'Documenti', icon: Folder },
  { path: '/app/shifts', label: 'Turni Staff', icon: Clock },
  { path: '/app/approvals', label: 'Approvazioni', icon: CheckSquare },
  { path: '/app/notifications', label: 'Notifiche', icon: Bell },
];

export const Layout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [showDemoBanner, setShowDemoBanner] = useState(!HAS_BACKEND);
  const location = useLocation();
  const navigate = useNavigate();
  const { showToast } = useToast();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const handleLogout = () => {
    showToast('Logout effettuato con successo', 'success');
    navigate('/');
  };

  const loadDemoData = () => {
    localStorage.setItem('jumpers_demo_data', 'true');
    showToast('Dati demo caricati. Ricarico l\'app...', 'success');
    setTimeout(() => window.location.reload(), 1000);
  };

  const clearData = () => {
    localStorage.removeItem('jumpers_demo_data');
    showToast('Dati azzerati. Ricarico l\'app...', 'info');
    setTimeout(() => window.location.reload(), 1000);
  };

  const currentTitle = NAV_ITEMS.find(item => item.path === location.pathname)?.label || 'Jumpers Fitness';

  return (
    <div className="app-container">
      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8h1a4 4 0 0 1 0 8h-1"></path>
              <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path>
              <line x1="6" y1="1" x2="6" y2="4"></line>
              <line x1="10" y1="1" x2="10" y2="4"></line>
              <line x1="14" y1="1" x2="14" y2="4"></line>
            </svg>
          </div>
          <span className="sidebar-title">Jumpers</span>
          <button className="btn-icon" style={{ marginLeft: 'auto' }} onClick={() => setSidebarOpen(false)}>
            <X size={20} className="d-md-none" />
          </button>
        </div>
        <nav className="sidebar-nav">
          {NAV_ITEMS.map((item) => (
            <NavLink 
              key={item.path} 
              to={item.path} 
              end={item.path === '/app'}
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
              onClick={() => setSidebarOpen(false)}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
        <div style={{ padding: '1rem', borderTop: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
            <button className="btn btn-secondary" style={{ flex: 1, fontSize: '0.75rem', padding: '0.5rem' }} onClick={loadDemoData}>
              <Database size={14} /> Demo
            </button>
            <button className="btn btn-secondary" style={{ flex: 1, fontSize: '0.75rem', padding: '0.5rem' }} onClick={clearData}>
              Azzera
            </button>
          </div>
          <button className="nav-item" style={{ width: '100%', background: 'transparent', border: 'none', cursor: 'pointer' }} onClick={handleLogout}>
            <LogOut size={20} />
            <span>Esci</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        {showDemoBanner && (
          <div className="demo-banner">
            <Info size={16} />
            <span>Modalità demo - i dati sono locali. Scarica il codice e segui il README per attivare backend e database reali.</span>
            <button className="btn-icon" style={{ marginLeft: 'auto', color: 'inherit' }} onClick={() => setShowDemoBanner(false)}>
              <X size={16} />
            </button>
          </div>
        )}
        
        <header className="header">
          <div className="header-left">
            <button className="btn-icon" onClick={() => setSidebarOpen(true)} style={{ display: 'block' }}>
              <Menu size={24} />
            </button>
            <h1 className="header-title">{currentTitle}</h1>
          </div>
          <div className="header-right">
            <button className="btn-icon" onClick={toggleTheme} title="Cambia tema">
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 'bold' }}>
              AD
            </div>
          </div>
        </header>

        <div className="page-container">
          <Outlet />
        </div>
      </main>
    </div>
  );
};