import { db } from "@/lib/db";
import type { PomodoroTask } from "../types";

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

    // 🌟 NEW: Reverts task statistics when a cycle is reset
    decrementStats: async (id: number, focusTime: number) => {
        const task = await db.pomodoroTasks.get(id);
        if (!task) return;
        await db.pomodoroTasks.update(id, {
            totalFocusTime: Math.max(0, (task.totalFocusTime || 0) - focusTime),
            totalSessions: Math.max(0, (task.totalSessions || 0) - 1),
        });
    },
};