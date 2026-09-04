import { cn } from '@/lib/util'
import type { PomodoroSession } from '../types'

interface CycleIndicatorProps {
    session: PomodoroSession
    cyclePosition: number
    longBreakInterval: number
}

export default function CycleIndicator({ session, cyclePosition, longBreakInterval }: CycleIndicatorProps) {
    // 🌟 Cycle Indicator Logic
    const N = longBreakInterval;
    const totalDots = N * 2;

    let currentStepIndex = 0;
    if (session === 'focus') {
        currentStepIndex = (cyclePosition - 1) * 2;
    } else if (session === 'short-break') {
        currentStepIndex = (cyclePosition - 2) * 2 + 1;
    } else if (session === 'long-break') {
        currentStepIndex = (N - 1) * 2 + 1;
    }

    const getDotClasses = (i: number) => {
        const state = i < currentStepIndex ? 'completed' : i === currentStepIndex ? 'active' : 'pending';
        const isFocus = i % 2 === 0;
        const isLongBreak = i === totalDots - 1;

        let colorClass, sizeClass;

        if (isFocus) {
            colorClass = state === 'pending' ? 'bg-indigo-600/30 dark:bg-indigo-500/30' : 'bg-indigo-600 dark:bg-indigo-500';
            sizeClass = 'w-4 h-2'; // Wider capsule for Focus
        } else if (isLongBreak) {
            colorClass = state === 'pending' ? 'bg-warning/30' : 'bg-warning';
            sizeClass = 'w-5 h-2'; // Even wider capsule for Long Break
        } else {
            colorClass = state === 'pending' ? 'bg-success/30' : 'bg-success';
            sizeClass = 'size-2'; // Small circle for Short Break
        }

        return cn(
            "rounded-full transition-all duration-300",
            colorClass,
            sizeClass,
            state === 'active' && "scale-110 brightness-110 shadow-sm"
        );
    }

    const getDotTitle = (i: number) => {
        if (i % 2 === 0) return `Focus ${Math.floor(i / 2) + 1}`;
        if (i === totalDots - 1) return 'Long Break';
        return `Short Break ${Math.floor(i / 2) + 1}`;
    }

    return (
        <div className="flex gap-1.5 mt-2 items-center">
            {Array.from({ length: totalDots }).map((_, i) => (
                <div
                    key={i}
                    className={getDotClasses(i)}
                    title={getDotTitle(i)}
                />
            ))}
        </div>
    )
}