import { z } from 'zod';

export const calendarNoteSchema = z.object({
    note: z.string().min(1, 'Note is required').max(50, 'Note is too long (max 50 characters)'),
});

export type CalendarNoteFormValues = z.infer<typeof calendarNoteSchema>;