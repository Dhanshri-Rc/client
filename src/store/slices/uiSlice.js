import { createSlice } from '@reduxjs/toolkit';

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    notifications: [],
    sidebarOpen: false,
    language: 'en',
  },
  reducers: {
    addNotification(state, action) {
      state.notifications.unshift({ id: Date.now(), ...action.payload, read: false });
      if (state.notifications.length > 20) state.notifications.pop();
    },
    markNotificationRead(state, action) {
      const n = state.notifications.find(n => n.id === action.payload);
      if (n) n.read = true;
    },
    markAllRead(state) { state.notifications.forEach(n => { n.read = true; }); },
    clearNotifications(state) { state.notifications = []; },
    toggleSidebar(state) { state.sidebarOpen = !state.sidebarOpen; },
    setSidebarOpen(state, action) { state.sidebarOpen = action.payload; },
    setLanguage(state, action) { state.language = action.payload; },
  },
});

export const { addNotification, markNotificationRead, markAllRead, clearNotifications, toggleSidebar, setSidebarOpen, setLanguage } = uiSlice.actions;
export default uiSlice.reducer;
