import { z } from 'zod';

export const websiteSchema = z.object({
    title: z.string().min(1, 'Title is required').max(50, 'Title is too long (max 50 characters)'),
    url: z.string()
        .min(1, 'URL is required')
        .max(2048, 'URL is too long')
        .regex(
            /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/,
            'Please enter a valid URL'
        ),
});

export type WebsiteFormValues = z.infer<typeof websiteSchema>;