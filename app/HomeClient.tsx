"use client";

import { useCallback, useEffect, useState } from 'react';
import Board from '@/components/Board';
import Form from '@/components/Form';
import { Task } from '@/types';
import { useWebSocket } from '@/lib/websocket';
import { Users } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';
const WS_URL = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8080/ws';

interface HomeClientProps {
  initialTasks: Task[];
}

export default function HomeClient({ initialTasks }: HomeClientProps) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const { activeUsers, lastMessage } = useWebSocket(WS_URL);

  const fetchTasks = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/tasks`);
      if (res.ok) {
        const data = await res.json();
        setTasks(data || []);
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  useEffect(() => {
    if (lastMessage && lastMessage.type === 'TASK_UPDATED') {
      fetchTasks();
    }
  }, [lastMessage, fetchTasks]);

  const handleAdd = useCallback(async (title: string, desc: string, author: string) => {
    // Optimistic UI
    const tempTask: Task = {
      id: Date.now(),
      title,
      description: desc,
      status: 'todo',
      author_name: author,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    setTasks(prev => [tempTask, ...prev]);

    try {
      await fetch(`${API_URL}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description: desc, author_name: author })
      });
    } catch (e) {
      console.error(e);
      fetchTasks();
    }
  }, [fetchTasks]);

  const handleStatusChange = useCallback(async (id: number, status: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, status: status as Task['status'] } : t));

    try {
      await fetch(`${API_URL}/tasks/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
    } catch (e) {
      console.error(e);
      fetchTasks();
    }
  }, [fetchTasks]);

  const handleDelete = useCallback(async (id: number) => {
    setTasks(prev => prev.filter(t => t.id !== id));

    try {
      await fetch(`${API_URL}/tasks/${id}`, {
        method: 'DELETE'
      });
    } catch (e) {
      console.error(e);
      fetchTasks();
    }
  }, [fetchTasks]);

  return (
    <main className="min-h-screen relative font-sans text-gray-900 overflow-hidden">
      {/* Abstract Vector Mesh Background */}
      <div className="fixed inset-0 z-[-1] bg-gradient-to-br from-indigo-50 via-blue-50/50 to-cyan-50">
        <div className="blob absolute top-0 -left-4 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-40"></div>
        <div className="blob animation-delay-2000 absolute top-0 -right-4 w-96 h-96 bg-yellow-300 rounded-full mix-blend-multiply filter blur-3xl opacity-40"></div>
        <div className="blob animation-delay-4000 absolute -bottom-8 left-20 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-40"></div>
        <div className="blob animation-delay-6000 absolute bottom-1/4 right-1/4 w-[30rem] h-[30rem] bg-cyan-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
        <svg className="absolute inset-0 w-full h-full opacity-[0.04]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto p-6 lg:py-12 relative z-10">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 drop-shadow-sm">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-500">Sync</span>Board
            </h1>
            <p className="text-slate-500 mt-2 font-medium tracking-wide">Real-time Collaborative Task Workspace</p>
          </div>
          <div className="glass flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold text-slate-700">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            <Users size={18} className="ml-1 text-emerald-600" />
            {activeUsers} Online
          </div>
        </header>

        <Form onAdd={handleAdd} />
        
        <Board tasks={tasks} onStatusChange={handleStatusChange} onDelete={handleDelete} />
      </div>
    </main>
  );
}
