import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const fetchDriverProfile = createAsyncThunk('driver/profile', async (_, { rejectWithValue }) => {
  try {
    const res = await api.get('/drivers/profile');
    return res.data.driver;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed');
  }
});

export const fetchEarnings = createAsyncThunk('driver/earnings', async (_, { rejectWithValue }) => {
  try {
    const res = await api.get('/drivers/earnings');
    return res.data.earnings;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed');
  }
});

export const toggleAvailability = createAsyncThunk('driver/toggle', async (isOnline, { rejectWithValue }) => {
  try {
    const res = await api.put('/drivers/availability', { isOnline });
    return res.data.driver;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed');
  }
});

export const updateDriverLocation = createAsyncThunk('driver/location', async (data, { rejectWithValue }) => {
  try {
    await api.put('/drivers/location', data);
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed');
  }
});

const driverSlice = createSlice({
  name: 'driver',
  initialState: {
    profile: null,
    earnings: null,
    currentLocation: null,
    loading: false,
    error: null,
  },
  reducers: {
    setCurrentLocation(state, action) { state.currentLocation = action.payload; },
    clearError(state) { state.error = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDriverProfile.pending, (state) => { state.loading = true; })
      .addCase(fetchDriverProfile.fulfilled, (state, action) => { state.loading = false; state.profile = action.payload; })
      .addCase(fetchDriverProfile.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(fetchEarnings.fulfilled, (state, action) => { state.earnings = action.payload; })
      .addCase(toggleAvailability.fulfilled, (state, action) => { state.profile = action.payload; })
      .addCase(updateDriverLocation.fulfilled, (state, action) => { state.currentLocation = action.payload; });
  },
});

export const { setCurrentLocation, clearError } = driverSlice.actions;
export default driverSlice.reducer;
