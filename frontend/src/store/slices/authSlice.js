import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as authService from '../../services/authService';

const GUEST_USER = {
  id: 'guest',
  name: 'Guest User',
  email: 'guest@taskflow.demo',
  isGuest: true,
};

export const loginUser = createAsyncThunk('auth/login', async (data, { rejectWithValue }) => {
  // ✅ Handle guest locally — no API call
  if (data.email === 'guest@taskflow.demo') {
    return GUEST_USER;
  }
  try { const res = await authService.login(data); return res.data.user; }
  catch (e) { return rejectWithValue(e.response?.data?.message || 'Login failed'); }
});

export const registerUser = createAsyncThunk('auth/register', async (data, { rejectWithValue }) => {
  try { const res = await authService.register(data); return res.data.user; }
  catch (e) { return rejectWithValue(e.response?.data?.message || 'Registration failed'); }
});

export const fetchMe = createAsyncThunk('auth/me', async (_, { rejectWithValue, getState }) => {
  // ✅ If guest, don't hit API — just return guest user
  const { auth } = getState();
  if (auth.user?.isGuest) return auth.user;
  try { const res = await authService.getMe(); return res.data.user; }
  catch { return rejectWithValue(null); }
});

export const logoutUser = createAsyncThunk('auth/logout', async (_, { getState }) => {
  const { auth } = getState();
  // ✅ Skip API logout for guest
  if (auth.user?.isGuest) return;
  await authService.logout();
});

const authSlice = createSlice({
  name: 'auth',
  initialState: { user: null, loading: false, error: null, initialized: false },
  reducers: { clearError: (s) => { s.error = null; } },
  extraReducers: (b) => {
    b
      .addCase(loginUser.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(loginUser.fulfilled, (s, a) => { s.loading = false; s.user = a.payload; s.initialized = true; })
      .addCase(loginUser.rejected, (s, a) => { s.loading = false; s.error = a.payload; })
      .addCase(registerUser.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(registerUser.fulfilled, (s, a) => { s.loading = false; s.user = a.payload; s.initialized = true; })
      .addCase(registerUser.rejected, (s, a) => { s.loading = false; s.error = a.payload; })
      .addCase(fetchMe.fulfilled, (s, a) => { s.user = a.payload; s.initialized = true; })
      .addCase(fetchMe.rejected, (s) => { s.initialized = true; })
      .addCase(logoutUser.fulfilled, (s) => { s.user = null; s.initialized = true; });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;