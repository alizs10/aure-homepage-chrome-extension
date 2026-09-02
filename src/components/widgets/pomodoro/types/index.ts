export type PomodoroSession = 'focus' | 'short-break' | 'long-break';
export type PomodoroStatus = 'idle' | 'running' | 'paused' | 'overtime';
export type PomodoroView = 'timer' | 'logs' | 'chart';

export interface PomodoroTask {
    id: number;
    name: string;
    createdAt: number;
    totalFocusTime: number;
    totalSessions: number;
}

export interface SavedPomodoroState {
    session: PomodoroSession;
    status: PomodoroStatus;
    duration: number;
    remaining: number;
    startedAt: number | null;
    cyclePosition: number;
    completedFocusSessions: number;
    currentTaskId?: number;
    currentTaskName?: string;
    cycleStartedAt: number | null;
    overtimeStartedAt: number | null;
    updatedAt: number;
}

export interface PomodoroActiveState extends SavedPomodoroState {
    id: 'active';
}

export interface PomodoroHistoryEntry {
    id: number;
    type: PomodoroSession;
    startedAt: number;
    completedAt: number;
    duration: number;
    taskId?: number;
    taskName?: string;
}

export interface PomodoroSettings {
    focusDuration: number;
    shortBreakDuration: number;
    longBreakDuration: number;
    longBreakInterval: number;
    notifications: boolean;
    sound: boolean;
}

export const DEFAULT_POMODORO_SETTINGS: PomodoroSettings = {
    focusDuration: 25,
    shortBreakDuration: 5,
    longBreakDuration: 15,
    longBreakInterval: 4,
    notifications: true,
    sound: true,
};

export interface DayLog {
    dateKey: string;
    displayDate: string;
    totalFocusTime: number;
    totalSessions: number;
    entries: PomodoroHistoryEntry[];
}