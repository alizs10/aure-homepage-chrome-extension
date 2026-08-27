import { BetterTypography } from '@/components/common/BetterTypography'
import Button from '@/components/ui/Button'
import Dropdown from '@/components/ui/Dropdown'
import { ChartLineIcon, FilterIcon, Grid2X2Icon } from 'lucide-react'
import { useMoodTracker } from '../hooks/useMoodTracker'
import { filters } from '../types'

export default function Header() {

    const { showChart, setShowChart, filter, onFilterChange, } = useMoodTracker()
    const currentFilter = filter || filters[0].value;

    return (
        <div className="flex-center-between">
            <BetterTypography className='capitalize text-nowrap' variant='14-16-20' weight='semibold' as="h3">
                Mood Tracker
            </BetterTypography>


            <div className="flex-row-center gap-x-0.5">
                <div className="app_container app_shadow bg-background flex-row-center gap-x-0.5">
                    <Button size='icon-sm'
                        className=''
                        variant={!showChart ? 'primary-active' : 'ghost'}
                        onClick={() => setShowChart(false)}
                    >
                        <Grid2X2Icon className='size-4' />
                    </Button>
                    <Button size='icon-sm'
                        className=''
                        variant={showChart ? 'primary-active' : 'ghost'}
                        onClick={() => setShowChart(true)}
                    >
                        <ChartLineIcon className='size-4' />
                    </Button>
                </div>
                <Dropdown
                    hideLabel
                    icon={<FilterIcon className='size-4' />}
                    value={currentFilter}
                    options={filters}
                    onValueChange={(newValue) => {
                        onFilterChange(newValue);
                    }}
                />
            </div>

        </div>
    )
}
