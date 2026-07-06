// contexts/PetHouseContext.tsx
import { createContext } from 'react';
import type { Pet, PetColor, PetType } from '../types';

interface PetHouseContextType {
    data: Pet[];
    alivePets: Pet[];
    catPets: Pet[];
    dogPets: Pet[];
    addItem: (name: string, color: PetColor, type: PetType) => void;
    removeItem: (id: number) => void;
    feedPet: (id: number) => void;
}

export const PetHouseContext = createContext<PetHouseContextType | undefined>(undefined);



