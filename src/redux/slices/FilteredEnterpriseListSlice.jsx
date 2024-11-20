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
   lastUpdated: null,
   displayMode: 'initial',
   shouldShowMarkers: false // 새로운 상태 추가
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
           // 마커 표시 여부는 변경하지 않음
       },
       
       updateActiveFilters: (state, action) => {
           state.activeFilters = {
               ...state.activeFilters,
               ...action.payload
           };
           
           let filteredList = [...state.originalEnterprises];

           if (state.activeFilters.categories.length > 0 && 
               !state.activeFilters.categories.includes('전체')) {
               filteredList = filteredList.filter(enterprise => 
                   state.activeFilters.categories.includes(enterprise.field)
               );
           }

           if (state.activeFilters.types.length > 0 && 
               !state.activeFilters.types.includes('전체')) {
               filteredList = filteredList.filter(enterprise => 
                   state.activeFilters.types.includes(enterprise.socialPurposeType)
               );
           }

           if (state.activeFilters.onoffStore.length > 0) {
               filteredList = filteredList.filter(enterprise => 
                   state.activeFilters.onoffStore.includes(enterprise.storeType)
               );
           }

           state.filteredEnterprises = filteredList;
           state.totalFiltered = filteredList.length;
           state.lastUpdated = Date.now();
           state.shouldShowMarkers = true; // 필터 적용 시에만 마커 표시
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
               shouldShowMarkers: false // 필터 초기화 시 마커 숨김
           };
       },

       setDisplayMode: (state, action) => {
           state.displayMode = action.payload;
           state.lastUpdated = Date.now();
       },

       // 새로운 리듀서 추가
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