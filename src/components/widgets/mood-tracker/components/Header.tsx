import { BetterTypography } from '@/components/common/BetterTypography'
import Button from '@/components/ui/Button'
import { ChartLineIcon, Grid2X2Icon } from 'lucide-react'
import { useMoodTracker } from '../hooks/useMoodTracker'

export default function Header() {

    const { showChart, setShowChart } = useMoodTracker()

    return (
        <div className="flex-center-between">
            <BetterTypography className='capitalize text-nowrap' variant='14-16-20' weight='semibold' as="h3">
                Mood Tracker
            </BetterTypography>


            <div className="p-0.5 app_container bg-background flex-row-center gap-x-0.5">
                <Button size='icon-sm'
                    variant={!showChart ? 'primary-active' : 'ghost'}
                    onClick={() => setShowChart(false)}
                >
                    <Grid2X2Icon className='size-4' />
                </Button>
                <Button size='icon-sm'
                    variant={showChart ? 'primary-active' : 'ghost'}
                    onClick={() => setShowChart(true)}
                >
                    <ChartLineIcon className='size-4' />
                </Button>
            </div>

        </div>
    )
}
