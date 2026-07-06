// components/notes-and-checklists/ChecklistItem.tsx
import Button from '@/components/common/Button';
import { Typography } from '@/components/common/Typography';
import { CircleCheckIcon, CircleIcon } from 'lucide-react';
import ItemFooter from './ItemFooter';


interface ChecklistItemProps {
    item: {
        content: string;
        status?: boolean;
        id: number;
    };
    onChange: (id: number) => void;
    date: number;
    edited?: boolean;
}

export function ChecklistItem({ item, onChange, date, edited }: ChecklistItemProps) {
    const content = item.content.substring(3, item.content.length);

    return (
        <div className="flex-row-center gap-x-1">
            <Button variant='success' onClick={() => onChange(item.id)} size='icon'>
                {item.status ? (
                    <CircleCheckIcon className='size-5 text-success' />
                ) : (
                    <CircleIcon className='size-5' />
                )}
            </Button>
            <div className="app_container bg-background  min-w-2/3 flex-1 px-4 py-2 flex flex-col gap-y-2">
                <Typography className={`${item.status ? 'line-through' : ''}`} variant='body'>
                    {content}
                </Typography>
                <ItemFooter date={date} edited={edited} />

            </div>
        </div>
    );
}