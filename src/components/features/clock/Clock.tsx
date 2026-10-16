import { BetterTypography } from '@/components/common/BetterTypography'
import { formatDisplayDate } from '@/helpers'
import { useEffect, useState } from 'react'

export default function Clock() {

    const [now, setNow] = useState(new Date())

    useEffect(() => {
        const interval = setInterval(() => {
            setNow(new Date())
        }, 1000)

        return () => clearInterval(interval)
    }, [])

    return (
        <div className="h-full flex-center">
            <BetterTypography variant='12' className='hidden sm:block text-nowrap' weight='medium' as="h3">
                {formatDisplayDate(now, "MMM d, HH:mm:ss")}
            </BetterTypography>
            <BetterTypography variant='12' className='sm:hidden text-nowrap' weight='medium' as="h3">
                {formatDisplayDate(now, "HH:mm")}
            </BetterTypography>
        </div>
    )
}
