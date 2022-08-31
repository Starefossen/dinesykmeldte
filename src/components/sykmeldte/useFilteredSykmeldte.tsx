import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { PreviewSykmeldtFragment } from '../../graphql/queries/graphql.generated';
import { sortByDate, sortByName, sortByOrgName } from '../../utils/sykmeldtUtils';
import useSelectedVirksomhet from '../../hooks/useSelectedSykmeldt';
import { RootState } from '../../state/store';
import { FilterState } from '../../state/filterSlice';

async function fuzzyFilterSykmeldteByName(
    filters: FilterState,
    sykmeldte: PreviewSykmeldtFragment[],
): Promise<{ result: PreviewSykmeldtFragment[]; hasFuzzySearched: boolean }> {
    if (!filters.name) return { result: sykmeldte, hasFuzzySearched: false };

    const value = filters.name;
    const Fuse = (await import('fuse.js')).default;
    const fuse = new Fuse(sykmeldte, { keys: ['navn'], threshold: 0.4 });

    const result = fuse.search(value);

    return { result: result.map((it) => it.item), hasFuzzySearched: true };
}

function sortSykmeldteBySelectedSort(
    filters: FilterState,
    sykmeldte: PreviewSykmeldtFragment[],
): PreviewSykmeldtFragment[] {
    switch (filters.sortBy) {
        case 'date':
            return [...sykmeldte].sort(sortByDate);
        case 'name':
            return [...sykmeldte].sort(sortByName);
    }
}

function sortSykmeldtePerOrgBySelectedSort(
    filters: FilterState,
    sykmeldte: PreviewSykmeldtFragment[],
): PreviewSykmeldtFragment[] {
    switch (filters.sortBy) {
        case 'date':
            return [...sykmeldte].sort((a, b) => sortByOrgName(a, b) || sortByDate(a, b));
        case 'name':
            return [...sykmeldte].sort((a, b) => sortByOrgName(a, b) || sortByName(a, b));
    }
}

function filterSykmeldteBySelectedFilter(
    filters: FilterState,
    sykmeldte: PreviewSykmeldtFragment[],
): PreviewSykmeldtFragment[] {
    switch (filters.show) {
        case 'all':
            return sykmeldte;
        case 'sykmeldte':
            return sykmeldte.filter((it) => !it.friskmeldt);
        case 'friskmeldte':
            return sykmeldte.filter((it) => it.friskmeldt);
        case 'graderte':
            return sykmeldte.filter((it) =>
                it.sykmeldinger.some((it) => it.perioder.some((it) => it.__typename === 'Gradert')),
            );
        case 'sykmeldte-per-virksomhet':
            return [...sykmeldte].filter((it) => !it.friskmeldt).sort(sortByOrgName);
    }
}

export function filterSykmeldteByOrg(
    selectedOrg: 'all' | string,
    sykmeldte: PreviewSykmeldtFragment[],
): PreviewSykmeldtFragment[] {
    if (selectedOrg === 'all') return sykmeldte;

    return sykmeldte.filter((it) => it.orgnummer === selectedOrg);
}

function initialFilterSort(
    filter: FilterState,
    virksomhet: string,
    sykmeldte: PreviewSykmeldtFragment[] | null | undefined,
): PreviewSykmeldtFragment[] {
    const filteredByOrg = filterSykmeldteByOrg(virksomhet, sykmeldte ?? []);
    return sortSykmeldteBySelectedSort(filter, filteredByOrg);
}

function useFilteredSykmeldte(sykmeldte?: PreviewSykmeldtFragment[] | null): PreviewSykmeldtFragment[] {
    const filter = useSelector((state: RootState) => state.filter);
    const virksomhet = useSelectedVirksomhet();
    const [filterResult, setFilterResult] = useState(initialFilterSort(filter, virksomhet, sykmeldte));

    useEffect(() => {
        (async () => {
            if (!filter.dirty) {
                setFilterResult(initialFilterSort(filter, virksomhet, sykmeldte ?? []));
                return;
            }

            const filteredByOrg = filterSykmeldteByOrg(virksomhet, sykmeldte ?? []);
            const { result, hasFuzzySearched } = await fuzzyFilterSykmeldteByName(filter, filteredByOrg);
            const filteredByShow = filterSykmeldteBySelectedFilter(filter, result);

            let sorted: PreviewSykmeldtFragment[] = filteredByShow;
            if (!hasFuzzySearched && filter.show !== 'sykmeldte-per-virksomhet') {
                sorted = sortSykmeldteBySelectedSort(filter, filteredByShow);
            } else if (filter.show === 'sykmeldte-per-virksomhet') {
                sorted = sortSykmeldtePerOrgBySelectedSort(filter, filteredByShow);
            }

            setFilterResult(sorted);
        })();
    }, [sykmeldte, filter, virksomhet]);

    return filterResult ?? [];
}

export default useFilteredSykmeldte;
