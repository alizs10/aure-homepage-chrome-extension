import { BetterTypography } from "@/components/common/BetterTypography";
import AddNewFolder from "./AddNewFolder";
import FoldersList from "./FoldersList";

export default function FoldersContent() {
  return (
    <div className="flex flex-col gap-y-3">
      <div className="flex-center-between">
        <BetterTypography variant="md" weight="semibold" as="h3">
          Folders
        </BetterTypography>

        <AddNewFolder />
      </div>

      <FoldersList />
    </div>
  );
}
