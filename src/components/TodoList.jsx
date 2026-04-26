import React, { useMemo, useState } from 'react';
import { useTodo } from '../context/TodoContext';
import TodoItem from './TodoItem';
import TodoEditModal from './TodoEditModal';

const TodoList = ({ filter, category, searchQuery }) => {
  const { state } = useTodo();
  const { tasks } = state;
  const [editingTask, setEditingTask] = useState(null);

  const filteredTasks = useMemo(() => {
    return tasks
      .filter(task => {
        const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase()));
        const matchesCategory = category === 'all' || task.categoryId === category;
        
        let matchesFilter = true;
        if (filter === 'active') matchesFilter = !task.completed;
        if (filter === 'completed') matchesFilter = task.completed;
        if (filter === 'overdue') {
          const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && !task.completed;
          matchesFilter = isOverdue;
        }

        return matchesSearch && matchesCategory && matchesFilter;
      })
      .sort((a, b) => {
        if (a.completed !== b.completed) return a.completed ? 1 : -1;
        return new Date(a.createdAt) - new Date(b.createdAt);
      });
  }, [tasks, filter, category, searchQuery]);

  if (filteredTasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="text-6xl mb-4">🎉</div>
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">All caught up!</h3>
        <p className="text-slate-500 dark:text-slate-400">No tasks found matching your criteria.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {filteredTasks.map(task => (
        <TodoItem 
          key={task.id} 
          task={task} 
          onEdit={() => setEditingTask(task)} 
        />
      ))}
      {editingTask && (
        <TodoEditModal 
          task={editingTask} 
          onClose={() => setEditingTask(null)} 
        />
      )}
    </div>
  );
};

export default TodoList;
