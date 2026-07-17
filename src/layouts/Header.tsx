import Button from '@/components/ui/Button'
import ThemeToggle from '@/components/common/ThemeToggle'
import Focus from '@/components/features/focus/Focus'
import { useSettingsStore } from '@/stores'
import { MoveLeftIcon, SettingsIcon } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import Moment from 'react-moment'
import { useLocation } from 'react-router-dom'
import { BetterTypography } from '@/components/common/BetterTypography'

export default function Header() {

    const location = useLocation();

    const isSettingsPath = useMemo(() => {

        if (!location?.pathname) return false

        return location?.pathname === '/settings'

    }, [location])

    const { settings } = useSettingsStore();


    const [now, setNow] = useState(new Date())

    useEffect(() => {
        const interval = setInterval(() => {
            setNow(new Date())
        }, 1000)

        return () => clearInterval(interval)
    }, [])

    return (
        <header className="flex justify-between h-10 md:h-12 lg:h-14 px-4 md:px-8 lg:px-10">

            <div className="flex-row-center gap-x-2">


                {isSettingsPath && (
                    <Button
                        href='/'
                        size='icon' className="h-full">
                        <MoveLeftIcon className="size-4 md:size-5 lg:size-6" />
                    </Button>
                )}

                <div className="hidden sm:flex app_container app_gradient app-blur h-10 md:h-full px-4 md:px-6 lg:px-12 w-fit flex-center">
                    <BetterTypography className="text-nowrap" variant="12-12-20-24" weight='semibold' as="h2">
                        Hey, {settings?.name}
                    </BetterTypography>
                </div>


                {!isSettingsPath && (
                    <Button
                        href='/settings'
                        size='icon' className="h-full">
                        <SettingsIcon className="size-4 md:size-5 lg:size-6" />
                    </Button>
                )}
            </div>

            <div className="flex-row-center gap-x-0.5 sm:gap-x-1.5 md:gap-x-2">
                {!isSettingsPath && (
                    <Focus />
                )}

                <div className="h-full app_container app_gradient app-blur w-14 sm:w-32 md:w-36 lg:w-48 flex-center">
                    <BetterTypography variant='12-12-16-20' className='hidden sm:block text-nowrap' weight='medium' as="h3">
                        <Moment date={now} format="MMM D, HH:mm:ss" />
                    </BetterTypography>
                    <BetterTypography variant='12-12-16-20' className='sm:hidden text-nowrap' weight='medium' as="h3">
                        <Moment date={now} format="HH:mm" />
                    </BetterTypography>
                </div>


                <ThemeToggle />
            </div>

        </header>

    )
}
