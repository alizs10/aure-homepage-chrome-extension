import { BetterTypography } from '@/components/common/BetterTypography'
import AddNewFolder from './AddNewFolder'
import FoldersList from './FoldersList'

export default function FoldersContent() {
    return (
        <>
            <div className="flex-center-between mt-4 pt-6 ">
                <BetterTypography variant="md" weight="medium">
                    Folders
                </BetterTypography>

                <AddNewFolder />
            </div>

            <FoldersList />
        </>
    )
}