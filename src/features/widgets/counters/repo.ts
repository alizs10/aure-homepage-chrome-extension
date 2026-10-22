import { db } from "@/lib/db";
import type { Counter } from "@/types/entities/counter";

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
