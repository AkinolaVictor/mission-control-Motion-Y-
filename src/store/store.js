import { configureStore } from '@reduxjs/toolkit';
import tasksReducer from './slices/tasksSlice';
import contentReducer from './slices/contentSlice';
import agentsReducer from './slices/agentsSlice';
import generalReducer from './slices/generalSlice';

export const store = configureStore({
  reducer: {
    tasks: tasksReducer,
    content: contentReducer,
    agents: agentsReducer,
    general: generalReducer,
  },
});
