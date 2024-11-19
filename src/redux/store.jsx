// src/redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import enterpriseReducer from './slice/EnterpriseSlice';
import typeReducer from './slice/TypeSlice';
import searchReducer from './slice/SearchSlice';
import onoffStoreReducer from './slice/OnoffStoreSlice'
import filteredEnterpriseListReducer from './slice/FilteredEnterpriseListSlice'
export const store = configureStore({
    reducer: {
        enterprise: enterpriseReducer,
        type: typeReducer,
        onoffStore: onoffStoreReducer,
        filteredEnterprise: filteredEnterpriseListReducer,
        search: searchReducer,
    },
});