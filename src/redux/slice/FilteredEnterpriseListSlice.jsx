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
   displayMode: 'initial' // displayMode 추가
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
           state.displayMode = 'enterprises'; // 데이터 설정 시 displayMode 변경
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
           state.lastUpdated = Date.now();
           state.displayMode = 'enterprises'; // 필터링 시 displayMode 변경

           console.log('FilteredEnterpriseListSlice - After filtering:', {
               activeFilters: state.activeFilters,
               totalFiltered: state.totalFiltered,
               lastUpdated: state.lastUpdated,
               displayMode: state.displayMode
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
               totalFiltered: state.originalEnterprises.length,
               lastUpdated: Date.now(),
               displayMode: 'enterprises' // 필터 초기화 시에도 displayMode 설정
           };
       },

       // displayMode를 직접 설정할 수 있는 리듀서 추가
       setDisplayMode: (state, action) => {
           state.displayMode = action.payload;
           state.lastUpdated = Date.now();
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
   setDisplayMode // 새로운 액션 export
} = filteredEnterpriseListSlice.actions;

// 기존 selector들
export const selectFilteredEnterprises = (state) => state.filteredEnterprise.filteredEnterprises;
export const selectActiveFilters = (state) => state.filteredEnterprise.activeFilters;
export const selectTotalFiltered = (state) => state.filteredEnterprise.totalFiltered;
export const selectSortBy = (state) => state.filteredEnterprise.sortBy;

// displayMode를 위한 새로운 selector
export const selectDisplayMode = (state) => state.filteredEnterprise.displayMode;
export const selectLastUpdated = (state) => state.filteredEnterprise.lastUpdated;

export default filteredEnterpriseListSlice.reducer;