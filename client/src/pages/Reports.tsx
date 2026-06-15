import React, { useState, useEffect } from 'react';
import { FileText, Download, Filter, BarChart2 } from 'lucide-react';
import { useToast } from '../components/Toast';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface ReportData {
  month: string;
  newMembers: number;
  revenue: number;
  attendance: number;
}

const DEMO_REPORTS: ReportData[] = [
  { month: 'Gennaio 2023', newMembers: 45, revenue: 35000, attendance: 1200 },
  { month: 'Febbraio 2023', newMembers: 52, revenue: 38000, attendance: 1350 },
  { month: 'Marzo 2023', newMembers: 61, revenue: 42000, attendance: 1500 },
  { month: 'Aprile 2023', newMembers: 48, revenue: 41000, attendance: 1420 },
];

export const Reports: React.FC = () => {
  const [data, setData] = useState<ReportData[]>([]);
  const { showToast } = useToast();

  useEffect(() => {
    const isDemo = localStorage.getItem('jumpers_demo_data') === 'true';
    if (isDemo) setData(DEMO_REPORTS);
  }, []);

  const exportPDF = () => {
    if (data.length === 0) {
      showToast('Nessun dato da esportare', 'error');
      return;
    }
    try {
      const doc = new jsPDF();
      doc.text('Report Mensile - Jumpers Fitness', 14, 15);
      
      const tableData = data.map(row => [
        row.month, 
        row.newMembers.toString(), 
        `€ ${row.revenue.toLocaleString()}`, 
        row.attendance.toString()
      ]);

      autoTable(doc, {
        startY: 25,
        head: [['Mese', 'Nuovi Iscritti', 'Entrate', 'Presenze']],
        body: tableData,
        theme: 'grid',
        headStyles: { fillColor: [255, 0, 200] }
      });

      doc.save('jumpers-report.pdf');
      showToast('PDF esportato con successo', 'success');
    } catch (error) {
      showToast('Errore durante l\'esportazione', 'error');
    }
  };

  const exportCSV = () => {
    if (data.length === 0) {
      showToast('Nessun dato da esportare', 'error');
      return;
    }
    const headers = ['Mese', 'Nuovi Iscritti', 'Entrate', 'Presenze'];
    const csvContent = [
      headers.join(','),
      ...data.map(row => `${row.month},${row.newMembers},${row.revenue},${row.attendance}`)
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'jumpers-report.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('CSV esportato con successo', 'success');
  };

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2>Report e Statistiche</h2>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button className="btn btn-secondary" onClick={exportCSV}>
            <Download size={18} /> Esporta CSV
          </button>
          <button className="btn btn-primary" onClick={exportPDF}>
            <FileText size={18} /> Esporta PDF
          </button>
        </div>
      </div>

      {data.length === 0 ? (
        <div className="empty-state">
          <BarChart2 size={64} className="empty-state-icon" />
          <h3>Nessun dato disponibile</h3>
          <p>I report verranno generati automaticamente man mano che utilizzi l'app.</p>
        </div>
      ) : (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Mese</th>
                <th>Nuovi Iscritti</th>
                <th>Entrate</th>
                <th>Presenze Totali</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row, i) => (
                <tr key={i}>
                  <td style={{ fontWeight: 500 }}>{row.month}</td>
                  <td>{row.newMembers}</td>
                  <td style={{ color: 'var(--success)', fontWeight: 500 }}>€ {row.revenue.toLocaleString()}</td>
                  <td>{row.attendance}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};