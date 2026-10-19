import { ClockPlusIcon, PauseIcon, PlayIcon, RefreshCwIcon, RotateCcwIcon, Coffee, Target } from 'lucide-react'
import { useState } from 'react'

import { BetterTypography } from '@/components/common/BetterTypography'
import Button from '@/components/ui/Button'
import ConfirmDialog from '@/components/ui/Dialog'
import ProgressBar from '@/components/ui/ProgressBar'
import { usePomodoro } from '../../hooks/usePomodoro'
import CycleIndicator from '../CycleIndicator'
import TaskSelectorModal from '../TaskSelectorModal'

type ConfirmActionType =
    | 'reset-cycle'
    | 'reset-session'
    | 'complete-early'
    | 'include-overtime'
    | 'skip-overtime'

export default function TimerView() {
    const {
        session, status, formattedTime, progress,
        cyclePosition, longBreakInterval,
        start, pause, resume, reset, resetCycle,
        includeOvertime, skipOvertime, completeEarly,
        currentTaskId, tasks
    } = usePomodoro()

    const [showTaskSelector, setShowTaskSelector] = useState(false)
    const [confirmAction, setConfirmAction] = useState<ConfirmActionType | null>(null)
    const currentTask = tasks.find(t => t.id === currentTaskId)
    const isInMiddleOfCycle = !(session === 'focus' && cyclePosition === 1);
    const isOvertime = status === 'overtime';

    const getSessionColor = () => {
        if (isOvertime) return 'text-warning';
        switch (session) {
            case 'focus': return 'text-indigo-600 dark:text-indigo-500'
            case 'short-break': return 'text-success'
            case 'long-break': return 'text-warning'
            default: return 'text-indigo-600 dark:text-indigo-500'
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

    const handleConfirm = () => {
        switch (confirmAction) {
            case 'reset-cycle':
                resetCycle()
                break
            case 'reset-session':
                reset()
                break
            case 'complete-early':
                completeEarly()
                break
            case 'include-overtime':
                includeOvertime()
                break
            case 'skip-overtime':
                skipOvertime()
                break
        }
        setConfirmAction(null)
    }

    const getConfirmDialogProps = () => {
        switch (confirmAction) {
            case 'reset-cycle':
                return {
                    title: 'Reset Cycle?',
                    description: 'Are you sure you want to reset the current cycle? Progress and stats for this cycle will be lost.',
                    confirmText: 'Reset Cycle',
                    confirmVariant: 'destructive' as const,
                    confirmIcon: <RefreshCwIcon className="size-4" />,
                }
            case 'reset-session':
                return {
                    title: 'Reset Session?',
                    description: 'Are you sure you want to reset the current session? Current timer progress will be lost.',
                    confirmText: 'Reset Session',
                    confirmVariant: 'destructive' as const,
                    confirmIcon: <RotateCcwIcon className="size-4" />,
                }
            case 'complete-early':
                return {
                    title: session === 'focus' ? 'Take a break early?' : 'End break early?',
                    description: session === 'focus'
                        ? 'Are you sure you want to end this focus session early and take a break?'
                        : 'Are you sure you want to end your break early and return to focus?',
                    confirmText: session === 'focus' ? 'Take Break' : 'Back to Work',
                    confirmVariant: 'primary' as const,
                    confirmIcon: session === 'focus' ? <Coffee className="size-4" /> : <Target className="size-4" />,
                }
            case 'include-overtime':
                return {
                    title: 'Add Overtime?',
                    description: session === 'focus'
                        ? `Are you sure you want to add the overtime (${formattedTime}) to your session and start your break?`
                        : `Are you sure you want to add the overtime (${formattedTime}) to your break and return to focus?`,
                    confirmText: 'Add Time',
                    confirmVariant: 'primary' as const,
                    confirmIcon: <ClockPlusIcon className="size-4" />,
                }
            case 'skip-overtime':
                return {
                    title: 'Skip Overtime?',
                    description: session === 'focus'
                        ? 'Are you sure you want to skip overtime and take a break? Overtime will not be recorded.'
                        : 'Are you sure you want to skip overtime and return to focus? Overtime will not be recorded.',
                    confirmText: session === 'focus' ? 'Take Break' : 'Back to Work',
                    confirmVariant: 'destructive' as const,
                    confirmIcon: session === 'focus' ? <Coffee className="size-4" /> : <Target className="size-4" />,
                }
            default:
                return {
                    title: '',
                    description: '',
                    confirmText: 'Confirm',
                    confirmVariant: 'primary' as const,
                    confirmIcon: undefined,
                }
        }
    }

    const confirmProps = getConfirmDialogProps()

    return (
        <>
            <div className="flex-1 flex flex-col items-center justify-center gap-0">
                <BetterTypography className={`capitalize text-nowrap ${getSessionColor()}`} variant="14-16-20" weight="semibold" as="h3">
                    {/* ✅ Dynamically shows "Focus Overtime", "Short Break Overtime", etc. */}
                    {isOvertime ? `${session.replace('-', ' ')} Overtime` : session.replace('-', ' ')}
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
                    {/* {true && ( */}
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
                                    onClick={() => setConfirmAction('reset-cycle')}
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

                    {/* {true && ( */}
                    {status === 'running' && (
                        <>
                            <Button onClick={pause} variant="warning" size="sm" className="flex-1" leftIcon={<PauseIcon className="size-4" />}>
                                <BetterTypography variant='xs' weight='medium'>
                                    Pause
                                </BetterTypography>
                            </Button>
                            <Button
                                onClick={() => setConfirmAction('complete-early')}
                                variant="ghost"
                                size="sm"
                                leftIcon={session === 'focus' ? <Coffee className="size-4" /> : <Target className="size-4" />}
                            >
                                <BetterTypography className='text-nowrap' variant='xs' weight='medium'>
                                    {session === 'focus' ? 'Take a break' : 'Back to work'}
                                </BetterTypography>
                            </Button>
                            <Button className='h-full' onClick={() => setConfirmAction('reset-session')} variant="ghost" size="icon-sm" title="Reset current session">
                                <RotateCcwIcon className="size-4" />
                            </Button>
                        </>
                    )}

                    {/* {true && ( */}
                    {status === 'paused' && (
                        <>
                            <Button onClick={resume} variant="primary" size="sm" className="flex-1" leftIcon={<PlayIcon className="size-4" />}>
                                <BetterTypography variant='xs' weight='medium'>
                                    Resume
                                </BetterTypography>
                            </Button>
                            <Button
                                onClick={() => setConfirmAction('complete-early')}
                                variant="ghost"
                                size="sm"
                                leftIcon={session === 'focus' ? <Coffee className="size-4" /> : <Target className="size-4" />}
                            >
                                <BetterTypography className='text-nowrap' variant='xs' weight='medium'>
                                    {session === 'focus' ? 'Take a break' : 'Back to work'}
                                </BetterTypography>
                            </Button>
                            <Button className='h-full' onClick={() => setConfirmAction('reset-session')} variant="ghost" size="icon-sm" title="Reset current session">
                                <RotateCcwIcon className="size-4" />
                            </Button>
                        </>
                    )}

                    {/* {true && ( */}
                    {isOvertime && (
                        <>
                            <Button
                                onClick={() => setConfirmAction('include-overtime')}
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
                                onClick={() => setConfirmAction('skip-overtime')}
                                variant="ghost"
                                size="sm"
                                leftIcon={<Coffee className="size-4" />}
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

            <ConfirmDialog
                open={confirmAction !== null}
                onClose={() => setConfirmAction(null)}
                title={confirmProps.title}
                description={confirmProps.description}
                confirmText={confirmProps.confirmText}
                cancelText="Cancel"
                confirmVariant={confirmProps.confirmVariant}
                cancelVariant="ghost"
                confirmIcon={confirmProps.confirmIcon}
                onCancel={() => setConfirmAction(null)}
                onConfirm={handleConfirm}
            />
        </>
    )
}