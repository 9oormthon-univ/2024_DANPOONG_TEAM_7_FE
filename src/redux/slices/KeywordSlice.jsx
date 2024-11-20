//KeywordSlice.jsx
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    selectedKeywords: [], // [{keyword: string, category: string}] 형태로 저장
    currentEnterprise: {
        name: '',
        type: ''
    },
    selectedCount: 0  // 선택된 키워드 개수 추적 (선택사항)
};

const keywordSlice = createSlice({
    name: 'keyword',
    initialState,
    reducers: {
        setSelectedKeywords: (state, action) => {
            state.selectedKeywords = action.payload;
            state.selectedCount = action.payload.length;  // 개수 업데이트
        },
        addKeyword: (state, action) => {
            const newKeyword = action.payload;
            if (!state.selectedKeywords.some(k => k.keyword === newKeyword.keyword)) {
                state.selectedKeywords.push(newKeyword);
                state.selectedCount += 1;  // 개수 증가
            }
        },
        removeKeyword: (state, action) => {
            const keywordToRemove = action.payload;
            state.selectedKeywords = state.selectedKeywords.filter(
                k => k.keyword !== keywordToRemove.keyword
            );
            state.selectedCount = state.selectedKeywords.length;  // 개수 업데이트
        },
        clearKeywords: (state) => {
            state.selectedKeywords = [];
            state.selectedCount = 0;  // 개수 초기화
        },
        setCurrentEnterprise: (state, action) => {  // 기업 정보 설정 추가
            state.currentEnterprise = action.payload;
        }
    }
});

export const {
    setSelectedKeywords,
    addKeyword,
    removeKeyword,
    clearKeywords,
    setCurrentEnterprise  // export 추가
} = keywordSlice.actions;

// 선택자(selector) 함수들 추가 (선택사항)
export const selectKeywords = (state) => state.keyword.selectedKeywords;
export const selectKeywordCount = (state) => state.keyword.selectedCount;
export const selectCurrentEnterprise = (state) => state.keyword.currentEnterprise;

export default keywordSlice.reducer;