import type { ReactNode } from "react";
import Header from "../components/home/Header";
import type { Settings } from "../types/settings";

export default function HomeLayout({ children, settings }: { children: ReactNode, settings: Settings }) {
    return (
        <main className="flex flex-col w-full h-screen max-h-screen overflow-y-scroll p-10">

            <Header settings={settings} />


            {children}


        </main>
    )
}
