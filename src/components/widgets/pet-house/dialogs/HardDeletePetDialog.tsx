import { Trash2Icon } from 'lucide-react';
import { useState, useCallback } from 'react';

import type { Pet } from '../types';
import { usePetHouse } from '../hooks/usePetHouse';
import Button from '@/components/ui/Button';
import { toast } from 'sonner';
import ConfirmDialog from '@/components/ui/Dialog';

export default function HardDeletePetDialog({ pet }: { pet: Pet }) {
    const { hardDeleteItem } = usePetHouse();

    const [confirmKey, setConfirmKey] = useState("");
    const [dialogOpen, setDialogOpen] = useState(false);

    const expectedKey = `delete ${pet.name} forever`;

    const handleHardDelete = useCallback(() => {
        if (confirmKey !== expectedKey) {
            toast.error("Confirmation text did not match. Pet ghost spared.", { duration: 2000 });
            setConfirmKey("");
            setDialogOpen(false);
            return;
        }

        hardDeleteItem(pet.id);

        toast.success(`${pet.name} has been permanently erased from existence.`, { duration: 3000 });

        setConfirmKey("");
        setDialogOpen(false);
    }, [pet.name, pet.id, confirmKey, expectedKey, hardDeleteItem]);

    return (
        <>
            <Button
                onClick={() => setDialogOpen(true)}
                variant="ghost-destructive"
                size="icon-xs"
                title="Permanently Delete"
            >
                <Trash2Icon className="size-4" />
            </Button>

            <ConfirmDialog
                open={dialogOpen}
                onClose={() => {
                    setConfirmKey("");
                    setDialogOpen(false);
                }}
                title={`Permanently Delete ${pet.name}?`}
                description={`This will completely erase ${pet.name}'s ghost from the database. This action cannot be undone.`}
                cancelText="Keep Ghost"
                confirmText="Delete Forever"
                confirmVariant="destructive"
                confirmIcon={<Trash2Icon className="size-4" />}
                onCancel={() => {
                    setConfirmKey("");
                    setDialogOpen(false);
                }}
                onConfirm={handleHardDelete}
                confirmInput={{
                    placeholder: `Type: delete ${pet.name} forever`,
                    value: confirmKey,
                    onChange: (e) => setConfirmKey(e.target.value)
                }}
            />
        </>
    );
}