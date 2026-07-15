import SearchInput from "@/components/home/SearchInput";
import { useSettingsStore } from "@/stores";
import TopSites from "../components/home/TopSites";
import Calendar from "../components/widgets/calendar/Calendar";
import MoodTracker from "../components/widgets/mood-tracker/MoodTracker";
import NotesAndChecklists from "../components/widgets/notes-and-checklists/NotesAndChecklists";
import PetHouse from "../components/widgets/pet-house/PetHouse";
import AppLayout from "../layouts/AppLayout";
import FavoritesSites from "@/components/home/FavoritesSites";



export default function Home() {

    const { settings } = useSettingsStore()
    const widgetsSettings = settings?.widgets;


    return (
        <AppLayout>

            <section className="flex-1 min-h-0 pb-14 md:pb-18 lg:pb-20 overflow-y-scroll scrollbar-none w-full max-w-6xl mx-auto gap-y-4 md:gap-y-8 mt-10 space-y-6">

                <div className="h-fit min-h-fit flex flex-col">
                    <div className="sticky top-0 z-40">

                        <SearchInput />
                    </div>

                    {(settings?.show_top_sites && !settings?.show_favorites) && (
                        <TopSites />
                    )}
                    {settings?.show_favorites && (
                        <FavoritesSites />
                    )}
                </div>

                <div className="w-full flex-1 min-h-0 flex flex-col gap-y-4 px-4 md:px-8 lg:px-10">

                    <div className="w-full flex flex-col sm:grid sm:grid-cols-2 lg:grid-rows-2 lg:grid-cols-3 gap-4 max-h-fit">
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
