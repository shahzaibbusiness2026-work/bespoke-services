'use client';

import React, { useState } from 'react';
import {
  Layers,
  Plus,
  Search,
  Filter,
  Calendar,
  Edit,
  Trash2,
  ExternalLink,
  Eye,
  CheckCircle2,
  Sparkles,
  Package,
  ArrowRight,
  BookOpen,
  X,
} from 'lucide-react';
import { Collection, CollectionSeason, CollectionStatus, Product } from '../../types';

interface CollectionsTabProps {
  collections: Collection[];
  products: Product[];
  isDarkMode: boolean;
  onOpenCreateModal: () => void;
  onOpenEditModal: (col: Collection) => void;
  onDeleteCollection: (id: string, name: string) => void;
  onViewProductsInCollection: (colId: string) => void;
}

export const CollectionsTab: React.FC<CollectionsTabProps> = ({
  collections,
  products,
  isDarkMode,
  onOpenCreateModal,
  onOpenEditModal,
  onDeleteCollection,
  onViewProductsInCollection,
}) => {
  const [search, setSearch] = useState('');
  const [seasonFilter, setSeasonFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [viewingCollection, setViewingCollection] = useState<Collection | null>(null);

  const filteredCollections = collections.filter((col) => {
    const matchesSeason = seasonFilter === 'all' || col.season.toLowerCase() === seasonFilter.toLowerCase();
    const matchesStatus = statusFilter === 'all' || col.status.toLowerCase() === statusFilter.toLowerCase();
    const q = search.toLowerCase().trim();
    const matchesQ =
      !q ||
      col.name.toLowerCase().includes(q) ||
      col.description.toLowerCase().includes(q) ||
      (col.story && col.story.toLowerCase().includes(q));

    return matchesSeason && matchesStatus && matchesQ;
  });

  const gold = '#C9A227';
  const cardBg = isDarkMode ? 'bg-[#141716] border-[#222624]' : 'bg-white border-[#E6E1D8]';
  const textPrimary = isDarkMode ? 'text-[#F5F1E8]' : 'text-[#171717]';
  const textSecondary = isDarkMode ? 'text-[#A9A39A]' : 'text-[#595652]';

  const statusBadge = (status: CollectionStatus) => {
    switch (status) {
      case 'active':
        return (
          <span className="px-2.5 py-1 text-[10px] uppercase font-mono tracking-wider bg-emerald-500/15 text-emerald-500 border border-emerald-500/30">
            Active
          </span>
        );
      case 'upcoming':
        return (
          <span className="px-2.5 py-1 text-[10px] uppercase font-mono tracking-wider bg-blue-500/15 text-blue-400 border border-blue-500/30">
            Upcoming
          </span>
        );
      case 'draft':
        return (
          <span className="px-2.5 py-1 text-[10px] uppercase font-mono tracking-wider bg-amber-500/15 text-amber-500 border border-amber-500/30">
            Draft
          </span>
        );
      case 'archived':
        return (
          <span className="px-2.5 py-1 text-[10px] uppercase font-mono tracking-wider bg-gray-500/15 text-gray-400 border border-gray-500/30">
            Archived
          </span>
        );
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header with Counter and Create Action */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-inherit">
        <div className="space-y-1">
          <span className="text-[11px] uppercase tracking-[0.25em] font-semibold" style={{ color: gold }}>
            Curation Architecture &bull; Seasonal Suites
          </span>
          <h2
            className={`text-3xl sm:text-4xl font-normal tracking-tight ${textPrimary}`}
            style={{ fontFamily: "'Libre Caslon Text', Georgia, serif" }}
          >
            Collections Management
          </h2>
          <p className={`text-sm font-light ${textSecondary}`}>
            Curate private releases, configure seasonal launches, and orchestrate storytelling.
          </p>
        </div>

        <button
          onClick={onOpenCreateModal}
          className="px-6 py-3 text-xs uppercase tracking-[0.16em] font-semibold flex items-center gap-2.5 transition-all duration-200 cursor-pointer shadow-md hover:scale-[1.02] self-start md:self-auto"
          style={{ backgroundColor: gold, color: '#0B0D0C' }}
        >
          <Plus className="w-4 h-4" />
          <span>Create Collection</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className={`p-4 sm:p-5 border flex flex-col md:flex-row items-center justify-between gap-4 ${cardBg}`}>
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search collections by name or story..."
            className={`w-full pl-10 pr-4 py-2 text-xs border outline-none rounded-none transition-colors ${
              isDarkMode
                ? 'bg-[#181B1A] border-[#2E3330] text-[#F5F1E8] focus:border-[#C9A227]'
                : 'bg-[#FAF8F3] border-[#E6E1D8] text-[#171717] focus:border-black'
            }`}
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Season Filter */}
          <select
            value={seasonFilter}
            onChange={(e) => setSeasonFilter(e.target.value)}
            className={`px-3 py-2 text-xs border outline-none rounded-none cursor-pointer ${
              isDarkMode ? 'bg-[#181B1A] border-[#2E3330] text-[#F5F1E8]' : 'bg-[#FAF8F3] border-[#E6E1D8] text-[#171717]'
            }`}
          >
            <option value="all">All Seasons</option>
            <option value="Spring">Spring</option>
            <option value="Summer">Summer</option>
            <option value="Autumn">Autumn</option>
            <option value="Winter">Winter</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className={`px-3 py-2 text-xs border outline-none rounded-none cursor-pointer ${
              isDarkMode ? 'bg-[#181B1A] border-[#2E3330] text-[#F5F1E8]' : 'bg-[#FAF8F3] border-[#E6E1D8] text-[#171717]'
            }`}
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="upcoming">Upcoming</option>
            <option value="draft">Draft</option>
            <option value="archived">Archived</option>
          </select>

          <span className={`text-xs font-mono ml-auto md:ml-2 ${textSecondary}`}>
            {filteredCollections.length} of {collections.length}
          </span>
        </div>
      </div>

      {/* Collection Cards Grid */}
      {filteredCollections.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredCollections.map((col) => (
            <div
              key={col.id}
              className={`border flex flex-col justify-between group transition-all duration-300 hover:border-[#C9A227] overflow-hidden ${cardBg}`}
            >
              {/* Cover Photo with aspect ratio */}
              <div className="aspect-[16/9] relative overflow-hidden bg-black/40 border-b border-inherit">
                <img
                  src={col.coverImage}
                  alt={col.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 will-change-transform"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

                {/* Floating Badges */}
                <div className="absolute top-3 left-3 z-10 flex items-center gap-2">
                  <span className="px-2.5 py-1 text-[10px] uppercase font-mono tracking-wider bg-black/75 backdrop-blur-sm text-[#F5F1E8] border border-white/20">
                    {col.season} {col.year}
                  </span>
                  {statusBadge(col.status)}
                </div>

                <div className="absolute top-3 right-3 z-10">
                  <span className="px-2.5 py-1 text-[10px] uppercase font-mono tracking-wider bg-[#C9A227] text-black font-bold shadow-sm">
                    {col.productIds?.length || col.productCount || 0} Pieces
                  </span>
                </div>

                {/* Cover Bottom Snippet */}
                <div className="absolute bottom-3 left-3 right-3 z-10 text-white">
                  <h3
                    className="text-xl font-normal tracking-tight drop-shadow-sm"
                    style={{ fontFamily: "'Libre Caslon Text', Georgia, serif" }}
                  >
                    {col.name}
                  </h3>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 flex flex-col justify-between flex-grow space-y-4">
                <p className={`text-xs font-light leading-relaxed line-clamp-2 ${textSecondary}`}>
                  {col.description || col.story || 'Exclusive seasonal release from the BOSKI LIMITED atelier.'}
                </p>

                {/* Storytelling Tags */}
                {col.materialPhilosophy && (
                  <div className="pt-2 border-t border-inherit">
                    <span className="text-[10px] uppercase tracking-wider font-semibold opacity-70 block mb-0.5">
                      Material Provenance:
                    </span>
                    <p className={`text-[11px] font-mono truncate ${textPrimary}`}>
                      {col.materialPhilosophy}
                    </p>
                  </div>
                )}

                {/* Metadata Strip */}
                <div className="flex items-center justify-between text-[11px] font-mono pt-2 border-t border-inherit opacity-75">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Launch: {col.launchDate}</span>
                  </span>
                  {col.featured && (
                    <span className="text-[#C9A227] font-semibold uppercase tracking-wider">
                      &bull; Featured
                    </span>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="pt-3 border-t border-inherit flex items-center justify-between gap-2">
                  <button
                    onClick={() => setViewingCollection(col)}
                    className={`px-3.5 py-2 text-[11px] uppercase tracking-wider font-semibold border flex items-center gap-1.5 transition-colors cursor-pointer ${
                      isDarkMode
                        ? 'border-[#2D322F] hover:border-[#C9A227] hover:text-[#C9A227]'
                        : 'border-[#E6E1D8] hover:border-black hover:text-black'
                    }`}
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View Story</span>
                  </button>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onOpenEditModal(col)}
                      className={`p-2 border hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer ${
                        isDarkMode ? 'border-[#2D322F] text-gray-300' : 'border-[#E6E1D8] text-gray-700'
                      }`}
                      title="Edit Collection"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => onDeleteCollection(col.id, col.name)}
                      className="p-2 border border-red-500/20 text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
                      title="Delete Collection"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Premium Empty State */
        <div className={`p-12 sm:p-16 border text-center space-y-4 max-w-xl mx-auto ${cardBg}`}>
          <span className="w-14 h-14 mx-auto border flex items-center justify-center border-[#C9A227] text-[#C9A227]">
            <Layers className="w-7 h-7" />
          </span>
          <h3
            className={`text-2xl font-normal ${textPrimary}`}
            style={{ fontFamily: "'Libre Caslon Text', Georgia, serif" }}
          >
            No Collections Created Yet
          </h3>
          <p className={`text-xs font-light leading-relaxed max-w-md mx-auto ${textSecondary}`}>
            Start building your first luxury collection. Group textiles, curate seasonal lookbooks, and establish brand narratives for your clients.
          </p>
          <button
            onClick={onOpenCreateModal}
            className="mt-4 px-6 py-3 text-xs uppercase tracking-[0.16em] font-semibold transition-all cursor-pointer shadow-md inline-flex items-center gap-2"
            style={{ backgroundColor: gold, color: '#0B0D0C' }}
          >
            <Plus className="w-4 h-4" />
            <span>Create Collection</span>
          </button>
        </div>
      )}

      {/* Collection Dossier Modal (View Story Details) */}
      {viewingCollection && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto"
          onClick={() => setViewingCollection(null)}
        >
          <div
            className={`w-full max-w-3xl border p-8 sm:p-10 shadow-2xl relative space-y-6 ${
              isDarkMode ? 'bg-[#141716] border-[#222624] text-[#F5F1E8]' : 'bg-white border-[#E6E1D8] text-[#171717]'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setViewingCollection(null)}
              className="absolute top-6 right-6 p-2 border border-inherit hover:opacity-60 transition-opacity cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <span className="text-xs uppercase font-mono tracking-widest text-[#C9A227]">
                  {viewingCollection.season} {viewingCollection.year} Collection
                </span>
                {statusBadge(viewingCollection.status)}
              </div>
              <h2
                className="text-3xl font-normal"
                style={{ fontFamily: "'Libre Caslon Text', Georgia, serif" }}
              >
                {viewingCollection.name}
              </h2>
            </div>

            <div className="aspect-[21/9] overflow-hidden border border-inherit relative">
              <img
                src={viewingCollection.coverImage}
                alt={viewingCollection.name}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="space-y-4 text-xs font-light leading-relaxed">
              <div>
                <span className="text-[10.5px] uppercase font-semibold tracking-wider text-[#C9A227] block mb-1">
                  Editorial Story:
                </span>
                <p className="text-sm font-serif italic">
                  &ldquo;{viewingCollection.story || viewingCollection.description}&rdquo;
                </p>
              </div>

              {viewingCollection.designInspiration && (
                <div>
                  <span className="text-[10.5px] uppercase font-semibold tracking-wider text-[#C9A227] block mb-1">
                    Design Inspiration:
                  </span>
                  <p>{viewingCollection.designInspiration}</p>
                </div>
              )}

              {viewingCollection.craftsmanship && (
                <div>
                  <span className="text-[10.5px] uppercase font-semibold tracking-wider text-[#C9A227] block mb-1">
                    Craftsmanship &amp; Shuttle Loom Details:
                  </span>
                  <p>{viewingCollection.craftsmanship}</p>
                </div>
              )}

              {viewingCollection.materialPhilosophy && (
                <div>
                  <span className="text-[10.5px] uppercase font-semibold tracking-wider text-[#C9A227] block mb-1">
                    Material Philosophy:
                  </span>
                  <p className="font-mono">{viewingCollection.materialPhilosophy}</p>
                </div>
              )}
            </div>

            {/* Gallery Strip */}
            {viewingCollection.gallery && viewingCollection.gallery.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-inherit">
                <span className="text-[10.5px] uppercase font-semibold tracking-wider opacity-70 block">
                  Lookbook Campaign Gallery ({viewingCollection.gallery.length} Images)
                </span>
                <div className="grid grid-cols-3 gap-3">
                  {viewingCollection.gallery.map((img, i) => (
                    <div key={i} className="aspect-video border overflow-hidden border-inherit">
                      <img src={img} alt="Gallery" className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-4 border-t border-inherit flex items-center justify-between">
              <button
                onClick={() => {
                  const id = viewingCollection.id;
                  setViewingCollection(null);
                  onViewProductsInCollection(id);
                }}
                className="text-xs uppercase tracking-wider font-semibold hover:underline cursor-pointer"
                style={{ color: gold }}
              >
                View Attached Products ({viewingCollection.productIds?.length || 0}) &rarr;
              </button>

              <button
                onClick={() => {
                  const col = viewingCollection;
                  setViewingCollection(null);
                  onOpenEditModal(col);
                }}
                className="px-5 py-2 text-xs uppercase tracking-wider font-semibold border cursor-pointer hover:bg-[#C9A227] hover:text-black transition-colors"
              >
                Edit Collection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
