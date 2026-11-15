import { z } from 'zod';
import { differenceInCalendarDays, parseISO, format } from 'date-fns';

export const counterSchema = z.object({
    name: z.string().trim().min(1, "Name is required"),
    type: z.enum(['count_up', 'count_down']),
    color: z.enum(['default', 'cherry', 'tangerine', 'lime', 'ocean', 'orchid', 'golden']),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    isRecurring: z.boolean().optional(),

    // 🎯 FIX for Zod 4: Use `message` instead of `invalid_type_error`
    intervalDays: z.number({ message: "Must be a valid number" })
        .int({ message: "Must be a whole number" })
        .positive({ message: "Must be a positive number" })
        .optional(),

}).superRefine((data, ctx) => {
    // 1. Count Up requires startDate
    if (data.type === 'count_up') {
        if (!data.startDate || data.startDate.trim().length === 0) {
            ctx.addIssue({
                code: 'custom',
                message: "Start date is required",
                path: ["startDate"],
            });
        }
        return;
    }

    // 2. Count Down requires endDate
    if (data.type === 'count_down') {
        if (!data.endDate || data.endDate.trim().length === 0) {
            ctx.addIssue({
                code: 'custom',
                message: "End date is required for count downs",
                path: ["endDate"],
            });
            return;
        }

        const hasCustomStartDate = !!(data.startDate && data.startDate.trim().length > 0);

        // Check startDate vs endDate order if custom startDate provided
        if (hasCustomStartDate && data.startDate! > data.endDate) {
            ctx.addIssue({
                code: 'custom',
                message: "Start date cannot be after end date",
                path: ["startDate"],
            });
            return;
        }

        // 3. Logic checks for recurring countdowns
        if (data.isRecurring) {
            if (!data.intervalDays || data.intervalDays <= 0) {
                ctx.addIssue({
                    code: 'custom',
                    message: "Interval days is required for recurring count downs",
                    path: ["intervalDays"],
                });
                return;
            }

            const today = format(new Date(), 'yyyy-MM-dd');
            const startStr = hasCustomStartDate ? data.startDate! : today;
            const duration = differenceInCalendarDays(parseISO(data.endDate), parseISO(startStr));

            if (duration <= 0) {
                ctx.addIssue({
                    code: 'custom',
                    message: hasCustomStartDate
                        ? "End date must be after start date for recurring count downs"
                        : "End date must be in the future for recurring count downs",
                    path: ["endDate"],
                });
                return;
            }

            if (data.intervalDays < duration) {
                const dayWord = duration === 1 ? 'day' : 'days';
                ctx.addIssue({
                    code: 'custom',
                    message: hasCustomStartDate
                        ? `Repeat interval must be at least ${duration} ${dayWord} based on the start and end dates`
                        : `Repeat interval must be at least ${duration} ${dayWord} based on the countdown duration`,
                    path: ["intervalDays"],
                });
                return;
            }
        }
    }
});

export type CounterFormValues = z.infer<typeof counterSchema>;