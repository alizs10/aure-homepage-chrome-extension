import { useEffect } from 'react';
import { startPomodoroRefresh, stopPomodoroRefresh, usePomodoroStore } from '../store';

export function usePomodoro() {
    const store = usePomodoroStore();

    const progress = store.duration > 0 ? ((store.duration - store.remaining) / store.duration) * 100 : 0;

    useEffect(() => {
        if (!store.initialized) {
            store.initialize();
        }
    }, [store, store.initialized, store.initialize]);

    useEffect(() => {
        if (store.status === 'running' || store.status === 'overtime') {
            startPomodoroRefresh();
        } else {
            stopPomodoroRefresh();
        }
        return () => stopPomodoroRefresh();
    }, [store.status]);

    const formatTime = (ms: number) => {
        // 🌟 Handle overtime (negative ms)
        const isOvertime = ms < 0;
        const absMs = Math.abs(ms);

        const totalSeconds = Math.ceil(absMs / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        let timeStr: string;
        if (hours > 0) {
            timeStr = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        } else {
            timeStr = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }

        // 🌟 Prefix with "+" for overtime
        return isOvertime ? `+${timeStr}` : timeStr;
    };

    const formatDuration = (ms: number) => {
        const hours = Math.floor(ms / (1000 * 60 * 60));
        const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
        if (hours > 0) return `${hours}h ${minutes}m`;
        return `${minutes}m`;
    };

    return {
        ...store,
        progress,
        formattedTime: formatTime(store.remaining),
        formatDuration,
        longBreakInterval: store.settings.longBreakInterval,
    };
}