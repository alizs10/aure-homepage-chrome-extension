import { BetterTypography } from '@/components/common/BetterTypography';
import Checkbox from '@/components/ui/Checkbox';
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
            <Checkbox
                checked={!!item.status}
                onChange={() => onChange(item.id)}
            />
            <div className="rounded-3xl liquid-glass min-w-2/3 flex-1 px-4 py-2 flex flex-col gap-y-2">
                <BetterTypography className={`${item.status ? 'line-through' : ''}`} variant="sm">
                    {content}
                </BetterTypography>
                <ItemFooter date={date} edited={edited} />
            </div>
        </div>
    );
}