import { DEFAULT_FOLDERS } from "@/constants/defaultFolders";
import { FoldersRepository } from "../db/folders.repo";
import type { Folder, Website } from "../types";

export async function seedDefaultFolders(): Promise<Folder[]> {
    const existing = await FoldersRepository.getAll();
    if (existing.length > 0) {
        return existing;
    }

    const baseTime = Date.now();
    const foldersToInsert: Folder[] = DEFAULT_FOLDERS.map((f, folderIndex) => ({
        id: baseTime + folderIndex,
        title: f.title,
        order: folderIndex,
        websites: f.websites.map((w, siteIndex) => ({
            id: baseTime + folderIndex * 100 + siteIndex,
            title: w.title,
            url: w.url,
            order: siteIndex,
        })) as Website[],
    }));

    await FoldersRepository.bulkPut(foldersToInsert);

    return foldersToInsert;
}
