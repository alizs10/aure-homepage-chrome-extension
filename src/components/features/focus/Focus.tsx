import { STORAGE_KEYS } from '@/constants/storage_keys'
import { HistoryIcon, PauseIcon, PlayIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { storage } from '../../../lib/storage'
import Button from '../../common/Button'
import { Typography } from '../../common/Typography'

const STORAGE_KEY = STORAGE_KEYS.focus

type FocusTimer = {
    isRunning: boolean
    isStarted: boolean
    startedAt: number | null
    elapsed: number
}

export default function Focus() {
    const [timer, setTimer] = useState<FocusTimer>({
        isRunning: false,
        isStarted: false,
        startedAt: null,
        elapsed: 0,
    })

    async function reset() {
        const initial: FocusTimer = {
            isRunning: false,
            isStarted: false,
            startedAt: null,
            elapsed: 0,
        }

        setTimer(initial)
        await storage.remove(STORAGE_KEY)

        toast.info("Focus timer has been reset.")
    }

    async function toggle() {
        if (timer.isRunning) {
            // Pause
            const now = Date.now()
            const updated: FocusTimer = {
                ...timer,
                isRunning: false,
                startedAt: null,
                elapsed: timer.elapsed + (now - (timer.startedAt ?? now)),
            }

            setTimer(updated)
            await storage.set(STORAGE_KEY, updated)

            toast.info("Focus session paused.")
        } else {
            // Start / Resume
            const updated: FocusTimer = {
                ...timer,
                isRunning: true,
                isStarted: true,
                startedAt: Date.now(),
            }

            setTimer(updated)
            await storage.set(STORAGE_KEY, updated)

            toast.success(timer.isStarted ? "Focus session resumed." : "Focus session started.")
        }
    }

    // Load from storage and account for time passed while closed
    useEffect(() => {
        async function load() {
            const saved = await storage.get<FocusTimer>(STORAGE_KEY)

            if (saved) {
                if (saved.isRunning && saved.startedAt) {
                    const now = Date.now()
                    const additionalElapsed = now - saved.startedAt
                    setTimer({
                        ...saved,
                        elapsed: saved.elapsed + additionalElapsed,
                        startedAt: now,
                    })
                } else {
                    setTimer(saved)
                }
            }
        }

        load()
    }, [])

    // Update elapsed time every second while running
    useEffect(() => {
        if (!timer.isRunning) return

        const id = setInterval(() => {
            setTimer(prev => {
                if (!prev.isRunning || !prev.startedAt) return prev

                const now = Date.now()
                const newElapsed = prev.elapsed + (now - prev.startedAt)

                return {
                    ...prev,
                    elapsed: newElapsed,
                    startedAt: now, // Reset startedAt to prevent drift
                }
            })
        }, 1000)

        return () => clearInterval(id)
    }, [timer.isRunning])

    const totalSeconds = Math.floor(timer.elapsed / 1000)

    const hours = Math.floor(totalSeconds / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)
    const seconds = totalSeconds % 60

    const formattedTime = [
        hours.toString().padStart(2, '0'),
        minutes.toString().padStart(2, '0'),
        seconds.toString().padStart(2, '0'),
    ].join(':')

    return (
        <div className="flex-row-center gap-x-1 h-full">
            <Button
                variant={timer.isRunning ? 'destructive' : 'success'}
                size="lg"
                className="h-full px-4 md:px-6 lg:px-8"
                onClick={toggle}
            >
                {timer.isRunning ? (
                    <PauseIcon className="size-4 md:size-5 lg:size-6 text-destructive" />
                ) : (
                    <PlayIcon className="size-4 md:size-5 lg:size-6" />
                )}

                <Typography
                    className={`text-sm md:text-base lg:text-2xl ${timer.isStarted ? 'w-20 md:w-20 lg:w-32 text-start' : ''}`}
                    variant="h2"
                >
                    {timer.isStarted ? formattedTime : 'Focus'}
                </Typography>
            </Button>

            {timer.isStarted && (
                <Button
                    variant={"warning"}
                    size="icon"
                    className="h-full"
                    onClick={reset}
                >
                    <HistoryIcon className="size-4 md:size-5 lg:size-6" />
                </Button>
            )}
        </div>
    )
}