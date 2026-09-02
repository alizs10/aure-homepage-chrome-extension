interface CustomSliderProps {
    value: number;
    onChange: (value: number) => void;
    min: number;
    max: number;
    step: number;
}

// ✨ Custom Slider Component
export default function Slider({ value, onChange, min, max, step }: CustomSliderProps) {
    const percent = ((value - min) / (max - min)) * 100;

    // 🌟 Dynamically calculate the exact number of intervals based on min, max, and step
    const intervals = Math.round((max - min) / step);

    return (
        <div className="relative w-full h-5 flex items-center">
            {/* Track Background & Grid */}
            <div className="absolute inset-x-0 h-4 rounded-3xl liquid-glass overflow-hidden">
                <div
                    className="absolute inset-0 grid pointer-events-none"
                    // 🌟 Apply dynamic grid columns via inline style
                    style={{ gridTemplateColumns: `repeat(${intervals}, 1fr)` }}
                >
                    {Array.from({ length: intervals }).map((_, i) => (
                        <div
                            key={i}
                            // Only add the right border if it's not the very last column
                            className={`h-full ${i < intervals - 1 ? 'border-r border-border/40 border-dashed' : ''}`}
                        />
                    ))}
                </div>

                {/* Fill */}
                <div
                    className="absolute inset-y-0 left-0 bg-primary/30 rounded-l-full"
                    style={{ width: `${percent}%` }}
                />
            </div>

            {/* Invisible Native Range Input (Handles all touch/mouse logic perfectly) */}
            <input
                type="range"
                min={min}
                max={max}
                step={step}
                value={value}
                onChange={(e) => onChange(Number(e.target.value))}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
            />

            {/* Custom Thumb */}
            <div
                className="absolute top-1/2 -translate-y-1/2 pointer-events-none z-10"
                style={{ left: `${percent}%` }}
            >
                {/* 🌟 Removed redundant 'rounded-3xl' since 'rounded-full' already creates the perfect pill shape */}
                <div className="h-8 w-10 rounded-full liquid-glass -translate-x-1/2 flex-center">
                    <div className="h-2.5 w-px bg-primary" />
                </div>
            </div>
        </div>
    );
}