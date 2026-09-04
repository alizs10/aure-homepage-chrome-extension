import Header from "./components/Header";
import TimerView from "./components/views/TimerView";
import LogsView from "./components/views/LogsView";
import ChartView from "./components/views/ChartView";
import { usePomodoro } from "./hooks/usePomodoro";

export default function Pomodoro() {
    const { currentView } = usePomodoro();

    return (
        // 🌟 row-span-2 makes it exactly 31rem
        <div className="relative sm:col-span-1 row-span-2 rounded-3xl liquid-glass flex flex-col gap-y-4 p-5 h-full">
            <Header />

            {currentView === "timer" && <TimerView />}
            {currentView === "logs" && <LogsView />}
            {currentView === "chart" && <ChartView />}
        </div>
    );
}