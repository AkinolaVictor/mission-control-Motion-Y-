import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  metrics: {
    overallHealth: '91%',
    tasksCompleted: 28,
    workTime: '16.5',
    errorLogs: 7,
  },
  summary: {
    workingNow: 7,
    scheduledToday: 7,
    awaitingApproval: 7,
  },
};

const agentsSlice = createSlice({
  name: 'agents',
  initialState,
  reducers: {
    updateMetric: (state, action) => {
      const { key, value } = action.payload;
      state.metrics[key] = value;
    },
    updateSummary: (state, action) => {
      const { key, value } = action.payload;
      state.summary[key] = value;
    },
  },
});

export const { updateMetric, updateSummary } = agentsSlice.actions;
export default agentsSlice.reducer;
