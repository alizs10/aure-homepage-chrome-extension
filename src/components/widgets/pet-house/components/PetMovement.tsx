import { type ReactNode, useEffect, useRef, useState } from "react";

export type PetType = "cat" | "dog";

type Props = {
    children: ReactNode;
    type: PetType;
};

export default function PetMovement({ children, type }: Props) {
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const [state, setState] = useState({
        x: 70,
        facingLeft: false,
        duration: 6,
    });

    useEffect(() => {
        const scheduleNextAction = () => {
            const isCat = type === "cat";

            const napChance = isCat ? 0.25 : 0.1;
            const turnChance = isCat ? 0.2 : 0.1;

            const roll = Math.random();

            // Sleep
            if (roll < napChance) {
                timeoutRef.current = setTimeout(
                    scheduleNextAction,
                    4000 + Math.random() * 6000
                );
                return;
            }

            // Just turn around
            if (roll < napChance + turnChance) {
                setState((prev) => ({
                    ...prev,
                    facingLeft: !prev.facingLeft,
                }));

                timeoutRef.current = setTimeout(
                    scheduleNextAction,
                    1000 + Math.random() * 3000
                );
                return;
            }

            const nextX = 10 + Math.random() * 80;

            setState((prev) => ({
                x: nextX,
                duration: 2 + Math.random() * (isCat ? 4 : 2),
                facingLeft: nextX < prev.x,
            }));

            timeoutRef.current = setTimeout(
                scheduleNextAction,
                3000 + Math.random() * (isCat ? 5000 : 3000)
            );
        };

        scheduleNextAction();

        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, [type]);

    return (
        <div
            className="absolute bottom-0"
            style={{
                left: `${state.x}%`,
                transform: `translateX(-50%) scaleX(${state.facingLeft ? 1 : -1})`,
                transition: `
          left ${state.duration}s ease-in-out,
          transform 250ms ease
        `,
            }}
        >
            {children}
        </div>
    );
}