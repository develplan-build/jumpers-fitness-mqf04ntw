import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastProvider } from './components/Toast';
import { Layout } from './components/Layout';
import { Landing } from './pages/Landing';
import { Dashboard } from './pages/Dashboard';
import { CRM } from './pages/CRM';
import { Booking } from './pages/Booking';
import { Billing } from './pages/Billing';
import { Reports } from './pages/Reports';
import { Kanban } from './pages/Kanban';
import { Agenda } from './pages/Agenda';
import { Documents } from './pages/Documents';
import { Shifts } from './pages/Shifts';
import { Approvals } from './pages/Approvals';
import { Notifications } from './pages/Notifications';

function App() {
  return (
    <ToastProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/app" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="crm" element={<CRM />} />
            <Route path="booking" element={<Booking />} />
            <Route path="reports" element={<Reports />} />
            <Route path="billing" element={<Billing />} />
            <Route path="kanban" element={<Kanban />} />
            <Route path="agenda" element={<Agenda />} />
            <Route path="documents" element={<Documents />} />
            <Route path="shifts" element={<Shifts />} />
            <Route path="approvals" element={<Approvals />} />
            <Route path="notifications" element={<Notifications />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </ToastProvider>
  );
}

export default App;