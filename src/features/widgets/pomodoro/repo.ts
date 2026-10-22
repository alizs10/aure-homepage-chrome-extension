import { db } from "@/lib/db";
import type { PomodoroActiveState, PomodoroHistoryEntry, PomodoroTask } from "@/types/entities/pomodoro";

const ACTIVE_STATE_ID = 'active';

export const PomodoroRepository = {
    getHistory(taskId?: number) {
        if (taskId) {
            return db.pomodoroHistory.where('taskId').equals(taskId).reverse().sortBy('completedAt');
        }
        return db.pomodoroHistory.orderBy('completedAt').reverse().toArray();
    },

    getHistorySince(timestamp: number) {
        return db.pomodoroHistory.toArray().then(entries =>
            entries.filter(e => e.startedAt >= timestamp)
        );
    },

    getHistoryByDateRange(start: number, end: number) {
        return db.pomodoroHistory.where('completedAt').between(start, end, true, true).toArray();
    },

    addHistory(entry: Omit<PomodoroHistoryEntry, 'id'>) {
        return db.pomodoroHistory.add(entry as PomodoroHistoryEntry);
    },

    deleteHistory(id: number) {
        return db.pomodoroHistory.delete(id);
    },

    clearHistory() {
        return db.pomodoroHistory.clear();
    },

    getStats() {
        return db.pomodoroHistory.toArray().then(history => {
            const todayStart = new Date().setHours(0, 0, 0, 0);
            const totalSessions = history.filter(e => e.type === 'focus').length;
            const totalFocusTime = history.filter(e => e.type === 'focus').reduce((sum, e) => sum + e.duration, 0);
            const todaySessions = history.filter(e => e.type === 'focus' && e.completedAt >= todayStart).length;
            const todayFocusTime = history.filter(e => e.type === 'focus' && e.completedAt >= todayStart).reduce((sum, e) => sum + e.duration, 0);

            return { totalSessions, totalFocusTime, todaySessions, todayFocusTime };
        });
    },
};

export const PomodoroActiveStateRepository = {
    async get(): Promise<PomodoroActiveState | undefined> {
        return await db.pomodoroActiveState.get(ACTIVE_STATE_ID);
    },

    async save(state: Omit<PomodoroActiveState, 'id'>) {
        await db.pomodoroActiveState.put({
            ...state,
            id: ACTIVE_STATE_ID,
        });
    },

    async clear() {
        await db.pomodoroActiveState.delete(ACTIVE_STATE_ID);
    },
};

export const PomodoroTasksRepository = {
    getAll() {
        return db.pomodoroTasks.orderBy('createdAt').reverse().toArray();
    },

    get(id: number) {
        return db.pomodoroTasks.get(id);
    },

    add(task: Omit<PomodoroTask, 'id'>) {
        return db.pomodoroTasks.add(task as PomodoroTask);
    },

    update(id: number, changes: Partial<PomodoroTask>) {
        return db.pomodoroTasks.update(id, changes);
    },

    remove(id: number) {
        return db.pomodoroTasks.delete(id);
    },

    incrementStats: async (id: number, focusTime: number) => {
        const task = await db.pomodoroTasks.get(id);
        if (!task) return;
        await db.pomodoroTasks.update(id, {
            totalFocusTime: (task.totalFocusTime || 0) + focusTime,
            totalSessions: (task.totalSessions || 0) + 1,
        });
    },

    decrementStats: async (id: number, focusTime: number) => {
        const task = await db.pomodoroTasks.get(id);
        if (!task) return;
        await db.pomodoroTasks.update(id, {
            totalFocusTime: Math.max(0, (task.totalFocusTime || 0) - focusTime),
            totalSessions: Math.max(0, (task.totalSessions || 0) - 1),
        });
    },
};
