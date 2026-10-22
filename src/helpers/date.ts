import { format, parse, parseISO } from "date-fns";

export const parseDate = (dateStr: string) =>
    parse(dateStr, "yyyy-MM-dd", new Date());

export const formatDate = (date: Date, formatStr?: string) =>
    format(date, formatStr || "yyyy-MM-dd");

export const formatDisplayDate = (
    date: Date | string | number | null | undefined,
    formatStr = "MMMM d, yyyy"
): string => {
    if (!date) return "";
    try {
        const d = typeof date === "string" ? parseISO(date) : new Date(date);
        return format(d, formatStr);
    } catch {
        return String(date);
    }
};