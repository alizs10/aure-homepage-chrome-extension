import { useMemo, useState, useEffect } from "react";
import Button from "@/components/ui/Button";
import ModalHeader from "@/components/ui/modal/ModalHeader";
import TextInput from "@/components/ui/TextInput";
import { toast } from "sonner";
import { usePetHouse } from "../hooks/usePetHouse";
import type { CatColor, DogColor, PetType } from "../types";
import Modal from "@/components/ui/modal/ModalWrapper";
import { BetterTypography } from "@/components/common/BetterTypography";

const cat_colors: { id: CatColor; className: string }[] = [
    { id: "white", className: "bg-white" },
    { id: "black", className: "bg-black" },
    { id: "orange", className: "bg-warning" },
];

const dog_colors: { id: DogColor; className: string }[] = [
    { id: "black", className: "bg-black" },
    { id: "gray", className: "bg-gray-600 dark:bg-gray-400" },
    { id: "brown", className: "bg-amber-950 dark:bg-amber-900" },
    { id: "golden", className: "bg-yellow-600 dark:bg-yellow-400" },
    { id: "white", className: "bg-white" },
];

interface NewPetModalProps {
    open: boolean;
    onClose: () => void;
}

export default function NewPetModal({
    open,
    onClose,
}: NewPetModalProps) {
    const { addItem } = usePetHouse();

    const [name, setName] = useState("");
    const [type, setType] = useState<PetType>("cat");
    const [color, setColor] = useState<CatColor | DogColor>("white");

    useEffect(() => {
        const clear = () => {
            setName("");
            setType("cat");
            setColor("white");
        };

        if (!open) {
            clear();
        }
    }, [open]);

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
        const message =
            typeMessages[Math.floor(Math.random() * typeMessages.length)];

        toast.success(message);
        onClose();
    }

    return (
        <Modal open={open} onClose={onClose}>
            <div className="app_container bg-background p-5 flex flex-col gap-4">
                <ModalHeader title="New Pet" onClose={onClose} />

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
                            variant={type === "cat" ? "primary" : "ghost"}
                            onClick={() => setType("cat")}
                        >
                            <BetterTypography variant="sm">
                                Cat
                            </BetterTypography>
                        </Button>

                        <Button
                            size="sm"
                            variant={type === "dog" ? "primary" : "ghost"}
                            onClick={() => setType("dog")}
                        >
                            <BetterTypography variant="sm">
                                Dog
                            </BetterTypography>
                        </Button>
                    </div>
                </div>

                <div className="flex flex-col gap-y-2">
                    <BetterTypography variant="xs" weight="medium">
                        Color
                    </BetterTypography>

                    <div className="flex gap-3 flex-wrap">
                        {colors.map((c) => (
                            <button
                                key={c.id}
                                type="button"
                                onClick={() => setColor(c.id)}
                                aria-label={`Select ${c.id} color`}
                                aria-pressed={color === c.id}
                                className={`
                                    size-8 rounded-full border-2 transition-all duration-200 outline-none
                                    focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2
                                    ${c.className}
                                    ${color === c.id
                                        ? "border-primary scale-110 ring-2 ring-primary/20"
                                        : "border-border hover:scale-105 hover:border-foreground/50"
                                    }
                                `}
                            />
                        ))}
                    </div>
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