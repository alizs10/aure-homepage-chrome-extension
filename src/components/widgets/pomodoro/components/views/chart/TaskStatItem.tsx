import { BetterTypography } from '@/components/common/BetterTypography';

interface TaskStatItemProps {
    name: string;
    sessions: number;
    time: number;
    formatDuration: (ms: number) => string;
}

export default function TaskStatItem({ name, sessions, time, formatDuration }: TaskStatItemProps) {
    return (
        <div className="flex items-center justify-between px-3 py-1.5">
            <BetterTypography variant="sm" weight="medium" className="truncate">
                {name}
            </BetterTypography>
            <div className="flex items-center gap-2 shrink-0">
                <BetterTypography variant="xs" className="text-muted-foreground tabular-nums">
                    {sessions}x
                </BetterTypography>
                <BetterTypography variant="sm" weight="semibold" className="text-primary tabular-nums">
                    {formatDuration(time)}
                </BetterTypography>
            </div>
        </div>
    );
}