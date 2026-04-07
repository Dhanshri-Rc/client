import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import { getMe } from './store/slices/authSlice';
import { useSocket } from './hooks/useSocket';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CustomerDashboard from './pages/CustomerDashboard';
import DriverDashboard from './pages/DriverDashboard';
import AdminDashboard from './pages/AdminDashboard';
import BookingPage from './pages/BookingPage';
import TrackingPage from './pages/TrackingPage';
import OrderHistoryPage from './pages/OrderHistoryPage';
import ProfilePage from './pages/ProfilePage';
import NotFoundPage from './pages/NotFoundPage';

// Layout
import Layout from './components/common/Layout';

// Route guards
const PrivateRoute = ({ children, roles }) => {
  const { user, token } = useSelector((s) => s.auth);
  if (!token || !user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />;
  return children;
};

const PublicRoute = ({ children }) => {
  const { user, token } = useSelector((s) => s.auth);
  if (token && user) {
    if (user.role === 'driver') return <Navigate to="/driver" replace />;
    if (user.role === 'admin') return <Navigate to="/admin" replace />;
    return <Navigate to="/dashboard" replace />;
  }
  return children;
};

// Socket initializer component
const SocketInitializer = () => {
  useSocket();
  return null;
};

export default function App() {
  const dispatch = useDispatch();
  const { token } = useSelector((s) => s.auth);

  useEffect(() => {
    if (token) dispatch(getMe());
  }, []);

  return (
    <BrowserRouter>
      <SocketInitializer />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: { borderRadius: '12px', fontFamily: 'Inter, sans-serif' },
          success: { iconTheme: { primary: '#f97316', secondary: '#fff' } },
        }}
      />
      <Routes>
        {/* Public */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />

        {/* Customer */}
        <Route path="/dashboard" element={<PrivateRoute roles={['customer']}><Layout><CustomerDashboard /></Layout></PrivateRoute>} />
        <Route path="/book" element={<PrivateRoute roles={['customer']}><Layout><BookingPage /></Layout></PrivateRoute>} />
        <Route path="/track/:orderId" element={<PrivateRoute roles={['customer', 'driver', 'admin']}><Layout><TrackingPage /></Layout></PrivateRoute>} />
        <Route path="/orders" element={<PrivateRoute roles={['customer']}><Layout><OrderHistoryPage /></Layout></PrivateRoute>} />

        {/* Driver */}
        <Route path="/driver" element={<PrivateRoute roles={['driver']}><Layout><DriverDashboard /></Layout></PrivateRoute>} />

        {/* Admin */}
        <Route path="/admin" element={<PrivateRoute roles={['admin']}><Layout><AdminDashboard /></Layout></PrivateRoute>} />

        {/* Profile */}
        <Route path="/profile" element={<PrivateRoute><Layout><ProfilePage /></Layout></PrivateRoute>} />

        {/* 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}
