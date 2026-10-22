import { z } from 'zod';

export const favoriteSchema = z.object({
    title: z.string().min(1, 'title is required').max(50, 'title is too long (max 50 characters)'),
    url: z.string()
        .min(1, 'url is required')
        .max(2048, 'url is too long')
        .regex(
            /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/,
            'please enter a valid URL'
        ),
});

export type FavoriteFormValues = z.infer<typeof favoriteSchema>;