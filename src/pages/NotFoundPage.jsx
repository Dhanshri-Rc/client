import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFoundPage() {
  const { user } = useSelector((s) => s.auth);

  const dashboardLink = user
    ? user.role === 'driver' ? '/driver' : user.role === 'admin' ? '/admin' : '/dashboard'
    : '/';

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-orange-50 flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <div className="text-8xl font-black text-primary-200 mb-4">404</div>
        <div className="text-5xl mb-6">🚚💨</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Page Not Found</h1>
        <p className="text-gray-500 mb-8">
          Looks like this delivery went to the wrong address. Let's get you back on track.
        </p>
        <div className="flex gap-3 justify-center">
          <button onClick={() => window.history.back()} className="btn-secondary py-3 px-6">
            <ArrowLeft className="w-4 h-4" /> Go Back
          </button>
          <Link to={dashboardLink} className="btn-primary py-3 px-6">
            <Home className="w-4 h-4" /> Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}
