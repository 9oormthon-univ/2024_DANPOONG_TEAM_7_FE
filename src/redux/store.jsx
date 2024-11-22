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

//mypage
import keywordReducer from './slices/KeywordSlice';
import reviewWriteReducer from './slices/ReviewWriteSlice';
import editReducer from './slices/EditSlice';

export const store = configureStore({
    reducer: {
        enterprise: enterpriseReducer,
        search: searchReducer,
        visitedBookmark: visitedBookmarkReducer  ,
        type: typeReducer,
        socialPurpose: socialPurposeReducer,
        onoffStore: onoffStoreReducer,
        filteredEnterprise: filteredEnterpriseListReducer,
        keyword: keywordReducer,
        reviewWrite: reviewWriteReducer,
        edit: editReducer,
    },
});