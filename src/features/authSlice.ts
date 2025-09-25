// src/features/auth/authSlice.ts
import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import axios from '../api/axios';

type User = { id: number; name: string; email: string; role: string } | null;

type AuthState = {
  user: User;
  loading: boolean;
  error: string | null;
};

const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
};

// Automatically load user from token if present
export const loadUserFromToken = createAsyncThunk(
  'auth/loadUserFromToken',
  async (_, thunkAPI) => {
    const token = localStorage.getItem('token');
    if (!token) return null;

    try {
      const res = await axios.get('/user/me', { headers: { Authorization: `Bearer ${token}` } });
      return res.data.data; // user object
    } catch (err: any) {
      localStorage.removeItem('token');
      return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const signIn = createAsyncThunk(
  'auth/signIn',
  async (credentials: { email: string; password: string }, thunkAPI) => {
    try {
      const res = await axios.post('/user/sign-in', credentials);
      const token = (res as any).data?.token;
      if (token) localStorage.setItem('token', token);
      return res.data.data; // user object
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const signUp = createAsyncThunk(
  'auth/signUp',
  async (body: { name: string; email: string; password: string }, thunkAPI) => {
    try {
      const res = await axios.post('/user/sign-up', body);
      return res.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      localStorage.removeItem('token');
    },
    setUser(state, action: PayloadAction<User>) {
      state.user = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadUserFromToken.fulfilled, (s, a) => { s.user = a.payload; })
      .addCase(loadUserFromToken.rejected, (s) => { s.user = null; })
      .addCase(signIn.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(signIn.fulfilled, (s, a) => { s.loading = false; s.user = a.payload; })
      .addCase(signIn.rejected, (s, a) => { s.loading = false; s.error = a.payload as string; })
      .addCase(signUp.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(signUp.fulfilled, (s) => { s.loading = false; })
      .addCase(signUp.rejected, (s, a) => { s.loading = false; s.error = a.payload as string; });
  },
});

export const { logout, setUser } = authSlice.actions;
export default authSlice.reducer;
