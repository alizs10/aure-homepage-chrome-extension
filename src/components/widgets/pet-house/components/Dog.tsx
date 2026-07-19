import type { DogColor } from "../types";

type DogProps = {
    age: number;
    color: DogColor;
    isDead: boolean
};

export default function Dog({ age, color, isDead }: DogProps) {
    // Grow smoothly from age 0 to 15
    const maxAge = 15;
    const u = 2 + (Math.min(age, maxAge) / maxAge) * 2;

    const colorClass = {
        black: "bg-black",
        white: "bg-white",
        brown: "bg-amber-900",
        golden: "bg-warning",
        gray: "bg-gray-500",
    }[color];

    return (
        <div
            className="relative"
            style={{
                width: `${u * 13}px`,
                height: `${u * 8}px`,
                opacity: isDead ? 0.2 : 1
            }}
        >
            {/* Body */}
            <div
                className={`absolute ${colorClass} rounded-sm`}
                style={{
                    left: u * 3,
                    bottom: u,
                    width: u * 9,
                    height: u * 4,
                }}
            />

            {/* Head */}
            <div
                className={`absolute ${colorClass} rounded-sm`}
                style={{
                    left: u,
                    bottom: u * 3,
                    width: u * 3,
                    height: u * 3,
                }}
            />

            {/* Snout */}
            <div
                className={`absolute ${colorClass} rounded-sm`}
                style={{
                    left: 0,
                    bottom: u * 3.5,
                    width: u * 1.5,
                    height: u * 1.5,
                }}
            />

            {/* Ear */}
            <div
                className={`absolute ${colorClass} rounded-sm`}
                style={{
                    left: u * 2,
                    top: u,
                    width: u,
                    height: u * 2,
                }}
            />

            {/* Legs */}
            {[4, 7, 10].map((x) => (
                <div
                    key={x}
                    className={`absolute ${colorClass}`}
                    style={{
                        left: u * x,
                        bottom: 0,
                        width: u,
                        height: u * 2,
                    }}
                />
            ))}

            {/* Tail */}
            <div
                className={`absolute ${colorClass} rounded-sm rotate-12 origin-left`}
                style={{
                    right: 0,
                    bottom: u * 4,
                    width: u * 2.5,
                    height: u,
                }}
            />
        </div>
    );
}