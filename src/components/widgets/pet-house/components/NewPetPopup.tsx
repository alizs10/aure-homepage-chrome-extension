import { PlusIcon } from "lucide-react";
import { useState } from "react";
import Button from "../../../ui/Button";
import NewPetModal from "../modals/NewPetModal";

export default function NewPetPopup() {
    const [open, setOpen] = useState(false);

    return (
        <div className="relative">
            <Button
                onClick={() => setOpen(true)}
                variant={open ? 'primary-active' : 'primary'}
                size='icon-sm'
            >
                <PlusIcon className="size-4" />
            </Button>

            {/* Conditional rendering ensures the form inside unmounts and resets on close */}
            {open && <NewPetModal open={open} onClose={() => setOpen(false)} />}
        </div>
    );
}