/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { KolkataHeader } from './components/KolkataHeader';
import { RegistrationForm } from './components/RegistrationForm';
import { SubmissionSuccess } from './components/SubmissionSuccess';
import { OrganizerPanel } from './components/OrganizerPanel';
import { UsabilityAnalysisModal } from './components/UsabilityAnalysisModal';
import { UpiPaymentModal } from './components/UpiPaymentModal';
import { WhatsAppShareModal } from './components/WhatsAppShareModal';
import { RegistrationRecord } from './types';
import { Lock, ShieldCheck, Sparkles, MessageCircle } from 'lucide-react';

export default function App() {
  // Check if current URL is organizer route (/organizer, ?view=organizer, or #organizer)
  const isInitialOrganizer = 
    typeof window !== 'undefined' && 
    (window.location.pathname.includes('/organizer') || 
     window.location.pathname.includes('/admin') ||
     window.location.search.includes('view=organizer') ||
     window.location.hash.includes('organizer'));

  const [isOrganizerMode, setIsOrganizerMode] = useState<boolean>(isInitialOrganizer);
  const [submittedRecord, setSubmittedRecord] = useState<RegistrationRecord | null>(null);
  const [recordCount, setRecordCount] = useState<number>(0);
  
  // Modals
  const [isAnalysisOpen, setIsAnalysisOpen] = useState(false);
  const [isUpiModalOpen, setIsUpiModalOpen] = useState(false);
  const [isWhatsAppModalOpen, setIsWhatsAppModalOpen] = useState(false);
  const [upiAmount, setUpiAmount] = useState(30000);

  // Sync route on popstate (browser back/forward)
  useEffect(() => {
    const handleLocationChange = () => {
      const isOrg = 
        window.location.pathname.includes('/organizer') || 
        window.location.pathname.includes('/admin') ||
        window.location.search.includes('view=organizer') ||
        window.location.hash.includes('organizer');
      setIsOrganizerMode(isOrg);
    };

    window.addEventListener('popstate', handleLocationChange);
    return () => window.removeEventListener('popstate', handleLocationChange);
  }, []);

  const fetchRecordCount = async () => {
    try {
      const res = await fetch('/api/registrations');
      const data = await res.json();
      if (data.success) {
        setRecordCount(data.count || 0);
      }
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    fetchRecordCount();
  }, []);

  const switchToOrganizer = () => {
    setIsOrganizerMode(true);
    setSubmittedRecord(null);
    window.history.pushState({}, '', '/organizer');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const switchToParticipant = () => {
    setIsOrganizerMode(false);
    setSubmittedRecord(null);
    window.history.pushState({}, '', '/');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRegistrationSuccess = (record: RegistrationRecord) => {
    setSubmittedRecord(record);
    fetchRecordCount();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleResetForm = () => {
    setSubmittedRecord(null);
  };

  const handleOpenUpi = (amount: number) => {
    setUpiAmount(amount);
    setIsUpiModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#FFF9F5] text-stone-900 flex flex-col selection:bg-orange-200 selection:text-orange-900">
      {/* Dynamic Header */}
      <KolkataHeader
        isOrganizerMode={isOrganizerMode}
        onSwitchToOrganizer={switchToOrganizer}
        onSwitchToParticipant={switchToParticipant}
        onOpenAnalysis={() => setIsAnalysisOpen(true)}
        onOpenWhatsAppModal={() => setIsWhatsAppModalOpen(true)}
        recordCount={recordCount}
      />

      {/* Main Container */}
      <main className="flex-1 w-full max-w-xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
        {!isOrganizerMode ? (
          submittedRecord ? (
            <SubmissionSuccess
              record={submittedRecord}
              onReset={handleResetForm}
            />
          ) : (
            <RegistrationForm
              onSuccess={handleRegistrationSuccess}
              onOpenUpiModal={handleOpenUpi}
            />
          )
        ) : (
          <OrganizerPanel
            onBackToForm={switchToParticipant}
            onOpenWhatsAppModal={() => setIsWhatsAppModalOpen(true)}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-orange-200/60 bg-orange-100/30 py-5 px-4 text-center text-xs text-stone-500">
        <div className="max-w-xl mx-auto space-y-2">
          <div className="flex items-center justify-center gap-1.5 text-orange-950 font-semibold text-xs">
            <span>Kol Getto SSC 69 Reunion</span>
            <span>•</span>
            <span>29th Jan – 2nd Feb 2026</span>
            <span>•</span>
            <span>Kolkata</span>
          </div>

          {!isOrganizerMode ? (
            /* Discrete Organizer entry link at footer for organizers only */
            <div className="pt-1 flex items-center justify-center gap-1 text-[11px] text-stone-400">
              <button
                onClick={switchToOrganizer}
                className="hover:text-orange-700 transition-colors flex items-center gap-1 cursor-pointer"
              >
                <Lock className="w-3 h-3 text-stone-400" />
                <span>Organizing Committee Portal</span>
              </button>
            </div>
          ) : (
            /* Organizer footer controls */
            <div className="pt-1 flex items-center justify-center gap-3 text-[11px] text-stone-600 flex-wrap">
              <button
                onClick={() => setIsWhatsAppModalOpen(true)}
                className="text-emerald-700 hover:underline flex items-center gap-1 cursor-pointer font-semibold"
              >
                <MessageCircle className="w-3 h-3 text-emerald-600" />
                <span>WhatsApp Guest Invite Link</span>
              </button>
              <span>•</span>
              <a
                href="/api/export/excel"
                download
                className="text-orange-700 hover:underline cursor-pointer font-semibold"
              >
                Download Excel (.xlsx)
              </a>
              <span>•</span>
              <button
                onClick={switchToParticipant}
                className="hover:text-stone-900 underline cursor-pointer"
              >
                Participant View
              </button>
            </div>
          )}

          <p className="text-[10px] text-stone-400 pt-1">
            Data saved instantly to server JSON • Zero login needed • Compact mobile layout
          </p>
        </div>
      </footer>

      {/* Modals */}
      <WhatsAppShareModal
        isOpen={isWhatsAppModalOpen}
        onClose={() => setIsWhatsAppModalOpen(false)}
      />

      <UsabilityAnalysisModal
        isOpen={isAnalysisOpen}
        onClose={() => setIsAnalysisOpen(false)}
      />

      <UpiPaymentModal
        isOpen={isUpiModalOpen}
        onClose={() => setIsUpiModalOpen(false)}
        amount={upiAmount}
      />
    </div>
  );
}
