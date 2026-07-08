// components/notes-and-checklists/NoteItem.tsx
import { Typography } from '../../../common/Typography';
import ItemFooter from './ItemFooter';

interface NoteItemProps {
    content: string;
    date: number;
    edited?: boolean;
}

export function NoteItem({ content, date, edited }: NoteItemProps) {

    return (
        <div className="app_container bg-background min-w-1/2 px-4 py-2 flex flex-col gap-y-2">
            <Typography className='wrap-break-word' variant='body-sm'>
                {content}
            </Typography>
            <ItemFooter date={date} edited={edited} />
        </div>
    );
}