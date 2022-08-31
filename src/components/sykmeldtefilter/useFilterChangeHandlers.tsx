import { useCallback } from 'react';
import { useDispatch } from 'react-redux';

import filterSlice from '../../state/filterSlice';

interface UseFilterChangeHandlers {
    handleNameFilterChange: (name: string) => void;
    handleShowChange: (show: string) => void;
    handleSortChange: (sortBy: string) => void;
}

export function useFilterChangeHandlers(): UseFilterChangeHandlers {
    const dispatch = useDispatch();
    const handleNameFilterChange = useCallback(
        (name: string) => dispatch(filterSlice.actions.setName(name)),
        [dispatch],
    );
    const handleShowChange = useCallback(
        (show: string) => {
            if (
                show !== 'all' &&
                show !== 'sykmeldte' &&
                show !== 'sykmeldte-per-virksomhet' &&
                show !== 'friskmeldte' &&
                show !== 'graderte'
            )
                throw Error(`Invalid show value (${show ?? '[Missing]'})`);

            dispatch(filterSlice.actions.setShow(show));
        },
        [dispatch],
    );
    const handleSortChange = useCallback(
        (sortBy: string) => {
            if (sortBy !== 'date' && sortBy !== 'name') throw Error('Invalid sort by value value');

            dispatch(filterSlice.actions.setSortBy(sortBy));
        },
        [dispatch],
    );

    return { handleNameFilterChange, handleShowChange, handleSortChange };
}
