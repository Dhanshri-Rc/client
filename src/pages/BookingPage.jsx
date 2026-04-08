// import React, { useState, useEffect, useRef } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useDispatch, useSelector } from 'react-redux';
// import { useTranslation } from 'react-i18next';
// import { MapPin, Navigation, Package, Clock, IndianRupee, CheckCircle } from 'lucide-react';
// import { getFareEstimate, createOrder, clearEstimate } from '../store/slices/orderSlice';
// import { Spinner, StepIndicator, ErrorAlert } from '../components/common/UI';
// import { calculateDistance, formatCurrency, getVehicleIcon } from '../utils/helpers';
// import toast from 'react-hot-toast';

// const VEHICLES = [
//   { type: 'bike', icon: '🏍️', name: 'Bike', desc: 'Up to 20 kg', basePrice: 30, pricePerKm: 8 },
//   { type: 'mini_truck', icon: '🚐', name: 'Mini Truck', desc: 'Up to 500 kg', basePrice: 80, pricePerKm: 15 },
//   { type: 'large_truck', icon: '🚛', name: 'Large Truck', desc: 'Up to 2000 kg', basePrice: 150, pricePerKm: 25 },
// ];

// // Google Maps Autocomplete input
// // function PlaceInput({ label, placeholder, value, onChange, icon: Icon }) {
// //   const inputRef = useRef(null);
// //   const autocompleteRef = useRef(null);

// //   useEffect(() => {
// //     if (!window.google || !inputRef.current) return;
// //     autocompleteRef.current = new window.google.maps.places.Autocomplete(inputRef.current, {
// //       componentRestrictions: { country: 'in' },
// //       fields: ['geometry', 'formatted_address'],
// //     });
// //     autocompleteRef.current.addListener('place_changed', () => {
// //       const place = autocompleteRef.current.getPlace();
// //       if (place.geometry) {
// //         onChange({
// //           address: place.formatted_address,
// //           lat: place.geometry.location.lat(),
// //           lng: place.geometry.location.lng(),
// //         });
// //       }
// //     });
// //   }, []);

// //   return (
// //     <div>
// //       <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
// //       <div className="relative">
// //         <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
// //         <input
// //           ref={inputRef}
// //           type="text"
// //           placeholder={placeholder}
// //           defaultValue={value?.address || ''}
// //           className="input-field pl-10"
// //         />
// //       </div>
// //     </div>
// //   );
// // }

// function PlaceInput({ label, placeholder, value, onChange, icon: Icon }) {
//   return (
//     <div>
//       <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
//       <div className="relative">
//         <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
//         <input
//           type="text"
//           placeholder={placeholder}
//           value={value?.address || ''}
//           onChange={(e) =>
//             onChange({
//               address: e.target.value,
//               lat: 18.5204 + Math.random() * 0.1,
//               lng: 73.8567 + Math.random() * 0.1,
//             })
//           }
//           className="input-field pl-10"
//         />
//       </div>
//     </div>
//   );
// }

// export default function BookingPage() {
//   const { t } = useTranslation();
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const { estimate, loading, error } = useSelector((s) => s.orders);

//   const [step, setStep] = useState(0);
//   const [pickup, setPickup] = useState(null);
//   const [dropoff, setDropoff] = useState(null);
//   const [vehicleType, setVehicleType] = useState('bike');
//   const [paymentMethod, setPaymentMethod] = useState('online');
//   const [packageDetails, setPackageDetails] = useState({ description: '', weight: '', fragile: false });
//   const [notes, setNotes] = useState('');

//   useEffect(() => {
//     dispatch(clearEstimate());
//     return () => dispatch(clearEstimate());
//   }, []);

//   // const handleEstimate = async () => {
//   //   if (!pickup || !dropoff) return toast.error('Please select pickup and drop locations');
//   //   const distance = calculateDistance(pickup.lat, pickup.lng, dropoff.lat, dropoff.lng);
//   //   await dispatch(getFareEstimate({ pickup, dropoff, vehicleType }));
//   //   setStep(2);
//   // };

//   // const handlePlaceOrder = async () => {
//   //   if (!pickup || !dropoff || !estimate) return;
//   //   const distance = calculateDistance(pickup.lat, pickup.lng, dropoff.lat, dropoff.lng);
//   //   const result = await dispatch(createOrder({
//   //     vehicleType, pickup, dropoff, distance,
//   //     packageDetails: { ...packageDetails, weight: Number(packageDetails.weight) || 0 },
//   //     paymentMethod, notes,
//   //   }));
//   //   if (createOrder.fulfilled.match(result)) {
//   //     toast.success('Order placed successfully!');
//   //     navigate(`/track/${result.payload._id}`);
//   //   }
//   // };
// const handleEstimate = async () => {
//   if (!pickup || !dropoff) {
//     return toast.error('Please select pickup and drop locations');
//   }

//   const distance = calculateDistance(pickup.lat, pickup.lng, dropoff.lat, dropoff.lng);

//   if (distance <= 0) {
//     return toast.error('Pickup and drop cannot be same');
//   }

//   await dispatch(getFareEstimate({ pickup, dropoff, vehicleType }));
//   setStep(2);
// };
// const handlePlaceOrder = async () => {
//   const token = localStorage.getItem("token");

//   // ✅ Check login
//   if (!token) {
//     toast.error("Please login first");
//     navigate("/login");
//     return;
//   }

//   // ✅ Validate data
//   if (!pickup || !dropoff || !estimate) {
//     toast.error("Missing order details");
//     return;
//   }

//   const distance = calculateDistance(pickup.lat, pickup.lng, dropoff.lat, dropoff.lng);

//   const result = await dispatch(createOrder({
//     vehicleType,
//     pickup,
//     dropoff,
//     distance,
//     packageDetails: {
//       ...packageDetails,
//       weight: Number(packageDetails.weight) || 0,
//     },
//     paymentMethod,
//     notes,
//   }));

//   // ❌ Handle error properly
//   if (createOrder.rejected.match(result)) {
//     toast.error(result.payload || "Order failed");
//     return;
//   }

//   // ✅ Handle success properly
//   if (createOrder.fulfilled.match(result)) {
//     const order = result.payload;

//     if (!order?._id) {
//       toast.error("Order created but ID missing");
//       return;
//     }

//     toast.success("Order placed successfully!");
//     navigate(`/track/${order._id}`);
//   }
// };

//   const steps = ['Location', 'Vehicle', 'Confirm'];

//   return (
//     <div className="max-w-2xl mx-auto animate-fade-in">
//       <div className="mb-6">
//         <h1 className="text-2xl font-bold text-gray-900">{t('bookDelivery')}</h1>
//         <p className="text-gray-500 mt-1">Fill in delivery details below</p>
//       </div>

//       {/* Step indicator */}
//       <div className="card mb-6">
//         <StepIndicator steps={steps} currentStep={step} />
//       </div>

//       {error && <ErrorAlert message={error} />}

//       {/* Step 0: Locations */}
//       {step === 0 && (
//         <div className="card space-y-4 animate-slide-up">
//           <PlaceInput
//             label={t('pickupLocation')}
//             placeholder="Enter pickup address"
//             value={pickup}
//             onChange={setPickup}
//             icon={Navigation}
//           />
//           <div className="flex items-center gap-3 py-1">
//             <div className="flex-1 h-px bg-gray-200" />
//             <div className="w-6 h-6 rounded-full bg-primary-100 flex items-center justify-center">
//               <div className="w-2 h-2 rounded-full bg-primary-400" />
//             </div>
//             <div className="flex-1 h-px bg-gray-200" />
//           </div>
//           <PlaceInput
//             label={t('dropLocation')}
//             placeholder="Enter drop address"
//             value={dropoff}
//             onChange={setDropoff}
//             icon={MapPin}
//           />
//           <div className="pt-2">
//             <label className="block text-sm font-medium text-gray-700 mb-1.5">Package Description (optional)</label>
//             <input
//               type="text" placeholder="What are you shipping?"
//               className="input-field"
//               value={packageDetails.description}
//               onChange={e => setPackageDetails({ ...packageDetails, description: e.target.value })}
//             />
//           </div>
//           <div className="grid grid-cols-2 gap-3">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1.5">Weight (kg)</label>
//               <input
//                 type="number" placeholder="0" min="0"
//                 className="input-field"
//                 value={packageDetails.weight}
//                 onChange={e => setPackageDetails({ ...packageDetails, weight: e.target.value })}
//               />
//             </div>
//             <div className="flex items-end pb-1">
//               <label className="flex items-center gap-2 cursor-pointer">
//                 <input
//                   type="checkbox"
//                   className="w-4 h-4 rounded text-primary-500"
//                   checked={packageDetails.fragile}
//                   onChange={e => setPackageDetails({ ...packageDetails, fragile: e.target.checked })}
//                 />
//                 <span className="text-sm text-gray-700">Fragile item</span>
//               </label>
//             </div>
//           </div>
//           <button
//             onClick={() => { if (!pickup) return toast.error('Select pickup'); if (!dropoff) return toast.error('Select dropoff'); setStep(1); }}
//             className="btn-primary w-full py-3"
//           >
//             Next: Select Vehicle
//           </button>
//         </div>
//       )}

//       {/* Step 1: Vehicle */}
//       {step === 1 && (
//         <div className="space-y-4 animate-slide-up">
//           <div className="card">
//             <h3 className="font-semibold text-gray-900 mb-4">{t('selectVehicle')}</h3>
//             <div className="space-y-3">
//               {VEHICLES.map((v) => (
//                 <button
//                   key={v.type}
//                   onClick={() => setVehicleType(v.type)}
//                   className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${
//                     vehicleType === v.type ? 'border-primary-500 bg-primary-50' : 'border-gray-200 hover:border-gray-300'
//                   }`}
//                 >
//                   <span className="text-3xl">{v.icon}</span>
//                   <div className="flex-1 text-left">
//                     <p className={`font-semibold ${vehicleType === v.type ? 'text-primary-700' : 'text-gray-900'}`}>{v.name}</p>
//                     <p className="text-sm text-gray-500">{v.desc}</p>
//                   </div>
//                   <div className="text-right">
//                     <p className="text-sm font-bold text-gray-700">₹{v.basePrice} base</p>
//                     <p className="text-xs text-gray-400">+₹{v.pricePerKm}/km</p>
//                   </div>
//                   {vehicleType === v.type && <CheckCircle className="w-5 h-5 text-primary-500 flex-shrink-0" />}
//                 </button>
//               ))}
//             </div>
//           </div>

//           <div className="card">
//             <h3 className="font-semibold text-gray-900 mb-3">Payment Method</h3>
//             <div className="grid grid-cols-2 gap-3">
//               {[{ value: 'online', label: '💳 Online', sub: 'Razorpay' }, { value: 'cash', label: '💵 Cash', sub: 'Pay on delivery' }].map(p => (
//                 <button key={p.value} onClick={() => setPaymentMethod(p.value)}
//                   className={`p-3 rounded-xl border-2 text-left transition-all ${paymentMethod === p.value ? 'border-primary-500 bg-primary-50' : 'border-gray-200'}`}>
//                   <p className={`font-medium text-sm ${paymentMethod === p.value ? 'text-primary-700' : 'text-gray-700'}`}>{p.label}</p>
//                   <p className="text-xs text-gray-400">{p.sub}</p>
//                 </button>
//               ))}
//             </div>
//           </div>

//           <div className="card">
//             <label className="block text-sm font-medium text-gray-700 mb-1.5">Additional Notes</label>
//             <textarea
//               className="input-field resize-none" rows={2}
//               placeholder="Any special instructions..."
//               value={notes}
//               onChange={e => setNotes(e.target.value)}
//             />
//           </div>

//           <div className="flex gap-3">
//             <button onClick={() => setStep(0)} className="btn-secondary flex-1 py-3">{t('back')}</button>
//             <button onClick={handleEstimate} disabled={loading} className="btn-primary flex-1 py-3">
//               {loading ? <Spinner size="sm" color="white" /> : 'Get Estimate'}
//             </button>
//           </div>
//         </div>
//       )}

//       {/* Step 2: Confirm & Pay */}
//       {step === 2 && estimate && (
//         <div className="space-y-4 animate-slide-up">
//           {/* Route summary */}
//           <div className="card space-y-3">
//             <h3 className="font-semibold text-gray-900">Delivery Summary</h3>
//             <div className="space-y-2 text-sm">
//               <div className="flex gap-3 items-start">
//                 <Navigation className="w-4 h-4 text-primary-500 mt-0.5 flex-shrink-0" />
//                 <div>
//                   <p className="text-xs text-gray-400 font-medium">PICKUP</p>
//                   <p className="text-gray-700">{pickup?.address}</p>
//                 </div>
//               </div>
//               <div className="ml-2 w-px h-4 bg-gray-200" />
//               <div className="flex gap-3 items-start">
//                 <MapPin className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
//                 <div>
//                   <p className="text-xs text-gray-400 font-medium">DROP</p>
//                   <p className="text-gray-700">{dropoff?.address}</p>
//                 </div>
//               </div>
//             </div>
//             <div className="flex items-center gap-4 pt-2 border-t border-gray-100 text-sm">
//               <div className="flex items-center gap-1.5 text-gray-500">
//                 <MapPin className="w-4 h-4" />{estimate.distance} {t('km')}
//               </div>
//               <div className="flex items-center gap-1.5 text-gray-500">
//                 <Clock className="w-4 h-4" />{estimate.estimatedTime} {t('mins')}
//               </div>
//               <div className="flex items-center gap-1.5 text-gray-500">
//                 <span className="text-xl">{getVehicleIcon(vehicleType)}</span>
//                 {VEHICLES.find(v => v.type === vehicleType)?.name}
//               </div>
//             </div>
//           </div>

//           {/* Fare breakdown */}
//           <div className="card">
//             <h3 className="font-semibold text-gray-900 mb-3">{t('estimatedFare')}</h3>
//             <div className="space-y-2 text-sm">
//               <div className="flex justify-between text-gray-600">
//                 <span>{t('baseFare')}</span>
//                 <span>{formatCurrency(estimate.fare.base)}</span>
//               </div>
//               <div className="flex justify-between text-gray-600">
//                 <span>Distance ({estimate.distance} km × ₹{estimate.fare.perKm})</span>
//                 <span>{formatCurrency(estimate.fare.distanceFare)}</span>
//               </div>
//               <div className="flex justify-between font-bold text-gray-900 pt-2 border-t border-gray-100 text-base">
//                 <span>{t('totalFare')}</span>
//                 <span className="text-primary-600">{formatCurrency(estimate.fare.total)}</span>
//               </div>
//             </div>
//             <div className="mt-3 bg-blue-50 rounded-xl p-3 text-xs text-blue-700">
//               💡 Payment: <strong>{paymentMethod === 'online' ? 'Online (Razorpay)' : 'Cash on delivery'}</strong>
//             </div>
//           </div>

//           <div className="flex gap-3">
//             <button onClick={() => setStep(1)} className="btn-secondary flex-1 py-3">{t('back')}</button>
//             <button onClick={handlePlaceOrder} disabled={loading} className="btn-primary flex-1 py-3">
//               {loading ? <Spinner size="sm" color="white" /> : t('placeOrder')}
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }



import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { MapPin, Navigation, Clock, CheckCircle } from 'lucide-react';
import { getFareEstimate, createOrder, clearEstimate } from '../store/slices/orderSlice';
import { Spinner, StepIndicator, ErrorAlert } from '../components/common/UI';
import { calculateDistance, formatCurrency, getVehicleIcon } from '../utils/helpers';
import toast from 'react-hot-toast';

const VEHICLES = [
  { type: 'bike', icon: '🏍️', name: 'Bike', desc: 'Up to 20 kg', basePrice: 30, pricePerKm: 8 },
  { type: 'mini_truck', icon: '🚐', name: 'Mini Truck', desc: 'Up to 500 kg', basePrice: 80, pricePerKm: 15 },
  { type: 'large_truck', icon: '🚛', name: 'Large Truck', desc: 'Up to 2000 kg', basePrice: 150, pricePerKm: 25 },
];

function PlaceInput({ label, placeholder, value, onChange, icon: Icon }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-800 mb-1.5">{label}</label>
      <div className="relative">
        <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
        <input
          type="text"
          placeholder={placeholder}
          value={value?.address || ''}
          onChange={(e) =>
            onChange({
              address: e.target.value,
              lat: 18.5204 + Math.random() * 0.1,
              lng: 73.8567 + Math.random() * 0.1,
            })
          }
          className="w-full border border-gray-300 rounded-xl px-4 py-3 pl-10 focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition"
        />
      </div>
    </div>
  );
}

export default function BookingPage() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { estimate, loading, error } = useSelector((s) => s.orders);

  const [step, setStep] = useState(0);
  const [pickup, setPickup] = useState(null);
  const [dropoff, setDropoff] = useState(null);
  const [vehicleType, setVehicleType] = useState('bike');
  const [paymentMethod, setPaymentMethod] = useState('online');
  const [packageDetails, setPackageDetails] = useState({ description: '', weight: '', fragile: false });
  const [notes, setNotes] = useState('');

  useEffect(() => {
    dispatch(clearEstimate());
    return () => dispatch(clearEstimate());
  }, []);

  const handleEstimate = async () => {
    if (!pickup || !dropoff) return toast.error('Please select pickup and drop locations');

    const distance = calculateDistance(pickup.lat, pickup.lng, dropoff.lat, dropoff.lng);
    if (distance <= 0) return toast.error('Pickup and drop cannot be same');

    await dispatch(getFareEstimate({ pickup, dropoff, vehicleType }));
    setStep(2);
  };

  const handlePlaceOrder = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("Please login first");
      navigate("/login");
      return;
    }

    if (!pickup || !dropoff || !estimate) {
      toast.error("Missing order details");
      return;
    }

    const distance = calculateDistance(pickup.lat, pickup.lng, dropoff.lat, dropoff.lng);

    const result = await dispatch(createOrder({
      vehicleType,
      pickup,
      dropoff,
      distance,
      packageDetails: {
        ...packageDetails,
        weight: Number(packageDetails.weight) || 0,
      },
      paymentMethod,
      notes,
    }));

    if (createOrder.rejected.match(result)) {
      toast.error(result.payload || "Order failed");
      return;
    }

    if (createOrder.fulfilled.match(result)) {
      const order = result.payload;
      toast.success("Order placed successfully!");
      navigate(`/track/${order._id}`);
    }
  };

  const steps = ['Location', 'Vehicle', 'Confirm'];

  return (
    <div className="max-w-2xl mx-auto animate-fade-in text-gray-900">

      <div className="mb-6">
        <h1 className="text-3xl font-bold text-black">{t('bookDelivery')}</h1>
        <p className="text-gray-600 mt-1">Fill in delivery details below</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm mb-6 p-4">
        <StepIndicator steps={steps} currentStep={step} />
      </div>

      {error && <ErrorAlert message={error} />}

      {/* STEP 0 */}
      {step === 0 && (
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-4 space-y-4">

          <PlaceInput label={t('pickupLocation')} placeholder="Enter pickup address" value={pickup} onChange={setPickup} icon={Navigation} />

          <PlaceInput label={t('dropLocation')} placeholder="Enter drop address" value={dropoff} onChange={setDropoff} icon={MapPin} />

          <input
            type="text"
            placeholder="What are you shipping?"
            className="w-full border border-gray-300 rounded-xl px-4 py-3"
            value={packageDetails.description}
            onChange={e => setPackageDetails({ ...packageDetails, description: e.target.value })}
          />

          <button
            onClick={() => setStep(1)}
            className="w-full py-3 bg-black text-white rounded-xl font-medium hover:bg-gray-900 transition"
          >
            Next: Select Vehicle
          </button>
        </div>
      )}

      {/* STEP 1 */}
      {step === 1 && (
        <div className="space-y-4">

          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-4">
            {VEHICLES.map(v => (
              <button
                key={v.type}
                onClick={() => setVehicleType(v.type)}
                className={`w-full flex items-center gap-4 p-4 rounded-2xl border transition ${
                  vehicleType === v.type
                    ? 'border-black bg-gray-100'
                    : 'border-gray-200 hover:bg-gray-50'
                }`}
              >
                <span className="text-3xl">{v.icon}</span>
                <div className="flex-1 text-left">
                  <p className="font-semibold text-black">{v.name}</p>
                  <p className="text-sm text-gray-500">{v.desc}</p>
                </div>
                {vehicleType === v.type && <CheckCircle className="text-black" />}
              </button>
            ))}
          </div>

          <div className="flex gap-3">
            <button onClick={() => setStep(0)} className="flex-1 py-3 bg-gray-100 rounded-xl">Back</button>
            <button onClick={handleEstimate} className="flex-1 py-3 bg-black text-white rounded-xl">
              {loading ? <Spinner size="sm" color="white" /> : 'Get Estimate'}
            </button>
          </div>
        </div>
      )}

      {/* STEP 2 */}
      {step === 2 && estimate && (
        <div className="space-y-4">

          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-4">
            <h3 className="font-semibold text-black">Summary</h3>
            <p className="text-gray-600 text-sm">{pickup?.address}</p>
            <p className="text-gray-600 text-sm">{dropoff?.address}</p>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-4">
            <h3 className="font-semibold text-black">{t('estimatedFare')}</h3>
            <div className="flex justify-between font-bold text-black mt-2">
              <span>Total</span>
              <span>{formatCurrency(estimate.fare.total)}</span>
            </div>
          </div>

          <div className="flex gap-3">
            <button onClick={() => setStep(1)} className="flex-1 py-3 bg-gray-100 rounded-xl">Back</button>
            <button onClick={handlePlaceOrder} className="flex-1 py-3 bg-black text-white rounded-xl">
              {loading ? <Spinner size="sm" color="white" /> : t('placeOrder')}
            </button>
          </div>

        </div>
      )}
    </div>
  );
}