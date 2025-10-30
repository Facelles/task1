'use client';
import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useRouter } from 'next/navigation';
import api from '../../../services/api';
import { FiEdit, FiTrash2 } from 'react-icons/fi';

interface Task {
  id: number;
  title: string;
  description: string;
  status: 'todo' | 'in progress' | 'done';
}

export default function TasksPage() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<string>('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<'todo' | 'in progress' | 'done'>('todo');
  const [loadingTasks, setLoadingTasks] = useState(false);

  useEffect(() => {
    if (!loading && !user) router.replace('/auth/login');
  }, [user, loading, router]);

  const fetchTasks = useCallback(async () => {
    setLoadingTasks(true);
    try {
      const res = await api.get('/tasks', { params: { status: filter || undefined } });
      setTasks(res.data);
    } finally {
      setLoadingTasks(false);
    }
  }, [filter]);

  useEffect(() => {
    if (user) fetchTasks();
  }, [user, fetchTasks]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingTask) {
        await api.put(`/tasks/${editingTask.id}`, { title, description, status });
        setEditingTask(null);
      } else {
        if(description.length > 20) return null;
        await api.post('/tasks', { title, description, status });
      }
      setTitle('');
      setDescription('');
      setStatus('todo');
      setModalOpen(false);
      fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await api.delete(`/tasks/${id}`);
      fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setTitle(task.title);
    setDescription(task.description);
    setStatus(task.status);
    setModalOpen(true);
  };

  if (loading || loadingTasks) return <div className="text-center p-4">Loading...</div>;

  const statusColors: Record<Task['status'], string> = {
    todo: 'bg-blue-200 text-blue-800',
    'in progress': 'bg-yellow-200 text-yellow-800',
    done: 'bg-green-200 text-green-800',
  };

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">Tasks</h1>
        <div className="flex gap-2">
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            onClick={() => setModalOpen(true)}
          >
            + New Task
          </button>
          <button
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            onClick={() => logout()}
          >
            Logout
          </button>
        </div>
      </div>
      <div className="mb-4 flex gap-2 flex-wrap justify-center">
        {['', 'todo', 'in progress', 'done'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1 border rounded ${
              filter === f ? 'bg-blue-500 text-white' : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            {f === '' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {tasks.map((task) => (
          <div key={task.id} className="border p-4 rounded shadow flex flex-col justify-between">
            <div>
              <h2 className="font-bold text-lg mb-1">{task.title}</h2>
              <p className="mb-2 text-gray-700">{task.description}</p>
              <span className={`px-2 py-1 rounded text-sm ${statusColors[task.status]}`}>
                {task.status}
              </span>
            </div>
            <div className="flex gap-2 mt-3 justify-end">
              <button
                className="text-yellow-600 hover:text-yellow-800"
                onClick={() => handleEdit(task)}
              >
                <FiEdit size={20} />
              </button>
              <button
                className="text-red-600 hover:text-red-800"
                onClick={() => handleDelete(task.id)}
              >
                <FiTrash2 size={20} />
              </button>
            </div>
          </div>
        ))}
      </div>
      {modalOpen && (
        <div className="modal-backdrop">
          <div className="modal">
            <h2 className="text-xl font-bold mb-4">{editingTask ? 'Edit Task' : 'New Task'}</h2>
            <form className="flex flex-col gap-2" onSubmit={handleSubmit}>
              <input
                className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
              <textarea
                className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              <select
                className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={status}
                onChange={(e) => setStatus(e.target.value as Task['status'])}
              >
                <option value="todo">Todo</option>
                <option value="in progress">In Progress</option>
                <option value="done">Done</option>
              </select>
              <div className="flex justify-end gap-2 mt-3">
                <button
                  type="button"
                  className="px-4 py-2 rounded border hover:bg-gray-100"
                  onClick={() => setModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600"
                >
                  {editingTask ? 'Update' : 'Add'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
