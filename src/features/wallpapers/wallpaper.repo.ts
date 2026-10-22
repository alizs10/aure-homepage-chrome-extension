import { db } from "@/lib/db";
import type { Wallpaper } from "@/types";

export class WallpaperRepository {
    async getAll(): Promise<Wallpaper[]> {
        return db.wallpapers.toArray();
    }

    async getById(id: string): Promise<Wallpaper | undefined> {
        return db.wallpapers.get(id);
    }

    async add(wallpaper: Wallpaper): Promise<string> {
        return db.wallpapers.put(wallpaper);
    }

    async delete(id: string): Promise<void> {
        await db.wallpapers.delete(id);
    }
}

export const wallpaperRepository = new WallpaperRepository();
