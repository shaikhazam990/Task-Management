import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as taskService from '../../services/taskService';

export const fetchTasks = createAsyncThunk('tasks/fetch', async (params, { rejectWithValue }) => {
  try { const res = await taskService.getTasks(params); return res.data; }
  catch (e) { return rejectWithValue(e.response?.data?.message); }
});

export const addTask = createAsyncThunk('tasks/add', async (data, { rejectWithValue }) => {
  try { const res = await taskService.createTask(data); return res.data.task; }
  catch (e) { return rejectWithValue(e.response?.data?.message); }
});

export const editTask = createAsyncThunk('tasks/edit', async ({ id, data }, { rejectWithValue }) => {
  try { const res = await taskService.updateTask(id, data); return res.data.task; }
  catch (e) { return rejectWithValue(e.response?.data?.message); }
});

export const removeTask = createAsyncThunk('tasks/remove', async (id, { rejectWithValue }) => {
  try { await taskService.deleteTask(id); return id; }
  catch (e) { return rejectWithValue(e.response?.data?.message); }
});

const taskSlice = createSlice({
  name: 'tasks',
  initialState: { tasks: [], pagination: null, loading: false, error: null },
  reducers: {
    reorderTasks: (s, a) => { s.tasks = a.payload; },
  },
  extraReducers: (b) => {
    b
      .addCase(fetchTasks.pending, (s) => { s.loading = true; })
      .addCase(fetchTasks.fulfilled, (s, a) => { s.loading = false; s.tasks = a.payload.tasks; s.pagination = a.payload.pagination; })
      .addCase(fetchTasks.rejected, (s, a) => { s.loading = false; s.error = a.payload; })
      .addCase(addTask.fulfilled, (s, a) => { s.tasks.unshift(a.payload); })
      .addCase(editTask.fulfilled, (s, a) => {
        const i = s.tasks.findIndex(t => t._id === a.payload._id);
        if (i !== -1) s.tasks[i] = a.payload;
      })
      .addCase(removeTask.fulfilled, (s, a) => { s.tasks = s.tasks.filter(t => t._id !== a.payload); });
  },
});

export const { reorderTasks } = taskSlice.actions;
export default taskSlice.reducer;
