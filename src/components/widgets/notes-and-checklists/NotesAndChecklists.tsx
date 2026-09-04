import { BetterTypography } from '@/components/common/BetterTypography';
import ChecklistInfoPopup from './components/ChecklistInfoPopup';
import { InputSection } from './components/InputSection';
import { ItemsList } from './components/ItemsList';
import NotesStatsPopup from './components/NotesStatsPopup';
import NotesSettingsPopup from './components/NotesSettingsPopup';

function NotesAndChecklistsContent() {
    return (
        // 🌟 row-span-2 makes it exactly 31rem (15rem + 15rem + 1rem gap)
        <div className="relative sm:col-span-1 row-span-2 rounded-3xl liquid-glass flex flex-col gap-y-4 p-5 h-full">
            <div className="flex-center-between">
                <BetterTypography className='capitalize text-nowrap' variant='14-16-20' weight='semibold' as="h3">
                    notes & tasks
                </BetterTypography>

                <div className="flex-row-center gap-x-1">
                    <NotesStatsPopup />
                    <NotesSettingsPopup />
                    <ChecklistInfoPopup />
                </div>
            </div>

            <ItemsList />
            <InputSection />
        </div>
    );
}

export default function NotesAndChecklists() {
    return <NotesAndChecklistsContent />;
}