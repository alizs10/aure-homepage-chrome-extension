import { useContext } from "react";
import { PetHouseContext } from "../contexts/PetHouseContext";

export function usePetHouse() {
    const context = useContext(PetHouseContext);
    if (context === undefined) {
        throw new Error('usePetHouse must be used within a PetHouseProvider');
    }
    return context;
}