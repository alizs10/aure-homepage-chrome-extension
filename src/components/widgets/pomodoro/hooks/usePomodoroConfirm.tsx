import { useState, useCallback, useRef, type ReactNode } from 'react';
import { usePomodoro } from './usePomodoro';
import type { PomodoroConfirmAction } from '../types';
import PomodoroConfirmDialog from '../components/PomodoroConfirmDialog';

export interface UsePomodoroConfirmOptions {
    onConfirmed?: (action: PomodoroConfirmAction) => void;
    onCancelled?: () => void;
}

export function usePomodoroConfirm(options?: UsePomodoroConfirmOptions) {
    const [confirmAction, setConfirmAction] = useState<PomodoroConfirmAction | null>(null);
    const { reset, resetCycle, completeEarly, includeOvertime, skipOvertime } = usePomodoro();

    const onConfirmedRef = useRef(options?.onConfirmed);
    onConfirmedRef.current = options?.onConfirmed;

    const onCancelledRef = useRef(options?.onCancelled);
    onCancelledRef.current = options?.onCancelled;

    const requestConfirm = useCallback((action: PomodoroConfirmAction) => {
        setConfirmAction(action);
    }, []);

    const cancelConfirm = useCallback(() => {
        setConfirmAction(null);
        onCancelledRef.current?.();
    }, []);

    const handleConfirm = useCallback(async () => {
        const action = confirmAction;
        if (!action) return;

        setConfirmAction(null);

        switch (action) {
            case 'reset-cycle':
                await resetCycle();
                break;
            case 'reset-session':
                await reset();
                break;
            case 'complete-early':
                await completeEarly();
                break;
            case 'include-overtime':
                await includeOvertime();
                break;
            case 'skip-overtime':
                await skipOvertime();
                break;
        }

        onConfirmedRef.current?.(action);
    }, [confirmAction, resetCycle, reset, completeEarly, includeOvertime, skipOvertime]);

    const confirmDialog: ReactNode = (
        <PomodoroConfirmDialog
            action={confirmAction}
            onClose={cancelConfirm}
            onConfirm={handleConfirm}
        />
    );

    return {
        confirmAction,
        isConfirming: confirmAction !== null,
        requestConfirm,
        cancelConfirm,
        handleConfirm,
        confirmDialog,
    };
}
