// components/notes-and-checklists/NoteItem.tsx
import { Typography } from '../../../common/Typography';

interface NoteItemProps {
    content: string;
}

export function NoteItem({ content }: NoteItemProps) {
    return (
        <div className="app_container bg-background px-4 py-2">
            <Typography className='wrap-break-word' variant='body'>
                {content}
            </Typography>
        </div>
    );
}