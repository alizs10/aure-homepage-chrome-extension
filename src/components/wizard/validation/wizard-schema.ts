import { z } from "zod";

export const wizardSchema = z.object({
    name: z
        .string()
        .trim()
        .min(2, "Please enter at least 2 characters."),

    theme: z.enum(["light", "dark", "system"]),
    wallpaper: z.string(),
    wallpaper_brightness: z.string().optional(),
    wallpaper_blur: z.string().optional(),
    accent: z.string().optional(),
    blur: z.string().optional(),
    search_engine: z.string().optional(),
    enable_ip_checker: z.boolean().optional(),
});

export type WizardFormValues = z.infer<typeof wizardSchema>;
