import React from 'react';
import { CheckCircle2, Calendar, Phone, Utensils, Plane, Download, PlusCircle, MessageCircle, MapPin } from 'lucide-react';
import { RegistrationRecord } from '../types';

interface SubmissionSuccessProps {
  record: RegistrationRecord;
  onReset: () => void;
}

export const SubmissionSuccess: React.FC<SubmissionSuccessProps> = ({ record, onReset }) => {
  const shareMessage = `Hey! I've registered for the Kol Getto SSC 69 Reunion (29 Jan - 2 Feb 2026). Here is the registration link: ${window.location.origin}`;

  const handleShare = () => {
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareMessage)}`, '_blank');
  };

  return (
    <div className="bg-white border border-orange-200/90 rounded-[12px] p-5 sm:p-7 shadow-[0_4px_24px_-4px_rgba(249,115,22,0.1)] text-center animate-fadeIn">
      {/* Success Badge */}
      <div className="w-16 h-16 bg-gradient-to-tr from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md shadow-orange-500/20">
        <CheckCircle2 className="w-9 h-9 text-white stroke-[2.2]" />
      </div>

      <div className="inline-block px-3 py-1 bg-orange-100/70 text-orange-800 text-xs font-bold rounded-full mb-2">
        REGISTRATION CONFIRMED • {record.registrationNumber}
      </div>

      <h2 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight">
        Nomoshkar, {record.fullName}!
      </h2>
      <p className="text-xs sm:text-sm text-stone-600 max-w-md mx-auto mt-1">
        Your registration details for <strong>Kol Getto SSC 69</strong> have been successfully recorded. Looking forward to welcoming you to Kolkata!
      </p>

      {/* Digital Receipt Card */}
      <div className="mt-5 text-left bg-orange-50/50 border border-orange-200/80 rounded-[12px] p-4 text-xs space-y-2.5">
        <div className="flex items-center justify-between pb-2 border-b border-orange-200/60 font-semibold text-stone-700">
          <span>Attendee Summary</span>
          <span className="text-orange-700 font-bold">
            {record.attendanceType === 'couple' ? 'Couple (2 Persons)' : 'Single (1 Person)'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-stone-600">
          <div>
            <span className="text-stone-400 block text-[10px] uppercase tracking-wider">Primary Attendee</span>
            <span className="font-semibold text-stone-900">{record.fullName}</span>
            <span className="text-stone-500 block">{record.mobileNumber}</span>
          </div>

          {record.spouseName && (
            <div>
              <span className="text-stone-400 block text-[10px] uppercase tracking-wider">Spouse / Partner</span>
              <span className="font-semibold text-stone-900">{record.spouseName}</span>
              {record.spouseMobileNumber && <span className="text-stone-500 block">{record.spouseMobileNumber}</span>}
            </div>
          )}

          <div>
            <span className="text-stone-400 block text-[10px] uppercase tracking-wider">Dates & Stay</span>
            <span className="font-medium text-stone-900">
              {record.arrivalDate} ({record.arrivalTime}) → {record.departureDate} ({record.departureTime})
            </span>
          </div>

          <div>
            <span className="text-stone-400 block text-[10px] uppercase tracking-wider">Travel & Golf</span>
            <span className="font-medium text-stone-900">
              {record.travelMode} • Golf: {record.preferGolf}
            </span>
          </div>

          <div>
            <span className="text-stone-400 block text-[10px] uppercase tracking-wider">Meals</span>
            <span className="font-medium text-stone-900">
              Self: {record.mealChoiceSelf}
              {record.mealChoiceSpouse ? ` | Spouse: ${record.mealChoiceSpouse}` : ''}
            </span>
          </div>

          <div>
            <span className="text-stone-400 block text-[10px] uppercase tracking-wider">Contribution</span>
            <span className="font-bold text-orange-800 text-sm">
              ₹{record.contributionAmount.toLocaleString('en-IN')}
            </span>
            <span className="text-[10px] text-stone-500 block">
              {record.paymentReference ? `Ref: ${record.paymentReference}` : 'Payment confirmation pending'}
            </span>
          </div>
        </div>

        {record.roomPreference && (
          <div className="pt-2 border-t border-orange-200/50 text-[11px] text-stone-500">
            <strong>Room Preference:</strong> {record.roomPreference}
          </div>
        )}
      </div>

      {/* Action Buttons for participant */}
      <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-2.5">
        <button
          onClick={() => window.print()}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-white border border-orange-300 hover:bg-orange-50 text-orange-800 font-semibold rounded-[12px] text-xs transition-all shadow-xs cursor-pointer"
        >
          <Download className="w-4 h-4 text-orange-600" />
          <span>Save / Print Pass</span>
        </button>

        <button
          onClick={handleShare}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-[#25D366] hover:bg-[#20ba5a] text-white font-semibold rounded-[12px] text-xs transition-all shadow-xs cursor-pointer"
        >
          <MessageCircle className="w-4 h-4 fill-white" />
          <span>Share Link on WhatsApp</span>
        </button>

        <button
          onClick={onReset}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-gradient-to-r from-orange-500 to-red-600 text-white font-semibold rounded-[12px] text-xs transition-all shadow-xs cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Register Another Attendee</span>
        </button>
      </div>
    </div>
  );
};
