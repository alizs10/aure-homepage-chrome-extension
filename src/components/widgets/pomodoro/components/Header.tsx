import { BetterTypography } from '@/components/common/BetterTypography'
import Button from '@/components/ui/Button'
import { ChartLineIcon, HistoryIcon, SettingsIcon, TimerIcon } from 'lucide-react'
import { useState } from 'react'
import { usePomodoro } from '../hooks/usePomodoro'
import type { PomodoroView } from '../types'
import PomodoroSettingsPopup from './PomodoroSettingsPopup'

export default function Header() {
    // 🌟 Added status to track if the timer is actively running/paused
    const { currentView, setView, session, cyclePosition, status } = usePomodoro()
    const [showSettings, setShowSettings] = useState(false)

    // A cycle is considered "in the middle" if we are not at the very first focus session
    const isInMiddleOfCycle = !(session === 'focus' && cyclePosition === 1);

    // 🌟 Disable settings if the timer is active OR if we are past the first focus session
    const isSettingsDisabled = status !== 'idle' || isInMiddleOfCycle;

    const tabs: { id: PomodoroView; icon: typeof TimerIcon; label: string }[] = [
        { id: 'timer', icon: TimerIcon, label: 'Timer' },
        { id: 'logs', icon: HistoryIcon, label: 'Logs' },
        { id: 'chart', icon: ChartLineIcon, label: 'Chart' },
    ]

    return (
        <>
            <div className="flex-center-between">
                <BetterTypography className='capitalize text-nowrap' variant='14-16-20' weight='semibold' as="h3">
                    Pomodoro
                </BetterTypography>

                <div className="flex-row-center gap-x-1 h-9">
                    <div className="rounded-3xl liquid-glass flex-row-center p-0.5 gap-x-0.5">
                        {tabs.map((tab) => (
                            <Button
                                key={tab.id}
                                size='icon-sm'
                                variant={currentView === tab.id ? 'primary-active' : 'ghost'}
                                onClick={() => setView(tab.id)}
                                title={tab.label}
                            >
                                <tab.icon className='size-3.5' />
                            </Button>
                        ))}
                    </div>

                    {/* 🌟 Settings Button: Disabled when timer is active or in the middle of a cycle */}
                    <Button
                        className='h-full flex-center'
                        size="icon-sm"
                        variant="ghost"
                        onClick={() => setShowSettings(true)}
                        title={isSettingsDisabled ? "Reset your cycle to change settings" : "Pomodoro settings"}
                        disabled={isSettingsDisabled}
                    >
                        <SettingsIcon className="size-4" />
                    </Button>
                </div>
            </div>

            <PomodoroSettingsPopup open={showSettings} onClose={() => setShowSettings(false)} />
        </>
    )
}