import React from 'react';
import { Instagram, ArrowUpRight, Sparkles } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { PRODUCTS } from '../data/products';

const UGC_POSTS = [
  {
    id: 'ugc-1',
    user: '@eleanor_interiors',
    image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=600&q=80',
    productId: 'prod-1',
    caption: 'Morning sunlight on the Signature Sateen Core Sheet Set in Warm Ivory.',
  },
  {
    id: 'ugc-2',
    user: '@cotswolds_sanctuary',
    image: 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=600&q=80',
    productId: 'prod-2',
    caption: 'Stonewashed French Normandy flax duvet cover. Lived-in luxury.',
  },
  {
    id: 'ugc-3',
    user: '@nordic_linen',
    image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=600&q=80',
    productId: 'prod-4',
    caption: 'Honeycomb waffle weave bedspread layered for cozy autumn mornings.',
  },
  {
    id: 'ugc-4',
    user: '@belgian_drapery',
    image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80',
    productId: 'prod-5',
    caption: 'Weighted Belgian linen curtains filtering natural afternoon light.',
  },
  {
    id: 'ugc-5',
    user: '@camille_bedding',
    image: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=600&q=80',
    productId: 'prod-7',
    caption: 'Mulberry silk pillowcases in Champagne Ivory for restorative sleep.',
  },
];

export const InstagramFeed: React.FC = () => {
  const { setSelectedProductForQuickView } = useShop();

  const handlePostClick = (productId: string) => {
    const prod = PRODUCTS.find((p) => p.id === productId);
    if (prod) {
      setSelectedProductForQuickView(prod);
    }
  };

  return (
    <section id="ugc-community-section" className="py-16 bg-[#F7F5F0] border-y border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-neutral-500 font-semibold">
            <Instagram className="w-3.5 h-3.5 text-neutral-800" />
            <span>Curated Bed & Bedroom Living</span>
          </div>
          <h3 className="font-serif text-3xl sm:text-4xl text-neutral-950 font-normal">
            Styled in Thoughtful Sanctuaries
          </h3>
          <p className="text-xs sm:text-sm text-neutral-600 font-light">
            Tag <strong className="text-neutral-900 font-medium">@BoskiLimited</strong> or <strong className="text-neutral-900 font-medium">#BoskiLimited</strong> on Instagram to be featured in our seasonal bedroom galleries.
          </p>
        </div>

        {/* Grid of UGC Posts */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 sm:gap-4">
          {UGC_POSTS.map((post) => (
            <div
              key={post.id}
              onClick={() => handlePostClick(post.productId)}
              className="group relative rounded-xl overflow-hidden aspect-square cursor-pointer bg-neutral-200 shadow-sm"
            >
              <img
                src={post.image}
                alt={post.caption}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-3.5 text-white">
                <div className="flex justify-between items-center text-xs font-semibold">
                  <span>{post.user}</span>
                  <ArrowUpRight className="w-4 h-4" />
                </div>
                <p className="text-[11px] font-light leading-snug line-clamp-3">
                  {post.caption}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
