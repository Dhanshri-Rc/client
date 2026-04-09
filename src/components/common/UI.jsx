// import React from 'react';
// import { getStatusColor, getStatusDotColor } from '../../utils/helpers';

// // Loading spinner
// export function Spinner({ size = 'md', color = 'primary' }) {
//   const sizes = { sm: 'w-4 h-4', md: 'w-8 h-8', lg: 'w-12 h-12' };
//   const colors = { primary: 'border-primary-500', white: 'border-white', gray: 'border-gray-400' };
//   return (
//     <div className={`${sizes[size]} border-2 ${colors[color]} border-t-transparent rounded-full animate-spin`} />
//   );
// }

// export function PageLoader() {
//   return (
//     <div className="flex-1 flex items-center justify-center min-h-[400px]">
//       <div className="text-center">
//         <Spinner size="lg" />
//         <p className="mt-3 text-sm text-gray-500">Loading...</p>
//       </div>
//     </div>
//   );
// }

// // Status badge
// export function StatusBadge({ status }) {
//   const labels = { pending: 'Pending', accepted: 'Accepted', picked: 'Picked Up', delivered: 'Delivered', cancelled: 'Cancelled' };
//   return (
//     <span className={`status-badge ${getStatusColor(status)}`}>
//       <span className={`w-1.5 h-1.5 rounded-full ${getStatusDotColor(status)}`} />
//       {labels[status] || status}
//     </span>
//   );
// }

// // Stat card
// export function StatCard({ title, value, icon: Icon, color = 'primary', subtitle }) {
//   const colors = {
//     primary: 'bg-primary-50 text-primary-600',
//     blue: 'bg-blue-50 text-blue-600',
//     green: 'bg-green-50 text-green-600',
//     purple: 'bg-purple-50 text-purple-600',
//     red: 'bg-red-50 text-red-600',
//     yellow: 'bg-yellow-50 text-yellow-600',
//   };
//   return (
//     <div className="card flex items-center gap-4">
//       <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${colors[color]}`}>
//         <Icon className="w-6 h-6" />
//       </div>
//       <div>
//         <p className="text-sm text-gray-500 font-medium">{title}</p>
//         <p className="text-2xl font-bold text-gray-900">{value}</p>
//         {subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}
//       </div>
//     </div>
//   );
// }

// // Empty state
// export function EmptyState({ icon: Icon, title, description, action }) {
//   return (
//     <div className="flex flex-col items-center justify-center py-16 text-center">
//       {Icon && (
//         <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
//           <Icon className="w-8 h-8 text-gray-400" />
//         </div>
//       )}
//       <h3 className="text-lg font-semibold text-gray-700 mb-1">{title}</h3>
//       {description && <p className="text-sm text-gray-500 max-w-sm">{description}</p>}
//       {action && <div className="mt-4">{action}</div>}
//     </div>
//   );
// }

// // Error alert
// export function ErrorAlert({ message, onDismiss }) {
//   if (!message) return null;
//   return (
//     <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3 animate-slide-up">
//       <span className="text-red-500 text-lg">⚠️</span>
//       <div className="flex-1">
//         <p className="text-sm text-red-700 font-medium">{message}</p>
//       </div>
//       {onDismiss && (
//         <button onClick={onDismiss} className="text-red-400 hover:text-red-600 text-sm">✕</button>
//       )}
//     </div>
//   );
// }

// // Success alert
// export function SuccessAlert({ message }) {
//   if (!message) return null;
//   return (
//     <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-start gap-3 animate-slide-up">
//       <span className="text-green-500 text-lg">✅</span>
//       <p className="text-sm text-green-700 font-medium">{message}</p>
//     </div>
//   );
// }

// // Input with label
// export function FormInput({ label, error, ...props }) {
//   return (
//     <div>
//       {label && <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>}
//       <input className="input-field" {...props} />
//       {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
//     </div>
//   );
// }

// // Select with label
// export function FormSelect({ label, error, children, ...props }) {
//   return (
//     <div>
//       {label && <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>}
//       <select className="input-field" {...props}>{children}</select>
//       {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
//     </div>
//   );
// }

// // Step indicator
// export function StepIndicator({ steps, currentStep }) {
//   return (
//     <div className="flex items-center gap-0">
//       {steps.map((step, idx) => (
//         <React.Fragment key={idx}>
//           <div className={`flex items-center gap-2 ${idx <= currentStep ? 'text-primary-600' : 'text-gray-400'}`}>
//             <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all ${idx < currentStep ? 'bg-primary-500 border-primary-500 text-white' : idx === currentStep ? 'border-primary-500 text-primary-600 bg-primary-50' : 'border-gray-200 text-gray-400 bg-white'}`}>
//               {idx < currentStep ? '✓' : idx + 1}
//             </div>
//             <span className="text-xs font-medium hidden sm:block">{step}</span>
//           </div>
//           {idx < steps.length - 1 && (
//             <div className={`flex-1 h-0.5 mx-2 ${idx < currentStep ? 'bg-primary-400' : 'bg-gray-200'}`} />
//           )}
//         </React.Fragment>
//       ))}
//     </div>
//   );
// }



import React from 'react';
import { getStatusColor, getStatusDotColor } from '../../utils/helpers';

// Loading spinner
export function Spinner({ size = 'md', color = 'primary' }) {
  const sizes = { sm: 'w-4 h-4', md: 'w-8 h-8', lg: 'w-12 h-12' };
  const colors = {
    primary: 'border-black',
    white: 'border-white',
    gray: 'border-gray-400'
  };

  return (
    <div className={`${sizes[size]} border-2 ${colors[color]} border-t-transparent rounded-full animate-spin`} />
  );
}

export function PageLoader() {
  return (
    <div className="flex-1 flex items-center justify-center min-h-[400px]">
      <div className="text-center">
        <Spinner size="lg" />
        <p className="mt-3 text-sm text-gray-500">Loading...</p>
      </div>
    </div>
  );
}

// Status badge (forced monochrome)
export function StatusBadge({ status }) {
  const labels = {
    pending: 'Pending',
    accepted: 'Accepted',
    picked: 'Picked Up',
    delivered: 'Delivered',
    cancelled: 'Cancelled'
  };

  return (
    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-black">
      <span className="w-1.5 h-1.5 rounded-full bg-black" />
      {labels[status] || status}
    </span>
  );
}

// Stat card
export function StatCard({ title, value, icon: Icon, color = 'primary', subtitle }) {
  return (
    <div className="card flex items-center gap-4">
      <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-black text-white">
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <p className="text-sm text-gray-500 font-medium">{title}</p>
        <p className="text-2xl font-bold text-black">{value}</p>
        {subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}
      </div>
    </div>
  );
}

// Empty state
export function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      {Icon && (
        <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
          <Icon className="w-8 h-8 text-black" />
        </div>
      )}
      <h3 className="text-lg font-semibold text-black mb-1">{title}</h3>
      {description && <p className="text-sm text-gray-500 max-w-sm">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

// Error alert (monochrome)
export function ErrorAlert({ message, onDismiss }) {
  if (!message) return null;
  return (
    <div className="bg-gray-100 border border-gray-300 rounded-xl p-4 flex items-start gap-3 animate-slide-up">
      <span className="text-black text-lg">⚠️</span>
      <div className="flex-1">
        <p className="text-sm text-black font-medium">{message}</p>
      </div>
      {onDismiss && (
        <button onClick={onDismiss} className="text-gray-500 hover:text-black text-sm">✕</button>
      )}
    </div>
  );
}

// Success alert (monochrome)
export function SuccessAlert({ message }) {
  if (!message) return null;
  return (
    <div className="bg-gray-100 border border-gray-300 rounded-xl p-4 flex items-start gap-3 animate-slide-up">
      <span className="text-black text-lg">✔</span>
      <p className="text-sm text-black font-medium">{message}</p>
    </div>
  );
}

// Input with label
export function FormInput({ label, error, ...props }) {
  return (
    <div>
      {label && <label className="block text-sm font-medium text-black mb-1.5">{label}</label>}
      <input className="input-field border-gray-300 focus:border-black focus:ring-black" {...props} />
      {error && <p className="text-xs text-black mt-1">{error}</p>}
    </div>
  );
}

// Select with label
export function FormSelect({ label, error, children, ...props }) {
  return (
    <div>
      {label && <label className="block text-sm font-medium text-black mb-1.5">{label}</label>}
      <select className="input-field border-gray-300 focus:border-black focus:ring-black" {...props}>
        {children}
      </select>
      {error && <p className="text-xs text-black mt-1">{error}</p>}
    </div>
  );
}

// Step indicator
export function StepIndicator({ steps, currentStep }) {
  return (
    <div className="flex items-center gap-0">
      {steps.map((step, idx) => (
        <React.Fragment key={idx}>
          <div className={`flex items-center gap-2 ${idx <= currentStep ? 'text-black' : 'text-gray-400'}`}>
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all
              ${
                idx < currentStep
                  ? 'bg-black border-black text-white'
                  : idx === currentStep
                  ? 'border-black text-black bg-gray-100'
                  : 'border-gray-300 text-gray-400 bg-white'
              }`}
            >
              {idx < currentStep ? '✓' : idx + 1}
            </div>
            <span className="text-xs font-medium hidden sm:block">{step}</span>
          </div>

          {idx < steps.length - 1 && (
            <div className={`flex-1 h-0.5 mx-2 ${idx < currentStep ? 'bg-black' : 'bg-gray-300'}`} />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}