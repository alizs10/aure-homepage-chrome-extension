// components/notes-and-checklists/NotesAndChecklists.tsx
import { BetterTypography } from '@/components/common/BetterTypography';
import ChecklistInfoPopup from './components/ChecklistInfoPopup';
import { InputSection } from './components/InputSection';
import { ItemsList } from './components/ItemsList';
import NotesStatsPopup from './components/NotesStatsPopup';
import NotesSettingsPopup from './components/NotesSettingsPopup';

function NotesAndChecklistsContent() {
    return (
        <div className="sm:col-span-1 app_container app_gradient app-blur flex flex-col gap-y-4 p-5 min-h-110 max-h-110 lg:max-h-full lg:row-span-2">
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
    return (
        <NotesAndChecklistsContent />
    );
}