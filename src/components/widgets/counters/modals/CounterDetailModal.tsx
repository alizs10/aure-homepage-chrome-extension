import { BetterTypography } from '@/components/common/BetterTypography';
import Button from '@/components/ui/Button';
import ModalHeader from '@/components/ui/modal/ModalHeader';
import ModalWrapper from '@/components/ui/modal/ModalWrapper';
import { RotateCcwIcon, Trash2Icon, PenIcon } from 'lucide-react';
import { useCounters } from '../hooks/useCounters';
import { toast } from '@/stores/useToastStore';
import type { Counter } from '../types';
import ConfirmDialog from '@/components/ui/Dialog';
import { useState } from 'react';
import { parseISO, format } from 'date-fns';
import CounterCircle from '../components/CounterCircle'; // 🌟 Import

interface CounterDetailModalProps {
    open: boolean;
    onClose: () => void;
    counter: Counter;
    onEdit: () => void;
}

export default function CounterDetailModal({ open, onClose, counter, onEdit }: CounterDetailModalProps) {
    const { removeItem, resetItem } = useCounters();
    const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);

    const handleReset = async () => {
        await resetItem(counter.id);
        toast.success(`${counter.name} has been reset.`);
        onClose(); // Close detail modal after reset
    };

    const handleDelete = async () => {
        await removeItem(counter.id);
        toast.success(`${counter.name} deleted.`);
        setConfirmDeleteOpen(false);
        onClose();
    };

    const dateLabel = counter.type === 'count_up'
        ? format(parseISO(counter.startDate), 'MMM d, yyyy')
        : format(parseISO(counter.endDate!), 'MMM d, yyyy');

    return (
        <>
            <ModalWrapper open={open} onClose={onClose}>
                <div className="rounded-3xl liquid-glass p-3 md:p-5 flex flex-col gap-4 w-full max-h-[80vh] overflow-y-auto scrollbar-none">
                    <ModalHeader title={counter.name} onClose={onClose} />

                    <div className="flex flex-col gap-y-4">
                        {/* 🌟 Replaced text days with larger 80px CounterCircle */}
                        <div className="flex items-center gap-x-4 p-4 rounded-3xl border border-border">
                            <CounterCircle counter={counter} size={80} />
                            <div className="flex-1 min-w-0">
                                <BetterTypography variant="xs" className="text-muted-foreground uppercase tracking-wider">
                                    {counter.type === 'count_up' ? 'Counting Since' : 'Counting Until'}
                                </BetterTypography>
                                <BetterTypography variant="md" weight="semibold" className="truncate">
                                    {dateLabel}
                                </BetterTypography>
                            </div>
                        </div>

                        {counter.type === 'count_down' && counter.isRecurring && (
                            <BetterTypography variant="xs" className="text-muted-foreground">
                                Recurring Interval: <BetterTypography as="span" variant="sm" weight="medium">
                                    Every {counter.intervalDays} days
                                </BetterTypography>
                            </BetterTypography>
                        )}
                    </div>

                    {/* 🎯 Fixed Button variants to match your Button.tsx definitions */}
                    <div className="flex flex-col sm:flex-row gap-2 mt-auto">
                        <Button variant="ghost-destructive" className="w-full" leftIcon={<Trash2Icon className="size-4" />} onClick={() => setConfirmDeleteOpen(true)}>
                            <BetterTypography variant="sm" weight="medium">Delete</BetterTypography>
                        </Button>
                        <Button variant="ghost-warning" className="w-full" leftIcon={<PenIcon className="size-4" />} onClick={onEdit}>
                            <BetterTypography variant="sm" weight="medium">Edit</BetterTypography>
                        </Button>
                        <Button variant="success" className="w-full" leftIcon={<RotateCcwIcon className="size-4" />} onClick={handleReset}>
                            <BetterTypography variant="sm" weight="medium">Reset</BetterTypography>
                        </Button>
                    </div>
                </div>
            </ModalWrapper>

            <ConfirmDialog
                open={confirmDeleteOpen}
                onClose={() => setConfirmDeleteOpen(false)}
                title="Delete Counter"
                description={`Are you sure you want to delete "${counter.name}"? This action cannot be undone.`}
                confirmText="Delete"
                cancelText="Cancel"
                onConfirm={handleDelete}
                onCancel={() => setConfirmDeleteOpen(false)}
                confirmVariant="destructive"
            />
        </>
    );
}