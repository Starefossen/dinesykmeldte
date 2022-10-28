import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface SortByState {
    sortBy: 'latest' | 'name'
}

const initialState: SortByState = {
    sortBy: 'latest',
}

export const sortByNotifyingSlice = createSlice({
    name: 'sortByNotifying',
    initialState,
    reducers: {
        setSortByNotifying: (state, action: PayloadAction<SortByState['sortBy']>) => {
            state.sortBy = action.payload
        },
    },
})

export default sortByNotifyingSlice
