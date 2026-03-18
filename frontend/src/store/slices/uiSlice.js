import { createSlice } from '@reduxjs/toolkit';

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    sidebarCollapsed: false,
    activeView: 'board', // board | list | dashboard
    filterStatus: 'all',
    filterPriority: 'all',
    searchQuery: '',
    taskModal: { open: false, task: null },
    pomodoroTask: null,
  },
  reducers: {
    toggleSidebar: (s) => { s.sidebarCollapsed = !s.sidebarCollapsed; },
    setActiveView: (s, a) => { s.activeView = a.payload; },
    setFilterStatus: (s, a) => { s.filterStatus = a.payload; },
    setFilterPriority: (s, a) => { s.filterPriority = a.payload; },
    setSearchQuery: (s, a) => { s.searchQuery = a.payload; },
    openTaskModal: (s, a) => { s.taskModal = { open: true, task: a.payload || null }; },
    closeTaskModal: (s) => { s.taskModal = { open: false, task: null }; },
    setPomodoroTask: (s, a) => { s.pomodoroTask = a.payload; },
  },
});

export const {
  toggleSidebar, setActiveView, setFilterStatus, setFilterPriority,
  setSearchQuery, openTaskModal, closeTaskModal, setPomodoroTask,
} = uiSlice.actions;

export default uiSlice.reducer;
