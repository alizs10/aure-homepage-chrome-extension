import { Typography } from "@/components/common/Typography";
import { useEffect, useState } from "react";

export default function NetworkStatus() {
    const [isOnline, setIsOnline] = useState(navigator.onLine);

    useEffect(() => {
        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);

        window.addEventListener("online", handleOnline);
        window.addEventListener("offline", handleOffline);

        return () => {
            window.removeEventListener("online", handleOnline);
            window.removeEventListener("offline", handleOffline);
        };
    }, []);

    // return (
    //     <div
    //         className={`size-2 rounded-full ${isOnline ? "bg-success" : "bg-destructive"
    //             }`}
    //     />
    // )

    return (
        <div className="app_container app_gradient app-blur flex-row-center gap-x-1.5 px-4 py-1.5">
            <div
                className={`size-2 rounded-full ${isOnline ? "bg-success" : "bg-destructive"
                    }`}
            />

            <Typography variant="body-sm" weight="medium">
                {isOnline ? "Online" : "Offline"}
            </Typography>
        </div>
    );
}