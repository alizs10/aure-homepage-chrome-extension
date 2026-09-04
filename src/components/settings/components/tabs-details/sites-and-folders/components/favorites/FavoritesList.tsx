import { useFavorites } from './hooks/useFavorites'
import EditFavorite from './EditFavorite'
import { OrderableList } from '../../OrderableList'
import { BetterTypography } from '@/components/common/BetterTypography'

export default function FavoritesList() {
    // 🌟 Removed maxOrder from destructuring
    const { data, removeItem, sortUp, sortDown } = useFavorites()

    return (
        <OrderableList
            items={data}
            // 🌟 Removed maxOrder prop
            onSortUp={sortUp}
            onSortDown={sortDown}
            onRemove={removeItem}
            removeToastMessage="Favorite deleted!"
            emptyMessage="Add your first favorite"
            renderLeft={(f, i) => (
                <BetterTypography variant="sm" weight="medium" className="line-clamp-1">
                    {i + 1}. {f.title}
                    <span className="text-muted-foreground font-normal">
                        {` (${f.url})`}
                    </span>
                </BetterTypography>
            )}
            renderRight={(f) => <EditFavorite favorite={f} />}
        />
    )
}