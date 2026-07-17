import { SkullIcon } from 'lucide-react';
import { useState, useCallback } from 'react';

import type { Pet } from '../types';
import { usePetHouse } from '../hooks/usePetHouse';
import Button from '@/components/ui/Button';
import { toast } from 'sonner';
import ConfirmDialog from '@/components/ui/Dialog';

export default function KillPetDialog({ pet }: { pet: Pet }) {
    const { removeItem } = usePetHouse();

    const [confirmKey, setConfirmKey] = useState("");
    const [dialogOpen, setDialogOpen] = useState(false);

    const expectedKey = `kill ${pet.name}`;

    const handleRemove = useCallback(() => {
        // UX Improvement: Warn the user if they typed the wrong confirmation string
        if (confirmKey !== expectedKey) {
            toast.error("Confirmation text did not match. Pet spared.", { duration: 2000 });
            setConfirmKey("");
            setDialogOpen(false);
            return;
        }

        removeItem(pet.id);

        const deathMessages = [
            `${pet.name} has been sent to the pet afterlife... RIP`,
            `${pet.name} is gone forever. You monster.`,
            `Farewell ${pet.name}. May you rest in peace.`,
            `${pet.name} is gone forever. The Pet House feels emptier now.`,
        ];

        const randomMessage = deathMessages[Math.floor(Math.random() * deathMessages.length)];

        toast.error(randomMessage, { duration: 4000 });

        setConfirmKey("");
        setDialogOpen(false);
    }, [pet.name, pet.id, confirmKey, expectedKey, removeItem]);

    return (
        <>
            <Button
                onClick={() => setDialogOpen(true)}
                variant="ghost-destructive"
                size="icon-xs"
            >
                <SkullIcon className="size-4" />
            </Button>

            {/* 🎉 Clean, flat, and highly readable props! */}
            <ConfirmDialog
                open={dialogOpen}
                onClose={() => {
                    setConfirmKey("");
                    setDialogOpen(false);
                }}
                title={`Killing ${pet.name}???`}
                description={`You really want to kill ${pet.name}? You can't bring back a dead pet!`}
                cancelText="Nooo"
                confirmText="Kill it!"
                confirmVariant="destructive"
                confirmIcon={<SkullIcon className="size-4" />}
                onCancel={() => {
                    setConfirmKey("");
                    setDialogOpen(false);
                }}
                onConfirm={handleRemove}
                confirmInput={{
                    placeholder: `Type: kill ${pet.name}`,
                    value: confirmKey,
                    onChange: (e) => setConfirmKey(e.target.value)
                }}
            />
        </>
    );
}