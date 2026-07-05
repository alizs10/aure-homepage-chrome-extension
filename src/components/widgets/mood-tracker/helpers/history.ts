import { parseDate } from "@/helpers";
import type { DateBucket, MoodFilter, MoodHistory, MoodType } from "../types";
import { subDays, startOfWeek, startOfMonth, startOfYear, endOfMonth, endOfWeek, addWeeks, max, min, startOfQuarter, addQuarters, endOfQuarter, isWithinInterval } from "date-fns";


export const moodScoreMap: Record<MoodType, number> = {
    great: 5,
    good: 4,
    okay: 3,
    meh: 2,
    bad: 0,
};

export function calculateMoodScore(history: MoodHistory[]): number {
    if (!history.length) return 0;

    const total = history.reduce((sum, entry) => {
        return sum + moodScoreMap[entry.mood];
    }, 0);

    return Number((total / history.length).toFixed(2));
}

export function getYearLabels(history: MoodHistory[]): string[] {
    const years = new Set<string>();

    for (const item of history) {
        const year = parseDate(item.date).getFullYear();
        years.add(String(year));
    }

    return Array.from(years).sort();
}

export function getMonthLabels(history: MoodHistory[]): string[] {
    const months = new Set<string>();

    for (const item of history) {
        const d = parseDate(item.date);

        const label = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
        months.add(label);
    }

    return Array.from(months).sort();
}

export function getWeekLabels(history: MoodHistory[]): string[] {
    const weeks = new Set<string>();

    for (const item of history) {
        const d = parseDate(item.date);

        const startOfYear = new Date(d.getFullYear(), 0, 1);
        const diffDays = Math.floor(
            (d.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24)
        );

        const week = Math.ceil((diffDays + startOfYear.getDay() + 1) / 7);

        const label = `${d.getFullYear()}-W${String(week).padStart(2, "0")}`;
        weeks.add(label);
    }

    return Array.from(weeks).sort();
}


export function getFilterRange(filter: MoodFilter) {
    const now = new Date();

    switch (filter) {
        case "last30days":
            return {
                from: subDays(now, 29), // includes today = 30 days total
                to: now,
            };

        case "thisWeek":
            return {
                from: startOfWeek(now, { weekStartsOn: 1 }),
                to: now,
            };

        case "thisMonth":
            return {
                from: startOfMonth(now),
                to: now,
            };

        case "thisYear":
            return {
                from: startOfYear(now),
                to: now,
            };
    }
}

export function filterHistoryByRange(
    history: MoodHistory[],
    filter: MoodFilter
) {
    const { from, to } = getFilterRange(filter);

    return history.filter(item => {
        const date = parseDate(item.date);
        return date >= from && date <= to;
    });
}

export function getMonthWeekBuckets(date = new Date()): DateBucket[] {
    const monthStart = startOfMonth(date);
    const monthEnd = endOfMonth(date);

    const firstWeek = startOfWeek(monthStart, { weekStartsOn: 1 });

    const buckets: DateBucket[] = [];

    let current = firstWeek;
    let week = 1;

    while (current <= monthEnd) {
        buckets.push({
            label: `Week ${week}`,
            from: max([startOfWeek(current, { weekStartsOn: 1 }), monthStart]),
            to: min([endOfWeek(current, { weekStartsOn: 1 }), monthEnd]),
        });

        current = addWeeks(current, 1);
        week++;
    }

    return buckets;
}

export function getQuarterBuckets(date = new Date()): DateBucket[] {
    const yearStart = startOfYear(date);

    return Array.from({ length: 4 }, (_, i) => {
        const quarterStart = startOfQuarter(addQuarters(yearStart, i));

        return {
            label: `Q${i + 1}`,
            from: quarterStart,
            to: endOfQuarter(quarterStart),
        };
    });
}

export function groupHistoryByBuckets(
    history: MoodHistory[],
    buckets: DateBucket[]
) {
    return buckets.map(bucket => ({
        ...bucket,
        items: history.filter(item =>
            isWithinInterval(
                parseDate(item.date),
                {
                    start: bucket.from,
                    end: bucket.to,
                }
            )
        ),
    }));
}