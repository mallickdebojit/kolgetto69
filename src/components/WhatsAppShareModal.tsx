import React, { useState } from 'react';
import { X, Copy, Check, Share2, MessageCircle, ExternalLink } from 'lucide-react';

interface WhatsAppShareModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WhatsAppShareModal: React.FC<WhatsAppShareModalProps> = ({ isOpen, onClose }) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedMessage, setCopiedMessage] = useState(false);

  if (!isOpen) return null;

  // The participant link is the origin root (without /organizer)
  const participantLink = window.location.origin;

  const whatsappMessage = `*Kol Getto SSC 69 Reunion (29 Jan – 2 Feb 2026)* 🎊

Dear Friends & Batchmates,
Please register your attendance and travel details for our upcoming Kolkata get-together using the link below:

👉 *Register here:* ${participantLink}

*Participation Contribution:*
• ₹30,000 (Couple)
• ₹15,000 (Single)

Please fill in your arrival/departure details so the committee can coordinate airport/railway pickups and banquet meals. Looking forward to meeting everyone in Kolkata!`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(participantLink);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleCopyMessage = () => {
    navigator.clipboard.writeText(whatsappMessage);
    setCopiedMessage(true);
    setTimeout(() => setCopiedMessage(false), 2000);
  };

  const handleOpenWhatsApp = () => {
    const encoded = encodeURIComponent(whatsappMessage);
    window.open(`https://api.whatsapp.com/send?text=${encoded}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white border border-orange-200 rounded-[14px] w-full max-w-md flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-4 py-3 bg-gradient-to-r from-emerald-50 via-teal-50 to-orange-50 border-b border-emerald-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-[8px] bg-emerald-600 text-white flex items-center justify-center">
              <MessageCircle className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-stone-900">Share with Participants on WhatsApp</h3>
              <p className="text-[10px] text-stone-500">Participants will see ONLY the registration form</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-stone-400 hover:text-stone-700 rounded-full cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-5 space-y-4 text-xs">
          {/* Direct Link box */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Participant Registration Link (Clean Guest View)
            </label>
            <div className="flex items-center gap-1.5 p-2 bg-orange-50/50 border border-orange-200 rounded-[10px]">
              <input
                type="text"
                readOnly
                value={participantLink}
                className="bg-transparent text-stone-900 font-mono text-xs w-full focus:outline-none"
              />
              <button
                onClick={handleCopyLink}
                className="px-2.5 py-1 bg-white border border-orange-300 hover:bg-orange-100 text-orange-800 font-bold rounded-[6px] text-[11px] transition-all flex items-center gap-1 cursor-pointer shrink-0"
              >
                {copiedLink ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                <span>{copiedLink ? 'Copied' : 'Copy Link'}</span>
              </button>
            </div>
          </div>

          {/* Formatted WhatsApp Message Preview */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-stone-700">
                Ready-to-Paste WhatsApp Message
              </label>
              <button
                onClick={handleCopyMessage}
                className="text-[11px] font-bold text-orange-700 hover:text-orange-900 flex items-center gap-1 cursor-pointer"
              >
                {copiedMessage ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                <span>{copiedMessage ? 'Message Copied!' : 'Copy Text'}</span>
              </button>
            </div>

            <div className="p-3 bg-stone-50 border border-stone-200 rounded-[10px] text-stone-700 font-sans text-[11px] leading-relaxed whitespace-pre-line max-h-44 overflow-y-auto">
              {whatsappMessage}
            </div>
          </div>

          {/* Action Button: Directly launch WhatsApp */}
          <button
            onClick={handleOpenWhatsApp}
            className="w-full py-2.5 px-4 bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold rounded-[10px] text-xs transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
          >
            <MessageCircle className="w-4 h-4 fill-white" />
            <span>Open WhatsApp & Send to Group</span>
          </button>
        </div>

        {/* Footer */}
        <div className="px-4 py-2.5 bg-stone-50 border-t border-stone-100 text-right">
          <button
            onClick={onClose}
            className="text-xs font-semibold text-stone-600 hover:text-stone-900 cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
