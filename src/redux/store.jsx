// src/redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import enterpriseReducer from './slice/EnterpriseSlice';
import categoryReducer from './slice/CategorySlice';
import typeReducer from './slice/TypeSlice'
import searchReducer from './slice/SearchSlice';
import onoffStoreReducer from './slice/OnoffStoreSlice'
import filteredEnterpriseListReducer from './slice/FilteredEnterpriseListSlice'
export const store = configureStore({
    reducer: {
        enterprise: enterpriseReducer,
        category: categoryReducer,
        type: typeReducer,
        onoffStore: onoffStoreReducer,
        filteredEnterprise: filteredEnterpriseListReducer,
        search: searchReducer,
    },
});