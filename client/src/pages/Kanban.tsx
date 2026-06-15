import React, { useState, useEffect } from 'react';
import { Plus, MoreVertical, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { Modal } from '../components/Modal';
import { useToast } from '../components/Toast';

type TaskStatus = 'todo' | 'in-progress' | 'done';

interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: 'Bassa' | 'Media' | 'Alta';
}

const DEMO_TASKS: Task[] = [
  { id: '1', title: 'Riparare tapis roulant #3', description: 'Il nastro è allentato', status: 'todo', priority: 'Alta' },
  { id: '2', title: 'Ordine integratori', description: 'Mancano le proteine al cioccolato', status: 'in-progress', priority: 'Media' },
  { id: '3', title: 'Pulizia spogliatoi', description: 'Pulizia profonda settimanale', status: 'done', priority: 'Bassa' },
];

export const Kanban: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    const isDemo = localStorage.getItem('jumpers_demo_data') === 'true';
    if (isDemo) setTasks(DEMO_TASKS);
  }, []);

  const handleAddTask = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newTask: Task = {
      id: Math.random().toString(36).substr(2, 9),
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      status: 'todo',
      priority: formData.get('priority') as 'Bassa' | 'Media' | 'Alta',
    };
    setTasks([...tasks, newTask]);
    showToast('Task aggiunto', 'success');
    setIsModalOpen(false);
  };

  const moveTask = (id: string, newStatus: TaskStatus) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, status: newStatus } : t));
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id));
    showToast('Task eliminato', 'info');
  };

  const columns: { id: TaskStatus; title: string; icon: any; color: string }[] = [
    { id: 'todo', title: 'Da Fare', icon: AlertCircle, color: 'var(--danger)' },
    { id: 'in-progress', title: 'In Corso', icon: Clock, color: 'var(--warning)' },
    { id: 'done', title: 'Completati', icon: CheckCircle, color: 'var(--success)' }
  ];

  return (
    <div className="animate-fade-in" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2>Task & Manutenzione</h2>
        <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
          <Plus size={20} /> Nuovo Task
        </button>
      </div>

      <div style={{ display: 'flex', gap: '1.5rem', flex: 1, overflowX: 'auto', paddingBottom: '1rem' }}>
        {columns.map(col => (
          <div key={col.id} style={{ flex: 1, minWidth: '300px', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
              <col.icon size={20} color={col.color} />
              <h3 style={{ margin: 0, fontSize: '1.125rem' }}>{col.title}</h3>
              <span className="badge" style={{ marginLeft: 'auto', background: 'var(--bg-surface)' }}>
                {tasks.filter(t => t.status === col.id).length}
              </span>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1 }}>
              {tasks.filter(t => t.status === col.id).map(task => (
                <div key={task.id} className="card" style={{ padding: '1rem', cursor: 'grab' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                    <h4 style={{ margin: 0, fontSize: '1rem' }}>{task.title}</h4>
                    <button className="btn-icon" style={{ padding: '2px' }} onClick={() => deleteTask(task.id)}>
                      <MoreVertical size={16} />
                    </button>
                  </div>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1rem' }}>{task.description}</p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span className={`badge ${task.priority === 'Alta' ? 'badge-danger' : task.priority === 'Media' ? 'badge-warning' : 'badge-info'}`}>
                      {task.priority}
                    </span>
                    <div style={{ display: 'flex', gap: '0.25rem' }}>
                      {col.id !== 'todo' && <button className="btn-icon" style={{ padding: '4px' }} onClick={() => moveTask(task.id, col.id === 'done' ? 'in-progress' : 'todo')}>←</button>}
                      {col.id !== 'done' && <button className="btn-icon" style={{ padding: '4px' }} onClick={() => moveTask(task.id, col.id === 'todo' ? 'in-progress' : 'done')}>→</button>}
                    </div>
                  </div>
                </div>
              ))}
              {tasks.filter(t => t.status === col.id).length === 0 && (
                <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)', border: '1px dashed var(--border-color)', borderRadius: 'var(--radius-sm)' }}>
                  Nessun task
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Nuovo Task">
        <form onSubmit={handleAddTask}>
          <div className="modal-body">
            <div className="form-group">
              <label className="form-label">Titolo</label>
              <input type="text" name="title" className="form-control" required />
            </div>
            <div className="form-group">
              <label className="form-label">Descrizione</label>
              <textarea name="description" className="form-control" rows={3} required></textarea>
            </div>
            <div className="form-group">
              <label className="form-label">Priorità</label>
              <select name="priority" className="form-control">
                <option value="Bassa">Bassa</option>
                <option value="Media">Media</option>
                <option value="Alta">Alta</option>
              </select>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>Annulla</button>
            <button type="submit" className="btn btn-primary">Aggiungi Task</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};