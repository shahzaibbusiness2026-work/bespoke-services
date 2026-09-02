'use client';

import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';

export const NewsletterSubscription: React.FC = () => {
  const { isDarkMode } = useShop();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const validateEmail = (val: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim());
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email.trim()) {
      setStatus('error');
      setErrorMessage('Please enter your email address.');
      return;
    }

    if (!validateEmail(email)) {
      setStatus('error');
      setErrorMessage('Please provide a valid email format (e.g. name@domain.com).');
      return;
    }

    setStatus('loading');

    // Simulate luxury API registration
    setTimeout(() => {
      setStatus('success');
    }, 1200);
  };

  const handleReset = () => {
    setEmail('');
    setStatus('idle');
    setErrorMessage('');
  };

  return (
    <section
      id="newsletter-section"
      className={`w-full border-t py-20 sm:py-24 px-5 md:px-12 lg:px-16 transition-colors ${
        isDarkMode ? 'bg-[#151716] border-[#2A2E2C]' : 'bg-[#f4f3f1] border-[#c4c7c7]'
      }`}
      aria-labelledby="newsletter-heading"
    >
      <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        {/* Left Narrative */}
        <div className="lg:col-span-6 flex flex-col gap-3">
          <span className={`text-label-caps uppercase tracking-[0.2em] font-semibold ${
            isDarkMode ? 'text-[#C5A059]' : 'text-[#2b2d2c]'
          }`}>
            The Boski Registry
          </span>
          <h2
            id="newsletter-heading"
            className={`text-[32px] sm:text-[44px] leading-[38px] sm:leading-[52px] tracking-[-0.01em] font-normal ${
              isDarkMode ? 'text-[#FAF8F5]' : 'text-[#000000]'
            }`}
            style={{ fontFamily: "'Libre Caslon Text', Georgia, serif" }}
          >
            Private Releases &amp; Architectural Journal
          </h2>
          <p className={`text-body-md max-w-xl font-light leading-relaxed ${
            isDarkMode ? 'text-[#A8A49C]' : 'text-[#2b2d2c]'
          }`}>
            Subscribers receive private previews of seasonal flax harvests, bespoke textile consultations, and architectural essays delivered quarterly.
          </p>
        </div>

        {/* Right Form with Multi-State Validation */}
        <div className="lg:col-span-6 w-full max-w-xl lg:ml-auto">
          {status === 'success' ? (
            <div
              className={`border p-8 flex flex-col items-start gap-4 animate-fadeIn ${
                isDarkMode ? 'bg-[#1A1D1C] border-[#C5A059] text-[#FAF8F5]' : 'bg-[#ffffff] border-[#000000]'
              }`}
              role="status"
              aria-live="polite"
            >
              <div className="flex items-center gap-3">
                <span
                  className={`material-symbols-outlined text-[26px] ${isDarkMode ? 'text-[#C5A059]' : 'text-[#000000]'}`}
                  style={{ fontVariationSettings: "'wght' 300" }}
                >
                  check_circle
                </span>
                <h3
                  className={`text-headline-sm ${isDarkMode ? 'text-[#FAF8F5]' : 'text-[#000000]'}`}
                  style={{ fontFamily: "'Libre Caslon Text', Georgia, serif" }}
                >
                  Welcome to the Registry
                </h3>
              </div>
              <p className={`text-body-md leading-relaxed ${isDarkMode ? 'text-[#A8A49C]' : 'text-[#2b2d2c]'}`}>
                Your email <strong className={isDarkMode ? 'text-[#FAF8F5]' : 'text-[#000000]'}>{email}</strong> has been registered. An introductory invitation with your private collection code has been sent.
              </p>
              <button
                type="button"
                onClick={handleReset}
                className={`mt-2 text-label-caps underline hover:opacity-70 transition-opacity uppercase tracking-wider cursor-pointer ${
                  isDarkMode ? 'text-[#C5A059]' : 'text-[#000000]'
                }`}
              >
                Register another email
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-3">
              <label htmlFor="newsletter-email-input" className={`text-label-caps uppercase tracking-wider ${
                isDarkMode ? 'text-[#A8A49C]' : 'text-[#2b2d2c]'
              }`}>
                Email Address
              </label>

              <div className={`relative flex flex-col sm:flex-row items-stretch border-b pb-1 transition-colors ${
                isDarkMode ? 'border-[#383D3A] focus-within:border-[#C5A059]' : 'border-[#000000]'
              }`}>
                <input
                  id="newsletter-email-input"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (status === 'error') setStatus('idle');
                  }}
                  disabled={status === 'loading'}
                  placeholder="Enter your corporate or personal email..."
                  aria-invalid={status === 'error'}
                  aria-describedby={status === 'error' ? 'newsletter-error-desc' : undefined}
                  className={`w-full bg-transparent border-none py-3 px-0 text-body-md focus:outline-none disabled:opacity-50 ${
                    isDarkMode ? 'text-[#FAF8F5] placeholder-[#6E6B65]' : 'text-[#000000] placeholder-[#505252]'
                  }`}
                />

                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className={`mt-3 sm:mt-0 sm:ml-4 px-8 py-3.5 text-label-caps uppercase tracking-[0.16em] transition-all duration-300 shrink-0 flex items-center justify-center gap-2 group disabled:opacity-60 cursor-pointer font-medium shadow-sm ${
                    isDarkMode
                      ? 'bg-[#C5A059] text-black hover:bg-[#D8B468]'
                      : 'bg-[#000000] text-white hover:bg-[#252726]'
                  }`}
                >
                  {status === 'loading' ? (
                    <>
                      <span className="material-symbols-outlined text-[18px] animate-spin">
                        progress_activity
                      </span>
                      <span>Subscribing...</span>
                    </>
                  ) : (
                    <>
                      <span>Join Registry</span>
                      <span
                        className="material-symbols-outlined text-[16px] transition-transform duration-300 group-hover:translate-x-1"
                        style={{ fontVariationSettings: "'wght' 300" }}
                      >
                        arrow_forward
                      </span>
                    </>
                  )}
                </button>
              </div>

              {/* Error State Feedback */}
              {status === 'error' && (
                <div
                  id="newsletter-error-desc"
                  className="flex items-center gap-2 mt-1 text-[#ba1a1a] text-body-sm font-medium animate-fadeIn"
                  role="alert"
                  aria-live="assertive"
                >
                  <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'wght' 400" }}>
                    error
                  </span>
                  <span>{errorMessage}</span>
                </div>
              )}

              <p className="text-body-sm text-[#505252] mt-1 text-xs">
                By subscribing, you agree to our Privacy Policy. You may withdraw consent at any time.
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};
