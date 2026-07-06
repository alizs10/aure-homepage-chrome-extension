import { z } from "zod";

export const wizardSchema = z.object({
    name: z
        .string()
        .trim()
        .min(2, "Please enter at least 2 characters."),

    theme: z.enum(["light", "dark", "system"]),

    wallpaper: z.string(),
});

export type WizardFormValues = z.infer<typeof wizardSchema>;