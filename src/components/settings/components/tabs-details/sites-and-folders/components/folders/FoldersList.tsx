import { useFolders } from './hooks/useFolders'
import EditFolder from './EditFolder'
import ManageFolder from './ManageFolder'
import { OrderableList } from '../../OrderableList'
import { BetterTypography } from '@/components/common/BetterTypography'

export default function FoldersList() {
    const { data, removeItem, sortUp, sortDown } = useFolders()

    return (
        <OrderableList
            items={data}
            onSortUp={sortUp}
            onSortDown={sortDown}
            onRemove={removeItem}
            removeToastMessage="Folder deleted!"
            emptyMessage="Add your first folder"
            renderLeft={(f, i) => (
                <BetterTypography variant="sm" weight="medium" className="line-clamp-1">
                    {i + 1}. {f.title}
                    <span className="text-muted-foreground font-normal">
                        {` (${f.websites.length} websites)`}
                    </span>
                </BetterTypography>
            )}
            renderRight={(f) => (
                <>
                    <ManageFolder folder={f} />
                    <EditFolder folder={f} />
                </>
            )}
        />
    )
}