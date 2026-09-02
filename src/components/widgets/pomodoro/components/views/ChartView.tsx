import { useState } from 'react';
import { usePomodoro } from '../../hooks/usePomodoro';
import PomodoroChart from './chart/PomodoroChart';
import ChartFilters from './chart/ChartFilters';

export default function ChartView() {
    const { formatDuration } = usePomodoro();
    const [selectedDays, setSelectedDays] = useState(7);

    return (
        <div className="flex-1 min-h-0 flex flex-col gap-4">
            <ChartFilters
                selectedDays={selectedDays}
                onSelectDays={setSelectedDays}
            />

            {/* 🌟 PomodoroChart now internally renders both the SVG and the TaskDetailsPanel */}
            <PomodoroChart
                days={selectedDays}
                formatDuration={formatDuration}
            />
        </div>
    );
}