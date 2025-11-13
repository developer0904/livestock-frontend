import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { eventsAPI } from '../../services';

const initialState = {
  events: [],
  selectedEvent: null,
  filters: {
    type: '',
    animalId: '',
    dateRange: { start: null, end: null },
  },
  loading: false,
  error: null,
};

export const fetchEvents = createAsyncThunk('events/fetchEvents', async (params) => {
  const response = await eventsAPI.getAll(params);
  return response.data.results || response.data;
});

export const createEvent = createAsyncThunk('events/createEvent', async (data) => {
  const response = await eventsAPI.create(data);
  return response.data;
});

export const updateEventData = createAsyncThunk('events/updateEvent', async ({ id, data }) => {
  const response = await eventsAPI.update(id, data);
  return response.data;
});

export const deleteEventData = createAsyncThunk('events/deleteEvent', async (id) => {
  await eventsAPI.delete(id);
  return id;
});

const eventsSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {
    setSelectedEvent: (state, action) => {
      state.selectedEvent = action.payload;
    },
    setEventFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEvents.pending, (state) => { state.loading = true; })
      .addCase(fetchEvents.fulfilled, (state, action) => { state.loading = false; state.events = action.payload; })
      .addCase(fetchEvents.rejected, (state, action) => { state.loading = false; state.error = action.error.message; })
      .addCase(createEvent.fulfilled, (state, action) => { state.events.push(action.payload); })
      .addCase(updateEventData.fulfilled, (state, action) => {
        const index = state.events.findIndex(e => e.id === action.payload.id);
        if (index !== -1) state.events[index] = action.payload;
      })
      .addCase(deleteEventData.fulfilled, (state, action) => {
        state.events = state.events.filter(e => e.id !== action.payload);
      });
  },
});

export const { setSelectedEvent, setEventFilters } = eventsSlice.actions;

export default eventsSlice.reducer;
