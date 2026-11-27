import { z } from 'zod';

export const routineSchema = z.object({
    title: z.string().min(1, 'Routine title is required').max(50, 'Routine title is too long (max 50 characters)'),
});

export type RoutineFormValues = z.infer<typeof routineSchema>;
