// components/notes-and-checklists/ItemsList.tsx
import { useRef } from 'react';
import { Item } from './Item';
import { useNotesAndChecklists } from '../contexts/NotesAndChecklistsContext';
import { useScrollToBottom } from '../../../../hooks/useScrollToBottom';
import { Typography } from '../../../common/Typography';

export function ItemsList() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { data, toggleCheckbox } = useNotesAndChecklists();

    useScrollToBottom(containerRef, data.length);

    return (
        <div
            ref={containerRef}
            className="flex-1 min-h-0 overflow-y-scroll scrollbar-none w-full flex flex-col gap-y-2"
        >
            {data.map(d => (
                <Item key={d.id} item={d} onChange={toggleCheckbox} />
            ))}

            {data.length === 0 && (
                <div className="flex-1 flex-center">
                    <Typography variant='caption'>
                        add your first note or check list
                    </Typography>
                </div>
            )}
        </div>
    );
}