import { useEffect } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { toast } from 'sonner'

import { BetterTypography } from '@/components/common/BetterTypography'
import Button from '@/components/ui/Button'
import ModalHeader from '@/components/ui/modal/ModalHeader'
import ModalWrapper from '@/components/ui/modal/ModalWrapper'
import Toggle from '@/components/ui/Toggle'
import Slider from '@/components/ui/Slider'
import { usePomodoro } from '../hooks/usePomodoro'
import { DEFAULT_POMODORO_SETTINGS } from '../types'

// 🌟 Removed autoStartNextSession from schema
const settingsSchema = z.object({
    focusDuration: z.number().min(15, 'Min 15 min').max(35, 'Max 35 min'),
    shortBreakDuration: z.number().min(1, 'Min 1 min').max(15, 'Max 15 min'),
    longBreakDuration: z.number().min(10, 'Min 10 min').max(35, 'Max 35 min'),
    longBreakInterval: z.number().min(2, 'Min 2 sessions').max(6, 'Max 6 sessions'),
    notifications: z.boolean(),
    sound: z.boolean(),
})

type SettingsFormValues = z.infer<typeof settingsSchema>

interface PomodoroSettingsPopupProps {
    open: boolean
    onClose: () => void
}

export default function PomodoroSettingsPopup({ open, onClose }: PomodoroSettingsPopupProps) {
    const { settings: currentPomodoroSettings, updateSettings } = usePomodoro()

    const {
        handleSubmit,
        reset,
        watch,
        setValue,
        formState: { isDirty, isSubmitting },
    } = useForm<SettingsFormValues>({
        resolver: zodResolver(settingsSchema),
        defaultValues: currentPomodoroSettings || DEFAULT_POMODORO_SETTINGS,
    })

    useEffect(() => {
        if (open && currentPomodoroSettings) {
            reset(currentPomodoroSettings)
        }
    }, [open, currentPomodoroSettings, reset])

    const onSubmit = async (data: SettingsFormValues) => {
        await updateSettings(data)
        toast.success('Pomodoro settings updated!')
        onClose()
    }

    // 🌟 Request notification permission when the toggle is turned on
    const handleNotificationsChange = async (enabled: boolean) => {
        setValue('notifications', enabled, { shouldDirty: true });
        if (enabled && typeof window !== 'undefined' && 'Notification' in window) {
            if (Notification.permission === 'default') {
                const permission = await Notification.requestPermission();
                if (permission !== 'granted') {
                    setValue('notifications', false, { shouldDirty: true });
                    toast.error('Notification permission denied');
                }
            }
        }
    };

    const focusDuration = watch('focusDuration')
    const shortBreakDuration = watch('shortBreakDuration')
    const longBreakDuration = watch('longBreakDuration')
    const longBreakInterval = watch('longBreakInterval')

    const totalMinutes =
        (focusDuration * longBreakInterval) +
        (shortBreakDuration * (longBreakInterval - 1)) +
        longBreakDuration

    const formatTotalTime = (mins: number) => {
        const hours = Math.floor(mins / 60)
        const minutes = mins % 60
        if (hours > 0) return `${hours}h ${minutes}m`
        return `${minutes}m`
    }

    return (
        <ModalWrapper open={open} onClose={onClose}>
            <div className="rounded-3xl app_shadow bg-secondary p-5 flex flex-col gap-4 w-full max-w-4/5 sm:max-w-md max-h-[80vh] overflow-y-scroll scrollbar-none">
                <ModalHeader title="Pomodoro Settings" onClose={onClose} />

                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">

                    {/* Durations Section */}
                    <div className="flex flex-col gap-y-3">
                        <BetterTypography variant="sm" weight="medium" className="text-muted-foreground">
                            Durations
                        </BetterTypography>

                        <div className="flex flex-col gap-4">
                            <div className="flex flex-col gap-2">
                                <div className="flex justify-between items-center">
                                    <BetterTypography variant="sm" weight="medium">Focus</BetterTypography>
                                    <BetterTypography variant="sm" weight="semibold" className="text-primary tabular-nums">
                                        {focusDuration} min
                                    </BetterTypography>
                                </div>
                                <Slider
                                    value={focusDuration}
                                    onChange={(v) => setValue('focusDuration', v, { shouldValidate: true, shouldDirty: true })}
                                    min={15}
                                    max={35}
                                    step={5}
                                />
                            </div>

                            <div className="flex flex-col gap-2">
                                <div className="flex justify-between items-center">
                                    <BetterTypography variant="sm" weight="medium">Short Break</BetterTypography>
                                    <BetterTypography variant="sm" weight="semibold" className="text-success tabular-nums">
                                        {shortBreakDuration} min
                                    </BetterTypography>
                                </div>
                                <Slider
                                    value={shortBreakDuration}
                                    onChange={(v) => setValue('shortBreakDuration', v, { shouldValidate: true, shouldDirty: true })}
                                    min={1}
                                    max={15}
                                    step={1}
                                />
                            </div>

                            <div className="flex flex-col gap-2">
                                <div className="flex justify-between items-center">
                                    <BetterTypography variant="sm" weight="medium">Long Break</BetterTypography>
                                    <BetterTypography variant="sm" weight="semibold" className="text-warning tabular-nums">
                                        {longBreakDuration} min
                                    </BetterTypography>
                                </div>
                                <Slider
                                    value={longBreakDuration}
                                    onChange={(v) => setValue('longBreakDuration', v, { shouldValidate: true, shouldDirty: true })}
                                    min={10}
                                    max={35}
                                    step={5}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Cycle Section */}
                    <div className="flex flex-col gap-y-3">
                        <BetterTypography variant="sm" weight="medium" className="text-muted-foreground">
                            Cycle
                        </BetterTypography>
                        <div className="flex flex-col gap-2">
                            <div className="flex justify-between items-center">
                                <BetterTypography variant="sm" weight="medium">Sessions before Long Break</BetterTypography>
                                <BetterTypography variant="sm" weight="semibold" className="text-foreground tabular-nums">
                                    {longBreakInterval} sessions
                                </BetterTypography>
                            </div>
                            <Slider
                                value={longBreakInterval}
                                onChange={(v) => setValue('longBreakInterval', v, { shouldValidate: true, shouldDirty: true })}
                                min={2}
                                max={6}
                                step={1}
                            />
                        </div>

                        <div className="flex items-center justify-between pt-3 mt-1 border-t border-border/30">
                            <BetterTypography variant="sm" weight="medium" className="text-muted-foreground">
                                Total Cycle Time
                            </BetterTypography>
                            <BetterTypography variant="sm" weight="semibold" className="text-foreground tabular-nums">
                                {formatTotalTime(totalMinutes)}
                            </BetterTypography>
                        </div>
                    </div>

                    {/* Behavior Section */}
                    <div className="flex flex-col gap-y-3">
                        <BetterTypography variant="sm" weight="medium" className="text-muted-foreground">
                            Behavior
                        </BetterTypography>

                        <div className="flex flex-col gap-3">
                            <Toggle
                                size="sm"
                                leftLabel={<BetterTypography variant="sm">Desktop notifications</BetterTypography>}
                                checked={watch('notifications')}
                                onCheckedChange={handleNotificationsChange}
                            />
                            <Toggle
                                size="sm"
                                leftLabel={<BetterTypography variant="sm">Completion sound</BetterTypography>}
                                checked={watch('sound')}
                                onCheckedChange={(v) => setValue('sound', v, { shouldDirty: true })}
                            />
                        </div>
                    </div>

                    <Button
                        type="submit"
                        disabled={!isDirty || isSubmitting}
                        variant="primary-active"
                        size="sm"
                        className="mt-2"
                    >
                        Save Settings
                    </Button>
                </form>
            </div>
        </ModalWrapper>
    )
}