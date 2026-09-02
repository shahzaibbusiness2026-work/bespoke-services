'use client';

import React from 'react';
import { Review } from '../types';
import { useShop } from '../context/ShopContext';

interface ReviewTileProps {
  review: Review;
}

export const ReviewTile: React.FC<ReviewTileProps> = ({ review }) => {
  const { isDarkMode } = useShop();

  return (
    <article
      id={`review-card-${review.id}`}
      className={`p-6 sm:p-8 border flex flex-col justify-between space-y-5 transition-all duration-300 hover:shadow-md ${
        isDarkMode
          ? 'bg-[#1A1D1C] border-[#2A2E2C]'
          : 'bg-white border-[#c4c7c7]'
      }`}
      aria-label={`Review by ${review.author}`}
    >
      <div className="space-y-3">
        {/* Rating and Date */}
        <div className="flex items-center justify-between">
          <div
            className={`flex items-center gap-1 ${isDarkMode ? 'text-[#C5A059]' : 'text-[#000000]'}`}
            aria-label={`${review.rating} out of 5 stars`}
          >
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                className="material-symbols-outlined text-[16px]"
                style={{
                  fontVariationSettings: `'FILL' ${review.rating >= star ? 1 : 0}, 'wght' 400`,
                }}
              >
                star
              </span>
            ))}
          </div>
          <time className={`text-body-sm font-normal ${isDarkMode ? 'text-[#6E6B65]' : 'text-[#383838]'}`} dateTime={review.date}>
            {review.date}
          </time>
        </div>

        {/* Review Title & Body Copy */}
        <div>
          <h4
            className={`text-[18px] sm:text-[20px] font-normal leading-snug ${
              isDarkMode ? 'text-[#FAF8F5]' : 'text-[#000000]'
            }`}
            style={{ fontFamily: "'Libre Caslon Text', Georgia, serif" }}
          >
            &ldquo;{review.title}&rdquo;
          </h4>
          <p className={`text-body-sm font-light leading-relaxed mt-2.5 ${
            isDarkMode ? 'text-[#A8A49C]' : 'text-[#2b2d2c]'
          }`}>
            {review.comment}
          </p>
        </div>
      </div>

      {/* Reviewer Details & Product Meta */}
      <div className={`pt-4 border-t flex items-center justify-between text-body-sm ${
        isDarkMode ? 'border-[#2A2E2C]' : 'border-[#e3e2e0]'
      }`}>
        <div>
          <div className={`flex items-center gap-1.5 font-medium ${
            isDarkMode ? 'text-[#FAF8F5]' : 'text-[#000000]'
          }`}>
            <span>{review.author}</span>
            {review.verified && (
              <span className={`inline-flex items-center text-[11px] font-semibold tracking-wide ml-1 ${
                isDarkMode ? 'text-[#4ade80]' : 'text-[#1b6b3e]'
              }`}>
                <span className="material-symbols-outlined text-[14px] mr-0.5">verified</span>
                Verified Client
              </span>
            )}
          </div>
          <span className={`text-[12px] block font-normal ${isDarkMode ? 'text-[#6E6B65]' : 'text-[#383838]'}`}>{review.location}</span>
        </div>

        <div className="text-right">
          <span className={`text-[12px] font-medium block ${isDarkMode ? 'text-[#FAF8F5]' : 'text-[#000000]'}`}>
            {review.productName}
          </span>
          {review.fitRating && (
            <span className={`text-[11px] block ${isDarkMode ? 'text-[#A8A49C]' : 'text-[#383838]'}`}>
              Fit: <strong className={`font-semibold ${isDarkMode ? 'text-[#FAF8F5]' : 'text-[#000000]'}`}>{review.fitRating}</strong>
            </span>
          )}
        </div>
      </div>
    </article>
  );
};
