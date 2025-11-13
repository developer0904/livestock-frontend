import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { ownersAPI } from '../../services';

const initialState = {
  owners: [],
  selectedOwner: null,
  loading: false,
  error: null,
};

// Async thunks
export const fetchOwners = createAsyncThunk(
  'owners/fetchOwners',
  async (params, { rejectWithValue }) => {
    try {
      const response = await ownersAPI.getAll(params);
      return response.data.results || response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchOwnerById = createAsyncThunk(
  'owners/fetchOwnerById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await ownersAPI.getById(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const createOwner = createAsyncThunk(
  'owners/createOwner',
  async (data, { rejectWithValue }) => {
    try {
      const response = await ownersAPI.create(data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateOwnerData = createAsyncThunk(
  'owners/updateOwner',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await ownersAPI.update(id, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deleteOwnerData = createAsyncThunk(
  'owners/deleteOwner',
  async (id, { rejectWithValue }) => {
    try {
      await ownersAPI.delete(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const ownersSlice = createSlice({
  name: 'owners',
  initialState,
  reducers: {
    setSelectedOwner: (state, action) => {
      state.selectedOwner = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOwners.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOwners.fulfilled, (state, action) => {
        state.loading = false;
        state.owners = action.payload;
      })
      .addCase(fetchOwners.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchOwnerById.fulfilled, (state, action) => {
        state.selectedOwner = action.payload;
      })
      .addCase(createOwner.fulfilled, (state, action) => {
        state.owners.push(action.payload);
      })
      .addCase(updateOwnerData.fulfilled, (state, action) => {
        const index = state.owners.findIndex(o => o.id === action.payload.id);
        if (index !== -1) {
          state.owners[index] = action.payload;
        }
      })
      .addCase(deleteOwnerData.fulfilled, (state, action) => {
        state.owners = state.owners.filter(o => o.id !== action.payload);
      });
  },
});

export const {
  setSelectedOwner,
  clearError,
} = ownersSlice.actions;

export default ownersSlice.reducer;
