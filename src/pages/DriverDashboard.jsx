import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Power, MapPin, Package, TrendingUp, Clock, Navigation, Star, CheckCircle, XCircle } from 'lucide-react';
import { fetchDriverProfile, fetchEarnings, toggleAvailability } from '../store/slices/driverSlice';
import { fetchAvailableOrders, fetchDriverOrders, acceptOrder, updateOrderStatus } from '../store/slices/orderSlice';
import { getSocket } from '../services/socket';
import { StatCard, StatusBadge, EmptyState, PageLoader, Spinner } from '../components/common/UI';
import { formatCurrency, formatDate, getVehicleIcon } from '../utils/helpers';
import toast from 'react-hot-toast';

export default function DriverDashboard() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { profile, earnings, loading: driverLoading } = useSelector((s) => s.driver);
  const { availableOrders, driverOrders, loading } = useSelector((s) => s.orders);
  const { user } = useSelector((s) => s.auth);
  const [activeTab, setActiveTab] = useState('available');
  const [togglingOnline, setTogglingOnline] = useState(false);

  useEffect(() => {
    dispatch(fetchDriverProfile());
    dispatch(fetchEarnings());
    dispatch(fetchAvailableOrders());
    dispatch(fetchDriverOrders());
  }, [dispatch]);

  // Socket: listen for new orders
  useEffect(() => {
    const socket = getSocket();
    socket.on('new:order_available', () => {
      dispatch(fetchAvailableOrders());
    });
    return () => socket.off('new:order_available');
  }, []);

  const handleToggleOnline = async () => {
    setTogglingOnline(true);
    const result = await dispatch(toggleAvailability(!profile?.isOnline));
    if (toggleAvailability.fulfilled.match(result)) {
      const online = result.payload.isOnline;
      toast.success(online ? '🟢 You are now online' : '🔴 You are now offline');
    }
    setTogglingOnline(false);
  };

  const handleAcceptOrder = async (orderId) => {
    const result = await dispatch(acceptOrder(orderId));
    if (acceptOrder.fulfilled.match(result)) {
      toast.success('Order accepted!');
      setActiveTab('active');
    }
  };

  const handleStatusUpdate = async (orderId, currentStatus) => {
    const next = { accepted: 'picked', picked: 'delivered' }[currentStatus];
    if (!next) return;
    const result = await dispatch(updateOrderStatus({ id: orderId, status: next }));
    if (updateOrderStatus.fulfilled.match(result)) {
      toast.success(`Order marked as ${next}!`);
      dispatch(fetchEarnings());
    }
  };

  if (driverLoading && !profile) return <PageLoader />;

  const activeOrders = driverOrders.filter(o => ['accepted', 'picked'].includes(o.status));
  const completedOrders = driverOrders.filter(o => o.status === 'delivered');

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-in">
      {/* Header with online toggle */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t('driverDashboard')}</h1>
          <p className="text-gray-500 mt-1">
            {profile?.vehicleType && <><span className="text-lg">{getVehicleIcon(profile.vehicleType)}</span> {profile.vehicleNumber || 'Vehicle'} • {profile.vehicleModel || ''}</>}
          </p>
        </div>

        <button
          onClick={handleToggleOnline}
          disabled={togglingOnline}
          className={`flex items-center gap-2.5 px-5 py-3 rounded-xl font-semibold transition-all text-sm shadow-sm ${
            profile?.isOnline
              ? 'bg-green-500 hover:bg-green-600 text-white shadow-green-200'
              : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
          }`}
        >
          {togglingOnline ? <Spinner size="sm" color={profile?.isOnline ? 'white' : 'gray'} /> : <Power className="w-4 h-4" />}
          {profile?.isOnline ? t('goOffline') : t('goOnline')}
        </button>
      </div>

      {/* Online status bar */}
      {!profile?.isOnline && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex items-center gap-3 text-sm">
          <span className="text-yellow-500">⚠️</span>
          <span className="text-yellow-700">You are offline. Go online to receive new order requests.</span>
        </div>
      )}
      {profile?.isOnline && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3 text-sm">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse-dot" />
          <span className="text-green-700">You're online and accepting orders.</span>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title={t('todayEarnings')} value={formatCurrency(earnings?.today || 0)} icon={TrendingUp} color="primary" />
        <StatCard title="This Week" value={formatCurrency(earnings?.thisWeek || 0)} icon={TrendingUp} color="blue" />
        <StatCard title={t('totalEarnings')} value={formatCurrency(earnings?.total || 0)} icon={TrendingUp} color="green" />
        <StatCard title="Total Deliveries" value={earnings?.totalDeliveries || 0} icon={Package} color="purple" />
      </div>

      {/* Rating */}
      {profile?.rating && (
        <div className="card flex items-center gap-4">
          <div className="w-12 h-12 bg-yellow-50 rounded-2xl flex items-center justify-center">
            <Star className="w-6 h-6 text-yellow-500" />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Your Rating</p>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-gray-900">{profile.rating.average || '—'}</span>
              <span className="text-yellow-400">{'★'.repeat(Math.round(profile.rating.average || 0))}</span>
              <span className="text-xs text-gray-400">({profile.rating.count} reviews)</span>
            </div>
          </div>
          <div className="ml-auto text-right">
            <p className="text-sm text-gray-500">Today's trips</p>
            <p className="text-xl font-bold text-gray-900">{earnings?.todayDeliveries || 0}</p>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div>
        <div className="flex gap-1 bg-gray-100 rounded-xl p-1 mb-4">
          {[
            { key: 'available', label: `Available (${availableOrders.length})` },
            { key: 'active', label: `Active (${activeOrders.length})` },
            { key: 'history', label: `History (${completedOrders.length})` },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${activeTab === tab.key ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Available orders */}
        {activeTab === 'available' && (
          <div className="space-y-3">
            {availableOrders.length === 0 ? (
              <EmptyState icon={Package} title="No available orders" description="New orders will appear here when customers book." />
            ) : (
              availableOrders.map(order => (
                <div key={order._id} className="card hover:shadow-md transition-all animate-slide-up">
                  <div className="flex items-start gap-3 mb-3">
                    <span className="text-3xl">{getVehicleIcon(order.vehicleType)}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <StatusBadge status={order.status} />
                        <span className="text-xs text-gray-400">{formatDate(order.createdAt)}</span>
                      </div>
                      <p className="text-sm text-gray-700 truncate">📍 {order.pickup?.address}</p>
                      <p className="text-sm text-gray-700 truncate">🏁 {order.dropoff?.address}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-lg font-bold text-primary-600">{formatCurrency(order.fare?.total)}</p>
                      <p className="text-xs text-gray-400">{order.distance?.toFixed(1)} km</p>
                    </div>
                  </div>
                  {order.customer && (
                    <p className="text-xs text-gray-400 mb-3">Customer: {order.customer.name}</p>
                  )}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleAcceptOrder(order._id)}
                      disabled={loading}
                      className="btn-primary flex-1 py-2 text-sm"
                    >
                      <CheckCircle className="w-4 h-4" /> {t('acceptOrder')}
                    </button>
                    <button className="btn-secondary py-2 px-4 text-sm">
                      <XCircle className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Active orders */}
        {activeTab === 'active' && (
          <div className="space-y-3">
            {activeOrders.length === 0 ? (
              <EmptyState icon={Navigation} title="No active orders" description="Accept an order to see it here." />
            ) : (
              activeOrders.map(order => (
                <div key={order._id} className="card hover:shadow-md transition-all">
                  <div className="flex items-start gap-3 mb-3">
                    <span className="text-3xl">{getVehicleIcon(order.vehicleType)}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <StatusBadge status={order.status} />
                        <span className="text-xs text-gray-400">{formatDate(order.createdAt)}</span>
                      </div>
                      <p className="text-sm text-gray-700 truncate">📍 {order.pickup?.address}</p>
                      <p className="text-sm text-gray-700 truncate">🏁 {order.dropoff?.address}</p>
                    </div>
                    <p className="text-lg font-bold text-primary-600 flex-shrink-0">{formatCurrency(order.fare?.total)}</p>
                  </div>
                  <div className="flex gap-2">
                    <Link to={`/track/${order._id}`} className="btn-secondary flex-1 py-2 text-sm">
                      <MapPin className="w-4 h-4" /> View Map
                    </Link>
                    {order.status === 'accepted' && (
                      <button onClick={() => handleStatusUpdate(order._id, order.status)} className="btn-primary flex-1 py-2 text-sm">
                        Mark Picked Up 📦
                      </button>
                    )}
                    {order.status === 'picked' && (
                      <button onClick={() => handleStatusUpdate(order._id, order.status)} className="btn-primary flex-1 py-2 text-sm bg-green-500 hover:bg-green-600">
                        Mark Delivered ✅
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* History */}
        {activeTab === 'history' && (
          <div className="space-y-3">
            {completedOrders.length === 0 ? (
              <EmptyState icon={Clock} title="No completed orders yet" description="Completed deliveries will show up here." />
            ) : (
              completedOrders.map(order => (
                <div key={order._id} className="card flex items-center gap-3">
                  <span className="text-2xl">{getVehicleIcon(order.vehicleType)}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <StatusBadge status={order.status} />
                      <span className="text-xs text-gray-400">{formatDate(order.createdAt)}</span>
                    </div>
                    <p className="text-sm text-gray-600 truncate">{order.pickup?.address} → {order.dropoff?.address}</p>
                    {order.rating?.score && (
                      <p className="text-xs text-yellow-500 mt-0.5">Rated: {'★'.repeat(order.rating.score)}</p>
                    )}
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="font-bold text-green-600">{formatCurrency(order.fare?.total)}</p>
                    <p className="text-xs text-gray-400">{order.distance?.toFixed(1)} km</p>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
