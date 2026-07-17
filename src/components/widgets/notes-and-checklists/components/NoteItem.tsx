// components/notes-and-checklists/NoteItem.tsx
import { BetterTypography } from '@/components/common/BetterTypography';
import ItemFooter from './ItemFooter';

interface NoteItemProps {
    content: string;
    date: number;
    edited?: boolean;
}

export function NoteItem({ content, date, edited }: NoteItemProps) {

    return (
        <div className="app_container bg-background min-w-1/2 px-4 py-2 flex flex-col gap-y-2">
            <BetterTypography className="wrap-break-word" variant="sm">
                {content}
            </BetterTypography>
            <ItemFooter date={date} edited={edited} />
        </div>
    );
}