import { db } from "@/lib/db";
import type { Folder } from "../../types";

export const FoldersRepository = {
    getAll() {
        return db.folders.toArray();
    },

    get(id: number) {
        return db.folders.get(id);
    },

    put(folder: Folder) {
        return db.folders.put(folder);
    },

    remove(id: number) {
        return db.folders.delete(id);
    },
};