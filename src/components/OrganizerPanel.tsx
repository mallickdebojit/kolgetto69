import React, { useState, useEffect } from 'react';
import { 
  FileSpreadsheet, 
  Download, 
  Search, 
  Users, 
  IndianRupee, 
  Utensils, 
  Hotel, 
  RefreshCw, 
  Trash2, 
  Check, 
  Copy, 
  ExternalLink,
  Edit2,
  MessageCircle,
  Share2
} from 'lucide-react';
import { RegistrationRecord, RegistrationStats } from '../types';

interface OrganizerPanelProps {
  onBackToForm: () => void;
  onOpenWhatsAppModal?: () => void;
}

export const OrganizerPanel: React.FC<OrganizerPanelProps> = ({ 
  onBackToForm,
  onOpenWhatsAppModal 
}) => {
  const [records, setRecords] = useState<RegistrationRecord[]>([]);
  const [stats, setStats] = useState<RegistrationStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'couple' | 'single' | 'golf'>('all');
  
  // Editing room allocation inline
  const [editingRoomId, setEditingRoomId] = useState<string | null>(null);
  const [roomInputValue, setRoomInputValue] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);
  const [showJsonRaw, setShowJsonRaw] = useState(false);

  const fetchRecords = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/registrations');
      const data = await res.json();
      if (data.success) {
        setRecords(data.data);
        setStats(data.stats);
      }
    } catch (err) {
      console.error('Failed to fetch registrations:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const handleSaveRoom = async (id: string) => {
    try {
      const res = await fetch(`/api/registrations/${id}/room`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ allocatedRoom: roomInputValue })
      });
      const data = await res.json();
      if (data.success) {
        setRecords(records.map(r => r.id === id ? { ...r, allocatedRoom: roomInputValue } : r));
        setEditingRoomId(null);
      }
    } catch (err) {
      console.error('Failed to update room:', err);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Delete registration for "${name}"?`)) return;
    try {
      const res = await fetch(`/api/registrations/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        fetchRecords();
      }
    } catch (err) {
      console.error('Failed to delete registration:', err);
    }
  };

  const handleCopyExcelLink = () => {
    const fullUrl = `${window.location.origin}/api/export/excel`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  // Filter records
  const filteredRecords = records.filter(r => {
    const term = searchTerm.toLowerCase();
    const matchesSearch = 
      r.fullName.toLowerCase().includes(term) ||
      r.mobileNumber.includes(term) ||
      r.registrationNumber.toLowerCase().includes(term) ||
      (r.spouseName && r.spouseName.toLowerCase().includes(term));

    if (!matchesSearch) return false;

    if (filterType === 'couple') return r.attendanceType === 'couple';
    if (filterType === 'single') return r.attendanceType === 'single';
    if (filterType === 'golf') return r.preferGolf === 'Yes';
    return true;
  });

  return (
    <div className="space-y-4">
      {/* Top Banner & Quick Controls */}
      <div className="bg-white border border-orange-200/90 rounded-[12px] p-4 sm:p-5 shadow-[0_2px_12px_-2px_rgba(249,115,22,0.06)]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-orange-100">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold text-stone-900">
                Organizer Coordination Console
              </h2>
              <span className="px-2 py-0.5 bg-orange-100 text-orange-800 text-[10px] font-bold rounded-full">
                JSON Registry
              </span>
            </div>
            <p className="text-xs text-stone-500 mt-0.5">
              Live registrations, room allocation for hotel check-in, and instant Excel export. No password needed.
            </p>
          </div>

          {/* Excel Export & WhatsApp Buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            {onOpenWhatsAppModal && (
              <button
                onClick={onOpenWhatsAppModal}
                className="inline-flex items-center gap-1.5 px-3 py-2 bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold rounded-[10px] text-xs transition-all shadow-xs cursor-pointer"
                title="Get shareable WhatsApp message with participant registration link"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <span>WhatsApp Guest Link</span>
              </button>
            )}

            <a
              href="/api/export/excel"
              download
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-bold rounded-[10px] text-xs transition-all shadow-xs"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Download Excel (.xlsx)</span>
            </a>

            <button
              onClick={handleCopyExcelLink}
              title="Copy direct Excel download link to share with committee"
              className="inline-flex items-center gap-1 px-2.5 py-2 bg-white border border-orange-200 hover:bg-orange-50 text-stone-700 rounded-[10px] text-xs font-semibold transition-all cursor-pointer"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-stone-500" />}
              <span>{copiedLink ? 'Link Copied!' : 'Copy Link'}</span>
            </button>

            <button
              onClick={fetchRecords}
              className="p-2 bg-white border border-orange-200 hover:bg-orange-50 text-stone-600 rounded-[10px] transition-all cursor-pointer"
              title="Refresh data"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        {stats && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-3 pt-1">
            <div className="p-3 bg-orange-50/60 rounded-[10px] border border-orange-200/60">
              <div className="text-[11px] text-orange-800 font-medium flex items-center justify-between">
                <span>Total Registrations</span>
                <Users className="w-3.5 h-3.5 text-orange-600" />
              </div>
              <div className="text-lg font-black text-stone-900 mt-0.5">
                {stats.totalRegistrations}{' '}
                <span className="text-[11px] font-normal text-stone-500">
                  ({stats.totalGuests} Guests)
                </span>
              </div>
              <div className="text-[10px] text-stone-500 mt-0.5">
                {stats.coupleCount} Couples • {stats.singleCount} Singles
              </div>
            </div>

            <div className="p-3 bg-orange-50/60 rounded-[10px] border border-orange-200/60">
              <div className="text-[11px] text-orange-800 font-medium flex items-center justify-between">
                <span>Total Contribution</span>
                <IndianRupee className="w-3.5 h-3.5 text-orange-600" />
              </div>
              <div className="text-lg font-black text-orange-700 mt-0.5">
                ₹{stats.totalRevenue.toLocaleString('en-IN')}
              </div>
              <div className="text-[10px] text-stone-500 mt-0.5">
                ₹30k couple / ₹15k single
              </div>
            </div>

            <div className="p-3 bg-orange-50/60 rounded-[10px] border border-orange-200/60">
              <div className="text-[11px] text-orange-800 font-medium flex items-center justify-between">
                <span>Meal Catering</span>
                <Utensils className="w-3.5 h-3.5 text-orange-600" />
              </div>
              <div className="text-sm font-bold text-stone-900 mt-1">
                <span className="text-red-700">{stats.nonVegCount} Non-Veg</span> •{' '}
                <span className="text-emerald-700">{stats.vegCount} Veg</span>
              </div>
              <div className="text-[10px] text-stone-500 mt-0.5">
                Total plates per banquet
              </div>
            </div>

            <div className="p-3 bg-orange-50/60 rounded-[10px] border border-orange-200/60">
              <div className="text-[11px] text-orange-800 font-medium flex items-center justify-between">
                <span>Golf Players</span>
                <span className="text-xs">⛳</span>
              </div>
              <div className="text-lg font-black text-stone-900 mt-0.5">
                {stats.golfCount} Players
              </div>
              <div className="text-[10px] text-stone-500 mt-0.5">
                RCGC tee slot reserve
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-orange-200/90 rounded-[12px] p-3 flex flex-col sm:flex-row items-center justify-between gap-2.5">
        <div className="relative w-full sm:w-72">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name, mobile, reg no..."
            className="w-full bg-orange-50/30 border border-orange-200 focus:border-orange-500 rounded-[10px] pl-8 pr-3 py-1.5 text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-orange-200"
          />
          <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-2.5" />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => setFilterType('all')}
            className={`px-2.5 py-1 text-xs font-semibold rounded-[8px] transition-all cursor-pointer whitespace-nowrap ${
              filterType === 'all' ? 'bg-orange-600 text-white' : 'bg-orange-50 text-stone-700 hover:bg-orange-100'
            }`}
          >
            All ({records.length})
          </button>
          <button
            onClick={() => setFilterType('couple')}
            className={`px-2.5 py-1 text-xs font-semibold rounded-[8px] transition-all cursor-pointer whitespace-nowrap ${
              filterType === 'couple' ? 'bg-orange-600 text-white' : 'bg-orange-50 text-stone-700 hover:bg-orange-100'
            }`}
          >
            Couples
          </button>
          <button
            onClick={() => setFilterType('single')}
            className={`px-2.5 py-1 text-xs font-semibold rounded-[8px] transition-all cursor-pointer whitespace-nowrap ${
              filterType === 'single' ? 'bg-orange-600 text-white' : 'bg-orange-50 text-stone-700 hover:bg-orange-100'
            }`}
          >
            Singles
          </button>
          <button
            onClick={() => setFilterType('golf')}
            className={`px-2.5 py-1 text-xs font-semibold rounded-[8px] transition-all cursor-pointer whitespace-nowrap ${
              filterType === 'golf' ? 'bg-orange-600 text-white' : 'bg-orange-50 text-stone-700 hover:bg-orange-100'
            }`}
          >
            Golfers
          </button>
        </div>
      </div>

      {/* Registrations List */}
      <div className="space-y-3">
        {filteredRecords.length === 0 ? (
          <div className="bg-white border border-orange-200 rounded-[12px] p-8 text-center text-stone-500 text-xs">
            No registrations found matching criteria.
          </div>
        ) : (
          filteredRecords.map((r) => (
            <div
              key={r.id}
              className="bg-white border border-orange-200/90 rounded-[12px] p-4 shadow-[0_2px_8px_-2px_rgba(249,115,22,0.05)] transition-all hover:border-orange-300 text-xs space-y-2.5"
            >
              {/* Card Header */}
              <div className="flex items-start justify-between gap-2 flex-wrap pb-2 border-b border-orange-100">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-orange-700 bg-orange-100/70 px-2 py-0.5 rounded-[6px] text-[11px]">
                    {r.registrationNumber}
                  </span>
                  <span className="font-bold text-stone-900 text-sm">{r.fullName}</span>
                  <span className="text-stone-500">({r.mobileNumber})</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                    r.attendanceType === 'couple' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {r.attendanceType === 'couple' ? 'COUPLE • ₹30k' : 'SINGLE • ₹15k'}
                  </span>

                  <button
                    onClick={() => handleDelete(r.id, r.fullName)}
                    className="p-1 text-stone-400 hover:text-red-600 transition-colors cursor-pointer"
                    title="Delete record"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-stone-600">
                {/* Column 1: Companions & Meals */}
                <div>
                  <span className="text-stone-400 block text-[10px] uppercase font-semibold">Attendance & Meal</span>
                  {r.attendanceType === 'couple' ? (
                    <div className="mt-0.5">
                      <div className="font-medium text-stone-800">Spouse: {r.spouseName || 'Not specified'}</div>
                      <div className="text-[11px] text-stone-500">
                        Meals: Self ({r.mealChoiceSelf}) • Spouse ({r.mealChoiceSpouse})
                      </div>
                    </div>
                  ) : (
                    <div className="mt-0.5 font-medium text-stone-800">
                      Single Entry • Meal: {r.mealChoiceSelf}
                    </div>
                  )}
                </div>

                {/* Column 2: Travel Details */}
                <div>
                  <span className="text-stone-400 block text-[10px] uppercase font-semibold">Travel & Logistics</span>
                  <div className="mt-0.5">
                    <div className="font-medium text-stone-800">{r.travelMode} ({r.travelDetails || 'No details'})</div>
                    <div className="text-[11px] text-stone-500">
                      Arr: {r.arrivalDate} {r.arrivalTime} | Dep: {r.departureDate} {r.departureTime}
                    </div>
                  </div>
                </div>

                {/* Column 3: Golf & Room Allotment */}
                <div>
                  <span className="text-stone-400 block text-[10px] uppercase font-semibold">
                    Golf & Room Allotment (Organiser Field)
                  </span>
                  <div className="mt-0.5">
                    <span className="inline-block mr-2 font-medium">Golf: {r.preferGolf}</span>
                    
                    {/* Inline Room Allotment editor */}
                    <div className="mt-1 flex items-center gap-1.5">
                      {editingRoomId === r.id ? (
                        <div className="flex items-center gap-1">
                          <input
                            type="text"
                            value={roomInputValue}
                            onChange={(e) => setRoomInputValue(e.target.value)}
                            placeholder="e.g. Room 402, Taj Bengal"
                            className="bg-white border border-orange-400 rounded-[6px] px-2 py-0.5 text-xs text-stone-900 focus:outline-none w-36"
                          />
                          <button
                            onClick={() => handleSaveRoom(r.id)}
                            className="px-2 py-0.5 bg-orange-600 text-white rounded-[6px] text-xs font-bold hover:bg-orange-700"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingRoomId(null)}
                            className="text-stone-400 hover:text-stone-600 text-xs px-1"
                          >
                            ✕
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-orange-900 bg-orange-50 px-2 py-0.5 rounded border border-orange-200/60">
                            {r.allocatedRoom || 'Unassigned'}
                          </span>
                          <button
                            onClick={() => {
                              setEditingRoomId(r.id);
                              setRoomInputValue(r.allocatedRoom || '');
                            }}
                            className="p-1 text-orange-600 hover:text-orange-800 hover:bg-orange-50 rounded cursor-pointer"
                            title="Assign Room"
                          >
                            <Edit2 className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Preferences or Notes row */}
              {(r.roomPreference || r.specialNotes || r.paymentReference) && (
                <div className="pt-1.5 border-t border-orange-100/70 text-[11px] text-stone-500 flex flex-wrap gap-x-4 gap-y-1">
                  {r.roomPreference && (
                    <span><strong>Guest Request:</strong> {r.roomPreference}</span>
                  )}
                  {r.paymentReference && (
                    <span className="text-emerald-700"><strong>Payment Ref:</strong> {r.paymentReference}</span>
                  )}
                  {r.specialNotes && (
                    <span><strong>Notes:</strong> {r.specialNotes}</span>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Raw JSON viewer toggle for transparency */}
      <div className="pt-2 text-center">
        <button
          onClick={() => setShowJsonRaw(!showJsonRaw)}
          className="text-xs text-orange-700 hover:text-orange-900 underline font-semibold cursor-pointer"
        >
          {showJsonRaw ? 'Hide Raw JSON Storage' : 'View Backend JSON Data File'}
        </button>

        {showJsonRaw && (
          <div className="mt-3 text-left bg-stone-900 text-amber-300 font-mono text-[11px] p-4 rounded-[12px] overflow-x-auto max-h-72">
            <div className="text-stone-400 mb-2 font-sans font-bold text-xs">
              Storage File: <span className="text-stone-200">/data/registrations.json</span> (No external database required)
            </div>
            <pre>{JSON.stringify(records, null, 2)}</pre>
          </div>
        )}
      </div>
    </div>
  );
};
