import { db, DB_STORES } from "@/lib/db";
import type { NoteAndChecklist } from "./types";

export const NotesRepository = {
    getAll() {
        return db.getAll(DB_STORES.notes);
    },

    get(id: number) {
        return db.get(DB_STORES.notes, id);
    },

    put(note: NoteAndChecklist) {
        return db.put(DB_STORES.notes, note);
    },

    remove(id: number) {
        return db.remove(DB_STORES.notes, id);
    },
};  