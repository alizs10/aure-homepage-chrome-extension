import { useContext } from "react";
import { NotesAndChecklistsContext } from "../contexts/NotesAndChecklistsContext";

export function useNotesAndChecklists() {
    const context = useContext(NotesAndChecklistsContext);
    if (context === undefined) {
        throw new Error('useNotesAndChecklists must be used within a NotesAndChecklistsProvider');
    }
    return context;
}