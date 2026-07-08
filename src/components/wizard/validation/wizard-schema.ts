import { z } from "zod";

export const wizardSchema = z.object({
    name: z
        .string()
        .trim()
        .min(2, "Please enter at least 2 characters."),

    theme: z.enum(["light", "dark", "system"]),

    wallpaper: z.string(),

    blur: z.enum(["none", "xs", "sm", "md", "lg", "xl", "2xl", "3xl"]),

    widgets: z.object({
        "notes-and-checklists": z.boolean(),
        calendar: z.boolean(),
        "mood-tracker": z.boolean(),
        "pet-house": z.boolean(),
    }),

    accent: z.enum(["default", "cherry", "tangerine", "lime", "ocean", "orchid"]),

});

export type WizardFormValues = z.infer<typeof wizardSchema>;