import { PlusIcon } from "lucide-react";
import { useState } from "react";


import Button from "../../../common/Button";
import NewPetModal from "../modals/NewPetModal";



export default function NewPetPopup() {
    const [open, setOpen] = useState(false);


    function toggle() {
        setOpen((prev) => !prev);
    }




    return (
        <div className="relative">
            <Button
                onClick={toggle}
                variant="primary"
                size="icon-sm"
                className={open ? "to-primary/20 dark:to-primary/50" : ""}
            >
                <PlusIcon className="size-4" />
            </Button>

            {open && (<NewPetModal open={open} onClose={toggle} />)}
        </div>
    );
}