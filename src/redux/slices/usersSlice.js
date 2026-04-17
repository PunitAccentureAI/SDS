import { createSlice } from '@reduxjs/toolkit';
import { users as initialUsers } from '../../data/users';

const initialState = {
  list: initialUsers,
  selectedUser: null,
  searchQuery: '',
};

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setSelectedUser(state, action) {
      state.selectedUser = action.payload;
    },
    clearSelectedUser(state) {
      state.selectedUser = null;
    },
    setSearchQuery(state, action) {
      state.searchQuery = action.payload;
    },
    updateUserStatus(state, action) {
      const { userId, status } = action.payload;
      const user = state.list.find((u) => u.id === userId);
      if (user) {
        user.status = status;
      }
    },
  },
});

export const { setSelectedUser, clearSelectedUser, setSearchQuery, updateUserStatus } = usersSlice.actions;

export default usersSlice.reducer;
