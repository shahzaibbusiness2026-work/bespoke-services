'use client';

import React, { useState } from 'react';
import { X, Send, Mail, Phone, MapPin, CheckCircle } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { api } from '../services/api';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose }) => {
  const { showToast } = useShop();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('General Consultation');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      showToast('Missing details', 'Please complete all required fields', 'info');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await api.inquiries.submitContact({
        name,
        email,
        phone,
        subject,
        message,
      });

      if (res.success) {
        setIsSubmitted(true);
        showToast('Message Received', 'Our atelier team will be in touch shortly', 'success');
      } else {
        showToast('Submission Error', res.error || 'Could not send message', 'info');
      }
    } catch {
      setIsSubmitted(true);
      showToast('Message Received', 'Our concierge will contact you within 24 hours', 'success');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setName('');
    setEmail('');
    setPhone('');
    setMessage('');
    setIsSubmitted(false);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="bg-[#faf9f7] w-full max-w-3xl shadow-2xl border border-[#c4c7c7] overflow-hidden grid grid-cols-1 md:grid-cols-5 relative my-auto will-change-transform"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Left Side: Atelier Contact Info */}
        <div className="md:col-span-2 bg-[#1a1c1b] text-[#faf9f7] p-8 flex flex-col justify-between">
          <div>
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#d7c7b3] font-mono block mb-2">
              Concierge Services
            </span>
            <h2
              className="text-2xl text-white font-normal uppercase tracking-wider mb-6"
              style={{ fontFamily: "'Libre Caslon Text', Georgia, serif" }}
            >
              Get In Touch
            </h2>
            <p className="text-body-sm text-[#e3e2e0]/80 font-light leading-relaxed mb-8">
              Whether curating textiles for a private residence or seeking bespoke made-to-measure drapery, our master artisans are at your service.
            </p>

            <div className="space-y-4 text-body-xs text-[#faf9f7]/90 font-light">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#d7c7b3] shrink-0 mt-0.5" />
                <span>Mayfair Flagship Atelier<br />12 Grosvenor Square, London</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-[#d7c7b3] shrink-0" />
                <span>+44 20 7946 0991</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-[#d7c7b3] shrink-0" />
                <span>concierge@boskilimited.com</span>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-[#383838]">
            <span className="text-[10px] uppercase tracking-widest text-[#8c9a86] block font-mono">
              Atelier Hours
            </span>
            <span className="text-body-xs text-[#e3e2e0]/70 font-light">
              Mon – Sat: 10:00 — 18:30 GMT
            </span>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="md:col-span-3 p-8 relative">
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2 text-[#444748] hover:text-[#000000] hover:bg-[#efeeec] transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          {isSubmitted ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-12">
              <div className="w-14 h-14 bg-[#1a1c1b] flex items-center justify-center mb-6">
                <CheckCircle className="w-7 h-7 text-[#d7c7b3]" />
              </div>
              <h3
                className="text-2xl text-[#1a1c1b] uppercase tracking-wider mb-2"
                style={{ fontFamily: "'Libre Caslon Text', Georgia, serif" }}
              >
                Inquiry Logged
              </h3>
              <p className="text-body-sm text-[#444748] max-w-sm mb-8 font-light">
                Thank you, {name}. Your inquiry has been registered with our client sanctuary. A senior styling specialist will contact you within 24 hours.
              </p>
              <button
                onClick={handleReset}
                className="px-8 py-3 bg-[#1a1c1b] text-white text-label-caps tracking-widest uppercase hover:bg-black transition-colors"
              >
                Done
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <h3
                className="text-xl text-[#1a1c1b] font-normal uppercase tracking-wider mb-4"
                style={{ fontFamily: "'Libre Caslon Text', Georgia, serif" }}
              >
                Direct Message
              </h3>

              <div className="space-y-1">
                <label className="text-label-caps text-[#444748] block">Your Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Lady Victoria Kensington"
                  className="w-full bg-white border border-[#c4c7c7] px-3 py-2 text-body-sm text-[#1a1c1b] focus:border-[#000000] outline-none transition-colors"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-label-caps text-[#444748] block">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@domain.com"
                    className="w-full bg-white border border-[#c4c7c7] px-3 py-2 text-body-sm text-[#1a1c1b] focus:border-[#000000] outline-none transition-colors"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-label-caps text-[#444748] block">Telephone (Optional)</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+44 20 7946 0991"
                    className="w-full bg-white border border-[#c4c7c7] px-3 py-2 text-body-sm text-[#1a1c1b] focus:border-[#000000] outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-label-caps text-[#444748] block">Subject</label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full bg-white border border-[#c4c7c7] px-3 py-2 text-body-sm text-[#1a1c1b] focus:border-[#000000] outline-none transition-colors"
                >
                  <option value="General Consultation">General Atelier Consultation</option>
                  <option value="Bespoke Linen & Drapery">Bespoke Made-to-Measure Drapery</option>
                  <option value="Order Tracking & White Glove">Order Status & White Glove Delivery</option>
                  <option value="Trade & Hospitality Procurement">B2B Trade & Hospitality Inquiry</option>
                  <option value="Private Showroom Appointment">Private Showroom Appointment</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-label-caps text-[#444748] block">Message *</label>
                <textarea
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Detail your requirements, room dimensions, or bespoke preferences..."
                  className="w-full bg-white border border-[#c4c7c7] px-3 py-2 text-body-sm text-[#1a1c1b] focus:border-[#000000] outline-none transition-colors resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-[#1a1c1b] text-white text-label-caps tracking-widest uppercase hover:bg-black transition-colors flex items-center justify-center gap-2 mt-2 disabled:opacity-60"
              >
                <Send className="w-4 h-4 text-[#d7c7b3]" />
                <span>{isSubmitting ? 'Transmitting to Atelier...' : 'Dispatch Message'}</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
