import type { PomodoroSession, SavedPomodoroState, PomodoroSettings, PomodoroHistoryEntry } from './types';

// 🌟 24 hours maximum overtime cap
export const MAX_OVERTIME_MS = 24 * 60 * 60 * 1000;

export function getDurationMs(session: PomodoroSession, settings: PomodoroSettings): number {
    // return 10 * 1000; // Uncomment for testing
    switch (session) {
        case 'focus': return settings.focusDuration * 60 * 1000;
        case 'short-break': return settings.shortBreakDuration * 60 * 1000;
        case 'long-break': return settings.longBreakDuration * 60 * 1000;
    }
}

export function calculateRemaining(state: SavedPomodoroState): number {
    if (state.status === 'running' && state.startedAt) {
        const elapsed = Date.now() - state.startedAt;
        return Math.max(0, state.duration - elapsed);
    }
    if (state.status === 'overtime' && state.overtimeStartedAt) {
        const overtimeElapsed = Date.now() - state.overtimeStartedAt;
        // 🌟 Cap the visual remaining time at -24h
        return Math.max(-overtimeElapsed, -MAX_OVERTIME_MS);
    }
    return state.remaining;
}

export function calculateOvertime(state: SavedPomodoroState): number {
    if (state.status === 'overtime' && state.overtimeStartedAt) {
        const elapsed = Date.now() - state.overtimeStartedAt;
        // 🌟 Cap the actual saved overtime value at 24h
        return Math.min(elapsed, MAX_OVERTIME_MS);
    }
    return 0;
}

export function calculateProgress(state: SavedPomodoroState): number {
    if (state.status === 'overtime') return 100;
    const remaining = calculateRemaining(state);
    return ((state.duration - remaining) / state.duration) * 100;
}

export function getNextSession(
    currentSession: PomodoroSession,
    cyclePosition: number,
    longBreakInterval: number
): { nextSession: PomodoroSession; nextCycle: number } {
    if (currentSession === 'focus') {
        if (cyclePosition >= longBreakInterval) {
            return { nextSession: 'long-break', nextCycle: 1 };
        }
        return { nextSession: 'short-break', nextCycle: cyclePosition + 1 };
    }
    return { nextSession: 'focus', nextCycle: currentSession === 'long-break' ? 1 : cyclePosition };
}

export function processElapsedTime(
    state: SavedPomodoroState
): { newState: SavedPomodoroState; completedHistory: PomodoroHistoryEntry[] } {
    // 1. Already in overtime (tab was closed while in overtime, and reopened)
    if (state.status === 'overtime' && state.overtimeStartedAt) {
        const overtimeElapsed = Date.now() - state.overtimeStartedAt;

        return {
            newState: {
                ...state,
                status: 'overtime',
                overtimeStartedAt: state.overtimeStartedAt,
                remaining: Math.max(-overtimeElapsed, -MAX_OVERTIME_MS), // 🌟 Cap visual state
                updatedAt: Date.now(),
            },
            completedHistory: [],
        };
    }

    if (state.status !== 'running' || !state.startedAt) {
        return { newState: state, completedHistory: [] };
    }

    const elapsed = Date.now() - state.startedAt;

    // 2. Session finished while tab was closed -> Enter overtime
    if (elapsed >= state.duration) {
        const completedAt = state.startedAt + state.duration;
        const overtimeElapsed = Date.now() - completedAt;

        return {
            newState: {
                ...state,
                status: 'overtime',
                overtimeStartedAt: completedAt,
                remaining: Math.max(-overtimeElapsed, -MAX_OVERTIME_MS), // 🌟 Cap visual state
                updatedAt: Date.now(),
            },
            completedHistory: [],
        };
    }

    // 3. Session still running normally
    return {
        newState: {
            ...state,
            remaining: state.duration - elapsed,
            updatedAt: Date.now(),
        },
        completedHistory: [],
    };
}