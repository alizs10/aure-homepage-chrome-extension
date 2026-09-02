import { useMemo } from 'react';
import { BetterTypography } from '@/components/common/BetterTypography';
import type { DayBucket } from '../../../helpers/chart';
import TaskStatItem from './TaskStatItem';

interface TaskDetailsPanelProps {
    bucket: DayBucket | null;
    formatDuration: (ms: number) => string;
}

export default function TaskDetailsPanel({ bucket, formatDuration }: TaskDetailsPanelProps) {
    const taskStats = useMemo(() => {
        if (!bucket) return [];
        const map = new Map<string, { name: string, time: number, sessions: number }>();

        bucket.entries.forEach(entry => {
            if (entry.type === 'focus') {
                const name = entry.taskName || 'Unknown Task';
                const existing = map.get(name) || { name, time: 0, sessions: 0 };
                existing.time += entry.duration;
                existing.sessions += 1;
                map.set(name, existing);
            }
        });

        return Array.from(map.values()).sort((a, b) => b.time - a.time);
    }, [bucket]);

    if (!bucket) {
        return (
            <div className="flex-1 min-h-0 overflow-y-auto scrollbar-none flex-center flex-col py-1.5 rounded-3xl app-shadow app-gradient app-blur divide-y divide-border">
                <BetterTypography variant="xs">
                    Hover over the chart to see task details
                </BetterTypography>
            </div>
        );
    }

    return (
        <div className="flex-1 min-h-0 flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
                <BetterTypography variant="sm" weight="semibold">
                    {bucket.label}
                </BetterTypography>
                <BetterTypography variant="sm" weight="bold" className="text-primary tabular-nums">
                    {formatDuration(bucket.totalFocusTime)} total
                </BetterTypography>
            </div>

            {taskStats.length > 0 ? (
                <div className="flex-1 min-h-0 overflow-y-auto scrollbar-none flex flex-col py-1.5 rounded-3xl app-shadow app-gradient app-blur divide-y divide-border">
                    {taskStats.map(task => (
                        <TaskStatItem
                            key={task.name}
                            name={task.name}
                            sessions={task.sessions}
                            time={task.time}
                            formatDuration={formatDuration}
                        />
                    ))}
                </div>
            ) : (
                <div className="flex-1 min-h-0 flex-center flex-col py-1.5 rounded-3xl app-shadow app-gradient app-blur divide-y divide-border">
                    <BetterTypography variant="xs" className="text-muted-foreground text-center py-6">
                        No focus sessions recorded on this day.
                    </BetterTypography>
                </div>
            )}
        </div>
    );
}