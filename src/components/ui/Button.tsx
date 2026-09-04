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
    "liquid-glass-sm hover:bg-primary/30",

  "primary-active":
    "liquid-glass-sm bg-primary/30! hover:bg-primary/60!",

  ghost:
    "bg-transparent hover:bg-background/30",

  success:
    "liquid-glass-sm hover:bg-success/30!",

  "success-active":
    "liquid-glass-sm bg-success/30! hover:bg-success/60!",

  destructive:
    "liquid-glass-sm hover:bg-destructive/30!",

  "ghost-destructive":
    "bg-transparent hover:bg-destructive/20",

  "warning":
    "liquid-glass-sm hover:bg-warning/60!",
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
    "relative inline-flex items-center justify-center gap-x-2 rounded-3xl font-medium",
    "transition-[background,box-shadow,transform,opacity] duration-200",
    "active:scale-97 active:opacity-80",
    "disabled:pointer-events-none disabled:grayscale disabled:text-foreground/30",
    variantClasses[variant],
    sizeClasses[size],
    className,
  );

  const content = loading ? (
    <Loader2 className="size-4 animate-spin" />
  ) : (
    <>
      {leftIcon}
      {children}
      {rightIcon}
    </>
  );

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
      focusableWhenDisabled={!!loading}
    >
      {content}
    </BaseButton>
  );
}