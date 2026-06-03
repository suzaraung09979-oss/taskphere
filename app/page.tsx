'use client'

import { useEffect, useState } from 'react';

// ၁။ ဒေတာဘေ့စ်ထဲကလာမည့် Task ရဲ့ ပုံစံခွက် (Type Interface) ကို သတ်မှတ်ခြင်း
interface Task {
  id: number;
  title: string;
  description: string | null;
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  status: 'TODO' | 'IN_PROGRESS' | 'DONE';
  created_at?: string;
  updated_at?: string;
}

export default function KanbanBoard() {
  // ၂။ State မှာ Task Type Array ဖြစ်ကြောင်း ကြေညာခြင်း
  const [tasks, setTasks] = useState<Task[]>([]);

  // Database ဆီက Tasks တွေကို လှမ်းတောင်းခြင်း (READ)
  const fetchTasks = async () => {
    try {
      const res = await fetch('/api/tasks');
      const data = await res.json();
      if (Array.isArray(data)) {
        setTasks(data);
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // ကတ်တစ်ခုကို နောက်တစ်ဆင့်ရွှေ့မည့် ခလုတ် Function (UPDATE)
  const moveTask = async (id: number, nextStatus: 'TODO' | 'IN_PROGRESS' | 'DONE') => {
    try {
      await fetch(`/api/tasks/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus })
      });
      fetchTasks(); // UI ကို ချက်ချင်း Refresh ဖြစ်အောင် ပြန်ခေါ်ခြင်း
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  return (
    <div className="flex gap-4 p-6 min-h-screen bg-slate-900 text-white">
      
      {/* 📝 TODO COLUMN */}
      <div className="flex-1 bg-slate-800/50 p-4 rounded-xl backdrop-blur-md border border-slate-700/50">
        <h2 className="font-bold mb-4 text-red-400 text-lg flex items-center gap-2">
          To Do <span className="bg-red-500/20 text-red-400 text-xs px-2 py-0.5 rounded-full">{tasks.filter(t => t.status === 'TODO').length}</span>
        </h2>
        {tasks.filter(t => t.status === 'TODO').map(task => (
          <div key={task.id} className="bg-slate-800 p-4 rounded-lg mb-3 shadow-lg border border-slate-700 hover:border-slate-600 transition">
            <h4 className="font-semibold text-slate-200">{task.title}</h4>
            {task.description && <p className="text-sm text-slate-400 mt-1">{task.description}</p>}
            <div className="flex justify-between items-center mt-3">
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${task.priority === 'HIGH' ? 'bg-red-500/20 text-red-400' : task.priority === 'MEDIUM' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-blue-500/20 text-blue-400'}`}>
                {task.priority}
              </span>
              <button 
                onClick={() => moveTask(task.id, 'IN_PROGRESS')}
                className="text-xs bg-blue-600 hover:bg-blue-500 px-3 py-1 rounded transition duration-200"
              >
                Start ➔
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ⏳ IN PROGRESS COLUMN */}
      <div className="flex-1 bg-slate-800/50 p-4 rounded-xl backdrop-blur-md border border-slate-700/50">
        <h2 className="font-bold mb-4 text-yellow-400 text-lg flex items-center gap-2">
          In Progress <span className="bg-yellow-500/20 text-yellow-400 text-xs px-2 py-0.5 rounded-full">{tasks.filter(t => t.status === 'IN_PROGRESS').length}</span>
        </h2>
        {tasks.filter(t => t.status === 'IN_PROGRESS').map(task => (
          <div key={task.id} className="bg-slate-800 p-4 rounded-lg mb-3 shadow-lg border border-slate-700 hover:border-slate-600 transition">
            <h4 className="font-semibold text-slate-200">{task.title}</h4>
            {task.description && <p className="text-sm text-slate-400 mt-1">{task.description}</p>}
            <div className="flex justify-between items-center mt-3">
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${task.priority === 'HIGH' ? 'bg-red-500/20 text-red-400' : task.priority === 'MEDIUM' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-blue-500/20 text-blue-400'}`}>
                {task.priority}
              </span>
              <button 
                onClick={() => moveTask(task.id, 'DONE')}
                className="text-xs bg-green-600 hover:bg-green-500 px-3 py-1 rounded transition duration-200"
              >
                Done ✓
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ✅ DONE COLUMN */}
      <div className="flex-1 bg-slate-800/50 p-4 rounded-xl backdrop-blur-md border border-slate-700/50">
        <h2 className="font-bold mb-4 text-green-400 text-lg flex items-center gap-2">
          Done <span className="bg-green-500/20 text-green-400 text-xs px-2 py-0.5 rounded-full">{tasks.filter(t => t.status === 'DONE').length}</span>
        </h2>
        {tasks.filter(t => t.status === 'DONE').map(task => (
          <div key={task.id} className="bg-slate-800 p-4 rounded-lg mb-3 shadow-lg border border-slate-700 opacity-70 hover:opacity-100 transition">
            <h4 className="font-semibold text-slate-300 line-through">{task.title}</h4>
            {task.description && <p className="text-sm text-slate-500 mt-1">{task.description}</p>}
            <div className="flex justify-between items-center mt-3">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-green-500/20 text-green-400">
                {task.priority}
              </span>
              {/* Member 2 က ၎င်းနေရာတွင် အမှိုက်ပုံး (Delete Icon) ခလုတ် လာထည့်ပါလိမ့်မည် */}
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}