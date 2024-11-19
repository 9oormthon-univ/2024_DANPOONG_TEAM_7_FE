// src/redux/features/SearchSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  searchQuery: '', // 현재 검색어
  searchHistory: [], // 검색 기록
  isSearchModalOpen: false // 검색 모달 상태
};

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
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
    setSearchModalOpen: (state, action) => {
      state.isSearchModalOpen = action.payload;
    },
    clearSearchQuery: (state) => {
      state.searchQuery = '';
    }
  }
});

export const {
  setSearchQuery,
  addToSearchHistory,
  removeFromHistory,
  setSearchModalOpen,
  clearSearchQuery
} = searchSlice.actions;

export default searchSlice.reducer;