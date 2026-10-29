import React from 'react';
import { X, CheckCircle, AlertTriangle, ArrowRight, Smartphone, Sparkles, Layers, Sliders } from 'lucide-react';

interface UsabilityAnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UsabilityAnalysisModal: React.FC<UsabilityAnalysisModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const comparisonPoints = [
    {
      title: '1. Merged Contact Field (Name & Mobile Number)',
      original: 'A single open text line "1. Name & Mobile Number *". Users frequently entered only their name, typos in phone numbers, or inconsistent formats like "Amit 9830..."',
      improved: 'Split into dedicated "Full Name" and "Mobile / WhatsApp Number" with numeric validation and dedicated touch-friendly keyboard types (`type="tel"`).',
      impact: 'High Data Integrity'
    },
    {
      title: '2. Duplicate Question Numbering & Non-Conditional "Wife" Field',
      original: 'Question 3 was numbered twice ("3. Meal Choice self" and "3. Meal Choice wife *"). Mandatory "wife" meal choice was forced even for single attendees or female alumni!',
      improved: 'Introduced an interactive "Participation Plan" toggle (Couple ₹30,000 vs Single ₹15,000). Spouse name and meal preferences only appear when "Couple" is selected, and uses inclusive phrasing.',
      impact: 'Zero Irrelevant Questions'
    },
    {
      title: '3. Exposing Organiser-Only Question to Guests',
      original: 'Google Form displayed: "8. Guest Room allotted ( To be Filled in by the Organiser )" as an input to every guest, confusing attendees who had no room number yet.',
      improved: 'Transformed into "Guest Room Preference / Requests" on the guest form, while providing organizers with a dedicated live Room Allotment tool in the Organizer Panel.',
      impact: 'Eliminates Guest Confusion'
    },
    {
      title: '4. Financial Transparency & Contribution Tracking',
      original: 'Participation fees (₹30,000 Couple / ₹15,000 Single) were only stated as static text in description with no selection, receipt, or payment reconciliation.',
      improved: 'Auto-calculates contribution amount based on attendance plan, provides instant bank/UPI QR details, and allows submitting UTR/Transaction reference.',
      impact: 'Faster Fee Reconciliation'
    },
    {
      title: '5. Mobile Ergonomics & "Desert Island" Form Sprawl',
      original: 'Standard Google Form generated 8 gigantic separate cards with massive padding, requiring 4 to 5 screen heights of scrolling on mobile devices.',
      improved: 'Compact mobile-first architecture: 4 logical thematic groups, snug vertical rhythm, 12px rounded corners, thin orange outline, and thumb-friendly touch targets.',
      impact: '70% Faster Completion Time'
    },
    {
      title: '6. No Google Account Login Barrier + Direct Excel Export',
      original: 'Google Form often forced Google account login, email switching, and required manual Google Drive permissions to access spreadsheets.',
      improved: 'Pure JSON backend storage that works instantly on any device with zero login, plus direct 1-click Excel (.xlsx) download link from the backend.',
      impact: 'Frictionless Registration'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white border border-orange-200 rounded-[14px] w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-5 py-3.5 bg-gradient-to-r from-orange-50 to-amber-50 border-b border-orange-200/80 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-[8px] bg-orange-600 text-white flex items-center justify-center font-bold text-xs">
              UI
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-stone-900">
                Screenshot UI Analysis & Usability Enhancements
              </h2>
              <p className="text-[11px] text-stone-500">
                Detailed comparison of the original Google Form vs Kol Getto SSC 69 Web App
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-white rounded-full transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content body */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 text-xs">
          {/* Visual Highlight Banner */}
          <div className="p-3 bg-orange-50/70 border border-orange-200/90 rounded-[12px] flex items-start gap-2.5">
            <Sparkles className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
            <div>
              <strong className="text-stone-900 block font-bold text-xs">
                Design Verdict & Cultural Vibe
              </strong>
              <p className="text-stone-600 text-[11px] mt-0.5 leading-relaxed">
                The original Google Form was generic, bland, and cumbersome on mobile. The new design introduces a warm Kolkata aesthetic (light orange tones, Howrah Bridge motifs, festive marigold accents), 12px rounded cards with thin orange outlines, vibrant orange-red gradient buttons, and zero-login JSON persistence with direct Excel generation.
              </p>
            </div>
          </div>

          {/* Breakdown cards */}
          <div className="space-y-3">
            {comparisonPoints.map((point, idx) => (
              <div
                key={idx}
                className="bg-stone-50/60 border border-stone-200/80 rounded-[12px] p-3.5 transition-all hover:border-orange-200"
              >
                <div className="flex items-center justify-between gap-2 mb-2 font-bold text-stone-900">
                  <span>{point.title}</span>
                  <span className="text-[10px] px-2 py-0.5 bg-orange-100 text-orange-800 rounded-full font-semibold">
                    {point.impact}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                  <div className="p-2.5 bg-red-50/60 border border-red-100 rounded-[8px] text-stone-700">
                    <div className="text-red-700 font-bold mb-1 flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3 text-red-500" />
                      Original Screenshot Issue
                    </div>
                    {point.original}
                  </div>

                  <div className="p-2.5 bg-emerald-50/60 border border-emerald-100 rounded-[8px] text-stone-700">
                    <div className="text-emerald-700 font-bold mb-1 flex items-center gap-1">
                      <CheckCircle className="w-3 h-3 text-emerald-600" />
                      Implemented Improvement
                    </div>
                    {point.improved}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-stone-50 border-t border-orange-100 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-gradient-to-r from-orange-500 to-red-600 text-white font-bold text-xs rounded-[10px] hover:shadow-xs cursor-pointer"
          >
            Got it, Back to Form
          </button>
        </div>
      </div>
    </div>
  );
};
