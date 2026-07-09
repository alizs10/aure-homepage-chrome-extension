import type { PropsWithChildren } from "react";
import Header from "./Header";
import Footer from "./Footer";


export default function AppLayout({ children }: PropsWithChildren) {
    return (
        <main className="flex flex-col w-full h-screen max-h-screen overflow-y-scroll scrollbar-none pt-4 md:pt-8 lg:pt-10 max-w-dvw overflow-x-clip">

            <Header />

            {children}

            <Footer />

        </main>
    )
}
