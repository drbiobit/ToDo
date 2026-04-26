# 📐 Comprehensive Low-Level Design (LLD) - drbiobit tools

This document serves as the definitive technical specification for `drbiobit tools`. It is designed to provide a complete architectural blueprint, allowing any developer or AI system to understand, maintain, or reconstruct the project accurately.

## 1. Project Identity & Core Objective
- **Project Name**: `drbiobit tools`
- **Primary Goal**: A unified productivity ecosystem combining Task Management, a Pomodoro Timer, and Focus Analytics.
- **Visual Identity**: "Sharp UI" (zero border-radius), High-Contrast Black Theme, Professional/Minimalist aesthetic.

## 2. Technical Stack & Infrastructure
- **Frontend Framework**: React 18+ (Functional Components, Hooks).
- **Styling Engine**: Tailwind CSS v3 (Customized for sharp edges and a black-centric dark mode).
- **Typography**: 
  - `Plus Jakarta Sans` (Main UI - clean, geometric).
  - `Orbitron` (Timer - digital/futuristic).
- **Persistence**: Browser `localStorage` using a debounced synchronization pattern.
- **Deployment Port**: 8099.

## 3. State Architecture (Context API)
The application implements a decoupled state strategy using three specialized Context Providers to minimize re-renders and isolate domains.

### A. TodoContext (`src/context/TodoContext.jsx`)
Manages all task-related data and mutations.
- **State Schema**:
  - `tasks`: `Array<Task>` - The master list of all tasks.
  - `categories`: `Array<Category>` - List of available categories with name and color.
- **Core Logic**:
  - **Recurrence Engine**: Upon `toggleTask(id)` where `completed` becomes `true`, if `task.recurrence !== 'none'`, the system calculates the next due date (Daily +1, Weekly +7, Monthly +1 month) and injects a cloned task into the state.
  - **Filtering Pipeline**: Uses a `useMemo` hook to filter tasks based on:
    - `searchQuery` (Title/Description match).
    - `activeCategory` (ID match).
    - `activeFilter` (`all`, `active`, `completed`, `overdue`).
- **Key Actions**: `addTask`, `toggleTask`, `updateTask`, `deleteTask`.

### B. PomodoroContext (`src/context/PomodoroContext.jsx`)
Manages the high-precision timer and session tracking.
- **State Schema**:
  - `timeRemaining`: `number` (seconds).
  - `currentSession`: `'WORK' | 'SHORT_BREAK' | 'LONG_BREAK'`.
  - `isRunning`: `boolean`.
  - `sessionsCompletedToday`: `number`.
  - `sessionsLog`: `Array<PomoSession>` - History of all completed sessions.
  - `settings`: `{ WORK: number, SHORT_BREAK: number, LONG_BREAK: number }` (durations in minutes).
- **Core Logic**:
  - **The Timer Loop**: A `setInterval` that decrements `timeRemaining` every 1000ms.
  - **Session Transition Logic**:
    - `WORK` $\rightarrow$ if `sessionsCompletedToday % 4 === 0` $\rightarrow$ `LONG_BREAK`, else $\rightarrow$ `SHORT_BREAK`.
    - `BREAK` $\rightarrow$ `WORK`.
  - **Session Logging**: On `COMPLETE_SESSION`, a `PomoSession` object is pushed to `sessionsLog` containing `timestamp`, `type`, and `duration`.

### C. ThemeContext (`src/context/ThemeContext.jsx`)
Manages the visual mode.
- **State**: `theme` (`'light' | 'dark'`).
- **Logic**: Toggles the `.dark` class on the HTML root and persists the choice to `localStorage`.

---

## 4. Data Models (Schemas)

### Task Object
```typescript
interface Task {
  id: string;               // UUID
  title: string;            // Required
  description?: string;     // Optional
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  categoryId: string;       // Reference to Category.id
  dueDate: string;          // ISO Date (YYYY-MM-DD)
  completed: boolean;
  completedAt?: string;     // ISO Timestamp (set upon completion)
  createdAt: string;        // ISO Timestamp
  recurrence: 'none' | 'daily' | 'weekly' | 'monthly';
  tags: string;             // Comma-separated string
}
```

### Category Object
```typescript
interface Category {
  id: string;
  name: string;
  color: string;            // Hex code
  icon: string;             // FontAwesome class
}
```

### Pomodoro Session Log
```typescript
interface PomoSession {
  timestamp: string;        // ISO Timestamp
  type: 'WORK' | 'SHORT_BREAK' | 'LONG_BREAK';
  duration: number;         // Total seconds of the session
}
```

---

## 5. Analytics Algorithmic Logic (`src/components/StatsPage.jsx`)

The analytics engine processes raw `sessionsLog` and `tasks` arrays based on a selected `timeframe` (`daily`, `weekly`, `monthly`).

### A. Focus Time Calculation
1. **Filter**: Extract all sessions from `sessionsLog` where `type === 'WORK'` and `timestamp` $\ge$ `startTime` of the timeframe.
2. **Summation**: $\text{TotalSeconds} = \sum (\text{session.duration})$.
3. **Conversion**:
   - $\text{Hours} = \lfloor \text{TotalSeconds} / 3600 \rfloor$
   - $\text{Minutes} = \lfloor (\text{TotalSeconds} \pmod{3600}) / 60 \rfloor$
4. **Display**: Format as `Xh Ym` (or just `Ym` if $\text{Hours} = 0$).

### B. Productivity Rate
- $\text{Rate} = \left( \frac{\text{Completed Tasks in Timeframe}}{\text{Total Tasks in Timeframe}} \right) \times 100$.

---

## 6. UI/UX Technical Specifications

### Design System
- **Edges**: `rounded-none` applied globally (Sharp UI).
- **Dark Mode Palette**: 
  - Background: `#000000` (Pure Black).
  - Surfaces: `#0f172a` (Slate-900).
  - Borders: `#1e293b` (Slate-800).
- **Interactive States**:
  - **Timer Active**: Pulse animation on the colon separator and a soft blue glow (`bg-blue-600/10`) on the digit containers.

### Component Mapping
- `App.jsx`: View router (Main Dashboard $\leftrightarrow$ Stats Page).
- `Header.jsx`: Search input $\rightarrow$ updates `App` state $\rightarrow$ filters `TodoList`.
- `Sidebar.jsx`: Filter/Category buttons $\rightarrow$ updates `App` state $\rightarrow$ filters `TodoList`.
- `PomodoroTimer.jsx`: Interfaces with `PomodoroContext` to drive the countdown.

## 7. Persistence Layer
The app implements a **Debounced Sync Pattern**:
- **Write**: Instead of saving to `localStorage` on every keystroke, a `useEffect` in the providers watches the state and triggers a save only after 500ms of stability.
- **Read**: On initial load, the providers initialize state from `localStorage` using a `lazy initializer` function in `useState`.
