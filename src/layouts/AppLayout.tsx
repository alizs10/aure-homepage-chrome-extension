import type { PropsWithChildren } from "react";
import Header from "./Header";


export default function AppLayout({ children }: PropsWithChildren) {
    return (
        <main className="flex flex-col w-full h-screen max-h-screen overflow-y-scroll p-10 gap-y-8">

            <Header />


            {children}


        </main>
    )
}
