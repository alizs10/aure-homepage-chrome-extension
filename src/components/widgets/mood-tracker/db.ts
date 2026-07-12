import { db } from "@/lib/db";
import type { MoodHistory } from "./types";

export const MoodRepository = {
    getAll() {
        return db.moods.toArray();
    },

    put(item: MoodHistory) {
        return db.moods.put(item);
    },

    remove(id: number) {
        return db.moods.delete(id);
    },
};