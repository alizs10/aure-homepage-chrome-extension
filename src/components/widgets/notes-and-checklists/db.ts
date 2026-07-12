import { db } from "@/lib/db";
import type { NoteAndChecklist } from "./types";

export const NotesRepository = {
    getAll() {
        return db.notes.toArray();
    },

    get(id: number) {
        return db.notes.get(id);
    },

    put(note: NoteAndChecklist) {
        return db.notes.put(note);
    },

    remove(id: number) {
        return db.notes.delete(id);
    },
};