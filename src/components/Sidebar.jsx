import React, { useState } from 'react';
import { useTodo } from '../context/TodoContext';
import { usePomodoro } from '../context/PomodoroContext';
import StatsPanel from './StatsPanel';

const Sidebar = ({ 
  activeFilter, 
  setActiveFilter, 
  activeCategory, 
  setActiveCategory 
}) => {
  const { state, addCategory, deleteCategory } = useTodo();
  const { categories, tasks } = state;
  
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [categoryDeletingId, setCategoryDeletingId] = useState(null);

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.completed).length;
  const progressPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const handleSaveCategory = () => {
    if (newCategoryName.trim()) {
      const colors = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];
      const randomColor = colors[Math.floor(Math.random() * colors.length)];
      addCategory({
        name: newCategoryName.trim(),
        color: randomColor,
        icon: 'fa-solid fa-tag'
      });
      setNewCategoryName('');
      setIsAddingCategory(false);
    }
  };

  const confirmDeleteCategory = (id) => {
    deleteCategory(id);
    setCategoryDeletingId(null);
  };

  return (
    <aside className="w-80 h-full border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 flex flex-col gap-8 transition-colors duration-300 hidden lg:flex">
      <div>
        <h2 className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2 px-2">Navigation</h2>
        <div className="flex flex-col gap-0.5">
          {[
            { id: 'all', label: 'All Tasks', icon: 'fa-solid fa-folder-open' },
            { id: 'active', label: 'Active', icon: 'fa-solid fa-hourglass-half' },
            { id: 'completed', label: 'Completed', icon: 'fa-solid fa-circle-check' },
            { id: 'overdue', label: 'Overdue', icon: 'fa-solid fa-triangle-exclamation' },
          ].map(filter => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`flex items-center gap-3 px-2 py-1.5 text-xs font-medium transition-all ${
                activeFilter === filter.id 
                  ? 'bg-slate-100 text-blue-600 dark:bg-slate-800 dark:text-red-400' 
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <i className={`${filter.icon} w-4 text-center`}></i>
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2 px-2">
          <h2 className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Categories</h2>
          {!isAddingCategory ? (
            <button 
              className="text-[10px] text-blue-600 dark:text-red-400 hover:underline font-semibold"
              onClick={() => setIsAddingCategory(true)} 
            >
              <i className="fa-solid fa-plus mr-0.5"></i> New
            </button>
          ) : (
            <button 
              className="text-[10px] text-red-500 hover:underline font-semibold"
              onClick={() => setIsAddingCategory(false)} 
            >
              Cancel
            </button>
          )}
        </div>
        
        {isAddingCategory && (
          <div className="flex gap-2 mb-3 px-2">
            <input 
              type="text"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSaveCategory()}
              placeholder="Category name..."
              className="flex-1 px-2 py-1 text-xs border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white outline-none focus:ring-1 focus:ring-blue-500 dark:focus:ring-red-500"
              autoFocus
            />
            <button 
              onClick={handleSaveCategory}
              className="px-2 py-1 text-xs bg-blue-600 text-white font-bold hover:bg-blue-700 transition-colors"
            >
              Add
            </button>
          </div>
        )}

        <div className="flex flex-col gap-0.5">
          <button
            onClick={() => setActiveCategory('all')}
            className={`flex items-center gap-3 px-2 py-1.5 text-xs font-medium transition-all ${
              activeCategory === 'all' 
                ? 'bg-slate-100 text-blue-600 dark:bg-slate-800 dark:text-red-400' 
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <i className="fa-solid fa-globe w-4 text-center"></i>
            All Categories
          </button>
          {categories.map(cat => (
            <div
              key={cat.id}
              className={`group relative flex items-center gap-3 px-2 py-1.5 text-xs font-medium transition-all cursor-pointer ${
                categoryDeletingId === cat.id 
                  ? 'bg-red-50 dark:bg-red-900/20 border-l-2 border-red-500' 
                  : 'hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
              onClick={() => setActiveCategory(cat.id)}
            >
              {categoryDeletingId === cat.id ? (
                <div className="absolute right-1 flex items-center gap-1 z-10 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-0.5 shadow-sm">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      confirmDeleteCategory(cat.id);
                    }}
                    className="p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
                    title="Confirm Delete"
                  >
                    <i className="fa-solid fa-check text-xs"></i>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setCategoryDeletingId(null);
                    }}
                    className="p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                    title="Cancel Delete"
                  >
                    <i className="fa-solid fa-xmark text-xs"></i>
                  </button>
                </div>
              ) : (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setCategoryDeletingId(cat.id);
                  }}
                  className="absolute right-2 opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-red-500 transition-all"
                  title="Delete Category"
                >
                  <i className="fa-solid fa-trash-can text-[10px]"></i>
                </button>
              )}
              
              <i className={`${cat.icon.startsWith('fa-') ? cat.icon : 'fa-solid fa-tag'} w-4 text-center`}></i>
              <span className={`flex-1 text-left ${
                activeCategory === cat.id 
                  ? 'text-blue-600 dark:text-red-400' 
                  : 'text-slate-600 dark:text-slate-400'
              }`}>
                {cat.name}
              </span>
              <div className="w-1.5 h-1.5 bg-current rounded-full mr-4" style={{ color: cat.color }}></div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-auto flex flex-col gap-6">
        <div className="p-5 bg-blue-600 dark:bg-red-600 text-white shadow-lg shadow-blue-500/20 dark:shadow-red-500/20">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-extrabold uppercase tracking-widest">Daily Progress</h3>
            <span className="text-[10px] font-bold bg-blue-500 dark:bg-red-500 px-1.5 py-0.5 rounded-sm">
              {progressPercentage}%
            </span>
          </div>
          <div className="w-full bg-blue-800 dark:bg-red-800 h-2 mb-3 overflow-hidden">
            <div 
              className="bg-white h-full transition-all duration-1000 ease-out" 
              style={{ width: `${progressPercentage}%` }} 
            />
          </div>
          <p className="text-xs font-medium text-blue-100 dark:text-red-100 flex justify-between items-center">
            <span>Completed Tasks</span>
            <span className="font-black">{completedTasks}/{totalTasks}</span>
          </p>
        </div>
        <StatsPanel />
      </div>
    </aside>
  );
};

export default Sidebar;
