import { db } from "@/lib/db";
import type { CalendarNote } from "./types";

export const CalendarRepository = {
    getAll() {
        return db.calendar.toArray();
    },

    get(id: number) {
        return db.calendar.get(id);
    },

    getByDate(date: string) {
        // Dexie uses a fluent API for indexed queries
        return db.calendar.where("date").equals(date).first();
    },

    put(note: CalendarNote) {
        return db.calendar.put(note);
    },

    remove(id: number) {
        return db.calendar.delete(id);
    },
};