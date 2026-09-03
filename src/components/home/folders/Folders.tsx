import { useFolders } from "@/components/settings/components/tabs-details/sites-and-folders/components/folders/hooks/useFolders";
import FolderItem from "./FolderItem";

export default function Folders() {
    const { data: folders } = useFolders();

    if (folders.length === 0) return null;

    return (
        <>
            {folders.slice(0, 5).map((f) => f.websites.length > 0 && (
                <FolderItem key={f.id} folder={f} />
            ))}
        </>
    );
}