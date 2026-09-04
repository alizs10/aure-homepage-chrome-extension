import ChooseMood from "./components/ChooseMood";
import Header from "./components/Header";
import MoodsHistory from "./components/MoodsHistory";

export default function MoodTracker() {
    return (
        // 🌟 row-span-1 makes it exactly 15rem (h-60)
        <div className="w-full sm:col-span-1 row-span-1 flex flex-col p-5 rounded-3xl liquid-glass h-full gap-y-4">
            <Header />
            <ChooseMood />
            <MoodsHistory />
        </div>
    )
}