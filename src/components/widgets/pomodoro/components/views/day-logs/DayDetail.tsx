import { BetterTypography } from '@/components/common/BetterTypography';
import Button from '@/components/ui/Button';
import { ArrowLeftIcon, ScanSquareIcon } from 'lucide-react';
import { useState } from 'react';
import type { DayLog } from '../../../types';
import DayDetailModal from './DayDetailModal';
import StatBlock from './StatBlock';
import TimelineEntry from './TimelineEntry';

interface DayDetailProps {
    day: DayLog;
    onBack: () => void;
    formatDuration: (ms: number) => string;
}

export default function DayDetail({ day, onBack, formatDuration }: DayDetailProps) {
    const [showModal, setShowModal] = useState(false);

    // Calculate stats inline
    const stats = (() => {
        let focusTime = 0, shortBreakTime = 0, longBreakTime = 0;
        let focusCount = 0, shortBreakCount = 0, longBreakCount = 0;

        for (const entry of day.entries) {
            if (entry.type === 'focus') {
                focusTime += entry.duration;
                focusCount += 1;
            } else if (entry.type === 'short-break') {
                shortBreakTime += entry.duration;
                shortBreakCount += 1;
            } else if (entry.type === 'long-break') {
                longBreakTime += entry.duration;
                longBreakCount += 1;
            }
        }

        return { focusTime, shortBreakTime, longBreakTime, focusCount, shortBreakCount, longBreakCount };
    })();

    return (
        <>
            <div className="flex items-center justify-between">
                <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={onBack}
                >
                    <ArrowLeftIcon className="size-4" />
                </Button>

                <div className="flex items-center gap-2">
                    <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => setShowModal(true)}
                        title="View detailed summary"
                    >
                        <ScanSquareIcon className="size-4" />
                    </Button>
                    <BetterTypography variant="sm" weight="semibold" className="text-muted-foreground">
                        {day.displayDate}
                    </BetterTypography>
                </div>
            </div>

            <div className="flex-row-center gap-1">
                <StatBlock label="Focus" count={stats.focusCount} duration={stats.focusTime} color="text-indigo-600 dark:text-indigo-500" formatDuration={formatDuration} />
                <StatBlock label="Short" count={stats.shortBreakCount} duration={stats.shortBreakTime} color="text-success" formatDuration={formatDuration} />
                <StatBlock label="Long" count={stats.longBreakCount} duration={stats.longBreakTime} color="text-warning" formatDuration={formatDuration} />
            </div>

            <div className="flex-1 min-h-0 flex flex-col gap-1.5 ">
                <BetterTypography variant="xs" weight="semibold" className="text-muted-foreground uppercase tracking-wider">
                    Timeline
                </BetterTypography>

                <div className="flex-1 min-h-0 py-1.5 overflow-y-auto scrollbar-none flex flex-col rounded-3xl app_gradient app_shadow app-blur divide-y divide-border">
                    {[...day.entries].sort((a, b) => a.startedAt - b.startedAt).map((log) => (
                        <TimelineEntry
                            key={log.id}
                            log={log}
                            formatDuration={formatDuration}
                        />
                    ))}
                </div>
            </div>

            <DayDetailModal
                open={showModal}
                onClose={() => setShowModal(false)}
                day={day}
                formatDuration={formatDuration}
            />
        </>
    );
}