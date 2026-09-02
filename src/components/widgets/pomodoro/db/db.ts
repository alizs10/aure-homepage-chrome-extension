import { db } from "@/lib/db";
import type { PomodoroHistoryEntry } from "../types";

export const PomodoroRepository = {
    getHistory(taskId?: number) {
        if (taskId) {
            return db.pomodoroHistory.where('taskId').equals(taskId).reverse().sortBy('completedAt');
        }
        return db.pomodoroHistory.orderBy('completedAt').reverse().toArray();
    },

    // 🌟 NEW: Fetches all history entries that started after a specific timestamp
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

    // 🌟 NEW: Deletes a specific history entry by ID
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