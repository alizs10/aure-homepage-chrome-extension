import { useEffect, useMemo, useState, type ReactNode } from "react";
import { PetHouseContext } from "../contexts/PetHouseContext";
import { PetRepository } from "../db";
import { getRemainingFoodToday, isPetDead } from "../helpers";
import type { Pet, PetColor, PetType } from "../types";



export function PetHouseProvider({ children }: { children: ReactNode }) {
    const [data, setData] = useState<Pet[]>([]);


    const alivePets = useMemo(() => {
        return data.filter(p => (!isPetDead(p) && (p.deletedAt === null || p.deletedAt === undefined)))
    }, [data])


    const catPets = useMemo(() => {
        return data.filter(p => p.type === 'cat')
    }, [data])

    const dogPets = useMemo(() => {
        return data.filter(p => p.type === 'dog')
    }, [data])



    // Load data on mount
    useEffect(() => {
        const loadData = async () => {
            const pets = await PetRepository.getAll();
            setData(pets);
        };
        loadData();
    }, []);

    /**
   * Updates a pet in both IndexedDB and React state.
   */
    async function updatePet(
        id: number,
        updater: (pet: Pet) => Pet
    ): Promise<boolean> {
        const pet = data.find((p) => p.id === id);

        if (!pet) return false;

        const updated = updater(pet);

        await PetRepository.put(updated);

        setData((prev) =>
            prev.map((p) => (p.id === id ? updated : p))
        );

        return true;
    }



    const addItem = async (
        name: string,
        color: PetColor,
        type: PetType
    ) => {
        if (alivePets.length >= 4) return;

        const now = Date.now();

        const pet: Pet = {
            id: now,
            name,
            color,
            type,
            hasBeenFeedCount: 0,
            createdAt: now,
            updatedAt: now,
            deletedAt: null,
        };

        await PetRepository.put(pet);

        setData((prev) => [...prev, pet]);
    };

    const removeItem = async (id: number) => {
        await updatePet(id, (pet) => {
            const now = Date.now();

            return {
                ...pet,
                hasBeenFeedCount: pet.hasBeenFeedCount + 1,
                updatedAt: now,
                deletedAt: now,
            };
        });
    };

    const feedPet = async (id: number) => {
        await updatePet(id, (pet) => {
            if (getRemainingFoodToday(pet) <= 0) {
                return pet;
            }

            return {
                ...pet,
                hasBeenFeedCount: pet.hasBeenFeedCount + 1,
                updatedAt: Date.now(),
            };
        });
    };



    return (
        <PetHouseContext.Provider value={{ data, alivePets, catPets, dogPets, addItem, removeItem, feedPet }}>
            {children}
        </PetHouseContext.Provider>
    );
}