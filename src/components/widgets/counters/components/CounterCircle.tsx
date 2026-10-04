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
    const daysAbs = Math.abs(days);
    const displayDays = daysAbs >= 10000 ? `${Math.floor(daysAbs / 1000)}k` : String(daysAbs);

    const getVariant = (len: number): "xxs" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl" => {
        if (size > 60) {
            if (len >= 4) return "sm";
            if (len === 3) return "lg";
            if (len === 2) return "xl";
            return "2xl";
        }
        if (len >= 4) return "xs";
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
        const start = new Date(counter.createdAt);
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
                        <circle
                            cx={size / 2} cy={size / 2} r={radius} fill="transparent"
                            stroke="currentColor" className="text-secondary-foreground/50" strokeWidth={strokeWidth}
                            strokeDasharray="2 6"
                        />
                        <circle
                            cx={size / 2} cy={size / 2} r={radius} fill="transparent"
                            stroke={accentVar} strokeWidth={strokeWidth}
                            strokeDasharray={circumference}
                            strokeDashoffset={offset}
                            strokeLinecap="round"
                            className="transition-all duration-500"
                        />
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