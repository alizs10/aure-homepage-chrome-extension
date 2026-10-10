import { db } from "@/lib/db";
import type { Progress, ProgressLabel } from "./types";

export const ProgressRepository = {
    getAll() { return db.progresses.toArray(); },
    put(item: Progress) { return db.progresses.put(item); },
    remove(id: number) { return db.progresses.delete(id); },
};

// 🌟 New Label Repository
export const ProgressLabelRepository = {
    getAll() { return db.progressLabels.toArray(); },
    put(item: ProgressLabel) { return db.progressLabels.put(item); },
    remove(id: number) { return db.progressLabels.delete(id); },
    getByName(name: string) { return db.progressLabels.where('name').equalsIgnoreCase(name).first(); }
};