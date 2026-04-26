import React from 'react';
import { useTodo } from '../context/TodoContext';
import { PRIORITIES } from '../utils/constants';
import { formatDate, isOverdue } from '../utils/dateHelpers';

const TodoItem = React.memo(({ task, onEdit }) => {
  const { state, toggleTask, deleteTask, updateTask } = useTodo();
  const { categories } = state;
  const category = categories.find(c => c.id === task.categoryId) || { name: 'Uncategorized', color: '#9ca3af', icon: '📁' };
  
  const priorityStyles = {
    HIGH: 'bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400',
    MEDIUM: 'bg-amber-100 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400',
    LOW: 'bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400',
  };
  const priorityLabel = PRIORITIES[task.priority]?.label || 'Medium';
  const priorityClass = priorityStyles[task.priority] || priorityStyles.MEDIUM;

  return (
    <div 
      className={`group flex items-center gap-4 p-4 bg-white dark:bg-slate-900 border transition-all duration-200 hover:shadow-md ${
        task.completed 
          ? 'border-slate-100 dark:border-slate-800 opacity-60' 
          : isOverdue(task.dueDate) 
            ? 'border-red-200 dark:border-red-900 bg-red-50/50 dark:bg-red-900/10' 
            : 'border-slate-200 dark:border-slate-800 hover:border-blue-200 dark:hover:border-red-900'
      }`}
    >
      <div 
        onClick={() => toggleTask(task.id)}
        className={`w-6 h-6 border-2 cursor-pointer flex items-center justify-center transition-all ${
          task.completed 
            ? 'bg-blue-600 border-blue-600 dark:bg-red-600 dark:border-red-600 text-white' 
            : 'border-slate-300 dark:border-slate-600 hover:border-blue-500 dark:hover:border-red-500'
        }`}
      >
        {task.completed && '✓'}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1.5">
          <span className={`text-[10px] px-2 py-0.5 font-bold uppercase tracking-wider ${priorityClass}`}>
            {priorityLabel}
          </span>
          <span className="text-[10px] px-2 py-0.5 font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 flex items-center justify-center gap-1">
            <i className={`${category.icon.startsWith('fa-') ? category.icon : 'fa-solid fa-tag'} mr-1`}></i>{category.name}
          </span>
          {task.recurrence !== 'none' && (
            <span className="text-[10px] px-2 py-0.5 font-bold uppercase tracking-wider text-blue-600 dark:text-red-400 bg-blue-50 dark:bg-red-900/30">
              <i className="fa-solid fa-rotate mr-1"></i>{task.recurrence}
            </span>
          )}
        </div>
        
        <div className="flex items-center justify-between gap-2">
          <h3 className={`text-sm font-semibold truncate transition-all ${
            task.completed ? 'line-through text-slate-400 dark:text-slate-500' : 'text-slate-800 dark:text-slate-200'
          }`}>
            {task.title}
          </h3>
          {task.dueDate && (
            <span className={`text-[11px] font-medium ${
              isOverdue(task.dueDate) ? 'text-red-500' : 'text-slate-400 dark:text-slate-500'
            }`}>
              <i className="fa-solid fa-calendar-day mr-1"></i>{formatDate(task.dueDate)}
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button 
          onClick={onEdit}
          className="p-2 text-slate-400 hover:text-blue-500 dark:hover:text-red-500 transition-colors"
          title="Edit"
        >
          <i className="fa-solid fa-pen-to-square"></i>
        </button>
        <button 
          onClick={() => deleteTask(task.id)}
          className="p-2 text-slate-400 hover:text-red-500 transition-colors"
          title="Delete"
        >
          <i className="fa-solid fa-trash-can"></i>
        </button>
      </div>
    </div>
  );
});

export default TodoItem;
