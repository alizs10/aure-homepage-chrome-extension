// stores.ts
import { create } from 'zustand';
import type { Pet, PetColor, PetType } from './types';
import { PetRepository } from './db';
import { getRemainingFoodToday, isPetDead } from './helpers';

// 🌟 Cross-Tab Sync Setup
const TAB_ID = typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : Math.random().toString(36).substring(2);

const petsChannel = typeof BroadcastChannel !== 'undefined'
    ? new BroadcastChannel('pets_sync')
    : null;

type PetsSyncMessage = {
    type: 'PETS_SYNC';
    payload: Pet[];
    tabId: string;
};

function broadcastPets(data: Pet[]) {
    if (petsChannel) {
        petsChannel.postMessage({
            type: 'PETS_SYNC',
            payload: data,
            tabId: TAB_ID,
        });
    }
}

if (petsChannel) {
    petsChannel.onmessage = (event: MessageEvent<PetsSyncMessage>) => {
        if (!event.data || event.data.tabId === TAB_ID) return;

        if (event.data.type === 'PETS_SYNC') {
            usePetHouseStore.setState({
                data: event.data.payload,
                loading: false,
            });
        }
    };
}

interface PetHouseState {
    data: Pet[];
    loading: boolean;

    // Actions
    initialize: () => Promise<void>;
    addItem: (name: string, color: PetColor, type: PetType) => Promise<void>;
    removeItem: (id: number) => Promise<void>;
    hardDeleteItem: (id: number) => Promise<void>; // 🌟 NEW
    feedPet: (id: number) => Promise<void>;
}

export const usePetHouseStore = create<PetHouseState>((set, get) => ({
    data: [],
    loading: true,

    initialize: async () => {
        const pets = await PetRepository.getAll();
        set({ data: pets, loading: false });
    },

    addItem: async (name, color, type) => {
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
        broadcastPets(get().data);
    },

    removeItem: async (id) => {
        const pet = get().data.find((p) => p.id === id);
        if (!pet) return;

        const now = Date.now();

        const updated: Pet = {
            ...pet,
            updatedAt: now,
            deletedAt: now,
        };

        await PetRepository.put(updated);
        set((state) => ({
            data: state.data.map((p) => (p.id === id ? updated : p))
        }));
        broadcastPets(get().data);
    },

    // 🌟 NEW: Hard delete action
    hardDeleteItem: async (id) => {
        const pet = get().data.find((p) => p.id === id);

        // Safety guard: Only allow hard deletion if the pet is already dead/removed
        if (!pet || !isPetDead(pet)) {
            console.warn("Cannot hard delete a living pet!");
            return;
        }

        // Permanently remove from Dexie DB
        await PetRepository.remove(id);

        // Remove from Zustand state
        set((state) => ({
            data: state.data.filter((p) => p.id !== id)
        }));
        broadcastPets(get().data);
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
        broadcastPets(get().data);
    }
}));