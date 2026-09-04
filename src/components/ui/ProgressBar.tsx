import { cn } from "@/lib/util";
import { BetterTypography } from "../common/BetterTypography";

interface ProgressBarProps {
    value: number; // 0 to 100
    fillClassName?: string;
    showThumb?: boolean;
}

export default function ProgressBar({
    value,
    fillClassName = "bg-primary/40",
    showThumb = true,
}: ProgressBarProps) {
    const percent = Math.max(0, Math.min(100, value));

    return (
        <div className="relative w-full h-5 flex items-center">
            {/* Track */}
            <div className="absolute inset-x-0 h-4 rounded-3xl liquid-glass overflow-hidden">
                {/* Fill */}
                <div
                    className={cn(
                        "absolute inset-y-0 left-0 rounded-full transition-all duration-1000 ease-linear",
                        fillClassName
                    )}
                    style={{ width: `${percent}%` }}
                />
            </div>

            {/* Thumb */}
            {showThumb && (
                <div
                    className="absolute top-1/2 -translate-y-1/2 pointer-events-none z-10 transition-all duration-1000 ease-linear"
                    style={{
                        left: `clamp(22px, ${percent}%, calc(100% - 22px))`,
                    }}
                >
                    <div className="h-8 w-11 rounded-full liquid-glass flex-center shadow-lg -translate-x-1/2">
                        <BetterTypography
                            variant="12"
                            weight="medium"
                            className="text-foreground tabular-nums"
                        >
                            {Math.round(percent)}%
                        </BetterTypography>
                    </div>
                </div>
            )}
        </div>
    );
}