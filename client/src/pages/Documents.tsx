import React, { useState, useEffect } from 'react';
import { Folder, File, Upload, Download, Trash2 } from 'lucide-react';
import { useToast } from '../components/Toast';

interface Document {
  id: string;
  name: string;
  size: string;
  date: string;
  type: string;
}

const DEMO_DOCS: Document[] = [
  { id: '1', name: 'Regolamento_Palestra.pdf', size: '2.4 MB', date: '2023-10-15', type: 'pdf' },
  { id: '2', name: 'Contratto_Assunzione_Mario.docx', size: '1.1 MB', date: '2023-11-02', type: 'doc' },
  { id: '3', name: 'Planimetria_Emergenza.png', size: '4.5 MB', date: '2023-09-20', type: 'img' },
];

export const Documents: React.FC = () => {
  const [docs, setDocs] = useState<Document[]>([]);
  const { showToast } = useToast();

  useEffect(() => {
    const isDemo = localStorage.getItem('jumpers_demo_data') === 'true';
    if (isDemo) setDocs(DEMO_DOCS);
  }, []);

  const handleUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.onchange = (e: any) => {
      const file = e.target.files[0];
      if (file) {
        const newDoc: Document = {
          id: Math.random().toString(36).substr(2, 9),
          name: file.name,
          size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
          date: new Date().toISOString().split('T')[0],
          type: file.name.split('.').pop() || 'file'
        };
        setDocs([newDoc, ...docs]);
        showToast('Documento caricato con successo', 'success');
      }
    };
    input.click();
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Eliminare questo documento?')) {
      setDocs(docs.filter(d => d.id !== id));
      showToast('Documento eliminato', 'info');
    }
  };

  const handleDownload = (name: string) => {
    showToast(`Download di ${name} avviato`, 'success');
  };

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2>Archivio Documenti</h2>
        <button className="btn btn-primary" onClick={handleUpload}>
          <Upload size={20} /> Carica File
        </button>
      </div>

      {docs.length === 0 ? (
        <div className="empty-state">
          <Folder size={64} className="empty-state-icon" />
          <h3>Nessun documento</h3>
          <p>Carica contratti, regolamenti o file utili per lo staff.</p>
          <button className="btn btn-primary" onClick={handleUpload}>Carica il primo file</button>
        </div>
      ) : (
        <div className="grid-3">
          {docs.map(doc => (
            <div key={doc.id} className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '8px', background: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent)' }}>
                <File size={24} />
              </div>
              <div style={{ flex: 1, overflow: 'hidden' }}>
                <h4 style={{ margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={doc.name}>
                  {doc.name}
                </h4>
                <div style={{ display: 'flex', gap: '1rem', color: 'var(--text-secondary)', fontSize: '0.75rem', marginTop: '0.25rem' }}>
                  <span>{doc.size}</span>
                  <span>{doc.date}</span>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button className="btn-icon" onClick={() => handleDownload(doc.name)} title="Scarica">
                  <Download size={16} />
                </button>
                <button className="btn-icon" onClick={() => handleDelete(doc.id)} title="Elimina">
                  <Trash2 size={16} className="text-danger" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};