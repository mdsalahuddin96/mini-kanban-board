'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { fetcher } from '@/lip/api';


export default function DashboardPage() {
  const [boards, setBoards] = useState([]);
  const [title, setTitle] = useState('');
  const router = useRouter();

  const loadBoards = () => {
    fetcher('/boards')
      .then(setBoards)
      .catch(() => router.push('/login'));
  };

  useEffect(() => {
    loadBoards();
  }, []);

  const handleCreateBoard = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;

    await fetcher('/boards', {
      method: 'POST',
      body: JSON.stringify({ title }),
    });

    setTitle('');
    loadBoards();
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">My Kanban Boards</h1>

        {/* Create Board Form */}
        <form onSubmit={handleCreateBoard} className="flex gap-4 mb-8">
          <input
            type="text"
            placeholder="New Board Title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="flex-1 p-3 bg-slate-800 rounded border border-slate-700 focus:outline-none"
          />
          <button type="submit" className="bg-indigo-600 hover:bg-indigo-500 px-6 py-3 rounded font-semibold">
            Create Board
          </button>
        </form>

        {/* Boards List */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {boards.map((board: any) => (
            <div
              key={board.id}
              onClick={() => router.push(`/board/${board.id}`)}
              className="p-6 bg-slate-800 rounded-lg border border-slate-700 hover:border-indigo-500 cursor-pointer transition"
            >
              <h3 className="text-xl font-semibold mb-2">{board.title}</h3>
              <p className="text-sm text-slate-400">Owner: {board.owner.name}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}