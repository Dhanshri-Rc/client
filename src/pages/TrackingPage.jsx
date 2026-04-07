import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Phone, MapPin, Navigation, Clock, Package, ArrowLeft, Star } from 'lucide-react';
import { fetchOrder, rateOrder } from '../store/slices/orderSlice';
import { getSocket } from '../services/socket';
import { StatusBadge, PageLoader, Spinner } from '../components/common/UI';
import { formatCurrency, formatDate, getVehicleIcon, getVehicleName } from '../utils/helpers';
import toast from 'react-hot-toast';

const STATUS_STEPS = ['pending', 'accepted', 'picked', 'delivered'];
const STATUS_LABELS = { pending: 'Order Placed', accepted: 'Driver Assigned', picked: 'Picked Up', delivered: 'Delivered' };
const STATUS_ICONS = { pending: '📋', accepted: '✅', picked: '🚚', delivered: '🎉' };

export default function TrackingPage() {
  const { t } = useTranslation();
  const { orderId } = useParams();
  const dispatch = useDispatch();
  const { currentOrder, loading } = useSelector((s) => s.orders);
  const { user } = useSelector((s) => s.auth);
  const mapRef = useRef(null);
  const googleMapRef = useRef(null);
  const driverMarkerRef = useRef(null);
  const [driverLocation, setDriverLocation] = useState(null);
  const [showRating, setShowRating] = useState(false);
  const [ratingScore, setRatingScore] = useState(5);
  const [ratingReview, setRatingReview] = useState('');
  const [submittingRating, setSubmittingRating] = useState(false);

  useEffect(() => {
    dispatch(fetchOrder(orderId));
  }, [orderId]);

  // Join socket room for real-time updates
  useEffect(() => {
    const socket = getSocket();
    socket.emit('join:order', { orderId, userId: user?._id });

    socket.on('driver:location', ({ lat, lng }) => {
      setDriverLocation({ lat, lng });
    });

    socket.on('order:status_changed', ({ status }) => {
      dispatch(fetchOrder(orderId));
      if (status === 'delivered') toast.success('🎉 Your order has been delivered!');
    });

    return () => {
      socket.off('driver:location');
      socket.off('order:status_changed');
    };
  }, [orderId, user]);

  // Initialize Google Map
  useEffect(() => {
    if (!mapRef.current || !window.google || !currentOrder) return;
    const center = {
      lat: currentOrder.pickup?.lat || 18.5204,
      lng: currentOrder.pickup?.lng || 73.8567,
    };
    googleMapRef.current = new window.google.maps.Map(mapRef.current, {
      zoom: 13, center,
      styles: [{ featureType: 'poi', elementType: 'labels', stylers: [{ visibility: 'off' }] }],
      disableDefaultUI: true, zoomControl: true,
    });

    // Pickup marker
    new window.google.maps.Marker({
      position: { lat: currentOrder.pickup?.lat, lng: currentOrder.pickup?.lng },
      map: googleMapRef.current,
      label: { text: '📍', fontSize: '20px' },
      title: 'Pickup',
    });

    // Drop marker
    new window.google.maps.Marker({
      position: { lat: currentOrder.dropoff?.lat, lng: currentOrder.dropoff?.lng },
      map: googleMapRef.current,
      label: { text: '🏁', fontSize: '20px' },
      title: 'Drop',
    });
  }, [currentOrder, mapRef.current]);

  // Update driver marker on map
  useEffect(() => {
    if (!googleMapRef.current || !driverLocation) return;
    if (driverMarkerRef.current) driverMarkerRef.current.setMap(null);
    driverMarkerRef.current = new window.google.maps.Marker({
      position: driverLocation,
      map: googleMapRef.current,
      label: { text: getVehicleIcon(currentOrder?.vehicleType), fontSize: '24px' },
      title: 'Driver',
    });
    googleMapRef.current.panTo(driverLocation);
  }, [driverLocation]);

  const handleRateOrder = async () => {
    setSubmittingRating(true);
    const result = await dispatch(rateOrder({ id: orderId, score: ratingScore, review: ratingReview }));
    if (rateOrder.fulfilled.match(result)) {
      toast.success('Thank you for your rating!');
      setShowRating(false);
    }
    setSubmittingRating(false);
  };

  if (loading && !currentOrder) return <PageLoader />;
  if (!currentOrder) return <div className="text-center py-20 text-gray-500">Order not found</div>;

  const currentStepIdx = STATUS_STEPS.indexOf(currentOrder.status);
  const driver = currentOrder.driver;
  const driverUser = driver?.user;

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <div className="flex items-center gap-3 mb-6">
        <Link to="/dashboard" className="p-2 rounded-xl hover:bg-gray-100 transition-all">
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t('trackOrder')}</h1>
          <p className="text-gray-500 text-sm">Order #{currentOrder._id?.slice(-8)?.toUpperCase()}</p>
        </div>
        <div className="ml-auto"><StatusBadge status={currentOrder.status} /></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Map */}
        <div className="card p-0 overflow-hidden h-80 lg:h-full min-h-64">
          {window.google ? (
            <div ref={mapRef} className="w-full h-full" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
              <div className="text-center text-gray-500">
                <MapPin className="w-12 h-12 mx-auto mb-2 text-blue-300" />
                <p className="text-sm font-medium">Map View</p>
                <p className="text-xs text-gray-400">Add Google Maps API key to enable</p>
                <div className="mt-4 text-left bg-white rounded-xl p-3 text-xs max-w-xs">
                  <p className="font-medium text-gray-700 mb-1">📍 Pickup</p>
                  <p className="text-gray-500 truncate">{currentOrder.pickup?.address}</p>
                  <p className="font-medium text-gray-700 mt-2 mb-1">🏁 Drop</p>
                  <p className="text-gray-500 truncate">{currentOrder.dropoff?.address}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Details panel */}
        <div className="space-y-4">
          {/* Status timeline */}
          <div className="card">
            <h3 className="font-semibold text-gray-900 mb-4">Delivery Progress</h3>
            <div className="space-y-3">
              {STATUS_STEPS.filter(s => s !== 'cancelled').map((s, idx) => {
                const done = currentStepIdx > idx;
                const active = currentStepIdx === idx;
                return (
                  <div key={s} className={`flex items-center gap-3 ${done || active ? '' : 'opacity-40'}`}>
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm flex-shrink-0 ${done ? 'bg-green-500 text-white' : active ? 'bg-primary-500 text-white animate-pulse' : 'bg-gray-100 text-gray-400'}`}>
                      {done ? '✓' : STATUS_ICONS[s]}
                    </div>
                    <div>
                      <p className={`text-sm font-medium ${active ? 'text-primary-700' : done ? 'text-green-700' : 'text-gray-400'}`}>{STATUS_LABELS[s]}</p>
                      {active && <p className="text-xs text-gray-400">In progress...</p>}
                    </div>
                    {active && <div className="ml-auto w-2 h-2 rounded-full bg-primary-500 animate-pulse-dot" />}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Driver info */}
          {driver && (
            <div className="card">
              <h3 className="font-semibold text-gray-900 mb-3">Your Driver</h3>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold">
                  {driverUser?.name?.charAt(0) || 'D'}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">{driverUser?.name || 'Driver'}</p>
                  <p className="text-sm text-gray-500">{getVehicleIcon(driver.vehicleType)} {driver.vehicleNumber || 'Vehicle'}</p>
                  <div className="flex items-center gap-1 text-yellow-500 text-xs mt-0.5">
                    {'★'.repeat(Math.round(driver.rating?.average || 5))} <span className="text-gray-400">({driver.rating?.count || 0})</span>
                  </div>
                </div>
                {driverUser?.phone && (
                  <a href={`tel:${driverUser.phone}`} className="p-2.5 bg-green-50 rounded-xl hover:bg-green-100 transition-all">
                    <Phone className="w-5 h-5 text-green-600" />
                  </a>
                )}
              </div>
            </div>
          )}

          {/* Order info */}
          <div className="card">
            <h3 className="font-semibold text-gray-900 mb-3">Order Details</h3>
            <div className="space-y-2 text-sm">
              <div className="flex gap-2">
                <Navigation className="w-4 h-4 text-primary-400 mt-0.5 flex-shrink-0" />
                <div><p className="text-xs text-gray-400">PICKUP</p><p className="text-gray-700">{currentOrder.pickup?.address}</p></div>
              </div>
              <div className="flex gap-2">
                <MapPin className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                <div><p className="text-xs text-gray-400">DROP</p><p className="text-gray-700">{currentOrder.dropoff?.address}</p></div>
              </div>
              <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-gray-500">
                  <span>{getVehicleIcon(currentOrder.vehicleType)}</span>
                  <span>{getVehicleName(currentOrder.vehicleType)}</span>
                </div>
                <span className="font-bold text-primary-600">{formatCurrency(currentOrder.fare?.total)}</span>
              </div>
              <div className="flex items-center gap-4 text-xs text-gray-400">
                <span><Clock className="inline w-3 h-3 mr-1" />{currentOrder.estimatedTime} mins</span>
                <span><MapPin className="inline w-3 h-3 mr-1" />{currentOrder.distance?.toFixed(1)} km</span>
                <span>Booked {formatDate(currentOrder.createdAt)}</span>
              </div>
            </div>
          </div>

          {/* Rate order */}
          {currentOrder.status === 'delivered' && user?.role === 'customer' && !currentOrder.rating?.score && (
            <div className="card bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200">
              {!showRating ? (
                <div className="flex items-center gap-3">
                  <Star className="w-6 h-6 text-yellow-500" />
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">How was your experience?</p>
                    <p className="text-xs text-gray-500">Rate your delivery</p>
                  </div>
                  <button onClick={() => setShowRating(true)} className="btn-primary text-sm py-2 px-4">Rate</button>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="font-semibold text-gray-900">Rate this delivery</p>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map(s => (
                      <button key={s} onClick={() => setRatingScore(s)}
                        className={`text-2xl transition-transform hover:scale-110 ${s <= ratingScore ? 'text-yellow-400' : 'text-gray-200'}`}>★</button>
                    ))}
                  </div>
                  <textarea
                    className="input-field resize-none text-sm" rows={2}
                    placeholder="Write a review (optional)..."
                    value={ratingReview}
                    onChange={e => setRatingReview(e.target.value)}
                  />
                  <div className="flex gap-2">
                    <button onClick={() => setShowRating(false)} className="btn-secondary flex-1 py-2 text-sm">Cancel</button>
                    <button onClick={handleRateOrder} disabled={submittingRating} className="btn-primary flex-1 py-2 text-sm">
                      {submittingRating ? <Spinner size="sm" color="white" /> : 'Submit'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Rated */}
          {currentOrder.rating?.score && (
            <div className="card bg-green-50 border-green-100">
              <p className="text-sm font-medium text-green-700">✅ You rated this delivery {currentOrder.rating.score}★</p>
              {currentOrder.rating.review && <p className="text-xs text-gray-600 mt-1">"{currentOrder.rating.review}"</p>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
