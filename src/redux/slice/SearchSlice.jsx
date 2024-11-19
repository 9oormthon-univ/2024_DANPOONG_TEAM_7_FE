// src/redux/features/SearchSlice.jsx
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  searchQuery: '',
  searchHistory: [],
  isSearchModalOpen: false,
  lastUpdated: null  // 타임스탬프 추가
};

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
      state.lastUpdated = Date.now();  // 검색할 때마다 타임스탬프 업데이트
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
      state.lastUpdated = null;  // 검색어 초기화시 타임스탬프도 초기화
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