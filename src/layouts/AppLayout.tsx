import { Outlet } from "react-router-dom";
import Header from "./Header";

export default function AppLayout() {
    return (
        <main className="relative z-10 flex-1 min-h-0 flex flex-col w-full overflow-y-auto scrollbar-none max-w-dvw overflow-x-clip">
            <Header />

            {/* Outlet renders the active page (Home or Settings) */}
            <Outlet />
        </main>
    )
}