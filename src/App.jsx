import React, { useState } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { TodoProvider } from './context/TodoContext';
import { PomodoroProvider } from './context/PomodoroContext';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import TodoForm from './components/TodoForm';
import TodoList from './components/TodoList';
import PomodoroTimer from './components/PomodoroTimer';
import StatsPanel from './components/StatsPanel';
import StatsPage from './components/StatsPage';

function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [activeCategory, setActiveCategory] = useState('all');
  const [currentView, setCurrentView] = useState('main');

  return (
    <ThemeProvider>
      <TodoProvider>
        <PomodoroProvider>
          <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-200 flex flex-col">
            <Header 
              onSearch={setSearchQuery} 
              searchQuery={searchQuery} 
              onNavigate={setCurrentView}
              currentView={currentView}
            />
            
            {currentView === 'main' ? (
              <div className="flex-1 flex overflow-hidden">
                <Sidebar 
                  activeFilter={activeFilter} 
                  setActiveFilter={setActiveFilter}
                  activeCategory={activeCategory}
                  setActiveCategory={setActiveCategory}
                />
                
                <main className="flex-1 overflow-y-auto p-6 lg:p-8">
                  <div className="max-w-4xl mx-auto space-y-8">
                    <TodoForm />
                    <TodoList 
                      filter={activeFilter} 
                      category={activeCategory} 
                      searchQuery={searchQuery} 
                    />
                  </div>
                </main>
              </div>
            ) : currentView === 'pomodoro' ? (
              <main className="flex-1 overflow-hidden flex items-center justify-center bg-slate-50 dark:bg-slate-950 relative">
                <div className="w-full h-full flex flex-col items-center justify-center">
                  <PomodoroTimer />
                </div>
              </main>
            ) : (
              <main className="flex-1 overflow-y-auto p-6 lg:p-8 bg-slate-50 dark:bg-slate-950">
                <StatsPage />
              </main>
            )}
          </div>
        </PomodoroProvider>
      </TodoProvider>
    </ThemeProvider>
  );
}

export default App;
