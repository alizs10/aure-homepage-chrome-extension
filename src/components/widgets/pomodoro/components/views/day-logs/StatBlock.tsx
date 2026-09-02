import { BetterTypography } from '@/components/common/BetterTypography';
import { cn } from '@/lib/util';

interface StatBlockProps {
    label: string;
    count: number;
    duration: number;
    color: string;
    formatDuration: (ms: number) => string;
}

export default function StatBlock({ label, count, duration, color, formatDuration }: StatBlockProps) {
    return (
        <div className="flex-1 flex flex-col gap-1 p-3 rounded-3xl app_shadow app_gradient app-blur">
            <BetterTypography variant="xs" weight="medium" className={cn(color, "uppercase tracking-wide")}>
                {label}
            </BetterTypography>
            <BetterTypography variant="sm" weight="semibold" className="text-foreground tabular-nums">
                {formatDuration(duration)}
            </BetterTypography>
            <BetterTypography variant="xxs" className="text-muted-foreground tabular-nums">
                {count} session{count !== 1 ? 's' : ''}
            </BetterTypography>
        </div>
    );
}