// components/notes-and-checklists/Item.tsx
import type { PropsWithChildren } from 'react';
import { ChecklistItem } from './ChecklistItem';
import { NoteItem } from './NoteItem';
import Button from '../../../common/Button';
import { PenIcon, TrashIcon } from 'lucide-react';
import { useNotesAndChecklists } from '../contexts/NotesAndChecklistsContext';
import type { NoteAndChecklist } from '../../../../types';

interface ItemProps {
    item: NoteAndChecklist
    onChange: (id: number) => void;
}

function WrapperWithOptions({ children, item }: PropsWithChildren & { item: NoteAndChecklist }) {

    const { removeItem, startEdit } = useNotesAndChecklists()


    return (
        <div className='group flex flex-row relative overflow-clip rounded-3xl'>
            {children}

            <div className="absolute inset-0 left-auto transition-all duration-200 w-0 group-hover:w-24 h-full flex-center gap-2 overflow-clip container rounded-l-none!">
                <Button
                    onClick={() => startEdit(item.id)}
                    size='icon-sm' variant='warning'>
                    <PenIcon className='size-4' />
                </Button>
                <Button
                    onClick={() => removeItem(item.id)}
                    size='icon-sm' variant='destructive'>
                    <TrashIcon className='size-4' />
                </Button>
            </div>
        </div>
    )

}


export function Item({ item, onChange }: ItemProps) {
    const isChecklist = item.content.startsWith("[] ");

    const Content = () => {
        return isChecklist ? <ChecklistItem item={item} onChange={onChange} /> : <NoteItem content={item.content} />

    }

    return (<WrapperWithOptions item={item}>
        <Content />
    </WrapperWithOptions>);
}