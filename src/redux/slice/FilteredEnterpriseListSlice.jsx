// src/redux/features/FilteredEnterpriseListSlice.js

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    // 필터링된 기업 목록
    filteredEnterprises: [],
    // 현재 적용된 필터 상태
    activeFilters: {
        categories: [],
        types: [],
        onoffStore: []
    },
    // 정렬 상태
    sortBy: 'default', // 'review' | 'recommendation' | 'default'
    // 총 필터링된 기업 수
    totalFiltered: 0,
    // 로딩 상태
    isLoading: false,
    // 에러 상태
    error: null
};

const filteredEnterpriseListSlice = createSlice({
    name: 'filteredEnterprise',
    initialState,
    reducers: {
        // 필터링된 기업 목록 설정
        setFilteredEnterprises: (state, action) => {
            state.filteredEnterprises = action.payload;
            state.totalFiltered = action.payload.length;
        },
        
        // 필터 상태 업데이트
        updateActiveFilters: (state, action) => {
            state.activeFilters = {
                ...state.activeFilters,
                ...action.payload
            };
        },
        
        // 정렬 방식 변경
        setSortBy: (state, action) => {
            state.sortBy = action.payload;
        },
        
        // 로딩 상태 설정
        setLoading: (state, action) => {
            state.isLoading = action.payload;
        },
        
        // 에러 상태 설정
        setError: (state, action) => {
            state.error = action.payload;
        },
        
        // 모든 상태 초기화
        resetFilters: (state) => {
            return initialState;
        }
    }
});

// 액션 생성자 내보내기
export const {
    setFilteredEnterprises,
    updateActiveFilters,
    setSortBy,
    setLoading,
    setError,
    resetFilters
} = filteredEnterpriseListSlice.actions;

// 선택자(Selector) 함수들
export const selectFilteredEnterprises = (state) => state.filteredEnterprise.filteredEnterprises;
export const selectActiveFilters = (state) => state.filteredEnterprise.activeFilters;
export const selectTotalFiltered = (state) => state.filteredEnterprise.totalFiltered;
export const selectSortBy = (state) => state.filteredEnterprise.sortBy;

// 리듀서 내보내기
export default filteredEnterpriseListSlice.reducer;