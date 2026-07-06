import TabDetails from '@/components/settings/components/TabDetails';
import { SettingsTabsProvider } from '@/components/settings/provider/SettingsTabsProvider';
import Sidebar from '@/components/settings/components/Sidebar';
import AppLayout from '@/layouts/AppLayout';

export default function Settings() {


    return (
        <SettingsTabsProvider>

            <AppLayout>
                <div className="flex-1 w-full grid grid-cols-4 gap-6">

                    <Sidebar />
                    <TabDetails />

                </div>
            </AppLayout>
        </SettingsTabsProvider>
    )
}
