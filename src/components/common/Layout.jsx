import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import {
  Home, Package, MapPin, User, LogOut, Menu, X,
  Bell, Truck, BarChart2, ChevronDown, Globe
} from 'lucide-react';
import { logout } from '../../store/slices/authSlice';
import { setLanguage } from '../../store/slices/uiSlice';
import i18n from '../../i18n/i18n';
import NotificationPanel from './NotificationPanel';

const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'hi', label: 'हिन्दी' },
  { code: 'mr', label: 'मराठी' },
  { code: 'ur', label: 'اردو' },
];

export default function Layout({ children }) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((s) => s.auth);
  const { notifications, language } = useSelector((s) => s.ui);
  const unread = notifications.filter(n => !n.read).length;

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  const changeLanguage = (code) => {
    i18n.changeLanguage(code);
    dispatch(setLanguage(code));
    setShowLangMenu(false);
  };

  const customerLinks = [
    { to: '/dashboard', label: t('dashboard'), icon: Home },
    { to: '/book', label: t('bookDelivery'), icon: Package },
    { to: '/orders', label: t('myOrders'), icon: MapPin },
    { to: '/profile', label: t('profile'), icon: User },
  ];

  const driverLinks = [
    { to: '/driver', label: t('driverDashboard'), icon: Truck },
    { to: '/profile', label: t('profile'), icon: User },
  ];

  const adminLinks = [
    { to: '/admin', label: t('adminDashboard'), icon: BarChart2 },
    { to: '/profile', label: t('profile'), icon: User },
  ];

  const links = user?.role === 'driver' ? driverLinks : user?.role === 'admin' ? adminLinks : customerLinks;
  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-100 shadow-lg transform transition-transform duration-300 lg:translate-x-0 lg:static lg:shadow-none ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between p-5 border-b border-gray-100">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-9 h-9 bg-primary-500 rounded-xl flex items-center justify-center">
                <Truck className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">Swift<span className="text-primary-500">Move</span></span>
            </Link>
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-1 rounded-lg hover:bg-gray-100">
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* User info */}
          <div className="p-4 border-b border-gray-100">
            <div className="flex items-center gap-3 bg-primary-50 rounded-xl p-3">
              <div className="w-10 h-10 rounded-full bg-primary-200 flex items-center justify-center text-primary-700 font-bold text-sm">
                {user?.name?.charAt(0)?.toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 text-sm truncate">{user?.name}</p>
                <p className="text-xs text-primary-600 capitalize">{user?.role}</p>
              </div>
            </div>
          </div>

          {/* Nav links */}
          <nav className="flex-1 p-4 space-y-1">
            {links.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-150 ${
                  isActive(to)
                    ? 'bg-primary-500 text-white shadow-sm shadow-primary-200'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </Link>
            ))}
          </nav>

          {/* Bottom */}
          <div className="p-4 border-t border-gray-100 space-y-2">
            {/* Language switcher */}
            <div className="relative">
              <button
                onClick={() => setShowLangMenu(!showLangMenu)}
                className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-sm text-gray-600 hover:bg-gray-100 transition-all"
              >
                <span className="flex items-center gap-2"><Globe className="w-4 h-4" />{LANGUAGES.find(l => l.code === language)?.label || 'English'}</span>
                <ChevronDown className="w-4 h-4" />
              </button>
              {showLangMenu && (
                <div className="absolute bottom-full left-0 right-0 mb-1 bg-white border border-gray-100 rounded-xl shadow-lg overflow-hidden z-10">
                  {LANGUAGES.map(lang => (
                    <button
                      key={lang.code}
                      onClick={() => changeLanguage(lang.code)}
                      className={`w-full text-left px-4 py-2.5 text-sm hover:bg-primary-50 hover:text-primary-600 transition-all ${language === lang.code ? 'text-primary-600 font-semibold bg-primary-50' : 'text-gray-700'}`}
                    >
                      {lang.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-red-500 hover:bg-red-50 font-medium transition-all"
            >
              <LogOut className="w-4 h-4" />{t('logout')}
            </button>
          </div>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && <div className="fixed inset-0 bg-black/30 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between sticky top-0 z-30">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-xl hover:bg-gray-100">
            <Menu className="w-5 h-5 text-gray-600" />
          </button>
          <div className="hidden lg:block" />

          <div className="flex items-center gap-2">
            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 rounded-xl hover:bg-gray-100 transition-all"
              >
                <Bell className="w-5 h-5 text-gray-600" />
                {unread > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-primary-500 rounded-full text-white text-xs flex items-center justify-center font-bold">
                    {unread > 9 ? '9+' : unread}
                  </span>
                )}
              </button>
              {showNotifications && (
                <NotificationPanel onClose={() => setShowNotifications(false)} />
              )}
            </div>

            {/* User avatar */}
            <Link to="/profile" className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-gray-100 transition-all">
              <div className="w-7 h-7 rounded-full bg-primary-200 flex items-center justify-center text-primary-700 font-bold text-xs">
                {user?.name?.charAt(0)?.toUpperCase()}
              </div>
              <span className="text-sm font-medium text-gray-700 hidden sm:block">{user?.name?.split(' ')[0]}</span>
            </Link>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 md:p-6 animate-fade-in">
          {children}
        </main>
      </div>
    </div>
  );
}
