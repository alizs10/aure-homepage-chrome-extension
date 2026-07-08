import { db, DB_STORES } from "@/lib/db";
import type { Pet } from "./types";

export const PetRepository = {
    getAll() {
        return db.getAll(DB_STORES.pets);
    },

    put(item: Pet) {
        return db.put(DB_STORES.pets, item);
    },

    remove(id: number) {
        return db.remove(DB_STORES.pets, id);
    },
};