import React from 'react';
import { usePomodoro } from '../context/PomodoroContext';

const PomodoroTimer = () => {
  const { state, startTimer, pauseTimer, resetTimer, skipSession, setSession, updateSettings, resetDailyStats } = usePomodoro();
  const [isEditingTime, setIsEditingTime] = React.useState(false);
  const [editValue, setEditValue] = React.useState(state.settings[state.currentSession]);
  
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const sessionColors = {
    WORK: {
      text: 'text-red-500',
      bg: 'bg-red-500',
      glow: 'bg-red-500/10',
      darkGlow: 'dark:bg-red-500/10',
      darkBg: 'dark:bg-red-500',
      accent: 'bg-red-600',
      darkAccent: 'dark:bg-red-600',
      textAccent: 'text-red-600',
      darkTextAccent: 'dark:text-red-600'
    },
    SHORT_BREAK: {
      text: 'text-emerald-500',
      bg: 'bg-emerald-500',
      glow: 'bg-emerald-500/10',
      darkGlow: 'dark:bg-emerald-500/10',
      darkBg: 'dark:bg-emerald-500',
      accent: 'bg-emerald-600',
      darkAccent: 'dark:bg-emerald-600',
      textAccent: 'text-emerald-600',
      darkTextAccent: 'dark:text-emerald-600'
    },
    LONG_BREAK: {
      text: 'text-blue-500',
      bg: 'bg-blue-500',
      glow: 'bg-blue-500/10',
      darkGlow: 'dark:bg-blue-500/10',
      darkBg: 'dark:bg-blue-500',
      accent: 'bg-blue-600',
      darkAccent: 'dark:bg-blue-600',
      textAccent: 'text-blue-600',
      darkTextAccent: 'dark:text-blue-600'
    },
  };

  const sessionLabels = {
    WORK: 'Focus Session',
    SHORT_BREAK: 'Short Break',
    LONG_BREAK: 'Long Break',
  };

  const handleSaveTime = () => {
    const newTime = parseInt(editValue);
    if (!isNaN(newTime) && newTime > 0) {
      updateSettings({ [state.currentSession]: newTime });
      resetTimer();
    }
    setIsEditingTime(false);
  };

  const timeString = formatTime(state.timeRemaining);
  const currentTheme = sessionColors[state.currentSession];

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* Dynamic Background Glow */}
      <div className={`fixed inset-0 pointer-events-none transition-colors duration-1000 bg-blue-500/10 ${currentTheme.darkGlow} dark:opacity-50`}>
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[120px] opacity-30 transition-colors duration-1000 bg-blue-400 ${currentTheme.darkBg}`}></div>
      </div>

      <div className="relative z-10 p-12 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200 dark:border-slate-800 flex flex-col items-center text-center transition-all shadow-2xl max-w-md mx-auto">
        <div className={`text-xs font-black uppercase tracking-[0.3em] mb-4 ${currentTheme.text}`}>
          {sessionLabels[state.currentSession]}
        </div>
        
        <div className="relative mb-12 group">
          {isEditingTime ? (
            <div className="flex items-center justify-center gap-3">
              <input 
                type="number" 
                className="w-32 text-center text-3xl font-mono font-black p-2 border-b-4 border-blue-500 dark:border-red-500 bg-transparent text-slate-900 dark:text-white focus:outline-none"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                autoFocus
              />
              <button 
                onClick={handleSaveTime}
                className="w-10 h-10 bg-blue-600 dark:bg-red-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 dark:hover:bg-red-700 transition-all shadow-lg"
                title="Save"
              >
                <i className="fa-solid fa-check"></i>
              </button>
              <button 
                onClick={() => {
                  setIsEditingTime(false);
                  setEditValue(state.settings[state.currentSession]);
                }}
                className="w-10 h-10 bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-full flex items-center justify-center hover:bg-slate-300 dark:hover:bg-slate-700 transition-all"
                title="Cancel"
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-center cursor-pointer hover:opacity-90 transition-all group"
                 onClick={() => !state.isRunning && setIsEditingTime(true)}
                 title="Click timer to edit duration">
              <span className={`text-6xl font-black transition-all duration-500 tracking-tighter ${
                state.isRunning 
                  ? `text-blue-600 ${currentTheme.darkTextAccent} scale-105` 
                  : 'text-slate-800 dark:text-white'
              }`} style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                {timeString}
              </span>
              {!state.isRunning && (
                <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                  Edit Duration
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center justify-center gap-8 mb-12">
          <button
            onClick={resetTimer}
            className="w-12 h-12 flex items-center justify-center text-slate-400 dark:text-slate-500 hover:text-blue-500 dark:hover:text-red-500 transition-all text-xl"
            title="Reset"
          >
            <i className="fa-solid fa-rotate-left"></i>
          </button>
          
          <button
            onClick={state.isRunning ? pauseTimer : startTimer}
            className={`w-24 h-24 rounded-full text-white flex items-center justify-center text-4xl transition-all active:scale-90 shadow-2xl ${
              state.isRunning 
                ? 'bg-slate-800 dark:bg-red-900/40 hover:bg-slate-700 dark:hover:bg-red-900/60' 
                : `bg-blue-600 ${currentTheme.darkAccent} hover:bg-blue-700 dark:hover:bg-red-700 shadow-blue-500/40 dark:shadow-red-500/40`
            }`}
            title={state.isRunning ? 'Pause' : 'Start'}
          >
            {state.isRunning ? <i className="fa-solid fa-pause"></i> : <i className="fa-solid fa-play ml-1"></i>}
          </button>

          <button
            onClick={skipSession}
            className="w-12 h-12 flex items-center justify-center text-slate-400 dark:text-slate-500 hover:text-blue-500 dark:hover:text-red-500 transition-all text-xl"
            title="Skip"
          >
            <i className="fa-solid fa-forward-step"></i>
          </button>
        </div>

        <div className="flex gap-1 p-1 bg-slate-100 dark:bg-slate-800/50 rounded-full mb-8">
          {['WORK', 'SHORT_BREAK', 'LONG_BREAK'].map(session => (
            <button
              key={session}
              onClick={() => setSession(session)}
              className={`px-4 py-1.5 text-[10px] font-black uppercase tracking-wider rounded-full transition-all ${
                state.currentSession === session 
                  ? `bg-white ${currentTheme.darkAccent} text-blue-600 dark:text-white shadow-sm` 
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              {session.replace('_', ' ')}
            </button>
          ))}
        </div>

        <div className="flex items-center justify-between w-full max-w-xs px-4 py-2 bg-slate-50 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-800 rounded-lg">
          <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
            <span>Sessions</span>
            <span className="px-2 py-0.5 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-sm">
              {state.sessionsCompletedToday}
            </span>
          </div>
          <button 
            onClick={() => {
              if (window.confirm('Reset today\'s session count?')) {
                resetDailyStats();
              }
            }}
            className="text-[10px] font-bold text-slate-400 hover:text-red-500 dark:text-slate-500 dark:hover:text-red-400 transition-colors uppercase"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
};

export default PomodoroTimer;
