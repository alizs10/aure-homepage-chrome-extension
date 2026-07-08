import { db, DB_STORES } from "@/lib/db";
import type { MoodHistory } from "./types";

export const MoodRepository = {
    getAll() {
        return db.getAll(DB_STORES.moods);
    },

    put(item: MoodHistory) {
        return db.put(DB_STORES.moods, item);
    },

    remove(id: number) {
        return db.remove(DB_STORES.moods, id);
    },
};