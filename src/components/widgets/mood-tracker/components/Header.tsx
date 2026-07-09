import { Typography } from '@/components/common/Typography'
import { useMoodTracker } from '../hooks/useMoodTracker'

export default function Header() {

    const { score } = useMoodTracker()


    return (
        <div className="flex-center-between">
            <Typography className='capitalize text-nowrap' variant="h2">
                Mood Tracker
            </Typography>


            <div className="app_container bg-background px-4 py-2  text-nowrap">
                <Typography variant='caption-xs'>
                    Score: {score}/5
                </Typography>
            </div>

        </div>
    )
}
