import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../api/axiosInstance';

export const fetchBookmarkLocations = createAsyncThunk(
    'visitedBookmark/fetchBookmarks',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get('/api/likes');
            if (!response?.result) {
                throw new Error('Invalid response format');
            }
            return response.result;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
 );
 

 export const addBookmark = createAsyncThunk(
    'visitedBookmark/addBookmark',
    async (enterpriseId, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post(`/api/likes/${enterpriseId}`);
            return {
                enterpriseId,
                ...response
            };
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
 );

export const removeBookmark = createAsyncThunk(
   'visitedBookmark/removeBookmark',
   async (enterpriseId, { rejectWithValue }) => {
       try {
           await axiosInstance.delete(`/api/likes/${enterpriseId}`);
           return enterpriseId;
       } catch (error) {
           return rejectWithValue(error.message);
       }
   }
);

export const fetchVisitedLocations = createAsyncThunk(
   'visitedBookmark/fetchVisited',
   async () => {
       const response = await axiosInstance.get('/api/enterprises/users/visit');
       return response.result;
   }
);

const visitedBookmarkSlice = createSlice({
   name: 'visitedBookmark',
   initialState: {
       visitedLocations: [],
       bookmarkLocations: [],
       activeMarkerType: null,
       lastUpdated: null,
       isLoading: false,
       error: null
   },
   reducers: {
       setActiveMarkerType: (state, action) => {
           state.activeMarkerType = action.payload;
           state.lastUpdated = Date.now();
       },
       clearError: (state) => {
           state.error = null;
       }
   },
   extraReducers: (builder) => {
       builder
           // 북마크 조회
           .addCase(fetchBookmarkLocations.pending, (state) => {
               state.isLoading = true;
               state.error = null;
           })
           .addCase(fetchBookmarkLocations.fulfilled, (state, action) => {
               state.bookmarkLocations = action.payload;
               state.lastUpdated = Date.now();
               state.isLoading = false;
           })
           .addCase(fetchBookmarkLocations.rejected, (state, action) => {
               state.error = action.error.message;
               state.isLoading = false;
               state.bookmarkLocations = [];
           })
           // 북마크 추가
           .addCase(addBookmark.pending, (state) => {
               state.error = null;
           })
           .addCase(addBookmark.fulfilled, (state, action) => {
               state.bookmarkLocations.push(action.payload);
               state.lastUpdated = Date.now();
           })
           .addCase(addBookmark.rejected, (state, action) => {
               state.error = '북마크 추가 실패';
           })
           // 북마크 삭제
           .addCase(removeBookmark.pending, (state) => {
               state.error = null;
           })
           .addCase(removeBookmark.fulfilled, (state, action) => {
               state.bookmarkLocations = state.bookmarkLocations.filter(
                   bookmark => bookmark.enterpriseId !== action.payload
               );
               state.lastUpdated = Date.now();
           })
           .addCase(removeBookmark.rejected, (state, action) => {
               state.error = '북마크 삭제 실패';
           })
           // 방문 기업 조회
           .addCase(fetchVisitedLocations.pending, (state) => {
               state.isLoading = true;
               state.error = null;
           })
           .addCase(fetchVisitedLocations.fulfilled, (state, action) => {
               state.visitedLocations = action.payload;
               state.lastUpdated = Date.now();
               state.isLoading = false;
           })
           .addCase(fetchVisitedLocations.rejected, (state, action) => {
               state.error = action.error.message;
               state.isLoading = false;
               state.visitedLocations = [];
           });
   }
});

export const { setActiveMarkerType, clearError } = visitedBookmarkSlice.actions;
export default visitedBookmarkSlice.reducer;