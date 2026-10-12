import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  stats: {
    completed: 8,
    ongoing: 8,
    scheduled: 8,
  },
  currentTask: {
    title: 'Current Task',
    description: 'Creating next post...',
    agent: 'Agent Fushia',
  },
  upcomingTask: {
    title: 'Upcoming Task',
    description: 'Watching dev.to contents',
    agent: 'Agent Soria',
  },
};

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    updateStat: (state, action) => {
      const { key, value } = action.payload;
      state.stats[key] = value;
    },
    updateCurrentTask: (state, action) => {
      state.currentTask = { ...state.currentTask, ...action.payload };
    },
    updateUpcomingTask: (state, action) => {
      state.upcomingTask = { ...state.upcomingTask, ...action.payload };
    },
  },
});

export const { updateStat, updateCurrentTask, updateUpcomingTask } = tasksSlice.actions;
export default tasksSlice.reducer;
