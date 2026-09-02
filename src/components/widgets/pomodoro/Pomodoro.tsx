import Header from "./components/Header";
import TimerView from "./components/views/TimerView";
import LogsView from "./components/views/LogsView";
import ChartView from "./components/views/ChartView";
import { usePomodoro } from "./hooks/usePomodoro";

export default function Pomodoro() {
    const { currentView } = usePomodoro();

    return (
        <div
            className="
                relative
                sm:col-span-1
                rounded-3xl
                liquid-glass
                flex
                flex-col
                gap-y-4
                p-5
                min-h-124
                max-h-124
                lg:row-span-2
            "
        >
            <Header />

            {currentView === "timer" && <TimerView />}
            {currentView === "logs" && <LogsView />}
            {currentView === "chart" && <ChartView />}
        </div>
    );
}