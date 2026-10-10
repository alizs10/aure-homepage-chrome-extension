import Badge from '@/components/ui/Badge';
import { format, isBefore, parseISO } from 'date-fns';
import type { Priority, Progress } from '../types';

interface ProgressMetaProps {
    progress: Progress;
}

// Map priorities to semantic Badge variants
const priorityVariantMap: Record<Priority, 'success' | 'warning' | 'destructive'> = {
    low: 'success',
    medium: 'warning',
    high: 'destructive',
};

export default function ProgressMeta({ progress }: ProgressMetaProps) {
    // 🌟 FIX: Wrap in Boolean() to ensure isOverdue is strictly a boolean, preventing the TS error
    const isOverdue = Boolean(progress.deadline && isBefore(parseISO(progress.deadline), new Date()) && !progress.completed);

    // Calculate step count text
    const completedCount = progress.steps.filter(s => s.completed).length;
    const totalCount = progress.steps.length;
    const stepText = totalCount > 0 ? `${completedCount}/${totalCount} steps` : "No steps";

    return (
        <div className="flex items-center gap-1 flex-wrap">
            <Badge variant="default" size="xs" withDot>
                {progress.label}
            </Badge>

            <Badge variant={priorityVariantMap[progress.priority]} size="xs">
                {progress.priority}
            </Badge>

            <Badge variant="secondary" size="xs">
                {stepText}
            </Badge>

            {progress.deadline && (
                <Badge variant={isOverdue ? "destructive" : "ghost"} size="xs" withDot={isOverdue}>
                    {format(parseISO(progress.deadline), "MMM d")}
                </Badge>
            )}
        </div>
    );
}