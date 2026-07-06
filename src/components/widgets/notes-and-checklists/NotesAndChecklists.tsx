// components/notes-and-checklists/NotesAndChecklists.tsx
import { Typography } from '../../common/Typography';
import { InputSection } from './components/InputSection';
import { ItemsList } from './components/ItemsList';
import { NotesAndChecklistsProvider } from './providers/NotesAndChecklistsProvider';

function NotesAndChecklistsContent() {
    return (
        <div className="flex-1 flex min-h-0 flex-col app_container app_gradient app-blur col-span-1 p-5 row-span-2 h-full max-h-full gap-y-4">
            <Typography className='capitalize' variant="h2">
                notes & checklists
            </Typography>

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