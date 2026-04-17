import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  list: [],
  selectedProposal: null,
  searchQuery: '',
  sortBy: 'updated',
  filters: [],
};

const proposalsSlice = createSlice({
  name: 'proposals',
  initialState,
  reducers: {
    setProposals(state, action) {
      state.list = action.payload;
    },
    setSelectedProposal(state, action) {
      state.selectedProposal = action.payload;
    },
    setProposalSearch(state, action) {
      state.searchQuery = action.payload;
    },
    setProposalSort(state, action) {
      state.sortBy = action.payload;
    },
    setProposalFilters(state, action) {
      state.filters = action.payload;
    },
    toggleFilter(state, action) {
      const filter = action.payload;
      if (state.filters.includes(filter)) {
        state.filters = state.filters.filter((f) => f !== filter);
      } else {
        state.filters.push(filter);
      }
    },
    clearAllFilters(state) {
      state.filters = [];
    },
  },
});

export const {
  setProposals,
  setSelectedProposal,
  setProposalSearch,
  setProposalSort,
  setProposalFilters,
  toggleFilter,
  clearAllFilters,
} = proposalsSlice.actions;

export default proposalsSlice.reducer;
