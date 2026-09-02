'use client';

import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { ASSETS } from '@/src/constants/assets';

export const AuthModal: React.FC = () => {
  const { isAuthOpen, setIsAuthOpen, authMode, setAuthMode, login, signup, showToast, isDarkMode } = useShop();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isAuthOpen) return null;

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.trim();
    if (!cleanEmail) {
      showToast('Email Required', 'Please enter your email address', 'info');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      showToast('Invalid Email', 'Please enter a valid email address format', 'info');
      return;
    }
    setIsSubmitting(true);
    try {
      await login(cleanEmail, password);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.trim();
    const cleanFirst = firstName.trim();
    if (!cleanEmail || !cleanFirst) {
      showToast('Missing details', 'Please provide your first name and email address', 'info');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      showToast('Invalid Email', 'Please enter a valid email address format', 'info');
      return;
    }
    if (password.length < 6) {
      showToast('Password Length', 'Passphrase must be at least 6 characters long', 'info');
      return;
    }
    setIsSubmitting(true);
    try {
      await signup(cleanFirst, lastName.trim(), cleanEmail, password);
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass = isDarkMode
    ? "w-full bg-transparent border-0 border-b border-[#383D3A] focus:border-[#C5A059] py-2 px-0 text-body-md text-[#FAF8F5] placeholder-[#6E6B65] transition-colors outline-none"
    : "w-full bg-transparent border-0 border-b border-[#e3e2e0] focus:border-[#000000] py-2 px-0 text-body-md text-[#000000] placeholder-[#444748]/50 transition-colors outline-none";

  const labelClass = isDarkMode
    ? "text-label-caps text-[#A8A49C] group-focus-within:text-[#C5A059] transition-colors"
    : "text-label-caps text-[#444748] group-focus-within:text-[#000000] transition-colors";

  return (
    <div
      id="auth-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto animate-fadeIn"
      onClick={() => setIsAuthOpen(false)}
    >
      <div
        id="auth-modal-content"
        role="dialog"
        aria-modal="true"
        aria-label="Client Sign In & Registry"
        className={`w-full max-w-4xl shadow-2xl border overflow-hidden grid grid-cols-1 md:grid-cols-2 relative my-auto will-change-transform ${
          isDarkMode
            ? 'bg-[#141615] border-[#2A2E2C] text-[#FAF8F5]'
            : 'bg-[#faf9f7] border-[#c4c7c7] text-[#000000]'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Left Column: Bedroom Image */}
        <div className="relative hidden md:block w-full h-full min-h-[580px] bg-[#efeeec]">
          <img
            src={ASSETS.editorial.lookbookCoastalSanctuary}
            alt="BOSKI LIMITED premium bedding editorial"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-black/20" />
          <div className="absolute top-8 left-8 z-10">
            <span
              className="text-[28px] leading-[36px] text-white tracking-widest uppercase"
              style={{ fontFamily: "'Libre Caslon Text', Georgia, serif", fontWeight: 400 }}
            >
              BOSKI LIMITED
            </span>
          </div>
          <div className="absolute bottom-8 left-8 right-8 z-10 text-white/90">
            <p
              className="text-[22px] leading-[30px] font-normal mb-2"
              style={{ fontFamily: "'Libre Caslon Text', Georgia, serif" }}
            >
              Quiet luxury for peaceful living.
            </p>
            <p className="text-body-sm text-white/70">
              Join our community for exclusive releases and private trade invitations.
            </p>
          </div>
        </div>

        {/* Right Column: Auth Form */}
        <div className="p-8 sm:p-12 flex flex-col justify-between relative">
          <button
            onClick={() => setIsAuthOpen(false)}
            className={`absolute top-6 right-6 p-2 transition-colors cursor-pointer ${
              isDarkMode ? 'text-[#A8A49C] hover:text-[#FAF8F5]' : 'text-[#444748] hover:text-[#000000]'
            }`}
            aria-label="Close"
          >
            <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'wght' 300" }}>close</span>
          </button>

          <div>
            <div className={`flex border-b mb-8 ${isDarkMode ? 'border-[#2A2E2C]' : 'border-[#e3e2e0]'}`}>
              <button
                type="button"
                onClick={() => setAuthMode('login')}
                className={`pb-3 pr-6 text-label-caps transition-colors relative uppercase tracking-widest cursor-pointer ${
                  authMode === 'login'
                    ? isDarkMode
                      ? 'text-[#C5A059] border-b-2 border-[#C5A059] font-bold'
                      : 'text-[#000000] border-b-2 border-[#000000] font-bold'
                    : isDarkMode
                      ? 'text-[#A8A49C] hover:text-white'
                      : 'text-[#444748] hover:text-[#000000]'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => setAuthMode('signup')}
                className={`pb-3 px-6 text-label-caps transition-colors relative uppercase tracking-widest cursor-pointer ${
                  authMode === 'signup'
                    ? isDarkMode
                      ? 'text-[#C5A059] border-b-2 border-[#C5A059] font-bold'
                      : 'text-[#000000] border-b-2 border-[#000000] font-bold'
                    : isDarkMode
                      ? 'text-[#A8A49C] hover:text-white'
                      : 'text-[#444748] hover:text-[#000000]'
                }`}
              >
                Create Account
              </button>
            </div>

            {authMode === 'login' ? (
              <form onSubmit={handleLoginSubmit} className="space-y-6">
                <div className="space-y-1 group">
                  <label className={labelClass}>Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    autoComplete="email"
                    required
                    className={inputClass}
                  />
                </div>

                <div className="space-y-1 group">
                  <div className="flex justify-between items-center">
                    <label className={labelClass}>Password</label>
                    <a href="#" className={`text-body-sm underline ${isDarkMode ? 'text-[#A8A49C] hover:text-[#C5A059]' : 'text-[#444748] hover:text-[#000000]'}`}>
                      Forgot?
                    </a>
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      autoComplete="current-password"
                      className={`${inputClass} pr-9`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className={`absolute right-0 bottom-2.5 p-1 transition-colors cursor-pointer ${
                        isDarkMode ? 'text-[#A8A49C] hover:text-white' : 'text-[#444748] hover:text-black'
                      }`}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-4 text-label-caps uppercase tracking-widest transition-colors mt-8 cursor-pointer font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${
                    isDarkMode
                      ? 'bg-[#C5A059] text-black hover:bg-[#D8B468]'
                      : 'bg-[#000000] text-white hover:bg-[#2f3130]'
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-current border-t-transparent animate-spin rounded-full" />
                      <span>SIGNING IN…</span>
                    </>
                  ) : (
                    <span>Sign In</span>
                  )}
                </button>
              </form>
            ) : (
              <form onSubmit={handleSignupSubmit} className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1 group">
                    <label className={labelClass}>First Name</label>
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="First name"
                      autoComplete="given-name"
                      required
                      className={inputClass}
                    />
                  </div>
                  <div className="space-y-1 group">
                    <label className={labelClass}>Last Name</label>
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Last name"
                      autoComplete="family-name"
                      className={inputClass}
                    />
                  </div>
                </div>

                <div className="space-y-1 group">
                  <label className={labelClass}>Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    autoComplete="email"
                    required
                    className={inputClass}
                  />
                </div>

                <div className="space-y-1 group">
                  <label className={labelClass}>Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Create a password (min. 6 characters)"
                      autoComplete="new-password"
                      required
                      className={`${inputClass} pr-9`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className={`absolute right-0 bottom-2.5 p-1 transition-colors cursor-pointer ${
                        isDarkMode ? 'text-[#A8A49C] hover:text-white' : 'text-[#444748] hover:text-black'
                      }`}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-4 text-label-caps uppercase tracking-widest transition-colors mt-6 cursor-pointer font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${
                    isDarkMode
                      ? 'bg-[#C5A059] text-black hover:bg-[#D8B468]'
                      : 'bg-[#000000] text-white hover:bg-[#2f3130]'
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-current border-t-transparent animate-spin rounded-full" />
                      <span>CREATING ACCOUNT…</span>
                    </>
                  ) : (
                    <span>Create Account</span>
                  )}
                </button>
              </form>
            )}
          </div>

          <div className={`mt-8 pt-6 border-t text-center ${isDarkMode ? 'border-[#2A2E2C]' : 'border-[#e3e2e0]'}`}>
            <p className={`text-body-sm ${isDarkMode ? 'text-[#6E6B65]' : 'text-[#444748]'}`}>
              By proceeding, you agree to our Terms of Service and Privacy Policy.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
