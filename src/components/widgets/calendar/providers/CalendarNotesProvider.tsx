import { useEffect, useState, type ReactNode } from "react";
import type { CalendarNote } from "../types";
import { storage } from "../../../../lib/storage";
import { format, isSameDay } from "date-fns";
import CalendarNotesContext from "../contexts/CalendarContext";
import { STORAGE_KEYS } from "@/constants/storage_keys";

const STORAGE_KEY = STORAGE_KEYS.calendar

export default function CalendarNotesProvider({ children }: { children: ReactNode }) {
    const [data, setData] = useState<CalendarNote[]>([]);

    const today = new Date();
    const [month, setMonth] = useState(new Date());
    const [selectedDay, setSelectedDay] = useState<Date>(today);


    const isTodaySelected =
        selectedDay && isSameDay(selectedDay, today);


    function selectMonth(value: Date | undefined) {
        if (!value) return;
        setMonth(value)
    }

    function selectSelectedDay(value: Date | undefined) {
        if (!value) return;
        setSelectedDay(value)
    }

    // Load data on mount
    useEffect(() => {
        const loadData = async () => {
            const result = await storage.get<CalendarNote[]>(STORAGE_KEY);
            console.log(result);
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

    function isNoteExists(date: string): boolean {
        return data.findIndex(d => d.date === date) !== -1
    }

    function getNoteForDay(date: Date) {
        const formattedDate = format(date, "yyyy-MM-dd")

        return data.find(d => d.date === formattedDate)

    }

    const addItem = (note: string, date: Date) => {


        const formattedDate = format(date, "yyyy-MM-dd")

        console.log(isNoteExists(formattedDate))

        if (isNoteExists(formattedDate)) return;

        const now = Date.now();
        const newItem: CalendarNote = {
            id: Date.now(),
            text: note,
            date: formattedDate,
            createdAt: now,
            updatedAt: now
        };
        setData(prev => [...prev, newItem]);
    };

    const removeItem = (id: number) => {
        setData(prev => prev.filter(p => p.id !== id));
    };

    const updateItem = (id: number, note: string) => {

        setData(prev => {
            const dataIns = [...prev];
            const updatableIndex = dataIns.findIndex(d => d.id === id);
            if (updatableIndex !== -1) {
                const updatable = dataIns[updatableIndex];

                updatable.text = note;
                updatable.updatedAt = Date.now();

            }
            return dataIns;
        });

    }



    return (
        <CalendarNotesContext.Provider value={{ data, today, month, selectMonth, selectedDay, selectSelectedDay, isTodaySelected, addItem, removeItem, updateItem, getNoteForDay }}>
            {children}
        </CalendarNotesContext.Provider>
    );
}