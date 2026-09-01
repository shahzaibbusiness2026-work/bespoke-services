import React, { useState } from 'react';
import { REVIEWS, PRODUCTS } from '../data/products';
import { Review } from '../types';
import { useShop } from '../context/ShopContext';
import { Star, CheckCircle, MessageSquarePlus, Sparkles, Filter, X, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const CustomerReviews: React.FC = () => {
  const { showToast } = useShop();
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
      date: 'Just now',
      comment: comment.trim(),
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
    <section id="reviews-section" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
        <div>
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-neutral-500 font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Client Testimonials</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl text-neutral-950 font-normal">
            Voices of Connoisseurs
          </h2>
        </div>

        <button
          id="write-review-trigger-btn"
          onClick={() => setIsWriteReviewOpen(true)}
          className="mt-4 md:mt-0 px-6 py-3 bg-neutral-950 hover:bg-neutral-800 text-white rounded-full text-xs font-semibold uppercase tracking-wider transition-colors inline-flex items-center gap-2"
        >
          <MessageSquarePlus className="w-4 h-4" />
          <span>Write a Review</span>
        </button>
      </div>

      {/* Aggregate Overview Box & Ratings Distribution */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 bg-white p-6 sm:p-8 rounded-3xl border border-neutral-200 shadow-sm mb-12">
        {/* Score Column */}
        <div className="md:col-span-4 flex flex-col items-center justify-center text-center p-4 border-b md:border-b-0 md:border-r border-neutral-200">
          <span className="font-serif text-5xl sm:text-6xl font-bold text-neutral-950">
            4.93
          </span>
          <div className="flex items-center gap-1 text-amber-400 my-2">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-5 h-5 fill-amber-400" />
            ))}
          </div>
          <span className="text-xs text-neutral-500 font-medium">
            Based on 512 verified worldwide client reviews
          </span>
          <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold">
            <CheckCircle className="w-3.5 h-3.5" />
            <span>99% Recommendation Rate</span>
          </div>
        </div>

        {/* Breakdown Progress Bars Column */}
        <div className="md:col-span-8 flex flex-col justify-center space-y-2.5">
          {[
            { stars: 5, pct: 93, count: 476 },
            { stars: 4, pct: 6, count: 31 },
            { stars: 3, pct: 1, count: 5 },
            { stars: 2, pct: 0, count: 0 },
            { stars: 1, pct: 0, count: 0 },
          ].map((row) => (
            <div
              key={row.stars}
              onClick={() =>
                setSelectedRatingFilter(selectedRatingFilter === row.stars ? null : row.stars)
              }
              className={`flex items-center gap-3 text-xs cursor-pointer p-1.5 rounded-lg transition-colors ${
                selectedRatingFilter === row.stars ? 'bg-amber-50' : 'hover:bg-neutral-50'
              }`}
            >
              <span className="w-12 font-medium text-neutral-700 flex items-center gap-1">
                {row.stars} <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              </span>
              <div className="flex-1 h-2 rounded-full bg-neutral-100 overflow-hidden">
                <div
                  className="h-full bg-neutral-900 rounded-full transition-all duration-500"
                  style={{ width: `${row.pct}%` }}
                />
              </div>
              <span className="w-12 text-right text-neutral-500 font-medium">{row.pct}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSelectedRatingFilter(null)}
            className={`px-3.5 py-1.5 text-xs rounded-full font-semibold transition-colors ${
              selectedRatingFilter === null
                ? 'bg-neutral-950 text-white'
                : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
            }`}
          >
            All Reviews ({reviewsList.length})
          </button>
          <button
            onClick={() => setSelectedRatingFilter(5)}
            className={`px-3.5 py-1.5 text-xs rounded-full font-semibold transition-colors flex items-center gap-1 ${
              selectedRatingFilter === 5
                ? 'bg-neutral-950 text-white'
                : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
            }`}
          >
            5 Stars Only
          </button>
        </div>

        {selectedRatingFilter && (
          <button
            onClick={() => setSelectedRatingFilter(null)}
            className="text-xs text-neutral-500 hover:text-neutral-900 underline"
          >
            Clear Filter
          </button>
        )}
      </div>

      {/* Reviews Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredReviews.map((rev) => (
          <div
            key={rev.id}
            id={`review-card-${rev.id}`}
            className="bg-white p-6 sm:p-7 rounded-2xl border border-neutral-200/90 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <span className="text-xs text-neutral-400">{rev.date}</span>
              </div>

              <div>
                <h4 className="font-serif text-lg font-bold text-neutral-900 leading-snug">
                  "{rev.title}"
                </h4>
                <p className="text-xs text-neutral-600 font-light leading-relaxed mt-2">
                  {rev.comment}
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-neutral-100 flex items-center justify-between text-xs">
              <div>
                <div className="flex items-center gap-1.5 font-semibold text-neutral-900">
                  <span>{rev.author}</span>
                  {rev.verified && (
                    <span className="flex items-center text-[10px] text-emerald-600 font-medium">
                      <CheckCircle className="w-3 h-3 mr-0.5" /> Verified Client
                    </span>
                  )}
                </div>
                <span className="text-[11px] text-neutral-400">{rev.location}</span>
              </div>

              <div className="text-right">
                <span className="text-[11px] font-medium text-neutral-700 block">
                  {rev.productName}
                </span>
                {rev.fitRating && (
                  <span className="text-[10px] text-neutral-400">
                    Fit: <strong>{rev.fitRating}</strong>
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Write a Review Modal */}
      <AnimatePresence>
        {isWriteReviewOpen && (
          <div
            id="write-review-modal-overlay"
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              id="write-review-modal-content"
              className="bg-[#FAF9F6] w-full max-w-lg rounded-3xl shadow-2xl border border-neutral-200 p-6 sm:p-8 overflow-hidden"
            >
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-neutral-200">
                <h3 className="font-serif text-2xl text-neutral-950 font-medium">
                  Submit Client Review
                </h3>
                <button
                  onClick={() => setIsWriteReviewOpen(false)}
                  className="p-1 rounded-full text-neutral-400 hover:text-neutral-900"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleReviewSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
                    Select Garment / Object
                  </label>
                  <select
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white border border-neutral-300 rounded-xl focus:outline-none focus:border-neutral-900"
                  >
                    {PRODUCTS.map((p) => (
                      <option key={p.id} value={p.name}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
                    Rating
                  </label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((num) => (
                      <button
                        type="button"
                        key={num}
                        onClick={() => setRating(num)}
                        className="p-1"
                      >
                        <Star
                          className={`w-6 h-6 transition-colors ${
                            num <= rating ? 'fill-amber-400 text-amber-400' : 'text-neutral-300'
                          }`}
                        />
                      </button>
                    ))}
                    <span className="text-xs font-bold text-neutral-700 ml-2">
                      {rating} out of 5 Stars
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
                      Your Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Lady Vivienne"
                      value={authorName}
                      onChange={(e) => setAuthorName(e.target.value)}
                      required
                      className="w-full px-3 py-2 text-xs bg-white border border-neutral-300 rounded-xl focus:outline-none focus:border-neutral-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
                      City & Country
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Geneva, Switzerland"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-white border border-neutral-300 rounded-xl focus:outline-none focus:border-neutral-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
                    Review Headline
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Supreme texture and exquisite packaging"
                    value={reviewTitle}
                    onChange={(e) => setReviewTitle(e.target.value)}
                    required
                    className="w-full px-3 py-2 text-xs bg-white border border-neutral-300 rounded-xl focus:outline-none focus:border-neutral-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
                    Your Experience
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Describe the fabric quality, comfort, compliments received..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    required
                    className="w-full px-3 py-2 text-xs bg-white border border-neutral-300 rounded-xl focus:outline-none focus:border-neutral-900 resize-none"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3.5 bg-neutral-950 hover:bg-neutral-800 text-white rounded-xl text-xs font-bold uppercase tracking-widest shadow-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>Publish Review</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
