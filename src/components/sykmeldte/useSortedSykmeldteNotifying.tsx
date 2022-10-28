import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

import { PreviewSykmeldtFragment } from '../../graphql/queries/graphql.generated'
import useSelectedVirksomhet from '../../hooks/useSelectedSykmeldt'
import { SortByState } from '../../state/sortByNotifyingSlice'
import { RootState } from '../../state/store'
import { DateTitle, getLatestDates, sortedByNotifyingDates } from '../../utils/sortByNotifying'
import { sortByName } from '../../utils/sykmeldtUtils'

import { filterSykmeldteByOrg } from './useFilteredSykmeldte'

export function sortNotifyingSykmeldteBySelectedSort(
    state: SortByState,
    sykmeldte: PreviewSykmeldtFragment[],
): PreviewSykmeldtFragment[] {
    switch (state.sortBy) {
        case 'latest':
            return sortedByNotifyingDates(sykmeldte)
        case 'name':
            return [...sykmeldte].sort(sortByName)
        default:
            return sykmeldte
    }
}

function initialFilterSort(
    sortBy: SortByState,
    virksomhet: string,
    sykmeldte: PreviewSykmeldtFragment[] | null | undefined,
): PreviewSykmeldtFragment[] {
    const filteredByOrg = filterSykmeldteByOrg(virksomhet, sykmeldte ?? [])
    return sortNotifyingSykmeldteBySelectedSort(sortBy, filteredByOrg)
}

function useSortedSykmeldteNotifying(sykmeldte?: PreviewSykmeldtFragment[] | null): {
    sortedSykmeldte: PreviewSykmeldtFragment[]
    notifyingDatesAndText: DateTitle[]
} {
    const sorting = useSelector((state: RootState) => state.sortByNotifying)
    const virksomhet = useSelectedVirksomhet()
    const [sortedSykmeldte, setSortedSykmeldte] = useState(initialFilterSort(sorting, virksomhet, sykmeldte))
    const datesAndText = getLatestDates(sortedSykmeldte)

    useEffect(() => {
        ;(async () => {
            setSortedSykmeldte(initialFilterSort(sorting, virksomhet, sykmeldte ?? []))
        })()
    }, [sykmeldte, sorting, virksomhet])

    return { sortedSykmeldte: sortedSykmeldte ?? [], notifyingDatesAndText: datesAndText }
}

export default useSortedSykmeldteNotifying
