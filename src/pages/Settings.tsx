import TabDetails from '@/components/settings/components/TabDetails';
import { SettingsTabsProvider } from '@/components/settings/provider/SettingsTabsProvider';
import Sidebar from '@/components/settings/components/Sidebar';
import AppLayout from '@/layouts/AppLayout';

export default function Settings() {


    return (
        <SettingsTabsProvider>

            <AppLayout>
                <div className="flex-1 min-h-0 flex flex-col md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 w-full max-w-6xl mx-auto mt-4 mb-4 md:mb-0 md:mt-10 overflow-y-scroll scrollbar-none">

                    <Sidebar />
                    <TabDetails />

                </div>
            </AppLayout>
        </SettingsTabsProvider>
    )
}
