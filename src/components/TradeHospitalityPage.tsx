'use client';

import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';

export const TradeHospitalityPage: React.FC = () => {
  const { submitTradeApplication, showToast } = useShop();

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

  const inputClass = "w-full font-body-md text-body-md text-[#000000] bg-transparent focus:ring-0 focus:border-[#000000] border-b border-[#c4c7c7] py-3 outline-none transition-colors placeholder-transparent";
  const labelClass = "text-label-caps text-[#444748] mb-1 block";

  return (
    <main className="flex-grow bg-[#faf9f7]">
      {/* Hero Section — matches bulk_orders_trade reference */}
      <section className="w-full px-5 md:px-16 py-[120px] max-w-[1440px] mx-auto relative overflow-hidden flex flex-col md:flex-row items-center gap-8 min-h-[70vh]">
        <div className="w-full md:w-5/12 z-10 flex flex-col items-start gap-8">
          <p className="text-label-caps text-[#444748]">Trade &amp; Hospitality Program</p>
          <h1
            className="text-[36px] md:text-[64px] leading-[44px] md:leading-[72px] tracking-[-0.02em] text-[#000000] max-w-lg"
            style={{ fontFamily: "'Libre Caslon Text', Georgia, serif", fontWeight: 400 }}
          >
            Trade &amp; Hospitality
          </h1>
          <p className="text-body-lg text-[#444748] max-w-md">
            Partner with BOSKI LIMITED for large-scale projects and exclusive trade benefits. Elevate your spaces with our meticulously crafted collections designed for enduring quality and quiet luxury.
          </p>
          <a
            href="#application"
            className="mt-4 px-8 py-4 bg-[#000000] text-white text-label-caps hover:bg-[#2f3130] transition-colors duration-300 inline-block"
          >
            Apply for Trade Account
          </a>
        </div>
        <div className="w-full md:w-7/12 h-[400px] md:h-[600px] relative">
          <img
            src="https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=1200&q=85"
            alt="Luxury boutique hotel room with Boski Limited premium textiles"
            className="w-full h-full object-cover absolute inset-0"
          />
          <div className="absolute inset-0 bg-[#faf9f7]/10 pointer-events-none" />
        </div>
      </section>

      {/* Benefits Section */}
      <section className="w-full px-5 md:px-16 py-[120px] max-w-[1440px] mx-auto bg-[#f4f3f1] border-y border-[#c4c7c7]/30">
        <div className="mb-24 md:mb-32">
          <h2
            className="text-headline-lg text-[#000000] text-center"
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
              <div className="w-16 h-16 rounded-none border border-[#c4c7c7] flex items-center justify-center bg-[#faf9f7] group-hover:bg-[#000000] group-hover:text-white transition-colors duration-500">
                <span
                  className="material-symbols-outlined text-3xl"
                  style={{ fontVariationSettings: "'wght' 200" }}
                >
                  {benefit.icon}
                </span>
              </div>
              <h3
                className="text-headline-sm text-[#000000]"
                style={{ fontFamily: "'Libre Caslon Text', Georgia, serif" }}
              >
                {benefit.title}
              </h3>
              <p className="text-body-md text-[#444748] max-w-sm">{benefit.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Application Form Section */}
      <section id="application" className="w-full px-5 md:px-16 py-[120px] max-w-[1440px] mx-auto flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-5/12 pr-0 md:pr-16 flex flex-col gap-8">
          <h2
            className="text-headline-lg text-[#000000]"
            style={{ fontFamily: "'Libre Caslon Text', Georgia, serif" }}
          >
            Trade Application
          </h2>
          <p className="text-body-md text-[#444748]">
            Please provide your details below to initiate the review process. Our team typically responds within 2–3 business days.
          </p>
          <div className="mt-8 space-y-6">
            <div className="flex gap-4 items-start">
              <span className="material-symbols-outlined text-[#000000] mt-1" style={{ fontVariationSettings: "'wght' 200" }}>mail</span>
              <div>
                <p className="text-label-caps text-[#444748] mb-1">Email</p>
                <a href="mailto:boskilimited@boskilimited.info" className="text-body-md text-[#000000] hover:underline">
                  boskilimited@boskilimited.info
                </a>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <span className="material-symbols-outlined text-[#000000] mt-1" style={{ fontVariationSettings: "'wght' 200" }}>call</span>
              <div>
                <p className="text-label-caps text-[#444748] mb-1">Phone</p>
                <a href="tel:+447738761016" className="text-body-md text-[#000000] hover:underline">
                  +44 7738 761016
                </a>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <span className="material-symbols-outlined text-[#000000] mt-1" style={{ fontVariationSettings: "'wght' 200" }}>location_on</span>
              <div>
                <p className="text-label-caps text-[#444748] mb-1">Atelier &amp; Trade Office</p>
                <p className="text-body-sm text-[#000000] leading-snug">
                  Unit 4, Balmoral Trading Estate<br />113 River Road, Barking, IG11 0EG
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full md:w-7/12 mt-12 md:mt-0">
          {submitted ? (
            <div className="p-8 sm:p-12 bg-white border border-[#c4c7c7] text-center space-y-4 rounded-none shadow-sm">
              <span
                className="material-symbols-outlined text-5xl text-emerald-800 mx-auto block"
                style={{ fontVariationSettings: "'wght' 200" }}
              >
                verified
              </span>
              <h3
                className="text-[28px] text-[#000000] font-normal leading-tight"
                style={{ fontFamily: "'Libre Caslon Text', Georgia, serif" }}
              >
                Trade Application Received
              </h3>
              <p className="text-body-md text-[#444748] max-w-md mx-auto font-light leading-relaxed">
                Thank you for applying to the BOSKI LIMITED Trade &amp; Hospitality Program. A dedicated trade director has received your credentials and will be in touch within 2 business days with your wholesale tier login.
              </p>
              <button
                type="button"
                onClick={() => setSubmitted(false)}
                className="mt-6 px-8 py-3.5 border border-black text-label-caps uppercase hover:bg-black hover:text-white transition-colors cursor-pointer rounded-none font-semibold"
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
                  <input id="companyName" name="companyName" type="text" required value={formData.companyName} onChange={handleChange} className={inputClass} placeholder="Company" />
                </div>
                <div className="flex flex-col relative pt-4">
                  <label className={labelClass} htmlFor="contactPerson">Contact Person *</label>
                  <input id="contactPerson" name="contactPerson" type="text" required value={formData.contactPerson} onChange={handleChange} className={inputClass} placeholder="Name" />
                </div>
              </div>
              {/* Row 2 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="flex flex-col relative pt-4">
                  <label className={labelClass} htmlFor="email">Business Email *</label>
                  <input id="email" name="email" type="email" required value={formData.email} onChange={handleChange} className={inputClass} placeholder="email@company.com" />
                </div>
                <div className="flex flex-col relative pt-4">
                  <label className={labelClass} htmlFor="phone">Phone Number</label>
                  <input id="phone" name="phone" type="text" value={formData.phone} onChange={handleChange} className={inputClass} placeholder="+1 (555) 000-0000" />
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
                    className="w-full text-body-md text-[#000000] bg-transparent border-b border-[#c4c7c7] py-3 outline-none appearance-none cursor-pointer"
                  >
                    <option value="">Select an option</option>
                    <option value="tier1">$5,000 – $25,000</option>
                    <option value="tier2">$25,000 – $100,000</option>
                    <option value="tier3">$100,000+</option>
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
                  className="w-full text-body-md text-[#000000] bg-transparent border-b border-[#c4c7c7] py-3 outline-none resize-none focus:border-[#000000] transition-colors placeholder-[#444748]/30"
                />
              </div>
              {/* Submit */}
              <div className="mt-8 flex justify-end">
                <button
                  type="submit"
                  id="trade-submit-btn"
                  className="px-10 py-4 bg-[#000000] text-white text-label-caps hover:bg-[#2f3130] transition-colors duration-300 rounded-none cursor-pointer"
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
