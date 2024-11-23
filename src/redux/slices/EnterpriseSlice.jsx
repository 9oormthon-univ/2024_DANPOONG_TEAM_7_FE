import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../api/axiosInstance';

export const fetchEnterprises = createAsyncThunk(
   'enterprise/fetchEnterprises',
   async (region = '경기') => {
       const response = await axiosInstance.get(`/api/enterprises/${region}`);
       return response.result;
   }
);

const enterpriseSlice = createSlice({
   name: 'enterprise',
   initialState: {
       socialEnterprises: [],
       filteredEnterprises: [],
       isLoading: false,
       error: null,
       lastUpdated: null
   },
   reducers: {
       setSocialEnterprises: (state, action) => {
           if (state.lastUpdated && 
               JSON.stringify(state.socialEnterprises) === JSON.stringify(action.payload)) {
               return;
           }
           state.socialEnterprises = action.payload;
           state.filteredEnterprises = action.payload;
           state.lastUpdated = Date.now();
       },
       setFilteredEnterprises: (state, action) => {
           state.filteredEnterprises = action.payload;
       },
       clearError: (state) => {
           state.error = null;
       }
   },
   extraReducers: (builder) => {
       builder
           .addCase(fetchEnterprises.pending, (state) => {
               state.isLoading = true;
               state.error = null;
           })
           .addCase(fetchEnterprises.fulfilled, (state, action) => {
               state.socialEnterprises = action.payload;
               state.filteredEnterprises = action.payload;
               state.isLoading = false;
               state.lastUpdated = Date.now();
           })
           .addCase(fetchEnterprises.rejected, (state, action) => {
               state.error = action.error.message;
               state.isLoading = false;
               state.socialEnterprises = [];
               state.filteredEnterprises = [];
           });
   }
});

export const { setSocialEnterprises, setFilteredEnterprises, clearError } = enterpriseSlice.actions;
export default enterpriseSlice.reducer;