// components/notes-and-checklists/NotesAndChecklists.tsx
import { Typography } from '../../common/Typography';
import InfoPopup from './components/InfoPopup';
import { InputSection } from './components/InputSection';
import { ItemsList } from './components/ItemsList';
import { NotesAndChecklistsProvider } from './providers/NotesAndChecklistsProvider';

function NotesAndChecklistsContent() {
    return (
        <div className="sm:col-span-1 app_container app_gradient app-blur flex flex-col gap-y-4 p-5 max-h-110 lg:max-h-130 lg:row-span-2">
            <div className="flex-center-between">
                <Typography className='capitalize' variant="h2">
                    notes & checklists
                </Typography>

                <InfoPopup />
            </div>

            <ItemsList />

            <InputSection />
        </div>
    );
}

export default function NotesAndChecklists() {
    return (
        <NotesAndChecklistsProvider>
            <NotesAndChecklistsContent />
        </NotesAndChecklistsProvider>
    );
}