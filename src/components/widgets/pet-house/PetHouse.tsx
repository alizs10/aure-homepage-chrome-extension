import { Typography } from "../../common/Typography";
import PetRulesPopup from "./components/PetRulesPopup";
import NewPetPopup from "./components/NewPetPopup";
import PetsCells from "./components/PetsCells";
import StatsPopup from "./components/StatsPopup";

export default function PetHouse() {
    return (
        <div className="w-full app_container app_gradient app-blur lg:col-span-1 flex flex-col min-h-60  max-h-full relative lg:row-span-1">

            <div id="pet-popup-root" className="absolute inset-0 pointer-events-none" />


            <div className="flex-center-between p-5">


                <Typography className='capitalize' variant="h2">
                    pet house
                </Typography>


                <div className="flex-row-center gap-x-1">
                    {/* <Button size="icon-sm">
                        <PlusIcon className="size-5" />
                    </Button> */}
                    <NewPetPopup />
                    {/* <Button size="icon-sm" variant="ghost">
                        <InfoIcon className="size-5" />
                    </Button> */}

                    <StatsPopup />
                    <PetRulesPopup />
                </div>
            </div>

            <PetsCells />
        </div>

    );
}