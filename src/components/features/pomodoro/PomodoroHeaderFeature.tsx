import { useMemo, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import { BetterTypography } from '@/components/common/BetterTypography';
import Button from '@/components/ui/Button';
import Popup from '@/components/ui/Popup';
import { usePomodoro } from '@/components/widgets/pomodoro/hooks/usePomodoro';
import { startPomodoroRefresh } from '@/components/widgets/pomodoro/store';
import { useSettingsStore } from '@/stores';
import { LOCAL_STORAGE_KEYS } from '@/constants/storage_keys';
import type { Settings } from '@/types';

import PomodoroHeaderPopup from './PomodoroHeaderPopup';

function getPomodoroPage(settings: Settings | null): number | null {
    const positions = settings?.widget_layout?.positions;
    if (!positions) return null;
    const pos = positions.find(p => p.widgetId === 'pomodoro');
    return pos?.page ?? null;
}

export default function PomodoroHeaderFeature() {
    const { settings } = useSettingsStore();
    const { session, status, formattedTime } = usePomodoro();
    const navigate = useNavigate();
    const location = useLocation();

    const [popupOpen, setPopupOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState<number>(() => {
        const savedPage = localStorage.getItem(LOCAL_STORAGE_KEYS.selectedPage);
        if (savedPage !== null) {
            const parsed = parseInt(savedPage, 10);
            if (!isNaN(parsed)) return parsed;
        }
        return 1;
    });

    // Listen for page changes from the Home page pagination
    useEffect(() => {
        const handlePageChange = (e: Event) => {
            const customEvent = e as CustomEvent<number>;
            setCurrentPage(customEvent.detail);
        };
        window.addEventListener('page-change', handlePageChange);
        return () => window.removeEventListener('page-change', handlePageChange);
    }, []);

    const pomodoroPage = useMemo(() => getPomodoroPage(settings), [settings]);
    const isSettingsPage = location.pathname === '/settings';

    // Only show when: pomodoro exists, timer is active, and user isn't already viewing it
    const shouldShow =
        pomodoroPage !== null &&
        status !== 'idle' &&
        (isSettingsPage || currentPage !== pomodoroPage);

    // 🌟 Bug fix: When the Pomodoro widget unmounts (page change), its cleanup stops
    // the refresh interval. Since store.status doesn't change, this component's
    // usePomodoro effect won't re-run to restart it. This effect explicitly ensures
    // the interval is running whenever we're visible and the timer is active.
    useEffect(() => {
        if (shouldShow && (status === 'running' || status === 'overtime')) {
            startPomodoroRefresh();
        }
    }, [shouldShow, status]);

    if (!shouldShow) {
        return null;
    }

    const getDotColor = () => {
        if (status === 'overtime') return 'bg-warning';
        switch (session) {
            case 'focus': return 'bg-indigo-600 dark:bg-indigo-500';
            case 'short-break': return 'bg-success';
            case 'long-break': return 'bg-warning';
            default: return 'bg-indigo-600 dark:bg-indigo-500';
        }
    };

    const getTextColor = () => {
        if (status === 'overtime') return 'text-warning';
        switch (session) {
            case 'focus': return 'text-indigo-600 dark:text-indigo-500';
            case 'short-break': return 'text-success';
            case 'long-break': return 'text-warning';
            default: return 'text-indigo-600 dark:text-indigo-500';
        }
    };

    const handleGoToPomodoro = () => {
        if (pomodoroPage) {
            localStorage.setItem(LOCAL_STORAGE_KEYS.selectedPage, pomodoroPage.toString());
            window.dispatchEvent(new CustomEvent('page-change', { detail: pomodoroPage }));
            if (location.pathname !== '/') {
                navigate('/');
            }
        }
        setPopupOpen(false);
    };

    return (
        <Popup
            open={popupOpen}
            side="bottom"
            align="center"
            sideOffset={8}
            onOpenChange={setPopupOpen}
            trigger={(props) => (
                <Button
                    {...props}
                    variant="muted"
                    size="xs"
                    className="gap-x-1.5"
                >
                    <div
                        className={`size-1.5 rounded-full transition-colors duration-300 ${getDotColor()} ${status === 'overtime' ? 'animate-pulse' : ''}`}
                    />
                    <BetterTypography
                        variant="12"
                        weight="semibold"
                        className={`tabular-nums ${getTextColor()}`}
                    >
                        {formattedTime}
                    </BetterTypography>
                </Button>
            )}
        >
            <PomodoroHeaderPopup
                onGoToPomodoro={handleGoToPomodoro}
                onClose={() => setPopupOpen(false)}
            />
        </Popup>
    );
}