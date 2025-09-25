// src/features/reservations/reservationSlice.ts
import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import axios from "../api/axios";

export type Reservation = {
  id: number;
  showId: number;
  seatId: number;
  userId: number;
  status: string;
  seat?: { id: number; seatNo: string };
  show?: {
    id: number;
    title: string;
    description: string;
    startingTime: string;
    image?: string;
  };
};

interface ReservationState {
  reservations: Reservation[];
  loading: boolean;
  error: string | null;
}

const initialState: ReservationState = {
  reservations: [],
  loading: false,
  error: null,
};

// ✅ Fetch all reservations
export const getReservations = createAsyncThunk("reservations/get", async () => {
  const res = await axios.get("/booking/reservations");
  return res.data.data as Reservation[]; // 👈 only the array
});

// ✅ Cancel reservation (and refresh list)
export const cancelReservation = createAsyncThunk(
  "reservations/cancel",
  async ({ reservationId, userId }: { reservationId: number; userId: number }, { dispatch }) => {
    await axios.patch(`/booking/reservations/${reservationId}/cancel`, { userId });
    // refresh reservations after cancel
    dispatch(getReservations());
    return reservationId;
  }
);

const reservationSlice = createSlice({
  name: "reservations",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // getReservations
      .addCase(getReservations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getReservations.fulfilled, (state, action: PayloadAction<Reservation[]>) => {
        state.loading = false;
        state.reservations = action.payload;
      })
      .addCase(getReservations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch reservations.";
      })

      // cancelReservation
      .addCase(cancelReservation.pending, (state) => {
        state.loading = true;
      })
      .addCase(cancelReservation.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(cancelReservation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to cancel reservation.";
      });
  },
});

export default reservationSlice.reducer;
