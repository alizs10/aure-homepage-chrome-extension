import { z } from 'zod';

export const counterSchema = z.object({
    name: z.string().trim().min(1, "Name is required"),
    type: z.enum(['count_up', 'count_down']),
    color: z.enum(['default', 'cherry', 'tangerine', 'lime', 'ocean', 'orchid', 'golden']),
    startDate: z.string().min(1, "Start date is required"),
    endDate: z.string().optional(),
    isRecurring: z.boolean().optional(),

    // 🎯 FIX for Zod 4: Use `message` instead of `invalid_type_error`
    intervalDays: z.number({ message: "Must be a valid number" })
        .int({ message: "Must be a whole number" })
        .positive({ message: "Must be a positive number" })
        .optional(),

}).refine(
    (data) => data.type === 'count_up' || !!data.endDate,
    { message: "End date is required for count downs", path: ["endDate"] }
).refine(
    (data) => !(data.type === 'count_down' && data.isRecurring) || (!!data.intervalDays && data.intervalDays > 0),
    { message: "Interval days is required for recurring count downs", path: ["intervalDays"] }
);

export type CounterFormValues = z.infer<typeof counterSchema>;