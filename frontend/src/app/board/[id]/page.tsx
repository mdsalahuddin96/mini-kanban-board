'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import KanbanBoard from '@/components/KanbanBoard';
import { Board } from '@/types/kanban';
import { fetcher } from '@/lip/api';

export default function BoardPage() {
  const params = useParams();
  const [board, setBoard] = useState<Board | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.id) {
      fetcher(`/boards/${params.id}`)
        .then((data) => setBoard(data))
        .catch((err) => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [params.id]);

  if (loading) return <div className="p-8 text-center text-white">Loading Kanban Board...</div>;
  if (!board) return <div className="p-8 text-center text-red-400">Board not found or access denied.</div>;

  return <KanbanBoard initialBoard={board} />;
}