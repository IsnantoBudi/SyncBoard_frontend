import { Task } from '@/types';
import HomeClient from './HomeClient';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

async function getTasks(): Promise<Task[]> {
  try {
    const res = await fetch(`${API_URL}/tasks`, {
      next: { revalidate: 0 }, // always fresh on first server render
    });
    if (res.ok) {
      const data = await res.json();
      return data || [];
    }
  } catch (e) {
    console.error('Server fetch tasks failed:', e);
  }
  return [];
}

export default async function Home() {
  const initialTasks = await getTasks();

  return <HomeClient initialTasks={initialTasks} />;
}
