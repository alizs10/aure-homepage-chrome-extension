import { useEffect, useMemo, useState, type ReactNode } from "react";
import type { Checklist, NoteAndChecklist } from "../types";
import { NotesAndChecklistsContext } from "../contexts/NotesAndChecklistsContext";
import { NotesRepository } from "../db";
import { toast } from "sonner";

export function NotesAndChecklistsProvider({
    children,
}: {
    children: ReactNode;
}) {
    const [data, setData] = useState<NoteAndChecklist[]>([]);
    const [editable, setEditable] = useState<NoteAndChecklist>();

    useEffect(() => {
        async function load() {
            const notes = await NotesRepository.getAll();
            setData(notes);
        }

        load();
    }, []);

    const notesCount = useMemo(() => {
        return data.filter(p => (!p.content.startsWith("[] "))).length
    }, [data])
    const itemsCount = useMemo(() => {
        return data.length - notesCount
    }, [data, notesCount])
    const checkedItemsCount = useMemo(() => {
        return data.filter((p) => ((p.content.startsWith("[] ") && (p as Checklist).status))).length

    }, [data])

    async function updateNote(
        id: number,
        updater: (note: NoteAndChecklist) => NoteAndChecklist
    ) {
        const note = data.find((n) => n.id === id);

        if (!note) return false;

        const updated = updater(note);

        await NotesRepository.put(updated);

        setData((prev) =>
            prev.map((n) => (n.id === id ? updated : n))
        );

        return true;
    }

    const addItem = async (content: string) => {
        const now = Date.now();

        const note: NoteAndChecklist = {
            id: now,
            content,
            createdAt: now,
            updatedAt: now,
            status: false,
        };

        await NotesRepository.put(note);

        setData((prev) => [...prev, note]);
    };

    const removeItem = async (id: number) => {
        await NotesRepository.remove(id);

        setData((prev) => prev.filter((n) => n.id !== id));

        if (editable?.id === id) {
            setEditable(undefined);
        }
    };

    const toggleCheckbox = async (id: number) => {
        await updateNote(id, (note) => {

            const status = (note as Checklist).status ? 'Unchecked' : 'Checked'

            toast.info(`${status} item`)

            return ({
                ...note,
                status: !(note as Checklist).status,
                updatedAt: Date.now(),
            })
        });
    };

    const startEdit = (id: number) => {
        const note = data.find((n) => n.id === id);

        if (note) {
            setEditable({ ...note });
        }
    };

    const updateItem = async (content: string) => {
        if (!editable) return;

        const success = await updateNote(editable.id, (note) => ({
            ...note,
            content,
            updatedAt: Date.now(),
        }));

        if (success) {
            setEditable(undefined);
        }
    };

    const cancelEdit = () => {
        setEditable(undefined);
    };

    return (
        <NotesAndChecklistsContext.Provider
            value={{
                data,
                editable,
                addItem,
                removeItem,
                toggleCheckbox,
                startEdit,
                updateItem,
                cancelEdit,
                notesCount,
                itemsCount,
                checkedItemsCount
            }}
        >
            {children}
        </NotesAndChecklistsContext.Provider>
    );
}