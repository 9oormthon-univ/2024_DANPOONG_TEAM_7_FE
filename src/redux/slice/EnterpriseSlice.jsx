// src/redux/slice/EnterpriseSlice.jsx
import { createSlice } from '@reduxjs/toolkit';

const enterpriseSlice = createSlice({
   name: 'enterprise',
   initialState: {
       socialEnterprises: [],
       selectedCategories: [],
       filteredEnterprises: [],
       mapMarkers: []
   },
   reducers: {
       setSocialEnterprises: (state, action) => {
           state.socialEnterprises = action.payload;
           state.filteredEnterprises = action.payload;
           
           console.log('EnterpriseSlice - Social Enterprises Loaded:', {
               total: action.payload.length
           });
       },
       setSelectedCategories: (state, action) => {
           console.log('EnterpriseSlice - Filtering by Categories:', {
               categories: action.payload
           });

           state.selectedCategories = action.payload;
           
           if (action.payload.includes('전체')) {
               state.filteredEnterprises = state.socialEnterprises;
           } else {
               state.filteredEnterprises = state.socialEnterprises.filter(enterprise => 
                   action.payload.includes(enterprise.socialPurposeType)
               );
           }

           console.log('EnterpriseSlice - After Filtering:', {
               selectedCategories: state.selectedCategories,
               totalEnterprises: state.socialEnterprises.length,
               filteredCount: state.filteredEnterprises.length
           });
       },
       updateEnterpriseCoords: (state, action) => {
           const { companyName, coords } = action.payload;
           
           // socialEnterprises 배열에서 좌표 업데이트
           const enterprise = state.socialEnterprises.find(e => e.companyName === companyName);
           if (enterprise) {
               enterprise.latitude = coords.latitude;
               enterprise.longitude = coords.longitude;
           }

           // filteredEnterprises 배열에서도 좌표 업데이트
           const filteredEnterprise = state.filteredEnterprises.find(e => e.companyName === companyName);
           if (filteredEnterprise) {
               filteredEnterprise.latitude = coords.latitude;
               filteredEnterprise.longitude = coords.longitude;
           }

           console.log('EnterpriseSlice - Updated Coordinates:', {
               companyName,
               coordinates: coords
           });
       }
   }
});

export const { setSocialEnterprises, setSelectedCategories, updateEnterpriseCoords } = enterpriseSlice.actions;
export default enterpriseSlice.reducer;