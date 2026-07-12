import { db } from "@/lib/db";
import type { Pet } from "./types";

export const PetRepository = {
    getAll() {
        return db.pets.toArray();
    },

    put(item: Pet) {
        return db.pets.put(item);
    },

    remove(id: number) {
        return db.pets.delete(id);
    },
};