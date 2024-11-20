import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    reviewText: '',
    submissionStatus: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
    reviewData: {
        enterpriseInfo: null,
        keywords: [],
        reviewText: '',
        createdAt: '',
    }
};

const reviewWriteSlice = createSlice({
    name: 'reviewWrite',
    initialState,
    reducers: {
        setReviewText: (state, action) => {
            state.reviewText = action.payload;
        },
        setSubmissionStatus: (state, action) => {
            state.submissionStatus = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        },
        prepareReviewData: (state, action) => {
            const { enterpriseInfo, keywords } = action.payload;
            state.reviewData = {
                enterpriseInfo,
                keywords,
                reviewText: state.reviewText,
                createdAt: new Date().toISOString()
            };
        },
        clearReviewData: (state) => {
            state.reviewText = '';
            state.submissionStatus = 'idle';
            state.error = null;
            state.reviewData = {
                enterpriseInfo: null,
                keywords: [],
                reviewText: '',
                createdAt: '',
            };
        }
    }
});

export const {
    setReviewText,
    setSubmissionStatus,
    setError,
    prepareReviewData,
    clearReviewData
} = reviewWriteSlice.actions;

// Selectors
export const selectReviewText = (state) => state.reviewWrite.reviewText;
export const selectSubmissionStatus = (state) => state.reviewWrite.submissionStatus;
export const selectReviewData = (state) => state.reviewWrite.reviewData;
export const selectError = (state) => state.reviewWrite.error;

export default reviewWriteSlice.reducer;