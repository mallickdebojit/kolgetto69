import React, { useState } from 'react';
import { X, Check, Copy, QrCode, IndianRupee, ShieldCheck } from 'lucide-react';

interface UpiPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
}

export const UpiPaymentModal: React.FC<UpiPaymentModalProps> = ({ isOpen, onClose, amount }) => {
  const [copiedUpi, setCopiedUpi] = useState(false);
  const upiId = 'kolgetto69@okhdfcbank';

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(upiId);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white border border-orange-200 rounded-[14px] w-full max-w-sm flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-4 py-3 bg-gradient-to-r from-orange-50 to-amber-50 border-b border-orange-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <QrCode className="w-4 h-4 text-orange-600" />
            <h3 className="text-sm font-bold text-stone-900">Participation Contribution</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-stone-400 hover:text-stone-700 rounded-full cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-5 text-center space-y-3.5">
          <div className="text-xs text-stone-500">Pay directly via any UPI app or Net Banking</div>

          {/* Amount Badge */}
          <div className="p-2.5 bg-orange-50 border border-orange-200 rounded-[10px]">
            <span className="text-xs text-stone-600 block">Package Amount</span>
            <span className="text-2xl font-black text-orange-800">
              ₹{amount.toLocaleString('en-IN')}
            </span>
          </div>

          {/* Styled QR Code Box */}
          <div className="p-3 bg-white border border-dashed border-orange-300 rounded-[12px] inline-block shadow-xs">
            <svg className="w-36 h-36 mx-auto" viewBox="0 0 120 120" fill="none">
              {/* Outer boundary */}
              <rect width="120" height="120" fill="white" />
              {/* Corner markers */}
              <rect x="10" y="10" width="30" height="30" rx="4" fill="#C2410C" />
              <rect x="15" y="15" width="20" height="20" rx="2" fill="white" />
              <rect x="20" y="20" width="10" height="10" fill="#C2410C" />

              <rect x="80" y="10" width="30" height="30" rx="4" fill="#C2410C" />
              <rect x="85" y="15" width="20" height="20" rx="2" fill="white" />
              <rect x="90" y="20" width="10" height="10" fill="#C2410C" />

              <rect x="10" y="80" width="30" height="30" rx="4" fill="#C2410C" />
              <rect x="15" y="85" width="20" height="20" rx="2" fill="white" />
              <rect x="20" y="90" width="10" height="10" fill="#C2410C" />

              {/* Data pattern elements */}
              <rect x="48" y="14" width="6" height="6" fill="#EA580C" />
              <rect x="58" y="14" width="6" height="6" fill="#C2410C" />
              <rect x="68" y="14" width="6" height="6" fill="#EA580C" />

              <rect x="48" y="26" width="12" height="6" fill="#C2410C" />
              <rect x="66" y="26" width="6" height="12" fill="#EA580C" />

              <rect x="14" y="48" width="8" height="8" fill="#C2410C" />
              <rect x="26" y="48" width="6" height="14" fill="#EA580C" />
              <rect x="36" y="48" width="14" height="6" fill="#C2410C" />

              <rect x="54" y="48" width="12" height="12" rx="2" fill="#C2410C" />
              <rect x="70" y="48" width="8" height="6" fill="#EA580C" />
              <rect x="82" y="48" width="14" height="6" fill="#C2410C" />
              <rect x="100" y="48" width="8" height="8" fill="#EA580C" />

              <rect x="48" y="66" width="8" height="8" fill="#EA580C" />
              <rect x="62" y="66" width="14" height="6" fill="#C2410C" />
              <rect x="82" y="62" width="6" height="14" fill="#EA580C" />
              <rect x="94" y="62" width="14" height="6" fill="#C2410C" />

              <rect x="48" y="82" width="14" height="6" fill="#C2410C" />
              <rect x="68" y="82" width="6" height="14" fill="#EA580C" />
              <rect x="80" y="82" width="14" height="6" fill="#C2410C" />
              <rect x="100" y="82" width="8" height="14" fill="#EA580C" />

              <rect x="48" y="98" width="8" height="8" fill="#EA580C" />
              <rect x="62" y="98" width="14" height="8" fill="#C2410C" />
              <rect x="82" y="98" width="8" height="8" fill="#EA580C" />
            </svg>
            <div className="text-[10px] font-semibold text-orange-900 mt-1">
              Scan with GPay / PhonePe / Paytm
            </div>
          </div>

          {/* Copyable UPI ID */}
          <div className="flex items-center justify-between p-2 bg-stone-50 border border-stone-200 rounded-[10px] text-xs">
            <span className="font-mono text-stone-800 font-semibold">{upiId}</span>
            <button
              onClick={handleCopy}
              className="px-2.5 py-1 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-[6px] text-[11px] transition-all flex items-center gap-1 cursor-pointer"
            >
              {copiedUpi ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
              <span>{copiedUpi ? 'Copied' : 'Copy'}</span>
            </button>
          </div>

          {/* Bank Account Details */}
          <div className="text-left text-[11px] p-2.5 bg-orange-50/50 rounded-[10px] border border-orange-100 space-y-1 text-stone-600">
            <div className="font-bold text-stone-900">Bank Transfer (NEFT/IMPS)</div>
            <div>Account: <span className="font-semibold text-stone-800">Kol Getto SSC 69 Reunion</span></div>
            <div>Bank: <span className="font-semibold text-stone-800">HDFC Bank, Park Street Kolkata</span></div>
            <div>A/C No: <span className="font-mono font-semibold text-stone-800">50200084920194</span></div>
            <div>IFSC: <span className="font-mono font-semibold text-stone-800">HDFC0000014</span></div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-4 py-2.5 bg-stone-50 border-t border-orange-100 flex items-center justify-between text-[11px] text-stone-500">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            Verified Alumni Account
          </span>
          <button
            onClick={onClose}
            className="font-bold text-orange-700 hover:text-orange-900 cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
