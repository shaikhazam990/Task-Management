import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as authService from '../../services/authService';

const GUEST_USER = {
  id: 'guest',
  name: 'Guest User',
  email: 'guest@taskflow.demo',
  isGuest: true,
};

const saveAuth = (user, token) => {
  try {
    localStorage.setItem('auth_user', JSON.stringify(user));
    if (token) localStorage.setItem('auth_token', token);
  } catch {}
};

const clearAuth = () => {
  try {
    localStorage.removeItem('auth_user');
    localStorage.removeItem('auth_token');
  } catch {}
};

export const loginUser = createAsyncThunk('auth/login', async (data, { rejectWithValue }) => {
  if (data.email === 'guest@taskflow.demo') {
    saveAuth(GUEST_USER, null);
    return GUEST_USER;
  }
  try {
    const res = await authService.login(data);
    const { user, token } = res.data.data;
    saveAuth(user, token);
    return user;
  } catch (e) { return rejectWithValue(e.response?.data?.message || 'Login failed'); }
});

export const registerUser = createAsyncThunk('auth/register', async (data, { rejectWithValue }) => {
  try {
    const res = await authService.register(data);
    const { user, token } = res.data.data;
    saveAuth(user, token);
    return user;
  } catch (e) { return rejectWithValue(e.response?.data?.message || 'Registration failed'); }
});

export const fetchMe = createAsyncThunk('auth/me', async (_, { rejectWithValue }) => {
  try {
    const saved = localStorage.getItem('auth_user');
    const parsed = saved ? JSON.parse(saved) : null;
    if (parsed?.isGuest) return parsed;
    const token = localStorage.getItem('auth_token');
    if (!token) return rejectWithValue(null);
    const res = await authService.getMe();
    return res.data.user;
  } catch {
    clearAuth();
    return rejectWithValue(null);
  }
});

export const logoutUser = createAsyncThunk('auth/logout', async (_, { getState }) => {
  clearAuth();
  const { auth } = getState();
  if (auth.user?.isGuest) return;
  try { await authService.logout(); } catch {}
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
      .addCase(fetchMe.rejected, (s) => { s.user = null; s.initialized = true; })
      .addCase(logoutUser.fulfilled, (s) => { s.user = null; s.initialized = true; });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;