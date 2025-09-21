import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from "../api/axios"

type Seat = { id: number; seatNo: string; isBooked: boolean };

const initialState = { seats: [] as Seat[], loading: false, error: null as string | null };

export const fetchSeatsForShow = createAsyncThunk('seats/fetchForShow', async (showId: number) => {
  const res = await axios.get(`/booking/shows/${showId}/seats`);
  console.log("response",res);
  return res.data.data as Seat[];
});

export const reserveSeat = createAsyncThunk('seats/reserve', async (payload: { showId: number; seatId: number; userId?: number }) => {
  const res = await axios.post(`/booking/shows/${payload.showId}/reserve`, { data: { seatId: payload.seatId, userId: payload.userId } });
  return res.data.data;
});

const seatSlice = createSlice({ name: 'seats', initialState, reducers: {}, extraReducers: (b) => {
  b.addCase(fetchSeatsForShow.pending, (s) => { s.loading = true; })
   .addCase(fetchSeatsForShow.fulfilled, (s, a) => { s.loading = false; s.seats = a.payload; })
   .addCase(fetchSeatsForShow.rejected, (s, a) => { s.loading = false; s.error = a.error.message || 'Error'; })
   .addCase(reserveSeat.fulfilled, (s, a) => {
     // mark seat booked locally if seat exists
     const id = a.payload.seatId;
     const idx = s.seats.findIndex((x) => x.id === id);
     if (idx >= 0) s.seats[idx].isBooked = true;
   });
}});

export default seatSlice.reducer;
