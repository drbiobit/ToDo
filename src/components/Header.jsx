import React from 'react';
import { useTheme } from '../context/ThemeContext';

const Header = ({ onSearch, searchQuery, onNavigate, currentView }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between px-6 py-3 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 transition-colors duration-300">
      <div className="flex items-center gap-8">
        <h1 
          className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white cursor-pointer" 
          onClick={() => onNavigate('main')}
        >
          drbiobit <span className="text-blue-600 dark:text-red-500">tools</span>
        </h1>
        
        <nav className="hidden md:flex items-center gap-1">
          <button 
            onClick={() => onNavigate('main')}
            className={`px-3 py-1.5 text-sm font-bold transition-all ${
              currentView === 'main' 
                ? 'bg-slate-100 text-blue-600 dark:bg-slate-800 dark:text-red-400' 
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            Dashboard
          </button>
          <button 
            onClick={() => onNavigate('pomodoro')}
            className={`px-3 py-1.5 text-sm font-bold transition-all ${
              currentView === 'pomodoro' 
                ? 'bg-slate-100 text-blue-600 dark:bg-slate-800 dark:text-red-400' 
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            Timer
          </button>
          <button 
            onClick={() => onNavigate('stats')}
            className={`px-3 py-1.5 text-sm font-bold transition-all ${
              currentView === 'stats' 
                ? 'bg-slate-100 text-blue-600 dark:bg-slate-800 dark:text-red-400' 
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            Statistics
          </button>
        </nav>
      </div>

      <div className="flex-1 max-w-lg mx-8">
        <div className="relative group">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 dark:group-focus-within:text-red-500 transition-colors">
            <i className="fa-solid fa-magnifying-glass text-xs"></i>
          </span>
          <input
            type="text"
            placeholder="Search your focus..."
            className="w-full pl-10 pr-4 py-2 border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500 dark:focus:ring-red-500 focus:bg-white dark:focus:bg-slate-800 transition-all"
            value={searchQuery}
            onChange={(e) => onSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={toggleTheme}
          className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-all"
          aria-label="Toggle Theme"
        >
          {theme === 'light' ? <i className="fa-solid fa-moon"></i> : <i className="fa-solid fa-sun"></i>}
        </button>
      </div>
    </header>
  );
};

export default Header;
