import { createSlice } from '@reduxjs/toolkit';

const socialPurposeSlice = createSlice({
    name: 'socialPurpose',
    initialState: {
        selectedSocialPurpose: [],
        isSocialPurposeModalOpen: false
    },
    reducers: {
        setSelectedSocialPurpose: (state, action) => {
            console.log('SocialPurposeSlice - Setting SocialPurpos:', {
                socialPurpose: action.payload
            });
            state.selectedSocialPurpose = action.payload;
        },
        setSocialPurposeModalOpen: (state, action) => {
            state.isSocialPurposeModalOpen = action.payload;
        }
    }
});

export const { setSelectedSocialPurpose, setSocialPurposeModalOpen } = socialPurposeSlice.actions;
export default socialPurposeSlice.reducer;