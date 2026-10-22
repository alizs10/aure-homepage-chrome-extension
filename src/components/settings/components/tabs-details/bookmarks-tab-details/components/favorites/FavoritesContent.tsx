import { BetterTypography } from '@/components/common/BetterTypography'
import React from 'react'
import AddNewFavorite from './AddNewFavorite'
import FavoritesList from './FavoritesList'

export default function FavoritesContent() {
    return (
        <>

            <div className="flex-center-between mt-4 pt-6 ">
                <BetterTypography variant="md" weight="medium">
                    Favorites websites
                </BetterTypography>

                <AddNewFavorite />
            </div>

            <FavoritesList />

        </>
    )
}
