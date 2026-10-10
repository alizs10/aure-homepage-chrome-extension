
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
                    x="-20%"
                    y="-20%"
                    width="140%"
                    height="140%"
                    colorInterpolationFilters="sRGB"
                >
                    {/* Smoother, broader lens distortion */}
                    <feTurbulence
                        type="fractalNoise"
                        baseFrequency="0.003 0.004"
                        numOctaves="2"
                        seed="42"
                        result="noise"
                    />

                    {/* Softer distortion for a polished glass effect */}
                    <feGaussianBlur
                        in="noise"
                        stdDeviation="100"
                        result="blurredNoise"
                    />

                    {/* More restrained refraction */}
                    <feDisplacementMap
                        in="SourceGraphic"
                        in2="blurredNoise"
                        scale="20"
                        xChannelSelector="R"
                        yChannelSelector="G"
                    />
                </filter>
            </defs>
        </svg>
    );
}