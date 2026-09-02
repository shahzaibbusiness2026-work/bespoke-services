'use client';

import React from 'react';
import { Review } from '../types';

interface ReviewTileProps {
  review: Review;
}

export const ReviewTile: React.FC<ReviewTileProps> = ({ review }) => {
  return (
    <article
      id={`review-card-${review.id}`}
      className="bg-white p-6 sm:p-8 border border-[#c4c7c7] flex flex-col justify-between space-y-5 transition-shadow duration-300 hover:shadow-md"
      aria-label={`Review by ${review.author}`}
    >
      <div className="space-y-3">
        {/* Rating and Date */}
        <div className="flex items-center justify-between">
          <div
            className="flex items-center gap-1 text-[#000000]"
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
          <time className="text-body-sm text-[#383838] font-normal" dateTime={review.date}>
            {review.date}
          </time>
        </div>

        {/* Review Title & Body Copy */}
        <div>
          <h4
            className="text-[18px] sm:text-[20px] font-normal text-[#000000] leading-snug"
            style={{ fontFamily: "'Libre Caslon Text', Georgia, serif" }}
          >
            &ldquo;{review.title}&rdquo;
          </h4>
          <p className="text-body-sm text-[#2b2d2c] font-light leading-relaxed mt-2.5">
            {review.comment}
          </p>
        </div>
      </div>

      {/* Reviewer Details & Product Meta */}
      <div className="pt-4 border-t border-[#e3e2e0] flex items-center justify-between text-body-sm">
        <div>
          <div className="flex items-center gap-1.5 font-medium text-[#000000]">
            <span>{review.author}</span>
            {review.verified && (
              <span className="inline-flex items-center text-[11px] text-[#1b6b3e] font-semibold tracking-wide ml-1">
                <span className="material-symbols-outlined text-[14px] mr-0.5">verified</span>
                Verified Client
              </span>
            )}
          </div>
          <span className="text-[12px] text-[#383838] block font-normal">{review.location}</span>
        </div>

        <div className="text-right">
          <span className="text-[12px] font-medium text-[#000000] block">
            {review.productName}
          </span>
          {review.fitRating && (
            <span className="text-[11px] text-[#383838] block">
              Fit: <strong className="font-semibold text-[#000000]">{review.fitRating}</strong>
            </span>
          )}
        </div>
      </div>
    </article>
  );
};
