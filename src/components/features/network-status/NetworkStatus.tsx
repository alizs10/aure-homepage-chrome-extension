import { BetterTypography } from "@/components/common/BetterTypography";
import { useEffect, useState, useCallback, useRef } from "react";

// OPTION 1: Your own backend endpoint (Highly Recommended)
// const HEALTH_CHECK_URL = "/api/health"; 

// OPTION 2: A reliable, CORS-enabled public endpoint (Fallback if no backend)
const HEALTH_CHECK_URL = "https://www.gstatic.com/generate_204";

// Timeout in milliseconds (5 seconds is plenty for a simple health check)
const FETCH_TIMEOUT_MS = 5000;

export default function NetworkStatus() {
    const [isOnline, setIsOnline] = useState(navigator.onLine);
    const [isChecking, setIsChecking] = useState(false);

    const isFetchingRef = useRef(false);

    const checkConnection = useCallback(async () => {
        if (isFetchingRef.current) return;

        if (!navigator.onLine) {
            setIsOnline(false);
            setIsChecking(false);
            return;
        }

        isFetchingRef.current = true;
        setIsChecking(true);

        // 1. Create an AbortController to handle the timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

        try {
            const response = await fetch(`${HEALTH_CHECK_URL}?t=${Date.now()}`, {
                method: 'GET',
                cache: 'no-store',
                // 2. Pass the controller's signal to the fetch request
                signal: controller.signal,
            });
            setIsOnline(response.ok);
        } finally {
            // 3. ALWAYS clear the timeout to prevent memory leaks 
            // and ensure the controller doesn't abort future requests
            clearTimeout(timeoutId);

            isFetchingRef.current = false;
            setIsChecking(false);
        }
    }, []);

    useEffect(() => {
        const handleOnline = () => {
            isFetchingRef.current = false;
            checkConnection();
        };

        const handleOffline = () => {
            isFetchingRef.current = false;
            setIsChecking(false);
            setIsOnline(false);
        };

        window.addEventListener("online", handleOnline);
        window.addEventListener("offline", handleOffline);

        const initialCheckId = setTimeout(() => {
            checkConnection();
        }, 0);

        return () => {
            window.removeEventListener("online", handleOnline);
            window.removeEventListener("offline", handleOffline);
            clearTimeout(initialCheckId);
        };
    }, [checkConnection]);

    return (
        <div
            className="rounded-3xl app_shadow app_gradient app-blur flex-row-center gap-x-1.5 px-4 py-1.5 cursor-pointer select-none transition-opacity hover:opacity-80 active:opacity-70"
            onClick={checkConnection}
            title="Click to check connection"
        >
            <div
                className={`size-2 rounded-full transition-colors duration-300 ${isChecking
                    ? "bg-gray-400 animate-pulse"
                    : isOnline
                        ? "bg-success"
                        : "bg-destructive"
                    }`}
            />
            <BetterTypography variant="12-14" weight="medium">
                {isChecking ? "Checking..." : isOnline ? "Online" : "Offline"}
            </BetterTypography>
        </div>
    );
}