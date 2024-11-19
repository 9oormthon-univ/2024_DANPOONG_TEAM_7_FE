import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    selectedOnoffStore: [],
    isOnoffModalOpen: false,
    enterprises: [],
    filteredEnterprises: []
};

const onoffStoreSlice = createSlice({
    name: 'onoffStore',
    initialState,
    reducers: {
        setSelectedOnoffStore: (state, action) => {
            console.log('OnoffStoreSlice - Setting store type:', {
                selection: action.payload
            });

            state.selectedOnoffStore = action.payload;
            
            // 선택된 것이 없으면 모든 기업 표시
            if (action.payload.length === 0) {
                state.filteredEnterprises = state.enterprises;
            } else {
                // 선택된 온/오프라인 타입에 맞는 기업만 필터링
                state.filteredEnterprises = state.enterprises.filter(enterprise => 
                    action.payload.includes(enterprise.storeType)
                );
            }

            console.log('OnoffStoreSlice - After filtering:', {
                selectedTypes: state.selectedOnoffStore,
                filteredCount: state.filteredEnterprises.length
            });
        },

        setOnoffModalOpen: (state, action) => {
            state.isOnoffModalOpen = action.payload;
        },

        setEnterprises: (state, action) => {
            state.enterprises = action.payload;
            state.filteredEnterprises = action.payload;
        }
    }
});

export const {
    setSelectedOnoffStore,
    setOnoffModalOpen,
    setEnterprises
} = onoffStoreSlice.actions;

export default onoffStoreSlice.reducer;