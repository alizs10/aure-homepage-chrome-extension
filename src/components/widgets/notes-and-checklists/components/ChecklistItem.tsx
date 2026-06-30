// components/notes-and-checklists/ChecklistItem.tsx
import { CircleCheckIcon, CircleIcon } from 'lucide-react';
import { Typography } from '../../../common/Typography';
import Button from '../../../common/Button';

interface ChecklistItemProps {
    item: {
        content: string;
        status?: boolean;
        id: number;
    };
    onChange: (id: number) => void;
}

export function ChecklistItem({ item, onChange }: ChecklistItemProps) {
    const content = item.content.substring(3, item.content.length);

    return (
        <div className="flex-1 flex-row-center gap-x-1">
            <Button variant='success' onClick={() => onChange(item.id)} size='icon'>
                {item.status ? (
                    <CircleCheckIcon className='size-5 text-success' />
                ) : (
                    <CircleIcon className='size-5' />
                )}
            </Button>
            <div className="container flex-1 px-4 py-2">
                <Typography className={`${item.status ? 'line-through' : ''}`} variant='body'>
                    {content}
                </Typography>
            </div>
        </div>
    );
}