import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    reviewLocations: [],
    bookmarkLocations: [],
    activeMarkerType: null, // 'filtered', 'search', 'review', 'bookmark'
    lastUpdated: null,
    isLoading: false,
    error: null
};

const reviewBookmarkSlice = createSlice({
    name: 'reviewBookmark',
    initialState,
    reducers: {
        setReviewLocations: (state, action) => {
            state.reviewLocations = action.payload;
            state.activeMarkerType = 'review';
            state.lastUpdated = Date.now();
        },
        setBookmarkLocations: (state, action) => {
            state.bookmarkLocations = action.payload;
            state.activeMarkerType = 'bookmark';
            state.lastUpdated = Date.now();
        },
        setActiveMarkerType: (state, action) => {
            state.activeMarkerType = action.payload;
            state.lastUpdated = Date.now();
        },
        setLoading: (state, action) => {
            state.isLoading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        },
        clearLocations: (state) => {
            state.reviewLocations = [];
            state.bookmarkLocations = [];
            state.activeMarkerType = null;
            state.lastUpdated = null;
        }
    }
});

export const {
    setReviewLocations,
    setBookmarkLocations,
    setActiveMarkerType,
    setLoading,
    setError,
    clearLocations
} = reviewBookmarkSlice.actions;

// Thunk action creators
export const fetchReviewLocations = () => async (dispatch) => {
    try {
        dispatch(setLoading(true));
        const response = await fetch('/dummyData/reviewData.json');
        const data = await response.json();
        dispatch(setReviewLocations(data));
    } catch (error) {
        dispatch(setError(error.message));
    } finally {
        dispatch(setLoading(false));
    }
};

export const fetchBookmarkLocations = () => async (dispatch) => {
    try {
        dispatch(setLoading(true));
        const response = await fetch('/dummyData/bookmarkData.json');
        const data = await response.json();
        dispatch(setBookmarkLocations(data));
    } catch (error) {
        dispatch(setError(error.message));
    } finally {
        dispatch(setLoading(false));
    }
};

export default reviewBookmarkSlice.reducer;