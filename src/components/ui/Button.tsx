import type { ButtonHTMLAttributes, ReactNode } from "react";
import { Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Button as BaseButton } from "@base-ui/react/button";
import { cn } from "../../lib/util";

export type ButtonVariant =
    | "primary"
    | "primary-active"
    | "ghost"
    | "success"
    | "success-active"
    | "destructive"
    | "ghost-destructive"
    | "warning"
    | "none";

type ButtonSize =
    | "icon"
    | "icon-sm"
    | "icon-xs"
    | "xs"
    | "sm"
    | "md"
    | "lg";

type SharedProps = {
    variant?: ButtonVariant;
    size?: ButtonSize;
    loading?: boolean;
    leftIcon?: ReactNode;
    rightIcon?: ReactNode;
    className?: string;
    children?: ReactNode;
};

type LinkButtonProps = SharedProps & {
    href: string;
    disabled?: never;
};

type NativeButtonProps = SharedProps &
    ButtonHTMLAttributes<HTMLButtonElement> & {
        href?: never;
    };

type ButtonProps = LinkButtonProps | NativeButtonProps;

const variantClasses: Record<ButtonVariant, string> = {
    primary:
        "bg-gradient-to-b from-background/30 to-background/60 app-blur text-foreground border-t border-border hover:to-primary/10 dark:hover:to-primary/30",
    "primary-active":
        "bg-gradient-to-b from-background/30 to-primary/10 dark:to-primary/30 app-blur text-foreground border-t border-border hover:to-primary/20 dark:hover:to-primary/40",
    ghost:
        "bg-gradient-to-b from-transparent to-transparent hover:from-secondary/30 hover:to-background/60 hover:app-blur border-t border-transparent hover:border-border text-foreground",
    success:
        "bg-gradient-to-b from-background/30 to-background/60 app-blur text-foreground border-t border-border hover:to-success/10 dark:hover:to-success/30",
    "success-active":
        "bg-gradient-to-b from-background/30 to-success/20 dark:to-success-30 app-blur text-foreground border-t border-border hover:to-success/30 dark:hover:to-success/40",
    destructive:
        "bg-gradient-to-b from-background/30 to-background/60 app-blur text-foreground border-t border-border hover:to-destructive/10 dark:hover:to-destructive/30",
    "ghost-destructive":
        "bg-none hover:bg-gradient-to-b from-background/30 to-destructive/20 dark:to-destructive/30 hover:app-blur border-t border-transparent hover:border-border hover:to-destructive/30 dark:hover:to-destructive/40",
    warning:
        "bg-gradient-to-b from-background/30 to-background/60 app-blur text-foreground border-t border-border hover:to-warning/30 dark:hover:to-warning/40",
    none: "",
};

const sizeClasses: Record<ButtonSize, string> = {
    icon: "h-10 min-h-10 aspect-square",
    "icon-sm": "h-8 aspect-square",
    "icon-xs": "h-6 aspect-square",
    sm: "h-9 px-4 text-xs",
    xs: "h-6 px-2 text-xs",
    md: "h-11 px-6 text-sm",
    lg: "h-12 px-8 text-base",
};

export default function Button(props: ButtonProps) {
    const {
        leftIcon,
        rightIcon,
        loading,
        variant = "primary",
        size = "sm",
        className,
        children,
        ...rest
    } = props;

    const classes = cn(
        "relative z-0 inline-flex items-center justify-center gap-x-2 rounded-3xl font-medium transition-colors duration-200",
        "disabled:opacity-50",
        variantClasses[variant],
        sizeClasses[size],
        className
    );

    // REFACTORED: The original logic would render multiple <Loader2> spinners 
    // simultaneously if loading=true and multiple icons/children were present.
    // This cleanly swaps the entire content for a single spinner when loading.
    const content = loading ? (
        <Loader2 className="size-4 animate-spin" />
    ) : (
        <>
            {leftIcon}
            {children}
            {rightIcon}
        </>
    );

    // Base UI officially recommends styling links directly rather than using 
    // the Button component for links, to preserve proper semantic <a> behavior.
    if ("href" in props && props.href) {
        return (
            <Link to={props.href} className={classes}>
                {content}
            </Link>
        );
    }

    return (
        <BaseButton
            {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}
            disabled={loading || props.disabled}
            className={classes}
            // Base UI feature: Keeps the button focusable when disabled, 
            // preventing focus from being lost during loading states.
            focusableWhenDisabled={!!loading}
        >
            {content}
        </BaseButton>
    );
}