import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const getFareEstimate = createAsyncThunk('orders/estimate', async (data, { rejectWithValue }) => {
  try {
    const res = await api.post('/orders/estimate', data);
    return res.data.estimate;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Estimate failed');
  }
});

export const createOrder = createAsyncThunk('orders/create', async (data, { rejectWithValue }) => {
  try {
    const res = await api.post('/orders', data);
    return res.data.order;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Order creation failed');
  }
});

export const fetchMyOrders = createAsyncThunk('orders/myOrders', async (params = {}, { rejectWithValue }) => {
  try {
    const res = await api.get('/orders/my-orders', { params });
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch orders');
  }
});

export const fetchOrder = createAsyncThunk('orders/fetchOne', async (id, { rejectWithValue }) => {
  try {
    const res = await api.get(`/orders/${id}`);
    return res.data.order;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch order');
  }
});

export const fetchAvailableOrders = createAsyncThunk('orders/available', async (_, { rejectWithValue }) => {
  try {
    const res = await api.get('/orders/available');
    return res.data.orders;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch orders');
  }
});

export const fetchDriverOrders = createAsyncThunk('orders/driverOrders', async (params = {}, { rejectWithValue }) => {
  try {
    const res = await api.get('/orders/driver/assigned', { params });
    return res.data.orders;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch orders');
  }
});

export const acceptOrder = createAsyncThunk('orders/accept', async (id, { rejectWithValue }) => {
  try {
    const res = await api.put(`/orders/${id}/accept`);
    return res.data.order;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to accept order');
  }
});

export const updateOrderStatus = createAsyncThunk('orders/updateStatus', async ({ id, status, note }, { rejectWithValue }) => {
  try {
    const res = await api.put(`/orders/${id}/status`, { status, note });
    return res.data.order;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to update status');
  }
});

export const cancelOrder = createAsyncThunk('orders/cancel', async ({ id, reason }, { rejectWithValue }) => {
  try {
    const res = await api.put(`/orders/${id}/cancel`, { reason });
    return res.data.order;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to cancel order');
  }
});

export const rateOrder = createAsyncThunk('orders/rate', async ({ id, score, review }, { rejectWithValue }) => {
  try {
    const res = await api.post(`/orders/${id}/rate`, { score, review });
    return res.data.order;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to rate order');
  }
});

const orderSlice = createSlice({
  name: 'orders',
  initialState: {
    orders: [],
    currentOrder: null,
    estimate: null,
    availableOrders: [],
    driverOrders: [],
    loading: false,
    error: null,
    total: 0,
  },
  reducers: {
    clearEstimate(state) { state.estimate = null; },
    clearCurrentOrder(state) { state.currentOrder = null; },
    clearError(state) { state.error = null; },
    updateOrderInList(state, action) {
      const idx = state.orders.findIndex(o => o._id === action.payload._id);
      if (idx !== -1) state.orders[idx] = action.payload;
      if (state.currentOrder?._id === action.payload._id) state.currentOrder = action.payload;
    },
    addNewAvailableOrder(state, action) {
      state.availableOrders.unshift(action.payload);
    },
    removeAvailableOrder(state, action) {
      state.availableOrders = state.availableOrders.filter(o => o._id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    const setLoading = (state) => { state.loading = true; state.error = null; };
    const setError = (state, action) => { state.loading = false; state.error = action.payload; };

    builder
      .addCase(getFareEstimate.pending, setLoading)
      .addCase(getFareEstimate.fulfilled, (state, action) => { state.loading = false; state.estimate = action.payload; })
      .addCase(getFareEstimate.rejected, setError)
      .addCase(createOrder.pending, setLoading)
      .addCase(createOrder.fulfilled, (state, action) => { state.loading = false; state.currentOrder = action.payload; state.orders.unshift(action.payload); })
      .addCase(createOrder.rejected, setError)
      .addCase(fetchMyOrders.pending, setLoading)
      .addCase(fetchMyOrders.fulfilled, (state, action) => { state.loading = false; state.orders = action.payload.orders; state.total = action.payload.total; })
      .addCase(fetchMyOrders.rejected, setError)
      .addCase(fetchOrder.fulfilled, (state, action) => { state.currentOrder = action.payload; })
      .addCase(fetchAvailableOrders.fulfilled, (state, action) => { state.availableOrders = action.payload; })
      .addCase(fetchDriverOrders.fulfilled, (state, action) => { state.driverOrders = action.payload; })
      .addCase(acceptOrder.fulfilled, (state, action) => {
        state.driverOrders.unshift(action.payload);
        state.availableOrders = state.availableOrders.filter(o => o._id !== action.payload._id);
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        const idx = state.driverOrders.findIndex(o => o._id === action.payload._id);
        if (idx !== -1) state.driverOrders[idx] = action.payload;
      })
      .addCase(cancelOrder.fulfilled, (state, action) => {
        const idx = state.orders.findIndex(o => o._id === action.payload._id);
        if (idx !== -1) state.orders[idx] = action.payload;
        if (state.currentOrder?._id === action.payload._id) state.currentOrder = action.payload;
      })
      .addCase(rateOrder.fulfilled, (state, action) => {
        const idx = state.orders.findIndex(o => o._id === action.payload._id);
        if (idx !== -1) state.orders[idx] = action.payload;
      });
  },
});

export const { clearEstimate, clearCurrentOrder, clearError, updateOrderInList, addNewAvailableOrder, removeAvailableOrder } = orderSlice.actions;
export default orderSlice.reducer;
