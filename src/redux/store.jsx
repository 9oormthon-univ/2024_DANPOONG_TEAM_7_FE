// src/redux/store.jsx
import { configureStore } from '@reduxjs/toolkit';
import enterpriseReducer from './slice/EnterpriseSlice';

export const store = configureStore({
    reducer: {
        enterprise: enterpriseReducer,
    },
});