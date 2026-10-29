import React from 'react';
import { Calendar, Users, FileSpreadsheet, Eye, Sparkles, MessageCircle, ArrowLeft, Shield } from 'lucide-react';

interface KolkataHeaderProps {
  isOrganizerMode: boolean;
  onSwitchToOrganizer: () => void;
  onSwitchToParticipant: () => void;
  onOpenAnalysis: () => void;
  onOpenWhatsAppModal: () => void;
  recordCount: number;
}

export const KolkataHeader: React.FC<KolkataHeaderProps> = ({
  isOrganizerMode,
  onSwitchToOrganizer,
  onSwitchToParticipant,
  onOpenAnalysis,
  onOpenWhatsAppModal,
  recordCount
}) => {
  return (
    <header className="relative overflow-hidden bg-gradient-to-b from-orange-100/70 via-orange-50/50 to-[#FFF9F5] border-b border-orange-200/60 pt-4 pb-5 px-4 sm:px-6">
      {/* Decorative Traditional Alpona / Motif background SVG */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <svg className="w-full h-full" viewBox="0 0 1200 240" fill="none" preserveAspectRatio="none">
          <pattern id="alpona-dots" width="40" height="40" patternUnits="userSpaceOnUse">
            <circle cx="20" cy="20" r="1.5" fill="#EA580C" opacity="0.4" />
            <path d="M0 20 Q10 10 20 20 T40 20" stroke="#F97316" strokeWidth="0.5" fill="none" opacity="0.3" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#alpona-dots)" />
        </svg>
      </div>

      {/* Kolkata Skyline Silhouette (Howrah Bridge & Victoria Memorial Dome) */}
      <div className="absolute right-0 bottom-0 pointer-events-none opacity-25 hidden md:block w-96 h-28">
        <svg viewBox="0 0 500 140" fill="none" className="w-full h-full">
          <path d="M40 130 L110 30 L180 130 Z" stroke="#C2410C" strokeWidth="2.5" fill="none" />
          <path d="M60 130 L110 30 L160 130" stroke="#EA580C" strokeWidth="1.2" />
          <path d="M110 30 L110 130" stroke="#C2410C" strokeWidth="2" />
          <path d="M20 130 L380 130" stroke="#C2410C" strokeWidth="3" />
          <path d="M180 130 L250 30 L320 130 Z" stroke="#C2410C" strokeWidth="2.5" fill="none" />
          <path d="M200 130 L250 30 L300 130" stroke="#EA580C" strokeWidth="1.2" />
          <path d="M250 30 L250 130" stroke="#C2410C" strokeWidth="2" />
          <path d="M110 30 L250 30" stroke="#C2410C" strokeWidth="2.5" />
          <line x1="85" y1="65" x2="85" y2="130" stroke="#F97316" strokeWidth="1" />
          <line x1="135" y1="65" x2="135" y2="130" stroke="#F97316" strokeWidth="1" />
          <line x1="225" y1="65" x2="225" y2="130" stroke="#F97316" strokeWidth="1" />
          <line x1="275" y1="65" x2="275" y2="130" stroke="#F97316" strokeWidth="1" />
          <path d="M370 130 L370 110 C370 85 430 85 430 110 L430 130 Z" fill="#FDBA74" opacity="0.6" />
          <ellipse cx="400" cy="85" rx="26" ry="18" fill="#FDBA74" opacity="0.8" />
          <line x1="400" y1="67" x2="400" y2="55" stroke="#EA580C" strokeWidth="2" />
          <circle cx="400" cy="54" r="3" fill="#EA580C" />
        </svg>
      </div>

      <div className="max-w-2xl mx-auto relative z-10">
        {/* CASE 1: PARTICIPANT VIEW (Clean, no admin noise, perfect to share on WhatsApp) */}
        {!isOrganizerMode ? (
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-orange-200/60 text-orange-800 text-[11px] font-semibold tracking-wide uppercase">
                <Sparkles className="w-3 h-3 text-orange-600" />
                Kolkata Reunion 2026 • SSC 69 Batch
              </div>
            </div>

            <div className="text-left">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight leading-tight">
                Kol Getto SSC 69 Registration
              </h1>
              <div className="text-xs sm:text-sm text-stone-600 mt-1.5 space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="inline-flex items-center gap-1 text-orange-700 font-semibold">
                    <Calendar className="w-3.5 h-3.5" />
                    29th January – 2nd February
                  </span>
                  <span className="text-stone-300">•</span>
                  <span className="text-stone-700">
                    Contribution: <strong className="text-orange-700 font-semibold">₹30,000</strong> (Couple) / <strong className="text-orange-700 font-semibold">₹15,000</strong> (Single)
                  </span>
                </div>
                <p className="text-[11px] text-stone-500">
                  Please fill out your participation and travel details below.
                </p>
              </div>
            </div>
          </div>
        ) : (
          /* CASE 2: ORGANIZER VIEW (Full coordination tools & WhatsApp sharing) */
          <div>
            <div className="flex items-center justify-between mb-3 text-xs">
              <div className="flex items-center gap-1.5 text-orange-900 font-bold">
                <Shield className="w-3.5 h-3.5 text-orange-600" />
                <span>Organizer Administration Portal</span>
                <span className="px-1.5 py-0.5 bg-orange-200 text-orange-800 rounded text-[10px] font-semibold">
                  {recordCount} Records
                </span>
              </div>

              <button
                onClick={onSwitchToParticipant}
                className="inline-flex items-center gap-1 text-xs font-semibold text-orange-700 hover:text-orange-900 hover:underline cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>View Participant Form</span>
              </button>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight">
                  Organizing Committee Console
                </h1>
                <p className="text-xs text-stone-500 mt-0.5">
                  Guest list, room allotment, live catering headcount & direct Excel report.
                </p>
              </div>

              {/* Organizer Quick Actions */}
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={onOpenWhatsAppModal}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#25D366] hover:bg-[#20ba5a] text-white text-xs font-bold rounded-[10px] transition-all shadow-xs cursor-pointer"
                >
                  <MessageCircle className="w-3.5 h-3.5 fill-white" />
                  <span>Share on WhatsApp</span>
                </button>

                <a
                  href="/api/export/excel"
                  download
                  className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-[10px] transition-all shadow-xs cursor-pointer"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5" />
                  <span>Excel (.xlsx)</span>
                </a>

                <button
                  onClick={onOpenAnalysis}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 text-stone-700 bg-white border border-stone-200 hover:bg-stone-50 rounded-[10px] text-xs font-medium cursor-pointer"
                  title="View UI Analysis comparison with screenshot"
                >
                  <Eye className="w-3.5 h-3.5 text-stone-500" />
                  <span>Audit</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
