import { Outlet } from 'react-router-dom'
import Background from '../components/common/Background'
import MyToaster from '@/components/common/MyToaster'

export default function Layout() {
    return (
        <div className="relative h-screen max-h-screen w-screen overflow-hidden z-0 flex flex-col">
            {/* Background sits at the root so it covers the entire viewport */}
            <Background />

            {/* Outlet renders the active child route (AppLayout or Wizard) */}
            <Outlet />

            <MyToaster />
        </div>
    )
}