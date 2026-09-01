import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';

export const AuthModal: React.FC = () => {
  const { isAuthOpen, setIsAuthOpen, authMode, setAuthMode, login, signup, showToast } = useShop();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  if (!isAuthOpen) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      showToast('Email Required', 'Please enter your email address', 'info');
      return;
    }
    login(email, password);
  };

  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !firstName.trim()) {
      showToast('Missing details', 'Please provide your name and email', 'info');
      return;
    }
    signup(firstName, lastName, email, password);
  };

  const inputClass = "w-full bg-transparent border-0 border-b border-[#e3e2e0] focus:border-[#000000] py-2 px-0 text-body-md text-[#000000] placeholder-[#444748]/50 transition-colors outline-none";
  const labelClass = "text-label-caps text-[#444748] group-focus-within:text-[#000000] transition-colors";

  return (
    <div
      id="auth-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto animate-fadeIn"
      onClick={() => setIsAuthOpen(false)}
    >
      <div
        id="auth-modal-content"
        className="bg-[#faf9f7] w-full max-w-4xl shadow-2xl border border-[#c4c7c7] overflow-hidden grid grid-cols-1 md:grid-cols-2 relative my-auto will-change-transform"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Left Column: Bedroom Image */}
        <div className="relative hidden md:block w-full h-full min-h-[580px] bg-[#efeeec]">
          <img
            src="https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=1200&q=85"
            alt="LINEN & LOFT premium bedding editorial"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-black/20" />
          <div className="absolute top-8 left-8 z-10">
            <span
              className="text-[28px] leading-[36px] text-white tracking-widest"
              style={{ fontFamily: "'Libre Caslon Text', Georgia, serif", fontWeight: 400 }}
            >
              LINEN &amp; LOFT
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
            className="absolute top-6 right-6 p-2 text-[#444748] hover:text-[#000000] transition-colors"
            aria-label="Close"
          >
            <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'wght' 300" }}>close</span>
          </button>

          <div>
            <div className="flex border-b border-[#e3e2e0] mb-8">
              <button
                type="button"
                onClick={() => setAuthMode('login')}
                className={`pb-3 pr-6 text-label-caps transition-colors relative uppercase tracking-widest ${
                  authMode === 'login'
                    ? 'text-[#000000] border-b-2 border-[#000000] font-bold'
                    : 'text-[#444748] hover:text-[#000000]'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => setAuthMode('signup')}
                className={`pb-3 px-6 text-label-caps transition-colors relative uppercase tracking-widest ${
                  authMode === 'signup'
                    ? 'text-[#000000] border-b-2 border-[#000000] font-bold'
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
                    placeholder="email@example.com"
                    required
                    className={inputClass}
                  />
                </div>

                <div className="space-y-1 group">
                  <div className="flex justify-between items-center">
                    <label className={labelClass}>Password</label>
                    <a href="#" className="text-body-sm text-[#444748] hover:text-[#000000] underline">
                      Forgot?
                    </a>
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className={inputClass}
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#000000] text-white py-4 text-label-caps uppercase tracking-widest hover:bg-[#2f3130] transition-colors mt-8"
                >
                  Sign In
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
                      placeholder="Jane"
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
                      placeholder="Doe"
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
                    placeholder="jane@example.com"
                    required
                    className={inputClass}
                  />
                </div>

                <div className="space-y-1 group">
                  <label className={labelClass}>Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className={inputClass}
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#000000] text-white py-4 text-label-caps uppercase tracking-widest hover:bg-[#2f3130] transition-colors mt-6"
                >
                  Create Account
                </button>
              </form>
            )}
          </div>

          <div className="mt-8 pt-6 border-t border-[#e3e2e0] text-center">
            <p className="text-body-sm text-[#444748]">
              By proceeding, you agree to our Terms of Service and Privacy Policy.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
