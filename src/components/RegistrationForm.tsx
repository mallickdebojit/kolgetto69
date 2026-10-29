import React, { useState } from 'react';
import { 
  User, 
  Phone, 
  Users, 
  Utensils, 
  Plane, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  Hotel, 
  IndianRupee, 
  QrCode, 
  AlertCircle, 
  Info, 
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { RegistrationRecord } from '../types';

interface RegistrationFormProps {
  onSuccess: (record: RegistrationRecord) => void;
  onOpenUpiModal: (amount: number) => void;
}

export const RegistrationForm: React.FC<RegistrationFormProps> = ({ 
  onSuccess, 
  onOpenUpiModal 
}) => {
  // Form State
  const [fullName, setFullName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [attendanceType, setAttendanceType] = useState<'single' | 'couple'>('couple');
  const [spouseName, setSpouseName] = useState('');
  const [spouseMobileNumber, setSpouseMobileNumber] = useState('');
  const [mealChoiceSelf, setMealChoiceSelf] = useState<'Veg' | 'Non Veg'>('Non Veg');
  const [mealChoiceSpouse, setMealChoiceSpouse] = useState<'Veg' | 'Non Veg'>('Non Veg');
  
  // Event dates are 29th Jan - 2nd Feb 2026
  const [arrivalDate, setArrivalDate] = useState('2026-01-29');
  const [arrivalTime, setArrivalTime] = useState('12:00');
  const [departureDate, setDepartureDate] = useState('2026-02-02');
  const [departureTime, setDepartureTime] = useState('16:00');
  
  const [travelMode, setTravelMode] = useState<'Flight' | 'Train' | 'Car' | 'Other'>('Flight');
  const [travelDetails, setTravelDetails] = useState('');
  const [preferGolf, setPreferGolf] = useState<'Yes' | 'No'>('No');
  const [roomPreference, setRoomPreference] = useState('');
  const [specialNotes, setSpecialNotes] = useState('');
  const [paymentReference, setPaymentReference] = useState('');
  
  // UI States
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const fee = attendanceType === 'couple' ? 30000 : 15000;

  // Validation
  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!fullName.trim()) newErrors.fullName = 'Full Name is required.';
    if (!mobileNumber.trim()) {
      newErrors.mobileNumber = 'Mobile number is required.';
    } else if (mobileNumber.replace(/\D/g, '').length < 10) {
      newErrors.mobileNumber = 'Please enter a valid 10-digit mobile number.';
    }

    if (attendanceType === 'couple') {
      if (!spouseName.trim()) {
        newErrors.spouseName = 'Spouse name is required for couple registration.';
      }
    }

    if (!arrivalDate) newErrors.arrivalDate = 'Arrival date is required.';
    if (!departureDate) newErrors.departureDate = 'Departure date is required.';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Quick Demo Autofill to test rapidly
  const handleQuickDemo = () => {
    setFullName('Subhashish Roy Chowdhury');
    setMobileNumber('98305 44219');
    setAttendanceType('couple');
    setSpouseName('Madhuchhanda Roy Chowdhury');
    setSpouseMobileNumber('98308 12390');
    setMealChoiceSelf('Non Veg');
    setMealChoiceSpouse('Veg');
    setArrivalDate('2026-01-29');
    setArrivalTime('11:45');
    setDepartureDate('2026-02-02');
    setDepartureTime('18:30');
    setTravelMode('Flight');
    setTravelDetails('Air India AI 773 from Mumbai');
    setPreferGolf('Yes');
    setRoomPreference('Twin bed or quiet wing facing garden');
    setSpecialNotes('Spouse is pure vegetarian (no onion/garlic preferred during puja day).');
    setPaymentReference('UPI/62910488219');
    setErrors({});
    setFormError(null);
  };

  const handleClear = () => {
    setFullName('');
    setMobileNumber('');
    setSpouseName('');
    setSpouseMobileNumber('');
    setTravelDetails('');
    setRoomPreference('');
    setSpecialNotes('');
    setPaymentReference('');
    setErrors({});
    setFormError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!validate()) {
      setFormError('Please review highlighted fields above.');
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        fullName,
        mobileNumber,
        attendanceType,
        spouseName: attendanceType === 'couple' ? spouseName : undefined,
        spouseMobileNumber: attendanceType === 'couple' ? spouseMobileNumber : undefined,
        mealChoiceSelf,
        mealChoiceSpouse: attendanceType === 'couple' ? mealChoiceSpouse : undefined,
        arrivalDate,
        arrivalTime,
        departureDate,
        departureTime,
        travelMode,
        travelDetails,
        preferGolf,
        roomPreference,
        specialNotes,
        paymentReference,
        paymentStatus: paymentReference.trim() ? 'Paid' : 'Pending'
      };

      const res = await fetch('/api/registrations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const result = await res.json();
      if (!res.ok || !result.success) {
        throw new Error(result.message || 'Failed to submit registration');
      }

      onSuccess(result.data);
    } catch (err: any) {
      console.error(err);
      setFormError(err.message || 'Network error: could not connect to server.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Autofill Demo & Notice bar */}
      <div className="flex items-center justify-between text-xs px-1 text-stone-600">
        <span className="flex items-center gap-1">
          <span className="text-orange-600 font-bold">*</span> Indicates required fields
        </span>
        <button
          type="button"
          onClick={handleQuickDemo}
          className="text-orange-700 hover:text-orange-800 font-semibold underline decoration-orange-300 underline-offset-2 flex items-center gap-1 cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5 text-orange-500" />
          Quick Fill Sample
        </button>
      </div>

      {formError && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-[12px] flex items-center gap-2 text-red-700 text-xs font-medium">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
          <span>{formError}</span>
        </div>
      )}

      {/* SECTION 1: Attendee Information */}
      <div className="bg-white border border-orange-200/90 rounded-[12px] p-4 sm:p-5 shadow-[0_2px_12px_-2px_rgba(249,115,22,0.06)]">
        <div className="flex items-center gap-2 mb-3 pb-2 border-b border-orange-100">
          <div className="w-7 h-7 rounded-[8px] bg-orange-100/70 text-orange-700 flex items-center justify-center font-bold text-xs">
            1
          </div>
          <div>
            <h2 className="text-sm font-bold text-stone-900">Personal & Contact Details</h2>
            <p className="text-[11px] text-stone-500">Attendee identification for event pass & hotel check-in</p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Your Full Name <span className="text-orange-600 font-bold">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Anirban Mukherjee"
                  className={`w-full bg-white border ${
                    errors.fullName ? 'border-red-400 focus:border-red-500' : 'border-orange-200 focus:border-orange-500'
                  } rounded-[12px] px-3 py-2 text-xs sm:text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-orange-100 transition-all`}
                />
                <User className="w-4 h-4 text-stone-400 absolute right-3 top-2.5 pointer-events-none" />
              </div>
              {errors.fullName && <p className="text-[11px] text-red-500 mt-0.5">{errors.fullName}</p>}
            </div>

            {/* Mobile / WhatsApp Number */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Mobile / WhatsApp Number <span className="text-orange-600 font-bold">*</span>
              </label>
              <div className="relative">
                <input
                  type="tel"
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                  placeholder="e.g. 98301 24589"
                  className={`w-full bg-white border ${
                    errors.mobileNumber ? 'border-red-400 focus:border-red-500' : 'border-orange-200 focus:border-orange-500'
                  } rounded-[12px] px-3 py-2 text-xs sm:text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-orange-100 transition-all`}
                />
                <Phone className="w-4 h-4 text-stone-400 absolute right-3 top-2.5 pointer-events-none" />
              </div>
              {errors.mobileNumber && <p className="text-[11px] text-red-500 mt-0.5">{errors.mobileNumber}</p>}
            </div>
          </div>

          {/* Attendance Type Selection */}
          <div className="pt-2">
            <label className="block text-xs font-semibold text-stone-700 mb-1.5">
              Participation Plan <span className="text-orange-600 font-bold">*</span>
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => setAttendanceType('couple')}
                className={`p-2.5 rounded-[12px] border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  attendanceType === 'couple'
                    ? 'border-orange-500 bg-orange-50/70 shadow-xs ring-1 ring-orange-500'
                    : 'border-orange-200 bg-white hover:border-orange-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-stone-900 flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-orange-600" />
                    Couple Entry
                  </span>
                  {attendanceType === 'couple' && (
                    <CheckCircle2 className="w-4 h-4 text-orange-600 fill-orange-100" />
                  )}
                </div>
                <div className="mt-1 text-orange-700 font-extrabold text-xs">
                  ₹30,000 <span className="text-[10px] font-normal text-stone-500">(Self + Spouse)</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setAttendanceType('single')}
                className={`p-2.5 rounded-[12px] border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  attendanceType === 'single'
                    ? 'border-orange-500 bg-orange-50/70 shadow-xs ring-1 ring-orange-500'
                    : 'border-orange-200 bg-white hover:border-orange-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-stone-900 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-orange-600" />
                    Single Entry
                  </span>
                  {attendanceType === 'single' && (
                    <CheckCircle2 className="w-4 h-4 text-orange-600 fill-orange-100" />
                  )}
                </div>
                <div className="mt-1 text-orange-700 font-extrabold text-xs">
                  ₹15,000 <span className="text-[10px] font-normal text-stone-500">(Individual)</span>
                </div>
              </button>
            </div>
          </div>

          {/* Conditional Spouse Details (Only if Couple) */}
          {attendanceType === 'couple' && (
            <div className="p-3 bg-orange-50/40 rounded-[12px] border border-orange-200/80 space-y-2.5 animate-fadeIn">
              <div className="text-[11px] font-bold text-orange-900 flex items-center gap-1">
                <Users className="w-3 h-3 text-orange-600" />
                Spouse / Companion Information
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Spouse Full Name <span className="text-orange-600 font-bold">*</span>
                  </label>
                  <input
                    type="text"
                    value={spouseName}
                    onChange={(e) => setSpouseName(e.target.value)}
                    placeholder="e.g. Sreemoyee Mukherjee"
                    className={`w-full bg-white border ${
                      errors.spouseName ? 'border-red-400' : 'border-orange-200 focus:border-orange-500'
                    } rounded-[12px] px-3 py-1.5 text-xs sm:text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-orange-100 transition-all`}
                  />
                  {errors.spouseName && <p className="text-[11px] text-red-500 mt-0.5">{errors.spouseName}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Spouse Mobile Number <span className="text-stone-400 font-normal">(Optional)</span>
                  </label>
                  <input
                    type="tel"
                    value={spouseMobileNumber}
                    onChange={(e) => setSpouseMobileNumber(e.target.value)}
                    placeholder="e.g. 98302 99412"
                    className="w-full bg-white border border-orange-200 focus:border-orange-500 rounded-[12px] px-3 py-1.5 text-xs sm:text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-orange-100 transition-all"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* SECTION 2: Meal Choice */}
      <div className="bg-white border border-orange-200/90 rounded-[12px] p-4 sm:p-5 shadow-[0_2px_12px_-2px_rgba(249,115,22,0.06)]">
        <div className="flex items-center gap-2 mb-3 pb-2 border-b border-orange-100">
          <div className="w-7 h-7 rounded-[8px] bg-orange-100/70 text-orange-700 flex items-center justify-center font-bold text-xs">
            2
          </div>
          <div>
            <h2 className="text-sm font-bold text-stone-900">Food & Meal Preferences</h2>
            <p className="text-[11px] text-stone-500">Traditional Bengali cuisine, buffet banquets & special dietary</p>
          </div>
        </div>

        <div className="space-y-3">
          {/* Self Meal Choice */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1.5">
              Meal Choice (Self) <span className="text-orange-600 font-bold">*</span>
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              <label className={`flex items-center gap-2.5 p-2 rounded-[12px] border cursor-pointer transition-all ${
                mealChoiceSelf === 'Veg' ? 'border-orange-500 bg-orange-50/60 ring-1 ring-orange-500' : 'border-orange-200 bg-white hover:border-orange-300'
              }`}>
                <input
                  type="radio"
                  name="mealChoiceSelf"
                  value="Veg"
                  checked={mealChoiceSelf === 'Veg'}
                  onChange={() => setMealChoiceSelf('Veg')}
                  className="w-3.5 h-3.5 text-orange-600 focus:ring-orange-500"
                />
                <span className="text-xs font-semibold text-emerald-800 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-600 inline-block"></span>
                  Vegetarian
                </span>
              </label>

              <label className={`flex items-center gap-2.5 p-2 rounded-[12px] border cursor-pointer transition-all ${
                mealChoiceSelf === 'Non Veg' ? 'border-orange-500 bg-orange-50/60 ring-1 ring-orange-500' : 'border-orange-200 bg-white hover:border-orange-300'
              }`}>
                <input
                  type="radio"
                  name="mealChoiceSelf"
                  value="Non Veg"
                  checked={mealChoiceSelf === 'Non Veg'}
                  onChange={() => setMealChoiceSelf('Non Veg')}
                  className="w-3.5 h-3.5 text-orange-600 focus:ring-orange-500"
                />
                <span className="text-xs font-semibold text-red-800 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-red-600 inline-block"></span>
                  Non-Vegetarian
                </span>
              </label>
            </div>
          </div>

          {/* Spouse Meal Choice (If Couple) */}
          {attendanceType === 'couple' && (
            <div className="pt-1">
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                Meal Choice (Spouse / Partner) <span className="text-orange-600 font-bold">*</span>
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                <label className={`flex items-center gap-2.5 p-2 rounded-[12px] border cursor-pointer transition-all ${
                  mealChoiceSpouse === 'Veg' ? 'border-orange-500 bg-orange-50/60 ring-1 ring-orange-500' : 'border-orange-200 bg-white hover:border-orange-300'
                }`}>
                  <input
                    type="radio"
                    name="mealChoiceSpouse"
                    value="Veg"
                    checked={mealChoiceSpouse === 'Veg'}
                    onChange={() => setMealChoiceSpouse('Veg')}
                    className="w-3.5 h-3.5 text-orange-600 focus:ring-orange-500"
                  />
                  <span className="text-xs font-semibold text-emerald-800 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-600 inline-block"></span>
                    Vegetarian
                  </span>
                </label>

                <label className={`flex items-center gap-2.5 p-2 rounded-[12px] border cursor-pointer transition-all ${
                  mealChoiceSpouse === 'Non Veg' ? 'border-orange-500 bg-orange-50/60 ring-1 ring-orange-500' : 'border-orange-200 bg-white hover:border-orange-300'
                }`}>
                  <input
                    type="radio"
                    name="mealChoiceSpouse"
                    value="Non Veg"
                    checked={mealChoiceSpouse === 'Non Veg'}
                    onChange={() => setMealChoiceSpouse('Non Veg')}
                    className="w-3.5 h-3.5 text-orange-600 focus:ring-orange-500"
                  />
                  <span className="text-xs font-semibold text-red-800 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-red-600 inline-block"></span>
                    Non-Vegetarian
                  </span>
                </label>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* SECTION 3: Travel Schedule & Transit Details */}
      <div className="bg-white border border-orange-200/90 rounded-[12px] p-4 sm:p-5 shadow-[0_2px_12px_-2px_rgba(249,115,22,0.06)]">
        <div className="flex items-center gap-2 mb-3 pb-2 border-b border-orange-100">
          <div className="w-7 h-7 rounded-[8px] bg-orange-100/70 text-orange-700 flex items-center justify-center font-bold text-xs">
            3
          </div>
          <div>
            <h2 className="text-sm font-bold text-stone-900">Arrival & Departure Logistics</h2>
            <p className="text-[11px] text-stone-500">Helps event team coordinate Kolkata airport / railway pickups</p>
          </div>
        </div>

        <div className="space-y-3">
          {/* Arrival Date & Time */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Arrival Date <span className="text-orange-600 font-bold">*</span>
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={arrivalDate}
                  onChange={(e) => setArrivalDate(e.target.value)}
                  className="w-full bg-white border border-orange-200 focus:border-orange-500 rounded-[12px] px-3 py-1.5 text-xs sm:text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-orange-100"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Expected Arrival Time <span className="text-orange-600 font-bold">*</span>
              </label>
              <div className="relative">
                <input
                  type="time"
                  value={arrivalTime}
                  onChange={(e) => setArrivalTime(e.target.value)}
                  className="w-full bg-white border border-orange-200 focus:border-orange-500 rounded-[12px] px-3 py-1.5 text-xs sm:text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-orange-100"
                />
              </div>
            </div>
          </div>

          {/* Departure Date & Time */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Departure Date <span className="text-orange-600 font-bold">*</span>
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={departureDate}
                  onChange={(e) => setDepartureDate(e.target.value)}
                  className="w-full bg-white border border-orange-200 focus:border-orange-500 rounded-[12px] px-3 py-1.5 text-xs sm:text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-orange-100"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Expected Departure Time <span className="text-orange-600 font-bold">*</span>
              </label>
              <div className="relative">
                <input
                  type="time"
                  value={departureTime}
                  onChange={(e) => setDepartureTime(e.target.value)}
                  className="w-full bg-white border border-orange-200 focus:border-orange-500 rounded-[12px] px-3 py-1.5 text-xs sm:text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-orange-100"
                />
              </div>
            </div>
          </div>

          {/* Mode of Travel */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Mode of Travel <span className="text-orange-600 font-bold">*</span>
              </label>
              <select
                value={travelMode}
                onChange={(e) => setTravelMode(e.target.value as any)}
                className="w-full bg-white border border-orange-200 focus:border-orange-500 rounded-[12px] px-3 py-2 text-xs sm:text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-orange-100"
              >
                <option value="Flight">Flight (CCU Kolkata Airport)</option>
                <option value="Train">Train (Howrah / Sealdah / Shalimar)</option>
                <option value="Car">Personal / Hired Car</option>
                <option value="Other">Local Resident / Other</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Air / Train / Car Details
              </label>
              <input
                type="text"
                value={travelDetails}
                onChange={(e) => setTravelDetails(e.target.value)}
                placeholder="e.g. Flight 6E-204 / Train 12301"
                className="w-full bg-white border border-orange-200 focus:border-orange-500 rounded-[12px] px-3 py-2 text-xs sm:text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-orange-100"
              />
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 4: Activities, Room & Stay */}
      <div className="bg-white border border-orange-200/90 rounded-[12px] p-4 sm:p-5 shadow-[0_2px_12px_-2px_rgba(249,115,22,0.06)]">
        <div className="flex items-center gap-2 mb-3 pb-2 border-b border-orange-100">
          <div className="w-7 h-7 rounded-[8px] bg-orange-100/70 text-orange-700 flex items-center justify-center font-bold text-xs">
            4
          </div>
          <div>
            <h2 className="text-sm font-bold text-stone-900">Leisure, Golf & Stay Preferences</h2>
            <p className="text-[11px] text-stone-500">Royal Calcutta Golf Club session & room arrangement requests</p>
          </div>
        </div>

        <div className="space-y-3">
          {/* Prefer Playing Golf */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1.5">
              Prefer Playing Golf? <span className="text-orange-600 font-bold">*</span>
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              <label className={`flex items-center gap-2 p-2 rounded-[12px] border cursor-pointer transition-all ${
                preferGolf === 'Yes' ? 'border-orange-500 bg-orange-50/60 ring-1 ring-orange-500' : 'border-orange-200 bg-white hover:border-orange-300'
              }`}>
                <input
                  type="radio"
                  name="preferGolf"
                  value="Yes"
                  checked={preferGolf === 'Yes'}
                  onChange={() => setPreferGolf('Yes')}
                  className="w-3.5 h-3.5 text-orange-600 focus:ring-orange-500"
                />
                <span className="text-xs font-semibold text-stone-800">⛳ Yes, count me in</span>
              </label>

              <label className={`flex items-center gap-2 p-2 rounded-[12px] border cursor-pointer transition-all ${
                preferGolf === 'No' ? 'border-orange-500 bg-orange-50/60 ring-1 ring-orange-500' : 'border-orange-200 bg-white hover:border-orange-300'
              }`}>
                <input
                  type="radio"
                  name="preferGolf"
                  value="No"
                  checked={preferGolf === 'No'}
                  onChange={() => setPreferGolf('No')}
                  className="w-3.5 h-3.5 text-orange-600 focus:ring-orange-500"
                />
                <span className="text-xs font-semibold text-stone-800">No, prefer city tours / socializing</span>
              </label>
            </div>
          </div>

          {/* Participant Room Preference (Clever fix for Question 8 from the Google Form!) */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Guest Room Preference / Requests
            </label>
            <input
              type="text"
              value={roomPreference}
              onChange={(e) => setRoomPreference(e.target.value)}
              placeholder="e.g. King Bed, non-smoking, low floor for mobility"
              className="w-full bg-white border border-orange-200 focus:border-orange-500 rounded-[12px] px-3 py-2 text-xs sm:text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-orange-100"
            />
            <p className="text-[10px] text-stone-500 mt-1 flex items-center gap-1">
              <Info className="w-3 h-3 text-orange-500 shrink-0" />
              <span>Exact room number is officially assigned by the Organizing Committee upon hotel check-in.</span>
            </p>
          </div>

          {/* Special notes */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Special Notes / Dietary Requirements <span className="text-stone-400 font-normal">(Optional)</span>
            </label>
            <textarea
              rows={2}
              value={specialNotes}
              onChange={(e) => setSpecialNotes(e.target.value)}
              placeholder="Any medical considerations, anniversary milestones, or batch song requests..."
              className="w-full bg-white border border-orange-200 focus:border-orange-500 rounded-[12px] px-3 py-2 text-xs sm:text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-orange-100 resize-none"
            />
          </div>
        </div>
      </div>

      {/* SECTION 5: Contribution Summary & Payment */}
      <div className="bg-gradient-to-br from-orange-500/10 via-amber-500/5 to-white border border-orange-200 rounded-[12px] p-4 sm:p-5">
        <div className="flex items-center justify-between flex-wrap gap-2 mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-orange-600 text-white flex items-center justify-center font-bold">
              ₹
            </div>
            <div>
              <div className="text-xs font-semibold text-stone-600">Event Participation Contribution</div>
              <div className="text-lg font-black text-orange-800">
                ₹{fee.toLocaleString('en-IN')}{' '}
                <span className="text-xs font-medium text-stone-500">
                  ({attendanceType === 'couple' ? 'Couple Package' : 'Single Package'})
                </span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onOpenUpiModal(fee)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-orange-300 rounded-[10px] text-xs font-semibold text-orange-800 hover:bg-orange-50 transition-all cursor-pointer shadow-xs"
          >
            <QrCode className="w-3.5 h-3.5 text-orange-600" />
            <span>Show Bank / UPI Details</span>
          </button>
        </div>

        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-1">
            Payment UTR / UPI Transaction Reference <span className="text-stone-400 font-normal">(Can submit now or share via WhatsApp)</span>
          </label>
          <input
            type="text"
            value={paymentReference}
            onChange={(e) => setPaymentReference(e.target.value)}
            placeholder="e.g. UPI/62910488219 or HDFC Ref 998231"
            className="w-full bg-white border border-orange-200 focus:border-orange-500 rounded-[12px] px-3 py-2 text-xs sm:text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-orange-100"
          />
        </div>
      </div>

      {/* Action Buttons: Submit & Reset */}
      <div className="pt-2 flex items-center gap-3">
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 py-3 px-6 text-sm font-bold text-white bg-gradient-to-r from-orange-500 via-orange-600 to-red-600 hover:from-orange-600 hover:via-red-600 hover:to-red-700 active:scale-[0.99] rounded-[12px] shadow-md hover:shadow-lg transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              <span>Submitting Registration...</span>
            </>
          ) : (
            <>
              <span>Submit Registration</span>
              <span className="text-xs font-normal opacity-90">• ₹{fee.toLocaleString('en-IN')}</span>
            </>
          )}
        </button>

        <button
          type="button"
          onClick={handleClear}
          title="Clear form fields"
          className="p-3 bg-white border border-orange-200 hover:bg-orange-50 text-stone-600 hover:text-stone-900 rounded-[12px] transition-all cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      <p className="text-[11px] text-center text-stone-500 pt-1">
        Data is saved directly to the event registry in JSON format. No Google account login required.
      </p>
    </form>
  );
};
