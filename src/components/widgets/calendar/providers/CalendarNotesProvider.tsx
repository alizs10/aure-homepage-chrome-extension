import { format, isSameDay } from "date-fns";
import { useEffect, useState, type ReactNode } from "react";
import CalendarNotesContext from "../contexts/CalendarContext";
import { CalendarRepository } from "../db";
import type { CalendarNote } from "../types";


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
        async function load() {
            const notes = await CalendarRepository.getAll();
            setData(notes);
        }
        load();
    }, []);

    function getNoteForDay(date: Date) {
        const formattedDate = format(date, "yyyy-MM-dd")

        return data.find(d => d.date === formattedDate)

    }

    async function updateNote(
        id: number,
        updater: (note: CalendarNote) => CalendarNote
    ): Promise<boolean> {
        const note = data.find((n) => n.id === id);

        if (!note) return false;

        const updated = updater(note);

        await CalendarRepository.put(updated);

        setData((prev) =>
            prev.map((n) => (n.id === id ? updated : n))
        );

        return true;
    }

    const addItem = async (text: string, date: Date) => {
        const formattedDate = format(date, "yyyy-MM-dd");

        const existing = await CalendarRepository.getByDate(formattedDate);

        if (existing) return;

        const now = Date.now();

        const note: CalendarNote = {
            id: now,
            text,
            date: formattedDate,
            createdAt: now,
            updatedAt: now,
        };

        await CalendarRepository.put(note);

        setData((prev) => [...prev, note]);
    };

    const removeItem = async (id: number) => {
        await CalendarRepository.remove(id);

        setData((prev) => prev.filter((n) => n.id !== id));
    };

    const updateItem = async (id: number, text: string) => {
        await updateNote(id, (note) => ({
            ...note,
            text,
            updatedAt: Date.now(),
        }));
    };



    return (
        <CalendarNotesContext.Provider value={{ data, today, month, selectMonth, selectedDay, selectSelectedDay, isTodaySelected, addItem, removeItem, updateItem, getNoteForDay }}>
            {children}
        </CalendarNotesContext.Provider>
    );
}