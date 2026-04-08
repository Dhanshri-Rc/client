import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Truck, Eye, EyeOff, User, Truck as TruckIcon, ArrowLeft, Check } from 'lucide-react';
import { registerUser, clearError } from '../store/slices/authSlice';
import { Spinner, ErrorAlert } from '../components/common/UI';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { loading, error } = useSelector((s) => s.auth);
  const [showPw, setShowPw] = useState(false);
  const [step, setStep] = useState(0);
  const [mounted, setMounted] = useState(false);

  const [form, setForm] = useState({
    name: '', email: '', phone: '', password: '',
    role: searchParams.get('role') === 'driver' ? 'driver' : 'customer',
    licenseNumber: '', vehicleType: 'bike', vehicleNumber: '', vehicleModel: ''
  });

  useEffect(() => {
    dispatch(clearError());
    setTimeout(() => setMounted(true), 50);
  }, []);

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(registerUser(form));
    if (registerUser.fulfilled.match(result)) {
      toast.success('Account created successfully!');
      const role = result.payload.user.role;
      navigate(role === 'driver' ? '/driver' : '/dashboard');
    }
  };

  const steps = form.role === 'driver'
    ? ['Personal Info', 'Select Role', 'Vehicle Details']
    : ['Personal Info', 'Select Role'];

  const step1Complete = form.name && form.email && form.phone && form.password;

  return (
    <div className="min-h-screen bg-white flex">
      {/* Left decorative panel */}
      <div
        className="hidden lg:flex lg:w-1/2 relative bg-cover bg-center"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1519003722824-194d4455a60c?w=1200&q=80')`,
        }}
      >
        <div className="absolute inset-0 bg-black/65" />
        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white/10 border border-white/20 rounded-lg flex items-center justify-center">
              <Truck className="w-4 h-4 text-white" />
            </div>
            <span className="text-white font-bold tracking-tight">SwiftMove</span>
          </Link>
          <div>
            <h2 className="text-4xl font-bold text-white mb-4 leading-tight tracking-tight">
              Join India's fastest<br />growing delivery<br />network.
            </h2>
            <div className="space-y-2.5 mt-6">
              {['Free to sign up', 'Instant booking', 'Real-time tracking'].map(item => (
                <div key={item} className="flex items-center gap-2.5 text-sm text-white/70">
                  <div className="w-4 h-4 rounded-full bg-white/15 flex items-center justify-center flex-shrink-0">
                    <Check className="w-2.5 h-2.5 text-white" />
                  </div>
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex flex-col justify-center px-6 py-12 lg:px-16 overflow-y-auto">
        <div
          className={`w-full max-w-sm mx-auto transition-all duration-500 ${
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          {/* Mobile logo */}
          <div className="lg:hidden mb-8">
            <Link to="/" className="inline-flex items-center gap-2">
              <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                <Truck className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-gray-900">SwiftMove</span>
            </Link>
          </div>

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight mb-2">
              {t('registerTitle')}
            </h1>
            <p className="text-gray-500 text-sm">{t('registerSubtitle')}</p>
          </div>

          {/* Step indicator */}
          <div className="flex items-center gap-2 mb-8">
            {steps.map((s, i) => (
              <React.Fragment key={s}>
                <div className="flex items-center gap-2">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                      i < step
                        ? 'bg-black text-white'
                        : i === step
                        ? 'bg-black text-white ring-4 ring-black/10'
                        : 'bg-gray-100 text-gray-400'
                    }`}
                  >
                    {i < step ? <Check className="w-3.5 h-3.5" /> : i + 1}
                  </div>
                  <span className={`text-xs font-medium hidden sm:block ${i === step ? 'text-gray-900' : 'text-gray-400'}`}>
                    {s}
                  </span>
                </div>
                {i < steps.length - 1 && (
                  <div className={`flex-1 h-px transition-colors ${i < step ? 'bg-black' : 'bg-gray-200'}`} />
                )}
              </React.Fragment>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <ErrorAlert message={error} onDismiss={() => dispatch(clearError())} />}

            {/* Step 0: Personal Info */}
            {step === 0 && (
              <div className="space-y-4 animate-fade-in-up">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">{t('name')}</label>
                  <input type="text" required placeholder="John Doe" className="input-field" value={form.name} onChange={update('name')} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">{t('email')}</label>
                  <input type="email" required placeholder="you@example.com" className="input-field" value={form.email} onChange={update('email')} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">{t('phone')}</label>
                  <input type="tel" required placeholder="10-digit number" maxLength={10} className="input-field" value={form.phone} onChange={update('phone')} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">{t('password')}</label>
                  <div className="relative">
                    <input
                      type={showPw ? 'text' : 'password'}
                      required
                      placeholder="Min. 6 characters"
                      className="input-field pr-12"
                      value={form.password}
                      onChange={update('password')}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPw(!showPw)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  disabled={!step1Complete}
                  className="btn-primary w-full py-3.5 text-sm"
                >
                  Continue
                </button>
              </div>
            )}

            {/* Step 1: Role Selection */}
            {step === 1 && (
              <div className="space-y-4 animate-fade-in-up">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-3">
                    {t('selectRole')}
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {['customer', 'driver'].map((role) => (
                      <button
                        type="button"
                        key={role}
                        onClick={() => setForm({ ...form, role })}
                        className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2.5 ${
                          form.role === role
                            ? 'border-black bg-black'
                            : 'border-gray-200 hover:border-gray-300 bg-white'
                        }`}
                      >
                        {role === 'customer' ? (
                          <User className={`w-5 h-5 ${form.role === role ? 'text-white' : 'text-gray-400'}`} />
                        ) : (
                          <TruckIcon className={`w-5 h-5 ${form.role === role ? 'text-white' : 'text-gray-400'}`} />
                        )}
                        <span className={`text-sm font-semibold capitalize ${form.role === role ? 'text-white' : 'text-gray-700'}`}>
                          {t(role)}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {form.role === 'driver' ? (
                  <button type="button" onClick={() => setStep(2)} className="btn-primary w-full py-3.5 text-sm">
                    Continue
                  </button>
                ) : (
                  <button type="submit" disabled={loading} className="btn-primary w-full py-3.5 text-sm">
                    {loading ? <Spinner size="sm" color="white" /> : t('register')}
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setStep(0)}
                  className="btn-secondary w-full py-3 text-sm"
                >
                  {t('back')}
                </button>
              </div>
            )}

            {/* Step 2: Driver Details */}
            {step === 2 && form.role === 'driver' && (
              <div className="space-y-4 animate-fade-in-up">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">{t('licenseNumber')}</label>
                  <input
                    type="text"
                    required
                    placeholder="DL-XXXXXXXXXX"
                    className="input-field"
                    value={form.licenseNumber}
                    onChange={update('licenseNumber')}
                  />
                </div>

                {/* RC Number - NEW field for drivers */}
                {/* <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">
                    {t('rcNumber')}
                    <span className="ml-1.5 text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="MH12AB1234"
                    className="input-field"
                    value={form.rcNumber}
                    onChange={update('rcNumber')}
                  />
                  <p className="text-xs text-gray-400 mt-1.5">Registration Certificate number of your vehicle</p>
                </div> */}

                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">{t('vehicleType')}</label>
                  <select className="input-field" value={form.vehicleType} onChange={update('vehicleType')}>
                    <option value="bike">🏍️ {t('bike')}</option>
                    <option value="mini_truck">🚐 {t('miniTruck')}</option>
                    <option value="large_truck">🚛 {t('largeTruck')}</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">{t('vehicleNumber')}</label>
                  <input
                    type="text"
                    placeholder="MH12AB1234"
                    className="input-field"
                    value={form.vehicleNumber}
                    onChange={update('vehicleNumber')}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">{t('vehicleModel')}</label>
                  <input
                    type="text"
                    placeholder="Honda Activa"
                    className="input-field"
                    value={form.vehicleModel}
                    onChange={update('vehicleModel')}
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading || !form.licenseNumber}
                  className="btn-primary w-full py-3.5 text-sm"
                >
                  {loading ? <Spinner size="sm" color="white" /> : t('register')}
                </button>
                <button type="button" onClick={() => setStep(1)} className="btn-secondary w-full py-3 text-sm">
                  {t('back')}
                </button>
              </div>
            )}
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            {t('hasAccount')}{' '}
            <Link to="/login" className="text-gray-900 font-semibold hover:underline">
              {t('login')}
            </Link>
          </p>

          <Link
            to="/"
            className="mt-5 flex items-center gap-2 text-xs text-gray-400 hover:text-gray-600 transition-colors justify-center"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
