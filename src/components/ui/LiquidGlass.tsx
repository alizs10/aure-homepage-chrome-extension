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
                >
                    {/* Generate organic surface noise */}
                    <feTurbulence
                        type="fractalNoise"
                        baseFrequency="0.008 0.012"
                        numOctaves="2"
                        seed="42"
                        result="noise"
                    />

                    {/* Smooth the noise */}
                    <feGaussianBlur
                        in="noise"
                        stdDeviation="2"
                        result="blurredNoise"
                    />

                    {/* Displace the backdrop */}
                    <feDisplacementMap
                        in="SourceGraphic"
                        in2="blurredNoise"
                        scale="35"
                        xChannelSelector="R"
                        yChannelSelector="G"
                    />
                </filter>
            </defs>
        </svg>
    );
}