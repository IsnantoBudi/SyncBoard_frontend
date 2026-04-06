import { Task } from '../types';
import { Trash2, ArrowRight, ArrowLeft } from 'lucide-react';

export default function Card({ task, onStatusChange, onDelete }: { task: Task, onStatusChange: any, onDelete: any }) {
  return (
    <div className="glass-card p-5 rounded-2xl group border-l border-t border-white/60">
      <div className="flex justify-between items-start mb-3">
        <h3 className="font-semibold text-slate-800 leading-snug pr-4">{task.title}</h3>
        <button 
          onClick={() => onDelete(task.id)} 
          className="text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all duration-300 p-1 hover:bg-red-50 rounded-lg shrink-0"
          title="Delete Task"
        >
          <Trash2 size={16} />
        </button>
      </div>
      
      {task.description && (
        <p className="text-sm text-slate-500 mb-5 leading-relaxed bg-white/30 p-3 rounded-xl border border-white/40">
          {task.description}
        </p>
      )}
      
      <div className="flex justify-between items-center text-xs mt-auto pt-2">
        <span className="bg-gradient-to-r from-blue-50 to-indigo-50 text-indigo-700 px-3 py-1.5 rounded-lg font-medium border border-blue-100 shadow-sm">
          {task.author_name || 'Anonymous'}
        </span>
        <div className="flex gap-2">
          {task.status !== 'todo' && (
            <button 
              onClick={() => onStatusChange(task.id, task.status === 'done' ? 'in_progress' : 'todo')} 
              className="p-1.5 bg-white shadow-sm hover:shadow hover:bg-slate-50 border border-slate-100 rounded-lg text-slate-500 hover:text-indigo-600 transition-all active:scale-95"
              title="Move Back"
            >
              <ArrowLeft size={14} strokeWidth={2.5} />
            </button>
          )}
          {task.status !== 'done' && (
            <button 
              onClick={() => onStatusChange(task.id, task.status === 'todo' ? 'in_progress' : 'done')} 
              className="p-1.5 bg-white shadow-sm hover:shadow hover:bg-slate-50 border border-slate-100 rounded-lg text-slate-500 hover:text-emerald-600 transition-all active:scale-95"
              title="Move Forward"
            >
              <ArrowRight size={14} strokeWidth={2.5} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
