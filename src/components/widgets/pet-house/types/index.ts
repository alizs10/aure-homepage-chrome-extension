export type CatColor = "white" | "black" | "orange"
export type DogColor = "white" | "black" | "golden" | "brown" | "gray"

export type PetColor = CatColor | DogColor

export type PetType = "cat" | "dog";

export type PetGeneral = {
    id: number;
    name: string;
    type: PetType;
    hasBeenFeedCount: number;
    createdAt: number;
    updatedAt: number;
    deletedAt: number | null;
}

export interface DogPet extends PetGeneral {
    color: DogColor;
}

export interface CatPet extends PetGeneral {
    color: CatColor;
}

export type Pet = CatPet | DogPet