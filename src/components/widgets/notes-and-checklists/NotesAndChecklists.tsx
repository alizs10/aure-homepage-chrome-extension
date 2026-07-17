// components/notes-and-checklists/NotesAndChecklists.tsx
import { Typography } from '../../common/Typography';
import ChecklistInfoPopup from './components/ChecklistInfoPopup';
import { InputSection } from './components/InputSection';
import { ItemsList } from './components/ItemsList';
import NotesStatsPopup from './components/NotesStatsPopup';

function NotesAndChecklistsContent() {
    return (
        <div className="sm:col-span-1 app_container app_gradient app-blur flex flex-col gap-y-4 p-5 max-h-110 lg:max-h-130 lg:row-span-2">
            <div className="flex-center-between">
                <Typography className='capitalize' variant="h2">
                    notes & checklists
                </Typography>

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