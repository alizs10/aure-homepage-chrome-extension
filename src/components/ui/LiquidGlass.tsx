
export default function LiquidGlass() {
    return (
        <svg
            width="0"
            height="0"
            aria-hidden="true"
            className="absolute pointer-events-none"
        >
            <defs>
                <filter
                    id="liquid-glass"
                    x="0%"
                    y="0%"
                    width="100%"
                    height="100%"
                    colorInterpolationFilters="sRGB"
                >
                    {/* Low baseFrequency + 1 octave produces smooth, broad lens waves directly without expensive blur */}
                    <feTurbulence
                        type="fractalNoise"
                        baseFrequency="0.0015 0.002"
                        numOctaves="1"
                        seed="42"
                        result="noise"
                    />

                    {/* Restrained refraction directly using the smooth noise */}
                    <feDisplacementMap
                        in="SourceGraphic"
                        in2="noise"
                        scale="18"
                        xChannelSelector="R"
                        yChannelSelector="G"
                    />
                </filter>
            </defs>
        </svg>
    );
}