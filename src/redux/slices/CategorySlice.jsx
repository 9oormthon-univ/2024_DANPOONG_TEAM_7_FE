import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    selectedCategories: [],
    isCategoryModalOpen: false,
    enterprises: [],           // enterprises 배열 추가
    filteredEnterprises: []
};

const categorySlice = createSlice({
    name: 'category',
    initialState,
    reducers: {
        setSelectedCategories: (state, action) => {
            console.log('CategorySlice - Filtering by Categories:', {
                categories: action.payload
            });

            state.selectedCategories = action.payload;
            
            if (action.payload.includes('전체')) {
                state.filteredEnterprises = state.enterprises;
            } else if (action.payload.length === 0) {
                state.filteredEnterprises = state.enterprises;
            } else {
                state.filteredEnterprises = state.enterprises.filter(enterprise => 
                    action.payload.includes(enterprise.field)
                );
            }

            console.log('CategorySlice - After Filtering:', {
                selectedCategories: state.selectedCategories,
                filteredCount: state.filteredEnterprises.length
            });
        },

        toggleCategory: (state, action) => {
            const category = action.payload;
            console.log('CategorySlice - Toggling Category:', {
                category: category,
                currentSelected: state.selectedCategories
            });

            if (category === '전체') {
                if (state.selectedCategories.includes('전체')) {
                    state.selectedCategories = [];
                } else {
                    state.selectedCategories = ['전체'];
                }
            } else {
                if (state.selectedCategories.includes('전체')) {
                    state.selectedCategories = [];
                }
                
                const categoryIndex = state.selectedCategories.indexOf(category);
                if (categoryIndex > -1) {
                    state.selectedCategories.splice(categoryIndex, 1);
                } else {
                    state.selectedCategories.push(category);
                }
            }

            // 토글 후에 필터링 업데이트
            if (state.selectedCategories.includes('전체') || state.selectedCategories.length === 0) {
                state.filteredEnterprises = state.enterprises;
            } else {
                state.filteredEnterprises = state.enterprises.filter(enterprise => 
                    state.selectedCategories.includes(enterprise.field)
                );
            }

            console.log('CategorySlice - After Toggle:', {
                selectedCategories: state.selectedCategories,
                filteredCount: state.filteredEnterprises.length
            });
        },

        clearCategories: (state) => {
            console.log('CategorySlice - Clearing all categories');
            state.selectedCategories = [];
            state.filteredEnterprises = state.enterprises;
        },

        setCategoryModalOpen: (state, action) => {
            console.log('CategorySlice - Setting modal open:', action.payload);
            state.isCategoryModalOpen = action.payload;
        },

        setEnterprises: (state, action) => {
            state.enterprises = action.payload;
            state.filteredEnterprises = action.payload;
            
            console.log('CategorySlice - Enterprises Updated:', {
                total: action.payload.length
            });
        }
    }
});

export const {
    setSelectedCategories,
    toggleCategory,
    clearCategories,
    setCategoryModalOpen,
    setEnterprises
} = categorySlice.actions;

export default categorySlice.reducer;