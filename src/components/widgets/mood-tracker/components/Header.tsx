import { useMoodTracker } from '../hooks/useMoodTracker'
import { BetterTypography } from '@/components/common/BetterTypography'

export default function Header() {

    const { score } = useMoodTracker()


    return (
        <div className="flex-center-between">
            <BetterTypography className='capitalize text-nowrap' variant='14-16-20' weight='semibold' as="h3">
                Mood Tracker
            </BetterTypography>


            <div className="app_container bg-background px-4 py-2  text-nowrap">
                <BetterTypography variant="xs">
                    Score: {score}/5
                </BetterTypography>
            </div>

        </div>
    )
}
