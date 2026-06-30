import { BoneIcon, CatIcon, SkullIcon, SoupIcon } from "lucide-react";
import { useMemo, type PropsWithChildren } from "react";
import Button from "../../../common/Button";
import { Typography } from "../../../common/Typography";
import { getPetAge, getPetAgeLabel, getRemainingFoodToday } from "../helpers";
import type { Pet } from "../types";
import PetMovement from "./PetMovement";
import { usePetHouse } from "../contexts/PetHouseContext";
import KillPetDialog from "../dialogs/KillPetDialog";

export default function Cell({ children, pet }: PropsWithChildren & { pet: Pet }) {


    const { removeItem, feedPet } = usePetHouse()

    const remainingFoodToday = useMemo(() => {

        return getRemainingFoodToday(pet)

    }, [pet.hasBeenFeedCount])

    const ageLabel = useMemo(() => {
        return getPetAgeLabel(pet)
    }, [pet])


    return (
        <div className="relative border-2 nth-[1]:border-t-0 nth-[1]:border-l-0 nth-[2]:border-t-0 nth-[2]:border-r-0 nth-[3]:border-b-0 nth-[3]:border-l-0 nth-[4]:border-b-0 nth-[4]:border-r-0 border-muted overflow-hidden">

            <div className="flex-center-between px-3 py-1">
                {/* <Button
                    onClick={() => removeItem(pet.id)}
                    variant="ghost-destructive" size="icon-xs">
                    <SkullIcon className="size-4" />
                </Button> */}

                <KillPetDialog pet={pet} />

                <div className="flex-row-center gap-x-1">
                    <Button
                        onClick={() => feedPet(pet.id)}
                        disabled={remainingFoodToday === 0}
                        rightIcon={pet.type === 'cat' ? <SoupIcon className="size-4" /> : <BoneIcon className="size-4" />}
                        variant="primary" size="xs">

                        {remainingFoodToday > 0 && (
                            <Typography variant="caption-xxs">
                                {remainingFoodToday}
                            </Typography>
                        )}

                    </Button>

                    <div className="app_container app_gradient backdrop-blur-md py-1 px-2 flex-row-center gap-x-0.5">

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
