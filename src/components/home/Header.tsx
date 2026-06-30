import { PlayIcon, SettingsIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import Moment from 'react-moment'
import type { Settings } from '../../types/settings'
import Button from '../common/Button'
import ThemeToggle from '../common/ThemeToggle'
import { Typography } from '../common/Typography'
import Focus from '../features/focus/Focus'

export default function Header({ settings }: { settings: Settings }) {

    const [now, setNow] = useState(new Date())

    useEffect(() => {
        const interval = setInterval(() => {
            setNow(new Date())
        }, 1000)

        return () => clearInterval(interval)
    }, [])

    return (
        <header className="flex justify-between">

            <div className="flex-row-center gap-x-2">

                <div className="container h-16 px-12 w-fit flex-center">
                    <Typography className="text-" variant="h1">
                        Hello, {settings.name}
                    </Typography>
                </div>


                <Button size='icon' className="h-full">
                    <SettingsIcon className="size-6" />
                </Button>
            </div>

            <div className="flex-row-center gap-x-4">

                <Focus />


                <div className="h-full container w-54 flex-center">
                    <Typography variant="h3">
                        <Moment date={now} format="MMM D, HH:mm:ss" />
                    </Typography>
                </div>


                <ThemeToggle />
            </div>

        </header>

    )
}
