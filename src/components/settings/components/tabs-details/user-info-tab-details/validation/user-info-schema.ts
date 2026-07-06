import { z } from 'zod';

export const userInfoSchema = z.object({
    name: z.string().min(1, 'Name is required').max(50, 'Name is too long (max 50 characters)'),
});

export type UserInfoFormValues = z.infer<typeof userInfoSchema>;