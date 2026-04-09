import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { User, Phone, Mail, Lock, Save, Truck, Star, Package } from 'lucide-react';
import { updateProfile } from '../store/slices/authSlice';
import { Spinner, ErrorAlert, SuccessAlert } from '../components/common/UI';
import { formatCurrency } from '../utils/helpers';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { user, loading, error } = useSelector((s) => s.auth);
  const { profile: driverProfile, earnings } = useSelector((s) => s.driver);

  const [form, setForm] = useState({ name: user?.name || '', phone: user?.phone || '' });
  const [saved, setSaved] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    const result = await dispatch(updateProfile(form));
    if (updateProfile.fulfilled.match(result)) {
      toast.success('Profile updated!');
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
  };

  // return (
  //   <div className="max-w-2xl mx-auto animate-fade-in space-y-6">
  //     <div>
  //       <h1 className="text-2xl font-bold text-gray-900">{t('profile')}</h1>
  //       <p className="text-gray-500 mt-1">Manage your account information</p>
  //     </div>

  //     {/* Avatar card */}
  //     <div className="card flex items-center gap-5">
  //       <div className="w-20 h-20 rounded-2xl bg-primary-100 flex items-center justify-center text-primary-700 text-3xl font-bold flex-shrink-0">
  //         {user?.name?.charAt(0)?.toUpperCase()}
  //       </div>
  //       <div>
  //         <h2 className="text-xl font-bold text-gray-900">{user?.name}</h2>
  //         <p className="text-gray-500">{user?.email}</p>
  //         <span className={`inline-block mt-1 px-3 py-0.5 rounded-full text-xs font-semibold capitalize ${
  //           user?.role === 'admin' ? 'bg-purple-100 text-purple-700' :
  //           user?.role === 'driver' ? 'bg-blue-100 text-blue-700' :
  //           'bg-primary-100 text-primary-700'
  //         }`}>{user?.role}</span>
  //       </div>
  //     </div>

  //     {/* Driver stats */}
  //     {user?.role === 'driver' && driverProfile && (
  //       <div className="card">
  //         <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
  //           <Truck className="w-4 h-4 text-primary-500" /> Driver Stats
  //         </h3>
  //         <div className="grid grid-cols-3 gap-4">
  //           <div className="text-center p-3 bg-primary-50 rounded-xl">
  //             <p className="text-2xl font-bold text-primary-600">{formatCurrency(earnings?.total || 0)}</p>
  //             <p className="text-xs text-gray-500 mt-1">Total Earned</p>
  //           </div>
  //           <div className="text-center p-3 bg-green-50 rounded-xl">
  //             <p className="text-2xl font-bold text-green-600">{driverProfile.totalDeliveries || 0}</p>
  //             <p className="text-xs text-gray-500 mt-1">Deliveries</p>
  //           </div>
  //           <div className="text-center p-3 bg-yellow-50 rounded-xl">
  //             <p className="text-2xl font-bold text-yellow-600">{driverProfile.rating?.average || '—'}★</p>
  //             <p className="text-xs text-gray-500 mt-1">Rating</p>
  //           </div>
  //         </div>
  //         <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-2 gap-3 text-sm">
  //           <div className="flex items-center gap-2 text-gray-600">
  //             <span className="text-lg">{driverProfile.vehicleType === 'bike' ? '🏍️' : driverProfile.vehicleType === 'mini_truck' ? '🚐' : '🚛'}</span>
  //             <span>{driverProfile.vehicleNumber || 'Vehicle not set'}</span>
  //           </div>
  //           <div className="flex items-center gap-2 text-gray-600">
  //             <Lock className="w-4 h-4 text-gray-400" />
  //             <span>License: {driverProfile.licenseNumber}</span>
  //           </div>
  //         </div>
  //       </div>
  //     )}

  //     {/* Edit profile form */}
  //     <div className="card">
  //       <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
  //         <User className="w-4 h-4 text-primary-500" /> Personal Information
  //       </h3>
  //       {error && <ErrorAlert message={error} />}
  //       {saved && <SuccessAlert message="Profile updated successfully!" />}
  //       <form onSubmit={handleSave} className="space-y-4">
  //         <div>
  //           <label className="block text-sm font-medium text-gray-700 mb-1.5">{t('name')}</label>
  //           <div className="relative">
  //             <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
  //             <input
  //               type="text" className="input-field pl-10"
  //               value={form.name}
  //               onChange={e => setForm({ ...form, name: e.target.value })}
  //               placeholder="Your full name"
  //             />
  //           </div>
  //         </div>
  //         <div>
  //           <label className="block text-sm font-medium text-gray-700 mb-1.5">{t('email')}</label>
  //           <div className="relative">
  //             <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
  //             <input type="email" className="input-field pl-10 bg-gray-50 cursor-not-allowed" value={user?.email} disabled />
  //           </div>
  //           <p className="text-xs text-gray-400 mt-1">Email cannot be changed</p>
  //         </div>
  //         <div>
  //           <label className="block text-sm font-medium text-gray-700 mb-1.5">{t('phone')}</label>
  //           <div className="relative">
  //             <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
  //             <input
  //               type="tel" className="input-field pl-10"
  //               value={form.phone}
  //               onChange={e => setForm({ ...form, phone: e.target.value })}
  //               placeholder="10-digit phone number"
  //               maxLength={10}
  //             />
  //           </div>
  //         </div>
  //         <button type="submit" disabled={loading} className="btn-primary w-full py-3">
  //           {loading ? <Spinner size="sm" color="white" /> : <><Save className="w-4 h-4" /> {t('save')} Changes</>}
  //         </button>
  //       </form>
  //     </div>

  //     {/* Account info */}
  //     <div className="card">
  //       <h3 className="font-semibold text-gray-900 mb-4">Account Details</h3>
  //       <div className="space-y-3 text-sm">
  //         <div className="flex justify-between py-2 border-b border-gray-50">
  //           <span className="text-gray-500">Account Type</span>
  //           <span className="font-medium capitalize text-gray-900">{user?.role}</span>
  //         </div>
  //         <div className="flex justify-between py-2 border-b border-gray-50">
  //           <span className="text-gray-500">Member Since</span>
  //           <span className="font-medium text-gray-900">{user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' }) : 'N/A'}</span>
  //         </div>
  //         <div className="flex justify-between py-2">
  //           <span className="text-gray-500">Account Status</span>
  //           <span className="font-medium text-green-600">Active ✓</span>
  //         </div>
  //       </div>
  //     </div>
  //   </div>
  // );

return (
  <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6 bg-gray-100 min-h-screen">

    {/* HEADER */}
    <div>
      <h1 className="text-xl sm:text-2xl font-bold text-black">
        {t('profile')}
      </h1>
      <p className="text-gray-500 text-sm">
        Manage your account information
      </p>
    </div>

    {/* PROFILE CARD */}
    <div className="bg-white rounded-2xl shadow-sm p-5 flex flex-col sm:flex-row items-center gap-5">
      
      <div className="w-20 h-20 rounded-2xl bg-black text-white flex items-center justify-center text-3xl font-bold">
        {user?.name?.charAt(0)?.toUpperCase()}
      </div>

      <div className="text-center sm:text-left">
        <h2 className="text-lg font-semibold text-black">{user?.name}</h2>
        <p className="text-gray-500 text-sm">{user?.email}</p>

        <span className="inline-block mt-2 px-3 py-1 rounded-full text-xs bg-gray-100 text-black capitalize">
          {user?.role}
        </span>
      </div>
    </div>

    {/* DRIVER STATS */}
    {user?.role === 'driver' && driverProfile && (
      <div className="bg-white rounded-2xl shadow-sm p-5">
        
        <h3 className="font-semibold text-black mb-4 flex items-center gap-2">
          <Truck className="w-4 h-4" /> Driver Stats
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          
          <div className="bg-gray-50 rounded-xl p-4 text-center">
            <p className="text-xl font-bold text-black">
              {formatCurrency(earnings?.total || 0)}
            </p>
            <p className="text-xs text-gray-500">Total Earned</p>
          </div>

          <div className="bg-gray-50 rounded-xl p-4 text-center">
            <p className="text-xl font-bold text-black">
              {driverProfile.totalDeliveries || 0}
            </p>
            <p className="text-xs text-gray-500">Deliveries</p>
          </div>

          <div className="bg-gray-50 rounded-xl p-4 text-center">
            <p className="text-xl font-bold text-black">
              {driverProfile.rating?.average || '—'}★
            </p>
            <p className="text-xs text-gray-500">Rating</p>
          </div>

        </div>

        <div className="mt-4 pt-4 border-t grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
          
          <div className="flex items-center gap-2 text-gray-600">
            <span className="text-lg">
              {driverProfile.vehicleType === 'bike' ? '🏍️' :
               driverProfile.vehicleType === 'mini_truck' ? '🚐' : '🚛'}
            </span>
            <span>{driverProfile.vehicleNumber || 'Vehicle not set'}</span>
          </div>

          <div className="flex items-center gap-2 text-gray-600">
            <Lock className="w-4 h-4" />
            <span>License: {driverProfile.licenseNumber}</span>
          </div>

        </div>
      </div>
    )}

    {/* FORM */}
    <div className="bg-white rounded-2xl shadow-sm p-5">
      
      <h3 className="font-semibold text-black mb-4 flex items-center gap-2">
        <User className="w-4 h-4" /> Personal Information
      </h3>

      {error && <ErrorAlert message={error} />}
      {saved && <SuccessAlert message="Profile updated successfully!" />}

      <form onSubmit={handleSave} className="space-y-4">

        {/* NAME */}
        <div>
          <label className="text-sm text-gray-600">{t('name')}</label>
          <div className="relative mt-1">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              className="w-full border border-gray-200 rounded-lg px-10 py-2 text-sm focus:outline-none focus:border-black"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
            />
          </div>
        </div>

        {/* EMAIL */}
        <div>
          <label className="text-sm text-gray-600">{t('email')}</label>
          <div className="relative mt-1">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="email"
              className="w-full border border-gray-200 rounded-lg px-10 py-2 text-sm bg-gray-100"
              value={user?.email}
              disabled
            />
          </div>
        </div>

        {/* PHONE */}
        <div>
          <label className="text-sm text-gray-600">{t('phone')}</label>
          <div className="relative mt-1">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="tel"
              className="w-full border border-gray-200 rounded-lg px-10 py-2 text-sm focus:outline-none focus:border-black"
              value={form.phone}
              onChange={e => setForm({ ...form, phone: e.target.value })}
            />
          </div>
        </div>

        {/* BUTTON */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-black text-white py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-900 transition"
        >
          {loading ? (
            <Spinner size="sm" color="white" />
          ) : (
            <>
              <Save className="w-4 h-4" /> {t('save')} Changes
            </>
          )}
        </button>

      </form>
    </div>

    {/* ACCOUNT INFO */}
    <div className="bg-white rounded-2xl shadow-sm p-5">
      
      <h3 className="font-semibold text-black mb-4">
        Account Details
      </h3>

      <div className="space-y-3 text-sm">
        
        <div className="flex justify-between border-b pb-2">
          <span className="text-gray-500">Account Type</span>
          <span className="text-black font-medium capitalize">{user?.role}</span>
        </div>

        <div className="flex justify-between border-b pb-2">
          <span className="text-gray-500">Member Since</span>
          <span className="text-black font-medium">
            {user?.createdAt
              ? new Date(user.createdAt).toLocaleDateString('en-IN', {
                  month: 'long',
                  year: 'numeric',
                })
              : 'N/A'}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-500">Status</span>
          <span className="text-black font-medium">Active ✓</span>
        </div>

      </div>
    </div>

  </div>
);
}
