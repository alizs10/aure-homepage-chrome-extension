import { useEffect, useMemo, useState, type ReactNode } from "react";

import { FavoritesContext } from "../contexts/FavoritesContext";
import { FavoritesRepository } from "../db";
import type { Favorite } from "../types";

export function FavoritesProvider({
    children,
}: {
    children: ReactNode;
}) {
    const [data, setData] = useState<Favorite[]>([]);
    const maxOrder = useMemo(() => {
        return data.reduce((max, f) => Math.max(max, f.order), -1);
    }, [data]);

    useEffect(() => {
        async function load() {
            const favorites = await FavoritesRepository.getAll();
            const sorted = favorites.sort((a, b) => a.order - b.order)
            setData(sorted);
        }

        load();
    }, []);

    async function updateFavorite(
        id: number,
        updater: (favorite: Favorite) => Favorite
    ) {
        const favorite = data.find((n) => n.id === id);

        if (!favorite) return false;

        const updated = updater(favorite);

        await FavoritesRepository.put(updated);

        setData((prev) =>
            prev.map((n) => (n.id === id ? updated : n))
        );

        return true;
    }

    const addItem = async ({ title, url }: Pick<Favorite, "title" | "url">) => {
        const now = Date.now();

        const note: Favorite = {
            id: now,
            title,
            url,
            order: maxOrder + 1
        };

        await FavoritesRepository.put(note);

        setData((prev) => [...prev, note]);
    };

    const removeItem = async (id: number) => {
        await FavoritesRepository.remove(id);

        setData((prev) => prev.filter((n) => n.id !== id));
    };

    const updateItem = async (updated: Omit<Favorite, "order">) => {
        await updateFavorite(updated.id, (favorite) => ({
            ...favorite,
            ...updated
        }));
    };


    const sortUp = async (id: number) => {
        const currentIndex = data.findIndex((item) => item.id === id);
        if (currentIndex <= 0) return;

        const currentItem = data[currentIndex];
        const previousItem = data[currentIndex - 1];

        // Create copies and swap orders
        const updatedCurrent = {
            ...currentItem,
            order: previousItem.order
        };
        const updatedPrevious = {
            ...previousItem,
            order: currentItem.order
        };

        // Update both in IndexedDB
        await FavoritesRepository.put(updatedCurrent);
        await FavoritesRepository.put(updatedPrevious);

        // Update state AND re-sort
        setData((prev) => {
            const newData = prev.map((n) => {
                if (n.id === id) return updatedCurrent;
                if (n.id === previousItem.id) return updatedPrevious;
                return n;
            });
            // Re-sort by order
            return newData.sort((a, b) => a.order - b.order);
        });
    };

    const sortDown = async (id: number) => {
        const currentIndex = data.findIndex((item) => item.id === id);
        if (currentIndex === -1 || currentIndex >= data.length - 1) return;

        const currentItem = data[currentIndex];
        const nextItem = data[currentIndex + 1];

        // Create copies and swap orders
        const updatedCurrent = {
            ...currentItem,
            order: nextItem.order
        };
        const updatedNext = {
            ...nextItem,
            order: currentItem.order
        };

        // Update both in IndexedDB
        await FavoritesRepository.put(updatedCurrent);
        await FavoritesRepository.put(updatedNext);

        // Update state AND re-sort
        setData((prev) => {
            const newData = prev.map((n) => {
                if (n.id === id) return updatedCurrent;
                if (n.id === nextItem.id) return updatedNext;
                return n;
            });
            // Re-sort by order
            return newData.sort((a, b) => a.order - b.order);
        });
    };


    return (
        <FavoritesContext.Provider
            value={{
                data,
                addItem,
                removeItem,
                updateItem,
                sortUp,
                sortDown,
                maxOrder
            }}
        >
            {children}
        </FavoritesContext.Provider>
    );
}