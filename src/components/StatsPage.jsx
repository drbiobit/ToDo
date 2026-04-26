import React, { useState } from 'react';
import { useTodo } from '../context/TodoContext';
import { usePomodoro } from '../context/PomodoroContext';

const StatsPage = () => {
  const { state: todoState } = useTodo();
  const { state: pomoState } = usePomodoro();
  const [timeframe, setTimeframe] = useState('daily');

  const { tasks } = todoState;
  
  const getFilteredData = (type, frame) => {
    const now = new Date();
    const startOfDay = new Date(now.setHours(0,0,0,0));
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    let start = startOfDay;
    if (frame === 'weekly') start = startOfWeek;
    if (frame === 'monthly') start = startOfMonth;

    if (type === 'todo') {
      return tasks.filter(t => t.completed && t.completedAt && new Date(t.completedAt) >= start);
    } else {
      // Pomo sessions are stored in sessionsLog
      return (pomoState.sessionsLog || []).filter(s => new Date(s.timestamp) >= start);
    }
  };

  const completedTasks = getFilteredData('todo', timeframe);
  const completedPomos = getFilteredData('pomo', timeframe);

  const totalFocusSeconds = completedPomos.reduce((acc, session) => {
    // Handle both seconds and minutes just in case of data inconsistency
    const duration = session.duration || (session.type === 'WORK' ? 25 * 60 : 0);
    return acc + (session.type === 'WORK' ? duration : 0);
  }, 0);

  const hours = Math.floor(totalFocusSeconds / 3600);
  const minutes = Math.floor((totalFocusSeconds % 3600) / 60);
  const focusTimeStr = hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Analytics</h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium">Track your productivity and focus growth</p>
        </div>
        
        <div className="flex bg-slate-100 dark:bg-slate-800 p-1">
          {['daily', 'weekly', 'monthly'].map(frame => (
            <button
              key={frame}
              onClick={() => setTimeframe(frame)}
              className={`px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all ${
                timeframe === frame 
                  ? 'bg-white dark:bg-red-900/40 text-blue-600 dark:text-red-400 shadow-sm' 
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              {frame}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="w-12 h-12 bg-blue-100 dark:bg-red-900/30 text-blue-600 dark:text-red-400 flex items-center justify-center text-xl mb-4">
            <i className="fa-solid fa-check-double"></i>
          </div>
          <p className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Tasks Completed</p>
          <p className="text-4xl font-black text-slate-900 dark:text-white">{completedTasks.length}</p>
        </div>
        
        <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 flex items-center justify-center text-xl mb-4">
            <i className="fa-solid fa-stopwatch"></i>
          </div>
          <p className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Pomo Sessions</p>
          <p className="text-4xl font-black text-slate-900 dark:text-white">{completedPomos.length}</p>
        </div>

        <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-xl mb-4">
            <i className="fa-solid fa-clock"></i>
          </div>
          <p className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Time Focused</p>
          <p className="text-4xl font-black text-slate-900 dark:text-white">{focusTimeStr}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
            <i className="fa-solid fa-list-check text-blue-500 dark:text-red-500"></i> Task History
          </h3>
          <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
            {completedTasks.length === 0 ? (
              <p className="text-slate-400 dark:text-slate-500 text-center py-10 italic">No tasks completed in this timeframe</p>
            ) : (
              completedTasks.sort((a,b) => new Date(b.completedAt) - new Date(a.completedAt)).map(task => (
                <div key={task.id} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-red-900/10 border border-slate-100 dark:border-slate-800">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300 truncate max-w-[200px]">{task.title}</span>
                  <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase">
                    {new Date(task.completedAt).toLocaleDateString()}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
            <i className="fa-solid fa-clock text-red-500"></i> Focus Log
          </h3>
          <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
            {completedPomos.length === 0 ? (
              <p className="text-slate-400 dark:text-slate-500 text-center py-10 italic">No sessions completed in this timeframe</p>
            ) : (
              completedPomos.sort((a,b) => new Date(b.timestamp) - new Date(a.timestamp)).map((session, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-red-900/10 border border-slate-100 dark:border-slate-800">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    {session.type === 'WORK' ? 'Focus Session' : 'Break Session'}
                  </span>
                  <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase">
                    {new Date(session.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsPage;
