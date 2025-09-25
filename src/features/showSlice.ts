// src/features/shows/showSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../api/axios';

// types/show.ts
export type Show = {
  id?: number;               // optional, backend will generate
  title: string;
  description: string;
  category: string;
  startingTime: string;      // ISO string
  duration?: number | null;  // minutes
  price?: number | null;
  rating?: number | null;
  language?: string;
  ageLimit?: string;
  backgroundImage?: string | null;
  image: string;             // poster
  userId?: number;
};

// --- Updated initial state to hold pagination info ---
interface ShowsState {
  shows: {
    data: Show[];
    currentPage: number;
    totalPages: number;
  };
  loading: boolean;
  error: string | null;
}

const initialState: ShowsState = {
  shows: { data: [], currentPage: 1, totalPages: 1 },
  loading: false,
  error: null,
};

// --- fetchShows accepts page number now ---
export const fetchShows = createAsyncThunk(
  'shows/fetchAll',
  async (page: number = 1) => {
    const res = await axios.get(`/shows?page=${page}`);
    return res.data as { data: Show[]; currentPage: number; totalPages: number };
  }
);

export const fetchShow = createAsyncThunk('shows/fetchOne', async (id: number) => {
  console.log("fetch one show")
  const res = await axios.get(`/shows/${id}`);
  return res.data.data as Show;
});

export const createShow = createAsyncThunk('shows/create', async (body: Show) => {
  const res = await axios.post('/shows', body);
  return res.data.show as Show;
});

const showSlice = createSlice({
  name: 'shows',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchShows.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchShows.fulfilled, (state, action) => {
        state.loading = false;
        state.shows = action.payload; // now stores { data, currentPage, totalPages }
      })
      .addCase(fetchShows.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Error fetching shows';
      })
      .addCase(fetchShow.fulfilled, (state, action) => {
        const idx = state.shows.data.findIndex((x) => x.id === action.payload.id);
        if (idx >= 0) state.shows.data[idx] = action.payload;
        else state.shows.data.push(action.payload);
      })
      .addCase(createShow.fulfilled, (state, action) => {
        state.shows.data.push(action.payload);
      });
  },
});

export default showSlice.reducer;
