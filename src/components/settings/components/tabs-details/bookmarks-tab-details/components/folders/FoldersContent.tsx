import { BetterTypography } from "@/components/common/BetterTypography";
import AddNewFolder from "./AddNewFolder";
import FoldersList from "./FoldersList";
import { useFolders } from "@/features/bookmarks";
import Badge from "@/components/ui/Badge";

export default function FoldersContent() {
  const { data: folders } = useFolders();

  return (
    <div className="flex flex-col gap-y-3">
      <div className="flex-center-between">
        <div className="flex items-center gap-x-2">
          <BetterTypography variant="md" weight="semibold" as="h3">
            Folders
          </BetterTypography>

          <Badge variant="secondary" size="xs">
            {folders.length}/5
          </Badge>
        </div>

        <AddNewFolder />
      </div>

      <FoldersList />
    </div>
  );
}
