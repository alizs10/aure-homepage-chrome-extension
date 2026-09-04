import { create } from 'zustand';
import { useSettingsStore } from '@/stores';
import type { Settings } from '@/types';
import { PomodoroRepository } from './db/db';
import { PomodoroActiveStateRepository } from './db/activeState';
import { PomodoroTasksRepository } from './db/tasks';
import { calculateRemaining, calculateOvertime, processElapsedTime, getDurationMs, getNextSession, MAX_OVERTIME_MS } from './timer';
import type { SavedPomodoroState, PomodoroSettings, PomodoroTask, PomodoroView, PomodoroSession } from './types';
import { DEFAULT_POMODORO_SETTINGS } from './types';

interface PomodoroState extends SavedPomodoroState {
    loading: boolean;
    initialized: boolean;
    settings: PomodoroSettings;
    currentView: PomodoroView;
    tasks: PomodoroTask[];

    initialize: () => Promise<void>;
    setView: (view: PomodoroView) => void;
    loadTasks: () => Promise<void>;
    createTask: (name: string) => Promise<number>;
    updateTask: (id: number, changes: Partial<Omit<PomodoroTask, 'id' | 'createdAt' | 'totalFocusTime' | 'totalSessions'>>) => Promise<void>;
    deleteTask: (id: number) => Promise<void>;
    setCurrentTask: (taskId: number | undefined) => Promise<void>;
    start: () => Promise<void>;
    pause: () => Promise<void>;
    resume: () => Promise<void>;
    reset: () => Promise<void>;
    resetCycle: () => Promise<void>;
    includeOvertime: () => Promise<void>;
    skipOvertime: () => Promise<void>;
    completeEarly: () => Promise<void>;
    updateSettings: (newSettings: Partial<PomodoroSettings>) => Promise<void>;
}

const getPersistableState = (state: PomodoroState): SavedPomodoroState => ({
    session: state.session,
    status: state.status,
    duration: state.duration,
    remaining: state.remaining,
    startedAt: state.startedAt,
    cyclePosition: state.cyclePosition,
    completedFocusSessions: state.completedFocusSessions,
    currentTaskId: state.currentTaskId,
    currentTaskName: state.currentTaskName,
    cycleStartedAt: state.cycleStartedAt,
    overtimeStartedAt: state.overtimeStartedAt,
    updatedAt: state.updatedAt,
});

// 🌟 Helper: Synthesized two-tone chime using Web Audio API (no external files needed)
function playCompletionSound() {
    try {
        const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (!AudioContextClass) return;
        const ctx = new AudioContextClass();

        const playTone = (freq: number, startTime: number, duration: number) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, startTime);
            gain.gain.setValueAtTime(0, startTime);
            gain.gain.linearRampToValueAtTime(0.2, startTime + 0.05);
            gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(startTime);
            osc.stop(startTime + duration);
        };

        const now = ctx.currentTime;
        playTone(587.33, now, 0.2); // D5
        playTone(880.00, now + 0.15, 0.4); // A5
    } catch (e) {
        console.error('Audio playback failed', e);
    }
}

// 🌟 Helper: Browser Notification (Delegated to Background Service Worker)
export function showCompletionNotification(
    title: string,
    body: string
) {
    if (!chrome?.runtime?.sendMessage) {
        console.warn('Chrome extension runtime unavailable');
        return;
    }

    chrome.runtime.sendMessage({
        type: 'POMODORO_COMPLETE',
        title,
        body,
    });
}

// 🌟 Helper: Trigger both alerts based on settings
function triggerCompletionAlerts(session: PomodoroSession) {
    const state = usePomodoroStore.getState();
    const sessionLabel = session === 'focus' ? 'Focus' : session === 'short-break' ? 'Short Break' : 'Long Break';

    if (state.settings.sound) {
        playCompletionSound();
    }

    if (state.settings.notifications) {
        const nextSession = getNextSession(session, state.cyclePosition, state.settings.longBreakInterval).nextSession;
        const nextLabel = nextSession === 'focus' ? 'Focus' : nextSession === 'short-break' ? 'Short Break' : 'Long Break';
        showCompletionNotification(
            `${sessionLabel} Complete!`,
            `Time for your ${nextLabel.toLowerCase()}.`
        );
    }
}

// 🌟 Helper: Schedule background alarm for when tab is closed
async function setPomodoroAlarm(remaining: number, session: PomodoroSession, cyclePosition: number, longBreakInterval: number) {
    if (!chrome?.runtime?.sendMessage || !chrome?.storage?.local) return;
    const endTime = Date.now() + remaining;

    await chrome.storage.local.set({
        pomodoroAlarmContext: { session, cyclePosition, longBreakInterval }
    });

    chrome.runtime.sendMessage({
        type: 'SET_POMODORO_ALARM',
        endTime
    });
}

// 🌟 Helper: Clear background alarm
function clearPomodoroAlarm() {
    if (!chrome?.runtime?.sendMessage) return;
    chrome.storage.local.remove('pomodoroAlarmContext');
    chrome.runtime.sendMessage({ type: 'CLEAR_POMODORO_ALARM' });
}

export const usePomodoroStore = create<PomodoroState>((set, get) => ({
    session: 'focus',
    status: 'idle',
    duration: DEFAULT_POMODORO_SETTINGS.focusDuration * 60 * 1000,
    remaining: DEFAULT_POMODORO_SETTINGS.focusDuration * 60 * 1000,
    startedAt: null,
    cyclePosition: 1,
    completedFocusSessions: 0,
    currentTaskId: undefined,
    currentTaskName: undefined,
    cycleStartedAt: null,
    overtimeStartedAt: null,
    updatedAt: Date.now(),
    loading: true,
    initialized: false,
    settings: DEFAULT_POMODORO_SETTINGS,
    currentView: 'timer',
    tasks: [],

    initialize: async () => {
        const waitForSettings = () => new Promise<Settings | null>((resolve) => {
            const state = useSettingsStore.getState();
            if (!state.loading) {
                resolve(state.settings);
                return;
            }
            const unsub = useSettingsStore.subscribe((s) => {
                if (!s.loading) {
                    unsub();
                    resolve(s.settings);
                }
            });
        });

        const globalSettings = await waitForSettings();
        const settings = globalSettings?.widgetPreferences?.pomodoro || DEFAULT_POMODORO_SETTINGS;

        const saved = await PomodoroActiveStateRepository.get();
        const tasks = await PomodoroTasksRepository.getAll();

        if (!saved) {
            const initialState: SavedPomodoroState = {
                session: 'focus', status: 'idle',
                duration: getDurationMs('focus', settings), remaining: getDurationMs('focus', settings),
                startedAt: null, cyclePosition: 1, completedFocusSessions: 0,
                currentTaskId: undefined, currentTaskName: undefined,
                cycleStartedAt: null, overtimeStartedAt: null, updatedAt: Date.now(),
            };
            await PomodoroActiveStateRepository.save(initialState);
            set({ ...initialState, loading: false, initialized: true, settings, tasks });
            return;
        }

        const safeSaved = {
            ...saved,
            cycleStartedAt: saved.cycleStartedAt ?? null,
            overtimeStartedAt: saved.overtimeStartedAt ?? null,
        };
        const { newState, completedHistory } = processElapsedTime(safeSaved);

        for (const entry of completedHistory) {
            await PomodoroRepository.addHistory({
                type: entry.type, startedAt: entry.startedAt, completedAt: entry.completedAt,
                duration: entry.duration, taskId: newState.currentTaskId, taskName: newState.currentTaskName,
            });
            if (entry.type === 'focus' && newState.currentTaskId) {
                await PomodoroTasksRepository.incrementStats(newState.currentTaskId, entry.duration);
            }
        }

        await PomodoroActiveStateRepository.save(newState);
        set({ ...newState, loading: false, initialized: true, settings, tasks });
    },

    setView: (view) => set({ currentView: view }),
    loadTasks: async () => set({ tasks: await PomodoroTasksRepository.getAll() }),

    createTask: async (name) => {
        const id = await PomodoroTasksRepository.add({
            name,
            createdAt: Date.now(),
            totalFocusTime: 0,
            totalSessions: 0
        });
        set({ tasks: await PomodoroTasksRepository.getAll() });
        return id;
    },

    updateTask: async (id, changes) => {
        await PomodoroTasksRepository.update(id, changes);
        const tasks = await PomodoroTasksRepository.getAll();
        const state = get();

        if (state.currentTaskId === id && changes.name) {
            set({ tasks, currentTaskName: changes.name, updatedAt: Date.now() });
            await PomodoroActiveStateRepository.save(getPersistableState(get()));
        } else {
            set({ tasks });
        }
    },

    deleteTask: async (id) => {
        await PomodoroTasksRepository.remove(id);
        const tasks = await PomodoroTasksRepository.getAll();
        const state = get();

        if (state.currentTaskId === id) {
            const focusDuration = getDurationMs('focus', state.settings);
            set({
                tasks, currentTaskId: undefined, currentTaskName: undefined,
                status: 'idle', startedAt: null, duration: focusDuration, remaining: focusDuration,
                cycleStartedAt: null, overtimeStartedAt: null, updatedAt: Date.now()
            });
            await PomodoroActiveStateRepository.save(getPersistableState(get()));
        } else {
            set({ tasks });
        }
    },

    setCurrentTask: async (taskId) => {
        let taskName: string | undefined;
        if (taskId) {
            const task = await PomodoroTasksRepository.get(taskId);
            taskName = task?.name;
        }
        set({ currentTaskId: taskId, currentTaskName: taskName, updatedAt: Date.now() });
        await PomodoroActiveStateRepository.save(getPersistableState(get()));
    },

    start: async () => {
        const state = get();
        let cycleStartedAt = state.cycleStartedAt;
        if (!cycleStartedAt && state.session === 'focus' && state.cyclePosition === 1) {
            cycleStartedAt = Date.now();
        }
        set({ status: 'running', startedAt: Date.now(), remaining: state.duration, cycleStartedAt, overtimeStartedAt: null, updatedAt: Date.now() });
        await PomodoroActiveStateRepository.save(getPersistableState(get()));

        // 🌟 Schedule alarm for when tab is closed
        await setPomodoroAlarm(state.duration, state.session, state.cyclePosition, state.settings.longBreakInterval);
    },

    pause: async () => {
        clearPomodoroAlarm(); // 🌟 Clear alarm
        set({ status: 'paused', startedAt: null, remaining: calculateRemaining(get()), updatedAt: Date.now() });
        await PomodoroActiveStateRepository.save(getPersistableState(get()));
    },

    resume: async () => {
        const state = get();
        const elapsed = state.duration - state.remaining;
        const newStartedAt = Date.now() - elapsed;
        set({ status: 'running', startedAt: newStartedAt, updatedAt: Date.now() });
        await PomodoroActiveStateRepository.save(getPersistableState(get()));

        // 🌟 Schedule alarm with remaining time
        await setPomodoroAlarm(state.remaining, state.session, state.cyclePosition, state.settings.longBreakInterval);
    },

    reset: async () => {
        clearPomodoroAlarm(); // 🌟 Clear alarm
        const state = get();
        const newDuration = getDurationMs(state.session, state.settings);
        set({ status: 'idle', startedAt: null, duration: newDuration, remaining: newDuration, overtimeStartedAt: null, updatedAt: Date.now() });
        await PomodoroActiveStateRepository.save(getPersistableState(get()));
    },

    resetCycle: async () => {
        clearPomodoroAlarm(); // 🌟 Clear alarm
        const state = get();
        const cycleStart = state.cycleStartedAt;

        if (cycleStart) {
            const cycleEntries = await PomodoroRepository.getHistorySince(cycleStart);

            for (const entry of cycleEntries) {
                if (entry.type === 'focus' && entry.taskId) {
                    await PomodoroTasksRepository.decrementStats(entry.taskId, entry.duration);
                }
                await PomodoroRepository.deleteHistory(entry.id);
            }
        }

        const focusDuration = getDurationMs('focus', state.settings);
        set({
            session: 'focus',
            cyclePosition: 1,
            status: 'idle',
            startedAt: null,
            duration: focusDuration,
            remaining: focusDuration,
            cycleStartedAt: null,
            overtimeStartedAt: null,
            updatedAt: Date.now(),
        });
        await PomodoroActiveStateRepository.save(getPersistableState(get()));
    },

    includeOvertime: async () => {
        clearPomodoroAlarm();
        const state = get();
        if (state.status !== 'overtime') return;

        // 🌟 calculateOvertime is already capped at 24 hours in timer.ts
        const overtimeMs = calculateOvertime(state);
        const totalDuration = state.duration + overtimeMs;

        await PomodoroRepository.addHistory({
            type: state.session,
            startedAt: state.startedAt!,
            completedAt: state.startedAt! + totalDuration,
            duration: totalDuration,
            taskId: state.currentTaskId,
            taskName: state.currentTaskName,
        });

        if (state.session === 'focus' && state.currentTaskId) {
            await PomodoroTasksRepository.incrementStats(state.currentTaskId, totalDuration);
        }

        await transitionToNextSession();
    },

    skipOvertime: async () => {
        clearPomodoroAlarm();
        const state = get();
        if (state.status !== 'overtime') return;

        await PomodoroRepository.addHistory({
            type: state.session,
            startedAt: state.startedAt!,
            completedAt: Date.now(),
            duration: state.duration,
            taskId: state.currentTaskId,
            taskName: state.currentTaskName,
        });

        if (state.session === 'focus' && state.currentTaskId) {
            await PomodoroTasksRepository.incrementStats(state.currentTaskId, state.duration);
        }

        await transitionToNextSession();
    },

    completeEarly: async () => {
        clearPomodoroAlarm(); // 🌟 Clear alarm
        const state = get();
        if (state.status !== 'running' && state.status !== 'paused') return;

        const elapsed = state.duration - calculateRemaining(state);

        if (elapsed >= 1000) {
            await PomodoroRepository.addHistory({
                type: state.session,
                startedAt: Date.now() - elapsed,
                completedAt: Date.now(),
                duration: elapsed,
                taskId: state.currentTaskId,
                taskName: state.currentTaskName,
            });

            if (state.session === 'focus' && state.currentTaskId) {
                await PomodoroTasksRepository.incrementStats(state.currentTaskId, elapsed);
            }
        }

        await transitionToNextSession();
    },

    updateSettings: async (newSettings) => {
        const state = get();
        const updatedSettings = { ...state.settings, ...newSettings };
        const updates: Partial<PomodoroState> = { settings: updatedSettings };

        if (state.status === 'idle') {
            const newDuration = getDurationMs(state.session, updatedSettings);
            updates.duration = newDuration;
            updates.remaining = newDuration;
        }
        set(updates);

        const globalSettings = useSettingsStore.getState().settings;
        if (globalSettings) {
            await useSettingsStore.getState().update({
                widgetPreferences: { ...globalSettings.widgetPreferences, pomodoro: updatedSettings },
            });
        }

        if (state.status === 'idle') {
            await PomodoroActiveStateRepository.save(getPersistableState(get()));
        }
    },
}));

async function transitionToNextSession() {
    const state = usePomodoroStore.getState();
    const { nextSession, nextCycle } = getNextSession(state.session, state.cyclePosition, state.settings.longBreakInterval);
    const nextDuration = getDurationMs(nextSession, state.settings);
    const isLongBreakCompleting = state.session === 'long-break';

    const updates: Partial<PomodoroState> = {
        session: nextSession,
        cyclePosition: nextCycle,
        completedFocusSessions: state.session === 'focus' ? state.completedFocusSessions + 1 : state.completedFocusSessions,
        status: 'idle',
        duration: nextDuration,
        remaining: nextDuration,
        startedAt: null,
        cycleStartedAt: isLongBreakCompleting ? null : state.cycleStartedAt,
        overtimeStartedAt: null,
        updatedAt: Date.now(),
    };

    usePomodoroStore.setState(updates);
    await PomodoroActiveStateRepository.save(getPersistableState(usePomodoroStore.getState()));
}

let refreshInterval: number | null = null;

export function startPomodoroRefresh() {
    if (refreshInterval) return;
    refreshInterval = setInterval(() => {
        const state = usePomodoroStore.getState();

        if (state.status === 'overtime' && state.overtimeStartedAt) {
            const overtimeElapsed = Date.now() - state.overtimeStartedAt;

            // 🌟 Just cap the visual remaining time at 24 hours. No auto-resolving.
            const cappedRemaining = Math.max(-overtimeElapsed, -MAX_OVERTIME_MS);
            usePomodoroStore.setState({ remaining: cappedRemaining });
            return;
        }

        if (state.status === 'running' && state.startedAt) {
            const remaining = calculateRemaining(state);

            if (remaining <= 0) {
                clearPomodoroAlarm();
                triggerCompletionAlerts(state.session);
                enterOvertime();
            } else {
                usePomodoroStore.setState({ remaining });
            }
        }
    }, 1000);
}

function enterOvertime() {
    usePomodoroStore.setState({
        status: 'overtime',
        overtimeStartedAt: Date.now(),
        remaining: 0,
        updatedAt: Date.now(),
    });
    PomodoroActiveStateRepository.save(getPersistableState(usePomodoroStore.getState()));
}

export function stopPomodoroRefresh() {
    if (refreshInterval) {
        clearInterval(refreshInterval);
        refreshInterval = null;
    }
}