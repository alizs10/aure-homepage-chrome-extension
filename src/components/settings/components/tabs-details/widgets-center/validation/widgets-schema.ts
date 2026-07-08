import { z } from 'zod';

export const widgetsSchema = z.object({
    widgets: z.object({
        "notes-and-checklists": z.boolean(),
        calendar: z.boolean(),
        "mood-tracker": z.boolean(),
        "pet-house": z.boolean(),
    }),
});

export type WidgetsFormValues = z.infer<typeof widgetsSchema>;