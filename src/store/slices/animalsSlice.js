import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { animalsAPI } from '../../services';

const initialState = {
  animals: [],
  selectedAnimal: null,
  filters: {
    breed: '',
    sex: '',
    healthStatus: '',
    ownerId: '',
  },
  loading: false,
  error: null,
};

// Async thunks
export const fetchAnimals = createAsyncThunk(
  'animals/fetchAnimals',
  async (params, { rejectWithValue }) => {
    try {
      const response = await animalsAPI.getAll(params);
      return response.data.results || response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchAnimalById = createAsyncThunk(
  'animals/fetchAnimalById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await animalsAPI.getById(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const createAnimal = createAsyncThunk(
  'animals/createAnimal',
  async (data, { rejectWithValue }) => {
    try {
      const response = await animalsAPI.create(data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateAnimalData = createAsyncThunk(
  'animals/updateAnimal',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await animalsAPI.update(id, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deleteAnimalData = createAsyncThunk(
  'animals/deleteAnimal',
  async (id, { rejectWithValue }) => {
    try {
      await animalsAPI.delete(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const animalsSlice = createSlice({
  name: 'animals',
  initialState,
  reducers: {
    setSelectedAnimal: (state, action) => {
      state.selectedAnimal = action.payload;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = initialState.filters;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all animals
      .addCase(fetchAnimals.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAnimals.fulfilled, (state, action) => {
        state.loading = false;
        state.animals = action.payload;
      })
      .addCase(fetchAnimals.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch single animal
      .addCase(fetchAnimalById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAnimalById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedAnimal = action.payload;
      })
      .addCase(fetchAnimalById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create animal
      .addCase(createAnimal.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createAnimal.fulfilled, (state, action) => {
        state.loading = false;
        state.animals.push(action.payload);
      })
      .addCase(createAnimal.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update animal
      .addCase(updateAnimalData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateAnimalData.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.animals.findIndex(a => a.id === action.payload.id);
        if (index !== -1) {
          state.animals[index] = action.payload;
        }
      })
      .addCase(updateAnimalData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete animal
      .addCase(deleteAnimalData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteAnimalData.fulfilled, (state, action) => {
        state.loading = false;
        state.animals = state.animals.filter(a => a.id !== action.payload);
      })
      .addCase(deleteAnimalData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  setSelectedAnimal,
  setFilters,
  clearFilters,
  clearError,
} = animalsSlice.actions;

export default animalsSlice.reducer;
