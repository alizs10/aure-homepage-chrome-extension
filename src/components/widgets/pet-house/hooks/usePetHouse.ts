// hooks/usePetHouse.ts
import { useMemo } from 'react';
import { isPetDead } from '../helpers';
import { usePetHouseStore } from '../store';

export function usePetHouse() {
    // Select state and actions
    const data = usePetHouseStore((state) => state.data);
    const loading = usePetHouseStore((state) => state.loading);
    const addItem = usePetHouseStore((state) => state.addItem);
    const removeItem = usePetHouseStore((state) => state.removeItem);
    const feedPet = usePetHouseStore((state) => state.feedPet);
    const initialize = usePetHouseStore((state) => state.initialize);

    // Compute derived state with useMemo
    const alivePets = useMemo(() => {
        return data.filter(p => !isPetDead(p));
    }, [data]);

    const deadPets = useMemo(() => {
        return data
            .filter(p => isPetDead(p))
            .sort((a, b) => b.createdAt - a.createdAt); // 🌟 Sorts ascending (oldest first)
    }, [data]);

    const catPets = useMemo(() => {
        return data.filter(p => p.type === 'cat');
    }, [data]);

    const dogPets = useMemo(() => {
        return data.filter(p => p.type === 'dog');
    }, [data]);

    // Return the exact same object shape as the old Context
    return {
        data,
        loading,
        alivePets,
        deadPets,
        catPets,
        dogPets,
        addItem,
        removeItem,
        feedPet,
        initialize // Exposed so the root component can trigger data loading
    };
}