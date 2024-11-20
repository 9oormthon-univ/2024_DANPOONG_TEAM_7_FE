import { createSlice } from '@reduxjs/toolkit';

const typeSlice = createSlice({
    name: 'type',
    initialState: {
        selectedTypes: [],
        isTypeModalOpen: false
    },
    reducers: {
        setSelectedTypes: (state, action) => {
            console.log('TypeSlice - Setting Types:', {
                types: action.payload
            });
            state.selectedTypes = action.payload;
        },
        setTypeModalOpen: (state, action) => {
            state.isTypeModalOpen = action.payload;
        }
    }
});

export const { setSelectedTypes, setTypeModalOpen } = typeSlice.actions;
export default typeSlice.reducer;