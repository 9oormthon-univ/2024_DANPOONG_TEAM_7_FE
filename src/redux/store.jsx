// src/redux/store.jsx
import { configureStore } from '@reduxjs/toolkit';

//map
import enterpriseReducer from './slices/EnterpriseSlice';
import searchReducer from './slices/SearchSlice';
import visitedBookmarkReducer from './slices/VisitedBookmarkSlice';
import typeReducer from './slices/TypeSlice';
import socialPurposeReducer from './slices/SocialPurposeSlice';
import onoffStoreReducer from './slices/OnoffStoreSlice'
import filteredEnterpriseListReducer from './slices/FilteredEnterpriseListSlice';
import reviewReducer from './slices/ReviewSlice';


export const store = configureStore({
    reducer: {
        enterprise: enterpriseReducer,
        reviews: reviewReducer,
        search: searchReducer,
        visitedBookmark: visitedBookmarkReducer  ,
        type: typeReducer,
        socialPurpose: socialPurposeReducer,
        onoffStore: onoffStoreReducer,
        filteredEnterprise: filteredEnterpriseListReducer,
    },
});