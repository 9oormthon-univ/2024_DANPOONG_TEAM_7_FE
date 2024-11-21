// src/redux/features/SearchSlice.jsx
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    searchQuery: '',
  searchHistory: [],
    isSearchModalOpen: false,
  reviewData: [], 
  bookmarkData: [],
    selectedLocation: null,
  displayMode: 'initial',
  lastUpdated: null  // 타임스탬프 추가
};

const searchSlice = createSlice({
    name: 'search',
    initialState,
    reducers: {
    //검색
        setSearchQuery: (state, action) => {
            state.searchQuery = action.payload;
      state.lastUpdated = Date.now();  // 검색할 때마다 타임스탬프 업데이트
    },
    //검색기록
    addToSearchHistory: (state, action) => {
      state.searchHistory.unshift({
        searchId: Date.now(),
        query: action.payload,
        searchTime: new Date().toLocaleString()
      });
    },
    //검색기록 제거
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
    },
    //내장소
        setReviewData: (state, action) => {
            state.reviewData = action.payload;
        },
    //즐겨찾기
        setBookmarkData: (state, action) => {
            state.bookmarkData = action.payload;
        },
    //선택한 장소
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
    setSearchModalOpen,
  clearSearchQuery,
    setReviewData,
    setBookmarkData,
  setSelectedLocation,
  setDisplayMode
} = searchSlice.actions;

export default searchSlice.reducer;