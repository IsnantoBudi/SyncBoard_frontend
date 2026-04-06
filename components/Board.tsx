import { Task } from '../types';
import Card from './Card';

interface BoardProps {
  tasks: Task[];
  onStatusChange: (id: number, status: string) => void;
  onDelete: (id: number) => void;
}

export default function Board({ tasks, onStatusChange, onDelete }: BoardProps) {
  const columnConfig = [
    { id: 'todo', title: 'To Do', color: 'bg-slate-100 text-slate-600', dot: 'bg-slate-400' },
    { id: 'in_progress', title: 'In Progress', color: 'bg-blue-50 text-blue-600', dot: 'bg-blue-500' },
    { id: 'done', title: 'Done', color: 'bg-emerald-50 text-emerald-600', dot: 'bg-emerald-500' }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
      {columnConfig.map(column => (
        <div key={column.id} className="glass-panel p-5 rounded-3xl min-h-[500px] flex flex-col border-t border-l border-white/60">
          <h2 className="text-sm font-bold mb-6 uppercase tracking-widest text-slate-600 flex items-center justify-between pb-4 border-b border-white/50">
            <div className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${column.dot}`}></span>
              {column.title}
            </div>
            <span className={`text-xs px-2.5 py-1 rounded-full font-bold shadow-sm ${column.color}`}>
              {tasks.filter(t => t.status === column.id).length}
            </span>
          </h2>
          <div className="flex-1 space-y-4 relative w-full h-full">
            {tasks.filter(t => t.status === column.id).length === 0 && (
               <div className="absolute inset-0 flex items-center justify-center text-slate-400/50 text-sm font-medium border-2 border-dashed border-slate-300/30 rounded-2xl">
                 Drop tasks here
               </div>
            )}
            <div className="relative space-y-4">
              {tasks.filter(t => t.status === column.id).map(task => (
                <Card 
                  key={task.id} 
                  task={task} 
                  onStatusChange={onStatusChange}
                  onDelete={onDelete} 
                />
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
