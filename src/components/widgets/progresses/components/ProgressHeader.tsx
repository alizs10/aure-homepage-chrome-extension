import { useState } from 'react';
import { BetterTypography } from '@/components/common/BetterTypography';
import Button from '@/components/ui/Button';
import Popup from '@/components/ui/Popup';
import { MoreHorizontalIcon, PencilIcon, Trash2Icon } from 'lucide-react';

interface ProgressHeaderProps {
    title: string;
    onEdit: () => void;
    onDelete: () => void;
}

export default function ProgressHeader({ title, onEdit, onDelete }: ProgressHeaderProps) {
    const [isOpen, setIsOpen] = useState(false);

    const handleEdit = () => {
        setIsOpen(false);
        onEdit();
    };

    const handleDelete = () => {
        setIsOpen(false);
        onDelete();
    };

    return (
        <div className="flex justify-between items-start gap-x-2">
            <BetterTypography variant="sm" weight="semibold" className="truncate flex-1 min-w-0">
                {title}
            </BetterTypography>

            <Popup
                open={isOpen}
                onOpenChange={setIsOpen}
                side="bottom"
                align="end"
                sideOffset={4}
                className="min-w-32 p-1"
                trigger={(triggerProps) => (
                    <Button
                        size="icon-xs"
                        variant="ghost"
                        {...triggerProps}
                    >
                        <MoreHorizontalIcon className="size-4" />
                    </Button>
                )}
            >
                <div className="flex flex-col w-full space-y-0.5">
                    <Button
                        variant="ghost-warning"
                        size="sm"
                        className="justify-start w-full"
                        leftIcon={<PencilIcon className="size-4" />}
                        onClick={handleEdit}
                    >
                        <BetterTypography variant="xs" weight="medium">Edit</BetterTypography>
                    </Button>
                    <Button
                        variant="ghost-destructive"
                        size="sm"
                        className="justify-start w-full"
                        leftIcon={<Trash2Icon className="size-4" />}
                        onClick={handleDelete}
                    >
                        <BetterTypography variant="xs" weight="medium">Delete</BetterTypography>
                    </Button>
                </div>
            </Popup>
        </div>
    );
}