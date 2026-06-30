import { HistoryIcon, PauseIcon, PlayIcon } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import Button from '../../common/Button'
import { Typography } from '../../common/Typography'
import { storage } from '../../../lib/storage'

const STORAGE_KEY = 'focus_timer'

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

    // Used only to force a re-render every second while running.
    const [tick, setTick] = useState(0)

    async function reset() {
        const initial: FocusTimer = {
            isRunning: false,
            isStarted: false,
            startedAt: null,
            elapsed: 0,
        };

        setTimer(initial);
        await storage.remove(STORAGE_KEY);
    }

    async function toggle() {
        if (timer.isRunning) {
            // Pause
            const updated: FocusTimer = {
                ...timer,
                isRunning: false,
                startedAt: null,
                elapsed:
                    timer.elapsed +
                    (Date.now() - (timer.startedAt ?? Date.now())),
            }

            setTimer(updated)
            await storage.set(STORAGE_KEY, updated)
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
        }
    }

    // Load from storage
    useEffect(() => {
        async function load() {
            const saved = await storage.get<FocusTimer>(STORAGE_KEY)

            if (saved) {
                setTimer(saved)
            }
        }

        load()
    }, [])

    // Update UI every second while running.
    useEffect(() => {
        if (!timer.isRunning) return

        const id = setInterval(() => {
            setTick(t => t + 1)
        }, 1000)

        return () => clearInterval(id)
    }, [timer.isRunning])

    const totalMs = useMemo(() => {
        return (
            timer.elapsed +
            (timer.isRunning && timer.startedAt
                ? Date.now() - timer.startedAt
                : 0)
        )
    }, [timer, timer.isRunning, tick])

    const totalSeconds = Math.floor(totalMs / 1000)

    const hours = Math.floor(totalSeconds / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)
    const seconds = totalSeconds % 60

    const formattedTime = [
        hours.toString().padStart(2, '0'),
        minutes.toString().padStart(2, '0'),
        seconds.toString().padStart(2, '0'),
    ].join(':')

    return (
        <div className="flex-row-center gap-x-2 h-full">




            <Button
                variant={timer.isRunning ? 'destructive' : 'success'}
                size="lg"
                className="h-full"
                onClick={toggle}
            >
                {timer.isRunning ? (
                    <PauseIcon className="size-8 text-destructive" />
                ) : (
                    <PlayIcon className="size-8" />
                )}

                <Typography
                    className={timer.isStarted ? 'w-32 text-start' : ''}
                    variant="h2"
                >
                    {timer.isStarted ? formattedTime : 'Focus'}
                </Typography>
            </Button>

            {timer.isStarted && (
                <Button
                    variant={"warning"}
                    size="lg"
                    className="h-full"
                    onClick={reset}
                >

                    <HistoryIcon className="size-8" />


                </Button>
            )}
        </div>
    )
}