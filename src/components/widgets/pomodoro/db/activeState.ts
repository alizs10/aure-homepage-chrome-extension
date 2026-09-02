import { db } from "@/lib/db";
import type { PomodoroActiveState } from "../types";

const ACTIVE_STATE_ID = 'active';

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