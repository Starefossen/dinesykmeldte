import { useCallback } from 'react'
import { useDispatch } from 'react-redux'

import sortByNotifyingSlice from '../../../state/sortByNotifyingSlice'

interface UseSortBy {
    handleSortChange: (sortBy: string) => void
}

export function useSortBy(): UseSortBy {
    const dispatch = useDispatch()
    const handleSortChange = useCallback(
        (sortBy: string) => {
            if (sortBy !== 'latest' && sortBy !== 'name') throw Error('Invalid sort by value value')

            dispatch(sortByNotifyingSlice.actions.setSortByNotifying(sortBy))
        },
        [dispatch],
    )

    return { handleSortChange }
}
