import { BetterTypography } from '@/components/common/BetterTypography'
import { useMoodTracker } from '../hooks/useMoodTracker'

export default function Score() {

    const { score } = useMoodTracker()


    return (
        <div className="app_container bg-background px-4 py-1.5 text-nowrap">
            <BetterTypography variant="xs">
                Score: {score}/5
            </BetterTypography>
        </div>
    )
}
