import { useEffect, useState, type ReactNode } from "react";
import type { Checklist, NoteAndChecklist } from "../types";
import { storage } from "@/lib/storage";
import { NotesAndChecklistsContext } from "../contexts/NotesAndChecklistsContext";

export function NotesAndChecklistsProvider({ children }: { children: ReactNode }) {
    const [data, setData] = useState<NoteAndChecklist[]>([]);
    const [editable, setEditable] = useState<NoteAndChecklist | undefined>(undefined)

    // Load data on mount
    useEffect(() => {
        const loadData = async () => {
            const result = await storage.get<NoteAndChecklist[]>('notes_and_checklists');
            console.log(result);
            setData(result ?? []);
        };
        loadData();
    }, []);

    // Save data whenever it changes
    useEffect(() => {
        const saveData = async () => {
            await storage.set('notes_and_checklists', data);
        };
        saveData();
    }, [data]);

    const addItem = (content: string) => {

        const now = new Date().getTime();

        const newItem: NoteAndChecklist = {
            id: Date.now(),
            content,
            createdAt: now,
            updatedAt: now,
            status: false,
        };
        setData(prev => [...prev, newItem]);
    };

    const removeItem = (id: number) => {
        setData(prev => prev.filter(d => d.id !== id));
    };

    const toggleCheckbox = (id: number) => {
        setData(prev => {

            const now = new Date().getTime();

            const dataIns = [...prev];
            const updatableIndex = dataIns.findIndex(d => d.id === id);
            if (updatableIndex !== -1) {
                const updatable = dataIns[updatableIndex] as Checklist;
                updatable.status = !updatable.status;
                updatable.updatedAt = now;
            }
            return dataIns;
        });
    };

    const startEdit = (id: number) => {
        const item = data.find(d => d.id === id);
        if (item) {
            setEditable({ ...item }); // Create a copy to avoid mutating original
        }
    };

    const updateItem = (content: string) => {
        if (!editable) return;

        setData(prev => {

            const now = new Date().getTime();

            const dataIns = [...prev];
            const updatableIndex = dataIns.findIndex(d => d.id === editable.id);
            if (updatableIndex !== -1) {
                const updatable = dataIns[updatableIndex];
                updatable.content = content;
                updatable.updatedAt = now;
            }
            return dataIns;
        });

        cancelEdit();
    };

    const cancelEdit = () => {
        setEditable(undefined);
    };

    return (
        <NotesAndChecklistsContext.Provider value={{ data, editable, addItem, removeItem, toggleCheckbox, cancelEdit, startEdit, updateItem }}>
            {children}
        </NotesAndChecklistsContext.Provider>
    );
}