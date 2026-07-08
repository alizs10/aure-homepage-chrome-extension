import SearchInput from "@/components/home/SearchInput";
import { useSettingsStore } from "@/stores";
import TopSites from "../components/home/TopSites";
import Calendar from "../components/widgets/calendar/Calendar";
import MoodTracker from "../components/widgets/mood-tracker/MoodTracker";
import NotesAndChecklists from "../components/widgets/notes-and-checklists/NotesAndChecklists";
import PetHouse from "../components/widgets/pet-house/PetHouse";
import AppLayout from "../layouts/AppLayout";



export default function Home() {

    const { settings } = useSettingsStore()

    const widgetsSettings = settings?.widgets;



    return (
        <AppLayout>

            <section className="flex-1 min-h-0 flex flex-col w-full max-w-6xl mx-auto gap-y-8 py-22">

                <div className="flex-1 min-h-0 flex flex-col w-full">
                    <SearchInput />

                    <TopSites />
                </div>

                <div className="flex-3 min-h-0 h-fit w-full flex flex-col gap-y-4">

                    <div className="w-full grid grid-cols-3 grid-rows-2 gap-4 flex-1 min-h-0 h-full">
                        {widgetsSettings?.["notes-and-checklists"] && (
                            <NotesAndChecklists />
                        )}
                        {widgetsSettings?.["calendar"] && (
                            <Calendar />
                        )}
                        {widgetsSettings?.["mood-tracker"] && (
                            <MoodTracker />
                        )}
                        {widgetsSettings?.["pet-house"] && (
                            <PetHouse />
                        )}


                    </div>

                </div>
            </section>


        </AppLayout>
    )
}
