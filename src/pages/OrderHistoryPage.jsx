// OrderHistoryPage.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Package, Filter, Clock, MapPin, ArrowRight } from 'lucide-react';
import { fetchMyOrders, cancelOrder } from '../store/slices/orderSlice';
import { StatusBadge, EmptyState, PageLoader } from '../components/common/UI';
import { formatCurrency, formatDate, getVehicleIcon } from '../utils/helpers';
import toast from 'react-hot-toast';

export default function OrderHistoryPage() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { orders, loading, total } = useSelector((s) => s.orders);
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    dispatch(fetchMyOrders({ status: statusFilter || undefined, page, limit: 10 }));
  }, [statusFilter, page, dispatch]);

  const handleCancel = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;
    const result = await dispatch(cancelOrder({ id: orderId, reason: 'Cancelled by customer' }));
    if (cancelOrder.fulfilled.match(result)) toast.success('Order cancelled');
  };

  const statuses = ['', 'pending', 'accepted', 'picked', 'delivered', 'cancelled'];

  if (loading && orders.length === 0) return <PageLoader />;

  // return (
  //   <div className="max-w-3xl mx-auto animate-fade-in">
  //     <div className="flex items-center justify-between mb-6">
  //       <div>
  //         <h1 className="text-2xl font-bold text-gray-900">{t('orderHistory')}</h1>
  //         <p className="text-gray-500 mt-1">{total} total orders</p>
  //       </div>
  //       <Link to="/book" className="btn-primary text-sm py-2 px-4">+ New Order</Link>
  //     </div>

  //     {/* Filters */}
  //     <div className="flex gap-2 overflow-x-auto pb-2 mb-5">
  //       {statuses.map(s => (
  //         <button key={s} onClick={() => { setStatusFilter(s); setPage(1); }}
  //           className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-all ${statusFilter === s ? 'bg-primary-500 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-primary-300'}`}>
  //           {s ? s.charAt(0).toUpperCase() + s.slice(1) : 'All'}
  //         </button>
  //       ))}
  //     </div>

  //     {orders.length === 0 ? (
  //       <EmptyState icon={Package} title="No orders found" description="Try changing your filter or book a new delivery." action={<Link to="/book" className="btn-primary text-sm">Book Delivery</Link>} />
  //     ) : (
  //       <div className="space-y-3">
  //         {orders.map(order => (
  //           <div key={order._id} className="card hover:shadow-md transition-all">
  //             <div className="flex items-start gap-4">
  //               <span className="text-3xl">{getVehicleIcon(order.vehicleType)}</span>
  //               <div className="flex-1 min-w-0">
  //                 <div className="flex items-center gap-2 flex-wrap mb-1">
  //                   <StatusBadge status={order.status} />
  //                   <span className="text-xs text-gray-400 font-mono">#{order._id?.slice(-8)?.toUpperCase()}</span>
  //                   <span className="text-xs text-gray-400 flex items-center gap-1"><Clock className="w-3 h-3" />{formatDate(order.createdAt)}</span>
  //                 </div>
  //                 <div className="space-y-1 text-sm">
  //                   <p className="text-gray-700 flex items-start gap-1.5">
  //                     <span className="text-green-500 mt-0.5">●</span>
  //                     <span className="truncate">{order.pickup?.address}</span>
  //                   </p>
  //                   <p className="text-gray-700 flex items-start gap-1.5">
  //                     <span className="text-red-400 mt-0.5">●</span>
  //                     <span className="truncate">{order.dropoff?.address}</span>
  //                   </p>
  //                 </div>
  //                 {order.rating?.score && (
  //                   <p className="text-xs text-yellow-500 mt-1">Your rating: {'★'.repeat(order.rating.score)}</p>
  //                 )}
  //               </div>
  //               <div className="text-right flex-shrink-0">
  //                 <p className="font-bold text-gray-900">{formatCurrency(order.fare?.total)}</p>
  //                 <p className="text-xs text-gray-400">{order.distance?.toFixed(1)} km</p>
  //                 <div className="flex flex-col gap-1 mt-2">
  //                   {['pending', 'accepted', 'picked'].includes(order.status) && (
  //                     <>
  //                       <Link to={`/track/${order._id}`} className="text-xs text-primary-500 font-medium flex items-center gap-0.5 hover:text-primary-700">
  //                         Track <ArrowRight className="w-3 h-3" />
  //                       </Link>
  //                       <button onClick={() => handleCancel(order._id)} className="text-xs text-red-400 hover:text-red-600 font-medium">
  //                         Cancel
  //                       </button>
  //                     </>
  //                   )}
  //                 </div>
  //               </div>
  //             </div>
  //           </div>
  //         ))}
  //       </div>
  //     )}

  //     {/* Pagination */}
  //     {total > 10 && (
  //       <div className="flex items-center justify-center gap-3 mt-6">
  //         <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="btn-secondary py-2 px-4 text-sm disabled:opacity-40">← Prev</button>
  //         <span className="text-sm text-gray-500">Page {page} of {Math.ceil(total / 10)}</span>
  //         <button disabled={page >= Math.ceil(total / 10)} onClick={() => setPage(p => p + 1)} className="btn-secondary py-2 px-4 text-sm disabled:opacity-40">Next →</button>
  //       </div>
  //     )}
  //   </div>
  // );

return (
  <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8 bg-gray-100 min-h-screen space-y-6">

    {/* HEADER */}
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-black">
          {t('orderHistory')}
        </h1>
        <p className="text-gray-500 text-sm">
          {total} total orders
        </p>
      </div>

      <Link
        to="/book"
        className="bg-black text-white px-4 py-2 rounded-lg text-sm text-center"
      >
        + New Order
      </Link>
    </div>

    {/* FILTERS */}
    <div className="flex gap-2 overflow-x-auto pb-2">
      {statuses.map(s => (
        <button
          key={s}
          onClick={() => {
            setStatusFilter(s);
            setPage(1);
          }}
          className={`flex-shrink-0 px-4 py-2 rounded-lg text-sm transition-all border
            ${
              statusFilter === s
                ? 'bg-black text-white border-black'
                : 'bg-white text-gray-600 border-gray-200 hover:border-black'
            }`}
        >
          {s ? s.charAt(0).toUpperCase() + s.slice(1) : 'All'}
        </button>
      ))}
    </div>

    {/* CONTENT */}
    {orders.length === 0 ? (
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <EmptyState
          icon={Package}
          title="No orders found"
          description="Try changing your filter or book a new delivery."
          action={
            <Link to="/book" className="bg-black text-white px-4 py-2 rounded-lg text-sm">
              Book Delivery
            </Link>
          }
        />
      </div>
    ) : (
      <div className="space-y-4">
        {orders.map(order => (
          <div
            key={order._id}
            className="bg-white rounded-2xl shadow-sm p-4 hover:shadow-md transition-all"
          >
            <div className="flex flex-col sm:flex-row sm:items-start gap-4">

              {/* ICON */}
              <div className="text-3xl">
                {getVehicleIcon(order.vehicleType)}
              </div>

              {/* MAIN INFO */}
              <div className="flex-1 min-w-0">

                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <StatusBadge status={order.status} />

                  <span className="text-xs text-gray-400 font-mono">
                    #{order._id?.slice(-8)?.toUpperCase()}
                  </span>

                  <span className="text-xs text-gray-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {formatDate(order.createdAt)}
                  </span>
                </div>

                {/* ADDRESSES */}
                <div className="space-y-1 text-sm">
                  <p className="text-gray-700 flex items-start gap-2">
                    <span className="mt-1 w-2 h-2 rounded-full bg-black"></span>
                    <span className="truncate">{order.pickup?.address}</span>
                  </p>

                  <p className="text-gray-700 flex items-start gap-2">
                    <span className="mt-1 w-2 h-2 rounded-full bg-gray-400"></span>
                    <span className="truncate">{order.dropoff?.address}</span>
                  </p>
                </div>

                {/* RATING */}
                {order.rating?.score && (
                  <p className="text-xs text-gray-600 mt-1">
                    Your rating: {'★'.repeat(order.rating.score)}
                  </p>
                )}
              </div>

              {/* RIGHT SIDE */}
              <div className="flex flex-col sm:items-end gap-2">

                <div className="text-right">
                  <p className="font-bold text-black">
                    {formatCurrency(order.fare?.total)}
                  </p>
                  <p className="text-xs text-gray-400">
                    {order.distance?.toFixed(1)} km
                  </p>
                </div>

                {/* ACTIONS */}
                {['pending', 'accepted', 'picked'].includes(order.status) && (
                  <div className="flex sm:flex-col gap-3 sm:gap-1 text-sm">

                    <Link
                      to={`/track/${order._id}`}
                      className="text-black font-medium flex items-center gap-1 hover:underline"
                    >
                      Track <ArrowRight className="w-3 h-3" />
                    </Link>

                    <button
                      onClick={() => handleCancel(order._id)}
                      className="text-gray-400 hover:text-black"
                    >
                      Cancel
                    </button>

                  </div>
                )}
              </div>

            </div>
          </div>
        ))}
      </div>
    )}

    {/* PAGINATION */}
    {total > 10 && (
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-6">

        <button
          disabled={page === 1}
          onClick={() => setPage(p => p - 1)}
          className="px-4 py-2 border border-gray-300 rounded-lg text-sm disabled:opacity-40"
        >
          ← Prev
        </button>

        <span className="text-sm text-gray-500">
          Page {page} of {Math.ceil(total / 10)}
        </span>

        <button
          disabled={page >= Math.ceil(total / 10)}
          onClick={() => setPage(p => p + 1)}
          className="px-4 py-2 border border-gray-300 rounded-lg text-sm disabled:opacity-40"
        >
          Next →
        </button>

      </div>
    )}
  </div>
);

}
