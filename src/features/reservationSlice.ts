// src/features/reservations/reservationSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from "../api/axios"

const initialState = { reservations: [], loading: false, error: null as string | null };

export const cancelReservation = createAsyncThunk('reservations/cancel', async (reservationId: number) => {
  const res = await axios.patch(`/reservations/${reservationId}/cancel`);
  return { id: reservationId, message: res.data.message };
});

const reservationSlice = createSlice({ name: 'reservations', initialState, reducers: {}, extraReducers: (b) => {
  b.addCase(cancelReservation.fulfilled, (s, a) => { s.loading = false; s.reservations = s.reservations.filter((r: any) => r.id !== a.payload.id); });
}});

export default reservationSlice.reducer;