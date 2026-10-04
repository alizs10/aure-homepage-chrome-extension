import { z } from 'zod';

export const progressSchema = z.object({
    title: z.string().trim().min(1, "Title is required"),
    label: z.string().trim().min(1, "Label is required"),
    priority: z.enum(['low', 'medium', 'high']),
    deadline: z.string().optional(),
    color: z.enum(['default', 'cherry', 'tangerine', 'lime', 'ocean', 'orchid']),
    interactionMode: z.enum(['linear', 'free']),
    steps: z.array(z.object({
        id: z.string(),
        // 🌟 Removed .trim() strictness to allow empty strings, we trim on submit instead
        content: z.string(),
    })).min(0),
    // 🌟 Removed the .refine block that forced all steps to have content
});

export type ProgressFormValues = z.infer<typeof progressSchema>;