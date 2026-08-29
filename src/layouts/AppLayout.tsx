import type { PropsWithChildren } from "react";
import Header from "./Header";


export default function AppLayout({ children }: PropsWithChildren) {
    return (
        <main className="flex flex-col w-full min-h-screen max-w-dvw overflow-x-clip">

            <Header />

            {children}
        </main>
    )
}
