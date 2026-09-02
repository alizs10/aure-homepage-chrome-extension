import { HistoryIcon } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

import { BetterTypography } from '@/components/common/BetterTypography';
import { PomodoroRepository } from '../../db/db';
import { usePomodoro } from '../../hooks/usePomodoro';
import type { DayLog, PomodoroHistoryEntry } from '../../types';
import DayDetail from './day-logs/DayDetail';
import DayList from './day-logs/DayList';

export default function LogsView() {
    const { formatDuration } = usePomodoro();

    const [logs, setLogs] = useState<PomodoroHistoryEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedDate, setSelectedDate] = useState<string | null>(null);

    useEffect(() => {
        const fetchLogs = async () => {
            setLoading(true);
            const history = await PomodoroRepository.getHistory();
            setLogs(history);
            setLoading(false);
        };
        fetchLogs();
    }, []);

    const groupedLogs = useMemo(() => {
        return logs.reduce((acc, log) => {
            const dateObj = new Date(log.completedAt);
            const dateKey = dateObj.toISOString().split('T')[0];
            const displayDate = dateObj.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });

            if (!acc[dateKey]) {
                acc[dateKey] = {
                    dateKey,
                    displayDate,
                    totalFocusTime: 0,
                    totalSessions: 0,
                    entries: [],
                };
            }

            acc[dateKey].entries.push(log);
            if (log.type === 'focus') {
                acc[dateKey].totalFocusTime += log.duration;
                acc[dateKey].totalSessions += 1;
            }

            return acc;
        }, {} as Record<string, DayLog>);
    }, [logs]);

    const daysArray = useMemo(() =>
        Object.values(groupedLogs).sort((a, b) => b.dateKey.localeCompare(a.dateKey)),
        [groupedLogs]
    );

    const selectedDay = selectedDate ? groupedLogs[selectedDate] : null;

    if (loading) {
        return (
            <div className="flex-1 flex-center py-10">
                <div className="size-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            </div>
        );
    }

    if (logs.length === 0) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center gap-2 py-10 text-muted-foreground">
                <HistoryIcon className="size-8 opacity-50" />
                <BetterTypography variant="sm">No focus sessions logged yet.</BetterTypography>
            </div>
        );
    }

    return (
        <div
            className="flex-1 min-h-0 flex flex-col gap-2"
        >
            {!selectedDay ? (
                <DayList days={daysArray} onSelectDay={setSelectedDate} formatDuration={formatDuration} />
            ) : (
                <DayDetail
                    day={selectedDay}
                    onBack={() => setSelectedDate(null)}
                    formatDuration={formatDuration}
                />
            )}
        </div>
    );
}