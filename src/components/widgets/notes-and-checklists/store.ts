// stores.ts
import { create } from 'zustand';
import { toast } from 'sonner';
import type { AdvancedNote, Block, Checklist, NoteAndChecklist, TaskBlock } from './types';
import { NotesRepository } from './db';
import { useSettingsStore } from '@/stores';

// 🌟 Helper: Generate unique block ID
function generateBlockId(noteId: number, index: number): string {
    return `${noteId}-block-${index}`;
}

// 🌟 Helper: Parse text content into blocks
function parseContentToBlocks(content: string): Block[] {
    const lines = content.split('\n').filter(line => line.trim() !== '');
    const blocks: Block[] = [];
    const noteId = Date.now();

    lines.forEach((line, index) => {
        const trimmedLine = line.trim();

        if (trimmedLine.startsWith('[x] ')) {
            // Checked task
            blocks.push({
                id: generateBlockId(noteId, index),
                type: 'task',
                content: trimmedLine.substring(4),
                status: true,
            });
        } else if (trimmedLine.startsWith('[] ')) {
            // Unchecked task
            blocks.push({
                id: generateBlockId(noteId, index),
                type: 'task',
                content: trimmedLine.substring(3),
                status: false,
            });
        } else {
            // Text block
            blocks.push({
                id: generateBlockId(noteId, index),
                type: 'text',
                content: trimmedLine,
            });
        }
    });

    return blocks;
}

// 🌟 NEW Helper: Convert blocks back to raw content string
function blocksToContent(blocks: Block[]): string {
    return blocks.map(block => {
        if (block.type === 'task') {
            return block.status ? `[x] ${block.content}` : `[] ${block.content}`;
        }
        return block.content;
    }).join('\n');
}

// 🌟 Helper: Check if content has multiple lines (advanced note)
function isAdvancedContent(content: string): boolean {
    return content.includes('\n') && content.trim().split('\n').length > 1;
}

// 🌟 Type for cleanup actions
type CleanupType = 'completed' | 'tasks' | 'notes' | 'all';

interface NotesAndChecklistsState {
    data: NoteAndChecklist[];
    loading: boolean;
    showChecked: boolean;
    editable: NoteAndChecklist | undefined;

    // Actions
    initialize: () => Promise<void>;
    addItem: (content: string) => Promise<void>;
    removeItem: (id: number) => Promise<void>;
    toggleCheckbox: (id: number) => Promise<void>;
    toggleAdvancedTask: (noteId: number, blockId: string) => Promise<void>;
    startEdit: (id: number) => void;
    updateItem: (content: string) => Promise<void>;
    cancelEdit: () => void;
    setShowChecked: (value: boolean) => void;
    cleanup: (type: CleanupType) => Promise<void>; // 🌟 NEW
}

export const useNotesAndChecklistsStore = create<NotesAndChecklistsState>((set, get) => ({
    data: [],
    loading: true,
    editable: undefined,
    showChecked: false,

    // Load data on app start
    initialize: async () => {
        const notes = await NotesRepository.getAll();

        // Read the preference from the global settings store
        const settings = useSettingsStore.getState().settings;
        const savedShowChecked = settings?.widgetPreferences?.['notes-and-checklists']?.showChecked;

        set({
            data: notes,
            loading: false,
            showChecked: savedShowChecked !== undefined ? savedShowChecked : true
        });
    },

    addItem: async (content) => {
        const now = Date.now();

        if (isAdvancedContent(content)) {
            // Create advanced note with blocks
            const blocks = parseContentToBlocks(content);

            const advancedNote: AdvancedNote = {
                id: now,
                content, // Keep raw content for editing
                createdAt: now,
                updatedAt: now,
                type: 'advanced',
                blocks,
            };

            await NotesRepository.put(advancedNote as NoteAndChecklist);
            set((state) => ({ data: [...state.data, advancedNote] }));
        } else {
            // Create flat note or checklist (existing behavior)
            const isChecklist = content.startsWith('[] ');

            if (isChecklist) {
                const checklist: Checklist = {
                    id: now,
                    content,
                    createdAt: now,
                    updatedAt: now,
                    status: false,
                };

                await NotesRepository.put(checklist);
                set((state) => ({ data: [...state.data, checklist] }));
            } else {
                const note: NoteAndChecklist = {
                    id: now,
                    content,
                    createdAt: now,
                    updatedAt: now,
                };

                await NotesRepository.put(note);
                set((state) => ({ data: [...state.data, note] }));
            }
        }
    },

    removeItem: async (id) => {
        await NotesRepository.remove(id);

        // Cleanly update both data and editable in a single set() call
        set((state) => ({
            data: state.data.filter((n) => n.id !== id),
            editable: state.editable?.id === id ? undefined : state.editable
        }));
    },

    toggleCheckbox: async (id) => {
        const note = get().data.find((n) => n.id === id);
        if (!note) return;

        // Handle flat checklist
        if ('status' in note && typeof note.status === 'boolean') {
            const checklist = note as Checklist;
            const status = checklist.status ? 'Unchecked' : 'Checked';
            toast.info(`${status} item`);

            const updated: Checklist = {
                ...checklist,
                status: !checklist.status,
                updatedAt: Date.now(),
            };

            await NotesRepository.put(updated);
            set((state) => ({
                data: state.data.map((n) => (n.id === id ? updated : n))
            }));
        }
    },

    // 🌟 NEW: Toggle a task inside an advanced note
    toggleAdvancedTask: async (noteId, blockId) => {
        const note = get().data.find((n) => n.id === noteId);
        if (!note || !('type' in note) || note.type !== 'advanced') return;

        const advancedNote = note as AdvancedNote;
        const blockIndex = advancedNote.blocks.findIndex((b) => b.id === blockId);

        if (blockIndex === -1) return;

        const block = advancedNote.blocks[blockIndex];
        if (block.type !== 'task') return;

        const status = block.status ? 'Unchecked' : 'Checked';
        toast.info(`${status} item`);

        // Create updated blocks array
        const updatedBlocks = [...advancedNote.blocks];
        updatedBlocks[blockIndex] = {
            ...block,
            status: !block.status,
        } as TaskBlock;

        // 🌟 Update the raw content string to reflect the new status
        const updatedContent = blocksToContent(updatedBlocks);

        const updated: AdvancedNote = {
            ...advancedNote,
            content: updatedContent,
            blocks: updatedBlocks,
            updatedAt: Date.now(),
        };

        await NotesRepository.put(updated as NoteAndChecklist);
        set((state) => ({
            data: state.data.map((n) => (n.id === noteId ? updated : n))
        }));
    },

    startEdit: (id) => {
        const note = get().data.find((n) => n.id === id);
        if (note) {
            set({ editable: { ...note } });
        }
    },

    updateItem: async (content) => {
        const { editable } = get();
        if (!editable) return;

        const now = Date.now();

        if (isAdvancedContent(content)) {
            const blocks = parseContentToBlocks(content);

            const updated: AdvancedNote = {
                id: editable.id,
                content, // Raw content already has [x] or []
                createdAt: editable.createdAt,
                updatedAt: now,
                type: 'advanced',
                blocks,
            };

            await NotesRepository.put(updated as NoteAndChecklist);
            set((state) => ({
                data: state.data.map((n) => (n.id === editable.id ? updated : n)),
                editable: undefined
            }));
        } else {
            // Update or convert to flat note/checklist
            const isChecklist = content.startsWith('[] ');

            if (isChecklist) {
                const updated: Checklist = {
                    id: editable.id,
                    content,
                    createdAt: editable.createdAt,
                    updatedAt: now,
                    status: 'status' in editable ? (editable as Checklist).status : false,
                };

                await NotesRepository.put(updated);
                set((state) => ({
                    data: state.data.map((n) => (n.id === editable.id ? updated : n)),
                    editable: undefined
                }));
            } else {
                const updated: NoteAndChecklist = {
                    id: editable.id,
                    content,
                    createdAt: editable.createdAt,
                    updatedAt: now,
                };

                await NotesRepository.put(updated);
                set((state) => ({
                    data: state.data.map((n) => (n.id === editable.id ? updated : n)),
                    editable: undefined
                }));
            }
        }
    },

    cancelEdit: () => {
        set({ editable: undefined });
    },

    setShowChecked: async (value) => {
        // 1. Optimistic UI: Update local store immediately for zero-lag feel
        set({ showChecked: value });

        // 2. Persist to Global Settings: Use the existing `update` method
        const settings = useSettingsStore.getState().settings;
        if (!settings) return;

        await useSettingsStore.getState().update({
            widgetPreferences: {
                ...settings.widgetPreferences,
                'notes-and-checklists': {
                    ...settings.widgetPreferences?.['notes-and-checklists'],
                    showChecked: value,
                },
            },
        });
    },

    // 🌟 Surgical Cleanup Action
    cleanup: async (type) => {
        const data = get().data;
        const idsToDelete: number[] = [];
        const notesToUpdate: AdvancedNote[] = [];

        const isAdvanced = (item: NoteAndChecklist): item is AdvancedNote => 'type' in item && item.type === 'advanced';

        // 🌟 FIX: Identify flat tasks strictly by their content prefix, NOT by the 'status' field
        const isFlatTask = (item: NoteAndChecklist) =>
            !isAdvanced(item) && (item.content.startsWith('[] ') || item.content.startsWith('[x] '));

        for (const item of data) {
            if (isAdvanced(item)) {
                let updatedBlocks = [...item.blocks];

                if (type === 'completed') {
                    updatedBlocks = updatedBlocks.filter(b => !(b.type === 'task' && b.status));
                } else if (type === 'tasks') {
                    updatedBlocks = updatedBlocks.filter(b => b.type !== 'task');
                } else if (type === 'notes') {
                    updatedBlocks = updatedBlocks.filter(b => b.type !== 'text');
                } else if (type === 'all') {
                    idsToDelete.push(item.id);
                    continue;
                }

                if (updatedBlocks.length === 0) {
                    idsToDelete.push(item.id);
                } else if (updatedBlocks.length !== item.blocks.length) {
                    const updatedContent = blocksToContent(updatedBlocks);
                    notesToUpdate.push({
                        ...item,
                        blocks: updatedBlocks,
                        content: updatedContent,
                        updatedAt: Date.now()
                    });
                }
            } else if (isFlatTask(item)) {
                // It's a flat checklist
                // Check if it's completed by looking at the [x] prefix OR the legacy status field
                const isChecked = item.content.startsWith('[x] ') || ('status' in item && (item as Checklist).status === true);

                if (type === 'completed' && isChecked) {
                    idsToDelete.push(item.id);
                } else if (type === 'tasks' || type === 'all') {
                    idsToDelete.push(item.id);
                }
            } else {
                // It's a flat text note (no [] or [x] prefix)
                if (type === 'notes' || type === 'all') {
                    idsToDelete.push(item.id);
                }
            }
        }

        if (idsToDelete.length > 0 || notesToUpdate.length > 0) {
            if (idsToDelete.length > 0) {
                await NotesRepository.bulkDelete(idsToDelete);
            }
            if (notesToUpdate.length > 0) {
                await NotesRepository.bulkPut(notesToUpdate as NoteAndChecklist[]);
            }

            set((state) => {
                const newData = state.data
                    .filter(n => !idsToDelete.includes(n.id))
                    .map(n => {
                        const updated = notesToUpdate.find(u => u.id === n.id);
                        return updated ? updated : n;
                    });

                let newEditable = state.editable;
                if (newEditable && idsToDelete.includes(newEditable.id)) {
                    newEditable = undefined;
                } else if (newEditable) {
                    const updated = notesToUpdate.find(u => u.id === newEditable!.id);
                    if (updated) newEditable = updated;
                }

                return { data: newData, editable: newEditable };
            });
        }

        const messages = {
            completed: 'Completed tasks cleared!',
            tasks: 'All tasks cleared!',
            notes: 'All notes cleared!',
            all: 'All data wiped!'
        };
        toast.success(messages[type]);
    }
}));