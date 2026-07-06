import { useEffect, useMemo, useState, type ReactNode } from "react";
import { storage } from "../../../../lib/storage";
import { format } from "date-fns";
import MoodTrackerContext from "../contexts/MoodTrackerContext";
import type { filters, MoodHistory, MoodType } from "../types";
import { calculateMoodScore } from "../helpers/history";
import { STORAGE_KEYS } from "@/constants/storage_keys";

const STORAGE_KEY = STORAGE_KEYS.moodTracker;

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
            const result = await storage.get<MoodHistory[]>(STORAGE_KEY);
            setData(result ?? []);
        };
        loadData();
    }, []);

    // Save data whenever it changes
    useEffect(() => {
        const saveData = async () => {
            await storage.set(STORAGE_KEY, data);
        };
        saveData();
    }, [data]);


    const addItem = (mood: MoodType, date: Date) => {


        const formattedDate = format(date, "yyyy-MM-dd")

        const now = Date.now();
        const newItem: MoodHistory = {
            id: Date.now(),
            mood,
            date: formattedDate,
            createdAt: now,
            updatedAt: now
        };
        setData(prev => [...prev, newItem]);
    };

    const removeItem = (id: number) => {
        setData(prev => prev.filter(p => p.id !== id));
    };

    const updateItem = (id: number, mood: MoodType) => {

        setData(prev => {
            const dataIns = [...prev];
            const updatableIndex = dataIns.findIndex(d => d.id === id);
            if (updatableIndex !== -1) {
                const updatable = dataIns[updatableIndex];

                updatable.mood = mood;
                updatable.updatedAt = Date.now();

            }
            return dataIns;
        });

    }



    return (
        <MoodTrackerContext.Provider value={{ data, today, todayMood, score, addItem, removeItem, updateItem, filter, onFilterChange }}>
            {children}
        </MoodTrackerContext.Provider>
    );
}