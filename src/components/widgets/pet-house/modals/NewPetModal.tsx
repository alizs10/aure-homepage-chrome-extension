import { useMemo, useState } from "react"; // 🌟 Removed useEffect
import Button from "@/components/ui/Button";
import ModalHeader from "@/components/ui/modal/ModalHeader";
import TextInput from "@/components/ui/TextInput";
import { toast } from "sonner";
import { usePetHouse } from "../hooks/usePetHouse";
import type { CatColor, DogColor, PetType } from "../types";
import Modal from "@/components/ui/modal/ModalWrapper";
import { BetterTypography } from "@/components/common/BetterTypography";
import ColorPicker, { type ColorOption } from "@/components/ui/ColorPicker";

const cat_colors: ColorOption<CatColor>[] = [
    { id: "white", className: "bg-white", label: "White" },
    { id: "black", className: "bg-black", label: "Black" },
    { id: "orange", className: "bg-warning", label: "Orange" },
];

const dog_colors: ColorOption<DogColor>[] = [
    { id: "black", className: "bg-black", label: "Black" },
    { id: "gray", className: "bg-gray-600 dark:bg-gray-400", label: "Gray" },
    { id: "brown", className: "bg-amber-950 dark:bg-amber-900", label: "Brown" },
    { id: "golden", className: "bg-yellow-600 dark:bg-yellow-400", label: "Golden" },
    { id: "white", className: "bg-white", label: "White" },
];

interface NewPetModalProps {
    open: boolean;
    onClose: () => void;
}

export default function NewPetModal({ open, onClose }: NewPetModalProps) {
    const { addItem } = usePetHouse();

    const [name, setName] = useState("");
    const [type, setType] = useState<PetType>("cat");
    const [color, setColor] = useState<CatColor | DogColor>("white");

    // 🌟 FIX: Extract reset logic into a function called by event handlers
    const clearForm = () => {
        setName("");
        setType("cat");
        setColor("white");
    };

    // 🌟 FIX: Wrap onClose to clear the form before closing
    const handleClose = () => {
        clearForm();
        onClose();
    };

    const colors = useMemo(() => {
        return type === "cat" ? cat_colors : dog_colors;
    }, [type]);

    function handleCreatePet() {
        const trimmedName = name.trim();
        if (!trimmedName) return;

        addItem(trimmedName, color, type);

        const messages: Record<PetType, string[]> = {
            cat: [
                `${trimmedName} the cat has been born! Welcome to the family.`,
                `A curious kitten named ${trimmedName} just joined us!`,
                `Meow! ${trimmedName} is now part of the Pet House.`,
            ],
            dog: [
                `${trimmedName} the dog is here! Ready to play.`,
                `Woof! ${trimmedName} the puppy has joined the family.`,
                `A loyal friend named ${trimmedName} just arrived.`,
            ],
        };

        const typeMessages = messages[type];
        const message = typeMessages[Math.floor(Math.random() * typeMessages.length)];

        toast.success(message);

        // 🌟 FIX: Clear form directly in the submit event handler
        clearForm();
        onClose();
    }

    return (
        // 🌟 Pass handleClose to the Modal wrapper to catch backdrop clicks
        <Modal open={open} onClose={handleClose}>
            <div className="rounded-3xl liquid-glass p-3 md:p-5 flex flex-col gap-4">
                <ModalHeader title="New Pet" onClose={handleClose} />

                <TextInput
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Pet name"
                    className="px-4 py-1 text-sm placeholder:text-sm"
                    onKeyDown={(e) => {
                        if (e.key === "Enter" && name.trim()) {
                            handleCreatePet();
                        }
                    }}
                />

                <div className="flex flex-col gap-y-2">
                    <BetterTypography variant="xs" weight="medium">
                        Species
                    </BetterTypography>

                    <div className="flex gap-2">
                        <Button
                            size="sm"
                            variant={type === "cat" ? "primary-active" : "primary"}
                            onClick={() => setType("cat")}
                        >
                            <BetterTypography variant="sm">Cat</BetterTypography>
                        </Button>

                        <Button
                            size="sm"
                            variant={type === "dog" ? "primary-active" : "primary"}
                            onClick={() => setType("dog")}
                        >
                            <BetterTypography variant="sm">Dog</BetterTypography>
                        </Button>
                    </div>
                </div>

                <div className="flex flex-col gap-y-2">
                    <BetterTypography variant="xs" weight="medium">
                        Color
                    </BetterTypography>

                    <ColorPicker
                        options={colors}
                        selectedId={color}
                        onSelect={(id) => setColor(id as CatColor | DogColor)}
                    />
                </div>

                <Button
                    disabled={!name.trim()}
                    onClick={handleCreatePet}
                    variant="primary"
                    size="sm"
                    className="mt-2"
                >
                    <BetterTypography variant="sm" weight="semibold">
                        Make it Born
                    </BetterTypography>
                </Button>
            </div>
        </Modal>
    );
}