import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';

export const BespokeServicesPage: React.FC = () => {
  const { submitBespokeInquiry, showToast } = useShop();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    projectType: '',
    details: '',
  });
  const [fileName, setFileName] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFileName(e.target.files[0].name);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email) {
      showToast('Required fields', 'Please fill in your name and email', 'info');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      submitBespokeInquiry({
        fullName: formData.fullName,
        email: formData.email,
        projectType: formData.projectType,
        details: formData.details,
        imageFileName: fileName || undefined,
      });
      setLoading(false);
      setSubmitted(true);
      setFormData({ fullName: '', email: '', projectType: '', details: '' });
      setFileName(null);
    }, 1200);
  };

  const inputClass =
    'w-full bg-transparent border-0 border-b border-[#c4c7c7] focus:border-[#000000] py-2 px-0 text-body-md text-[#1a1c1b] transition-colors placeholder-[#444748]/30 outline-none';
  const labelClass = 'block text-label-caps text-[#444748] mb-2 group-focus-within:text-[#000000] transition-colors';

  return (
    <main className="flex-grow flex flex-col bg-[#faf9f7]">
      {/* Hero Header — matches get_a_quote reference */}
      <section className="w-full pt-16 md:pt-24 pb-12 px-5 md:px-16 text-center max-w-4xl mx-auto">
        <h1
          className="text-[36px] md:text-[64px] leading-[44px] md:leading-[72px] tracking-[-0.02em] text-[#000000] mb-6"
          style={{ fontFamily: "'Libre Caslon Text', Georgia, serif", fontWeight: 400 }}
        >
          Bespoke Services
        </h1>
        <p className="text-body-lg text-[#444748] max-w-2xl mx-auto">
          Tailored textiles for your unique space. Share your vision with our artisans, and we will craft a custom proposal perfectly suited to your home's aesthetic.
        </p>
      </section>

      {/* Form Section */}
      <section className="w-full pb-[120px] px-5 md:px-16">
        <div className="max-w-2xl mx-auto bg-white p-8 md:p-12 border border-[#e3e2e0]">
          {submitted ? (
            <div className="py-16 text-center">
              <span
                className="material-symbols-outlined text-5xl text-[#675d50] mb-6 block"
                style={{ fontVariationSettings: "'wght' 200" }}
              >
                check_circle
              </span>
              <h2
                className="text-headline-sm text-[#000000] mb-4"
                style={{ fontFamily: "'Libre Caslon Text', Georgia, serif" }}
              >
                Request Received
              </h2>
              <p className="text-body-md text-[#444748]">
                An artisan specialist will contact you within 24–48 hours to discuss your bespoke project.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="mt-8 px-8 py-4 border border-[#c4c7c7] text-label-caps text-[#000000] hover:bg-[#f4f3f1] transition-colors"
              >
                Submit Another Request
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-10" id="quoteForm">
              {/* Name & Email Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-8">
                <div className="relative group">
                  <label className={labelClass} htmlFor="fullName">Full Name</label>
                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    placeholder="Jane Doe"
                    required
                    value={formData.fullName}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </div>
                <div className="relative group">
                  <label className={labelClass} htmlFor="email">Email Address</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="jane@example.com"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </div>
              </div>

              {/* Project Type */}
              <div className="relative group">
                <label className={labelClass} htmlFor="projectType">Project Type</label>
                <div className="relative">
                  <select
                    id="projectType"
                    name="projectType"
                    required
                    value={formData.projectType}
                    onChange={handleChange}
                    className="w-full bg-transparent border-0 border-b border-[#c4c7c7] focus:border-[#000000] py-2 px-0 text-body-md text-[#1a1c1b] transition-colors appearance-none cursor-pointer outline-none"
                  >
                    <option value="" disabled>Select a category...</option>
                    <option value="curtains">Curtains &amp; Drapes</option>
                    <option value="bedding">Custom Bedding</option>
                    <option value="throws">Throws &amp; Blankets</option>
                    <option value="upholstery">Upholstery Fabrics</option>
                    <option value="other">Other / Mixed</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center text-[#444748]">
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'wght' 300" }}>expand_more</span>
                  </div>
                </div>
              </div>

              {/* Dimensions & Details */}
              <div className="relative group">
                <label className={labelClass} htmlFor="details">
                  <span>Dimensions &amp; Details</span>
                  <span className="text-[#444748]/50 font-normal ml-2">Optional</span>
                </label>
                <textarea
                  id="details"
                  name="details"
                  rows={4}
                  placeholder="Please provide approximate measurements, preferred materials, or any specific design requirements..."
                  value={formData.details}
                  onChange={handleChange}
                  className="w-full bg-transparent border-0 border-b border-[#c4c7c7] focus:border-[#000000] py-2 px-0 text-body-md text-[#1a1c1b] transition-colors resize-none placeholder-[#444748]/30 outline-none"
                />
              </div>

              {/* Inspiration Image Upload */}
              <div className="pt-2">
                <label className="block text-label-caps text-[#444748] mb-4">Inspiration Image</label>
                {fileName ? (
                  <div className="flex items-center justify-between p-3 bg-[#f4f3f1] border border-[#e3e2e0]">
                    <div className="flex items-center gap-2 overflow-hidden">
                      <span className="material-symbols-outlined text-[#444748] text-sm">image</span>
                      <span className="truncate text-body-sm text-[#1a1c1b]">{fileName}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setFileName(null)}
                      className="text-[#444748] hover:text-[#ba1a1a] transition-colors p-1"
                    >
                      <span className="material-symbols-outlined text-sm">close</span>
                    </button>
                  </div>
                ) : (
                  <label
                    htmlFor="file-upload"
                    className="w-full py-12 px-4 border border-dashed border-[#c4c7c7] flex flex-col items-center justify-center text-center cursor-pointer hover:border-[#1a1c1b] hover:bg-[#faf9f7]/50 transition-all group"
                  >
                    <span
                      className="material-symbols-outlined text-4xl text-[#444748] mb-4 group-hover:text-[#000000] transition-colors"
                      style={{ fontVariationSettings: "'wght' 200" }}
                    >
                      add_photo_alternate
                    </span>
                    <span className="text-body-md text-[#1a1c1b] mb-1">Click to upload an image</span>
                    <span className="text-body-sm text-[#444748]">JPG, PNG, or PDF up to 5MB</span>
                    <input
                      id="file-upload"
                      type="file"
                      accept=".jpg,.jpeg,.png,.pdf"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              {/* Submit */}
              <div className="pt-6 border-t border-[#e3e2e0]/50 mt-12 flex justify-end">
                <button
                  type="submit"
                  id="bespoke-submit-btn"
                  disabled={loading}
                  className="bg-[#000000] text-white text-label-caps px-8 py-4 uppercase tracking-widest hover:bg-[#444748] transition-colors duration-300 w-full sm:w-auto disabled:opacity-70"
                >
                  {loading ? (
                    <span className="flex items-center gap-2 justify-center">
                      <span className="material-symbols-outlined text-sm animate-spin">progress_activity</span>
                      Sending...
                    </span>
                  ) : (
                    'Request Consultation'
                  )}
                </button>
              </div>

              <p className="text-center text-body-sm text-[#444748] mt-6">
                By submitting this form, you agree to our{' '}
                <a href="#" className="underline hover:text-[#000000]">Privacy Policy</a>.
              </p>
            </form>
          )}
        </div>

        {/* Atmospheric linen image below form — matches get_a_quote reference */}
        <div className="max-w-[1440px] mx-auto mt-24">
          <div
            className="w-full h-[30vh] bg-cover bg-center opacity-80"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1616046229478-9901c5536a45?auto=format&fit=crop&w=1920&q=80')",
              mixBlendMode: 'multiply',
              filter: 'grayscale(20%)',
            }}
          />
        </div>
      </section>
    </main>
  );
};
