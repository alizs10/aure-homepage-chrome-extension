import type { ButtonHTMLAttributes, ReactNode } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "../../lib/util";
import { Link } from "react-router-dom";
// import clsx from "clsx";
// import { twMerge } from "tailwind-merge";
// import { Link } from 'react-router';

export type ButtonVariant =
    | "primary"
    | "primary-active"
    // | "outline-primary"
    // | "secondary"
    // | "outline"
    | "ghost"
    | "success"
    | "success-active"
    // | "ghost-success"
    | "destructive"
    | "ghost-destructive"
    | "warning"
    // | "ghost-warning"
    // | "outline-warning"
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

    // secondary:
    //     "bg-secondary text-secondary-foreground hover:outline-6 outline-secondary/10",

    // outline:
    //     "border border-border bg-background hover:bg-muted",

    // "outline-primary":
    //     "border border-border bg-background hover:bg-primary/10 hover:border-primary hover:outline-6 outline-primary/10 hover:text-primary",
    // "outline-warning":
    //     "border border-border bg-background hover:bg-warning/10 hover:border-warning hover:outline-6 outline-warning/10 hover:text-warning",

    ghost:
        "bg-none hover:bg-gradient-to-b hover:from-secondary/30 hover:to-background/60 hover:app-blur border-t border-transparent hover:border-border text-foreground",

    success:
        "bg-gradient-to-b from-background/30 to-background/60 app-blur text-foreground border-t border-border hover:to-success/10 dark:hover:to-success/30",
    "success-active":
        "bg-gradient-to-b from-background/30 to-success/20 dark:to-success-30 app-blur text-foreground border-t border-border hover:to-success/30 dark:hover:to-success/40",
    // "ghost-success":
    //     "text-foreground hover:bg-success/10 hover:text-success",
    destructive:
        "bg-gradient-to-b from-background/30 to-background/60 app-blur text-foreground border-t border-border hover:to-destructive/10 dark:hover:to-destructive/30",
    "ghost-destructive":
        "bg-none hover:bg-gradient-to-b from-background/30 to-destructive/20 dark:to-destructive/30 hover:app-blur border-t border-transparent hover:border-border hover:to-destructive/30 dark:hover:to-destructive/40",
    warning:
        "bg-gradient-to-b from-background/30 to-background/60 app-blur text-foreground border-t border-border hover:to-warning/30 dark:hover:to-warning/40",
    // "ghost-warning":
    //     "text-foreground hover:bg-warning/10 hover:text-warning",
    none:
        "",
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
        variant = 'primary',
        size = 'sm',
        className,
        children,
        ...rest
    } = props;

    // loading = true

    const classes = cn(
        "relative z-0 inline-flex items-center justify-center gap-x-2 rounded-3xl font-medium transition-all duration-150",
        "disabled:opacity-50",
        variantClasses[variant],
        sizeClasses[size],
        className,
    );

    const content = (
        <>
            {leftIcon ? loading ? <Loader2 className="size-4 animate-spin" /> : leftIcon : null}
            {children ? (loading && size.includes("icon")) ? <Loader2 className="size-4 animate-spin" /> : children : null}
            {rightIcon ? loading ? <Loader2 className="size-4 animate-spin" /> : rightIcon : null}
        </>
    );

    if ("href" in props && props.href) {
        return (
            <Link
                to={props.href}
                className={classes}
            >
                {content}
            </Link>
        );
    }

    return (
        <button
            {...rest}
            disabled={loading || props.disabled}
            className={classes}
        >
            {content}

            {/* <div className="absolute -z-10 size-10 rounded-full bg-lime-400"></div> */}
        </button>
    );
}