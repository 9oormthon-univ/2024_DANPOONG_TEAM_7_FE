import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    originalEnterprises: [],
    filteredEnterprises: [],
    activeFilters: {
        categories: [],
        types: [],
        onoffStore: []
    },
    sortBy: 'default',
    totalFiltered: 0,
    isLoading: false,
    error: null,
    lastUpdated: null  // 타임스탬프 추가
};

const filteredEnterpriseListSlice = createSlice({
    name: 'filteredEnterprise',
    initialState,
    reducers: {
        setFilteredEnterprises: (state, action) => {
            state.originalEnterprises = action.payload;
            state.filteredEnterprises = action.payload;
            state.totalFiltered = action.payload.length;
        },
        
        updateActiveFilters: (state, action) => {
            // 액티브 필터 업데이트
            state.activeFilters = {
                ...state.activeFilters,
                ...action.payload
            };
            
            // 원본 데이터로부터 시작
            let filteredList = [...state.originalEnterprises];

            // 카테고리 필터링
            if (state.activeFilters.categories.length > 0 && 
                !state.activeFilters.categories.includes('전체')) {
                filteredList = filteredList.filter(enterprise => 
                    state.activeFilters.categories.includes(enterprise.socialPurposeType)
                );
            }

            // 유형 필터링
            if (state.activeFilters.types.length > 0 && 
                !state.activeFilters.types.includes('전체')) {
                filteredList = filteredList.filter(enterprise => 
                    state.activeFilters.types.includes(enterprise.field)
                );
            }

            // 온오프 필터링
            if (state.activeFilters.onoffStore.length > 0) {
                filteredList = filteredList.filter(enterprise => 
                    state.activeFilters.onoffStore.includes(enterprise.storeType)
                );
            }

            state.filteredEnterprises = filteredList;
            state.totalFiltered = filteredList.length;
            state.lastUpdated = Date.now();  // 필터링 될 때마다 타임스탬프 업데이트

            console.log('FilteredEnterpriseListSlice - After filtering:', {
                activeFilters: state.activeFilters,
                totalFiltered: state.totalFiltered,
                lastUpdated: state.lastUpdated
            });
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
                lastUpdated: Date.now()  // 필터 초기화시에도 타임스탬프 업데이트
            };
        }
    }
});

export const {
    setFilteredEnterprises,
    updateActiveFilters,
    setSortBy,
    setLoading,
    setError,
    resetFilters
} = filteredEnterpriseListSlice.actions;

export const selectFilteredEnterprises = (state) => state.filteredEnterprise.filteredEnterprises;
export const selectActiveFilters = (state) => state.filteredEnterprise.activeFilters;
export const selectTotalFiltered = (state) => state.filteredEnterprise.totalFiltered;
export const selectSortBy = (state) => state.filteredEnterprise.sortBy;

export default filteredEnterpriseListSlice.reducer;