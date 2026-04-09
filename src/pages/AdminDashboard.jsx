import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Users, Truck, Package, TrendingUp, Activity, CheckCircle, Shield, BarChart2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, Legend } from 'recharts';
import api from '../services/api';
import { StatCard, PageLoader, StatusBadge, Spinner } from '../components/common/UI';
import { formatCurrency, formatDate, getVehicleIcon } from '../utils/helpers';
import toast from 'react-hot-toast';

const VEHICLE_COLORS = { bike: '#f97316', mini_truck: '#3b82f6', large_truck: '#8b5cf6' };

export default function AdminDashboard() {
  const { t } = useTranslation();
  const [analytics, setAnalytics] = useState(null);
  const [users, setUsers] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [togglingUser, setTogglingUser] = useState(null);
  const [verifyingDriver, setVerifyingDriver] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [analyticsRes, usersRes, driversRes, ordersRes] = await Promise.all([
        api.get('/admin/analytics'),
        api.get('/admin/users'),
        api.get('/admin/drivers'),
        api.get('/admin/orders'),
      ]);
      setAnalytics(analyticsRes.data.analytics);
      setUsers(usersRes.data.users);
      setDrivers(driversRes.data.drivers);
      setOrders(ordersRes.data.orders);
    } catch (err) {
      toast.error('Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  const toggleUser = async (userId) => {
    setTogglingUser(userId);
    try {
      const res = await api.put(`/admin/users/${userId}/toggle`);
      setUsers(prev => prev.map(u => u._id === userId ? { ...u, isActive: res.data.user.isActive } : u));
      toast.success(res.data.message);
    } catch (err) {
      toast.error('Failed to toggle user');
    } finally {
      setTogglingUser(null);
    }
  };

  const verifyDriver = async (driverId) => {
    setVerifyingDriver(driverId);
    try {
      await api.put(`/admin/drivers/${driverId}/verify`);
      setDrivers(prev => prev.map(d => d._id === driverId ? { ...d, isVerified: true } : d));
      toast.success('Driver verified!');
    } catch (err) {
      toast.error('Failed to verify driver');
    } finally {
      setVerifyingDriver(null);
    }
  };

  if (loading) return <PageLoader />;

  const vehicleData = analytics?.ordersByVehicle?.map(v => ({
    name: v._id === 'bike' ? 'Bike' : v._id === 'mini_truck' ? 'Mini Truck' : 'Large Truck',
    orders: v.count,
    revenue: v.revenue,
    fill: VEHICLE_COLORS[v._id] || '#888',
  })) || [];

 
 
  // return (
  //   <div className="max-w-7xl mx-auto space-y-6 animate-fade-in">
  //     <div className="flex items-center justify-between">
  //       <div>
  //         <h1 className="text-2xl font-bold text-gray-900">{t('adminDashboard')}</h1>
  //         <p className="text-gray-500 mt-1">Platform overview and management</p>
  //       </div>
  //       <button onClick={loadData} className="btn-secondary text-sm py-2 px-4">
  //         <Activity className="w-4 h-4" /> Refresh
  //       </button>
  //     </div>

  //     {/* Summary stats */}
  //     <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
  //       <StatCard title={t('totalUsers')} value={analytics?.summary?.totalUsers || 0} icon={Users} color="blue" />
  //       <StatCard title={t('totalDrivers')} value={analytics?.summary?.totalDrivers || 0} icon={Truck} color="purple" />
  //       <StatCard title={t('totalOrders')} value={analytics?.summary?.totalOrders || 0} icon={Package} color="primary" />
  //       <StatCard title="Active Now" value={analytics?.summary?.activeOrders || 0} icon={Activity} color="yellow" subtitle="Pending/In-transit" />
  //       <StatCard title="Online Drivers" value={analytics?.summary?.onlineDrivers || 0} icon={TrendingUp} color="green" />
  //     </div>

  //     {/* Today */}
  //     <div className="grid grid-cols-2 gap-4">
  //       <div className="card bg-gradient-to-br from-primary-500 to-orange-500 text-white">
  //         <p className="text-primary-100 text-sm font-medium">Today's Orders</p>
  //         <p className="text-4xl font-extrabold mt-1">{analytics?.today?.orders || 0}</p>
  //         <p className="text-primary-100 text-sm mt-1">New bookings today</p>
  //       </div>
  //       <div className="card bg-gradient-to-br from-green-500 to-emerald-500 text-white">
  //         <p className="text-green-100 text-sm font-medium">Today's Revenue</p>
  //         <p className="text-4xl font-extrabold mt-1">{formatCurrency(analytics?.today?.revenue || 0)}</p>
  //         <p className="text-green-100 text-sm mt-1">From completed orders</p>
  //       </div>
  //     </div>

  //     {/* Charts */}
  //     <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
  //       {/* 7 day orders */}
  //       <div className="card">
  //         <h3 className="font-semibold text-gray-900 mb-4">Orders – Last 7 Days</h3>
  //         <ResponsiveContainer width="100%" height={200}>
  //           <BarChart data={analytics?.last7Days || []}>
  //             <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
  //             <XAxis dataKey="date" tick={{ fontSize: 11 }} />
  //             <YAxis tick={{ fontSize: 11 }} />
  //             <Tooltip formatter={(v, name) => [v, name === 'revenue' ? formatCurrency(v) : v]} />
  //             <Bar dataKey="orders" fill="#f97316" radius={[4, 4, 0, 0]} name="Orders" />
  //             <Bar dataKey="delivered" fill="#22c55e" radius={[4, 4, 0, 0]} name="Delivered" />
  //           </BarChart>
  //         </ResponsiveContainer>
  //       </div>

  //       {/* Revenue 7 days */}
  //       <div className="card">
  //         <h3 className="font-semibold text-gray-900 mb-4">Revenue – Last 7 Days</h3>
  //         <ResponsiveContainer width="100%" height={200}>
  //           <LineChart data={analytics?.last7Days || []}>
  //             <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
  //             <XAxis dataKey="date" tick={{ fontSize: 11 }} />
  //             <YAxis tick={{ fontSize: 11 }} tickFormatter={v => `₹${v}`} />
  //             <Tooltip formatter={(v) => [formatCurrency(v), 'Revenue']} />
  //             <Line type="monotone" dataKey="revenue" stroke="#f97316" strokeWidth={2} dot={{ fill: '#f97316', r: 3 }} />
  //           </LineChart>
  //         </ResponsiveContainer>
  //       </div>

  //       {/* Orders by vehicle */}
  //       {vehicleData.length > 0 && (
  //         <div className="card">
  //           <h3 className="font-semibold text-gray-900 mb-4">Orders by Vehicle Type</h3>
  //           <ResponsiveContainer width="100%" height={200}>
  //             <PieChart>
  //               <Pie data={vehicleData} dataKey="orders" nameKey="name" cx="50%" cy="50%" outerRadius={70} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
  //                 {vehicleData.map((entry, idx) => <Cell key={idx} fill={entry.fill} />)}
  //               </Pie>
  //               <Tooltip />
  //             </PieChart>
  //           </ResponsiveContainer>
  //         </div>
  //       )}

  //       {/* Vehicle revenue */}
  //       {vehicleData.length > 0 && (
  //         <div className="card">
  //           <h3 className="font-semibold text-gray-900 mb-4">Revenue by Vehicle</h3>
  //           <ResponsiveContainer width="100%" height={200}>
  //             <BarChart data={vehicleData} layout="vertical">
  //               <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
  //               <XAxis type="number" tick={{ fontSize: 11 }} tickFormatter={v => `₹${v}`} />
  //               <YAxis dataKey="name" type="category" tick={{ fontSize: 11 }} width={70} />
  //               <Tooltip formatter={v => formatCurrency(v)} />
  //               <Bar dataKey="revenue" radius={[0, 4, 4, 0]}>
  //                 {vehicleData.map((entry, idx) => <Cell key={idx} fill={entry.fill} />)}
  //               </Bar>
  //             </BarChart>
  //           </ResponsiveContainer>
  //         </div>
  //       )}
  //     </div>

  //     {/* Tabs: Users / Drivers / Orders */}
  //     <div>
  //       <div className="flex gap-1 bg-gray-100 rounded-xl p-1 mb-4 w-fit">
  //         {[{ key: 'users', label: `Users (${users.length})` }, { key: 'drivers', label: `Drivers (${drivers.length})` }, { key: 'orders', label: `Orders (${orders.length})` }]
  //           .map(tab => (
  //             <button key={tab.key} onClick={() => setActiveTab(tab.key)}
  //               className={`py-2 px-4 rounded-lg text-sm font-medium transition-all ${activeTab === tab.key ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}>
  //               {tab.label}
  //             </button>
  //           ))}
  //       </div>

  //       {/* Users table */}
  //       {activeTab === 'users' && (
  //         <div className="card overflow-hidden p-0">
  //           <div className="overflow-x-auto">
  //             <table className="w-full text-sm">
  //               <thead className="bg-gray-50 border-b border-gray-100">
  //                 <tr>{['Name', 'Email', 'Phone', 'Role', 'Joined', 'Status', 'Action'].map(h => <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">{h}</th>)}</tr>
  //               </thead>
  //               <tbody className="divide-y divide-gray-50">
  //                 {users.map(u => (
  //                   <tr key={u._id} className="hover:bg-gray-50">
  //                     <td className="px-4 py-3 font-medium text-gray-900">{u.name}</td>
  //                     <td className="px-4 py-3 text-gray-500">{u.email}</td>
  //                     <td className="px-4 py-3 text-gray-500">{u.phone}</td>
  //                     <td className="px-4 py-3"><span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${u.role === 'admin' ? 'bg-purple-100 text-purple-700' : u.role === 'driver' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}`}>{u.role}</span></td>
  //                     <td className="px-4 py-3 text-gray-400 text-xs">{formatDate(u.createdAt)}</td>
  //                     <td className="px-4 py-3"><span className={`px-2 py-1 rounded-full text-xs font-medium ${u.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>{u.isActive ? 'Active' : 'Inactive'}</span></td>
  //                     <td className="px-4 py-3">
  //                       <button
  //                         onClick={() => toggleUser(u._id)}
  //                         disabled={togglingUser === u._id || u.role === 'admin'}
  //                         className={`text-xs px-3 py-1 rounded-lg font-medium transition-all disabled:opacity-40 ${u.isActive ? 'bg-red-50 text-red-600 hover:bg-red-100' : 'bg-green-50 text-green-600 hover:bg-green-100'}`}
  //                       >
  //                         {togglingUser === u._id ? '...' : u.isActive ? 'Deactivate' : 'Activate'}
  //                       </button>
  //                     </td>
  //                   </tr>
  //                 ))}
  //               </tbody>
  //             </table>
  //           </div>
  //         </div>
  //       )}

  //       {/* Drivers table */}
  //       {activeTab === 'drivers' && (
  //         <div className="card overflow-hidden p-0">
  //           <div className="overflow-x-auto">
  //             <table className="w-full text-sm">
  //               <thead className="bg-gray-50 border-b border-gray-100">
  //                 <tr>{['Name', 'Vehicle', 'License', 'Rating', 'Deliveries', 'Status', 'Action'].map(h => <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">{h}</th>)}</tr>
  //               </thead>
  //               <tbody className="divide-y divide-gray-50">
  //                 {drivers.map(d => (
  //                   <tr key={d._id} className="hover:bg-gray-50">
  //                     <td className="px-4 py-3 font-medium text-gray-900">{d.user?.name}</td>
  //                     <td className="px-4 py-3">{getVehicleIcon(d.vehicleType)} {d.vehicleNumber || '-'}</td>
  //                     <td className="px-4 py-3 text-gray-500 font-mono text-xs">{d.licenseNumber}</td>
  //                     <td className="px-4 py-3 text-yellow-600 font-medium">★ {d.rating?.average || '—'}</td>
  //                     <td className="px-4 py-3 text-gray-700">{d.totalDeliveries}</td>
  //                     <td className="px-4 py-3">
  //                       <div className="flex gap-1.5">
  //                         <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${d.isOnline ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>{d.isOnline ? 'Online' : 'Offline'}</span>
  //                         <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${d.isVerified ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'}`}>{d.isVerified ? t('verified') : 'Pending'}</span>
  //                       </div>
  //                     </td>
  //                     <td className="px-4 py-3">
  //                       {!d.isVerified && (
  //                         <button
  //                           onClick={() => verifyDriver(d._id)}
  //                           disabled={verifyingDriver === d._id}
  //                           className="text-xs px-3 py-1 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg font-medium transition-all"
  //                         >
  //                           {verifyingDriver === d._id ? '...' : 'Verify'}
  //                         </button>
  //                       )}
  //                       {d.isVerified && <span className="text-green-500 text-xs flex items-center gap-1"><CheckCircle className="w-3.5 h-3.5" /> Verified</span>}
  //                     </td>
  //                   </tr>
  //                 ))}
  //               </tbody>
  //             </table>
  //           </div>
  //         </div>
  //       )}

  //       {/* Orders table */}
  //       {activeTab === 'orders' && (
  //         <div className="card overflow-hidden p-0">
  //           <div className="overflow-x-auto">
  //             <table className="w-full text-sm">
  //               <thead className="bg-gray-50 border-b border-gray-100">
  //                 <tr>{['Order ID', 'Customer', 'Vehicle', 'Route', 'Fare', 'Status', 'Date'].map(h => <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">{h}</th>)}</tr>
  //               </thead>
  //               <tbody className="divide-y divide-gray-50">
  //                 {orders.map(o => (
  //                   <tr key={o._id} className="hover:bg-gray-50">
  //                     <td className="px-4 py-3 font-mono text-xs text-gray-500">#{o._id?.slice(-8)?.toUpperCase()}</td>
  //                     <td className="px-4 py-3 font-medium text-gray-900">{o.customer?.name}</td>
  //                     <td className="px-4 py-3">{getVehicleIcon(o.vehicleType)}</td>
  //                     <td className="px-4 py-3 text-gray-500 text-xs max-w-[200px]">
  //                       <p className="truncate">{o.pickup?.address}</p>
  //                       <p className="truncate">→ {o.dropoff?.address}</p>
  //                     </td>
  //                     <td className="px-4 py-3 font-semibold text-primary-600">{formatCurrency(o.fare?.total)}</td>
  //                     <td className="px-4 py-3"><StatusBadge status={o.status} /></td>
  //                     <td className="px-4 py-3 text-gray-400 text-xs">{formatDate(o.createdAt)}</td>
  //                   </tr>
  //                 ))}
  //               </tbody>
  //             </table>
  //           </div>
  //         </div>
  //       )}
  //     </div>
  //   </div>
  // );

return (
  <div className="p-4 sm:p-6 lg:p-8 bg-gray-100 min-h-screen">

    {/* HEADER */}
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
          {t('adminDashboard')}
        </h1>
        <p className="text-gray-500 text-sm">
          Platform overview and management
        </p>
      </div>

      <button
        onClick={loadData}
        className="flex items-center justify-center gap-2 bg-black text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-900 transition"
      >
        <Activity className="w-4 h-4" />
        Refresh
      </button>
    </div>

    {/* STATS */}
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
      <StatCard title="Users" value={analytics?.summary?.totalUsers || 0} icon={Users} />
      <StatCard title="Drivers" value={analytics?.summary?.totalDrivers || 0} icon={Truck} />
      <StatCard title="Orders" value={analytics?.summary?.totalOrders || 0} icon={Package} />
      <StatCard title="Active" value={analytics?.summary?.activeOrders || 0} icon={Activity} />
      <StatCard title="Online" value={analytics?.summary?.onlineDrivers || 0} icon={TrendingUp} />
    </div>

    {/* TODAY CARDS */}
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
      <div className="bg-black text-white rounded-2xl p-5">
        <p className="text-sm text-gray-300">Today's Orders</p>
        <h2 className="text-3xl font-bold mt-1">
          {analytics?.today?.orders || 0}
        </h2>
      </div>

      <div className="bg-green-500 text-white rounded-2xl p-5">
        <p className="text-sm text-green-100">Today's Revenue</p>
        <h2 className="text-3xl font-bold mt-1">
          {formatCurrency(analytics?.today?.revenue || 0)}
        </h2>
      </div>
    </div>

    {/* CHARTS */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">

      {/* BAR */}
      <div className="bg-white rounded-2xl p-5 shadow-sm">
        <h3 className="font-semibold mb-4">Orders (7 Days)</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={analytics?.last7Days || []}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="orders" fill="#000" radius={[6, 6, 0, 0]} />
            <Bar dataKey="delivered" fill="#22c55e" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* LINE */}
      <div className="bg-white rounded-2xl p-5 shadow-sm">
        <h3 className="font-semibold mb-4">Revenue</h3>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={analytics?.last7Days || []}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="revenue" stroke="#000" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

    </div>

    {/* TABS */}
    <div className="mb-4 flex flex-wrap gap-2">
      {['users', 'drivers', 'orders'].map(tab => (
        <button
          key={tab}
          onClick={() => setActiveTab(tab)}
          className={`px-4 py-2 text-sm rounded-lg ${
            activeTab === tab
              ? 'bg-black text-white'
              : 'bg-white text-gray-600'
          }`}
        >
          {tab.toUpperCase()}
        </button>
      ))}
    </div>

    {/* TABLES */}
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">

      <div className="overflow-x-auto">

        {activeTab === 'users' && (
          <table className="w-full text-sm min-w-[600px]">
            <thead className="bg-gray-50">
              <tr>
                {['Name','Email','Status','Action'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs text-gray-500">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u._id} className="border-t">
                  <td className="px-4 py-3">{u.name}</td>
                  <td className="px-4 py-3">{u.email}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      u.isActive ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-500'
                    }`}>
                      {u.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => toggleUser(u._id)}
                      className="text-xs bg-black text-white px-3 py-1 rounded"
                    >
                      Toggle
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {activeTab === 'drivers' && (
          <table className="w-full text-sm min-w-[600px]">
            <thead className="bg-gray-50">
              <tr>
                {['Name','Vehicle','Status','Action'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs text-gray-500">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {drivers.map(d => (
                <tr key={d._id} className="border-t">
                  <td className="px-4 py-3">{d.user?.name}</td>
                  <td className="px-4 py-3">{d.vehicleNumber}</td>
                  <td className="px-4 py-3">
                    {d.isVerified ? 'Verified' : 'Pending'}
                  </td>
                  <td className="px-4 py-3">
                    {!d.isVerified && (
                      <button
                        onClick={() => verifyDriver(d._id)}
                        className="text-xs bg-blue-500 text-white px-3 py-1 rounded"
                      >
                        Verify
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {activeTab === 'orders' && (
          <table className="w-full text-sm min-w-[700px]">
            <thead className="bg-gray-50">
              <tr>
                {['Order','Customer','Fare','Status'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs text-gray-500">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {orders.map(o => (
                <tr key={o._id} className="border-t">
                  <td className="px-4 py-3">#{o._id.slice(-6)}</td>
                  <td className="px-4 py-3">{o.customer?.name}</td>
                  <td className="px-4 py-3">{formatCurrency(o.fare?.total)}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={o.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

      </div>
    </div>

  </div>
);
}




// import React, { useEffect, useState } from 'react';
// import { useTranslation } from 'react-i18next';
// import { Users, Truck, Package, TrendingUp, Activity, CheckCircle } from 'lucide-react';
// import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
// import api from '../services/api';
// import { StatCard, PageLoader, StatusBadge } from '../components/common/UI';
// import { formatCurrency, formatDate, getVehicleIcon } from '../utils/helpers';
// import toast from 'react-hot-toast';

// const VEHICLE_COLORS = { bike: '#999', mini_truck: '#ccc', large_truck: '#fff' };

// export default function AdminDashboard() {
//   const { t } = useTranslation();
//   const [analytics, setAnalytics] = useState(null);
//   const [users, setUsers] = useState([]);
//   const [drivers, setDrivers] = useState([]);
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [activeTab, setActiveTab] = useState('overview');
//   const [togglingUser, setTogglingUser] = useState(null);
//   const [verifyingDriver, setVerifyingDriver] = useState(null);

//   useEffect(() => {
//     loadData();
//   }, []);

//   const loadData = async () => {
//     setLoading(true);
//     try {
//       const [analyticsRes, usersRes, driversRes, ordersRes] = await Promise.all([
//         api.get('/admin/analytics'),
//         api.get('/admin/users'),
//         api.get('/admin/drivers'),
//         api.get('/admin/orders'),
//       ]);
//       setAnalytics(analyticsRes.data.analytics);
//       setUsers(usersRes.data.users);
//       setDrivers(driversRes.data.drivers);
//       setOrders(ordersRes.data.orders);
//     } catch (err) {
//       toast.error('Failed to load analytics');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const toggleUser = async (userId) => {
//     setTogglingUser(userId);
//     try {
//       const res = await api.put(`/admin/users/${userId}/toggle`);
//       setUsers(prev => prev.map(u => u._id === userId ? { ...u, isActive: res.data.user.isActive } : u));
//       toast.success(res.data.message);
//     } catch {
//       toast.error('Failed to toggle user');
//     } finally {
//       setTogglingUser(null);
//     }
//   };

//   const verifyDriver = async (driverId) => {
//     setVerifyingDriver(driverId);
//     try {
//       await api.put(`/admin/drivers/${driverId}/verify`);
//       setDrivers(prev => prev.map(d => d._id === driverId ? { ...d, isVerified: true } : d));
//       toast.success('Driver verified!');
//     } catch {
//       toast.error('Failed to verify driver');
//     } finally {
//       setVerifyingDriver(null);
//     }
//   };

//   if (loading) return <PageLoader />;

//   const vehicleData = analytics?.ordersByVehicle?.map(v => ({
//     name: v._id === 'bike' ? 'Bike' : v._id === 'mini_truck' ? 'Mini Truck' : 'Large Truck',
//     orders: v.count,
//     revenue: v.revenue,
//     fill: VEHICLE_COLORS[v._id] || '#777',
//   })) || [];

//   return (
//     <div className="max-w-7xl mx-auto space-y-6 bg-black text-white min-h-screen p-4">

//       {/* Header */}
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="text-2xl font-bold text-white">{t('adminDashboard')}</h1>
//           <p className="text-gray-400 mt-1">Platform overview and management</p>
//         </div>
//         <button onClick={loadData} className="border border-gray-700 hover:bg-gray-900 text-white text-sm py-2 px-4 rounded-lg">
//           <Activity className="w-4 h-4 inline mr-1" /> Refresh
//         </button>
//       </div>

//       {/* Stats */}
//       <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
//         <StatCard className="bg-gray-900 border border-gray-800 text-white" title={t('totalUsers')} value={analytics?.summary?.totalUsers || 0} icon={Users} />
//         <StatCard className="bg-gray-900 border border-gray-800 text-white" title={t('totalDrivers')} value={analytics?.summary?.totalDrivers || 0} icon={Truck} />
//         <StatCard className="bg-gray-900 border border-gray-800 text-white" title={t('totalOrders')} value={analytics?.summary?.totalOrders || 0} icon={Package} />
//         <StatCard className="bg-gray-900 border border-gray-800 text-white" title="Active Now" value={analytics?.summary?.activeOrders || 0} icon={Activity} />
//         <StatCard className="bg-gray-900 border border-gray-800 text-white" title="Online Drivers" value={analytics?.summary?.onlineDrivers || 0} icon={TrendingUp} />
//       </div>

//       {/* Today */}
//       <div className="grid grid-cols-2 gap-4">
//         <div className="bg-gray-900 border border-gray-800 p-5 rounded-xl">
//           <p className="text-gray-400 text-sm">Today's Orders</p>
//           <p className="text-4xl font-bold mt-1">{analytics?.today?.orders || 0}</p>
//         </div>
//         <div className="bg-gray-900 border border-gray-800 p-5 rounded-xl">
//           <p className="text-gray-400 text-sm">Today's Revenue</p>
//           <p className="text-4xl font-bold mt-1">{formatCurrency(analytics?.today?.revenue || 0)}</p>
//         </div>
//       </div>

//       {/* Charts */}
//       <div className="grid lg:grid-cols-2 gap-6">
//         <div className="bg-gray-900 border border-gray-800 p-4 rounded-xl">
//           <h3 className="text-white mb-4">Orders – Last 7 Days</h3>
//           <ResponsiveContainer width="100%" height={200}>
//             <BarChart data={analytics?.last7Days || []}>
//               <CartesianGrid stroke="#333" />
//               <XAxis dataKey="date" tick={{ fill: '#aaa' }} />
//               <YAxis tick={{ fill: '#aaa' }} />
//               <Tooltip />
//               <Bar dataKey="orders" fill="#aaa" />
//               <Bar dataKey="delivered" fill="#fff" />
//             </BarChart>
//           </ResponsiveContainer>
//         </div>

//         <div className="bg-gray-900 border border-gray-800 p-4 rounded-xl">
//           <h3 className="text-white mb-4">Revenue – Last 7 Days</h3>
//           <ResponsiveContainer width="100%" height={200}>
//             <LineChart data={analytics?.last7Days || []}>
//               <CartesianGrid stroke="#333" />
//               <XAxis dataKey="date" tick={{ fill: '#aaa' }} />
//               <YAxis tick={{ fill: '#aaa' }} />
//               <Tooltip />
//               <Line dataKey="revenue" stroke="#fff" />
//             </LineChart>
//           </ResponsiveContainer>
//         </div>
//       </div>

//       {/* Tabs */}
//       <div className="flex gap-1 bg-gray-900 border border-gray-800 rounded-xl p-1 w-fit">
//         {['users', 'drivers', 'orders'].map(tab => (
//           <button
//             key={tab}
//             onClick={() => setActiveTab(tab)}
//             className={`px-4 py-2 rounded-lg text-sm ${
//               activeTab === tab ? 'bg-white text-black' : 'text-gray-400 hover:text-white'
//             }`}
//           >
//             {tab}
//           </button>
//         ))}
//       </div>

//       {/* USERS */}
//       {activeTab === 'users' && (
//         <TableWrapper>
//           {users.map(u => (
//             <tr key={u._id} className="hover:bg-gray-800">
//               <td className="px-4 py-3 text-white">{u.name}</td>
//               <td className="px-4 py-3 text-gray-400">{u.email}</td>
//               <td className="px-4 py-3 text-gray-400">{u.phone}</td>
//               <td className="px-4 py-3 text-gray-400">{u.role}</td>
//               <td className="px-4 py-3 text-gray-500 text-xs">{formatDate(u.createdAt)}</td>
//               <td className="px-4 py-3">{u.isActive ? 'Active' : 'Inactive'}</td>
//               <td className="px-4 py-3">
//                 <button onClick={() => toggleUser(u._id)} className="text-xs px-3 py-1 bg-gray-800 hover:bg-gray-700 rounded">
//                   Toggle
//                 </button>
//               </td>
//             </tr>
//           ))}
//         </TableWrapper>
//       )}

//       {/* DRIVERS */}
//       {activeTab === 'drivers' && (
//         <TableWrapper>
//           {drivers.map(d => (
//             <tr key={d._id} className="hover:bg-gray-800">
//               <td className="px-4 py-3 text-white">{d.user?.name}</td>
//               <td className="px-4 py-3">{getVehicleIcon(d.vehicleType)}</td>
//               <td className="px-4 py-3 text-gray-400">{d.licenseNumber}</td>
//               <td className="px-4 py-3 text-gray-400">{d.totalDeliveries}</td>
//               <td className="px-4 py-3">
//                 {!d.isVerified && (
//                   <button onClick={() => verifyDriver(d._id)} className="text-xs px-3 py-1 bg-gray-800 hover:bg-gray-700 rounded">
//                     Verify
//                   </button>
//                 )}
//                 {d.isVerified && <span className="text-green-400 text-xs flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Verified</span>}
//               </td>
//             </tr>
//           ))}
//         </TableWrapper>
//       )}

//       {/* ORDERS */}
//       {activeTab === 'orders' && (
//         <TableWrapper>
//           {orders.map(o => (
//             <tr key={o._id} className="hover:bg-gray-800">
//               <td className="px-4 py-3 text-gray-400">#{o._id.slice(-6)}</td>
//               <td className="px-4 py-3 text-white">{o.customer?.name}</td>
//               <td className="px-4 py-3">{getVehicleIcon(o.vehicleType)}</td>
//               <td className="px-4 py-3 text-gray-400">{formatCurrency(o.fare?.total)}</td>
//               <td className="px-4 py-3"><StatusBadge status={o.status} /></td>
//               <td className="px-4 py-3 text-gray-500 text-xs">{formatDate(o.createdAt)}</td>
//             </tr>
//           ))}
//         </TableWrapper>
//       )}

//     </div>
//   );
// }

// function TableWrapper({ children }) {
//   return (
//     <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
//       <table className="w-full text-sm">
//         <tbody>{children}</tbody>
//       </table>
//     </div>
//   );
// }