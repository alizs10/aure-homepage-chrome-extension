import { useState } from 'react';
import { CheckCheckIcon, ListTodoIcon, FileTextIcon, AlertTriangleIcon } from 'lucide-react';
import ModalWrapper from '@/components/ui/modal/ModalWrapper';
import ModalHeader from '@/components/ui/modal/ModalHeader';
import ConfirmDialog from '@/components/ui/Dialog';
import Button from '@/components/ui/Button';
import { BetterTypography } from '@/components/common/BetterTypography';
import { useNotesAndChecklists } from '../hooks/useNotesAndChecklists';

type CleanupType = 'completed' | 'tasks' | 'notes' | 'all';

interface CleanupModalProps {
    open: boolean;
    onClose: () => void;
}

export default function CleanupModal({ open, onClose }: CleanupModalProps) {
    const { cleanup, cleanupCounts } = useNotesAndChecklists();
    const [confirmAction, setConfirmAction] = useState<CleanupType | null>(null);

    const handleConfirm = () => {
        if (confirmAction) {
            cleanup(confirmAction);
            setConfirmAction(null);
            onClose();
        }
    };

    const options = [
        {
            type: 'completed' as CleanupType,
            title: 'Clear Completed Tasks',
            description: 'Removes all checked tasks from your lists.',
            icon: CheckCheckIcon,
            variant: 'primary' as const,
            count: cleanupCounts.completed,
        },
        {
            type: 'tasks' as CleanupType,
            title: 'Clear All Tasks',
            description: 'Removes all tasks, keeping only text notes.',
            icon: ListTodoIcon,
            variant: 'warning' as const,
            count: cleanupCounts.tasks,
        },
        {
            type: 'notes' as CleanupType,
            title: 'Clear All Notes',
            description: 'Removes all text notes, keeping only tasks.',
            icon: FileTextIcon,
            variant: 'warning' as const,
            count: cleanupCounts.notes,
        },
        {
            type: 'all' as CleanupType,
            title: 'Wipe Everything',
            description: 'Deletes all notes and tasks permanently.',
            icon: AlertTriangleIcon,
            variant: 'destructive' as const,
            count: cleanupCounts.all,
        },
    ];

    const selectedOption = options.find(o => o.type === confirmAction);

    return (
        <>
            <ModalWrapper open={open} onClose={onClose}>
                <div className="rounded-3xl liquid-glass bg-transparent! dark:bg-background/10! p-3 md:p-5 flex flex-col w-full">
                    <ModalHeader title="Cleanup Data" onClose={onClose} />

                    <div className="mt-4 flex flex-col gap-2">
                        {options.map((option) => {
                            const isDisabled = option.count === 0;
                            return (
                                <Button
                                    key={option.type}
                                    variant="ghost"
                                    className="flex flex-col items-start gap-1 p-3 h-auto text-left"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setConfirmAction(option.type);
                                    }}
                                    disabled={isDisabled}
                                >
                                    <div className="flex items-center gap-2">
                                        <option.icon className="size-4 text-muted-foreground" />
                                        <BetterTypography variant="sm" weight="medium">
                                            {option.title}
                                        </BetterTypography>
                                        <BetterTypography
                                            variant="xs"
                                            className={`${isDisabled ? 'text-muted-foreground' : 'text-foreground'}`}
                                        >
                                            ({option.count}{option.type === 'all' ? ' entries' : ''})
                                        </BetterTypography>
                                    </div>
                                    <BetterTypography variant="xs" className="text-muted-foreground ml-6">
                                        {option.description}
                                    </BetterTypography>
                                </Button>
                            );
                        })}
                    </div>
                </div>
            </ModalWrapper>

            {selectedOption && (
                <ConfirmDialog
                    open={!!confirmAction}
                    onClose={() => setConfirmAction(null)}
                    title={selectedOption.title}
                    description={`Are you sure you want to ${selectedOption.title.toLowerCase()}? This action cannot be undone.`}
                    confirmText="Confirm"
                    cancelText="Cancel"
                    onConfirm={handleConfirm}
                    onCancel={() => setConfirmAction(null)}
                    confirmVariant={selectedOption.variant}
                    confirmIcon={<selectedOption.icon className="size-4" />}
                />
            )}
        </>
    );
}