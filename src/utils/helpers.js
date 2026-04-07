// Format currency in INR
export const formatCurrency = (amount) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);

// Format date
export const formatDate = (date) =>
  new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });

export const formatDateShort = (date) =>
  new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

// Status color mapping
export const getStatusColor = (status) => {
  const map = {
    pending: 'bg-yellow-100 text-yellow-700',
    accepted: 'bg-blue-100 text-blue-700',
    picked: 'bg-purple-100 text-purple-700',
    delivered: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700',
  };
  return map[status] || 'bg-gray-100 text-gray-700';
};

// Status dot color
export const getStatusDotColor = (status) => {
  const map = {
    pending: 'bg-yellow-400',
    accepted: 'bg-blue-400',
    picked: 'bg-purple-400',
    delivered: 'bg-green-400',
    cancelled: 'bg-red-400',
  };
  return map[status] || 'bg-gray-400';
};

// Vehicle icon
export const getVehicleIcon = (type) => {
  const map = { bike: '🏍️', mini_truck: '🚐', large_truck: '🚛' };
  return map[type] || '🚗';
};

// Vehicle display name
export const getVehicleName = (type) => {
  const map = { bike: 'Bike', mini_truck: 'Mini Truck', large_truck: 'Large Truck' };
  return map[type] || type;
};

// Haversine distance calc (client-side)
export const calculateDistance = (lat1, lng1, lat2, lng2) => {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

// Truncate text
export const truncate = (str, n = 40) => str?.length > n ? str.substr(0, n - 1) + '…' : str;

// Star rating render helper
export const renderStars = (rating) => '★'.repeat(Math.round(rating)) + '☆'.repeat(5 - Math.round(rating));
