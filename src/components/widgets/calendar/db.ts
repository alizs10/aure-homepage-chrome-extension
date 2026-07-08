import { db, DB_STORES } from "@/lib/db";
import type { CalendarNote } from "./types";

// CalendarRepository
export const CalendarRepository = {
    getAll() {
        return db.getAll(DB_STORES.calendar);
    },

    get(id: number) {
        return db.get(DB_STORES.calendar, id);
    },

    getByDate(date: string) {
        return db.getByIndex(DB_STORES.calendar, "date", date);
    },

    put(note: CalendarNote) {
        return db.put(DB_STORES.calendar, note);
    },

    remove(id: number) {
        return db.remove(DB_STORES.calendar, id);
    },
};