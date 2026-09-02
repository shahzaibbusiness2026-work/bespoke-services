'use client';

import React, { useState } from 'react';
import {
  Inbox,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Mail,
  Phone,
  Building,
  User,
  ExternalLink,
  MessageSquare,
  FileText,
  Sparkles,
  ChevronDown,
  Send,
  X,
  Award,
} from 'lucide-react';
import { ConsolidatedInquiry } from '../../services/api';

interface CRMInquiriesTabProps {
  inquiries: ConsolidatedInquiry[];
  isDarkMode: boolean;
  onUpdateStatus: (type: 'contact' | 'bespoke' | 'trade', id: string, newStatus: string) => Promise<void>;
  showToast: (title: string, subtitle?: string, type?: 'info' | 'success') => void;
}

export const CRMInquiriesTab: React.FC<CRMInquiriesTabProps> = ({
  inquiries,
  isDarkMode,
  onUpdateStatus,
  showToast,
}) => {
  const [selectedStage, setSelectedStage] = useState<'all' | 'pending' | 'contacted' | 'resolved'>('all');
  const [selectedType, setSelectedType] = useState<'all' | 'contact' | 'bespoke' | 'trade'>('all');
  const [search, setSearch] = useState('');
  const [activeDossier, setActiveDossier] = useState<ConsolidatedInquiry | null>(null);
  const [replyText, setReplyText] = useState('');
  const [internalNote, setInternalNote] = useState('');
  const [isSendingReply, setIsSendingReply] = useState(false);

  // Filter inquiries
  const filteredInquiries = inquiries.filter((inq) => {
    const matchesStage = selectedStage === 'all' || inq.status.toLowerCase() === selectedStage.toLowerCase();
    const matchesType = selectedType === 'all' || inq.type.toLowerCase() === selectedType.toLowerCase();

    const q = search.toLowerCase().trim();
    const matchesQ =
      !q ||
      inq.sender.toLowerCase().includes(q) ||
      inq.email.toLowerCase().includes(q) ||
      (inq.title && inq.title.toLowerCase().includes(q)) ||
      (inq.details && inq.details.toLowerCase().includes(q));

    return matchesStage && matchesType && matchesQ;
  });

  const handleOpenDossier = (inq: ConsolidatedInquiry) => {
    setActiveDossier(inq);
    setReplyText(
      `Dear ${inq.sender.split(' ')[0]},\n\nThank you for reaching out to the BOSKI LIMITED Private Atelier. We have received your inquiry regarding "${inq.title || 'bespoke textile curation'}".\n\nOur Master Tailor and Concierge Director would be pleased to assist you with material swatches and custom dimensions.\n\nWarm regards,\nBOSKI LIMITED Atelier Concierge\nUnit 4, Balmoral Trading Estate, 113 River Road, Barking, IG11 0EG\nTel: +44 7738 761016`
    );
    setInternalNote('');
  };

  const handleSendReply = () => {
    setIsSendingReply(true);
    setTimeout(async () => {
      if (activeDossier) {
        await onUpdateStatus(activeDossier.type, activeDossier.id, 'contacted');
        showToast('Concierge Dispatch Sent', `Dispatched correspondence to ${activeDossier.email}`, 'success');
      }
      setIsSendingReply(false);
      setActiveDossier(null);
    }, 600);
  };

  const gold = '#C9A227';
  const cardBg = isDarkMode ? 'bg-[#141716] border-[#222624]' : 'bg-white border-[#E6E1D8]';
  const textPrimary = isDarkMode ? 'text-[#F5F1E8]' : 'text-[#171717]';
  const textSecondary = isDarkMode ? 'text-[#A9A39A]' : 'text-[#595652]';

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-inherit">
        <div className="space-y-1">
          <span className="text-[11px] uppercase tracking-[0.25em] font-semibold" style={{ color: gold }}>
            Client Relations &bull; Private Atelier Concierge
          </span>
          <h2
            className={`text-3xl sm:text-4xl font-normal tracking-tight ${textPrimary}`}
            style={{ fontFamily: "'Libre Caslon Text', Georgia, serif" }}
          >
            Customer Inquiries &amp; CRM
          </h2>
          <p className={`text-sm font-light ${textSecondary}`}>
            Manage made-to-measure bespoke consultations, trade accounts, and VIP clientele requests.
          </p>
        </div>
      </div>

      {/* Filter Pipeline Strip */}
      <div className={`p-4 sm:p-5 border space-y-4 ${cardBg}`}>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Stage Filter Buttons */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            {[
              { id: 'all', label: 'All Inquiries' },
              { id: 'pending', label: 'New / Pending' },
              { id: 'contacted', label: 'Contacted' },
              { id: 'resolved', label: 'Converted / Closed' },
            ].map((st) => (
              <button
                key={st.id}
                onClick={() => setSelectedStage(st.id as any)}
                className={`px-3.5 py-2 text-xs uppercase tracking-wider font-semibold rounded-none border transition-colors cursor-pointer shrink-0 ${
                  selectedStage === st.id
                    ? 'bg-[#C9A227] text-black border-[#C9A227] font-bold shadow-sm'
                    : isDarkMode
                    ? 'border-transparent text-[#A9A39A] hover:border-[#2E3330] hover:text-white'
                    : 'border-transparent text-[#595652] hover:border-[#E6E1D8] hover:text-black'
                }`}
              >
                {st.label}
              </button>
            ))}
          </div>

          {/* Search bar */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by client, email, or company..."
              className={`w-full pl-9 pr-4 py-2 text-xs border outline-none rounded-none transition-colors ${
                isDarkMode
                  ? 'bg-[#181B1A] border-[#2E3330] text-[#F5F1E8] focus:border-[#C9A227]'
                  : 'bg-[#FAF8F3] border-[#E6E1D8] text-[#171717] focus:border-black'
              }`}
            />
          </div>
        </div>
      </div>

      {/* Inquiry Cards Grid */}
      {filteredInquiries.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredInquiries.map((inq) => {
            const isTrade = inq.type === 'trade';
            const isBespoke = inq.type === 'bespoke';

            return (
              <div
                key={`${inq.type}-${inq.id}`}
                className={`border p-6 flex flex-col justify-between group transition-all duration-300 hover:border-[#C9A227] ${cardBg}`}
              >
                <div className="space-y-4">
                  {/* Top Header */}
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`px-2.5 py-0.5 text-[9.5px] uppercase font-mono tracking-wider border ${
                        isTrade
                          ? 'border-blue-500/30 bg-blue-500/10 text-blue-400'
                          : isBespoke
                          ? 'border-purple-500/30 bg-purple-500/10 text-purple-400'
                          : 'border-amber-500/30 bg-amber-500/10 text-amber-400'
                      }`}
                    >
                      {inq.type.toUpperCase()}
                    </span>

                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 border ${
                        inq.status === 'resolved'
                          ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30'
                          : inq.status === 'contacted'
                          ? 'bg-blue-500/10 text-blue-400 border-blue-500/30'
                          : 'bg-amber-500/10 text-amber-500 border-amber-500/30'
                      }`}
                    >
                      {inq.status.toUpperCase()}
                    </span>
                  </div>

                  {/* Client Info */}
                  <div>
                    <div className="flex items-center gap-2">
                      <h3
                        className={`text-lg font-normal tracking-tight ${textPrimary}`}
                        style={{ fontFamily: "'Libre Caslon Text', Georgia, serif" }}
                      >
                        {inq.sender}
                      </h3>
                      <span className="p-1 border text-[#C9A227] border-[#C9A227]/30 text-[9px] uppercase tracking-wider font-mono">
                        VIP
                      </span>
                    </div>

                    <p className={`text-xs opacity-75 font-mono truncate mt-1 ${textSecondary}`}>
                      {inq.email} {inq.phone ? `&bull; ${inq.phone}` : ''}
                    </p>
                  </div>

                  {/* Message Snippet */}
                  <div
                    className={`p-3.5 border text-xs font-light leading-relaxed line-clamp-3 ${
                      isDarkMode ? 'bg-[#181B1A] border-[#222624]' : 'bg-[#FAF8F3] border-[#E6E1D8]'
                    }`}
                  >
                    <span className="font-semibold block mb-0.5 text-[#C9A227] text-[10px] uppercase tracking-wider">
                      {inq.title || 'Client Message'}
                    </span>
                    {inq.details || 'Consultation request for custom bespoke linen suite.'}
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="pt-4 mt-4 border-t border-inherit flex items-center justify-between">
                  <span className={`text-[10px] font-mono ${textSecondary}`}>
                    {new Date(inq.submittedAt).toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>

                  <button
                    onClick={() => handleOpenDossier(inq)}
                    className="px-3.5 py-1.5 text-[11px] uppercase tracking-wider font-semibold border flex items-center gap-1.5 hover:bg-[#C9A227] hover:text-black transition-colors cursor-pointer"
                  >
                    <MessageSquare className="w-3 h-3" />
                    <span>Open Dossier</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className={`p-12 sm:p-16 border text-center space-y-4 max-w-xl mx-auto ${cardBg}`}>
          <span className="w-14 h-14 mx-auto border flex items-center justify-center border-[#C9A227] text-[#C9A227]">
            <Inbox className="w-7 h-7" />
          </span>
          <h3
            className={`text-2xl font-normal ${textPrimary}`}
            style={{ fontFamily: "'Libre Caslon Text', Georgia, serif" }}
          >
            No Inquiries in this Pipeline
          </h3>
          <p className={`text-xs font-light leading-relaxed max-w-md mx-auto ${textSecondary}`}>
            All customer requests in this stage have been addressed by the concierge team.
          </p>
        </div>
      )}

      {/* CRM Client Dossier Modal & Concierge Reply */}
      {activeDossier && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto"
          onClick={() => setActiveDossier(null)}
        >
          <div
            className={`w-full max-w-3xl border p-6 sm:p-8 shadow-2xl relative space-y-6 ${
              isDarkMode ? 'bg-[#141716] border-[#222624] text-[#F5F1E8]' : 'bg-white border-[#E6E1D8] text-[#171717]'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-inherit">
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-mono tracking-widest text-[#C9A227]">
                  Client Dossier &bull; {activeDossier.type.toUpperCase()}
                </span>
                <h2
                  className="text-2xl font-normal"
                  style={{ fontFamily: "'Libre Caslon Text', Georgia, serif" }}
                >
                  {activeDossier.sender}
                </h2>
              </div>
              <button
                onClick={() => setActiveDossier(null)}
                className="p-1 border border-inherit hover:opacity-60 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Client Meta Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className={`p-3 border space-y-1.5 ${isDarkMode ? 'bg-[#181B1A]' : 'bg-[#FAF8F3]'}`}>
                <div className="flex justify-between">
                  <span className="opacity-70">Email:</span>
                  <span className="font-mono font-medium">{activeDossier.email}</span>
                </div>
                {activeDossier.phone && (
                  <div className="flex justify-between">
                    <span className="opacity-70">Phone:</span>
                    <span className="font-mono">{activeDossier.phone}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="opacity-70">Subject / Category:</span>
                  <span className="font-semibold text-[#C9A227]">{activeDossier.title}</span>
                </div>
              </div>

              {/* Status & Actions */}
              <div className={`p-3 border flex flex-col justify-between ${isDarkMode ? 'bg-[#181B1A]' : 'bg-[#FAF8F3]'}`}>
                <div className="flex items-center justify-between">
                  <span className="opacity-70">Current Stage:</span>
                  <span className="font-mono uppercase font-bold text-[#C9A227]">{activeDossier.status}</span>
                </div>
                <div className="flex items-center gap-1.5 pt-2">
                  <button
                    onClick={() => onUpdateStatus(activeDossier.type, activeDossier.id, 'contacted')}
                    className="flex-1 py-1.5 text-[10px] uppercase font-semibold border hover:bg-[#C9A227] hover:text-black transition-colors"
                  >
                    Mark Contacted
                  </button>
                  <button
                    onClick={() => onUpdateStatus(activeDossier.type, activeDossier.id, 'resolved')}
                    className="flex-1 py-1.5 text-[10px] uppercase font-semibold border border-emerald-500/40 text-emerald-500 hover:bg-emerald-500 hover:text-black transition-colors"
                  >
                    Mark Converted
                  </button>
                </div>
              </div>
            </div>

            {/* Original Client Message */}
            <div className="space-y-2">
              <span className="text-[10.5px] uppercase font-semibold tracking-wider text-[#C9A227] block">
                Original Message / Project Specifications:
              </span>
              <div className={`p-4 border text-xs font-light leading-relaxed ${isDarkMode ? 'bg-[#181B1A]' : 'bg-[#FAF8F3]'}`}>
                {activeDossier.details || 'Consultation request for custom bespoke linen suite.'}
              </div>
            </div>

            {/* Concierge Interactive Reply Form */}
            <div className="space-y-2">
              <span className="text-[10.5px] uppercase font-semibold tracking-wider text-[#C9A227] block">
                Concierge Official Reply:
              </span>
              <textarea
                rows={5}
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                className={`w-full p-3 border outline-none text-xs font-mono leading-relaxed transition-colors ${
                  isDarkMode
                    ? 'bg-[#181B1A] border-[#2E3330] text-[#F5F1E8] focus:border-[#C9A227]'
                    : 'bg-[#FAF8F3] border-[#DCD6CA] text-[#171717] focus:border-black'
                }`}
              />
            </div>

            {/* Modal Footer */}
            <div className="pt-3 border-t border-inherit flex items-center justify-between">
              <button
                onClick={() => setActiveDossier(null)}
                className="text-xs uppercase tracking-wider font-semibold opacity-70 hover:opacity-100"
              >
                Close Dossier
              </button>

              <button
                onClick={handleSendReply}
                disabled={isSendingReply}
                className="px-6 py-2.5 text-xs uppercase tracking-wider font-bold flex items-center gap-2 transition-all cursor-pointer shadow-md"
                style={{ backgroundColor: gold, color: '#0B0D0C' }}
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isSendingReply ? 'Dispatching...' : 'Dispatch Concierge Reply'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
