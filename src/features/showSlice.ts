// src/features/shows/showSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../api/axios'

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

const initialState = { shows: [] as Show[], loading: false, error: null as string | null };

export const fetchShows= createAsyncThunk('shows/fetchAll', async () => {
  console.log("lsdjflsjdflsjflakjdf")
  const res = await axios.get('/shows');
  console.log("ldjf",res)
  return res.data.data as Show[];
});

export const fetchShow = createAsyncThunk('shows/fetchOne', async (id: number) => {
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
      .addCase(fetchShows.pending, (s) => { s.loading = true; })
      .addCase(fetchShows.fulfilled, (s, a) => { s.loading = false; s.shows = a.payload; })
      .addCase(fetchShows.rejected, (s, a) => { s.loading = false; s.error = a.error.message || 'Error'; })
      .addCase(fetchShow.fulfilled, (s, a) => {
        const idx = s.shows.findIndex((x) => x.id === a.payload.id);
        if (idx >= 0) s.shows[idx] = a.payload;
        else s.shows.push(a.payload);
      })
      .addCase(createShow.fulfilled, (s, a) => { s.shows.push(a.payload); });
  },
});

export default showSlice.reducer;