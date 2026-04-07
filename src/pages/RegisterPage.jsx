import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Truck, Eye, EyeOff, User, Truck as TruckIcon } from 'lucide-react';
import { registerUser, clearError } from '../store/slices/authSlice';
import { Spinner, ErrorAlert, StepIndicator } from '../components/common/UI';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { loading, error } = useSelector((s) => s.auth);
  const [showPw, setShowPw] = useState(false);
  const [step, setStep] = useState(0);

  const [form, setForm] = useState({
    name: '', email: '', phone: '', password: '',
    role: searchParams.get('role') === 'driver' ? 'driver' : 'customer',
    licenseNumber: '', vehicleType: 'bike', vehicleNumber: '',  vehicleModel: '',
  });

  useEffect(() => { dispatch(clearError()); }, []);

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

  const steps = form.role === 'driver' ? ['Personal Info', 'Select Role', 'Vehicle Details'] : ['Personal Info', 'Select Role'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-orange-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 bg-primary-500 rounded-xl flex items-center justify-center">
              <Truck className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold">Swift<span className="text-primary-500">Move</span></span>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">{t('registerTitle')}</h1>
          <p className="text-gray-500 mt-1">{t('registerSubtitle')}</p>
        </div>

        <div className="card shadow-xl border-0">
          <div className="mb-6">
            <StepIndicator steps={steps} currentStep={step} />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <ErrorAlert message={error} onDismiss={() => dispatch(clearError())} />}

            {step === 0 && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">{t('name')}</label>
                  <input type="text" required placeholder="John Doe" className="input-field" value={form.name} onChange={update('name')} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">{t('email')}</label>
                  <input type="email" required placeholder="you@example.com" className="input-field" value={form.email} onChange={update('email')} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">{t('phone')}</label>
                  <input type="tel" required placeholder="10-digit number" maxLength={10} className="input-field" value={form.phone} onChange={update('phone')} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">{t('password')}</label>
                  <div className="relative">
                    <input type={showPw ? 'text' : 'password'} required placeholder="Min. 6 characters" className="input-field pr-12" value={form.password} onChange={update('password')} />
                    <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                      {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <button type="button" onClick={() => setStep(1)} className="btn-primary w-full py-3"
                  disabled={!form.name || !form.email || !form.phone || !form.password}>
                  Next
                </button>
              </>
            )}

            {step === 1 && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">{t('selectRole')}</label>
                  <div className="grid grid-cols-2 gap-3">
                    {['customer', 'driver'].map((role) => (
                      <button
                        type="button" key={role}
                        onClick={() => setForm({ ...form, role })}
                        className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${form.role === role ? 'border-primary-500 bg-primary-50' : 'border-gray-200 hover:border-gray-300'}`}
                      >
                        {role === 'customer' ? <User className={`w-6 h-6 ${form.role === role ? 'text-primary-500' : 'text-gray-400'}`} /> : <TruckIcon className={`w-6 h-6 ${form.role === role ? 'text-primary-500' : 'text-gray-400'}`} />}
                        <span className={`text-sm font-semibold ${form.role === role ? 'text-primary-700' : 'text-gray-600'}`}>{t(role)}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {form.role === 'driver' ? (
                  <button type="button" onClick={() => setStep(2)} className="btn-primary w-full py-3">Next</button>
                ) : (
                  <button type="submit" disabled={loading} className="btn-primary w-full py-3">
                    {loading ? <Spinner size="sm" color="white" /> : t('register')}
                  </button>
                )}
                <button type="button" onClick={() => setStep(0)} className="btn-secondary w-full py-2.5">{t('back')}</button>
              </>
            )}

            {step === 2 && form.role === 'driver' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">{t('licenseNumber')}</label>
                  <input type="text" required placeholder="DL-XXXXXXXXXX" className="input-field" value={form.licenseNumber} onChange={update('licenseNumber')} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">{t('vehicleType')}</label>
                  <select className="input-field" value={form.vehicleType} onChange={update('vehicleType')}>
                    <option value="bike">🏍️ {t('bike')}</option>
                    <option value="mini_truck">🚐 {t('miniTruck')}</option>
                    <option value="large_truck">🚛 {t('largeTruck')}</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">{t('vehicleNumber')}</label>
                  <input type="text" placeholder="MH12AB1234" className="input-field" value={form.vehicleNumber} onChange={update('vehicleNumber')} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">{t('vehicleModel')}</label>
                  <input type="text" placeholder="Honda Activa" className="input-field" value={form.vehicleModel} onChange={update('vehicleModel')} />
                </div>
                <button type="submit" disabled={loading || !form.licenseNumber} className="btn-primary w-full py-3">
                  {loading ? <Spinner size="sm" color="white" /> : t('register')}
                </button>
                <button type="button" onClick={() => setStep(1)} className="btn-secondary w-full py-2.5">{t('back')}</button>
              </>
            )}
          </form>

          <div className="mt-5 text-center">
            <p className="text-sm text-gray-500">
              {t('hasAccount')}{' '}
              <Link to="/login" className="text-primary-600 font-semibold hover:text-primary-700">{t('login')}</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
