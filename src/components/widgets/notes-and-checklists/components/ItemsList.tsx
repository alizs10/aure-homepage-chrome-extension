// components/notes-and-checklists/ItemsList.tsx
import { BetterTypography } from '@/components/common/BetterTypography';
import { useRef } from 'react';
import { useScrollToBottom } from '../../../../hooks/useScrollToBottom';
import { useNotesAndChecklists } from '../hooks/useNotesAndChecklists';
import { Item } from './Item';

export function ItemsList() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { filteredData, data, toggleCheckbox } = useNotesAndChecklists();

    useScrollToBottom(containerRef, filteredData.length);

    return (
        <div
            ref={containerRef}
            className="flex-1 min-h-0 overflow-y-scroll scrollbar-none w-full flex flex-col gap-y-2 pb-14"
        >
            {filteredData.map((d, index) => (
                <Item key={d.id} item={d} index={index} onChange={toggleCheckbox} />
            ))}

            {data.length === 0 && (
                <div className="flex-1 flex-center">
                    <BetterTypography variant="sm">
                        add your first note or check list
                    </BetterTypography>
                </div>
            )}
            {(filteredData.length === 0 && data.length > 0) && (
                <div className="flex-1 flex-center">
                    <BetterTypography variant="sm">
                        Everything is checked off.
                    </BetterTypography>
                </div>
            )}
        </div>
    );
}