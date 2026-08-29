export type Website = {
    id: number;
    title: string;
    url: string;
    order: number; // 0, 1, 2, 3, ...
}

export type Favorite = Website;

export type Folder = {
    id: number;
    title: string;
    websites: Website[];
    order: number;
}