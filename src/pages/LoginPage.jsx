import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Truck, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { loginUser, clearError } from '../store/slices/authSlice';
import { Spinner, ErrorAlert } from '../components/common/UI';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((s) => s.auth);
  const [showPw, setShowPw] = useState(false);
  const [form, setForm] = useState({ email: '', password: '' });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    dispatch(clearError());
    setTimeout(() => setMounted(true), 50);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(loginUser(form));
    if (loginUser.fulfilled.match(result)) {
      toast.success('Welcome back!');
      const role = result.payload.user.role;
      navigate(role === 'driver' ? '/driver' : role === 'admin' ? '/admin' : '/dashboard');
    }
  };

  return (
   <div className="min-h-screen flex flex-col lg:flex-row bg-white">
      {/* Left Panel — decorative */}
      <div
        className="hidden lg:flex lg:w-1/2 relative bg-cover bg-center"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=1200&q=80')`,
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
              Fast, reliable<br />deliveries at your<br />fingertips.
            </h2>
            <p className="text-white/60 text-sm">Trusted by 50,000+ customers across India.</p>
          </div>
        </div>
      </div>

      {/* Right Panel — form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 md:px-10 lg:px-16 py-10">
        <div
          className={`w-full max-w-md mx-auto transition-all duration-500 ${
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          {/* Mobile logo */}
          <div className="lg:hidden mb-6 flex justify-center">
            <Link to="/" className="inline-flex items-center gap-2">
              <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                <Truck className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-gray-900">SwiftMove</span>
            </Link>
          </div>

          <div className="mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight mb-2">
              {t('loginTitle')}
            </h1>
            <p className="text-gray-500 text-sm">{t('loginSubtitle')}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <ErrorAlert message={error} onDismiss={() => dispatch(clearError())} />}

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">
                {t('email')}
              </label>
              <input
                type="email"
                required
                placeholder="you@example.com"
                className="input-field w-full"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide">
                  {t('password')}
                </label>
              </div>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                 className="input-field w-full pr-12"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
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
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3 text-sm mt-2"
            >
              {loading ? <Spinner size="sm" color="white" /> : t('login')}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            {t('noAccount')}{' '}
            <Link to="/register" className="text-gray-900 font-semibold hover:underline">
              {t('register')}
            </Link>
          </p>

        

          <Link
            to="/"
            className="mt-6 flex justify-center lg:justify-start items-center gap-2 text-xs text-gray-400  hover:text-gray-600 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
