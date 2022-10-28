import { Select } from '@navikt/ds-react'
import React from 'react'
import { useSelector } from 'react-redux'

import { RootState } from '../../../state/store'

import { useSortBy } from './useSortBy'
import styles from './SortBy.module.css'

type SortBy = 'latest' | 'name'

const SortBy = (): JSX.Element => {
    const filter = useSelector((state: RootState) => state.sortByNotifying)
    const { handleSortChange } = useSortBy()

    return (
        <div className={styles.root}>
            <Select
                className={styles.sortSelect}
                label="Sorter etter"
                aria-label="Sorter etter sykmeldte med varsel"
                value={filter.sortBy}
                onChange={(event) => handleSortChange(event.target.value)}
            >
                <option value="latest">Nyeste</option>
                <option value="name">Navn</option>
            </Select>
        </div>
    )
}

export default SortBy
