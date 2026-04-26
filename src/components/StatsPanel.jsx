import React from 'react';
import { useTodo } from '../context/TodoContext';
import { usePomodoro } from '../context/PomodoroContext';

const StatsPanel = () => {
  const { state: todoState } = useTodo();
  const { state: pomoState } = usePomodoro();
  
  const { tasks } = todoState;
  const completedTasks = tasks.filter(t => t.completed).length;
  const completionRate = tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0;

  return (
    <div className="p-4 bg-white dark:bg-black border border-slate-200 dark:border-slate-800 transition-all hover:shadow-md">
      <h3 className="text-xs font-extrabold text-slate-900 dark:text-white mb-4 tracking-tight uppercase">Productivity Insight</h3>
      
      <div className="grid grid-cols-2 gap-2 mb-4">
        <div className="p-2 bg-blue-50 dark:bg-red-900/20 border border-blue-100 dark:border-red-900/30">
          <p className="text-[9px] font-bold text-blue-600 dark:text-red-400 uppercase tracking-widest mb-0.5">Rate</p>
          <p className="text-lg font-black text-blue-700 dark:text-red-300">{completionRate}%</p>
        </div>
        <div className="p-2 bg-emerald-50 dark:bg-slate-800 border border-emerald-100 dark:border-slate-700">
          <p className="text-[9px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest mb-0.5">Pomos</p>
          <p className="text-lg font-black text-emerald-700 dark:text-emerald-300">{pomoState.sessionsCompletedToday}</p>
        </div>
      </div>

      <div className="space-y-3">
        <h4 className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Achievements</h4>
        <div className="flex flex-wrap gap-1">
          {completionRate === 100 && tasks.length > 0 && (
            <span className="px-2 py-0.5 bg-yellow-100 dark:bg-red-900/10 text-yellow-700 dark:text-yellow-400 text-[9px] font-bold uppercase tracking-wider border border-yellow-200 dark:border-red-900/30">
              🎯 Perfect
            </span>
          )}
          {pomoState.sessionsCompletedToday >= 4 && (
            <span className="px-2 py-0.5 bg-purple-100 dark:bg-red-900/10 text-purple-700 dark:text-purple-400 text-[9px] font-bold uppercase tracking-wider border border-purple-200 dark:border-red-900/30">
              ⏱️ Master
            </span>
          )}
          {completedTasks >= 10 && (
            <span className="px-2 py-0.5 bg-orange-100 dark:bg-red-900/10 text-orange-700 dark:text-orange-400 text-[9px] font-bold uppercase tracking-wider border border-orange-200 dark:border-red-900/30">
              🔥 Fire
            </span>
          )}
          {completedTasks === 0 && tasks.length === 0 && (
            <span className="text-[10px] text-slate-400 dark:text-slate-500 italic">No badges yet.</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default StatsPanel;
