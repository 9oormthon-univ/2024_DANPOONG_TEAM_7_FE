// src/redux/slices/ReviewSlice.jsx 
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../api/axiosInstance';

// 리뷰 데이터 가져오기 액션 
export const fetchEnterpriseReviews = createAsyncThunk(
    'reviews/fetchEnterpriseReviews',
    async (enterpriseId) => {
        try {
            const response = await axiosInstance.get(`/api/reviews/${enterpriseId}/enterprises`);
            return {
                enterpriseId,
                reviews: response.result
            };
        } catch (error) {
            throw error;
        }
    }
);

const reviewSlice = createSlice({
    name: 'reviews',
    initialState: {
        reviews: {}, // { enterpriseId: [리뷰배열] } 형태로 저장
        isLoading: false,
        error: null
    },
    reducers: {
        clearReviews: (state) => {
            state.reviews = {};
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchEnterpriseReviews.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchEnterpriseReviews.fulfilled, (state, action) => {
                const { enterpriseId, reviews } = action.payload;
                state.reviews[enterpriseId] = reviews;
                state.isLoading = false;
            })
            .addCase(fetchEnterpriseReviews.rejected, (state, action) => {
                state.error = action.error.message;
                state.isLoading = false;
            });
    }
});

export const { clearReviews } = reviewSlice.actions;
export default reviewSlice.reducer;