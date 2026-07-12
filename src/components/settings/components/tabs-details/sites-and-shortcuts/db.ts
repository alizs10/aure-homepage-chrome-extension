import { db } from "@/lib/db";
import type { Favorite } from "./types";

export const FavoritesRepository = {
    getAll() {
        return db.favorites.toArray();
    },

    get(id: number) {
        return db.favorites.get(id);
    },

    put(favorite: Favorite) {
        return db.favorites.put(favorite);
    },

    remove(id: number) {
        return db.favorites.delete(id);
    },
};