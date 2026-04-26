import React, { createContext, useContext, useReducer, useEffect, useMemo } from 'react';
import { DEFAULT_CATEGORIES, STORAGE_KEY } from '../utils/constants';
import { getNextOccurrence } from '../utils/dateHelpers';

const TodoContext = createContext();

const todoReducer = (state, action) => {
  switch (action.type) {
    case 'SET_DATA':
      return { ...state, ...action.payload };

    case 'ADD_TASK': {
      const newTask = {
        ...action.payload,
        id: `task-${Date.now()}`,
        completed: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        order: state.tasks.length,
      };
      return {
        ...state,
        tasks: [...state.tasks, newTask],
      };
    }

    case 'UPDATE_TASK': {
      return {
        ...state,
        tasks: state.tasks.map(task => 
          task.id === action.payload.id 
            ? { ...task, ...action.payload.updates, updatedAt: new Date().toISOString() } 
            : task
        ),
      };
    }

    case 'DELETE_TASK': {
      return {
        ...state,
        tasks: state.tasks.filter(task => task.id !== action.payload),
      };
    }

    case 'TOGGLE_TASK': {
      return {
        ...state,
        tasks: state.tasks.map(task => 
          task.id === action.payload 
            ? { ...task, completed: !task.completed, completedAt: !task.completed ? new Date().toISOString() : null, updatedAt: new Date().toISOString() } 
            : task
        ),
      };
    }

    case 'ADD_CATEGORY': {
      const newCategory = {
        ...action.payload,
        id: `cat-${Date.now()}`,
        createdAt: new Date().toISOString(),
      };
      return {
        ...state,
        categories: [...state.categories, newCategory],
      };
    }

    case 'UPDATE_CATEGORY': {
      return {
        ...state,
        categories: state.categories.map(cat => 
          cat.id === action.payload.id 
            ? { ...cat, ...action.payload.updates } 
            : cat
        ),
      };
    }

    case 'DELETE_CATEGORY': {
      return {
        ...state,
        categories: state.categories.filter(cat => cat.id !== action.payload),
        tasks: state.tasks.map(task => 
          task.categoryId === action.payload ? { ...task, categoryId: 'cat-uncategorized' } : task
        ),
      };
    }

    case 'SET_SETTINGS': {
      return {
        ...state,
        userSettings: { ...state.userSettings, ...action.payload },
      };
    }

    default:
      return state;
  }
};

export const TodoProvider = ({ children }) => {
  const [state, dispatch] = useReducer(todoReducer, {
    tasks: [],
    categories: DEFAULT_CATEGORIES,
    userSettings: {
      fontSize: 'normal',
      compactMode: false,
      showCompleted: true,
    },
  });

  // Load from localStorage
  useEffect(() => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        dispatch({ type: 'SET_DATA', payload: parsed });
      } catch (e) {
        console.error('Failed to parse storage data', e);
      }
    }
  }, []);

  // Save to localStorage with debounce
  useEffect(() => {
    const handler = setTimeout(() => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }, 500);
    return () => clearTimeout(handler);
  }, [state]);

  const value = useMemo(() => ({
    state,
    dispatch,
    addTask: (task) => dispatch({ type: 'ADD_TASK', payload: task }),
    updateTask: ({ id, updates }) => dispatch({ type: 'UPDATE_TASK', payload: { id, updates } }),
    deleteTask: (id) => dispatch({ type: 'DELETE_TASK', payload: id }),
    toggleTask: (id) => {
      const task = state.tasks.find(t => t.id === id);
      if (!task) return;

      dispatch({ type: 'TOGGLE_TASK', payload: id });

      if (!task.completed && task.recurrence !== 'none') {
        const nextDate = getNextOccurrence(task.dueDate || new Date().toISOString(), task.recurrence);
        dispatch({ 
          type: 'ADD_TASK', 
          payload: { 
            ...task, 
            title: task.title,
            description: task.description,
            priority: task.priority,
            categoryId: task.categoryId,
            dueDate: nextDate,
            recurrence: task.recurrence,
            tags: task.tags,
            completed: false 
          } 
        });
      }
    },
    addCategory: (cat) => dispatch({ type: 'ADD_CATEGORY', payload: cat }),
    updateCategory: ({ id, updates }) => dispatch({ type: 'UPDATE_CATEGORY', payload: { id, updates } }),
    deleteCategory: (id) => dispatch({ type: 'DELETE_CATEGORY', payload: id }),
    updateSettings: (settings) => dispatch({ type: 'SET_SETTINGS', payload: settings }),
  }), [state]);

  return (
    <TodoContext.Provider value={value}>
      {children}
    </TodoContext.Provider>
  );
};

export const useTodo = () => {
  const context = useContext(TodoContext);
  if (!context) throw new Error('useTodo must be used within a TodoProvider');
  return context;
};
