import { createSlice } from '@reduxjs/toolkit';

const categorySlice = createSlice({
    name: 'category',
    initialState: {
        selectedCategories: [],
        isCategoryModalOpen: false
    },
    reducers: {
        setSelectedCategories: (state, action) => {
            console.log('CategorySlice - Setting Categories:', {
                categories: action.payload
            });
            state.selectedCategories = action.payload;
        },
        setCategoryModalOpen: (state, action) => {
            state.isCategoryModalOpen = action.payload;
        }
    }
});

export const { setSelectedCategories, setCategoryModalOpen } = categorySlice.actions;
export default categorySlice.reducer;