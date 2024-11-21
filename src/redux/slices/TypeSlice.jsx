import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    selectedTypes: [],
    isTypeModalOpen: false,
    enterprises: [],           // enterprises 배열 추가
    filteredEnterprises: []
};

const typeSlice = createSlice({
    name: 'type',
    initialState,
    reducers: {
        setSelectedTypes: (state, action) => {
            // enterprise.field -> enterprise.category
            console.log('TypeSlice - Filtering by Types:', {
                types: action.payload
            });

            state.selectedTypes = action.payload;
            
            if (action.payload.includes('전체')) {
                state.filteredEnterprises = state.enterprises;
            } else if (action.payload.length === 0) {
                state.filteredEnterprises = state.enterprises;
            } else {
                state.filteredEnterprises = state.enterprises.filter(enterprise => 
                    action.payload.includes(enterprise.type)
                );
            }

            console.log('TypeSlice - After Filtering:', {
                selectedTypes: state.selectedTypes,
                filteredCount: state.filteredEnterprises.length
            });
        },

        toggleType: (state, action) => {
            // enterprise.field -> enterprise.category
            const type = action.payload;
            console.log('TypeSlice - Toggling Type:', {
                type: type,
                currentSelected: state.selectedTypes
            });

            if (type === '전체') {
                if (state.selectedTypes.includes('전체')) {
                    state.selectedTypes = [];
                } else {
                    state.selectedTypes = ['전체'];
                }
            } else {
                if (state.selectedTypes.includes('전체')) {
                    state.selectedTypes = [];
                }
                
                const typeIndex = state.selectedTypes.indexOf(type);
                if (typeIndex > -1) {
                    state.selectedTypes.splice(typeIndex, 1);
                } else {
                    state.selectedTypes.push(type);
                }
            }

            // 토글 후에 필터링 업데이트
            if (state.selectedTypes.includes('전체') || state.selectedTypes.length === 0) {
                state.filteredEnterprises = state.enterprises;
            } else {
                state.filteredEnterprises = state.enterprises.filter(enterprise => 
                    state.selectedTypes.includes(enterprise.type)
                );
            }

            console.log('TypeSlice - After Toggle:', {
                selectedTypes: state.selectedTypes,
                filteredCount: state.filteredEnterprises.length
            });
        },

        clearTypes: (state) => {
            console.log('TypeSlice - Clearing all types');
            state.selectedTypes = [];
            state.filteredEnterprises = state.enterprises;
        },

        setTypeModalOpen: (state, action) => {
            console.log('TypeSlice - Setting modal open:', action.payload);
            state.isTypeModalOpen = action.payload;
        },

        setEnterprises: (state, action) => {
            state.enterprises = action.payload;
            state.filteredEnterprises = action.payload;
            
            console.log('TypeSlice - Enterprises Updated:', {
                total: action.payload.length
            });
        }
    }
});

export const {
    setSelectedTypes,
    toggleType,
    clearTypes,
    setTypeModalOpen,
    setEnterprises
} = typeSlice.actions;

export default typeSlice.reducer;