import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

let socket = null;

export const getSocket = () => {
  if (!socket) {
    socket = io(SOCKET_URL, {
      autoConnect: false,
      transports: ['websocket', 'polling'],
    });
  }
  return socket;
};

export const connectSocket = (userId, role) => {
  const s = getSocket();
  if (!s.connected) s.connect();
  s.emit('join', { userId, role });
  return s;
};

export const disconnectSocket = () => {
  if (socket?.connected) socket.disconnect();
};

export const joinOrderRoom = (orderId, userId) => {
  const s = getSocket();
  s.emit('join:order', { orderId, userId });
};

export const emitDriverLocation = (driverId, orderId, lat, lng) => {
  const s = getSocket();
  s.emit('driver:location_update', { driverId, orderId, lat, lng });
};

export const emitDriverStatus = (driverId, isOnline) => {
  const s = getSocket();
  s.emit('driver:status_change', { driverId, isOnline });
};

export default { getSocket, connectSocket, disconnectSocket, joinOrderRoom, emitDriverLocation, emitDriverStatus };
