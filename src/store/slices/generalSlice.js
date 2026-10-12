import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  meta: {
    completed: 8,
    ongoing: 8,
    scheduled: 8,
    navHeight: 124
  },
  navHeight: 55,
  selectedCategory: null,
  selectedIdeaId: null,
  isMenuOpen: false,
};

const generalSlice = createSlice({
  name: 'general',
  initialState,
  reducers: {
    updateMeta: (state, action) => {
      const { key, value } = action.payload;
      state.meta[key] = value;
    },
    updateNavHeight: (state, action) => {
      state.navHeight = action.payload;
    },
    setSelectedCategory: (state, action) => {
      state.selectedCategory = action.payload;
      state.selectedIdeaId = null;
    },
    setSelectedIdeaId: (state, action) => {
      state.selectedIdeaId = action.payload;
    },
    toggleMenu: (state) => {
      state.isMenuOpen = !state.isMenuOpen;
    },
  },
});

export const { updateMeta, updateNavHeight, setSelectedCategory, setSelectedIdeaId, toggleMenu } = generalSlice.actions;
export default generalSlice.reducer;
