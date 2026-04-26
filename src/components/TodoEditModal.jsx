import React, { useState, useEffect } from 'react';
import { useTodo } from '../context/TodoContext';
import { PRIORITIES, RECURRENCE_TYPES } from '../utils/constants';

const TodoEditModal = ({ task, onClose }) => {
  const { state, updateTask } = useTodo();
  const { categories } = state;
  const [formData, setFormData] = useState({ ...task });

  const handleSubmit = (e) => {
    e.preventDefault();
    updateTask({ id: task.id, updates: formData });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full max-w-lg shadow-2xl overflow-hidden transition-all scale-100">
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">Edit Task</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-2xl">&times;</button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 mb-1 uppercase tracking-wider">Title</label>
            <input
              type="text"
              className="w-full px-4 py-2 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 mb-1 uppercase tracking-wider">Description</label>
            <textarea
              className="w-full px-4 py-2 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows="3"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 mb-1 uppercase tracking-wider">Priority</label>
              <select
                className="w-full px-4 py-2 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
              >
                {Object.entries(PRIORITIES).map(([key, { label }]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 mb-1 uppercase tracking-wider">Category</label>
              <select
                className="w-full px-4 py-2 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
                value={formData.categoryId}
                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
              >
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.icon} {cat.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 mb-1 uppercase tracking-wider">Due Date</label>
              <input
                type="date"
                className="w-full px-4 py-2 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
                value={formData.dueDate || ''}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 mb-1 uppercase tracking-wider">Recurrence</label>
              <select
                className="w-full px-4 py-2 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
                value={formData.recurrence}
                onChange={(e) => setFormData({ ...formData, recurrence: e.target.value })}
              >
                {Object.entries(RECURRENCE_TYPES).map(([key, value]) => (
                  <option key={key} value={value}>{key.charAt(0) + key.slice(1).toLowerCase()}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white font-bold hover:bg-blue-700 transition-all"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TodoEditModal;
