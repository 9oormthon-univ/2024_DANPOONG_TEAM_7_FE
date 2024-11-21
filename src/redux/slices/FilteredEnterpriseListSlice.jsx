import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    originalEnterprises: [],
    filteredEnterprises: [],
    activeFilters: {
        categories: [],
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

            // 기존 필터 로직
            if (state.activeFilters.types && 
                state.activeFilters.types.length > 0 && 
                !state.activeFilters.types.includes('전체')) {
                filteredList = filteredList.filter(enterprise => 
                    state.activeFilters.types.includes(enterprise.type)
                );
            }

            // 사회적 목적 필터 로직
            if (state.activeFilters.socialPurpose && 
                state.activeFilters.socialPurpose.length > 0 && 
                !state.activeFilters.socialPurpose.includes('전체')) {
                filteredList = filteredList.filter(enterprise => {
                    // 특수문자 처리를 위해 정규화 함수
                    const normalizeString = (str) => {
                        return str.replace(/\s+/g, '')  // 공백 제거
                                .replace(/[·ㆍ]/g, '·'); // 가운뎃점 통일
                    };
                    
                    // socialPurpose 필드와 비교
                    return state.activeFilters.socialPurpose.some(purpose => 
                        normalizeString(enterprise.socialPurpose) === normalizeString(purpose)
                    );
                });
            }

            // 온/오프라인 필터 로직 수정
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