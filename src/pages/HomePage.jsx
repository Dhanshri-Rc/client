import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Truck, Package, MapPin, Shield, Zap, Star, ArrowRight, CheckCircle } from 'lucide-react';

const FEATURES = [
  { icon: Zap, title: 'Instant Booking', desc: 'Book your delivery in under 60 seconds with real-time availability.', color: 'bg-yellow-50 text-yellow-600' },
  { icon: MapPin, title: 'Live Tracking', desc: 'Track your delivery in real-time on the map, every step of the way.', color: 'bg-blue-50 text-blue-600' },
  { icon: Shield, title: 'Safe & Secure', desc: 'Your goods are insured. Verified drivers with background checks.', color: 'bg-green-50 text-green-600' },
  { icon: Star, title: 'Top Rated', desc: 'Rated 4.8/5 by over 50,000 customers across India.', color: 'bg-purple-50 text-purple-600' },
];

const VEHICLES = [
  { type: 'bike', icon: '🏍️', name: 'Bike', desc: 'Documents, small packages up to 20 kg', price: 'From ₹30', capacity: '20 kg' },
  { type: 'mini_truck', icon: '🚐', name: 'Mini Truck', desc: 'Furniture, appliances up to 500 kg', price: 'From ₹80', capacity: '500 kg' },
  { type: 'large_truck', icon: '🚛', name: 'Large Truck', desc: 'Industrial cargo up to 2 tons', price: 'From ₹150', capacity: '2000 kg' },
];

export default function HomePage() {
  const { t } = useTranslation();
  const { user } = useSelector((s) => s.auth);

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="fixed top-0 inset-x-0 z-50 bg-white/80 backdrop-blur border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-primary-500 rounded-xl flex items-center justify-center">
              <Truck className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold">Swift<span className="text-primary-500">Move</span></span>
          </div>
          <div className="flex items-center gap-3">
            {user ? (
              <Link to={user.role === 'driver' ? '/driver' : user.role === 'admin' ? '/admin' : '/dashboard'}
                className="btn-primary text-sm py-2 px-4">
                {t('dashboard')} <ArrowRight className="w-4 h-4" />
              </Link>
            ) : (
              <>
                <Link to="/login" className="btn-secondary text-sm py-2 px-4">{t('login')}</Link>
                <Link to="/register" className="btn-primary text-sm py-2 px-4">{t('register')}</Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-24 pb-20 bg-gradient-to-br from-primary-50 via-orange-50 to-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-primary-100 text-primary-700 rounded-full px-4 py-1.5 text-sm font-medium mb-6">
            <span className="w-2 h-2 rounded-full bg-primary-500 animate-pulse-dot" />
            Real-time tracking available
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 mb-6 leading-tight">
            Move Anything,<br /><span className="text-primary-500">Anywhere.</span>
          </h1>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto mb-10">
            Book bikes, mini trucks, and large trucks for deliveries across the city. Transparent pricing, live tracking, and reliable drivers.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register" className="btn-primary text-base py-4 px-8 rounded-2xl shadow-lg shadow-primary-200">
              Start Delivering <ArrowRight className="w-5 h-5" />
            </Link>
            <Link to="/login" className="btn-secondary text-base py-4 px-8 rounded-2xl">
              Sign In
            </Link>
          </div>
          <div className="flex items-center justify-center gap-8 mt-12 text-sm text-gray-500">
            {['50K+ Deliveries', '10K+ Drivers', '4.8★ Rating'].map(s => (
              <div key={s} className="flex items-center gap-1.5"><CheckCircle className="w-4 h-4 text-primary-400" />{s}</div>
            ))}
          </div>
        </div>
      </section>

      {/* Vehicles */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">{t('selectVehicle')}</h2>
            <p className="text-gray-500">Choose the right vehicle for your delivery needs</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {VEHICLES.map((v) => (
              <div key={v.type} className="card hover:shadow-md hover:border-primary-200 transition-all duration-200 group cursor-pointer">
                <div className="text-5xl mb-4">{v.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">{v.name}</h3>
                <p className="text-gray-500 text-sm mb-4">{v.desc}</p>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-primary-600 font-bold">{v.price}</p>
                    <p className="text-xs text-gray-400">Capacity: {v.capacity}</p>
                  </div>
                  <Package className="w-8 h-8 text-gray-200 group-hover:text-primary-300 transition-colors" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Why SwiftMove?</h2>
            <p className="text-gray-500">Everything you need for reliable logistics</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map(({ icon: Icon, title, desc, color }) => (
              <div key={title} className="card text-center hover:shadow-md transition-all">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4 ${color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
                <p className="text-sm text-gray-500">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-primary-500">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to get started?</h2>
          <p className="text-primary-100 mb-8">Join thousands of customers and drivers on SwiftMove</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register" className="bg-white text-primary-600 font-semibold py-3 px-8 rounded-xl hover:bg-primary-50 transition-all">
              Create Account
            </Link>
            <Link to="/register?role=driver" className="bg-primary-600 text-white font-semibold py-3 px-8 rounded-xl hover:bg-primary-700 transition-all border border-primary-400">
              Become a Driver
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-8">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Truck className="w-5 h-5 text-primary-400" />
            <span className="text-white font-bold">SwiftMove</span>
          </div>
          <p className="text-sm">© 2024 SwiftMove. All rights reserved.</p>
          <div className="flex gap-4 text-sm">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
