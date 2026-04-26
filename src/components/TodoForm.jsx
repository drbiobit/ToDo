import React, { useState } from 'react';
import { useTodo } from '../context/TodoContext';
import { PRIORITIES, RECURRENCE_TYPES } from '../utils/constants';

const TodoForm = () => {
  const { state, addTask } = useTodo();
  const { categories } = state;

  const [task, setTask] = useState({
    title: '',
    description: '',
    priority: 'MEDIUM',
    categoryId: categories[0]?.id || '',
    dueDate: '',
    recurrence: RECURRENCE_TYPES.NONE,
    tags: '',
  });

  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!task.title.trim()) {
      setError('Title is required');
      return;
    }
    setError('');
    addTask({
      ...task,
      tags: task.tags.split(',').map(t => t.trim()).filter(t => t !== ''),
    });
    setTask({
      title: '',
      description: '',
      priority: 'MEDIUM',
      categoryId: categories[0]?.id || '',
      dueDate: '',
      recurrence: RECURRENCE_TYPES.NONE,
      tags: '',
    });
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 mb-8 transition-all hover:shadow-md">
      <div className="flex flex-col gap-6">
        <div className="flex gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="What's on your mind?"
              className={`w-full px-5 py-3 border ${error ? 'border-red-500' : 'border-slate-200 dark:border-slate-700'} bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500 dark:focus:ring-red-500 transition-all text-lg font-medium`}
              value={task.title}
              onChange={(e) => setTask({ ...task, title: e.target.value })}
            />
            {error && <p className="text-red-500 text-xs mt-2 ml-2 font-medium">{error}</p>}
          </div>
          <button
            type="submit"
            className="px-8 py-3 bg-blue-600 dark:bg-red-600 text-white font-bold hover:bg-blue-700 dark:hover:bg-red-700 transition-all shadow-lg shadow-blue-500/30 dark:shadow-red-500/30 active:scale-95"
          >
            Add Task
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-400 dark:text-slate-500 ml-1 uppercase tracking-wider">Priority</label>
            <select
              className="px-4 py-2.5 border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500 dark:focus:ring-red-500 transition-all"
              value={task.priority}
              onChange={(e) => setTask({ ...task, priority: e.target.value })}
            >
              {Object.entries(PRIORITIES).map(([key, { label }]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-400 dark:text-slate-500 ml-1 uppercase tracking-wider">Category</label>
            <select
              className="px-4 py-2.5 border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500 dark:focus:ring-red-500 transition-all"
              value={task.categoryId}
              onChange={(e) => setTask({ ...task, categoryId: e.target.value })}
            >
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-400 dark:text-slate-500 ml-1 uppercase tracking-wider">Due Date</label>
            <input
              type="date"
              className="px-4 py-2.5 border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500 dark:focus:ring-red-500 transition-all"
              value={task.dueDate}
              onChange={(e) => setTask({ ...task, dueDate: e.target.value })}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-400 dark:text-slate-500 ml-1 uppercase tracking-wider">Recurrence</label>
            <select
              className="px-4 py-2.5 border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500 dark:focus:ring-red-500 transition-all"
              value={task.recurrence}
              onChange={(e) => setTask({ ...task, recurrence: e.target.value })}
            >
              {Object.entries(RECURRENCE_TYPES).map(([key, value]) => (
                <option key={key} value={value}>{key.charAt(0) + key.slice(1).toLowerCase()}</option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-400 dark:text-slate-500 ml-1 uppercase tracking-wider">Tags</label>
            <input
              type="text"
              placeholder="work, home, urgent..."
              className="px-4 py-2.5 border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500 dark:focus:ring-red-500 transition-all"
              value={task.tags}
              onChange={(e) => setTask({ ...task, tags: e.target.value })}
            />
          </div>
        </div>
      </div>
    </form>
  );
};

export default TodoForm;
