import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as authService from '../../services/authService';

export const loginUser = createAsyncThunk('auth/login', async (data, { rejectWithValue }) => {
  try { const res = await authService.login(data); return res.data.user; }
  catch (e) { return rejectWithValue(e.response?.data?.message || 'Login failed'); }
});

export const registerUser = createAsyncThunk('auth/register', async (data, { rejectWithValue }) => {
  try { const res = await authService.register(data); return res.data.user; }
  catch (e) { return rejectWithValue(e.response?.data?.message || 'Registration failed'); }
});

export const fetchMe = createAsyncThunk('auth/me', async (_, { rejectWithValue }) => {
  try { const res = await authService.getMe(); return res.data.user; }
  catch { return rejectWithValue(null); }
});

export const logoutUser = createAsyncThunk('auth/logout', async () => {
  await authService.logout();
});

const authSlice = createSlice({
  name: 'auth',
  initialState: { user: null, loading: false, error: null, initialized: false },
  reducers: { clearError: (s) => { s.error = null; } },
  extraReducers: (b) => {
    b
      .addCase(loginUser.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(loginUser.fulfilled, (s, a) => { s.loading = false; s.user = a.payload; })
      .addCase(loginUser.rejected, (s, a) => { s.loading = false; s.error = a.payload; })
      .addCase(registerUser.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(registerUser.fulfilled, (s, a) => { s.loading = false; s.user = a.payload; })
      .addCase(registerUser.rejected, (s, a) => { s.loading = false; s.error = a.payload; })
      .addCase(fetchMe.fulfilled, (s, a) => { s.user = a.payload; s.initialized = true; })
      .addCase(fetchMe.rejected, (s) => { s.initialized = true; })
      .addCase(logoutUser.fulfilled, (s) => { s.user = null; });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;
