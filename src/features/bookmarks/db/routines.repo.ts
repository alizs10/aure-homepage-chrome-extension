import { db } from "@/lib/db";
import type { Routine } from "../types";

export const RoutinesRepository = {
    getAll() {
        return db.routines.toArray();
    },

    get(id: number) {
        return db.routines.get(id);
    },

    put(routine: Routine) {
        return db.routines.put(routine);
    },

    bulkPut(routines: Routine[]) {
        return db.routines.bulkPut(routines);
    },

    remove(id: number) {
        return db.routines.delete(id);
    },
};
