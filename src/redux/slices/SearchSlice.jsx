import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    searchQuery: '',
    searchHistory: [],
    selectedLocation: null,
    displayMode: 'initial',
    lastUpdated: null
};

const searchSlice = createSlice({
    name: 'search',
    initialState,
    reducers: {
        setSearchQuery: (state, action) => {
            state.searchQuery = action.payload;
            state.lastUpdated = Date.now();
        },
        addToSearchHistory: (state, action) => {
            state.searchHistory.unshift({
                searchId: Date.now(),
                query: action.payload,
                searchTime: new Date().toLocaleString()
            });
        },
        removeFromHistory: (state, action) => {
            state.searchHistory = state.searchHistory.filter(
                item => item.searchId !== action.payload
            );
        },
        clearSearchQuery: (state) => {
            state.searchQuery = '';
            state.lastUpdated = null;
        },
        setSelectedLocation: (state, action) => {
            state.selectedLocation = action.payload;
        },
        setDisplayMode: (state, action) => {
            state.displayMode = action.payload;
            state.lastUpdated = Date.now();
        }
    }
});

export const {
    setSearchQuery,
    addToSearchHistory,
    removeFromHistory,
    clearSearchQuery,
    setSelectedLocation,
    setDisplayMode
} = searchSlice.actions;

export default searchSlice.reducer;