import { SettingsIcon } from "lucide-react";
import { Typography } from "../components/common/Typography";
import type { Settings } from "../types/settings";
import HomeLayout from "../layouts/HomeLayout";
import TextInput from "../components/Form/TextInput";
import { useEffect, useState } from "react";
import TopSites from "../components/home/TopSites";
import NotesAndChecklists from "../components/widgets/notes-and-checklists/NotesAndChecklists";
import Cat from "../components/widgets/pet-house/components/Cat";
import PetHouse from "../components/widgets/pet-house/PetHouse";
import Calendar from "../components/widgets/calendar/Calendar";



export default function Home({ settings }: { settings: Settings }) {


    return (
        <HomeLayout settings={settings}>

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
                        <div className="border-t border-border col-span-1 flex-center row-span-1 rounded-3xl bg-background/50 backdrop-blur-md h-full">
                            <Typography variant="h1">
                                game
                            </Typography>
                        </div>

                        <PetHouse />
                        {/* <div className="border-t border-border col-span-1 flex-center row-span-2 rounded-3xl bg-background/50 backdrop-blur-md h-full">
                            <Typography variant="h1">
                                weather
                            </Typography>
                        </div> */}
                    </div>
                    {/* <div className="w-full grid grid-cols-3 gap-4 flex-1">
                        <div className="border-t border-border col-span-1 rounded-3xl bg-background/50 backdrop-blur-md h-full"></div>
                        <div className="border-t border-border col-span-1 rounded-3xl bg-background/50 backdrop-blur-md h-full"></div>
                        <div className="border-t border-border col-span-1 rounded-3xl bg-background/50 backdrop-blur-md h-full"></div>
                    </div> */}
                </div>
            </section>


        </HomeLayout>
    )
}
