import { useEffect, useState } from 'react';
import { format } from 'date-fns';

export function useCurrentDateString() {
    const [todayStr, setTodayStr] = useState(() => format(new Date(), "yyyy-MM-dd"));

    useEffect(() => {
        let timeoutId: ReturnType<typeof setTimeout>;

        const scheduleMidnightUpdate = () => {
            const now = new Date();

            // Create a date object for tomorrow at exactly 00:00:00.000
            const tomorrow = new Date(now);
            tomorrow.setDate(tomorrow.getDate() + 1);
            tomorrow.setHours(0, 0, 0, 0);

            // Calculate exact milliseconds until midnight
            const msUntilMidnight = tomorrow.getTime() - now.getTime();

            // Add a tiny 100ms buffer to guarantee we've crossed the midnight boundary
            timeoutId = setTimeout(() => {
                const newDateStr = format(new Date(), "yyyy-MM-dd");
                setTodayStr(newDateStr);

                // Schedule the next day's update recursively
                scheduleMidnightUpdate();
            }, msUntilMidnight + 100);
        };

        const handleVisibilityChange = () => {
            if (document.visibilityState === "visible") {
                // 1. Force an immediate check when the user returns to the tab
                const current = format(new Date(), "yyyy-MM-dd");
                setTodayStr(prev => (prev !== current ? current : prev));

                // 2. Reset the timer in case it was throttled/delayed by the browser 
                // while the tab was in the background or the computer was asleep
                clearTimeout(timeoutId);
                scheduleMidnightUpdate();
            }
        };

        // Start the initial timer
        scheduleMidnightUpdate();

        // Listen for the user returning to the tab
        document.addEventListener("visibilitychange", handleVisibilityChange);

        return () => {
            clearTimeout(timeoutId);
            document.removeEventListener("visibilitychange", handleVisibilityChange);
        };
    }, []);

    return todayStr;
}