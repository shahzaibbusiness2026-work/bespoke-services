'use client';

import React, { useState } from 'react';
import { REVIEWS, PRODUCTS } from '../data/products';
import { Review } from '../types';
import { useShop } from '../context/ShopContext';
import { ReviewTile } from './ReviewTile';

export const CustomerReviews: React.FC = () => {
  const { showToast, isDarkMode } = useShop();
  const [reviewsList, setReviewsList] = useState<Review[]>(REVIEWS);
  const [selectedRatingFilter, setSelectedRatingFilter] = useState<number | null>(null);
  const [isWriteReviewOpen, setIsWriteReviewOpen] = useState(false);

  // New Review Form State
  const [authorName, setAuthorName] = useState('');
  const [location, setLocation] = useState('');
  const [productName, setProductName] = useState(PRODUCTS[0].name);
  const [rating, setRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState('');
  const [comment, setComment] = useState('');
  const [fitRating, setFitRating] = useState<'True to size' | 'Runs small' | 'Runs large'>('True to size');

  const filteredReviews = selectedRatingFilter
    ? reviewsList.filter((r) => r.rating === selectedRatingFilter)
    : reviewsList;

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authorName.trim() || !comment.trim() || !reviewTitle.trim()) {
      showToast('Please fill required fields', 'Name, title, and review are required', 'info');
      return;
    }

    const newRev: Review = {
      id: `rev-${Date.now()}`,
      author: authorName.trim(),
      location: location.trim() || 'Verified Client',
      rating,
      title: reviewTitle.trim(),
      comment: comment.trim(),
      date: 'Just now',
      verified: true,
      productName,
      fitRating,
    };

    setReviewsList([newRev, ...reviewsList]);
    setIsWriteReviewOpen(false);
    showToast('Review Published', 'Thank you for sharing your experience', 'success');

    // Reset Form
    setAuthorName('');
    setLocation('');
    setReviewTitle('');
    setComment('');
  };

  return (
    <section
      id="reviews-section"
      className="py-24 px-5 md:px-12 lg:px-16 max-w-[1440px] mx-auto"
      aria-label="Client Testimonials"
    >
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
        <div>
          <p className={`text-label-caps uppercase tracking-widest font-semibold mb-3 ${
            isDarkMode ? 'text-[#C5A059]' : 'text-[#2b2d2c]'
          }`}>
            Client Testimonials
          </p>
          <h2
            className={`text-[34px] sm:text-[44px] font-normal leading-tight ${
              isDarkMode ? 'text-[#FAF8F5]' : 'text-[#000000]'
            }`}
            style={{ fontFamily: "'Libre Caslon Text', Georgia, serif" }}
          >
            Voices of Connoisseurs
          </h2>
        </div>

        <button
          id="write-review-trigger-btn"
          onClick={() => setIsWriteReviewOpen(true)}
          className={`px-7 py-3.5 text-label-caps uppercase tracking-[0.16em] transition-colors inline-flex items-center gap-2 cursor-pointer w-fit font-medium shadow-sm ${
            isDarkMode
              ? 'bg-[#C5A059] text-black hover:bg-[#D8B468]'
              : 'bg-[#000000] hover:bg-[#252726] text-white'
          }`}
          aria-label="Open form to write a review"
        >
          <span className="material-symbols-outlined text-[18px]">rate_review</span>
          <span>Write a Review</span>
        </button>
      </div>

      {/* Aggregate Overview Box & Ratings Distribution */}
      <div className={`grid grid-cols-1 md:grid-cols-12 gap-8 p-6 sm:p-10 border shadow-sm mb-12 transition-colors ${
        isDarkMode
          ? 'bg-[#1A1D1C] border-[#2A2E2C]'
          : 'bg-white border-[#c4c7c7]'
      }`}>
        {/* Score Column */}
        <div className={`md:col-span-4 flex flex-col items-center justify-center text-center p-4 border-b md:border-b-0 md:border-r ${
          isDarkMode ? 'border-[#2A2E2C]' : 'border-[#e3e2e0]'
        }`}>
          <span
            className={`text-6xl font-normal ${isDarkMode ? 'text-[#FAF8F5]' : 'text-[#000000]'}`}
            style={{ fontFamily: "'Libre Caslon Text', Georgia, serif" }}
          >
            4.96
          </span>
          <div className={`flex items-center gap-1 my-3 ${isDarkMode ? 'text-[#C5A059]' : 'text-[#000000]'}`} aria-label="Rated 4.96 out of 5 stars">
            {[...Array(5)].map((_, i) => (
              <span
                key={i}
                className="material-symbols-outlined text-[20px]"
                style={{ fontVariationSettings: "'FILL' 1, 'wght' 400" }}
              >
                star
              </span>
            ))}
          </div>
          <span className={`text-body-sm font-normal ${isDarkMode ? 'text-[#A8A49C]' : 'text-[#2b2d2c]'}`}>
            Based on 512 verified worldwide client experiences
          </span>
          <div className={`mt-4 inline-flex items-center gap-1.5 px-3 py-1 border text-label-caps uppercase tracking-wider text-[11px] font-medium ${
            isDarkMode
              ? 'bg-[#141615] border-[#383D3A] text-[#FAF8F5]'
              : 'bg-[#f4f3f1] border-[#c4c7c7] text-[#000000]'
          }`}>
            <span className={`material-symbols-outlined text-[15px] ${isDarkMode ? 'text-[#4ade80]' : 'text-[#1b6b3e]'}`}>verified</span>
            <span>99% Client Recommendation Rate</span>
          </div>
        </div>

        {/* Breakdown Progress Bars Column */}
        <div className="md:col-span-8 flex flex-col justify-center space-y-3">
          {[
            { stars: 5, pct: 94, count: 481 },
            { stars: 4, pct: 5, count: 26 },
            { stars: 3, pct: 1, count: 5 },
            { stars: 2, pct: 0, count: 0 },
            { stars: 1, pct: 0, count: 0 },
          ].map((row) => (
            <button
              key={row.stars}
              type="button"
              onClick={() =>
                setSelectedRatingFilter(selectedRatingFilter === row.stars ? null : row.stars)
              }
              className={`flex items-center gap-3 text-body-sm cursor-pointer p-2 transition-colors w-full text-left ${
                selectedRatingFilter === row.stars
                  ? isDarkMode
                    ? 'bg-[#242826] border border-[#C5A059]'
                    : 'bg-[#f4f3f1] border border-[#000000]'
                  : isDarkMode
                    ? 'hover:bg-[#242826]/50'
                    : 'hover:bg-[#faf9f7]'
              }`}
              aria-label={`Filter by ${row.stars} stars reviews, ${row.count} reviews`}
            >
              <span className={`w-14 font-medium flex items-center gap-1 ${isDarkMode ? 'text-[#FAF8F5]' : 'text-[#000000]'}`}>
                {row.stars}
                <span
                  className="material-symbols-outlined text-[15px]"
                  style={{ fontVariationSettings: "'FILL' 1, 'wght' 400" }}
                >
                  star
                </span>
              </span>
              <div className={`flex-1 h-2 overflow-hidden ${isDarkMode ? 'bg-[#2A2E2C]' : 'bg-[#efeeec]'}`}>
                <div
                  className={`h-full transition-all duration-500 ${isDarkMode ? 'bg-[#C5A059]' : 'bg-[#000000]'}`}
                  style={{ width: `${row.pct}%` }}
                />
              </div>
              <span className={`w-12 text-right font-medium ${isDarkMode ? 'text-[#A8A49C]' : 'text-[#2b2d2c]'}`}>{row.pct}%</span>
            </button>
          ))}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setSelectedRatingFilter(null)}
            className={`px-4 py-2 text-label-caps uppercase transition-colors cursor-pointer border ${
              selectedRatingFilter === null
                ? isDarkMode
                  ? 'bg-[#C5A059] text-black border-[#C5A059] font-bold'
                  : 'bg-[#000000] text-white border-[#000000]'
                : isDarkMode
                  ? 'bg-[#1A1D1C] text-[#A8A49C] border-[#383D3A] hover:border-[#C5A059] hover:text-white'
                  : 'bg-white text-[#2b2d2c] border-[#c4c7c7] hover:border-[#000000]'
            }`}
          >
            All Reviews ({reviewsList.length})
          </button>
          <button
            onClick={() => setSelectedRatingFilter(5)}
            className={`px-4 py-2 text-label-caps uppercase transition-colors cursor-pointer border flex items-center gap-1.5 ${
              selectedRatingFilter === 5
                ? isDarkMode
                  ? 'bg-[#C5A059] text-black border-[#C5A059] font-bold'
                  : 'bg-[#000000] text-white border-[#000000]'
                : isDarkMode
                  ? 'bg-[#1A1D1C] text-[#A8A49C] border-[#383D3A] hover:border-[#C5A059] hover:text-white'
                  : 'bg-white text-[#2b2d2c] border-[#c4c7c7] hover:border-[#000000]'
            }`}
          >
            <span>5 Stars Only</span>
            <span
              className={`material-symbols-outlined text-[14px] ${
                selectedRatingFilter === 5 ? (isDarkMode ? 'text-black' : 'text-white') : (isDarkMode ? 'text-[#C5A059]' : 'text-[#000000]')
              }`}
              style={{ fontVariationSettings: "'FILL' 1, 'wght' 400" }}
            >
              star
            </span>
          </button>
        </div>

        {selectedRatingFilter && (
          <button
            onClick={() => setSelectedRatingFilter(null)}
            className={`text-body-sm font-medium underline cursor-pointer ${
              isDarkMode ? 'text-[#C5A059] hover:text-white' : 'text-[#000000] hover:text-[#505252]'
            }`}
          >
            Clear Rating Filter
          </button>
        )}
      </div>

      {/* Modular Reviews Grid using ReviewTile */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {filteredReviews.map((rev) => (
          <ReviewTile key={rev.id} review={rev} />
        ))}
      </div>

      {/* Write a Review Modal */}
      {isWriteReviewOpen && (
        <div
          id="write-review-modal-overlay"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn"
          role="dialog"
          aria-modal="true"
          aria-labelledby="write-review-heading"
        >
          <div
            id="write-review-modal-content"
            className={`w-full max-w-lg shadow-2xl border p-6 sm:p-10 overflow-y-auto max-h-[90vh] transition-colors ${
              isDarkMode ? 'bg-[#181B1A] border-[#383D3A] text-[#FAF8F5]' : 'bg-[#faf9f7] border-[#c4c7c7] text-[#000000]'
            }`}
          >
            <div className={`flex items-center justify-between mb-6 pb-4 border-b ${
              isDarkMode ? 'border-[#2A2E2C]' : 'border-[#c4c7c7]'
            }`}>
              <h3
                id="write-review-heading"
                className={`text-[24px] font-normal ${isDarkMode ? 'text-[#FAF8F5]' : 'text-[#000000]'}`}
                style={{ fontFamily: "'Libre Caslon Text', Georgia, serif" }}
              >
                Submit Client Experience
              </h3>
              <button
                onClick={() => setIsWriteReviewOpen(false)}
                className={`w-9 h-9 flex items-center justify-center transition-opacity cursor-pointer ${
                  isDarkMode ? 'text-[#FAF8F5] hover:opacity-60' : 'text-[#000000] hover:opacity-60'
                }`}
                aria-label="Close modal"
              >
                <span className="material-symbols-outlined text-[24px]">close</span>
              </button>
            </div>

            <form onSubmit={handleReviewSubmit} className="space-y-4 text-left">
              <div>
                <label className={`block text-label-caps uppercase mb-1 font-semibold ${
                  isDarkMode ? 'text-[#FAF8F5]' : 'text-[#000000]'
                }`}>
                  Product / Piece
                </label>
                <select
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  className={`w-full px-3 py-2.5 text-body-sm border outline-none cursor-pointer ${
                    isDarkMode
                      ? 'bg-[#141615] border-[#383D3A] text-[#FAF8F5] focus:border-[#C5A059]'
                      : 'bg-white border-[#c4c7c7] text-[#000000]'
                  }`}
                >
                  {PRODUCTS.map((p) => (
                    <option key={p.id} value={p.name} className={isDarkMode ? 'bg-[#141615] text-[#FAF8F5]' : 'bg-white text-black'}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className={`block text-label-caps uppercase mb-1 font-semibold ${
                  isDarkMode ? 'text-[#FAF8F5]' : 'text-[#000000]'
                }`}>
                  Rating
                </label>
                <div className="flex items-center gap-1.5" role="radiogroup" aria-label="Select rating">
                  {[1, 2, 3, 4, 5].map((num) => (
                    <button
                      type="button"
                      key={num}
                      onClick={() => setRating(num)}
                      className="p-1 cursor-pointer focus:outline-none"
                      aria-label={`${num} Stars`}
                    >
                      <span
                        className={`material-symbols-outlined text-[28px] ${
                          num <= rating ? (isDarkMode ? 'text-[#C5A059]' : 'text-[#000000]') : (isDarkMode ? 'text-[#383D3A]' : 'text-[#c4c7c7]')
                        }`}
                        style={{ fontVariationSettings: `'FILL' ${num <= rating ? 1 : 0}, 'wght' 300` }}
                      >
                        star
                      </span>
                    </button>
                  ))}
                  <span className={`text-body-sm font-medium ml-2 ${isDarkMode ? 'text-[#FAF8F5]' : 'text-[#000000]'}`}>
                    {rating} of 5 Stars
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-label-caps uppercase mb-1 font-semibold ${
                    isDarkMode ? 'text-[#FAF8F5]' : 'text-[#000000]'
                  }`}>
                    Your Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Lady Vivienne"
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    required
                    className={`w-full px-3 py-2.5 text-body-sm border outline-none ${
                      isDarkMode
                        ? 'bg-[#141615] border-[#383D3A] text-[#FAF8F5] placeholder-[#6E6B65] focus:border-[#C5A059]'
                        : 'bg-white border-[#c4c7c7] text-[#000000]'
                    }`}
                  />
                </div>
                <div>
                  <label className={`block text-label-caps uppercase mb-1 font-semibold ${
                    isDarkMode ? 'text-[#FAF8F5]' : 'text-[#000000]'
                  }`}>
                    City &amp; Country
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Cotswolds, UK"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className={`w-full px-3 py-2.5 text-body-sm border outline-none ${
                      isDarkMode
                        ? 'bg-[#141615] border-[#383D3A] text-[#FAF8F5] placeholder-[#6E6B65] focus:border-[#C5A059]'
                        : 'bg-white border-[#c4c7c7] text-[#000000]'
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className={`block text-label-caps uppercase mb-1 font-semibold ${
                  isDarkMode ? 'text-[#FAF8F5]' : 'text-[#000000]'
                }`}>
                  Review Headline
                </label>
                <input
                  type="text"
                  placeholder="e.g. Supreme texture and exquisite craftsmanship"
                  value={reviewTitle}
                  onChange={(e) => setReviewTitle(e.target.value)}
                  required
                  className={`w-full px-3 py-2.5 text-body-sm border outline-none ${
                    isDarkMode
                      ? 'bg-[#141615] border-[#383D3A] text-[#FAF8F5] placeholder-[#6E6B65] focus:border-[#C5A059]'
                      : 'bg-white border-[#c4c7c7] text-[#000000]'
                  }`}
                />
              </div>

              <div>
                <label className={`block text-label-caps uppercase mb-1 font-semibold ${
                  isDarkMode ? 'text-[#FAF8F5]' : 'text-[#000000]'
                }`}>
                  Your Experience
                </label>
                <textarea
                  rows={3}
                  placeholder="Describe the fabric breathability, drape, softness after laundering..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  required
                  className={`w-full px-3 py-2.5 text-body-sm border outline-none resize-none ${
                    isDarkMode
                      ? 'bg-[#141615] border-[#383D3A] text-[#FAF8F5] placeholder-[#6E6B65] focus:border-[#C5A059]'
                      : 'bg-white border-[#c4c7c7] text-[#000000]'
                  }`}
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className={`w-full py-4 text-label-caps uppercase tracking-[0.18em] transition-colors flex items-center justify-center gap-2 cursor-pointer font-medium ${
                    isDarkMode
                      ? 'bg-[#C5A059] text-black hover:bg-[#D8B468]'
                      : 'bg-[#000000] hover:bg-[#252726] text-white'
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px]">send</span>
                  <span>Publish Review</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
