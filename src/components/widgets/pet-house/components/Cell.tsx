import { BoneIcon, CatIcon, SoupIcon } from "lucide-react";
import { useMemo, type PropsWithChildren } from "react";
import Button from "../../../common/Button";
import { Typography } from "../../../common/Typography";
import KillPetDialog from "../dialogs/KillPetDialog";
import { getPetAgeLabel, getRemainingFoodToday } from "../helpers";
import { usePetAgeTicker } from "../hooks/usePetAgeTicker";
import { usePetHouse } from "../hooks/usePetHouse";
import type { Pet } from "../types";
import PetMovement from "./PetMovement";
import { toast } from "sonner";


export default function Cell({ children, pet }: PropsWithChildren & { pet: Pet }) {


    const { feedPet } = usePetHouse()



    const remainingFoodToday = useMemo(() => {

        return getRemainingFoodToday(pet)

    }, [pet])

    function handleFeedPet() {
        feedPet(pet.id);

        const remaining = getRemainingFoodToday(pet) - 1;

        const messages: Record<number, string> = {
            2: "First feed of the day! Your pet loved it.",
            1: "Second meal down. One more to go!",
            0: "Final feed of the day! Pet is happily full.",
        };

        const message = messages[remaining] || "Pet fed successfully.";

        toast.success(message);
    }

    usePetAgeTicker(pet.createdAt);

    const ageLabel = getPetAgeLabel(pet);

    return (
        <div className="relative border-2 nth-[1]:border-t-0 nth-[1]:border-l-0 nth-[2]:border-t-0 nth-[2]:border-r-0 nth-[3]:border-b-0 nth-[3]:border-l-0 nth-[4]:border-b-0 nth-[4]:border-r-0 border-muted overflow-hidden">

            <div className="flex-center-between px-3 py-1">

                <KillPetDialog pet={pet} />

                <div className="flex-row-center gap-x-1">
                    <Button
                        onClick={handleFeedPet}
                        disabled={remainingFoodToday === 0}
                        rightIcon={pet.type === 'cat' ? <SoupIcon className="size-4" /> : <BoneIcon className="size-4" />}
                        variant="primary" size="xs">

                        {remainingFoodToday > 0 && (
                            <Typography variant="caption-xxs">
                                {remainingFoodToday}
                            </Typography>
                        )}

                    </Button>

                    <div className="app_container app_gradient app-blur py-1 px-2 flex-row-center gap-x-0.5">

                        <CatIcon className="size-3.5" />

                        <Typography variant="caption-xxs">
                            {ageLabel}
                        </Typography>

                    </div>

                </div>

            </div>


            <PetMovement type={pet.type}>
                {children}
            </PetMovement>
        </div>
    )
}
