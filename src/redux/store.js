import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import usersReducer from './slices/usersSlice';
import proposalsReducer from './slices/proposalsSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    users: usersReducer,
    proposals: proposalsReducer,
  },
});

export default store;
