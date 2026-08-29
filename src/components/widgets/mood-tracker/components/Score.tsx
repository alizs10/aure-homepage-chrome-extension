import { BetterTypography } from '@/components/common/BetterTypography'
import { useMoodTracker } from '../hooks/useMoodTracker'

export default function Score() {

    const { score } = useMoodTracker()


    return (
        <div className="rounded-3xl app_shadow bg-background px-4 py-1.5 text-nowrap">
            <BetterTypography variant="12-12-14-12-14">
                Score: {score}/5
            </BetterTypography>
        </div>
    )
}
