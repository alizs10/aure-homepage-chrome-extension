import { format, subDays } from 'date-fns';
import type { PomodoroHistoryEntry } from '../types';

export interface DayBucket {
    date: string; // yyyy-MM-dd
    label: string; // e.g., "Mon, Jan 1"
    totalFocusTime: number; // in milliseconds
    totalSessions: number;
    entries: PomodoroHistoryEntry[];
}

export function filterHistoryByDays(
    history: PomodoroHistoryEntry[],
    days: number
): PomodoroHistoryEntry[] {
    const cutoff = subDays(new Date(), days);
    return history.filter(entry => {
        const entryDate = new Date(entry.completedAt);
        return entryDate >= cutoff;
    });
}

export function groupHistoryByDay(history: PomodoroHistoryEntry[]): DayBucket[] {
    const buckets = new Map<string, DayBucket>();

    history.forEach(entry => {
        const date = new Date(entry.completedAt);
        const dateKey = format(date, 'yyyy-MM-dd');
        const label = format(date, 'EEE, MMM d');

        if (!buckets.has(dateKey)) {
            buckets.set(dateKey, {
                date: dateKey,
                label,
                totalFocusTime: 0,
                totalSessions: 0,
                entries: [],
            });
        }

        const bucket = buckets.get(dateKey)!;
        bucket.entries.push(entry);

        if (entry.type === 'focus') {
            bucket.totalFocusTime += entry.duration;
            bucket.totalSessions += 1;
        }
    });

    return Array.from(buckets.values()).sort((a, b) =>
        a.date.localeCompare(b.date)
    );
}

export function fillMissingDays(buckets: DayBucket[], days: number): DayBucket[] {
    const filled: DayBucket[] = [];
    const today = new Date();

    for (let i = days - 1; i >= 0; i--) {
        const date = subDays(today, i);
        const dateKey = format(date, 'yyyy-MM-dd');
        const label = format(date, 'EEE, MMM d');

        const existing = buckets.find(b => b.date === dateKey);
        filled.push(existing || {
            date: dateKey,
            label,
            totalFocusTime: 0,
            totalSessions: 0,
            entries: [],
        });
    }

    return filled;
}

export function formatDurationForChart(ms: number): string {
    const hours = Math.floor(ms / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));

    if (hours > 0 && minutes > 0) return `${hours}h ${minutes}m`;
    if (hours > 0) return `${hours}h`;
    if (minutes > 0) return `${minutes}m`;
    return '0m';
}