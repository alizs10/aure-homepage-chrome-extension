import { ChevronRightIcon } from 'lucide-react';
import { BetterTypography } from '@/components/common/BetterTypography';
import type { DayLog } from '../../../types';


interface DayListProps {
    days: DayLog[];
    onSelectDay: (dateKey: string) => void;
    formatDuration: (ms: number) => string;
}

export default function DayList({ days, onSelectDay, formatDuration }: DayListProps) {
    return (
        <div className="flex-1 min-h-0 flex flex-col gap-1.5">
            <BetterTypography variant="xs" weight="semibold" className="text-muted-foreground">
                Daily Overview
            </BetterTypography>
            <div className="flex-1 min-h-0 overflow-y-auto scrollbar-none flex flex-col gap-0 rounded-3xl app_gradient app-blur py-1.5 divide-y divide-border">
                {days.map((day) => (
                    <button
                        key={day.dateKey}
                        onClick={() => onSelectDay(day.dateKey)}
                        className="flex items-center justify-between px-3 py-1.5 text-left group/row"
                    >
                        <div className="flex flex-col">
                            <BetterTypography variant="sm" weight="medium">
                                {day.displayDate}
                            </BetterTypography>
                            <BetterTypography variant="xs" className="text-muted-foreground">
                                {day.totalSessions} focus session{day.totalSessions !== 1 ? 's' : ''}
                            </BetterTypography>
                        </div>
                        <div className="flex items-center gap-2">
                            <BetterTypography variant="sm" weight="semibold" className="text-primary tabular-nums">
                                {formatDuration(day.totalFocusTime)}
                            </BetterTypography>
                            <ChevronRightIcon className="size-4 text-muted-foreground group-hover/row:translate-x-0.5 transition-transform" />
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
}