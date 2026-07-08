import { format } from "date-fns";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import MoodTrackerContext from "../contexts/MoodTrackerContext";
import { MoodRepository } from "../db";
import { calculateMoodScore } from "../helpers/history";
import type { filters, MoodHistory, MoodType } from "../types";

export default function MoodTrackerProvider({ children }: { children: ReactNode }) {
    const [data, setData] = useState<MoodHistory[]>([]);

    const [filter, setFilter] = useState<typeof filters[number]['value']>("last30days");

    const onFilterChange = (value: typeof filters[number]['value']) => {

        setFilter(value);
    }

    const today = useMemo(() => {
        return new Date();
    }, []);

    const todayMood = useMemo(() => {
        const formattedToday = format(today, "yyyy-MM-dd");

        return data.find(item => item.date === formattedToday) ?? null;
    }, [data, today]);

    const score = useMemo(() => {
        return calculateMoodScore(data);
    }, [data]);

    // Load data on mount
    useEffect(() => {
        const loadData = async () => {
            // const result = await storage.get<MoodHistory[]>(STORAGE_KEY);
            // setData(result ?? []);

            // const result = await db.getAll(DB_STORES.moods);

            const moods = await MoodRepository.getAll();

            setData(moods);
        };
        loadData();
    }, []);

    const addItem = async (mood: MoodType, date: Date) => {


        const formattedDate = format(date, "yyyy-MM-dd")

        const now = Date.now();
        const newItem: MoodHistory = {
            id: Date.now(),
            mood,
            date: formattedDate,
            createdAt: now,
            updatedAt: now
        };


        await MoodRepository.put(newItem);

        setData(prev => [...prev, newItem]);
    };

    const removeItem = async (id: number) => {
        await MoodRepository.remove(id);
        setData(prev => prev.filter(p => p.id !== id));
    };

    const updateItem = async (id: number, mood: MoodType) => {
        const item = data.find((d) => d.id === id);

        if (!item) return;

        const updated: MoodHistory = {
            ...item,
            mood,
            updatedAt: Date.now(),
        };

        await MoodRepository.put(updated);


        setData((prev) =>
            prev.map((d) => (d.id === id ? updated : d))
        );
    };



    return (
        <MoodTrackerContext.Provider value={{ data, today, todayMood, score, addItem, removeItem, updateItem, filter, onFilterChange }}>
            {children}
        </MoodTrackerContext.Provider>
    );
}