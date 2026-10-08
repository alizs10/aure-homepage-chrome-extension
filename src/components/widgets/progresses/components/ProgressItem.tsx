import ProgressBar from '@/components/ui/ProgressBar';
import ConfirmDialog from '@/components/ui/Dialog';
import { toast } from '@/stores/useToastStore';
import { useState, useMemo } from 'react';
import { useProgresses } from '../hooks/useProgresses';
import type { Progress } from '../types';
import ProgressHeader from './ProgressHeader';
import ProgressMeta from './ProgressMeta';
import ProgressActions from './ProgressActions';

interface ProgressItemProps {
    progress: Progress;
    onEdit: (progress: Progress) => void;
}

export default function ProgressItem({ progress, onEdit }: ProgressItemProps) {
    const { advanceStep, retreatStep, toggleStep, removeItem, toggleComplete } = useProgresses();
    const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);

    const progressPercentage = useMemo(() => {
        if (progress.steps.length === 0) return progress.completed ? 100 : 0;
        const completedCount = progress.steps.filter(s => s.completed).length;
        return Math.round((completedCount / progress.steps.length) * 100);
    }, [progress.steps, progress.completed]);

    const handleDelete = async () => {
        await removeItem(progress.id);
        toast.success("Progress deleted.");
        setConfirmDeleteOpen(false);
    };

    const accentColor = `var(--accent-${progress.color})`;

    return (
        <>
            <div className="flex flex-col gap-y-3 p-4 rounded-3xl liquid-glass border border-border/50">
                <ProgressHeader
                    title={progress.title}
                    onEdit={() => onEdit(progress)}
                    onDelete={() => setConfirmDeleteOpen(true)}
                />

                <ProgressMeta progress={progress} />

                <ProgressBar
                    value={progressPercentage}
                    fillStyle={{ backgroundColor: accentColor }}
                    showThumb
                />

                <ProgressActions
                    progress={progress}
                    onAdvance={() => advanceStep(progress.id)}
                    onRetreat={() => retreatStep(progress.id)}
                    onToggleComplete={() => toggleComplete(progress.id)}
                    onToggleStep={(stepId) => toggleStep(progress.id, stepId)}
                />
            </div>

            <ConfirmDialog
                open={confirmDeleteOpen}
                onClose={() => setConfirmDeleteOpen(false)}
                title="Delete Progress"
                description={`Are you sure you want to delete "${progress.title}"? This action cannot be undone.`}
                confirmText="Delete"
                cancelText="Cancel"
                onConfirm={handleDelete}
                onCancel={() => setConfirmDeleteOpen(false)}
                confirmVariant="destructive"
            />
        </>
    );
}