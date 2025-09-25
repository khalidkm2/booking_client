// src/features/seatSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../api/axios";

type Seat = { id: number; seatNo: string; isBooked: boolean };

const initialState = { seats: [] as Seat[], loading: false, error: null as string | null };

// Fetch seats for a show
export const fetchSeatsForShow = createAsyncThunk(
  "seats/fetchForShow",
  async (showId: number) => {
    const res = await axios.get(`/booking/shows/${showId}/seats`);
    return res.data.data as Seat[];
  }
);

// Reserve multiple seats
export const reserveSeats = createAsyncThunk(
  "seats/reserve",
  async (payload: { showId: number; seatIds: number[]; userId?: number }) => {
    const res = await axios.post(`/booking/shows/${payload.showId}/reserve`, {
      data: { seatIds: payload.seatIds, userId: payload.userId },
    });
    return res.data.data; // array of reservations
  }
);

const seatSlice = createSlice({
  name: "seats",
  initialState,
  reducers: {},
  extraReducers: (b) => {
    b.addCase(fetchSeatsForShow.pending, (s) => {
      s.loading = true;
    })
      .addCase(fetchSeatsForShow.fulfilled, (s, a) => {
        s.loading = false;
        s.seats = a.payload;
      })
      .addCase(fetchSeatsForShow.rejected, (s, a) => {
        s.loading = false;
        s.error = a.error.message || "Error";
      })
      .addCase(reserveSeats.fulfilled, (s, a) => {
        // mark all booked seats locally
        const bookedIds = a.payload.map((r: any) => r.seatId);
        s.seats = s.seats.map((seat) =>
          bookedIds.includes(seat.id) ? { ...seat, isBooked: true } : seat
        );
      });
  },
});

export default seatSlice.reducer;
