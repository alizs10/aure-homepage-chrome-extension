// contexts/FavoritesContext.tsx
import { createContext } from 'react';
import type { Favorite } from '../types';

interface FavoritesContextType {
    data: Favorite[];
    addItem: ({ title, url }: Pick<Favorite, "title" | "url">) => void;
    removeItem: (id: number) => void;
    updateItem: (updated: Omit<Favorite, "order">) => void;
    sortUp: (id: number) => void;
    sortDown: (id: number) => void;
    maxOrder: number;

}

export const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);