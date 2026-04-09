import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Package, Plus, MapPin, Clock, ArrowRight, TrendingUp } from 'lucide-react';
import { fetchMyOrders } from '../store/slices/orderSlice';
import { StatCard, StatusBadge, EmptyState, PageLoader } from '../components/common/UI';
import { formatCurrency, formatDate, getVehicleIcon } from '../utils/helpers';

export default function CustomerDashboard() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { user } = useSelector((s) => s.auth);
  const { orders, loading } = useSelector((s) => s.orders);

  useEffect(() => { dispatch(fetchMyOrders({ limit: 5 })); }, [dispatch]);

  const activeOrders = orders.filter(o => ['pending', 'accepted', 'picked'].includes(o.status));
  const completedOrders = orders.filter(o => o.status === 'delivered');
  const totalSpent = orders.filter(o => o.status === 'delivered').reduce((s, o) => s + o.fare.total, 0);

  if (loading && orders.length === 0) return <PageLoader />;

  // return (
  //   <div className="max-w-5xl mx-auto space-y-6 animate-fade-in">
  //     {/* Welcome */}
  //     <div className="flex items-center justify-between">
  //       <div>
  //         <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user?.name?.split(' ')[0]} 👋</h1>
  //         <p className="text-gray-500 mt-1">Here's what's happening with your deliveries</p>
  //       </div>
  //       <Link to="/book" className="btn-primary">
  //         <Plus className="w-4 h-4" /> {t('bookDelivery')}
  //       </Link>
  //     </div>

  //     {/* Stats */}
  //     <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
  //       <StatCard title="Total Orders" value={orders.length} icon={Package} color="primary" />
  //       <StatCard title="Completed" value={completedOrders.length} icon={TrendingUp} color="green" />
  //       <StatCard title="Total Spent" value={formatCurrency(totalSpent)} icon={MapPin} color="blue" />
  //     </div>

  //     {/* Active orders */}
  //     {activeOrders.length > 0 && (
  //       <div>
  //         <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
  //           <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse-dot" />
  //           Active Orders
  //         </h2>
  //         <div className="space-y-3">
  //           {activeOrders.map(order => (
  //             <div key={order._id} className="card flex items-center gap-4 hover:shadow-md transition-all">
  //               <div className="text-3xl">{getVehicleIcon(order.vehicleType)}</div>
  //               <div className="flex-1 min-w-0">
  //                 <div className="flex items-center gap-2 mb-1">
  //                   <StatusBadge status={order.status} />
  //                   <span className="text-xs text-gray-400">{formatDate(order.createdAt)}</span>
  //                 </div>
  //                 <p className="text-sm text-gray-700 truncate">📍 {order.pickup?.address}</p>
  //                 <p className="text-sm text-gray-700 truncate">🏁 {order.dropoff?.address}</p>
  //               </div>
  //               <div className="text-right">
  //                 <p className="font-bold text-gray-900">{formatCurrency(order.fare?.total)}</p>
  //                 <Link to={`/track/${order._id}`} className="text-primary-500 text-xs font-medium flex items-center gap-1 mt-1 hover:text-primary-700">
  //                   Track <ArrowRight className="w-3 h-3" />
  //                 </Link>
  //               </div>
  //             </div>
  //           ))}
  //         </div>
  //       </div>
  //     )}

  //     {/* Recent orders */}
  //     <div>
  //       <div className="flex items-center justify-between mb-3">
  //         <h2 className="text-lg font-semibold text-gray-900">{t('orderHistory')}</h2>
  //         <Link to="/orders" className="text-sm text-primary-500 font-medium hover:text-primary-700 flex items-center gap-1">
  //           View all <ArrowRight className="w-3 h-3" />
  //         </Link>
  //       </div>

  //       {orders.length === 0 ? (
  //         <EmptyState
  //           icon={Package}
  //           title="No orders yet"
  //           description="Book your first delivery and it will appear here."
  //           action={<Link to="/book" className="btn-primary text-sm">Book Now</Link>}
  //         />
  //       ) : (
  //         <div className="space-y-3">
  //           {orders.slice(0, 5).map(order => (
  //             <div key={order._id} className="card flex items-center gap-4 hover:shadow-md transition-all group">
  //               <div className="text-2xl">{getVehicleIcon(order.vehicleType)}</div>
  //               <div className="flex-1 min-w-0">
  //                 <div className="flex items-center gap-2 mb-1">
  //                   <StatusBadge status={order.status} />
  //                   <span className="text-xs text-gray-400 flex items-center gap-1">
  //                     <Clock className="w-3 h-3" />{formatDate(order.createdAt)}
  //                   </span>
  //                 </div>
  //                 <p className="text-sm text-gray-600 truncate">{order.pickup?.address} → {order.dropoff?.address}</p>
  //               </div>
  //               <div className="text-right">
  //                 <p className="font-semibold text-gray-900">{formatCurrency(order.fare?.total)}</p>
  //                 <p className="text-xs text-gray-400">{order.distance?.toFixed(1)} {t('km')}</p>
  //                 {['pending', 'accepted', 'picked'].includes(order.status) && (
  //                   <Link to={`/track/${order._id}`} className="text-primary-500 text-xs font-medium">Track →</Link>
  //                 )}
  //               </div>
  //             </div>
  //           ))}
  //         </div>
  //       )}
  //     </div>

  //     {/* Quick actions */}
  //     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
  //       <Link to="/book" className="card hover:shadow-md transition-all flex items-center gap-4 group border-dashed border-2 border-primary-200 hover:border-primary-400">
  //         <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center group-hover:bg-primary-200 transition-colors">
  //           <Plus className="w-6 h-6 text-primary-600" />
  //         </div>
  //         <div>
  //           <p className="font-semibold text-gray-900">{t('bookDelivery')}</p>
  //           <p className="text-sm text-gray-500">Bike, mini truck, or large truck</p>
  //         </div>
  //       </Link>
  //       <Link to="/orders" className="card hover:shadow-md transition-all flex items-center gap-4 group">
  //         <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center group-hover:bg-blue-100 transition-colors">
  //           <Package className="w-6 h-6 text-blue-600" />
  //         </div>
  //         <div>
  //           <p className="font-semibold text-gray-900">{t('orderHistory')}</p>
  //           <p className="text-sm text-gray-500">View all your deliveries</p>
  //         </div>
  //       </Link>
  //     </div>
  //   </div>
  // );

return (
  <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6 bg-gray-100 min-h-screen">

    {/* HEADER */}
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-black">
          Welcome back, {user?.name?.split(' ')[0]} 👋
        </h1>
        <p className="text-gray-500 text-sm">
          Here's what's happening with your deliveries
        </p>
      </div>

      <Link
        to="/book"
        className="bg-black text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-900 transition w-fit"
      >
        <Plus className="w-4 h-4" />
        {t('bookDelivery')}
      </Link>
    </div>

    {/* STATS */}
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div className="bg-white rounded-2xl p-5 shadow-sm">
        <p className="text-gray-500 text-sm">Total Orders</p>
        <p className="text-2xl font-bold text-black mt-1">{orders.length}</p>
      </div>

      <div className="bg-white rounded-2xl p-5 shadow-sm">
        <p className="text-gray-500 text-sm">Completed</p>
        <p className="text-2xl font-bold text-black mt-1">{completedOrders.length}</p>
      </div>

      <div className="bg-white rounded-2xl p-5 shadow-sm">
        <p className="text-gray-500 text-sm">Total Spent</p>
        <p className="text-2xl font-bold text-black mt-1">{formatCurrency(totalSpent)}</p>
      </div>
    </div>

    {/* ACTIVE ORDERS */}
    {activeOrders.length > 0 && (
      <div>
        <h2 className="text-lg font-semibold text-black mb-3 flex items-center gap-2">
          <span className="w-2 h-2 bg-black rounded-full animate-pulse" />
          Active Orders
        </h2>

        <div className="space-y-3">
          {activeOrders.map(order => (
            <div
              key={order._id}
              className="bg-white rounded-xl p-4 flex items-center gap-4 shadow-sm hover:shadow-md transition"
            >
              <div className="text-4xl">{getVehicleIcon(order.vehicleType)}</div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <StatusBadge status={order.status} />
                  <span className="text-xs text-gray-400">
                    {formatDate(order.createdAt)}
                  </span>
                </div>

                <p className="text-sm text-gray-600 truncate">
                  📍 {order.pickup?.address}
                </p>
                <p className="text-sm text-gray-600 truncate">
                  🏁 {order.dropoff?.address}
                </p>
              </div>

              <div className="text-right">
                <p className="font-semibold text-black">
                  {formatCurrency(order.fare?.total)}
                </p>

                <Link
                  to={`/track/${order._id}`}
                  className="text-xs text-black flex items-center gap-1 mt-1 hover:underline"
                >
                  Track <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    )}

    {/* RECENT ORDERS */}
    <div>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold text-black">
          {t('orderHistory')}
        </h2>

        <Link
          to="/orders"
          className="text-sm text-black hover:underline flex items-center gap-1"
        >
          View all <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      {orders.length === 0 ? (
        <EmptyState
          icon={Package}
          title="No orders yet"
          description="Book your first delivery and it will appear here."
          action={
            <Link
              to="/book"
              className="bg-black text-white px-4 py-2 rounded-lg text-sm"
            >
              Book Now
            </Link>
          }
        />
      ) : (
        <div className="space-y-3">
          {orders.slice(0, 5).map(order => (
            <div
              key={order._id}
              className="bg-white rounded-xl p-4 flex items-center gap-4 shadow-sm hover:shadow-md transition"
            >
              <div className="text-3xl">
                {getVehicleIcon(order.vehicleType)}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <StatusBadge status={order.status} />
                  <span className="text-xs text-gray-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {formatDate(order.createdAt)}
                  </span>
                </div>

                <p className="text-sm text-gray-600 truncate">
                  {order.pickup?.address} → {order.dropoff?.address}
                </p>
              </div>

              <div className="text-right">
                <p className="font-semibold text-black">
                  {formatCurrency(order.fare?.total)}
                </p>
                <p className="text-xs text-gray-400">
                  {order.distance?.toFixed(1)} {t('km')}
                </p>

                {['pending', 'accepted', 'picked'].includes(order.status) && (
                  <Link
                    to={`/track/${order._id}`}
                    className="text-xs text-black hover:underline"
                  >
                    Track →
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>

    {/* QUICK ACTIONS */}
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

      <Link
        to="/book"
        className="bg-white rounded-2xl p-5 shadow-sm flex items-center gap-4 hover:shadow-md transition border border-dashed border-gray-300"
      >
        <div className="w-12 h-12 bg-black text-white rounded-xl flex items-center justify-center">
          <Plus className="w-5 h-5" />
        </div>

        <div>
          <p className="font-semibold text-black">{t('bookDelivery')}</p>
          <p className="text-sm text-gray-500">
            Bike, mini truck, or large truck
          </p>
        </div>
      </Link>

      <Link
        to="/orders"
        className="bg-white rounded-2xl p-5 shadow-sm flex items-center gap-4 hover:shadow-md transition"
      >
        <div className="w-12 h-12 bg-gray-200 rounded-xl flex items-center justify-center">
          <Package className="w-5 h-5 text-black" />
        </div>

        <div>
          <p className="font-semibold text-black">{t('orderHistory')}</p>
          <p className="text-sm text-gray-500">
            View all your deliveries
          </p>
        </div>
      </Link>

    </div>

  </div>
);
}
