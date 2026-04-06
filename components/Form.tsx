import { useState } from 'react';
import { Plus } from 'lucide-react';

export default function Form({ onAdd }: { onAdd: (title: string, desc: string, author: string) => void }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [authorName, setAuthorName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    
    onAdd(title, description, authorName);
    
    setTitle('');
    setDescription('');
  };

  return (
    <form onSubmit={handleSubmit} className="glass-panel p-6 md:p-8 rounded-3xl mb-10 transition-all duration-300 border-t border-l border-white/80">
      <h2 className="text-xl font-bold mb-6 text-slate-800 flex items-center gap-2 drop-shadow-sm">
        <div className="bg-blue-100 p-2 rounded-xl text-blue-600">
          <Plus size={20} strokeWidth={3} />
        </div>
        Add New Task
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-5">
          <input
            type="text"
            placeholder="What needs to be done? *"
            className="w-full px-5 py-3.5 glass-input rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-400/50 text-slate-800 placeholder-slate-400 font-medium tracking-wide"
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
          />
          <textarea
            placeholder="Add a more detailed description..."
            className="w-full px-5 py-3.5 glass-input rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-400/50 text-slate-700 placeholder-slate-400 resize-none min-h-[100px]"
            value={description}
            onChange={e => setDescription(e.target.value)}
          />
        </div>
        <div className="space-y-5 flex flex-col justify-between">
          <input
            type="text"
            placeholder="Your Name (Optional)"
            className="w-full px-5 py-3.5 glass-input rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-400/50 text-slate-700 placeholder-slate-400"
            value={authorName}
            onChange={e => setAuthorName(e.target.value)}
          />
          <button 
            type="submit"
            disabled={!title.trim()}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-slate-300 disabled:to-slate-400 text-white font-semibold py-4 px-6 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-blue-500/30 active:scale-[0.98]"
          >
            Create Task
          </button>
        </div>
      </div>
    </form>
  );
}
