import { db } from "@/lib/db";
import type { Counter } from "./types";

export const CounterRepository = {
    getAll() {
        return db.counters.toArray();
    },
    put(item: Counter) {
        return db.counters.put(item);
    },
    remove(id: number) {
        return db.counters.delete(id);
    },
};