import { cn } from '@/lib/util';
import React, { type HTMLAttributes } from 'react';
import { BetterTypography } from '../common/BetterTypography';

export interface BadgeProps extends HTMLAttributes<HTMLDivElement> {
    /**
     * The visual style of the badge.
     */
    variant?: 'default' | 'secondary' | 'destructive' | 'warning' | 'success' | 'outline' | 'cherry' | 'tangerine' | 'lime' | 'ocean' | 'orchid';

    /**
     * The size of the badge. Automatically adjusts padding, gap, dot size, and typography.
     */
    size?: 'xs' | 'sm' | 'md' | 'lg';

    /**
     * Optional dot indicator for status badges.
     */
    withDot?: boolean;

    children: React.ReactNode;
}

// 🌟 Configuration map mathematically aligned with BetterTypography scales
const SIZE_CONFIG = {
    xs: {
        container: "px-2 py-0.75 gap-1", // 8px horiz, 2px vert, 4px gap
        dot: "size-1",                    // 4px dot
        typography: "xxs" as const,
    },

    sm: {
        container: "px-2.5 py-1 gap-1", // 10px horiz, 4px vert, 4px gap
        dot: "size-1.5",                 // 6px dot
        typography: "xs" as const,
    },

    md: {
        container: "px-3.5 py-1.5 gap-1.5", // 14px horiz, 6px vert, 6px gap
        dot: "size-2",                       // 8px dot
        typography: "sm" as const,
    },

    lg: {
        container: "px-4 py-2 gap-2", // 16px horiz, 8px vert, 8px gap
        dot: "size-2.5",              // 10px dot
        typography: "md" as const,
    },
} as const;

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
    ({ className, variant = 'default', size = 'md', withDot = false, children, ...props }, ref) => {
        const config = SIZE_CONFIG[size];

        return (
            <div
                ref={ref}
                className={cn(
                    "inline-flex items-center justify-center rounded-full transition-colors",
                    "focus:outline-none focus:ring-0",
                    config.container,
                    {
                        // Semantic Variants
                        "liquid-glass-sm bg-primary/30! text-primary": variant === 'default',
                        "liquid-glass-sm bg-muted/30! text-muted-foreground": variant === 'secondary',
                        "liquid-glass-sm bg-destructive/30! text-destructive": variant === 'destructive',
                        "liquid-glass-sm bg-warning/30! text-warning": variant === 'warning',
                        "liquid-glass-sm bg-success/30! text-success": variant === 'success',
                        "bg-transparent border border-border text-foreground": variant === 'outline',

                        // 🌟 Accent Color Variants
                        "liquid-glass-sm bg-cherry/30! text-cherry": variant === 'cherry',
                        "liquid-glass-sm bg-tangerine/30! text-tangerine": variant === 'tangerine',
                        "liquid-glass-sm bg-lime-accent/30! text-lime-accent": variant === 'lime',
                        "liquid-glass-sm bg-ocean/30! text-ocean": variant === 'ocean',
                        "liquid-glass-sm bg-orchid/30! text-orchid": variant === 'orchid',
                    },
                    className
                )}
                {...props}
            >
                {withDot && (
                    <span
                        className={cn(
                            "rounded-full shrink-0",
                            config.dot,
                            {
                                "bg-primary": variant === 'default',
                                "bg-muted-foreground": variant === 'secondary' || variant === 'outline',
                                "bg-destructive": variant === 'destructive',
                                "bg-warning": variant === 'warning',
                                "bg-success": variant === 'success',
                                "bg-cherry": variant === 'cherry',
                                "bg-tangerine": variant === 'tangerine',
                                "bg-lime-accent": variant === 'lime',
                                "bg-ocean": variant === 'ocean',
                                "bg-orchid": variant === 'orchid',
                            }
                        )}
                    />
                )}

                <BetterTypography
                    variant={config.typography}
                    weight="medium"
                    className="leading-none tracking-wide whitespace-nowrap"
                >
                    {children}
                </BetterTypography>
            </div>
        );
    }
);

Badge.displayName = 'Badge';
export default Badge;