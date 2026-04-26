<img width="1435" height="756" alt="Screenshot 2026-04-26 at 2 30 48 PM" src="https://github.com/user-attachments/assets/d158cd11-0afe-4700-8635-593e60bbee73" />

# 🩺 drbiobit tools

A professional, unified productivity suite combining a high-performance Task Manager, a specialized Pomodoro Timer, and real-time Focus Analytics. Designed with a "Sharp UI" aesthetic and a high-contrast black-themed dark mode for maximum cognitive focus.

## ✨ Core Features

### 📝 Advanced Task Management
- **Intelligent Recurrence**: Auto-generates the next task instance upon completion (Daily, Weekly, Monthly).
- **Organization**: Priority levels (High/Med/Low), custom color-coded categories, and tag support.
- **Smart Views**: Real-time search and filtering by status (Active, Completed, Overdue).

### ⏱️ Professional Pomodoro Timer
- **Focused Cycles**: Integrated Work $\rightarrow$ Short Break $\rightarrow$ Long Break workflow.
- **Customizable**: Click-to-edit durations for all session types.
- **Digital Aesthetic**: High-contrast digital display with active-state pulse animations.

### 📈 Productivity Analytics
- **Focus Tracking**: Precise calculation of total focused hours and minutes.
- **Efficiency Metrics**: Real-time completion rates and session counts.
- **Activity Logs**: Detailed task and focus history with Daily, Weekly, and Monthly views.

## 🛠 Tech Stack

- **Framework**: React 18
- **Styling**: Tailwind CSS v3 (Custom Sharp UI)
- **State**: React Context API (Decoupled Providers)
- **Typography**: `Plus Jakarta Sans` & `Orbitron`
- **Persistence**: Debounced Browser `localStorage`
- **Icons**: Font Awesome 6

## 🚀 Quick Start

### Installation
```bash
npm install
```

### Development
```bash
npm run dev
```

### Production Build
```bash
npm run build
npx vite preview --port 8099 --host
```

## 📐 Design Philosophy
- **Zero Radius**: No rounded corners. Everything is sharp and architectural.
- **Deep Black**: Pure black background in dark mode to eliminate distractions.
- **Performance**: Debounced state persistence to ensure a lag-free experience.

## 📚 Documentation
Full technical specifications are available in the `/docs` directory:
- [Overview](./docs/overview.md)
- [Tool Structure](./docs/tool_structure.md)
- [Low-Level Design](./docs/LLD.md)
