import React from 'react';
import { useShop } from '../context/ShopContext';

export const TheCanvasPage: React.FC = () => {
  const { setActivePage } = useShop();

  const articles = [
    {
      category: 'Craftsmanship',
      title: 'The Thread That Binds: Inside Our Weaving Process',
      excerpt: 'From field to bedroom, our master weavers in Portugal transform sustainably grown flax into the world\'s finest linen. A journey of forty-six steps.',
      image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=85',
      date: 'October 2024',
    },
    {
      category: 'Sustainability',
      title: 'OEKO-TEX Certified: Our Promise to the Planet',
      excerpt: 'Every thread in our collection carries zero harmful substances. Here\'s the rigorous journey a single piece of linen takes before it ever reaches your home.',
      image: 'https://images.unsplash.com/photo-1616046229478-9901c5536a45?auto=format&fit=crop&w=1200&q=85',
      date: 'September 2024',
    },
    {
      category: 'Interior Design',
      title: 'Layering Textures: The Art of a Quiet Bedroom',
      excerpt: 'Interior designer Amélie Renaud shares her signature approach to building a sanctuary. The right textile is a whisper, not a shout.',
      image: 'https://images.unsplash.com/photo-1540518614846-7ede433c4550?auto=format&fit=crop&w=1200&q=85',
      date: 'August 2024',
    },
  ];

  return (
    <main className="flex-grow bg-[#faf9f7]">
      {/* Hero */}
      <section className="w-full px-5 md:px-16 max-w-[1440px] mx-auto pt-16 md:pt-24 pb-24">
        <p className="text-label-caps text-[#444748] mb-4">The Canvas</p>
        <h1
          className="text-[36px] md:text-[64px] leading-[44px] md:leading-[72px] tracking-[-0.02em] text-[#000000] max-w-3xl mb-8"
          style={{ fontFamily: "'Libre Caslon Text', Georgia, serif", fontWeight: 400 }}
        >
          Stories about the art of fine living
        </h1>
        <p className="text-body-lg text-[#444748] max-w-xl">
          Perspectives on craft, design, and intentional living. A space for ideas that shape the homes we inhabit.
        </p>
      </section>

      {/* Featured Article */}
      <section className="w-full px-5 md:px-16 max-w-[1440px] mx-auto mb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
          <div className="relative overflow-hidden bg-[#efeeec]">
            <img
              src="https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1200&q=85"
              alt="The art of impeccably made beds"
              className="w-full h-full object-cover min-h-[400px] product-img product-card"
            />
          </div>
          <div className="bg-[#f4f3f1] flex flex-col justify-end p-10 md:p-16">
            <p className="text-label-caps text-[#675d50] mb-4">Featured Essay</p>
            <h2
              className="text-headline-lg text-[#000000] mb-6"
              style={{ fontFamily: "'Libre Caslon Text', Georgia, serif" }}
            >
              The Considered Bed: Notes on Rest as a Design Act
            </h2>
            <p className="text-body-md text-[#444748] mb-8">
              Why the most important room in your home deserves the same level of care as its exterior. A meditation on textiles, ritual, and the room where most of your life actually happens.
            </p>
            <div className="flex items-center justify-between">
              <span className="text-body-sm text-[#444748]">November 2024 · 8 min read</span>
              <button
                className="text-label-caps text-[#000000] flex items-center gap-2 hover:gap-3 transition-all duration-300 group"
              >
                Read Essay
                <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform" style={{ fontVariationSettings: "'wght' 300" }}>
                  arrow_forward
                </span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Article Grid */}
      <section className="w-full px-5 md:px-16 max-w-[1440px] mx-auto mb-24 border-t border-[#c4c7c7]/30 pt-16">
        <div className="flex items-center justify-between mb-12">
          <h3
            className="text-headline-sm text-[#000000]"
            style={{ fontFamily: "'Libre Caslon Text', Georgia, serif" }}
          >
            Recent Articles
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-16">
          {articles.map((article) => (
            <article key={article.title} className="group cursor-pointer product-card">
              <div className="aspect-[4/3] overflow-hidden bg-[#efeeec] mb-5">
                <img
                  src={article.image}
                  alt={article.title}
                  className="product-img w-full h-full object-cover"
                />
              </div>
              <p className="text-label-caps text-[#675d50] mb-2">{article.category}</p>
              <h4
                className="text-headline-sm text-[#000000] mb-3 leading-snug"
                style={{ fontFamily: "'Libre Caslon Text', Georgia, serif" }}
              >
                {article.title}
              </h4>
              <p className="text-body-sm text-[#444748] line-clamp-3 mb-4">{article.excerpt}</p>
              <div className="flex items-center justify-between">
                <span className="text-label-caps text-[#c4c7c7]">{article.date}</span>
                <span className="text-label-caps text-[#000000] flex items-center gap-1 group-hover:gap-2 transition-all duration-300">
                  Read
                  <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'wght' 300" }}>arrow_forward</span>
                </span>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="w-full bg-[#f4f3f1] border-y border-[#c4c7c7]/30 py-24">
        <div className="w-full px-5 md:px-16 max-w-[1440px] mx-auto text-center">
          <h2
            className="text-headline-md text-[#000000] mb-4"
            style={{ fontFamily: "'Libre Caslon Text', Georgia, serif" }}
          >
            Subscribe to The Canvas
          </h2>
          <p className="text-body-md text-[#444748] mb-8 max-w-md mx-auto">
            Essays on craft, design, and intentional living, delivered to your inbox quarterly.
          </p>
          <form
            className="flex justify-center max-w-sm mx-auto border-b border-[#c4c7c7]"
            onSubmit={(e) => { e.preventDefault(); }}
          >
            <input
              type="email"
              placeholder="Email address"
              className="flex-grow bg-transparent text-body-md text-[#000000] placeholder-[#444748]/50 py-3 focus:outline-none"
            />
            <button
              type="submit"
              className="text-label-caps text-[#000000] py-3 pl-4 hover:opacity-70 transition-opacity whitespace-nowrap"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </main>
  );
};
