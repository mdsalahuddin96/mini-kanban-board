'use client';

import { fetcher } from '@/lip/api';
import { useState } from 'react';

interface Props {
  boardId: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function ShareModal({ boardId, isOpen, onClose }: Props) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  if (!isOpen) return null;

  const handleShare = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus(null);

    try {
      await fetcher(`/boards/${boardId}/share`, {
        method: 'POST',
        body: JSON.stringify({ email }),
      });
      setStatus({ type: 'success', message: 'User added as a board member!' });
      setEmail('');
    } catch (err: any) {
      setStatus({ type: 'error', message: err.message || 'Failed to share board' });
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 p-6 rounded-lg w-full max-w-md border border-slate-700 text-white">
        <h3 className="text-xl font-bold mb-4">Share Board with Collaborator</h3>
        {status && (
          <p className={`p-2 rounded text-sm mb-3 ${status.type === 'success' ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`}>
            {status.message}
          </p>
        )}
        <form onSubmit={handleShare} className="space-y-4">
          <div>
            <label className="block text-sm mb-1">User Email</label>
            <input
              type="email"
              required
              placeholder="colleague@example.com"
              className="w-full p-2 bg-slate-700 rounded border border-slate-600 focus:outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="flex justify-end gap-2">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-600 rounded">
              Close
            </button>
            <button type="submit" className="px-4 py-2 bg-indigo-600 rounded hover:bg-indigo-500">
              Add Member
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}