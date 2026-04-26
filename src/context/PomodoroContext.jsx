import React, { createContext, useContext, useReducer, useEffect, useRef } from 'react';
import { POMODORO_DEFAULTS } from '../utils/constants';

const PomodoroContext = createContext();

const pomodoroReducer = (state, action) => {
  switch (action.type) {
    case 'START_TIMER':
      return { ...state, isRunning: true };
    case 'PAUSE_TIMER':
      return { ...state, isRunning: false };
    case 'RESET_TIMER':
      return { 
        ...state, 
        isRunning: false, 
        timeRemaining: state.settings[state.currentSession] * 60 
      };
    case 'RESET_DAILY_STATS':
      return { 
        ...state, 
        sessionsCompletedToday: 0,
        sessionsLog: []
      };
    case 'TICK':
      return { ...state, timeRemaining: state.timeRemaining - 1 };
    case 'SET_SESSION':
      return { 
        ...state, 
        currentSession: action.payload, 
        timeRemaining: state.settings[action.payload] * 60,
        isRunning: false 
      };
    case 'COMPLETE_SESSION': {
      const { currentSession, sessionsCompletedToday } = state;
      const newSessions = sessionsCompletedToday + (currentSession === 'WORK' ? 1 : 0);
      
      let nextSession = 'WORK';
      if (currentSession === 'WORK') {
        nextSession = (newSessions % 4 === 0) ? 'LONG_BREAK' : 'SHORT_BREAK';
      } else {
        nextSession = 'WORK';
      }

      const newLogEntry = {
        timestamp: new Date().toISOString(),
        type: currentSession,
        duration: state.settings[currentSession] * 60
      };

      return { 
        ...state, 
        currentSession: nextSession, 
        timeRemaining: state.settings[nextSession] * 60,
        sessionsCompletedToday: newSessions,
        sessionsLog: [...(state.sessionsLog || []), newLogEntry],
        isRunning: false 
      };
    }
    case 'UPDATE_SETTINGS':
      return { 
        ...state, 
        settings: { ...state.settings, ...action.payload } 
      };
    case 'LOAD_STATE':
      return { ...state, ...action.payload };
    default:
      return state;
  }
};

export const PomodoroProvider = ({ children }) => {
  const [state, dispatch] = useReducer(pomodoroReducer, {
    currentSession: 'WORK',
    timeRemaining: POMODORO_DEFAULTS.WORK * 60,
    isRunning: false,
    sessionsCompletedToday: 0,
    settings: {
      WORK: POMODORO_DEFAULTS.WORK,
      SHORT_BREAK: POMODORO_DEFAULTS.SHORT_BREAK,
      LONG_BREAK: POMODORO_DEFAULTS.LONG_BREAK,
      autoTransition: true,
      soundEnabled: true,
    },
    sessionsLog: [],
  });

  const timerRef = useRef(null);

  useEffect(() => {
    const savedState = localStorage.getItem('pomodoro-state');
    if (savedState) {
      dispatch({ type: 'LOAD_STATE', payload: JSON.parse(savedState) });
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('pomodoro-state', JSON.stringify(state));
  }, [state]);

  useEffect(() => {
    if (state.isRunning && state.timeRemaining > 0) {
      timerRef.current = setInterval(() => {
        dispatch({ type: 'TICK' });
      }, 1000);
    } else if (state.timeRemaining === 0 && state.isRunning) {
      dispatch({ type: 'COMPLETE_SESSION' });
      if (state.settings.soundEnabled) {
        try {
          const audio = new Audio('https://actions.google.com/sounds/v1/alarms/beep_short.ogg');
          audio.play();
        } catch (e) {
          console.error('Audio playback failed', e);
        }
      }
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [state.isRunning, state.timeRemaining, state.settings.soundEnabled]);

  const value = {
    state,
    startTimer: () => dispatch({ type: 'START_TIMER' }),
    pauseTimer: () => dispatch({ type: 'PAUSE_TIMER' }),
    resetTimer: () => dispatch({ type: 'RESET_TIMER' }),
    resetDailyStats: () => dispatch({ type: 'RESET_DAILY_STATS' }),
    skipSession: () => dispatch({ type: 'COMPLETE_SESSION' }),
    updateSettings: (settings) => dispatch({ type: 'UPDATE_SETTINGS', payload: settings }),
    setSession: (session) => dispatch({ type: 'SET_SESSION', payload: session }),
  };

  return (
    <PomodoroContext.Provider value={value}>
      {children}
    </PomodoroContext.Provider>
  );
};

export const usePomodoro = () => {
  const context = useContext(PomodoroContext);
  if (!context) throw new Error('usePomodoro must be used within a PomodoroProvider');
  return context;
};
