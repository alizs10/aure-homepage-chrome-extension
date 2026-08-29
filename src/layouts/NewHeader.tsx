import { BetterTypography } from '@/components/common/BetterTypography'
import NewThemeToggle from '@/components/common/NewThemeToggle'
import NetworkStatus from '@/components/features/network-status/NetworkStatus'
import Button from '@/components/ui/Button'
import { useSettingsStore } from '@/stores'
import { HomeIcon, SettingsIcon } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import Moment from 'react-moment'
import { useLocation } from 'react-router-dom'

export default function NewHeader() {

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
        <header className="flex justify-between h-8 px-4 md:px-8 lg:px-10 app_shadow app_gradient app-blur">

            <div className="flex-row-center gap-x-4">


                {isSettingsPath && (
                    <Button
                        variant="ghost"
                        href='/'
                        size='xs'
                        className='gap-x-1'
                        leftIcon={<HomeIcon className="size-3.5" />}
                    >
                        <BetterTypography className="text-nowrap" variant="12" weight='medium' as="span">
                            Home
                        </BetterTypography>
                    </Button>
                )}

                <div className="hidden sm:flex h-full w-fit flex-center">
                    <BetterTypography className="text-nowrap" variant="12" weight='semibold' as="h2">
                        Hey, {settings?.name}
                    </BetterTypography>
                </div>


                {!isSettingsPath && (
                    <Button
                        variant="ghost"
                        href='/settings'
                        size='xs'
                        className='gap-x-1'
                        leftIcon={<SettingsIcon className="size-3.5" />}
                    >
                        <BetterTypography className="text-nowrap" variant="12" weight='medium' as="span">
                            Settings
                        </BetterTypography>
                    </Button>
                )}
            </div>

            <div className="flex-row-center gap-x-4">
                {/* {!isSettingsPath && (
                    <Focus />
                )} */}

                <NetworkStatus />


                <div className="h-full flex-center">
                    <BetterTypography variant='12' className='hidden sm:block text-nowrap' weight='medium' as="h3">
                        <Moment date={now} format="MMM D, HH:mm:ss" />
                    </BetterTypography>
                    <BetterTypography variant='12' className='sm:hidden text-nowrap' weight='medium' as="h3">
                        <Moment date={now} format="HH:mm" />
                    </BetterTypography>
                </div>



                <NewThemeToggle />
            </div>

        </header>

    )
}
