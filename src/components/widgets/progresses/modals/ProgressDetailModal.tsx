import { BetterTypography } from '@/components/common/BetterTypography';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Checkbox from '@/components/ui/Checkbox';
import ConfirmDialog from '@/components/ui/Dialog';
import ModalHeader from '@/components/ui/modal/ModalHeader';
import ModalWrapper from '@/components/ui/modal/ModalWrapper';
import ProgressBar from '@/components/ui/ProgressBar';
import { cn } from '@/lib/util';
import { toast } from '@/stores/useToastStore';
import {
    differenceInCalendarDays,
    format,
    isBefore,
    isValid,
    parseISO,
    startOfDay,
} from 'date-fns';
import {
    ChevronLeftIcon,
    ChevronRightIcon,
    CircleCheckIcon,
    CircleIcon,
    PencilIcon,
    Trash2Icon
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { useProgresses } from '../hooks/useProgresses';
import { useProgressesStore } from '../store';
import type { Priority, Progress } from '../types';

interface ProgressDetailModalProps {
    open: boolean;
    onClose: () => void;
    progress: Progress;
    onEdit: () => void;
}

const priorityVariantMap: Record<Priority, 'success' | 'warning' | 'destructive'> = {
    low: 'success',
    medium: 'warning',
    high: 'destructive',
};

export default function ProgressDetailModal({
    open,
    onClose,
    progress: initialProgress,
    onEdit,
}: ProgressDetailModalProps) {
    const { advanceStep, retreatStep, toggleStep, toggleComplete, removeItem, updateItem } = useProgresses();
    const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);

    // Subscribe to store so modal reacts live to any updates
    const currentProgress = useProgressesStore((state) =>
        state.data.find((p) => p.id === initialProgress.id)
    );
    const progress = currentProgress || initialProgress;

    const accentColor = `var(--accent-${progress.color})`;

    // Deadline parsing and status calculation
    const deadlineDate = useMemo(() => {
        if (!progress.deadline) return null;
        try {
            const d = parseISO(progress.deadline);
            return isValid(d) ? d : null;
        } catch {
            return null;
        }
    }, [progress.deadline]);

    const isOverdue = useMemo(() => {
        return Boolean(
            deadlineDate &&
            isBefore(deadlineDate, startOfDay(new Date())) &&
            !progress.completed
        );
    }, [deadlineDate, progress.completed]);

    const deadlineRelative = useMemo(() => {
        if (!deadlineDate) return null;
        const diff = differenceInCalendarDays(deadlineDate, startOfDay(new Date()));
        if (diff === 0) return 'Due today';
        if (diff === 1) return 'Due tomorrow';
        if (diff === -1) return 'Overdue by 1 day';
        if (diff < -1) return `Overdue by ${Math.abs(diff)} days`;
        return `Due in ${diff} days`;
    }, [deadlineDate]);

    // Progress percentage & step counts
    const completedCount = useMemo(() => {
        return progress.steps.filter((s) => s.completed).length;
    }, [progress.steps]);

    const totalSteps = progress.steps.length;

    const progressPercentage = useMemo(() => {
        if (totalSteps === 0) return progress.completed ? 100 : 0;
        return Math.round((completedCount / totalSteps) * 100);
    }, [totalSteps, completedCount, progress.completed]);

    // Handlers
    const handleDelete = async () => {
        await removeItem(progress.id);
        toast.success('Progress deleted.');
        setConfirmDeleteOpen(false);
        onClose();
    };

    const handleToggleComplete = async () => {
        if (totalSteps > 0 && !progress.completed) {
            // Mark all steps complete
            const completedSteps = progress.steps.map((s) => ({ ...s, completed: true }));
            await updateItem(progress.id, {
                steps: completedSteps,
                activeStepIndex: totalSteps,
                completed: true,
            });
            toast.success('All steps marked as completed!');
        } else if (totalSteps > 0 && progress.completed) {
            // Mark all steps incomplete
            const incompleteSteps = progress.steps.map((s) => ({ ...s, completed: false }));
            await updateItem(progress.id, {
                steps: incompleteSteps,
                activeStepIndex: 0,
                completed: false,
            });
            toast.success('Progress marked as incomplete.');
        } else {
            await toggleComplete(progress.id);
            toast.success(progress.completed ? 'Marked as incomplete.' : 'Marked as completed!');
        }
    };



    const isLinear = progress.interactionMode === 'linear';
    const activeStepIndex = progress.activeStepIndex;
    const isAtEnd = activeStepIndex === totalSteps;
    const isAtStart = activeStepIndex === 0;

    return (
        <>
            <ModalWrapper open={open} onClose={onClose} className="sm:max-w-lg">
                <div className="rounded-3xl liquid-glass p-4 sm:p-6 flex flex-col gap-5 w-full max-h-[85vh] overflow-y-auto scrollbar-none">
                    <ModalHeader title="Progress Details" onClose={onClose} />

                    {/* Title & Metadata Badges */}
                    <div className="flex flex-col gap-y-2.5">
                        <BetterTypography variant="lg" weight="bold" className="wrap-break-word text-foreground">
                            {progress.title}
                        </BetterTypography>

                        <div className="flex items-center gap-1.5 flex-wrap">
                            {/* Completion Status */}
                            {progress.completed ? (
                                <Badge variant="success" size="xs" withDot>
                                    Completed
                                </Badge>
                            ) : isOverdue ? (
                                <Badge variant="destructive" size="xs" withDot>
                                    Overdue
                                </Badge>
                            ) : (
                                <Badge variant="secondary" size="xs" withDot>
                                    In Progress
                                </Badge>
                            )}

                            {/* Label */}
                            {progress.label && (
                                <Badge variant="default" size="xs" withDot>
                                    {progress.label}
                                </Badge>
                            )}

                            {/* Priority */}
                            <Badge variant={priorityVariantMap[progress.priority]} size="xs">
                                {progress.priority} priority
                            </Badge>

                            {/* Interaction Mode */}
                            <Badge variant="ghost" size="xs">
                                {isLinear ? 'Linear Mode' : 'Free Mode'}
                            </Badge>

                            {/* Deadline */}
                            {progress.deadline && (
                                <Badge variant={isOverdue ? 'destructive' : 'ghost'} size="xs" withDot={isOverdue}>
                                    {format(parseISO(progress.deadline), 'MMM d, yyyy')}
                                </Badge>
                            )}
                        </div>
                    </div>

                    {/* Progress Bar Section */}
                    <div className="p-4 rounded-2xl liquid-glass border border-border/40 flex flex-col gap-3">
                        <div className="flex justify-between items-center">
                            <BetterTypography variant="xs" weight="medium" className="text-muted-foreground uppercase tracking-wider">
                                Completion
                            </BetterTypography>
                            <BetterTypography variant="xs" weight="semibold">
                                {totalSteps > 0
                                    ? `${completedCount} of ${totalSteps} steps completed (${progressPercentage}%)`
                                    : `${progressPercentage}%`}
                            </BetterTypography>
                        </div>

                        <ProgressBar
                            value={progressPercentage}
                            fillStyle={{ backgroundColor: accentColor }}
                            showThumb
                        />
                    </div>

                    {/* Steps Section */}
                    <div className="flex flex-col gap-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-x-1">
                                <BetterTypography variant="sm" weight="semibold">
                                    Steps
                                </BetterTypography>
                                {totalSteps > 0 && (
                                    <BetterTypography variant="sm" weight="semibold">
                                        {"("}{completedCount}/{totalSteps}{")"}
                                    </BetterTypography>
                                )}
                            </div>
                        </div>

                        {totalSteps === 0 ? (
                            <div className="text-center py-6 px-4 rounded-2xl border border-dashed border-border/60 flex flex-col items-center gap-2">
                                <BetterTypography variant="sm" className="text-muted-foreground">
                                    No steps added.
                                </BetterTypography>
                                <BetterTypography variant="xs" className="text-muted-foreground">
                                    This progress acts as a single task.
                                </BetterTypography>
                                <Button
                                    size="sm"
                                    variant={progress.completed ? 'ghost' : 'success'}
                                    onClick={handleToggleComplete}
                                    className="mt-2"
                                >
                                    <BetterTypography variant="xs" weight="medium">
                                        {progress.completed ? 'Mark as Incomplete' : 'Mark as Complete'}
                                    </BetterTypography>
                                </Button>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-2">
                                <div className="flex flex-col gap-y-3">
                                    {progress.steps.map((step, index) => {
                                        const isPastStep = isLinear && index < activeStepIndex;
                                        const isCurrentStep = isLinear && index === activeStepIndex && !progress.completed;
                                        const isStepDone = step.completed || isPastStep;

                                        if (isLinear) {
                                            return (
                                                <div
                                                    key={step.id}
                                                    className={cn(
                                                        'flex items-center gap-x-2'
                                                    )}
                                                >
                                                    <div className="flex items-center justify-center shrink-0">
                                                        {isStepDone ? (
                                                            <CircleCheckIcon className="size-4.5 text-success" />
                                                        ) : isCurrentStep ? (
                                                            <div
                                                                className="size-4.5 rounded-full border-2 border-primary flex items-center justify-center"
                                                                style={{ borderColor: accentColor }}
                                                            >
                                                                <div
                                                                    className="size-2 rounded-full"
                                                                    style={{ backgroundColor: accentColor }}
                                                                />
                                                            </div>
                                                        ) : (
                                                            <CircleIcon className="size-4.5 text-muted-foreground" />
                                                        )}
                                                    </div>

                                                    <div className="flex-1 min-w-0">
                                                        <BetterTypography
                                                            variant="xs"
                                                            className={cn(
                                                                'wrap-break-word',
                                                                isStepDone && 'line-through text-muted-foreground',
                                                                isCurrentStep && 'font-medium text-foreground'
                                                            )}
                                                        >
                                                            {step.content || (
                                                                <span className="italic text-muted-foreground">
                                                                    Step {index + 1}
                                                                </span>
                                                            )}
                                                        </BetterTypography>
                                                    </div>
                                                </div>
                                            );
                                        }

                                        // Free Mode step
                                        return (
                                            <div
                                                key={step.id}
                                                className={cn(
                                                    'flex items-center gap-x-2'
                                                )}
                                                onClick={() => toggleStep(progress.id, step.id)}
                                            >
                                                <Checkbox
                                                    size="md"
                                                    checked={step.completed}
                                                    onChange={() => toggleStep(progress.id, step.id)}
                                                />

                                                <div className="flex-1 min-w-0">
                                                    <BetterTypography
                                                        variant="xs"
                                                        className={cn(
                                                            'wrap-break-word',
                                                            step.completed && 'line-through text-muted-foreground'
                                                        )}
                                                    >
                                                        {step.content || (
                                                            <span className="italic text-muted-foreground">
                                                                Step {index + 1}
                                                            </span>
                                                        )}
                                                    </BetterTypography>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* Linear navigation buttons */}
                                {isLinear && (
                                    <div className="flex items-center gap-x-2 pt-1">
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            disabled={isAtStart}
                                            onClick={() => retreatStep(progress.id)}
                                            leftIcon={<ChevronLeftIcon className="size-4" />}
                                        >
                                            <BetterTypography variant="xs" weight="medium">
                                                Previous
                                            </BetterTypography>
                                        </Button>

                                        <Button
                                            size="sm"
                                            variant={isAtEnd ? 'success' : 'primary'}
                                            disabled={isAtEnd}
                                            onClick={() => advanceStep(progress.id)}
                                            className="flex-1 justify-center min-w-0"
                                            rightIcon={!isAtEnd ? <ChevronRightIcon className="size-4 shrink-0" /> : undefined}
                                        >
                                            <BetterTypography variant="xs" weight="medium" className="truncate">
                                                {isAtEnd
                                                    ? 'All Steps Completed'
                                                    : progress.steps[activeStepIndex]?.content
                                                        ? `Complete: ${progress.steps[activeStepIndex].content}`
                                                        : 'Complete Step'}
                                            </BetterTypography>
                                        </Button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Metadata Card: Deadline, Created, Updated */}
                    <div className="p-4 rounded-3xl liquid-glass flex flex-wrap gap-y-3 gap-x-8 text-muted-foreground">
                        {progress.deadline && (
                            <div className="flex flex-col flex-1">
                                <BetterTypography variant="xxs" weight='light' className="text-muted-foreground uppercase tracking-wider">
                                    Deadline
                                </BetterTypography>
                                <BetterTypography variant="xs" weight="medium" className="text-foreground text-nowrap">
                                    {format(parseISO(progress.deadline), 'MMM d, yyyy')}
                                    {deadlineRelative && ` (${deadlineRelative})`}
                                </BetterTypography>
                            </div>
                        )}

                        <div className="flex flex-col flex-1">
                            <BetterTypography variant="xxs" weight='light' className="text-muted-foreground uppercase tracking-wider">
                                Label
                            </BetterTypography>
                            <BetterTypography variant="xs" weight="medium" className="text-foreground text-nowrap capitalize">
                                {progress.label || 'None'}
                            </BetterTypography>
                        </div>

                        <div className="flex flex-col flex-1">
                            <BetterTypography variant="xxs" weight='light' className="text-muted-foreground uppercase tracking-wider">
                                Created
                            </BetterTypography>
                            <BetterTypography variant="xs" weight="medium" className="text-foreground text-nowrap">
                                {format(new Date(progress.createdAt), 'MMM d, yyyy')}
                            </BetterTypography>
                        </div>

                        <div className="flex flex-col flex-1">
                            <BetterTypography variant="xxs" weight='light' className="text-muted-foreground uppercase tracking-wider">
                                Mode
                            </BetterTypography>
                            <BetterTypography variant="xs" weight="medium" className="text-foreground text-nowrap capitalize">
                                {progress.interactionMode} mode
                            </BetterTypography>
                        </div>
                    </div>

                    {/* Action Buttons Footer */}
                    <div className="flex flex-col sm:flex-row gap-2 mt-auto">
                        <Button
                            variant="ghost-destructive"
                            className="w-full sm:flex-1"
                            leftIcon={<Trash2Icon className="size-4" />}
                            onClick={() => setConfirmDeleteOpen(true)}
                        >
                            <BetterTypography variant="xs" weight="medium">
                                Delete
                            </BetterTypography>
                        </Button>

                        <Button
                            variant="ghost-warning"
                            className="w-full sm:flex-1"
                            leftIcon={<PencilIcon className="size-4" />}
                            onClick={onEdit}
                        >
                            <BetterTypography variant="xs" weight="medium">
                                Edit
                            </BetterTypography>
                        </Button>
                    </div>
                </div>
            </ModalWrapper>

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
