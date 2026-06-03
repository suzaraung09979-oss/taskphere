'use client'

import { useEffect, useState } from 'react';
import CreateTaskForm from '@/components/CreateTaskForm';

interface Task {
  id: number;
  title: string;
  description: string | null;
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  status: 'TODO' | 'IN_PROGRESS' | 'DONE';
}

export default function KanbanBoard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  // 🔥 UI ကို အပိတ်အဖွင့် လုပ်ပေးမည့် State အသစ် (Default အနေနဲ့ ပိတ်ထားပါမယ်)
  const [showList, setShowList] = useState<boolean>(false);

  const fetchTasks = async () => {
    try {
      const res = await fetch('/api/tasks', { cache: 'no-store' });
      const data = await res.json();
      if (Array.isArray(data)) setTasks(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const moveTask = async (id: number, nextStatus: 'TODO' | 'IN_PROGRESS' | 'DONE') => {
    await fetch(`/api/tasks/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: nextStatus })
    });
    fetchTasks();
  };

  const togglePriority = async (id: number, currentPriority: 'LOW' | 'MEDIUM' | 'HIGH') => {
    let nextPriority: 'LOW' | 'MEDIUM' | 'HIGH' = 'LOW';
    if (currentPriority === 'LOW') nextPriority = 'MEDIUM';
    else if (currentPriority === 'MEDIUM') nextPriority = 'HIGH';
    else if (currentPriority === 'HIGH') nextPriority = 'LOW';

    try {
      await fetch(`/api/tasks/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priority: nextPriority })
      });
      fetchTasks(); 
    } catch (error) {
      console.error(error);
    }
  };

  const deleteTask = async (id: number) => {
    if (!confirm("ဒီ Task ကို အပြီးဖျက်ပစ်ရန် သေချာပါသလား။")) return;
    try {
      const res = await fetch(`/api/tasks/${id}`, { method: 'DELETE' });
      if (res.ok) fetchTasks();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6 flex flex-col items-center">
      
      {/* 📋 TASK CREATION FORM */}
      <div className="w-full flex justify-center mb-6">
        <CreateTaskForm onTaskCreated={fetchTasks} />
      </div>

      {/* 🔥 VIEW LIST TOGGLE BUTTON */}
      <div className="mb-8">
        <button
          onClick={() => setShowList(!showList)}
          className={`px-6 py-3 rounded-xl font-bold tracking-wide shadow-lg transition duration-300 transform active:scale-95 flex items-center gap-2 text-sm ${
            showList 
              ? 'bg-red-600 hover:bg-red-500 text-white' 
              : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white'
          }`}
        >
          {showList ? '🙈 Hide Kanban Board' : '📋 View List (Kanban Board)'}
        </button>
      </div>

      {/* 🔥 KANBAN COLUMNS (showList က True ဖြစ်မှသာ ပွင့်လာပါလိမ့်မယ်) */}
      {showList && (
        <div className="w-full flex gap-4 items-start animate-in fade-in duration-300">
          
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
                  <button 
                    onClick={() => togglePriority(task.id, task.priority)}
                    className={`text-[10px] font-bold px-2 py-1 rounded cursor-pointer hover:scale-105 transition ${task.priority === 'HIGH' ? 'bg-red-500/20 text-red-400' : task.priority === 'MEDIUM' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-blue-500/20 text-blue-400'}`}
                  >
                    ⚙️ {task.priority}
                  </button>
                  <button onClick={() => moveTask(task.id, 'IN_PROGRESS')} className="text-xs bg-blue-600 hover:bg-blue-500 px-3 py-1 rounded transition">
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
                  <button 
                    onClick={() => togglePriority(task.id, task.priority)}
                    className={`text-[10px] font-bold px-2 py-1 rounded cursor-pointer hover:scale-105 transition ${task.priority === 'HIGH' ? 'bg-red-500/20 text-red-400' : task.priority === 'MEDIUM' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-blue-500/20 text-blue-400'}`}
                  >
                    ⚙️ {task.priority}
                  </button>
                  <button onClick={() => moveTask(task.id, 'DONE')} className="text-xs bg-green-600 hover:bg-green-500 px-3 py-1 rounded transition">
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
                  <button 
                    onClick={() => togglePriority(task.id, task.priority)}
                    className="text-[10px] font-bold px-2 py-1 rounded bg-green-500/20 text-green-400 hover:scale-105 transition"
                  >
                    ⚙️ {task.priority}
                  </button>
                  <button 
                    onClick={() => deleteTask(task.id)}
                    className="text-xs bg-red-600/80 hover:bg-red-600 px-2 py-1 rounded text-red-100 transition duration-150 flex items-center gap-1"
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>
      )}
    </div>
  );
}