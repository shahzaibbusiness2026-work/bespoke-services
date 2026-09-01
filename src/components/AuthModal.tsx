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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm overflow-y-auto"
      onClick={() => setIsAuthOpen(false)}
    >
      <div
        id="auth-modal-content"
        className="bg-[#faf9f7] w-full max-w-4xl h-full sm:h-auto shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2 relative my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Left Column: Bedroom Image — matches sign_in_sign_up reference */}
        <div className="relative hidden md:block w-full h-full min-h-[600px] bg-[#efeeec]">
          <img
            src="https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=1200&q=85"
            alt="LINEN & LOFT premium bedding editorial"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-black/20" />
          {/* Brand overlay */}
          <div className="absolute top-8 left-8 z-10">
            <span
              className="text-[28px] leading-[36px] text-white tracking-widest"
              style={{ fontFamily: "'Libre Caslon Text', Georgia, serif", fontWeight: 400 }}
            >
              LINEN &amp; LOFT
            </span>
          </div>
        </div>

        {/* Right Column: Form — matches reference exactly */}
        <div className="p-10 md:p-16 flex flex-col justify-center bg-[#faf9f7]">
          {/* Close */}
          <button
            id="auth-close-btn"
            onClick={() => setIsAuthOpen(false)}
            className="absolute top-5 right-5 text-[#444748] hover:text-[#000000] transition-colors p-1"
            aria-label="Close"
          >
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'wght' 300" }}>close</span>
          </button>

          {/* Tab Toggle */}
          <div className="flex items-center gap-8 border-b border-[#e3e2e0] mb-10">
            <button
              id="auth-tab-signin"
              onClick={() => setAuthMode('login')}
              className={`pb-3 text-headline-sm transition-colors relative -mb-px ${
                authMode === 'login'
                  ? 'text-[#000000] border-b-2 border-[#000000]'
                  : 'text-[#c4c7c7] hover:text-[#444748]'
              }`}
              style={{ fontFamily: "'Libre Caslon Text', Georgia, serif" }}
            >
              Sign In
            </button>
            <button
              id="auth-tab-create"
              onClick={() => setAuthMode('signup')}
              className={`pb-3 text-headline-sm transition-colors relative -mb-px ${
                authMode === 'signup'
                  ? 'text-[#000000] border-b-2 border-[#000000]'
                  : 'text-[#c4c7c7] hover:text-[#444748]'
              }`}
              style={{ fontFamily: "'Libre Caslon Text', Georgia, serif" }}
            >
              Create Account
            </button>
          </div>

          {authMode === 'login' ? (
            <form onSubmit={handleLoginSubmit} className="flex flex-col gap-8">
              <div className="flex flex-col gap-1 group">
                <label className={labelClass} htmlFor="auth-email">Email Address</label>
                <input
                  id="auth-email"
                  type="email"
                  placeholder="Enter your email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={inputClass}
                />
              </div>
              <div className="flex flex-col gap-1 group">
                <label className={labelClass} htmlFor="auth-password">Password</label>
                <input
                  id="auth-password"
                  type="password"
                  placeholder="Enter your password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={inputClass}
                />
              </div>
              <div className="flex justify-between items-center">
                <button
                  type="button"
                  onClick={() => showToast('Password Reset', 'A reset link has been sent to your email', 'info')}
                  className="text-body-sm text-[#444748] hover:text-[#000000] transition-colors"
                >
                  Forgot Password?
                </button>
              </div>
              <button
                type="submit"
                id="auth-signin-submit-btn"
                className="w-full bg-[#000000] text-white text-label-caps py-4 mt-2 hover:bg-[#2f3130] transition-colors duration-300"
              >
                Sign In
              </button>
              {/* Quick demo login */}
              <div className="relative flex items-center">
                <div className="flex-grow border-t border-[#e3e2e0]" />
                <span className="mx-4 text-body-sm text-[#444748]">or</span>
                <div className="flex-grow border-t border-[#e3e2e0]" />
              </div>
              <button
                type="button"
                id="auth-demo-btn"
                onClick={() => login('eleanor.vance@oriana-linen.com', '')}
                className="w-full py-4 border border-[#c4c7c7] text-[#000000] text-label-caps hover:bg-[#f4f3f1] transition-colors"
              >
                Continue as Eleanor Vance (Demo)
              </button>
            </form>
          ) : (
            <form onSubmit={handleSignupSubmit} className="flex flex-col gap-8">
              <div className="grid grid-cols-2 gap-8">
                <div className="flex flex-col gap-1 group">
                  <label className={labelClass}>First Name</label>
                  <input
                    type="text"
                    placeholder="Jane"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className={inputClass}
                  />
                </div>
                <div className="flex flex-col gap-1 group">
                  <label className={labelClass}>Last Name</label>
                  <input
                    type="text"
                    placeholder="Doe"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className={inputClass}
                  />
                </div>
              </div>
              <div className="flex flex-col gap-1 group">
                <label className={labelClass}>Email Address</label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={inputClass}
                />
              </div>
              <div className="flex flex-col gap-1 group">
                <label className={labelClass}>Password</label>
                <input
                  type="password"
                  placeholder="Create a password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={inputClass}
                />
              </div>
              <button
                type="submit"
                id="auth-signup-submit-btn"
                className="w-full bg-[#000000] text-white text-label-caps py-4 mt-2 hover:bg-[#2f3130] transition-colors duration-300"
              >
                Create Account
              </button>
              <p className="text-body-sm text-[#444748] text-center">
                By creating an account you agree to our{' '}
                <button type="button" className="underline hover:text-[#000000]">Privacy Policy</button>.
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
