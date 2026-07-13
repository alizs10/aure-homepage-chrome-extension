// stores.ts
import { create } from 'zustand';
import type { Pet, PetColor, PetType } from './types';
import { PetRepository } from './db';
import { getRemainingFoodToday, isPetDead } from './helpers';

interface PetHouseState {
    data: Pet[];
    loading: boolean;

    // Actions
    initialize: () => Promise<void>;
    addItem: (name: string, color: PetColor, type: PetType) => Promise<void>;
    removeItem: (id: number) => Promise<void>;
    feedPet: (id: number) => Promise<void>;
}

export const usePetHouseStore = create<PetHouseState>((set, get) => ({
    data: [],
    loading: true,

    // Load data on app start
    initialize: async () => {
        const pets = await PetRepository.getAll();
        set({ data: pets, loading: false });
    },

    addItem: async (name, color, type) => {
        // Compute alive pets on the fly using get() to check the limit
        const currentData = get().data;
        const alivePets = currentData.filter(
            p => !isPetDead(p) && (p.deletedAt === null || p.deletedAt === undefined)
        );

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
        set((state) => ({ data: [...state.data, pet] }));
    },

    removeItem: async (id) => {
        const pet = get().data.find((p) => p.id === id);
        if (!pet) return;

        const now = Date.now();

        // Keeping your exact logic: increments feed count and sets deletedAt
        const updated: Pet = {
            ...pet,
            hasBeenFeedCount: pet.hasBeenFeedCount + 1,
            updatedAt: now,
            deletedAt: now,
        };

        await PetRepository.put(updated);
        set((state) => ({
            data: state.data.map((p) => (p.id === id ? updated : p))
        }));
    },

    feedPet: async (id) => {
        const pet = get().data.find((p) => p.id === id);
        if (!pet) return;

        if (getRemainingFoodToday(pet) <= 0) return;

        const updated: Pet = {
            ...pet,
            hasBeenFeedCount: pet.hasBeenFeedCount + 1,
            updatedAt: Date.now(),
        };

        await PetRepository.put(updated);
        set((state) => ({
            data: state.data.map((p) => (p.id === id ? updated : p))
        }));
    }
}));