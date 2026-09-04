import { motion } from 'framer-motion'
import { TargetIcon, ClockIcon, CalendarIcon, TrendingUpIcon } from 'lucide-react'

import { BetterTypography } from '@/components/common/BetterTypography'
import ModalHeader from '@/components/ui/modal/ModalHeader'
import ModalWrapper from '@/components/ui/modal/ModalWrapper'

interface PomodoroStats {
    totalSessions: number
    todaySessions: number
    totalTime: string
    todayTime: string
}

interface PomodoroStatsPopupProps {
    open: boolean
    onClose: () => void
    loading: boolean
    stats: PomodoroStats
}

// 🌟 Kept outside the component to prevent recreation on every render
const StatCard = ({
    icon: Icon,
    label,
    value,
    colorClass,
}: {
    icon: typeof TargetIcon
    label: string
    value: string
    colorClass: string
}) => (
    <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-1 rounded-xl border border-border/50 bg-background p-3"
    >
        <div className="flex items-center gap-2 text-muted-foreground">
            <Icon className={`size-4 ${colorClass}`} />
            <BetterTypography variant="xs" weight="medium">
                {label}
            </BetterTypography>
        </div>
        <BetterTypography variant="lg" weight="bold" className="text-foreground">
            {value}
        </BetterTypography>
    </motion.div>
)

export default function PomodoroStatsPopup({
    open,
    onClose,
    loading,
    stats,
}: PomodoroStatsPopupProps) {
    return (
        <ModalWrapper open={open} onClose={onClose}>
            <div className="rounded-3xl app_shadow flex max-h-[80vh] w-full max-w-4/5 flex-col gap-4 overflow-y-scroll bg-secondary p-5 scrollbar-none sm:max-w-md">
                <ModalHeader title="Focus Statistics" onClose={onClose} />

                {loading ? (
                    <div className="flex-center py-10">
                        <div className="size-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                    </div>
                ) : (
                    <div className="grid grid-cols-2 gap-3">
                        <StatCard
                            icon={TargetIcon}
                            label="Total Sessions"
                            value={stats.totalSessions.toString()}
                            colorClass="text-primary"
                        />
                        <StatCard
                            icon={ClockIcon}
                            label="Total Focus Time"
                            value={stats.totalTime}
                            colorClass="text-primary"
                        />
                        <StatCard
                            icon={CalendarIcon}
                            label="Today's Sessions"
                            value={stats.todaySessions.toString()}
                            colorClass="text-success"
                        />
                        <StatCard
                            icon={TrendingUpIcon}
                            label="Today's Focus Time"
                            value={stats.todayTime}
                            colorClass="text-success"
                        />
                    </div>
                )}

                <BetterTypography variant="xs" className="pt-2 text-center text-muted-foreground">
                    Statistics are calculated from completed focus sessions only.
                </BetterTypography>
            </div>
        </ModalWrapper>
    )
}