import TextInput from "../components/Form/TextInput";
import TopSites from "../components/home/TopSites";
import Calendar from "../components/widgets/calendar/Calendar";
import MoodTracker from "../components/widgets/mood-tracker/MoodTracker";
import NotesAndChecklists from "../components/widgets/notes-and-checklists/NotesAndChecklists";
import PetHouse from "../components/widgets/pet-house/PetHouse";
import AppLayout from "../layouts/AppLayout";



export default function Home() {


    return (
        <AppLayout>

            <section className="flex-1 min-h-0 flex flex-col w-full max-w-6xl mx-auto gap-y-8 py-22">

                <div className="flex-1 min-h-0 flex flex-col items-end w-full">
                    <div className="w-full">
                        <TextInput
                            className="flex-1 mt-auto text-lg md:text-xl lg:text-2xl md:px-6 md:py-2.5 lg:px-10 lg:py-4"
                            placeholder="Search web..." />
                    </div>

                    <TopSites />
                </div>

                <div className="flex-3 min-h-0 h-fit w-full flex flex-col gap-y-4">

                    <div className="w-full grid grid-cols-3 grid-rows-2 gap-4 flex-1 min-h-0 h-full">
                        <NotesAndChecklists />
                        <Calendar />
                        <MoodTracker />

                        <PetHouse />
                        {/* <div className="border-t border-border col-span-1 flex-center row-span-2 rounded-3xl bg-background/50 app-blur h-full">
                            <Typography variant="h1">
                                weather
                            </Typography>
                        </div> */}
                    </div>
                    {/* <div className="w-full grid grid-cols-3 gap-4 flex-1">
                        <div className="border-t border-border col-span-1 rounded-3xl bg-background/50 app-blur h-full"></div>
                        <div className="border-t border-border col-span-1 rounded-3xl bg-background/50 app-blur h-full"></div>
                        <div className="border-t border-border col-span-1 rounded-3xl bg-background/50 app-blur h-full"></div>
                    </div> */}
                </div>
            </section>


        </AppLayout>
    )
}
