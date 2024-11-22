// redux/slices/VisitedBookmarkSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    visitedLocations: [],    // reviewLocations -> visitedLocations
    bookmarkLocations: [],
    activeMarkerType: null,
    lastUpdated: null,
    isLoading: false,
    error: null
};

const visitedBookmarkSlice = createSlice({      // reviewBookmarkSlice -> visitedBookmarkSlice
    name: 'visitedBookmark',                    // name도 변경
    initialState,
    reducers: {
        setVisitedLocations: (state, action) => {    // setReviewLocations -> setVisitedLocations
            state.visitedLocations = action.payload;
            state.lastUpdated = Date.now();
        },
        setBookmarkLocations: (state, action) => {
            state.bookmarkLocations = action.payload;
            state.lastUpdated = Date.now();
        },
        setActiveMarkerType: (state, action) => {
            state.activeMarkerType = action.payload;
            if (action.payload !== null) {
                state.lastUpdated = Date.now();
            }
        },
        setLoading: (state, action) => {
            state.isLoading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        },
        clearLocations: (state) => {
            return initialState;
        }
    }
});

export const {
    setVisitedLocations,           // setReviewLocations -> setVisitedLocations
    setBookmarkLocations,
    setActiveMarkerType,
    setLoading,
    setError,
    clearLocations
} = visitedBookmarkSlice.actions;

// Thunk action creators
export const fetchVisitedLocations = () => async (dispatch) => {    // fetchReviewLocations -> fetchVisitedLocations
    try {
        dispatch(setLoading(true));
        const response = await fetch('/dummyData/visitedData.json');  // reviewData.json -> visitedData.json
        const data = await response.json();
        dispatch(setVisitedLocations(data));
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

export default visitedBookmarkSlice.reducer;