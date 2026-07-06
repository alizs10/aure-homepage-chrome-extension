import { useEffect, useMemo, useState, type ReactNode } from "react";
import type { Pet, PetColor, PetType } from "../types";
import { getRemainingFoodToday, isPetDead } from "../helpers";
import { storage } from "@/lib/storage";
import { STORAGE_KEYS } from "@/constants/storage_keys";
import { PetHouseContext } from "../contexts/PetHouseContext";

const STORAGE_KEY = STORAGE_KEYS.petHouse


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
            const result = await storage.get<Pet[]>(STORAGE_KEY);
            console.log(result);
            setData(result ?? []);
        };
        loadData();
    }, []);

    // Save data whenever it changes
    useEffect(() => {
        const saveData = async () => {
            await storage.set(STORAGE_KEY, data);
        };
        saveData();
    }, [data]);

    const addItem = (name: string, color: PetColor, type: PetType) => {

        console.log(data.length)

        if (data.length >= 4) return;

        const now = Date.now();
        const newItem: Pet = {
            id: Date.now(),
            name,
            color,
            type,
            hasBeenFeedCount: 0,
            createdAt: now,
            updatedAt: now,
            deletedAt: null,
        };
        setData(prev => [...prev, newItem]);
    };

    const removeItem = (id: number) => {
        setData(prev => {
            const dataIns = [...prev];
            const updatableIndex = dataIns.findIndex(d => d.id === id);
            if (updatableIndex !== -1) {
                const updatable = dataIns[updatableIndex];

                const now = Date.now();
                updatable.hasBeenFeedCount++;
                updatable.updatedAt = now;
                updatable.deletedAt = now;

                console.log(updatable)
            }
            return dataIns;
        });
    };

    const feedPet = (id: number) => {

        setData(prev => {
            const dataIns = [...prev];
            const updatableIndex = dataIns.findIndex(d => d.id === id);
            if (updatableIndex !== -1) {
                const updatable = dataIns[updatableIndex];

                const remainingFoodToday = getRemainingFoodToday(updatable)

                if (remainingFoodToday > 0) {
                    updatable.hasBeenFeedCount++;
                    updatable.updatedAt = Date.now();
                }

            }
            return dataIns;
        });

    }



    return (
        <PetHouseContext.Provider value={{ data, alivePets, catPets, dogPets, addItem, removeItem, feedPet }}>
            {children}
        </PetHouseContext.Provider>
    );
}