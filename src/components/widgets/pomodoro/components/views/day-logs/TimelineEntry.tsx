import { Target, Coffee, Moon } from 'lucide-react';

import { BetterTypography } from '@/components/common/BetterTypography';
import { cn } from '@/lib/util';
import type { PomodoroHistoryEntry, PomodoroSession } from '../../../types';

const getSessionColor = (type: PomodoroSession) => {
    switch (type) {
        case 'focus': return 'bg-primary';
        case 'short-break': return 'bg-success';
        case 'long-break': return 'bg-warning';
    }
};

const getSessionTextColor = (type: PomodoroSession) => {
    switch (type) {
        case 'focus': return 'text-primary';
        case 'short-break': return 'text-success';
        case 'long-break': return 'text-warning';
    }
};

const getSessionBgColor = (type: PomodoroSession) => {
    switch (type) {
        case 'focus': return 'text-primary';
        case 'short-break': return 'text-success';
        case 'long-break': return 'text-warning';
    }
};

// const getSessionLabel = (type: PomodoroSession) => {
//     switch (type) {
//         case 'focus': return 'Focus';
//         case 'short-break': return 'Short Break';
//         case 'long-break': return 'Long Break';
//     }
// };

const SessionIcon = ({ type }: { type: PomodoroSession }) => {
    const iconClass = "size-4";
    switch (type) {
        case 'focus': return <Target className={iconClass} />;
        case 'short-break': return <Coffee className={iconClass} />;
        case 'long-break': return <Moon className={iconClass} />;
    }
};

interface TimelineEntryProps {
    log: PomodoroHistoryEntry;
    formatDuration: (ms: number) => string;
}

export default function TimelineEntry({ log, formatDuration }: TimelineEntryProps) {
    const formatTime = (timestamp: number) => {
        return new Date(timestamp).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className="relative flex items-center gap-3 py-1.5 px-3">
            {/* Left Accent Line for quick visual scanning */}
            <div className={cn("absolute left-0 top-3 bottom-3 w-1 rounded-full", getSessionColor(log.type))} />

            {/* Session Icon */}
            <div className={cn("flex-center size-5 rounded-xl ml-1 shrink-0", getSessionBgColor(log.type))}>
                <SessionIcon type={log.type} />
            </div>

            {/* Text Content */}
            <div className="flex-1 min-w-0 flex flex-col">
                <div className="flex items-center gap-2">
                    <BetterTypography variant="xs" weight="medium" className="truncate text-foreground">
                        {log.taskName || 'Focus Session'}
                    </BetterTypography>
                </div>
                <div className="flex items-center gap-1.5 mt-0.5">
                    {/* <BetterTypography variant="xxs" weight="medium" className={`overflow-hidden line-clamp-1 text-ellipsis ${getSessionTextColor(log.type)}`}>
                        {getSessionLabel(log.type)}
                    </BetterTypography>
                    <span className="text-muted-foreground text-[10px]">•</span> */}
                    <BetterTypography variant="xxs" className="text-muted-foreground tabular-nums overflow-hidden line-clamp-1 text-ellipsis">
                        {formatTime(log.startedAt)} - {formatTime(log.completedAt)}
                    </BetterTypography>
                </div>
            </div>

            {/* Duration */}
            <div className="shrink-0 pl-2 flex flex-col items-end">
                <BetterTypography variant="md" weight="bold" className={cn("tabular-nums", getSessionTextColor(log.type))}>
                    {formatDuration(log.duration)}
                </BetterTypography>
            </div>
        </div>
    );
}