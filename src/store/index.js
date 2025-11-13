import { configureStore } from '@reduxjs/toolkit';
import animalsReducer from './slices/animalsSlice';
import ownersReducer from './slices/ownersSlice';
import eventsReducer from './slices/eventsSlice';
import inventoryReducer from './slices/inventorySlice';
import reportsReducer from './slices/reportsSlice';
import authReducer from './slices/authSlice';
import notificationsReducer from './slices/notificationsSlice';

export const store = configureStore({
  reducer: {
    animals: animalsReducer,
    owners: ownersReducer,
    events: eventsReducer,
    inventory: inventoryReducer,
    reports: reportsReducer,
    auth: authReducer,
    notifications: notificationsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;
