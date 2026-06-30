import { ChartNoAxesColumnIcon, InfoIcon, PlusIcon } from "lucide-react";
import Button from "../../common/Button";
import { Typography } from "../../common/Typography";
import Cat from "./components/Cat";
import Cell from "./components/Cell";
import Dog from "./components/Dog";
import PetMovement from "./components/PetMovement";
import InfoPopup from "./components/InfoPopup";
import NewPetPopup from "./components/NewPetPopup";
import PetsCells from "./components/PetsCells";
import { PetHouseProvider } from "./contexts/PetHouseContext";
import StatsPopup from "./components/StatsPopup";

export default function PetHouse() {
    return (
        <PetHouseProvider>

            <div className="app_container app_gradient backdrop-blur-md col-span-1 row-span-1 flex flex-col h-full relative">

                <div id="pet-popup-root" className="absolute inset-0 pointer-events-none" />


                <div className="flex-center-between p-5">


                    <Typography className="capitalize" variant="h2">
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
                        <InfoPopup />
                    </div>
                </div>

                <PetsCells />
            </div>
        </PetHouseProvider>

    );
}