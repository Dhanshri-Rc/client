import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import {
  Truck, Package, MapPin, Shield, Zap, Star, ArrowRight,
  CheckCircle, ChevronDown, Globe, Menu, X
} from 'lucide-react';
import i18n from '../i18n/i18n';
import { useDispatch } from 'react-redux';
import { setLanguage } from '../store/slices/uiSlice';

const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'hi', label: 'हिन्दी' },
  { code: 'kn', label: 'ಕನ್ನಡ' },
  { code: 'mr', label: 'मराठी' },
];

const FEATURES = [
  {
    icon: Zap,
    title: 'Instant Booking',
    desc: 'Book your delivery in under 60 seconds with real-time availability.',
  },
  {
    icon: MapPin,
    title: 'Live Tracking',
    desc: 'Track your delivery in real-time on the map, every step of the way.',
  },
  {
    icon: Shield,
    title: 'Safe & Secure',
    desc: 'Your goods are insured. Verified drivers with background checks.',
  },
  {
    icon: Star,
    title: 'Top Rated',
    desc: 'Rated 4.8/5 by over 50,000 customers across India.',
  },
];

const VEHICLES = [
  {
    type: 'bike',
    icon: '🏍️',
    name: 'Bike',
    desc: 'Fast and affordable delivery for documents, parcels, and small packages within the city',
    capacity: 'Up to 20 kg',
    price: 'From ₹30',
    eta: '~15 min',
  },
  {
    type: 'mini_truck',
    icon: '🚐',
    name: 'Mini Truck',
    desc: 'Perfect for shifting furniture, home appliances, and medium-sized goods safely and efficiently',
    capacity: 'Up to 500 kg',
    price: 'From ₹80',
    eta: '~25 min',
  },
  {
    type: 'large_truck',
    icon: '🚛',
    name: 'Large Truck',
    desc: 'Best suited for heavy loads, bulk transport, and industrial goods over longer distances',
    capacity: 'Up to 2000 kg',
    price: 'From ₹150',
    eta: '~40 min',
  },
];

const STEPS = [
  { num: '01', title: 'Enter Locations', desc: 'Set your pickup and drop address with precise locations.' },
  { num: '02', title: 'Choose Vehicle', desc: 'Pick the right vehicle based on size and budget.' },
  { num: '03', title: 'Track Live', desc: 'Watch your delivery move in real-time on the map.' },
];
const FAQS = [
  {
    question: "How do I book a delivery?",
    answer: "Enter your pickup and drop location, choose a vehicle, and confirm your booking instantly.",
  },
  {
    question: "Can I track my delivery in real time?",
    answer: "Yes, you can track your delivery live on the map from pickup to drop-off.",
  },
  {
    question: "What types of vehicles are available?",
    answer: "We offer bikes, mini trucks, and large trucks depending on your delivery needs.",
  },
  {
    question: "How is the price calculated?",
    answer: "Pricing is based on distance, vehicle type, and demand at the time of booking.",
  },
  {
    question: "Can I schedule a delivery in advance?",
    answer: "Yes, you can use the 'Plan for later' option to schedule your delivery.",
  },
];
export default function HomePage() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { user } = useSelector((s) => s.auth);
  const { language } = useSelector((s) => s.ui);

  const [scrolled, setScrolled] = useState(false);
  const [showLang, setShowLang] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [pickup, setPickup] = useState('');
  const [drop, setDrop] = useState('');
  const langRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (langRef.current && !langRef.current.contains(e.target)) setShowLang(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);
const [activeIndex, setActiveIndex] = useState(null);

const toggleFAQ = (index) => {
  setActiveIndex(activeIndex === index ? null : index);
};
  const changeLanguage = (code) => {
    i18n.changeLanguage(code);
    dispatch(setLanguage(code));
    setShowLang(false);
  };

  return (
    <div className="min-h-screen bg-white font-sans">
      {/* ── NAVBAR ── */}
      <nav
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
          scrolled ? 'bg-white shadow-[0_1px_0_rgba(0,0,0,0.08)]' : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-5 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform">
              <Truck className="w-4 h-4 text-white" />
            </div>
            <span className={`text-lg font-bold tracking-tight transition-colors ${scrolled ? 'text-gray-900' : 'text-white'}`}>
              Swift<span className={scrolled ? 'text-gray-500' : 'text-gray-300'}>Move</span>
            </span>
          </Link>

          {/* Desktop Right */}
          <div className="hidden md:flex items-center gap-3">
            {/* Language Selector */}
            <div className="relative" ref={langRef}>
              <button
                onClick={() => setShowLang(!showLang)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  scrolled
                    ? 'text-gray-700 hover:bg-gray-100'
                    : 'text-white/90 hover:bg-white/10'
                }`}
              >
                <Globe className="w-4 h-4" />
                {LANGUAGES.find(l => l.code === language)?.label || 'English'}
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showLang ? 'rotate-180' : ''}`} />
              </button>
              {showLang && (
                <div className="absolute top-full right-0 mt-1.5 w-40 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden animate-slide-down">
                  {LANGUAGES.map(lang => (
                    <button
                      key={lang.code}
                      onClick={() => changeLanguage(lang.code)}
                      className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                        language === lang.code
                          ? 'bg-gray-900 text-white font-semibold'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {lang.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {user ? (
              <Link
                to={user.role === 'driver' ? '/driver' : user.role === 'admin' ? '/admin' : '/dashboard'}
                className="btn-primary text-sm py-2 px-5"
              >
                {t('dashboard')} <ArrowRight className="w-4 h-4" />
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className={`text-sm font-semibold px-4 py-2 rounded-lg transition-all ${
                    scrolled ? 'text-gray-700 hover:bg-gray-100' : 'text-white hover:bg-white/10'
                  }`}
                >
                  {t('login')}
                </Link>
                <Link
                  to="/register"
                  className={`text-sm font-semibold px-4 py-2 rounded-lg transition-all ${
                    scrolled
                      ? 'bg-black text-white hover:bg-gray-800'
                      : 'bg-white text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  {t('register')}
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu toggle */}
          <button
            className={`md:hidden p-2 rounded-lg transition-colors ${scrolled ? 'text-gray-900' : 'text-white'}`}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 px-5 py-4 space-y-3 animate-slide-down">
            {LANGUAGES.map(lang => (
              <button
                key={lang.code}
                onClick={() => { changeLanguage(lang.code); setMobileMenuOpen(false); }}
                className={`block w-full text-left text-sm py-2 px-3 rounded-lg ${language === lang.code ? 'bg-black text-white font-semibold' : 'text-gray-700 hover:bg-gray-50'}`}
              >
                {lang.label}
              </button>
            ))}
            <div className="border-t border-gray-100 pt-3 flex gap-2">
              <Link to="/login" className="flex-1 btn-secondary text-sm py-2.5" onClick={() => setMobileMenuOpen(false)}>
                {t('login')}
              </Link>
              <Link to="/register" className="flex-1 btn-primary text-sm py-2.5" onClick={() => setMobileMenuOpen(false)}>
                {t('register')}
              </Link>
            </div>
          </div>
        )}
      </nav>

    
{/* ── HERO ── */}
<section className="relative min-h-screen flex items-center bg-black overflow-hidden">

  {/* Background Image */}
  <div
    className="absolute inset-0 bg-cover bg-center"
    style={{
      backgroundImage: `url('https://images.unsplash.com/photo-1502877338535-766e1452684a?q=80&w=2070')`,
    }}
  />

  {/* Overlay */}
  <div className="absolute inset-0 bg-black/75" />

  <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-16 w-full">
    
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center py-16 lg:min-h-screen">

      {/* LEFT SIDE */}
      <div className="text-white space-y-5 text-center lg:text-left">
        
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
          Go anywhere with <br />
          <span className="text-gray-100">
            Swift<span className="text-gray-300">Move</span>
          </span>
        </h1>

        <p className="text-base sm:text-lg text-gray-400 max-w-md mx-auto lg:mx-0">
          Request a ride or delivery in seconds. Fast, reliable, and affordable logistics at your fingertips.
        </p>

        {/* Stats */}
        <div className="flex justify-center lg:justify-start gap-6 sm:gap-10 text-sm text-gray-400 pt-4">
          <div>
            <p className="text-white font-bold text-lg sm:text-xl">50K+</p>
            Deliveries
          </div>
          <div>
            <p className="text-white font-bold text-lg sm:text-xl">10K+</p>
            Drivers
          </div>
          <div>
            <p className="text-white font-bold text-lg sm:text-xl">4.8★</p>
            Rating
          </div>
        </div>

      </div>

      {/* RIGHT SIDE */}
      <div className="flex justify-center lg:justify-end">
        
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm sm:max-w-md p-5 sm:p-6 space-y-4">
          
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
            Book a delivery
          </h2>

          {/* Pickup */}
          <div className="flex items-center gap-3 border border-gray-200 rounded-lg px-3 sm:px-4 py-2.5 sm:py-3 focus-within:border-black transition">
            <div className="w-2.5 h-2.5 bg-black rounded-full"></div>
            <input
              type="text"
              placeholder="Enter pickup location"
              className="flex-1 text-sm outline-none"
              value={pickup}
              onChange={(e) => setPickup(e.target.value)}
            />
          </div>

          {/* Divider */}
          <div className="border-l-2 border-dashed border-gray-300 ml-2 h-3 sm:h-4"></div>

          {/* Drop */}
          <div className="flex items-center gap-3 border border-gray-200 rounded-lg px-3 sm:px-4 py-2.5 sm:py-3 focus-within:border-black transition">
            <div className="w-2.5 h-2.5 bg-gray-800 rounded-sm"></div>
            <input
              type="text"
              placeholder="Enter drop location"
              className="flex-1 text-sm outline-none"
              value={drop}
              onChange={(e) => setDrop(e.target.value)}
            />
          </div>

          {/* Button */}
          <Link
            to="/book"
            className="block w-full bg-black text-white py-2.5 sm:py-3 rounded-lg font-semibold text-center hover:bg-gray-900 transition"
          >
            Book now
          </Link>

        </div>

      </div>

    </div>
  </div>
</section>
      {/* ── VEHICLES ── */}
      <section className="py-20 bg-white">
  <div className="max-w-7xl mx-auto px-5">
    
    <h2 className="text-2xl font-bold text-gray-900 mb-8">
      Suggestions
    </h2>

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">

      {VEHICLES.map((v) => (
        <div
          key={v.type}
          className="bg-gray-100 rounded-xl p-5 flex items-center justify-between hover:shadow-md transition"
        >
          {/* LEFT TEXT */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-2 text-md">
              {v.name}
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              {v.desc}
            </p>

            <Link
              to="/book"
              className="text-sm text-black bg-white px-3 py-1.5 rounded-xl hover:bg-gray-100 transition"
            >
              Details
            </Link>
          </div>

          {/* RIGHT ICON */}
          <div className="text-8xl">
            {v.icon}
          </div>
        </div>
      ))}

    </div>
  </div>
</section>
{/* plan for later */}
<section className="py-14 sm:py-16 lg:py-20 bg-white">
  <div className="max-w-7xl mx-auto px-4 sm:px-5">

    {/* Heading */}
    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 sm:mb-8">
      Plan for later
    </h2>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

      {/* LEFT BIG CARD */}
      <div className="md:col-span-2 bg-[#cfe7ea] rounded-2xl p-5 sm:p-6 flex flex-col lg:flex-row items-center justify-between gap-6">

        {/* TEXT */}
        <div className="w-full max-w-md text-center lg:text-left">
          
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3">
            Get your ride right <br className="hidden sm:block" />
            with SwiftMove Reserve
          </h3>

          <p className="text-sm text-gray-700 mb-4">
            Choose date and time
          </p>

          {/* DATE + TIME */}
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <input
              type="date"
              className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm"
            />
            <input
              type="time"
              className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm"
            />
          </div>

          <Link to="/book">
            <button className="w-full sm:w-auto bg-black text-white px-6 py-2 rounded-lg text-sm hover:bg-gray-900 transition">
              Next
            </button>
          </Link>
        </div>

        {/* IMAGE */}
        <img
          src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400"
          alt="watch"
          className="w-40 sm:w-48 md:w-52 lg:w-56 object-contain"
        />

      </div>

      {/* RIGHT BENEFITS */}
      <div className="bg-gray-50 rounded-2xl p-5 sm:p-6">
        
        <h4 className="font-semibold text-gray-900 mb-4">
          Benefits
        </h4>

        <ul className="space-y-3 sm:space-y-4 text-sm text-gray-600">
          <li>📅 Choose your exact pickup time up to 90 days in advance.</li>
          <li>⏱ Extra wait time included to meet your ride.</li>
          <li>❌ Cancel at no charge up to 60 minutes in advance.</li>
        </ul>

        <p className="text-xs text-gray-400 mt-4 cursor-pointer hover:underline">
          See terms
        </p>

      </div>

    </div>
  </div>
</section>

      {/* ── HOW IT WORKS ── */}
      <section className="py-16 sm:py-20 lg:py-24 bg-gray-50">
  <div className="max-w-7xl mx-auto px-4 sm:px-6">

    {/* Header */}
    <div className=" mb-12 lg:mb-16">
      <p className="text-xs font-semibold tracking-widest text-gray-400 uppercase mb-3">
        Simple Process
      </p>
      <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
        How it works
      </h2>
    </div>

    {/* Steps */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">

      {STEPS.map((step, i) => (
        <div
          key={step.num}
          className="group bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition duration-300"
        >

          {/* Step Number */}
          <div className="w-12 h-12 flex items-center justify-center rounded-full bg-black text-white font-bold text-lg mb-4 group-hover:scale-110 transition">
            {step.num}
          </div>

          {/* Title */}
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {step.title}
          </h3>

          {/* Description */}
          <p className="text-sm text-gray-500 leading-relaxed">
            {step.desc}
          </p>

        </div>
      ))}

    </div>

  </div>
</section>

      {/* ── FEATURES ── */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-5">
          <div className="mb-14">
            <p className="text-xs font-semibold tracking-widest text-gray-400 uppercase mb-3">Why Choose Us</p>
            <h2 className="text-4xl font-bold text-gray-900 tracking-tight">Built for reliability</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {FEATURES.map(({ icon: Icon, title, desc }, i) => (
              <div
                key={title}
                className="group p-6 rounded-2xl border border-gray-100 hover:border-gray-200 hover:bg-gray-50 transition-all duration-200 animate-fade-in-up"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <div className="w-11 h-11 rounded-xl bg-black flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
{/* faq section */}
      <section className="py-24 bg-gray-50">
  <div className="max-w-7xl mx-auto px-10">

    {/* Heading */}
    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-10">
      Frequently asked questions
    </h2>

    {/* FAQ List */}
    <div className="space-y-3 px-10">

      {FAQS.map((faq, index) => {
        const isOpen = activeIndex === index;

        return (
          <div
            key={index}
            className=""
          >
            {/* Question */}
            <button
              onClick={() => toggleFAQ(index)}
              className="w-full flex items-center justify-between px-5 py-4 text-left"
            >
              <span className="font-medium text-gray-900">
                {faq.question}
              </span>

              <ChevronDown
                className={`w-5 h-5 text-black transition-transform  ${
                  isOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Answer */}
            <div
              className={`px-5 transition-all duration-300 ${
                isOpen ? "max-h-40 py-2 pb-4" : "max-h-0 overflow-hidden"
              }`}
            >
              <p className="text-sm text-gray-700">
                {faq.answer}
              </p>
            </div>
          </div>
        );
      })}

    </div>
  </div>
</section>

      {/* ── CTA ── */}
      <section className="py-24 bg-black">
        <div className="max-w-5xl mx-auto px-5 flex flex-col md:flex-row items-center justify-between gap-10">
          <div>
            <h2 className="text-4xl font-bold text-white mb-3 tracking-tight">Ready to get started?</h2>
            <p className="text-gray-400">Join thousands of customers and drivers on SwiftMove.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
            <Link
              to="/register"
              className="bg-white text-gray-900 font-semibold py-3 px-7 rounded-xl hover:bg-gray-100 transition-all text-sm"
            >
              Create Account
            </Link>
            <Link
              to="/register?role=driver"
              className="border border-white/20 text-white font-semibold py-3 px-7 rounded-xl hover:bg-white/5 transition-all text-sm"
            >
              Become a Driver
            </Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-gray-950 text-gray-500 py-10">
        <div className="max-w-7xl mx-auto px-5 flex flex-col md:flex-row items-center justify-between gap-5">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-white/10 rounded-lg flex items-center justify-center">
              <Truck className="w-4 h-4 text-white" />
            </div>
            <span className="text-white font-bold text-sm">SwiftMove</span>
          </div>
          <p className="text-xs">© 2024 SwiftMove. All rights reserved.</p>
          <div className="flex gap-5 text-xs">
            {['Privacy', 'Terms', 'Support'].map(link => (
              <a key={link} href="#" className="hover:text-white transition-colors">{link}</a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
