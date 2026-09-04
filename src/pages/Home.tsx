import SearchInput from "@/components/home/SearchInput";
import Pomodoro from "@/components/widgets/pomodoro/Pomodoro";
import { useSettingsStore } from "@/stores";
import TopSites from "../components/home/TopSites";
import Calendar from "../components/widgets/calendar/Calendar";
import MoodTracker from "../components/widgets/mood-tracker/MoodTracker";
import NotesAndChecklists from "../components/widgets/notes-and-checklists/NotesAndChecklists";
import PetHouse from "../components/widgets/pet-house/PetHouse";
import Favorites from "@/components/home/favorites/Favorites";
import Folders from "@/components/home/folders/Folders";
import { Tooltip } from "@base-ui/react/tooltip";
import Button from "@/components/ui/Button";
import { Link } from "react-router-dom";
import { Settings2Icon } from "lucide-react";
import { useEffect } from "react";

export default function Home() {
    const { settings } = useSettingsStore();
    const widgetsSettings = settings?.widgets;

    const showTopSites = settings?.show_top_sites;
    const showFavorites = settings?.show_favorites;
    const showFolders = settings?.show_folders ?? true;
    const showSitesRow = showTopSites || showFavorites || showFolders;

    // 🌟 Chrome New Tab Focus Bypass (Only runs on initial Home page load)
    useEffect(() => {
        const isNewTabPage = window.location.href.startsWith('chrome://newtab') ||
            window.location.pathname.endsWith('/newtab.html') ||
            window.location.pathname.endsWith('/index.html');

        if (!isNewTabPage) return;

        // Check if we've already handled the focus bypass in this tab session
        const hasHandledFocus = sessionStorage.getItem('aure_focus_bypass');

        if (!hasHandledFocus && window.location.search !== "?focused") {
            // Mark it so we don't trigger a reload when navigating back to Home later
            sessionStorage.setItem('aure_focus_bypass', 'true');
            window.location.search = "?focused";
        } else if (window.location.search === "?focused") {
            // Clean up the URL so the user doesn't see "?focused" in the address bar.
            // 🌟 FIX: Preserve the hash (e.g., #/) so React Router doesn't lose its state!
            window.history.replaceState(null, "", window.location.pathname + window.location.hash);
        }
    }, []);

    return (
        <section className="w-full max-w-6xl m-auto gap-y-4 md:gap-y-8 flex-center flex-col py-10 space-y-6 overflow-x-clip">
            <div className="sticky top-10 z-40 h-fit min-h-fit w-full flex flex-col gap-y-2 md:gap-y-4">
                <SearchInput />

                {showSitesRow && (
                    <Tooltip.Provider>
                        <div className="flex flex-wrap justify-center gap-1 md:gap-2 z-30 w-full px-4 md:px-8  group/sites">
                            {showTopSites && <TopSites />}
                            {showFavorites && <Favorites />}
                            {showFolders && <Folders />}
                            <Link className="transition-opacity duration-200 opacity-0 group-hover/sites:opacity-100" to="/settings?tab=sites-and-folders">
                                <Button
                                    size='icon-sm'
                                    variant='warning'
                                    className="size-10 md:size-14 w-auto min-w-10 min-h-10 max-w-10 max-h-10 md:max-w-14 md:max-h-14 md:min-w-14 md:min-h-14 aspect-square h-auto group z-30 px-0 p-2.5 rounded-full"
                                >
                                    <Settings2Icon className="min-w-4 md:min-w-8 size-4 md:size-8" />
                                </Button>
                            </Link>
                        </div>
                    </Tooltip.Provider>
                )}
            </div>

            <div className="w-full flex flex-col gap-y-4 px-4 md:px-8 lg:px-10">
                {/* 🌟 Dynamic Grid: 
                    auto-rows-[15rem] sets the base unit height (h-60). 
                    grid-flow-dense automatically packs short widgets into gaps left by tall widgets. 
                */}
                <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-60 grid-flow-dense">
                    {widgetsSettings?.["notes-and-checklists"] && <NotesAndChecklists />}
                    {widgetsSettings?.["calendar"] && <Calendar />}
                    {widgetsSettings?.["pomodoro"] && <Pomodoro />}
                    {widgetsSettings?.["mood-tracker"] && <MoodTracker />}
                    {widgetsSettings?.["pet-house"] && <PetHouse />}
                </div>
            </div>
        </section>
    );
}