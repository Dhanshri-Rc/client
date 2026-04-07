import { useState, useEffect } from 'react';

export const useGeolocation = () => {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation not supported');
      return;
    }
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const watchLocation = (callback) => {
    if (!navigator.geolocation) return null;
    return navigator.geolocation.watchPosition(
      (pos) => callback({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      (err) => console.error('Watch error:', err),
      { enableHighAccuracy: true, distanceFilter: 10 }
    );
  };

  const clearWatch = (watchId) => {
    if (watchId) navigator.geolocation.clearWatch(watchId);
  };

  return { location, error, loading, getCurrentLocation, watchLocation, clearWatch };
};
