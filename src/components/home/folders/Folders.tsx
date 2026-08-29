import { useFolders } from "@/components/settings/components/tabs-details/sites-and-folders/components/folders/hooks/useFolders";
import FolderItem from "./FolderItem";

export default function Folders() {
    // 🌟 Fetch real folders data from Zustand store
    const { data: folders } = useFolders();

    // Don't render anything if there are no folders
    if (folders.length === 0) {
        return null;
    }

    return (
        folders.slice(0, 5).map((f) => f.websites.length > 0 && (
            <FolderItem key={f.id} folder={f} />
        ))
    );
}