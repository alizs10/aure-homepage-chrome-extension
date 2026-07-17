import { HistoryIcon, PauseIcon, PlayIcon } from 'lucide-react';
import { useEffect } from 'react';
import { useFocusTimerStore } from './store';
import { BetterTypography } from '@/components/common/BetterTypography';
import Button from '@/components/ui/Button';

export default function Focus() {
    const { isRunning, isStarted, elapsed, initialize, start, stop, reset } = useFocusTimerStore();

    // Load from storage on mount
    useEffect(() => {
        initialize();
    }, [initialize]);

    // Update elapsed time every second while running
    useEffect(() => {
        if (!isRunning) return;

        const id = setInterval(() => {
            useFocusTimerStore.setState(prev => {
                if (!prev.isRunning || !prev.startedAt) return prev;
                const now = Date.now();
                return {
                    ...prev,
                    elapsed: prev.elapsed + (now - prev.startedAt),
                    startedAt: now, // Reset to prevent drift
                };
            });
        }, 1000);

        return () => clearInterval(id);
    }, [isRunning]);

    const totalSeconds = Math.floor(elapsed / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const formattedTime = [
        hours.toString().padStart(2, '0'),
        minutes.toString().padStart(2, '0'),
        seconds.toString().padStart(2, '0'),
    ].join(':');

    return (
        <div className="flex-row-center gap-x-0.5 sm:gap-x-1 h-full">
            <Button
                variant={isRunning ? 'destructive' : 'success'}
                size="lg"
                className="h-full px-3 sm:px-4 md:px-6 lg:px-8"
                onClick={isRunning ? stop : start}
            >
                {isRunning ? (
                    <PauseIcon className="size-4 md:size-5 lg:size-6 text-destructive" />
                ) : (
                    <PlayIcon className="size-4 md:size-5 lg:size-6" />
                )}

                <BetterTypography
                    className={`text-nowrap ${isStarted ? 'w-14 md:w-20 lg:w-32 text-start' : 'w-fit'}`}
                    variant="12-12-20-24" weight='semibold' as="h3"
                // variant="h2"
                >
                    {isStarted ? formattedTime : 'Focus'}
                </BetterTypography>
            </Button>

            {isStarted && (
                <Button
                    variant="warning"
                    size="icon"
                    className="h-full"
                    onClick={reset}
                >
                    <HistoryIcon className="size-4 md:size-5 lg:size-6" />
                </Button>
            )}
        </div>
    );
}