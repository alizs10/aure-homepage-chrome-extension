import { useMemo } from 'react';
import { BetterTypography } from '@/components/common/BetterTypography';
import { useCounters } from '../hooks/useCounters';
import { useTheme } from '@/hooks/useTheme';
import { accentOptions } from '@/types';
import type { Counter } from '../types';
import { parseISO, differenceInCalendarDays } from 'date-fns'; // 🌟 Import differenceInCalendarDays

interface CounterCircleProps {
    counter: Counter;
    size?: number;
}

export default function CounterCircle({ counter, size = 56 }: CounterCircleProps) {
    const { getDaysCount } = useCounters();
    const { resolvedTheme } = useTheme();

    const days = getDaysCount(counter);
    const isCountDown = counter.type === 'count_down';
    const isNegativeCountdown = isCountDown && !counter.isRecurring && days < 0;

    const daysAbs = (isCountDown && counter.isRecurring && days < 0) ? 0 : Math.abs(days);
    const formatted = daysAbs >= 10000 ? `${Math.floor(daysAbs / 1000)}k` : String(daysAbs);
    const displayDays = isNegativeCountdown ? `-${formatted}` : formatted;

    const getVariant = (len: number): "xxs" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl" => {
        if (size > 60) {
            if (len >= 5) return "xs";
            if (len === 4) return "sm";
            if (len === 3) return "lg";
            if (len === 2) return "xl";
            return "2xl";
        }
        if (len >= 5) return "xxs";
        if (len === 4) return "xs";
        if (len === 3) return "md";
        if (len === 2) return "lg";
        return "xl";
    };
    const textVariant = getVariant(displayDays.length);

    const selectedAccent = accentOptions.find(opt => opt.id === counter.color);
    const foregroundColor = selectedAccent
        ? (resolvedTheme === 'dark' ? selectedAccent.foreground.dark : selectedAccent.foreground.light)
        : 'hsl(0 0% 100%)';

    const strokeWidth = size > 60 ? 6 : 5;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;

    let progress = 0;
    if (counter.type === 'count_down') {
        // 🎯 FIX: Use calendar days to completely ignore hours, minutes, and timezone offsets
        const start = counter.startDate ? parseISO(counter.startDate) : new Date(counter.createdAt);
        const end = parseISO(counter.endDate!);
        const now = new Date();

        const totalDays = differenceInCalendarDays(end, start);
        const elapsedDays = differenceInCalendarDays(now, start);

        if (totalDays > 0) {
            const rawProgress = Math.max(0, Math.min(1, elapsedDays / totalDays));
            progress = Math.round(rawProgress * 1000) / 1000;
        } else {
            // If the end date is the same day or in the past relative to creation
            progress = elapsedDays >= totalDays ? 1 : 0;
        }
    }

    const offset = circumference - (progress * circumference);
    const accentVar = `var(--accent-${counter.color})`;

    const dashesPath = useMemo(() => {
        if (progress >= 1) return '';

        const totalTicks = Math.round(circumference / 8);
        const cx = size / 2;
        const cy = size / 2;
        const r1 = radius - strokeWidth / 2;
        const r2 = radius + strokeWidth / 2;

        const capAngle = (strokeWidth / 2 / circumference) * 360;
        const tickHalfAngle = (1 / circumference) * 360;
        const bufferAngle = capAngle + tickHalfAngle;

        const minAngle = progress > 0 ? progress * 360 + bufferAngle : -1;
        const maxAngle = progress > 0 ? 360 - bufferAngle : 361;

        let d = '';
        for (let i = 0; i < totalTicks; i++) {
            const tickAngle = (i / totalTicks) * 360;
            if (progress <= 0 || (tickAngle > minAngle && tickAngle < maxAngle)) {
                const rad = tickAngle * (Math.PI / 180);
                const x1 = (cx + r1 * Math.cos(rad)).toFixed(2);
                const y1 = (cy + r1 * Math.sin(rad)).toFixed(2);
                const x2 = (cx + r2 * Math.cos(rad)).toFixed(2);
                const y2 = (cy + r2 * Math.sin(rad)).toFixed(2);
                d += `M ${x1} ${y1} L ${x2} ${y2} `;
            }
        }
        return d.trim();
    }, [size, strokeWidth, radius, circumference, progress]);

    return (
        <div className="relative flex-center shrink-0" style={{ width: size, height: size }}>
            {counter.type === 'count_up' ? (
                <>
                    <svg width={size} height={size}>
                        <circle cx={size / 2} cy={size / 2} r={radius} fill={accentVar} />
                    </svg>
                    <div className="absolute inset-0 flex-center" style={{ color: foregroundColor }}>
                        <BetterTypography variant={textVariant} weight='bold' className="text-current">
                            {displayDays}
                        </BetterTypography>
                    </div>
                </>
            ) : (
                <>
                    <svg width={size} height={size} className="transform -rotate-90">
                        {dashesPath && (
                            <path
                                d={dashesPath}
                                stroke="currentColor"
                                strokeWidth={2}
                                strokeLinecap="butt"
                                className="text-secondary-foreground/50"
                            />
                        )}
                        {progress > 0 && (
                            <circle
                                cx={size / 2} cy={size / 2} r={radius} fill="transparent"
                                stroke={accentVar} strokeWidth={strokeWidth}
                                strokeDasharray={circumference}
                                strokeDashoffset={offset}
                                strokeLinecap="round"
                                className="transition-all duration-500"
                            />
                        )}
                    </svg>
                    <div className="absolute inset-0 flex-center flex-col">
                        <BetterTypography variant={textVariant} weight='bold' className={`text-[var(--accent-${counter.color})]`}>
                            {displayDays}
                        </BetterTypography>
                    </div>
                </>
            )}
        </div>
    );
}