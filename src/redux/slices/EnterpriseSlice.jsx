import { createSlice } from '@reduxjs/toolkit';

// -> enterprises 또는 companyList
// name -> name

const enterpriseSlice = createSlice({
   name: 'enterprise',
   initialState: {
       socialEnterprises: [],
       filteredEnterprises: [],
       mapMarkers: []
   },
   reducers: {
       setSocialEnterprises: (state, action) => {
           state.socialEnterprises = action.payload;
           state.filteredEnterprises = action.payload; // 초기 설정에서 모든 기업을 필터링된 목록에 추가
           
           console.log('EnterpriseSlice - Social Enterprises Loaded:', {
               total: action.payload.length
           });
       },
       setFilteredEnterprises: (state, action) => {
           state.filteredEnterprises = action.payload; // 필터링된 목록 설정
           
           console.log('EnterpriseSlice - Filtered Enterprises Updated:', {
               filteredCount: action.payload.length
           });
       },
       updateEnterpriseCoords: (state, action) => {
           const { name, coords } = action.payload;
           
           // socialEnterprises 배열에서 좌표 업데이트
           const enterprise = state.socialEnterprises.find(e => e.name === name);
           if (enterprise) {
               enterprise.latitude = coords.latitude;
               enterprise.longitude = coords.longitude;
           }

           // filteredEnterprises 배열에서도 좌표 업데이트
           const filteredEnterprise = state.filteredEnterprises.find(e => e.name === name);
           if (filteredEnterprise) {
               filteredEnterprise.latitude = coords.latitude;
               filteredEnterprise.longitude = coords.longitude;
           }

           console.log('EnterpriseSlice - Updated Coordinates:', {
               name,
               coordinates: coords
           });
       }
   }
});

export const { setSocialEnterprises, setFilteredEnterprises, updateEnterpriseCoords } = enterpriseSlice.actions;
export default enterpriseSlice.reducer;