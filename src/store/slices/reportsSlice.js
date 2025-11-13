import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  dashboardStats: null,
  loading: false,
  error: null,
};

const reportsSlice = createSlice({
  name: 'reports',
  initialState,
  reducers: {
    setDashboardStats: (state, action) => {
      state.dashboardStats = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const {
  setDashboardStats,
  setLoading,
  setError,
} = reportsSlice.actions;

export default reportsSlice.reducer;
