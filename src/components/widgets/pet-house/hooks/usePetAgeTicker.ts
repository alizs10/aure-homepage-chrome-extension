import { useEffect, useState } from "react";
import { MS_PER_DAY, PET_DAYS_PER_YEAR } from "../helpers";

const PET_DAY_MS = MS_PER_DAY / PET_DAYS_PER_YEAR;

export function usePetAgeTicker(createdAt: number) {
    const [, forceUpdate] = useState(0);

    useEffect(() => {
        const update = () => forceUpdate((n) => n + 1);

        const elapsed = Date.now() - createdAt;
        const msIntoCurrentPetDay = elapsed % PET_DAY_MS;
        const initialDelay = PET_DAY_MS - msIntoCurrentPetDay;

        let intervalId: ReturnType<typeof setInterval>;

        const timeoutId = setTimeout(() => {
            update();

            intervalId = setInterval(update, PET_DAY_MS);
        }, initialDelay);

        return () => {
            clearTimeout(timeoutId);

            if (intervalId) {
                clearInterval(intervalId);
            }
        };
    }, [createdAt]);
}