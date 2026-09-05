'use client';

import { useState, useEffect } from 'react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (title: string, description: string) => void;
  initialData?: { title: string; description?: string } | null;
}

export default function TaskModal({ isOpen, onClose, onSubmit, initialData }: Props) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setDescription(initialData.description || '');
    } else {
      setTitle('');
      setDescription('');
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSubmit(title, description);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 p-6 rounded-lg w-full max-w-md border border-slate-700 text-white">
        <h3 className="text-xl font-bold mb-4">{initialData ? 'Edit Task' : 'Add New Task'}</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm mb-1">Task Title</label>
            <input
              type="text"
              required
              className="w-full p-2 bg-slate-700 rounded border border-slate-600 focus:outline-none"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Description (Optional)</label>
            <textarea
              className="w-full p-2 bg-slate-700 rounded border border-slate-600 focus:outline-none h-24"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-600 rounded hover:bg-slate-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 rounded hover:bg-indigo-500"
            >
              {initialData ? 'Save Changes' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}