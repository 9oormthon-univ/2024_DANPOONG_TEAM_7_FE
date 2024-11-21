// redux/slices/EditSlice.js
import { createSlice } from '@reduxjs/toolkit';

const editSlice = createSlice({
    name: 'edit',
    initialState: {
        selectedKeywords: null,
        reviewContent: null,
        companyInfo: null  // 기업 정보도 저장할 수 있음
    },
    reducers: {
        setSelectedKeywords: (state, action) => {
            state.selectedKeywords = action.payload;
        },
        setReviewContent: (state, action) => {
            state.reviewContent = action.payload;
        },
        setCompanyInfo: (state, action) => {
            state.companyInfo = action.payload;
        },
        clearEditState: (state) => {
            state.selectedKeywords = null;
            state.reviewContent = null;
            state.companyInfo = null;
        }
    }
});

export const { 
    setSelectedKeywords, 
    setReviewContent, 
    setCompanyInfo,
    clearEditState 
} = editSlice.actions;

export default editSlice.reducer;