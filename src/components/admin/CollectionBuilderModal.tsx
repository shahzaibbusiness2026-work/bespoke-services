'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  Plus,
  Trash2,
  Upload,
  Layers,
  Sparkles,
  Check,
  Calendar,
  Image as ImageIcon,
  ArrowRight,
  ArrowLeft,
  Search,
  CheckCircle2,
  FileText,
  Sliders,
  Eye,
} from 'lucide-react';
import { Collection, CollectionSeason, CollectionStatus, Product } from '../../types';

interface CollectionBuilderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (collectionData: Omit<Collection, 'id' | 'createdAt'>) => Promise<void>;
  editingCollection?: Collection | null;
  products: Product[];
  isDarkMode: boolean;
  showToast: (title: string, subtitle?: string, type?: 'info' | 'success') => void;
}

export const CollectionBuilderModal: React.FC<CollectionBuilderModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingCollection,
  products,
  isDarkMode,
  showToast,
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    season: 'Autumn' as CollectionSeason,
    year: 2026,
    status: 'active' as CollectionStatus,
    story: '',
    designInspiration: '',
    craftsmanship: '',
    designerNotes: '',
    materialPhilosophy: '',
    coverImage: '',
    gallery: [] as string[],
    newGalleryUrl: '',
    productIds: [] as string[],
    launchDate: '2026-09-15',
    featured: true,
    homepageVisible: true,
    seoTitle: '',
    seoDescription: '',
  });

  const [productSearch, setProductSearch] = useState('');
  const [productCategoryFilter, setProductCategoryFilter] = useState('all');

  // Pre-fill when editing
  useEffect(() => {
    if (editingCollection) {
      setFormData({
        name: editingCollection.name || '',
        slug: editingCollection.slug || '',
        description: editingCollection.description || '',
        season: editingCollection.season || 'Autumn',
        year: editingCollection.year || 2026,
        status: editingCollection.status || 'active',
        story: editingCollection.story || '',
        designInspiration: editingCollection.designInspiration || '',
        craftsmanship: editingCollection.craftsmanship || '',
        designerNotes: '',
        materialPhilosophy: editingCollection.materialPhilosophy || '',
        coverImage: editingCollection.coverImage || '',
        gallery: editingCollection.gallery || [],
        newGalleryUrl: '',
        productIds: editingCollection.productIds || [],
        launchDate: editingCollection.launchDate || new Date().toISOString().split('T')[0],
        featured: editingCollection.featured !== undefined ? editingCollection.featured : true,
        homepageVisible: editingCollection.homepageVisible !== undefined ? editingCollection.homepageVisible : true,
        seoTitle: editingCollection.seoTitle || '',
        seoDescription: editingCollection.seoDescription || '',
      });
      setCurrentStep(1);
    } else {
      // Default new collection template
      setFormData({
        name: '',
        slug: '',
        description: '',
        season: 'Autumn',
        year: 2026,
        status: 'active',
        story: '',
        designInspiration: '',
        craftsmanship: '',
        designerNotes: '',
        materialPhilosophy: '100% GOTS Certified Organic European Flax & Egyptian Cotton',
        coverImage: 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=1600&q=85',
        gallery: [
          'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=1200&q=85',
          'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1200&q=85',
        ],
        newGalleryUrl: '',
        productIds: ['prod-1', 'prod-2'],
        launchDate: '2026-09-15',
        featured: true,
        homepageVisible: true,
        seoTitle: '',
        seoDescription: '',
      });
      setCurrentStep(1);
    }
  }, [editingCollection, isOpen]);

  // Auto-slug on name change
  const handleNameChange = (val: string) => {
    const slug = val
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    setFormData((prev) => ({
      ...prev,
      name: val,
      slug: prev.slug && prev.slug !== '' && editingCollection ? prev.slug : slug,
      seoTitle: prev.seoTitle || `${val} | BOSKI LIMITED Atelier`,
    }));
  };

  // Add image to gallery
  const handleAddGalleryImage = () => {
    if (!formData.newGalleryUrl.trim()) return;
    setFormData((prev) => ({
      ...prev,
      gallery: [...prev.gallery, prev.newGalleryUrl.trim()],
      newGalleryUrl: '',
    }));
  };

  const handleRemoveGalleryImage = (idx: number) => {
    setFormData((prev) => ({
      ...prev,
      gallery: prev.gallery.filter((_, i) => i !== idx),
    }));
  };

  // Toggle product association
  const toggleProductSelection = (id: string) => {
    setFormData((prev) => {
      const exists = prev.productIds.includes(id);
      return {
        ...prev,
        productIds: exists ? prev.productIds.filter((pId) => pId !== id) : [...prev.productIds, id],
      };
    });
  };

  // Validation before advancing
  const handleNextStep = () => {
    if (currentStep === 1) {
      if (!formData.name.trim()) {
        showToast('Required Field Missing', 'Please enter a collection name.', 'info');
        return;
      }
    }
    if (currentStep === 3) {
      if (!formData.coverImage.trim()) {
        showToast('Media Required', 'Please set a primary cover image for this collection.', 'info');
        return;
      }
    }
    setCurrentStep((prev) => Math.min(prev + 1, 5));
  };

  const handlePrevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  // Final submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.coverImage.trim()) {
      showToast('Validation Error', 'Collection name and cover image are required.', 'info');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSave({
        name: formData.name.trim(),
        slug: formData.slug.trim() || formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        description: formData.description.trim(),
        story: formData.story.trim(),
        designInspiration: formData.designInspiration.trim(),
        craftsmanship: formData.craftsmanship.trim(),
        materialPhilosophy: formData.materialPhilosophy.trim(),
        season: formData.season,
        year: Number(formData.year) || 2026,
        status: formData.status,
        coverImage: formData.coverImage.trim(),
        gallery: formData.gallery,
        launchDate: formData.launchDate,
        featured: formData.featured,
        homepageVisible: formData.homepageVisible,
        seoTitle: formData.seoTitle || `${formData.name} | BOSKI LIMITED Atelier`,
        seoDescription: formData.seoDescription || formData.description,
        productIds: formData.productIds,
        productCount: formData.productIds.length,
      });

      onClose();
    } catch (err: any) {
      showToast('Save Failed', err.message || 'Could not save collection.', 'info');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  // Filter products for Step 4
  const filteredProducts = products.filter((p) => {
    const matchesCat = productCategoryFilter === 'all' || p.category.toLowerCase() === productCategoryFilter.toLowerCase();
    const q = productSearch.toLowerCase().trim();
    const matchesQ = !q || p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q) || (p.material && p.material.toLowerCase().includes(q));
    return matchesCat && matchesQ;
  });

  // Color tokens
  const gold = '#C9A227';
  const modalBg = isDarkMode ? 'bg-[#141716] border-[#222624] text-[#F5F1E8]' : 'bg-white border-[#E6E1D8] text-[#171717]';
  const inputClass = `w-full px-4 py-3 border outline-none text-sm transition-colors rounded-none ${
    isDarkMode
      ? 'bg-[#181B1A] border-[#2E3330] text-[#F5F1E8] focus:border-[#C9A227] placeholder-[#6B665F]'
      : 'bg-[#FAF8F3] border-[#DCD6CA] text-[#171717] focus:border-[#171717] placeholder-[#9C9890]'
  }`;
  const labelClass = `block text-[10.5px] uppercase tracking-[0.2em] font-semibold mb-1.5 ${
    isDarkMode ? 'text-[#C9A227]' : 'text-[#595652]'
  }`;

  const steps = [
    { num: 1, label: 'Identity' },
    { num: 2, label: 'Storytelling' },
    { num: 3, label: 'Media' },
    { num: 4, label: 'Products' },
    { num: 5, label: 'Launch' },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto"
      onClick={onClose}
    >
      <div
        className={`w-full max-w-4xl border shadow-2xl overflow-hidden flex flex-col max-h-[92vh] transition-all duration-300 my-auto ${modalBg}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-6 sm:p-8 border-b border-inherit flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="p-2 border border-inherit" style={{ color: gold }}>
              <Layers className="w-5 h-5" />
            </span>
            <div>
              <span className="text-[10px] uppercase tracking-[0.25em] font-bold" style={{ color: gold }}>
                Atelier Collection Architect
              </span>
              <h2
                className="text-2xl font-normal tracking-tight"
                style={{ fontFamily: "'Libre Caslon Text', Georgia, serif" }}
              >
                {editingCollection ? `Edit Collection: ${editingCollection.name}` : 'Create Luxury Collection'}
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center border border-inherit hover:opacity-60 transition-opacity cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 5-Step Progress Stepper */}
        <div className="px-6 sm:px-8 py-4 border-b border-inherit bg-black/5 dark:bg-black/20 flex items-center justify-between overflow-x-auto">
          {steps.map((s, idx) => (
            <div key={s.num} className="flex items-center gap-2 sm:gap-3 shrink-0">
              <button
                type="button"
                onClick={() => setCurrentStep(s.num)}
                className={`w-7 h-7 flex items-center justify-center text-xs font-mono font-bold transition-all cursor-pointer ${
                  currentStep === s.num
                    ? 'bg-[#C9A227] text-black shadow-sm'
                    : currentStep > s.num
                    ? 'bg-emerald-500/20 text-emerald-500 border border-emerald-500/40'
                    : isDarkMode
                    ? 'border border-[#2E3330] text-[#6B665F]'
                    : 'border border-[#E6E1D8] text-[#9C9890]'
                }`}
              >
                {currentStep > s.num ? <Check className="w-3.5 h-3.5" /> : s.num}
              </button>
              <span
                className={`text-xs uppercase tracking-wider font-semibold ${
                  currentStep === s.num ? (isDarkMode ? 'text-[#F5F1E8]' : 'text-black') : 'text-inherit opacity-50'
                }`}
              >
                {s.label}
              </span>
              {idx < steps.length - 1 && (
                <div className={`w-8 sm:w-12 h-[1px] mx-1 sm:mx-2 ${isDarkMode ? 'bg-[#2E3330]' : 'bg-[#E6E1D8]'}`} />
              )}
            </div>
          ))}
        </div>

        {/* Step Body */}
        <div className="p-6 sm:p-8 flex-grow overflow-y-auto space-y-6">
          {/* STEP 1: Collection Identity */}
          {currentStep === 1 && (
            <div className="space-y-5 animate-fadeIn">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className={labelClass}>Collection Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    placeholder="e.g. Winter Heritage Collection"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>URL Slug *</label>
                  <input
                    type="text"
                    required
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="winter-heritage-collection"
                    className={inputClass}
                  />
                </div>
              </div>

              <div>
                <label className={labelClass}>Editorial Description</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief synopsis summarizing this seasonal curation for public catalog cards and lookbook hero sections..."
                  className={inputClass}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <div>
                  <label className={labelClass}>Season *</label>
                  <select
                    value={formData.season}
                    onChange={(e) => setFormData({ ...formData, season: e.target.value as CollectionSeason })}
                    className={inputClass}
                  >
                    <option value="Spring">Spring</option>
                    <option value="Summer">Summer</option>
                    <option value="Autumn">Autumn</option>
                    <option value="Winter">Winter</option>
                  </select>
                </div>

                <div>
                  <label className={labelClass}>Release Year</label>
                  <input
                    type="number"
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: Number(e.target.value) })}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>Launch Status *</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as CollectionStatus })}
                    className={inputClass}
                  >
                    <option value="active">Active (Visible)</option>
                    <option value="upcoming">Upcoming (Teaser)</option>
                    <option value="draft">Draft (Private)</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Collection Storytelling */}
          {currentStep === 2 && (
            <div className="space-y-5 animate-fadeIn">
              <div className="p-4 border border-amber-500/30 bg-amber-500/5">
                <p className="text-xs font-serif italic text-amber-600 dark:text-amber-400">
                  &ldquo;Luxury fashion houses do not simply retail goods; they communicate generational heritage, provenance, and tactile philosophies.&rdquo;
                </p>
              </div>

              <div>
                <label className={labelClass}>Collection Story (Full Narrative)</label>
                <textarea
                  rows={4}
                  value={formData.story}
                  onChange={(e) => setFormData({ ...formData, story: e.target.value })}
                  placeholder="Conceived during deep alpine midwinters, our Winter Heritage suite is woven on generational Dornier shuttle looms..."
                  className={inputClass}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className={labelClass}>Design Inspiration</label>
                  <textarea
                    rows={3}
                    value={formData.designInspiration}
                    onChange={(e) => setFormData({ ...formData, designInspiration: e.target.value })}
                    placeholder="e.g. Architectural interiors of Flanders, Axel Vervoordt tonal calm, minimalist chateaux..."
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>Craftsmanship &amp; Loom Techniques</label>
                  <textarea
                    rows={3}
                    value={formData.craftsmanship}
                    onChange={(e) => setFormData({ ...formData, craftsmanship: e.target.value })}
                    placeholder="e.g. Hand-finished hemstitch borders, weighted lead perimeter seams, forty-six step dew-retting..."
                    className={inputClass}
                  />
                </div>
              </div>

              <div>
                <label className={labelClass}>Material Philosophy &amp; Sourcing</label>
                <input
                  type="text"
                  value={formData.materialPhilosophy}
                  onChange={(e) => setFormData({ ...formData, materialPhilosophy: e.target.value })}
                  placeholder="e.g. 100% GOTS Certified Organic Normandy Flax & Extra Long-Staple Egyptian Giza Cotton"
                  className={inputClass}
                />
              </div>
            </div>
          )}

          {/* STEP 3: Collection Media */}
          {currentStep === 3 && (
            <div className="space-y-5 animate-fadeIn">
              <div>
                <label className={labelClass}>Primary Cover Image URL *</label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={formData.coverImage}
                    onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                    placeholder="https://images.unsplash.com/photo-..."
                    className={inputClass}
                  />
                </div>
                {formData.coverImage && (
                  <div className="mt-3 aspect-[21/9] w-full max-w-lg border overflow-hidden relative border-inherit">
                    <img
                      src={formData.coverImage}
                      alt="Cover Preview"
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute bottom-2 left-2 px-2 py-1 bg-black/80 text-white text-[10px] uppercase font-mono tracking-wider">
                      Primary Cover Hero
                    </span>
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-inherit">
                <label className={labelClass}>Campaign &amp; Gallery Photos</label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={formData.newGalleryUrl}
                    onChange={(e) => setFormData({ ...formData, newGalleryUrl: e.target.value })}
                    placeholder="Add high-res campaign photo URL..."
                    className={inputClass}
                  />
                  <button
                    type="button"
                    onClick={handleAddGalleryImage}
                    className="px-5 py-2 text-xs uppercase tracking-wider font-semibold border shrink-0 hover:bg-[#C9A227] hover:text-black transition-colors"
                  >
                    Add
                  </button>
                </div>

                {formData.gallery.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
                    {formData.gallery.map((img, idx) => (
                      <div key={idx} className="group relative aspect-video border overflow-hidden border-inherit">
                        <img src={img} alt={`Gallery ${idx + 1}`} className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => handleRemoveGalleryImage(idx)}
                          className="absolute top-1 right-1 p-1 bg-red-600 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* STEP 4: Add Products */}
          {currentStep === 4 && (
            <div className="space-y-4 animate-fadeIn">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pb-3 border-b border-inherit">
                <div className="relative w-full sm:w-72">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    placeholder="Search products to attach..."
                    className={`${inputClass} pl-9 py-2 text-xs`}
                  />
                </div>
                <div className="text-xs font-mono">
                  <span style={{ color: gold }}>{formData.productIds.length}</span> pieces selected for this collection
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[380px] overflow-y-auto pr-1">
                {filteredProducts.map((prod) => {
                  const isSelected = formData.productIds.includes(prod.id);
                  return (
                    <div
                      key={prod.id}
                      onClick={() => toggleProductSelection(prod.id)}
                      className={`p-3 border flex items-center gap-3 cursor-pointer transition-all duration-200 ${
                        isSelected
                          ? isDarkMode
                            ? 'bg-[#1D211F] border-[#C9A227] text-white ring-1 ring-[#C9A227]'
                            : 'bg-[#FAF6EC] border-[#C9A227] text-black ring-1 ring-[#C9A227]'
                          : isDarkMode
                          ? 'bg-[#181B1A] border-[#2E3330] hover:border-[#6B665F]'
                          : 'bg-[#FAF8F3] border-[#E6E1D8] hover:border-black'
                      }`}
                    >
                      <div className="w-14 h-14 bg-gray-200 border shrink-0 overflow-hidden">
                        <img
                          src={prod.colors?.[0]?.image || prod.images?.[0]}
                          alt={prod.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="min-w-0 flex-grow">
                        <p className="text-xs font-semibold truncate">{prod.name}</p>
                        <p className="text-[11px] opacity-70 truncate">{prod.material || prod.fabric || prod.category}</p>
                        <p className="text-[11px] font-mono mt-0.5">
                          ${prod.price} &bull; Stock: {prod.stockCount}
                        </p>
                      </div>
                      <div
                        className={`w-5 h-5 rounded-none border flex items-center justify-center shrink-0 ${
                          isSelected ? 'bg-[#C9A227] border-[#C9A227] text-black' : 'border-gray-400'
                        }`}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 5: Launch Settings */}
          {currentStep === 5 && (
            <div className="space-y-5 animate-fadeIn">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className={labelClass}>Scheduled Launch Date</label>
                  <input
                    type="date"
                    value={formData.launchDate}
                    onChange={(e) => setFormData({ ...formData, launchDate: e.target.value })}
                    className={inputClass}
                  />
                </div>

                <div className="flex flex-col justify-end space-y-3 pb-1">
                  <label className="flex items-center gap-3 text-xs cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={formData.featured}
                      onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                      className="w-4 h-4 rounded-none accent-[#C9A227]"
                    />
                    <span className="font-medium">Mark as Featured Collection on Storefront</span>
                  </label>

                  <label className="flex items-center gap-3 text-xs cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={formData.homepageVisible}
                      onChange={(e) => setFormData({ ...formData, homepageVisible: e.target.checked })}
                      className="w-4 h-4 rounded-none accent-[#C9A227]"
                    />
                    <span className="font-medium">Visible on Homepage Runway Carousels</span>
                  </label>
                </div>
              </div>

              <div className="pt-4 border-t border-inherit space-y-4">
                <p className="text-xs uppercase tracking-wider font-semibold opacity-80">
                  SEO &amp; Metadata Architecture
                </p>

                <div>
                  <label className={labelClass}>Meta Title</label>
                  <input
                    type="text"
                    value={formData.seoTitle}
                    onChange={(e) => setFormData({ ...formData, seoTitle: e.target.value })}
                    placeholder="e.g. Winter Heritage Collection | Luxury Belgian Linens | BOSKI LIMITED"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>Meta Description</label>
                  <textarea
                    rows={2}
                    value={formData.seoDescription}
                    onChange={(e) => setFormData({ ...formData, seoDescription: e.target.value })}
                    placeholder="High-end organic flax and Egyptian sateen collection engineered for quiet winter sanctuaries..."
                    className={inputClass}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="p-6 sm:p-8 border-t border-inherit flex items-center justify-between bg-black/5 dark:bg-black/20">
          <div>
            {currentStep > 1 && (
              <button
                type="button"
                onClick={handlePrevStep}
                className="px-5 py-2.5 text-xs uppercase tracking-wider font-semibold border flex items-center gap-2 cursor-pointer transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-xs uppercase tracking-wider font-semibold hover:underline cursor-pointer"
            >
              Cancel
            </button>

            {currentStep < 5 ? (
              <button
                type="button"
                onClick={handleNextStep}
                className="px-6 py-2.5 text-xs uppercase tracking-wider font-semibold flex items-center gap-2 transition-all cursor-pointer"
                style={{ backgroundColor: gold, color: '#0B0D0C' }}
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="px-8 py-3 text-xs uppercase tracking-wider font-bold flex items-center gap-2 transition-all cursor-pointer shadow-lg disabled:opacity-60"
                style={{ backgroundColor: gold, color: '#0B0D0C' }}
              >
                {isSubmitting ? (
                  <span>Archiving Collection...</span>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    <span>{editingCollection ? 'Update Collection' : 'Publish Collection'}</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
