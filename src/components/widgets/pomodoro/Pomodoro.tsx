import Header from "./components/Header";
import TimerView from "./components/views/TimerView";
import LogsView from "./components/views/LogsView";
import ChartView from "./components/views/ChartView";
import { usePomodoro } from "./hooks/usePomodoro";

export default function Pomodoro() {
    const { currentView } = usePomodoro();

    return (
        // Widget fills its parent container — parent controls grid span
        <div className="relative h-full w-full rounded-3xl liquid-glass flex flex-col gap-y-4 p-5">
            <Header />

            {currentView === "timer" && <TimerView />}
            {currentView === "logs" && <LogsView />}
            {currentView === "chart" && <ChartView />}
        </div>
    );
}