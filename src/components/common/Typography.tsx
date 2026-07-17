import type { ElementType, ReactNode } from "react";
import { cn } from "../../lib/util";

type FontWeight =
    | "thin"
    | "light"
    | "normal"
    | "medium"
    | "semibold"
    | "bold"
    | "extrabold";

type TypographyVariant =
    | "display"
    | "h1"
    | "h2"
    | "h3"
    | "h4"
    | "body"
    | "body-sm"
    | "caption"
    | "caption-xs"
    | "caption-xxs"
    | "pre"
    | "label";

interface TypographyProps {
    variant?: TypographyVariant;
    weight?: FontWeight;
    as?: ElementType;
    className?: string;
    children?: ReactNode;
}


const variantClasses: Record<TypographyVariant, string> = {
    display: "text-3xl lg:text-4xl xl:text-5xl tracking-tight",

    h1: "text-2xl lg:text-3xl tracking-tight",
    h2: "text-xl lg:text-2xl tracking-tight",
    h3: "text-lg lg:text-xl",
    h4: "text-base lg:text-lg",

    body: "text-base",
    "body-sm": "text-sm",

    caption: "text-sm lg:text-base",
    "caption-xs": "text-xs lg:text-sm",
    "caption-xxs": "text-[8px] lg:text-[10px]",

    pre: "font-[inherit] text-sm lg:text-base whitespace-pre-wrap text-justify",

    label: "text-sm",
};

const defaultElements: Record<TypographyVariant, ElementType> = {
    display: "h1",

    h1: "h1",
    h2: "h2",
    h3: "h3",
    h4: "h4",

    body: "p",
    "body-sm": "p",

    caption: "span",
    "caption-xs": "span",
    "caption-xxs": "span",

    label: "label",
    pre: "pre",
};

const weightClasses: Record<FontWeight, string> = {
    thin: "font-thin",
    light: "font-light",
    normal: "font-normal",
    medium: "font-medium",
    semibold: "font-semibold",
    bold: "font-bold",
    extrabold: "font-extrabold",
};

const defaultWeights: Record<TypographyVariant, FontWeight> = {
    display: "extrabold",

    h1: "bold",
    h2: "bold",
    h3: "semibold",
    h4: "semibold",

    body: "normal",
    "body-sm": "normal",

    caption: "normal",
    "caption-xs": "normal",
    "caption-xxs": "normal",

    pre: "medium",
    label: "medium",
};

export function Typography({
    variant = "body",
    weight,
    as,
    className,
    children,
}: TypographyProps) {
    const Component = as ?? defaultElements[variant];

    return (
        <Component
            className={cn(
                variantClasses[variant],
                weightClasses[
                weight ?? defaultWeights[variant]
                ],
                className
            )}
        >
            {children}
        </Component>
    );
}