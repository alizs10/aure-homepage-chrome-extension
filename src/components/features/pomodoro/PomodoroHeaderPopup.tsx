import { BetterTypography } from '@/components/common/BetterTypography';
import Button from '@/components/ui/Button';
import ProgressBar from '@/components/ui/ProgressBar';
import { usePomodoro } from '@/components/widgets/pomodoro/hooks/usePomodoro';
import {
    PauseIcon,
    PlayIcon,
    RotateCcwIcon,
    Coffee,
    Target,
    ClockPlusIcon,
    ArrowRightIcon,
} from 'lucide-react';

interface PomodoroHeaderPopupProps {
    onGoToPomodoro: () => void;
    onClose: () => void;
}

export default function PomodoroHeaderPopup({ onGoToPomodoro, onClose }: PomodoroHeaderPopupProps) {
    const {
        session,
        status,
        formattedTime,
        progress,
        pause,
        resume,
        reset,
        includeOvertime,
        skipOvertime,
        completeEarly,
        currentTaskName,
    } = usePomodoro();

    const isOvertime = status === 'overtime';

    const getSessionLabel = () => {
        if (isOvertime) return `${session.replace('-', ' ')} Overtime`;
        return session.replace('-', ' ');
    };

    const getSessionColor = () => {
        if (isOvertime) return 'text-warning';
        switch (session) {
            case 'focus': return 'text-indigo-600 dark:text-indigo-500';
            case 'short-break': return 'text-success';
            case 'long-break': return 'text-warning';
            default: return 'text-indigo-600 dark:text-indigo-500';
        }
    };

    const getProgressFillClass = () => {
        if (isOvertime) return 'bg-warning/60';
        switch (session) {
            case 'focus': return 'bg-primary/40';
            case 'short-break': return 'bg-success/40';
            case 'long-break': return 'bg-warning/40';
            default: return 'bg-primary/40';
        }
    };

    return (
        <div className="w-[min(300px,calc(100vw-2rem))] flex flex-col rounded-3xl liquid-glass overflow-hidden">
            {/* Header Section */}
            <div className="px-4 py-3 border-b border-border/40">
                <div className="flex items-center justify-between">
                    <BetterTypography
                        variant="sm"
                        weight="semibold"
                        className={`capitalize ${getSessionColor()}`}
                    >
                        {getSessionLabel()}
                    </BetterTypography>
                    <BetterTypography
                        variant="lg"
                        weight="bold"
                        className={`tabular-nums ${getSessionColor()} ${isOvertime ? 'animate-pulse' : ''}`}
                    >
                        {formattedTime}
                    </BetterTypography>
                </div>

                {currentTaskName && (
                    <BetterTypography variant="xs" className="text-muted-foreground mt-1 truncate">
                        {currentTaskName}
                    </BetterTypography>
                )}

                <div className="mt-2">
                    <ProgressBar value={progress} fillClassName={getProgressFillClass()} />
                </div>
            </div>

            {/* Actions Section */}
            <div className="p-3 flex flex-col gap-2">
                {status === 'running' && (
                    <div className="flex gap-2">
                        <Button
                            onClick={() => { pause(); onClose(); }}
                            variant="warning"
                            size="sm"
                            className="flex-1"
                            leftIcon={<PauseIcon className="size-4" />}
                        >
                            <BetterTypography variant="xs" weight="medium">Pause</BetterTypography>
                        </Button>
                        <Button
                            onClick={() => { reset(); onClose(); }}
                            variant="ghost"
                            size="sm"
                            leftIcon={<RotateCcwIcon className="size-4" />}
                        >
                            <BetterTypography variant="xs" weight="medium">Reset</BetterTypography>
                        </Button>
                    </div>
                )}

                {status === 'paused' && (
                    <div className="flex gap-2">
                        <Button
                            onClick={() => { resume(); onClose(); }}
                            variant="primary"
                            size="sm"
                            className="flex-1"
                            leftIcon={<PlayIcon className="size-4" />}
                        >
                            <BetterTypography variant="xs" weight="medium">Resume</BetterTypography>
                        </Button>
                        <Button
                            onClick={() => { reset(); onClose(); }}
                            variant="ghost"
                            size="sm"
                            leftIcon={<RotateCcwIcon className="size-4" />}
                        >
                            <BetterTypography variant="xs" weight="medium">Reset</BetterTypography>
                        </Button>
                    </div>
                )}

                {(status === 'running' || status === 'paused') && (
                    <Button
                        onClick={() => { completeEarly(); onClose(); }}
                        variant="ghost"
                        size="sm"
                        className="w-full"
                        leftIcon={session === 'focus' ? <Coffee className="size-4" /> : <Target className="size-4" />}
                    >
                        <BetterTypography variant="xs" weight="medium">
                            {session === 'focus' ? 'Take a break' : 'Back to work'}
                        </BetterTypography>
                    </Button>
                )}

                {isOvertime && (
                    <div className="flex gap-2">
                        <Button
                            onClick={() => { includeOvertime(); onClose(); }}
                            variant="primary"
                            size="sm"
                            className="flex-1"
                            leftIcon={<ClockPlusIcon className="size-4" />}
                        >
                            <BetterTypography variant="xs" weight="medium">
                                Add {formattedTime}
                            </BetterTypography>
                        </Button>
                        <Button
                            onClick={() => { skipOvertime(); onClose(); }}
                            variant="ghost"
                            size="sm"
                            leftIcon={session === 'focus' ? <Coffee className="size-4" /> : <Target className="size-4" />}
                        >
                            <BetterTypography variant="xs" weight="medium">
                                {session === 'focus' ? 'Break' : 'Focus'}
                            </BetterTypography>
                        </Button>
                    </div>
                )}

                {/* Navigation */}
                <div className="border-t border-border/30 pt-2 mt-1">
                    <Button
                        onClick={onGoToPomodoro}
                        variant="ghost"
                        size="sm"
                        className="w-full justify-between"
                    >
                        <BetterTypography variant="xs" weight="medium">
                            Go to Pomodoro
                        </BetterTypography>
                        <ArrowRightIcon className="size-4 text-muted-foreground" />
                    </Button>
                </div>
            </div>
        </div>
    );
}