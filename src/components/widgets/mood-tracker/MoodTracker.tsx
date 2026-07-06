import ChooseMood from "./components/ChooseMood";
import Header from "./components/Header";
import MoodsHistory from "./components/MoodsHistory";
import MoodTrackerProvider from "./providers/MoodTrackerProvider";


export default function MoodTracker() {


    return (
        <MoodTrackerProvider>


            <div className="border-t border-border col-span-1 flex flex-col p-5 row-span-1 rounded-3xl bg-background/50 app-blur h-full gap-y-3">
                <Header />

                <ChooseMood />
                <MoodsHistory />
            </div>
        </MoodTrackerProvider>
    )
}
