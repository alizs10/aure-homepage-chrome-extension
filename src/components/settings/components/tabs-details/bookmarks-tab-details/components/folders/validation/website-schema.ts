import { z } from 'zod';
import { isValidWebUrl } from '@/lib/url';

export const websiteSchema = z.object({
    title: z.string().min(1, 'Title is required').max(50, 'Title is too long (max 50 characters)'),
    url: z.string()
        .min(1, 'URL is required')
        .max(2048, 'URL is too long')
        .refine(isValidWebUrl, {
            message: 'Please enter a valid URL (e.g. https://example.com or localhost:3000)',
        }),
});

export type WebsiteFormValues = z.infer<typeof websiteSchema>;
