'use client';

import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { ASSETS } from '@/src/constants/assets';

export const TradeHospitalityPage: React.FC = () => {
  const { submitTradeApplication, showToast, isDarkMode } = useShop();

  const [formData, setFormData] = useState({
    companyName: '',
    contactPerson: '',
    email: '',
    phone: '',
    professionalId: '',
    volume: '',
    projectDetails: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.companyName || !formData.email) {
      showToast('Required fields missing', 'Please fill in all required fields', 'info');
      return;
    }
    submitTradeApplication({
      companyName: formData.companyName,
      contactPerson: formData.contactPerson,
      businessEmail: formData.email,
      phone: formData.phone,
      professionalId: formData.professionalId,
      orderVolume: formData.volume,
      projectDetails: formData.projectDetails,
    });
    setSubmitted(true);
    setFormData({ companyName: '', contactPerson: '', email: '', phone: '', professionalId: '', volume: '', projectDetails: '' });
    showToast('Application Submitted', 'Trade application dispatched to hospitality team', 'success');
  };

  const inputClass = `w-full font-body-md text-body-md bg-transparent focus:ring-0 py-3 outline-none transition-colors border-b ${
    isDarkMode
      ? 'text-[#FAF8F5] border-[#383D3A] focus:border-[#C5A059] placeholder-[#6E6B65]'
      : 'text-[#000000] border-[#c4c7c7] focus:border-[#000000] placeholder-transparent'
  }`;
  const labelClass = `text-label-caps mb-1 block ${
    isDarkMode ? 'text-[#C5A059]' : 'text-[#444748]'
  }`;

  return (
    <main className={`flex-grow transition-colors ${
      isDarkMode ? 'bg-[#111312] text-[#FAF8F5]' : 'bg-[#faf9f7] text-[#1a1c1b]'
    }`}>
      {/* Hero Section — matches bulk_orders_trade reference */}
      <section className="w-full px-5 md:px-16 py-[120px] max-w-[1440px] mx-auto relative overflow-hidden flex flex-col md:flex-row items-center gap-8 min-h-[70vh]">
        <div className="w-full md:w-5/12 z-10 flex flex-col items-start gap-8">
          <p className={`text-label-caps ${isDarkMode ? 'text-[#C5A059]' : 'text-[#444748]'}`}>Trade &amp; Hospitality Program</p>
          <h1
            className={`text-[36px] md:text-[64px] leading-[44px] md:leading-[72px] tracking-[-0.02em] max-w-lg ${
              isDarkMode ? 'text-[#FAF8F5]' : 'text-[#000000]'
            }`}
            style={{ fontFamily: "'Libre Caslon Text', Georgia, serif", fontWeight: 400 }}
          >
            Trade &amp; Hospitality
          </h1>
          <p className={`text-body-lg max-w-md ${isDarkMode ? 'text-[#A8A49C]' : 'text-[#444748]'}`}>
            Partner with BOSKI LIMITED for large-scale projects and exclusive trade benefits. Elevate your spaces with our meticulously crafted collections designed for enduring quality and quiet luxury.
          </p>
          <a
            href="#application"
            className={`mt-4 px-8 py-4 text-label-caps transition-colors duration-300 inline-block cursor-pointer font-medium ${
              isDarkMode
                ? 'bg-[#C5A059] text-black hover:bg-[#D8B468]'
                : 'bg-[#000000] text-white hover:bg-[#2f3130]'
            }`}
          >
            Apply for Trade Account
          </a>
        </div>
        <div className="w-full md:w-7/12 h-[400px] md:h-[600px] relative">
          <img
            src={ASSETS.hospitality.suiteInterior}
            alt="Luxury boutique hotel room with Boski Limited premium textiles"
            className="w-full h-full object-cover absolute inset-0"
          />
          <div className={`absolute inset-0 pointer-events-none ${isDarkMode ? 'bg-black/30' : 'bg-[#faf9f7]/10'}`} />
        </div>
      </section>

      {/* Benefits Section */}
      <section className={`w-full px-5 md:px-16 py-[120px] max-w-[1440px] mx-auto border-y ${
        isDarkMode ? 'bg-[#141615] border-[#2A2E2C]' : 'bg-[#f4f3f1] border-[#c4c7c7]/30'
      }`}>
        <div className="mb-24 md:mb-32">
          <h2
            className={`text-headline-lg text-center ${isDarkMode ? 'text-[#FAF8F5]' : 'text-[#000000]'}`}
            style={{ fontFamily: "'Libre Caslon Text', Georgia, serif" }}
          >
            Program Benefits
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-24">
          {[
            {
              icon: 'sell',
              title: 'Exclusive Pricing',
              desc: 'Access tiered trade discounts across all BOSKI LIMITED collections, scaled to accommodate large-volume hospitality and residential projects.',
            },
            {
              icon: 'support_agent',
              title: 'Dedicated Support',
              desc: 'Work directly with a designated trade specialist who manages your orders from quotation through delivery and post-installation support.',
            },
            {
              icon: 'precision_manufacturing',
              title: 'Custom Manufacturing',
              desc: 'Collaborate with our design team for bespoke dimensions, unique fabrications, and customized finishes tailored specifically for your commercial spaces.',
            },
          ].map((benefit) => (
            <div key={benefit.title} className="flex flex-col items-center text-center gap-6 group">
              <div className={`w-16 h-16 rounded-none border flex items-center justify-center transition-colors duration-500 ${
                isDarkMode
                  ? 'border-[#383D3A] bg-[#181B1A] text-[#C5A059] group-hover:bg-[#C5A059] group-hover:text-black'
                  : 'border-[#c4c7c7] bg-[#faf9f7] text-[#000000] group-hover:bg-[#000000] group-hover:text-white'
              }`}>
                <span
                  className="material-symbols-outlined text-3xl"
                  style={{ fontVariationSettings: "'wght' 200" }}
                >
                  {benefit.icon}
                </span>
              </div>
              <h3
                className={`text-headline-sm ${isDarkMode ? 'text-[#FAF8F5]' : 'text-[#000000]'}`}
                style={{ fontFamily: "'Libre Caslon Text', Georgia, serif" }}
              >
                {benefit.title}
              </h3>
              <p className={`text-body-md max-w-sm ${isDarkMode ? 'text-[#A8A49C]' : 'text-[#444748]'}`}>{benefit.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Application Form Section */}
      <section id="application" className="w-full px-5 md:px-16 py-[120px] max-w-[1440px] mx-auto flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-5/12 pr-0 md:pr-16 flex flex-col gap-8">
          <h2
            className={`text-headline-lg ${isDarkMode ? 'text-[#FAF8F5]' : 'text-[#000000]'}`}
            style={{ fontFamily: "'Libre Caslon Text', Georgia, serif" }}
          >
            Trade Application
          </h2>
          <p className={`text-body-md ${isDarkMode ? 'text-[#A8A49C]' : 'text-[#444748]'}`}>
            Please provide your details below to initiate the review process. Our team typically responds within 2–3 business days.
          </p>
          <div className="mt-8 space-y-6">
            <div className="flex gap-4 items-start">
              <span className={`material-symbols-outlined mt-1 ${isDarkMode ? 'text-[#C5A059]' : 'text-[#000000]'}`} style={{ fontVariationSettings: "'wght' 200" }}>mail</span>
              <div>
                <p className={`text-label-caps mb-1 ${isDarkMode ? 'text-[#C5A059]' : 'text-[#444748]'}`}>Email</p>
                <a href="mailto:boskilimited@boskilimited.info" className={`text-body-md hover:underline ${isDarkMode ? 'text-[#FAF8F5]' : 'text-[#000000]'}`}>
                  boskilimited@boskilimited.info
                </a>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <span className={`material-symbols-outlined mt-1 ${isDarkMode ? 'text-[#C5A059]' : 'text-[#000000]'}`} style={{ fontVariationSettings: "'wght' 200" }}>call</span>
              <div>
                <p className={`text-label-caps mb-1 ${isDarkMode ? 'text-[#C5A059]' : 'text-[#444748]'}`}>Phone</p>
                <a href="tel:+447738761016" className={`text-body-md hover:underline ${isDarkMode ? 'text-[#FAF8F5]' : 'text-[#000000]'}`}>
                  +44 7738 761016
                </a>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <span className={`material-symbols-outlined mt-1 ${isDarkMode ? 'text-[#C5A059]' : 'text-[#000000]'}`} style={{ fontVariationSettings: "'wght' 200" }}>location_on</span>
              <div>
                <p className={`text-label-caps mb-1 ${isDarkMode ? 'text-[#C5A059]' : 'text-[#444748]'}`}>Atelier &amp; Trade Office</p>
                <p className={`text-body-sm leading-snug ${isDarkMode ? 'text-[#FAF8F5]' : 'text-[#000000]'}`}>
                  Unit 4, Balmoral Trading Estate<br />113 River Road, Barking, IG11 0EG
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full md:w-7/12 mt-12 md:mt-0">
          {submitted ? (
            <div className={`p-8 sm:p-12 border text-center space-y-4 rounded-none shadow-sm ${
              isDarkMode ? 'bg-[#141615] border-[#2A2E2C]' : 'bg-white border-[#c4c7c7]'
            }`}>
              <span
                className="material-symbols-outlined text-5xl text-emerald-500 mx-auto block"
                style={{ fontVariationSettings: "'wght' 200" }}
              >
                verified
              </span>
              <h3
                className={`text-[28px] font-normal leading-tight ${isDarkMode ? 'text-[#FAF8F5]' : 'text-[#000000]'}`}
                style={{ fontFamily: "'Libre Caslon Text', Georgia, serif" }}
              >
                Trade Application Received
              </h3>
              <p className={`text-body-md max-w-md mx-auto font-light leading-relaxed ${isDarkMode ? 'text-[#A8A49C]' : 'text-[#444748]'}`}>
                Thank you for applying to the BOSKI LIMITED Trade &amp; Hospitality Program. A dedicated trade director has received your credentials and will be in touch within 2 business days with your wholesale tier login.
              </p>
              <button
                type="button"
                onClick={() => setSubmitted(false)}
                className={`mt-6 px-8 py-3.5 border text-label-caps uppercase transition-colors cursor-pointer rounded-none font-semibold ${
                  isDarkMode
                    ? 'border-[#C5A059] text-[#C5A059] hover:bg-[#C5A059] hover:text-black'
                    : 'border-black text-black hover:bg-black hover:text-white'
                }`}
              >
                Submit Another Application
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-8">
              {/* Row 1 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="flex flex-col relative pt-4">
                  <label className={labelClass} htmlFor="companyName">Company Name *</label>
                  <input id="companyName" name="companyName" type="text" required value={formData.companyName} onChange={handleChange} className={inputClass} placeholder="Enter company or studio name" />
                </div>
                <div className="flex flex-col relative pt-4">
                  <label className={labelClass} htmlFor="contactPerson">Contact Person *</label>
                  <input id="contactPerson" name="contactPerson" type="text" required value={formData.contactPerson} onChange={handleChange} className={inputClass} placeholder="Enter full contact name" />
                </div>
              </div>
              {/* Row 2 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="flex flex-col relative pt-4">
                  <label className={labelClass} htmlFor="email">Business Email *</label>
                  <input id="email" name="email" type="email" required value={formData.email} onChange={handleChange} className={inputClass} placeholder="Enter business email address" />
                </div>
                <div className="flex flex-col relative pt-4">
                  <label className={labelClass} htmlFor="phone">Phone Number</label>
                  <input id="phone" name="phone" type="text" value={formData.phone} onChange={handleChange} className={inputClass} placeholder="Enter business phone number" />
                </div>
              </div>
              {/* Row 3 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="flex flex-col relative pt-4">
                  <label className={labelClass} htmlFor="professionalId">Professional ID / Website *</label>
                  <input id="professionalId" name="professionalId" type="text" required value={formData.professionalId} onChange={handleChange} className={inputClass} placeholder="Resale Certificate, AIA Number, or URL" />
                </div>
                <div className="flex flex-col relative pt-4">
                  <label className={labelClass} htmlFor="volume">Estimated Order Volume</label>
                  <select
                    id="volume"
                    name="volume"
                    value={formData.volume}
                    onChange={handleChange}
                    className={`w-full text-body-md bg-transparent border-b py-3 outline-none appearance-none cursor-pointer ${
                      isDarkMode
                        ? 'text-[#FAF8F5] border-[#383D3A] focus:border-[#C5A059]'
                        : 'text-[#000000] border-[#c4c7c7] focus:border-black'
                    }`}
                  >
                    <option value="" className={isDarkMode ? 'bg-[#141615] text-[#FAF8F5]' : 'bg-white text-black'}>Select an option</option>
                    <option value="tier1" className={isDarkMode ? 'bg-[#141615] text-[#FAF8F5]' : 'bg-white text-black'}>$5,000 – $25,000</option>
                    <option value="tier2" className={isDarkMode ? 'bg-[#141615] text-[#FAF8F5]' : 'bg-white text-black'}>$25,000 – $100,000</option>
                    <option value="tier3" className={isDarkMode ? 'bg-[#141615] text-[#FAF8F5]' : 'bg-white text-black'}>$100,000+</option>
                  </select>
                </div>
              </div>
              {/* Textarea */}
              <div className="flex flex-col relative pt-4">
                <label className={labelClass} htmlFor="projectDetails">Project Details (Optional)</label>
                <textarea
                  id="projectDetails"
                  name="projectDetails"
                  rows={4}
                  value={formData.projectDetails}
                  onChange={handleChange}
                  placeholder="Briefly describe your upcoming projects..."
                  className={`w-full text-body-md bg-transparent border-b py-3 outline-none resize-none transition-colors ${
                    isDarkMode
                      ? 'text-[#FAF8F5] border-[#383D3A] focus:border-[#C5A059] placeholder-[#6E6B65]'
                      : 'text-[#000000] border-[#c4c7c7] focus:border-[#000000] placeholder-[#444748]/30'
                  }`}
                />
              </div>
              {/* Submit */}
              <div className="mt-8 flex justify-end">
                <button
                  type="submit"
                  id="trade-submit-btn"
                  className={`px-10 py-4 text-label-caps transition-colors duration-300 rounded-none cursor-pointer font-medium ${
                    isDarkMode
                      ? 'bg-[#C5A059] text-black hover:bg-[#D8B468]'
                      : 'bg-[#000000] text-white hover:bg-[#2f3130]'
                  }`}
                >
                  Submit Application
                </button>
              </div>
            </form>
          )}
        </div>
      </section>
    </main>
  );
};
