export interface Task {
  id: number;
  title: string;
  description: string;
  status: 'todo' | 'in_progress' | 'done';
  author_name: string;
  created_at: string;
  updated_at: string;
}
