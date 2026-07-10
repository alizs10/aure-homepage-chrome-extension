import { db, DB_STORES } from "@/lib/db";
import type { Favorite } from "./types";

// FavoriteRepository
export const FavoritesRepository = {
    getAll() {
        return db.getAll(DB_STORES.favorites);
    },

    get(id: number) {
        return db.get(DB_STORES.favorites, id);
    },

    put(favorite: Favorite) {
        return db.put(DB_STORES.favorites, favorite);
    },

    remove(id: number) {
        return db.remove(DB_STORES.favorites, id);
    },
};