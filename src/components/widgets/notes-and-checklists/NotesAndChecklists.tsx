// components/notes-and-checklists/NotesAndChecklists.tsx
import { BetterTypography } from '@/components/common/BetterTypography';
import ChecklistInfoPopup from './components/ChecklistInfoPopup';
import { InputSection } from './components/InputSection';
import { ItemsList } from './components/ItemsList';
import NotesStatsPopup from './components/NotesStatsPopup';

function NotesAndChecklistsContent() {
    return (
        <div className="sm:col-span-1 app_container app_gradient app-blur flex flex-col gap-y-4 p-5 max-h-110 lg:max-h-130 lg:row-span-2">
            <div className="flex-center-between">
                <BetterTypography className='capitalize text-nowrap' variant='14-16-20' weight='semibold' as="h3">
                    notes & checklists
                </BetterTypography>

                <div className="flex-row-center gap-x-1">
                    <NotesStatsPopup />
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