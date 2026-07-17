import { useMoodTracker } from '../hooks/useMoodTracker';
import HistoryDaysList from './HistoryDaysList';
import HistoryQuartersList from './HistoryQuartersList';
import HistoryWeeksList from './HistoryWeeksList';

export default function HistoryList() {

    const { filter } = useMoodTracker()

    if (filter === 'last30days' || filter === 'thisWeek') {
        return <HistoryDaysList />
    }

    if (filter === 'thisMonth') {
        return <HistoryWeeksList />
    }

    if (filter === 'thisYear') {
        return <HistoryQuartersList />
    }
}
