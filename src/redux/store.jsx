// src/redux/store.jsx
import { configureStore } from '@reduxjs/toolkit';
import enterpriseReducer from './slices/EnterpriseSlice';
import categoryReducer from './slices/CategorySlice';
import typeReducer from './slices/TypeSlice'
import searchReducer from './slices/SearchSlice';
import onoffStoreReducer from './slices/OnoffStoreSlice'
import filteredEnterpriseListReducer from './slices/FilteredEnterpriseListSlice';
import keywordReducer from './slices/KeywordSlice';
import reviewWriteReducer from './slices/ReviewWriteSlice';
import editReducer from './slices/EditSlice';

export const store = configureStore({
    reducer: {
        enterprise: enterpriseReducer,
        category: categoryReducer,
        type: typeReducer,
        onoffStore: onoffStoreReducer,
        filteredEnterprise: filteredEnterpriseListReducer,
        search: searchReducer,
        keyword: keywordReducer,
        reviewWrite: reviewWriteReducer,
        edit: editReducer,
    },
});