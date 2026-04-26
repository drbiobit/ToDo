# 🛠 Tool Structure & Component Hierarchy

This document details the structural organization of `drbiobit tools` and how data flows through the application.

## Component Tree

```text
App (Root)
├── ThemeProvider (Context)
│   └── TodoProvider (Context)
│       └── PomodoroProvider (Context)
│           └── Main Layout
│               ├── Header
│               │   ├── SearchBar
│               │   ├── Navigation (Dashboard/Stats)
│               │   └── ThemeToggle
│               ├── Sidebar
│               │   ├── NavigationFilters
│               │   ├── CategoryList
│               │   ├── DailyProgressCard
│               │   └── StatsPanel (Compact View)
│               └── Main Content Area
│                   ├── Dashboard View
│                   │   ├── TodoForm (Composer)
│                   │   ├── TodoList
│                   │   │   └── TodoItem
│                   │   │       └── TodoEditModal (Portal)
│                   │   └── PomodoroTimer
│                   └── Statistics View
│                       └── StatsPage
│                           ├── TimeframeSelector
│                           ├── MetricCards
│                           ├── TaskHistoryLog
│                           └── FocusLog
```

## Data Flow & State Communication

### 1. Global State (Context API)
The application avoids "prop drilling" by using three specialized contexts:

- **`TodoContext` $\rightarrow$ `TodoList`, `TodoForm`, `Sidebar`, `StatsPage`**:
  - Provides: `tasks`, `categories`, `toggleTask`, `addTask`, `updateTask`, `deleteTask`.
- **`PomodoroContext` $\rightarrow$ `PomodoroTimer`, `StatsPanel`, `StatsPage`**:
  - Provides: `timeRemaining`, `currentSession`, `sessionsLog`, `startTimer`, `pauseTimer`, `resetTimer`.
- **`ThemeContext` $\rightarrow$ `Header`, `App`**:
  - Provides: `theme` (light/black), `toggleTheme`.

### 2. Local State
Used for transient UI states:
- **`App.jsx`**: `searchQuery`, `activeFilter`, `activeCategory`, `currentView`.
- **`TodoForm.jsx`**: Temporary input values for new tasks.
- **`TodoEditModal.jsx`**: Temporary input values for editing existing tasks.
- **`PomodoroTimer.jsx`**: `isEditingTime` state for duration customization.

## Integration Points
- **Timer $\rightarrow$ Analytics**: When a Pomodoro session completes, a log entry is pushed to `PomodoroContext`, which is then read by `StatsPage` to calculate "Time Focused".
- **Tasks $\rightarrow$ Analytics**: When a task is marked as complete, a `completedAt` timestamp is added, which `StatsPage` uses to populate the "Task History".
