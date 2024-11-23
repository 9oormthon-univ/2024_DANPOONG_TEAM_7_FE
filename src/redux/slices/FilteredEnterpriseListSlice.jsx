import { createSlice } from '@reduxjs/toolkit';
import { fetchEnterprises } from './EnterpriseSlice';

const initialState = {
    originalEnterprises: [],
    filteredEnterprises: [],
    activeFilters: {
        types: [],
        socialPurpose: [],
        onoffStore: []
    },
    sortBy: 'default',
    totalFiltered: 0,
    isLoading: false,
    error: null,
    lastUpdated: null,
    displayMode: 'initial',
    shouldShowMarkers: false
};

const filteredEnterpriseListSlice = createSlice({
    name: 'filteredEnterprise',
    initialState,
    reducers: {
        setFilteredEnterprises: (state, action) => {
            state.originalEnterprises = action.payload;
            state.filteredEnterprises = action.payload;
            state.totalFiltered = action.payload.length;
            state.lastUpdated = Date.now();
        },
        
        updateActiveFilters: (state, action) => {
            state.activeFilters = {
                ...state.activeFilters,
                ...action.payload
            };
            
            let filteredList = [...state.originalEnterprises];

            if (state.activeFilters.types && 
                state.activeFilters.types.length > 0 && 
                !state.activeFilters.types.includes('전체')) {
                filteredList = filteredList.filter(enterprise => 
                    state.activeFilters.types.includes(enterprise.type)
                );
            }

            if (state.activeFilters.socialPurpose && 
                state.activeFilters.socialPurpose.length > 0 && 
                !state.activeFilters.socialPurpose.includes('전체')) {
                filteredList = filteredList.filter(enterprise => {
                    // null 체크 추가
                    const normalizeString = (str) => {
                        if (!str) return '';  // null/undefined 값에 대해 빈 문자열 반환
                        return str.replace(/\s+/g, '')
                                .replace(/[·ㆍ]/g, '·');
                    };
                    
                    return state.activeFilters.socialPurpose.some(purpose => 
                        normalizeString(enterprise.socialPurpose) === normalizeString(purpose)
                    );
                });
            }

            if (state.activeFilters.onoffStore && 
                state.activeFilters.onoffStore.length > 0) {
                filteredList = filteredList.filter(enterprise => {
                    const hasWebsite = enterprise.website !== null && 
                                     enterprise.website !== undefined && 
                                     enterprise.website !== '';
                    
                    if (state.activeFilters.onoffStore.includes('온라인')) {
                        return hasWebsite;
                    } else if (state.activeFilters.onoffStore.includes('오프라인')) {
                        return !hasWebsite;
                    }
                    return true;
                });
            }

            state.filteredEnterprises = filteredList;
            state.totalFiltered = filteredList.length;
            state.lastUpdated = Date.now();
            state.shouldShowMarkers = true;
        },
        
        setSortBy: (state, action) => {
            state.sortBy = action.payload;
        },
        
        setLoading: (state, action) => {
            state.isLoading = action.payload;
        },
        
        setError: (state, action) => {
            state.error = action.payload;
        },
        
        resetFilters: (state) => {
            return {
                ...initialState,
                originalEnterprises: state.originalEnterprises,
                filteredEnterprises: state.originalEnterprises,
                totalFiltered: state.originalEnterprises.length,
                lastUpdated: Date.now(),
                shouldShowMarkers: false
            };
        },

        setDisplayMode: (state, action) => {
            state.displayMode = action.payload;
            state.lastUpdated = Date.now();
        },

        setShouldShowMarkers: (state, action) => {
            state.shouldShowMarkers = action.payload;
        },
        extraReducers: (builder) => {
            builder
                .addCase(fetchEnterprises.fulfilled, (state, action) => {
                    state.originalEnterprises = action.payload;
                    state.filteredEnterprises = action.payload;
                    state.totalFiltered = action.payload.length;
                    state.lastUpdated = Date.now();
                });
        }
    }
});

export const {
    setFilteredEnterprises,
    updateActiveFilters,
    setSortBy,
    setLoading,
    setError,
    resetFilters,
    setDisplayMode,
    setShouldShowMarkers
} = filteredEnterpriseListSlice.actions;

export const selectFilteredEnterprises = (state) => state.filteredEnterprise.filteredEnterprises;
export const selectActiveFilters = (state) => state.filteredEnterprise.activeFilters;
export const selectTotalFiltered = (state) => state.filteredEnterprise.totalFiltered;
export const selectSortBy = (state) => state.filteredEnterprise.sortBy;
export const selectDisplayMode = (state) => state.filteredEnterprise.displayMode;
export const selectLastUpdated = (state) => state.filteredEnterprise.lastUpdated;
export const selectShouldShowMarkers = (state) => state.filteredEnterprise.shouldShowMarkers;

export default filteredEnterpriseListSlice.reducer;