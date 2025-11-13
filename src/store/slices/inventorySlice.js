import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { inventoryAPI } from '../../services';

const initialState = {
  inventory: [],
  selectedItem: null,
  loading: false,
  error: null,
};

export const fetchInventory = createAsyncThunk('inventory/fetchInventory', async (params) => {
  const response = await inventoryAPI.getAll(params);
  return response.data.results || response.data;
});

export const createInventoryItem = createAsyncThunk('inventory/createItem', async (data) => {
  const response = await inventoryAPI.create(data);
  return response.data;
});

export const updateInventoryItemData = createAsyncThunk('inventory/updateItem', async ({ id, data }) => {
  const response = await inventoryAPI.update(id, data);
  return response.data;
});

export const deleteInventoryItemData = createAsyncThunk('inventory/deleteItem', async (id) => {
  await inventoryAPI.delete(id);
  return id;
});

const inventorySlice = createSlice({
  name: 'inventory',
  initialState,
  reducers: {
    setSelectedItem: (state, action) => {
      state.selectedItem = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchInventory.pending, (state) => { state.loading = true; })
      .addCase(fetchInventory.fulfilled, (state, action) => { state.loading = false; state.inventory = action.payload; })
      .addCase(fetchInventory.rejected, (state, action) => { state.loading = false; state.error = action.error.message; })
      .addCase(createInventoryItem.fulfilled, (state, action) => { state.inventory.push(action.payload); })
      .addCase(updateInventoryItemData.fulfilled, (state, action) => {
        const index = state.inventory.findIndex(i => i.id === action.payload.id);
        if (index !== -1) state.inventory[index] = action.payload;
      })
      .addCase(deleteInventoryItemData.fulfilled, (state, action) => {
        state.inventory = state.inventory.filter(i => i.id !== action.payload);
      });
  },
});

export const { setSelectedItem } = inventorySlice.actions;

export default inventorySlice.reducer;
