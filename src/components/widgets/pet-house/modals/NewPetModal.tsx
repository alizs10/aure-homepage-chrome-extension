import { useMemo, useState, type MouseEvent } from 'react'
import Button from '../../../common/Button'
import { Typography } from '../../../common/Typography'
import TextInput from '../../../Form/TextInput'
import ModalHeader from '../../../modal/ModalHeader'
import ModalWrapper from '../../../modal/ModalWrapper'
import { usePetHouse } from '../contexts/PetHouseContext'
import type { CatColor, DogColor, PetType } from '../types'

const cat_colors: {
    id: CatColor,
    className: string
}[] = [
        { id: "white", className: "bg-white" },
        { id: "black", className: "bg-black" },
        { id: "orange", className: "bg-warning" },
    ];

const dog_colors: {
    id: DogColor,
    className: string
}[] = [
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

export default function NewPetModal({ open, onClose }: NewPetModalProps) {

    const { addItem } = usePetHouse()

    const [name, setName] = useState("");
    const [type, setType] = useState<PetType>("cat");

    const colors = useMemo(() => {

        return type === 'cat' ? cat_colors : dog_colors;

    }, [type])


    const [color, setColor] = useState<CatColor | DogColor>("white");
    function handleCreatePet() {

        addItem(
            name,
            color,
            type,
        )

        onClose()
    }

    function stopPropagation(e: MouseEvent<HTMLDivElement>) {
        e.preventDefault()
        e.stopPropagation()
    }

    return (
        <ModalWrapper open={open} onClose={onClose}>
            <div

                onClick={stopPropagation}
                className="app_container app_gradient backdrop-blur-md p-5 flex flex-col gap-4 w-full max-w-4/5 sm:max-w-md max-h-[80vh] overflow-y-scroll scrollbar-none">


                <ModalHeader
                    title='New Pet'
                    onClose={onClose}
                />

                <TextInput
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Pet name"
                    className="px-4 py-1 text-sm placeholder:text-sm"
                />

                <div className="space-y-4">
                    <Typography variant="body">Species</Typography>

                    <div className="flex gap-2">
                        <Button
                            size="sm"
                            variant={type === "cat" ? "primary" : "ghost"}
                            onClick={() => setType("cat")}
                        >
                            Cat
                        </Button>

                        <Button
                            size="sm"
                            variant={type === "dog" ? "primary" : "ghost"}
                            onClick={() => setType("dog")}
                        >
                            Dog
                        </Button>
                    </div>
                </div>

                <div className="space-y-2">
                    <Typography variant="body">Color</Typography>

                    <div className="flex gap-2 flex-wrap">
                        {colors.map((c) => (
                            <button
                                key={c.id}
                                type="button"
                                onClick={() => setColor(c.id)}
                                className={`
                    size-7 rounded-full border-2 transition
                    ${c.className}
                    ${color === c.id
                                        ? "border-primary scale-110"
                                        : "border-border"
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
                >
                    <Typography variant="caption">Make it Born</Typography>
                </Button>
            </div>

        </ModalWrapper>
    )
}
