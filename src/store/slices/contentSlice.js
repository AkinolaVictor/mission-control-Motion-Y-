import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  stats: {
    createdToday: 8,
    audienceEngagements: 8,
    contentsViews: 8,
  },
  lastUpdated: {
    time: '12pm Mon, 11 Oct 2026',
    agent: 'Agent Clara',
  },
  nextUpdate: {
    time: '1pm Mon, 11 Oct 2026',
    agent: 'Agent Soria',
  },
};

const contentSlice = createSlice({
  name: 'content',
  initialState,
  reducers: {
    updateStat: (state, action) => {
      const { key, value } = action.payload;
      state.stats[key] = value;
    },
    updateLastUpdated: (state, action) => {
      state.lastUpdated = { ...state.lastUpdated, ...action.payload };
    },
    updateNextUpdate: (state, action) => {
      state.nextUpdate = { ...state.nextUpdate, ...action.payload };
    },
  },
});

export const { updateStat, updateLastUpdated, updateNextUpdate } = contentSlice.actions;
export default contentSlice.reducer;
