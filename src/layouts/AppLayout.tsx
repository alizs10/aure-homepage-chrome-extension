import type { PropsWithChildren } from "react";
// import Header from "./Header";
// import Footer from "./Footer";
import NewHeader from "./NewHeader";


export default function AppLayout({ children }: PropsWithChildren) {
    return (
        <main className="flex flex-col w-full min-h-screen max-w-dvw overflow-x-clip">

            {/* <Header /> */}
            <NewHeader />

            {children}

            {/* <Footer /> */}

        </main>
    )
}
