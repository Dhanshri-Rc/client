// hooks/useSocket.js
import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { connectSocket, getSocket } from '../services/socket';
import { addNotification } from '../store/slices/uiSlice';
import { addNewAvailableOrder, updateOrderInList } from '../store/slices/orderSlice';

export const useSocket = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((s) => s.auth);
  const socketRef = useRef(null);

  useEffect(() => {
    if (!user) return;

    const socket = connectSocket(user._id, user.role);
    socketRef.current = socket;

    // Order available (driver)
    socket.on('new:order_available', ({ order }) => {
      if (user.role === 'driver') {
        dispatch(addNewAvailableOrder(order));
        dispatch(addNotification({ type: 'order', title: 'New Order!', message: `Pickup: ${order.pickup?.address?.slice(0, 30)}…` }));
      }
    });

    // Order status changed (customer)
    socket.on('order:status_changed', ({ orderId, status }) => {
      dispatch(updateOrderInList({ _id: orderId, status }));
      dispatch(addNotification({ type: 'status', title: 'Order Update', message: `Your order status: ${status}` }));
    });

    // Driver assigned (customer)
    socket.on('order:driver_assigned', ({ message }) => {
      dispatch(addNotification({ type: 'driver', title: 'Driver Assigned', message }));
    });

    return () => {
      socket.off('new:order_available');
      socket.off('order:status_changed');
      socket.off('order:driver_assigned');
    };
  }, [user, dispatch]);

  return socketRef.current;
};
