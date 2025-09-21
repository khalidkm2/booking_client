// src/store/index.ts
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/authSlice';
import showReducer from '../features/showSlice';
import seatReducer from '../features/seatSlice';
import reservationReducer from '../features/reservationSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    shows: showReducer,
    seats: seatReducer,
    reservations: reservationReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
