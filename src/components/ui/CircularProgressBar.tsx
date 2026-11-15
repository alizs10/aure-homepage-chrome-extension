import { useMemo } from 'react';
import { cn } from '@/lib/util';

export interface CircularProgressSegment {
    /** Segment value (e.g. 50 for 50%, or duration in ms) */
    value: number;
    /** Direct stroke color string (hex, hsl, or CSS variable, e.g. "var(--accent-cherry)") */
    color?: string;
    /** Tailwind classes for color (e.g. "text-indigo-600 dark:text-indigo-500" or "stroke-success") */
    className?: string;
    /** Optional label for tooltip or accessibility */
    label?: string;
    /** Optional custom stroke width for this segment */
    strokeWidth?: number;
    /** Unique key for React list rendering */
    key?: string | number;
}

export interface CircularProgressBarProps {
    /** Single progress value shorthand (0 to total, or 0-100 by default) */
    value?: number;
    /** Direct stroke color for single value */
    fillColor?: string;
    /** Tailwind className for single value */
    fillClassName?: string;

    /** Multiple separated progress segments */
    segments?: CircularProgressSegment[];

    /**
     * Total / max value.
     * If omitted, defaults to sum of segments (or 100 if sum <= 100).
     */
    total?: number;

    /** Outer diameter in pixels (default: 160) */
    size?: number;

    /** Stroke width in pixels (default: 8) */
    strokeWidth?: number;

    /**
     * Gap between separated segments in degrees (default: 6).
     * Only applies when 2 or more segments have positive values.
     */
    gap?: number;

    /** Whether segment stroke ends are rounded (default: true) */
    rounded?: boolean;

    /** Whether to show the background track circle (default: false) */
    showTrack?: boolean;

    /** Whether the background track has a dashed tick style (default: false) */
    trackDashed?: boolean;

    /** Custom dasharray for the background track if dashed (e.g. "2 6") */
    trackDashArray?: string;

    /** Background track color */
    trackColor?: string;

    /** Background track className (default: "text-secondary-foreground/30") */
    trackClassName?: string;

    /** Background track stroke width (defaults to strokeWidth) */
    trackStrokeWidth?: number;

    /** Optional content rendered in the center of the circle */
    children?: React.ReactNode;

    /** Extra classes on the outer wrapper */
    className?: string;
}

export function CircularProgressBar({
    value,
    fillColor,
    fillClassName = 'text-primary',
    segments,
    total,
    size = 160,
    strokeWidth = 8,
    gap = 6,
    rounded = true,
    showTrack = false,
    trackDashed = false,
    trackDashArray,
    trackColor,
    trackClassName = 'text-secondary-foreground/30',
    trackStrokeWidth,
    children,
    className,
}: CircularProgressBarProps) {
    // 1. Normalize segments from either `segments` prop or single `value`
    const normalizedSegments = useMemo<CircularProgressSegment[]>(() => {
        if (segments && segments.length > 0) {
            return segments;
        }
        if (typeof value === 'number') {
            return [
                {
                    value,
                    color: fillColor,
                    className: fillClassName,
                },
            ];
        }
        return [];
    }, [segments, value, fillColor, fillClassName]);

    // 2. Geometry calculations
    const cx = size / 2;
    const cy = size / 2;
    const radius = Math.max(1, (size - strokeWidth) / 2);
    const circumference = 2 * Math.PI * radius;

    const { items } = useMemo(() => {
        const active = normalizedSegments.filter(s => s.value > 0);
        const sum = active.reduce((acc, s) => acc + s.value, 0);

        if (sum === 0 || active.length === 0) {
            return { items: [] };
        }

        const effectiveTotal = typeof total === 'number' && total > 0 ? total : Math.max(sum, 100);
        const k = active.length;
        const isFullCircle = sum >= effectiveTotal;

        // Gap calculations
        const maxGap = k > 1 ? 360 / (k * 2) : 0;
        const effectiveGap = Math.min(gap, maxGap);
        const numGaps = k <= 1 ? 0 : (isFullCircle ? k : k - 1);
        const totalGapDegrees = numGaps * effectiveGap;

        const totalSpanDegrees = isFullCircle ? 360 : Math.min(360, (sum / effectiveTotal) * 360);
        const availableDegrees = Math.max(0, totalSpanDegrees - totalGapDegrees);

        // Cap angle correction for rounded stroke ends
        const capAngle = (strokeWidth / circumference) * 360;

        // Start symmetrically if full circle with multiple segments
        let currentAngle = isFullCircle && k > 1 ? effectiveGap / 2 : 0;

        const calculatedItems = active.map((seg, i) => {
            const segRatio = sum > 0 ? seg.value / sum : 0;
            const segDegrees = segRatio * availableDegrees;
            const arcLength = (segDegrees / 360) * circumference;

            let dashLength = arcLength;
            let startAngle = currentAngle;
            const isCompleteSingleCircle = k === 1 && isFullCircle;

            if (rounded) {
                if (isCompleteSingleCircle) {
                    dashLength = circumference;
                    startAngle = 0;
                } else {
                    dashLength = Math.max(0.001, arcLength - strokeWidth);
                    startAngle = currentAngle + (capAngle / 2);
                }
            }

            currentAngle += segDegrees + effectiveGap;

            return {
                ...seg,
                key: seg.key ?? i,
                dashLength,
                startAngle,
                isCompleteSingleCircle,
                effectiveStrokeWidth: seg.strokeWidth ?? strokeWidth,
            };
        });

        return { items: calculatedItems };
    }, [normalizedSegments, total, strokeWidth, circumference, gap, rounded]);

    return (
        <div
            className={cn('relative flex-center shrink-0', className)}
            style={{ width: size, height: size }}
        >
            <svg
                width={size}
                height={size}
                viewBox={`0 0 ${size} ${size}`}
                className="transform -rotate-90 overflow-visible"
            >
                {/* Background Track */}
                {showTrack && (
                    <circle
                        cx={cx}
                        cy={cy}
                        r={radius}
                        fill="transparent"
                        stroke={trackColor || 'currentColor'}
                        strokeWidth={trackStrokeWidth ?? strokeWidth}
                        strokeDasharray={trackDashed ? (trackDashArray || '2 6') : undefined}
                        className={cn('text-secondary-foreground/30', trackClassName)}
                        style={trackColor ? { stroke: trackColor } : undefined}
                    />
                )}

                {/* Progress Segments */}
                {items.map((item) => (
                    <circle
                        key={item.key}
                        cx={cx}
                        cy={cy}
                        r={radius}
                        fill="transparent"
                        stroke={item.color || 'currentColor'}
                        strokeWidth={item.effectiveStrokeWidth}
                        strokeDasharray={
                            item.isCompleteSingleCircle
                                ? `${circumference} 0`
                                : `${item.dashLength} ${circumference}`
                        }
                        strokeDashoffset={0}
                        strokeLinecap={
                            item.isCompleteSingleCircle
                                ? 'butt'
                                : (rounded ? 'round' : 'butt')
                        }
                        transform={`rotate(${item.startAngle} ${cx} ${cy})`}
                        className={cn('transition-all duration-500 ease-out', item.className)}
                        style={item.color ? { stroke: item.color } : undefined}
                    >
                        {item.label && <title>{item.label}</title>}
                    </circle>
                ))}
            </svg>

            {/* Inner Content */}
            {children && (
                <div className="absolute inset-0 flex-center flex-col pointer-events-auto">
                    {children}
                </div>
            )}
        </div>
    );
}

export default CircularProgressBar;
