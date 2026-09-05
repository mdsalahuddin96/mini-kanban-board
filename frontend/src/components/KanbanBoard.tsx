'use client';

import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { Board, Task } from '@/types/kanban';
import TaskModal from './TaskModal';
import ShareModal from './ShareModal';
import { fetcher } from '@/lip/api';

interface Props {
  initialBoard: Board;
}

export default function KanbanBoard({ initialBoard }: Props) {
  const [board, setBoard] = useState<Board>(initialBoard);
  const [newColumnTitle, setNewColumnTitle] = useState('');
  
  // Modals state
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [activeColumnId, setActiveColumnId] = useState<string | null>(null);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // Reload Board Data
  const refreshBoard = async () => {
    const data = await fetcher(`/boards/${board.id}`);
    setBoard(data);
  };

  // Add Column
  const handleAddColumn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newColumnTitle.trim()) return;

    await fetcher(`/boards/${board.id}/columns`, {
      method: 'POST',
      body: JSON.stringify({ boardId: board.id, title: newColumnTitle }),
    });

    setNewColumnTitle('');
    refreshBoard();
  };

  // Delete Column
  const handleDeleteColumn = async (columnId: string) => {
    if (!confirm('Are you sure you want to delete this column and its tasks?')) return;
    await fetcher(`/boards/${board.id}/columns/${columnId}`, { method: 'DELETE' });
    refreshBoard();
  };

  // Task Create or Edit Handler
  const handleTaskSubmit = async (title: string, description: string) => {
    if (editingTask) {
      await fetcher(`/boards/${board.id}/tasks/${editingTask.id}`, {
        method: 'PUT',
        body: JSON.stringify({ title, description }),
      });
    } else if (activeColumnId) {
      await fetcher(`/boards/${board.id}/tasks`, {
        method: 'POST',
        body: JSON.stringify({ columnId: activeColumnId, title, description }),
      });
    }
    setEditingTask(null);
    setActiveColumnId(null);
    refreshBoard();
  };

  // Delete Task
  const handleDeleteTask = async (taskId: string) => {
    if (!confirm('Delete this task?')) return;
    await fetcher(`/boards/${board.id}/tasks/${taskId}`, { method: 'DELETE' });
    refreshBoard();
  };

  // Drag and drop reordering logic
  const onDragEnd = async (result: DropResult) => {
    const { source, destination, draggableId } = result;

    if (!destination) return;
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;

    const sourceCol = board.columns.find((col) => col.id === source.droppableId);
    const destCol = board.columns.find((col) => col.id === destination.droppableId);

    if (!sourceCol || !destCol) return;

    const sourceTasks = Array.from(sourceCol.tasks);
    const destTasks = source.droppableId === destination.droppableId ? sourceTasks : Array.from(destCol.tasks);

    const [movedTask] = sourceTasks.splice(source.index, 1);
    destTasks.splice(destination.index, 0, movedTask);

    const newColumns = board.columns.map((col) => {
      if (col.id === source.droppableId) return { ...col, tasks: sourceTasks };
      if (col.id === destination.droppableId) return { ...col, tasks: destTasks };
      return col;
    });

    setBoard({ ...board, columns: newColumns });

    const prevTask = destTasks[destination.index - 1];
    const nextTask = destTasks[destination.index + 1];

    try {
      await fetcher(`/boards/${board.id}/tasks/${draggableId}/move`, {
        method: 'PATCH',
        body: JSON.stringify({
          targetColumnId: destination.droppableId,
          prevTaskId: prevTask ? prevTask.id : null,
          nextTaskId: nextTask ? nextTask.id : null,
        }),
      });
    } catch (error) {
      console.error('Failed to sync task move with server', error);
      refreshBoard();
    }
  };

  return (
    <div className="p-6 bg-slate-900 min-h-screen text-slate-100">
      {/* Header & Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <h1 className="text-3xl font-bold">{board.title}</h1>
        <button
          onClick={() => setIsShareModalOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded font-medium text-sm transition"
        >
          + Share Board
        </button>
      </div>

      {/* Add Column Form */}
      <form onSubmit={handleAddColumn} className="flex gap-2 max-w-sm mb-6">
        <input
          type="text"
          placeholder="New Column Name..."
          value={newColumnTitle}
          onChange={(e) => setNewColumnTitle(e.target.value)}
          className="flex-1 p-2 bg-slate-800 rounded border border-slate-700 text-sm focus:outline-none"
        />
        <button type="submit" className="bg-slate-700 hover:bg-slate-600 px-4 py-2 rounded text-sm font-semibold">
          Add Column
        </button>
      </form>

      {/* Kanban Board Columns */}
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex gap-6 overflow-x-auto pb-6">
          {board.columns.map((column) => (
            <div key={column.id} className="w-80 bg-slate-800 rounded-lg p-4 flex-shrink-0 flex flex-col max-h-[80vh]">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold text-indigo-400">{column.title}</h2>
                <button
                  onClick={() => handleDeleteColumn(column.id)}
                  className="text-slate-500 hover:text-red-400 text-xs"
                >
                  Delete
                </button>
              </div>

              <Droppable droppableId={column.id}>
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="flex-1 overflow-y-auto min-h-[150px] flex flex-col gap-3 pr-1"
                  >
                    {column.tasks.map((task, index) => (
                      <Draggable key={task.id} draggableId={task.id} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`p-4 rounded bg-slate-700 border border-slate-600 shadow group relative ${
                              snapshot.isDragging ? 'ring-2 ring-indigo-500' : ''
                            }`}
                          >
                            <p className="font-semibold text-sm">{task.title}</p>
                            {task.description && (
                              <p className="text-xs text-slate-400 mt-1">{task.description}</p>
                            )}

                            {/* Task Action Buttons */}
                            <div className="mt-3 pt-2 border-t border-slate-600/50 flex justify-end gap-3 text-xs">
                              <button
                                onClick={() => {
                                  setEditingTask(task);
                                  setIsTaskModalOpen(true);
                                }}
                                className="text-slate-300 hover:text-indigo-300"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeleteTask(task.id)}
                                className="text-red-400 hover:text-red-300"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>

              <button
                onClick={() => {
                  setActiveColumnId(column.id);
                  setEditingTask(null);
                  setIsTaskModalOpen(true);
                }}
                className="mt-3 w-full py-2 bg-slate-700 hover:bg-slate-600 rounded text-sm font-medium border border-dashed border-slate-600 text-slate-300"
              >
                + Add Task
              </button>
            </div>
          ))}
        </div>
      </DragDropContext>

      {/* Modals */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        onSubmit={handleTaskSubmit}
        initialData={editingTask}
      />

      <ShareModal
        boardId={board.id}
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
      />
    </div>
  );
}