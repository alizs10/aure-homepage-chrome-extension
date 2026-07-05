import { format, parse } from "date-fns";

export const parseDate = (dateStr: string) =>
    parse(dateStr, "yyyy-MM-dd", new Date());

export const formatDate = (date: Date, formatStr?: string) =>
    format(date, formatStr || "yyyy-MM-dd");