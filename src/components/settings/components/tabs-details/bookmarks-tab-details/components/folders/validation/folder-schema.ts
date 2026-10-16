import { z } from 'zod';

export const folderSchema = z.object({
    title: z.string().min(1, 'Folder title is required').max(50, 'Folder title is too long (max 50 characters)'),
});

export type FolderFormValues = z.infer<typeof folderSchema>;