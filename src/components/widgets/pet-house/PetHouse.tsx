import { BetterTypography } from "@/components/common/BetterTypography";
import NewPetPopup from "./components/NewPetPopup";
import PetRulesPopup from "./components/PetRulesPopup";
import PetsCells from "./components/PetsCells";
import StatsPopup from "./components/StatsPopup";

export default function PetHouse() {
    return (
        // 🌟 row-span-1 makes it exactly 15rem (h-60)
        <div className="w-full sm:col-span-1 row-span-1 flex flex-col rounded-3xl liquid-glass h-full gap-y-4 overflow-clip">
            <div className="flex-center-between p-5">
                <BetterTypography className='capitalize text-nowrap' variant='14-16-20' weight='semibold' as="h3">
                    pet house
                </BetterTypography>

                <div className="flex-row-center gap-x-1">
                    <NewPetPopup />
                    <StatsPopup />
                    <PetRulesPopup />
                </div>
            </div>

            <PetsCells />
        </div>
    );
}