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
                    {/* 🌟 Lower frequency = smoother, wider lens distortion */}
                    <feTurbulence
                        type="fractalNoise"
                        baseFrequency="0.006 0.009"
                        numOctaves="2"
                        seed="42"
                        result="noise"
                    />

                    {/* 🌟 Higher blur = softer, more polished glass refraction */}
                    <feGaussianBlur
                        in="noise"
                        stdDeviation="2.5"
                        result="blurredNoise"
                    />

                    {/* 🌟 Scale 28 gives a physical bend without looking like water */}
                    <feDisplacementMap
                        in="SourceGraphic"
                        in2="blurredNoise"
                        scale="28"
                        xChannelSelector="R"
                        yChannelSelector="G"
                    />
                </filter>
            </defs>
        </svg>
    );
}