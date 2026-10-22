import { ClockPlusIcon, RefreshCwIcon, RotateCcwIcon, Coffee, Target } from 'lucide-react';
import ConfirmDialog from '@/components/ui/Dialog';
import { usePomodoro } from '../hooks/usePomodoro';
import type { PomodoroConfirmAction } from '../types';

export interface PomodoroConfirmDialogProps {
    action: PomodoroConfirmAction | null;
    onClose: () => void;
    onConfirm: () => void;
}

export default function PomodoroConfirmDialog({
    action,
    onClose,
    onConfirm,
}: PomodoroConfirmDialogProps) {
    const { session, formattedTime } = usePomodoro();

    const getConfirmDialogProps = () => {
        switch (action) {
            case 'reset-cycle':
                return {
                    title: 'Reset Cycle?',
                    description: 'Are you sure you want to reset the current cycle? Progress and stats for this cycle will be lost.',
                    confirmText: 'Reset Cycle',
                    confirmVariant: 'destructive' as const,
                    confirmIcon: <RefreshCwIcon className="size-4" />,
                };
            case 'reset-session':
                return {
                    title: 'Reset Session?',
                    description: 'Are you sure you want to reset the current session? Current timer progress will be lost.',
                    confirmText: 'Reset Session',
                    confirmVariant: 'destructive' as const,
                    confirmIcon: <RotateCcwIcon className="size-4" />,
                };
            case 'complete-early':
                return {
                    title: session === 'focus' ? 'Take a break early?' : 'End break early?',
                    description: session === 'focus'
                        ? 'Are you sure you want to end this focus session early and take a break?'
                        : 'Are you sure you want to end your break early and return to focus?',
                    confirmText: session === 'focus' ? 'Take Break' : 'Back to Work',
                    confirmVariant: 'primary' as const,
                    confirmIcon: session === 'focus' ? <Coffee className="size-4" /> : <Target className="size-4" />,
                };
            case 'include-overtime':
                return {
                    title: 'Add Overtime?',
                    description: session === 'focus'
                        ? `Are you sure you want to add the overtime (${formattedTime}) to your session and start your break?`
                        : `Are you sure you want to add the overtime (${formattedTime}) to your break and return to focus?`,
                    confirmText: 'Add Time',
                    confirmVariant: 'primary' as const,
                    confirmIcon: <ClockPlusIcon className="size-4" />,
                };
            case 'skip-overtime':
                return {
                    title: 'Skip Overtime?',
                    description: session === 'focus'
                        ? 'Are you sure you want to skip overtime and take a break? Overtime will not be recorded.'
                        : 'Are you sure you want to skip overtime and return to focus? Overtime will not be recorded.',
                    confirmText: session === 'focus' ? 'Take Break' : 'Back to Work',
                    confirmVariant: 'destructive' as const,
                    confirmIcon: session === 'focus' ? <Coffee className="size-4" /> : <Target className="size-4" />,
                };
            default:
                return {
                    title: '',
                    description: '',
                    confirmText: 'Confirm',
                    confirmVariant: 'primary' as const,
                    confirmIcon: undefined,
                };
        }
    };

    const confirmProps = getConfirmDialogProps();

    return (
        <ConfirmDialog
            open={action !== null}
            onClose={onClose}
            title={confirmProps.title}
            description={confirmProps.description}
            confirmText={confirmProps.confirmText}
            cancelText="Cancel"
            confirmVariant={confirmProps.confirmVariant}
            cancelVariant="ghost"
            confirmIcon={confirmProps.confirmIcon}
            onCancel={onClose}
            onConfirm={onConfirm}
        />
    );
}
