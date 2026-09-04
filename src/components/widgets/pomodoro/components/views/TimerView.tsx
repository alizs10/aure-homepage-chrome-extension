import { ClockPlusIcon, PauseIcon, PlayIcon, RefreshCwIcon, RotateCcwIcon, Coffee, Target } from 'lucide-react'
import { useState } from 'react'

import { BetterTypography } from '@/components/common/BetterTypography'
import Button from '@/components/ui/Button'
import ProgressBar from '@/components/ui/ProgressBar'
import { usePomodoro } from '../../hooks/usePomodoro'
import CycleIndicator from '../CycleIndicator'
import TaskSelectorModal from '../TaskSelectorModal'

export default function TimerView() {
    const {
        session, status, formattedTime, progress,
        cyclePosition, longBreakInterval,
        start, pause, resume, reset, resetCycle,
        includeOvertime, skipOvertime, completeEarly, // 🌟 Added
        currentTaskId, tasks
    } = usePomodoro()

    const [showTaskSelector, setShowTaskSelector] = useState(false)
    const currentTask = tasks.find(t => t.id === currentTaskId)
    const isInMiddleOfCycle = !(session === 'focus' && cyclePosition === 1);
    const isOvertime = status === 'overtime';

    const getSessionColor = () => {
        if (isOvertime) return 'text-warning';
        switch (session) {
            case 'focus': return 'text-primary'
            case 'short-break': return 'text-success'
            case 'long-break': return 'text-warning'
            default: return 'text-primary'
        }
    }

    const getProgressFillClass = () => {
        if (isOvertime) return 'bg-warning/60';
        switch (session) {
            case 'focus': return 'bg-primary/40'
            case 'short-break': return 'bg-success/40'
            case 'long-break': return 'bg-warning/40'
            default: return 'bg-primary/40'
        }
    }

    return (
        <>
            <div className="flex-1 flex flex-col items-center justify-center gap-0">
                <BetterTypography className={`capitalize text-nowrap ${getSessionColor()}`} variant="14-16-20" weight="semibold" as="h3">
                    {isOvertime ? 'Overtime' : session.replace('-', ' ')}
                </BetterTypography>

                <BetterTypography
                    variant="48-56-72-48-72"
                    weight="bold"
                    className={`tabular-nums tracking-tight leading-tight ${isOvertime ? 'text-warning animate-pulse' : ''}`}
                >
                    {formattedTime}
                </BetterTypography>

                <Button
                    variant='ghost'
                    size='xs'
                    onClick={() => setShowTaskSelector(true)}
                >
                    {currentTask ? (
                        <BetterTypography variant="xxs" weight="medium" className="text-muted-foreground">
                            Task: {currentTask.name}
                        </BetterTypography>
                    ) : (
                        <BetterTypography variant="xxs" weight="medium" className="text-muted-foreground">
                            Select Task
                        </BetterTypography>
                    )}
                </Button>

                <CycleIndicator
                    session={session}
                    cyclePosition={cyclePosition}
                    longBreakInterval={longBreakInterval}
                />

                <div className="mt-6 w-full">
                    <ProgressBar value={progress} fillClassName={getProgressFillClass()} />
                </div>
            </div>

            <div className="flex flex-col gap-3">
                <div className="flex-center gap-x-0.5">
                    {status === 'idle' && (
                        <>
                            <Button
                                onClick={start}
                                variant="primary"
                                size="sm"
                                className="flex-1"
                                leftIcon={<PlayIcon className="size-4" />}
                                disabled={!currentTaskId}
                                title={!currentTaskId ? "Select a task to start" : "Start session"}
                            >
                                <BetterTypography variant='xs' weight='medium'>
                                    {!currentTaskId ? "Select Task" : "Start"}
                                </BetterTypography>
                            </Button>
                            {isInMiddleOfCycle && !isOvertime && (
                                <Button
                                    onClick={resetCycle}
                                    variant="ghost"
                                    size="sm"
                                    className="text-xs text-muted-foreground"
                                    leftIcon={<RefreshCwIcon className="size-3.5" />}
                                >
                                    <BetterTypography variant='xs' weight='medium'>
                                        Reset Cycle
                                    </BetterTypography>
                                </Button>
                            )}
                        </>
                    )}

                    {status === 'running' && (
                        <>
                            <Button onClick={pause} variant="warning" size="sm" className="flex-1" leftIcon={<PauseIcon className="size-4" />}>
                                <BetterTypography variant='xs' weight='medium'>
                                    Pause
                                </BetterTypography>
                            </Button>
                            {/* 🌟 Complete Early Button */}
                            <Button
                                onClick={completeEarly}
                                variant="ghost"
                                size="sm"
                            >
                                <BetterTypography className='text-nowrap' variant='xs' weight='medium'>
                                    {session === 'focus' ? 'Take a break' : 'Back to work'}
                                </BetterTypography>
                            </Button>
                            <Button className='h-full' onClick={reset} variant="ghost" size="icon-sm" title="Reset current session">
                                <RotateCcwIcon className="size-4" />
                            </Button>
                        </>
                    )}

                    {status === 'paused' && (
                        <>
                            <Button onClick={resume} variant="primary" size="sm" className="flex-1" leftIcon={<PlayIcon className="size-4" />}>
                                <BetterTypography variant='xs' weight='medium'>
                                    Resume
                                </BetterTypography>
                            </Button>
                            {/* 🌟 Complete Early Button (Also available when paused) */}
                            <Button
                                onClick={completeEarly}
                                variant="ghost"
                                size="sm"
                                leftIcon={session === 'focus' ? <Coffee className="size-4" /> : <Target className="size-4" />}
                            >
                                <BetterTypography className='text-nowrap' variant='xs' weight='medium'>
                                    {session === 'focus' ? 'Take a break' : 'Back to work'}
                                </BetterTypography>
                            </Button>
                            <Button className='h-full' onClick={reset} variant="ghost" size="icon-sm" title="Reset current session">
                                <RotateCcwIcon className="size-4" />
                            </Button>
                        </>
                    )}

                    {isOvertime && (
                        <>
                            <Button
                                onClick={includeOvertime}
                                variant="primary"
                                size="sm"
                                className="flex-1"
                                leftIcon={<ClockPlusIcon className="size-4" />}
                            >
                                <BetterTypography variant='xs' weight='medium'>
                                    Add time {formattedTime}
                                </BetterTypography>
                            </Button>
                            <Button
                                onClick={skipOvertime}
                                variant="ghost"
                                size="sm"
                            >
                                <BetterTypography variant='xs' weight='medium'>

                                    {session === 'focus' ? 'Break' : 'Focus'}
                                </BetterTypography>
                            </Button>
                        </>
                    )}
                </div>
            </div>

            <TaskSelectorModal open={showTaskSelector} onClose={() => setShowTaskSelector(false)} />
        </>
    )
}