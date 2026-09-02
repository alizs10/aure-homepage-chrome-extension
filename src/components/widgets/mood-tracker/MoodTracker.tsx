import ChooseMood from "./components/ChooseMood";
import Header from "./components/Header";
import MoodsHistory from "./components/MoodsHistory";
// import MoodTrackerProvider from "./providers/MoodTrackerProvider";


export default function MoodTracker() {


    return (
        // <MoodTrackerProvider>


        <div className="w-full sm:col-span-1 flex flex-col p-5 rounded-3xl liquid-glass min-h-60 max-h-60 gap-y-4 lg:row-span-1">
            <Header />
            <ChooseMood />
            <MoodsHistory />
        </div>
        // </MoodTrackerProvider>
    )
}
