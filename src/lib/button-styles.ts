// lib/buttonStyles.ts

import { cn } from "./util";

export const buttonVariants = {
    primary:
        "bg-gradient-to-b from-background to-background/30 app-blur text-foreground border-t border-border hover:to-primary/20 dark:hover:to-primary/50",

    ghost:
        "bg-none hover:bg-gradient-to-b hover:from-secondary hover:to-background/30 hover:app-blur border-t border-transparent hover:border-border text-foreground",

    success:
        "bg-gradient-to-b from-background to-background/30 app-blur text-foreground border-t border-border hover:to-success/20 dark:hover:to-success/50",

    destructive:
        "bg-gradient-to-b from-background to-background/30 app-blur text-foreground border-t border-border hover:to-destructive/20 dark:hover:to-destructive/50",

    "ghost-destructive":
        "bg-none hover:bg-gradient-to-b hover:from-secondary hover:to-background/30 hover:app-blur border-t border-transparent hover:border-border hover:to-destructive/20 dark:hover:to-destructive/50",

    warning:
        "bg-gradient-to-b from-background to-background/30 app-blur text-foreground border-t border-border hover:to-warning/20 dark:hover:to-warning/50",

    none: "",
} as const;

export const buttonSizes = {
    icon: "h-10 aspect-square",
    "icon-sm": "h-8 aspect-square",
    "icon-xs": "h-6 aspect-square",
    xs: "h-6 px-2 text-xs",
    sm: "h-9 px-4 text-xs",
    md: "h-11 px-6 text-sm",
    lg: "h-12 px-8 text-base",
} as const;

export function buttonClass(
    variant: keyof typeof buttonVariants = "primary",
    size: keyof typeof buttonSizes = "sm",
    className?: string
) {
    return cn(
        "relative gap-x-2 rounded-3xl font-medium transition-all duration-150 disabled:opacity-50",
        buttonVariants[variant],
        buttonSizes[size],
        className
    );
}