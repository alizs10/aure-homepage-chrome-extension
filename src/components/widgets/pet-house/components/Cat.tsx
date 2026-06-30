type CatProps = {
    age: number;
    color: "white" | "black" | "orange"
};

export default function Cat({ age, color }: CatProps) {
    // Base unit (px)
    const u = Math.min(4, 2 + age * 0.2);
    const colorClass = color === 'black' ? 'bg-black' : color === 'white' ? 'bg-white' : 'bg-warning'

    return (
        <div
            className="relative"
            style={{
                width: `${u * 12}px`,
                height: `${u * 8}px`,
            }}
        >
            {/* Body */}
            <div
                className={`absolute ${colorClass} rounded-sm`}
                style={{
                    left: u * 3,
                    bottom: u,
                    width: u * 8,
                    height: u * 4,
                }}
            />

            {/* Head */}
            <div
                className={`absolute ${colorClass} rounded-sm`}
                style={{
                    left: 0,
                    bottom: u * 3,
                    width: u * 4,
                    height: u * 3,
                }}
            />

            {/* Ears */}
            <div
                className={`absolute ${colorClass} [clip-path:polygon(50%_0%,0%_100%,100%_100%)]`}
                style={{
                    left: 0,
                    top: u,
                    width: u * 2,
                    height: u * 2,
                }}
            />
            <div
                className={`absolute ${colorClass} [clip-path:polygon(50%_0%,0%_100%,100%_100%)]`}
                style={{
                    left: u * 2,
                    top: u,
                    width: u * 2,
                    height: u * 2,
                }}
            />

            {/* Legs */}
            {[4, 7, 9].map((x) => (
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
                className={`absolute ${colorClass} rounded-full -rotate-45 origin-left`}
                style={{
                    right: 0,
                    bottom: u * 4,
                    width: u * 4,
                    height: u,
                }}
            />
        </div>
    );
}