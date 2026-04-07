// NotificationPanel.jsx
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Bell, X, CheckCheck } from 'lucide-react';
import { markAllRead, clearNotifications } from '../../store/slices/uiSlice';
import { formatDate } from '../../utils/helpers';

export default function NotificationPanel({ onClose }) {
  const dispatch = useDispatch();
  const { notifications } = useSelector((s) => s.ui);

  const typeIcon = { order: '📦', status: '🔄', driver: '🚗', payment: '💳' };

  return (
    <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 overflow-hidden animate-slide-up">
      <div className="flex items-center justify-between p-4 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-primary-500" />
          <span className="font-semibold text-gray-900 text-sm">Notifications</span>
        </div>
        <div className="flex items-center gap-2">
          {notifications.length > 0 && (
            <button onClick={() => dispatch(markAllRead())} className="text-xs text-primary-500 hover:text-primary-700 flex items-center gap-1">
              <CheckCheck className="w-3.5 h-3.5" /> Mark all read
            </button>
          )}
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-gray-100">
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>
      </div>
      <div className="max-h-80 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="p-8 text-center text-gray-400 text-sm">
            <Bell className="w-8 h-8 mx-auto mb-2 opacity-30" />
            No notifications yet
          </div>
        ) : (
          notifications.map((n) => (
            <div key={n.id} className={`px-4 py-3 border-b border-gray-50 hover:bg-gray-50 transition-all ${!n.read ? 'bg-primary-50/50' : ''}`}>
              <div className="flex items-start gap-3">
                <span className="text-lg">{typeIcon[n.type] || '🔔'}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">{n.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5 truncate">{n.message}</p>
                  <p className="text-xs text-gray-400 mt-1">{formatDate(n.id)}</p>
                </div>
                {!n.read && <div className="w-2 h-2 rounded-full bg-primary-500 mt-1 flex-shrink-0" />}
              </div>
            </div>
          ))
        )}
      </div>
      {notifications.length > 0 && (
        <div className="p-3 border-t border-gray-100">
          <button onClick={() => { dispatch(clearNotifications()); onClose(); }} className="w-full text-xs text-gray-400 hover:text-gray-600 text-center">
            Clear all
          </button>
        </div>
      )}
    </div>
  );
}
