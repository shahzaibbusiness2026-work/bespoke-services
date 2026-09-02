'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Package,
  Plus,
  Trash2,
  Edit,
  Upload,
  Layers,
  Inbox,
  LayoutDashboard,
  LogOut,
  CheckCircle2,
  XCircle,
  Copy,
  ExternalLink,
  Search,
  Sparkles,
  Lock,
  ArrowRight,
  ShieldCheck,
  Check,
  Image as ImageIcon,
  Database,
  Activity,
  ArrowUpRight,
  Clock,
  Sun,
  Moon,
  ChevronDown,
  Sliders,
  Folder,
  Eye,
  EyeOff,
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { api, ConsolidatedInquiry, MediaFile } from '../services/api';
import { Product, Collection } from '../types';

// Subcomponents
import { OverviewTab } from './admin/OverviewTab';
import { ProductsTab } from './admin/ProductsTab';
import { CollectionsTab } from './admin/CollectionsTab';
import { CollectionBuilderModal } from './admin/CollectionBuilderModal';
import { MediaDAMTab } from './admin/MediaDAMTab';
import { CRMInquiriesTab } from './admin/CRMInquiriesTab';
import { InventoryTab } from './admin/InventoryTab';

type AdminTab = 'overview' | 'products' | 'collections' | 'categories' | 'media' | 'inquiries' | 'inventory';

export const AdminDashboard: React.FC = () => {
  const {
    currentUser,
    setCurrentUser,
    login,
    logout,
    showToast,
    setActivePage,
    refreshCategories: refreshGlobalCategories,
    refreshProducts: refreshGlobalProducts,
    refreshCollections: refreshGlobalCollections,
    collections: initialCollections,
    isDarkMode,
    toggleTheme,
  } = useShop();

  // Hydration guard to prevent SSR mismatch
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  // Admin Authentication State
  const isAdmin = currentUser?.role === 'admin' || (currentUser?.role as string) === 'superadmin';
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Active Workspace Tab
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');

  // Core Data States
  const [products, setProducts] = useState<Product[]>([]);
  const [collections, setCollections] = useState<Collection[]>(initialCollections || []);
  const [categories, setCategories] = useState<{ category: string; count: number }[]>([]);
  const [mediaList, setMediaList] = useState<MediaFile[]>([]);
  const [inquiries, setInquiries] = useState<ConsolidatedInquiry[]>([]);

  // Modals
  const [isCollectionModalOpen, setIsCollectionModalOpen] = useState(false);
  const [editingCollection, setEditingCollection] = useState<Collection | null>(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [newCategoryName, setNewCategoryName] = useState('');

  // Product Filter from Collection Link
  const [initialCollectionFilter, setInitialCollectionFilter] = useState('all');

  // Product Form State
  const [productFormData, setProductFormData] = useState({
    name: '',
    subtitle: '',
    category: 'bedding',
    collectionIds: [] as string[],
    price: 245,
    originalPrice: 295,
    fabric: '100% Long-Staple Egyptian Cotton Sateen',
    threadCount: '480 Thread Count',
    material: 'Natural Organic Flax & Egyptian Cotton',
    description: '',
    imageUrl: '',
    colorName: 'Natural Oatmeal',
    colorHex: '#D7C7B3',
    inStock: true,
    stockCount: 15,
    isFeatured: true,
  });

  // Fetch all admin data
  const refreshData = useCallback(async () => {
    try {
      const [prodRes, catRes, colRes, mediaRes, inqRes] = await Promise.all([
        api.products.getAll(),
        api.categories.getAll(),
        api.collections.getAll(),
        api.upload.getMediaList(),
        api.inquiries.getAll(),
      ]);

      if (prodRes.success && prodRes.data) {
        setProducts(prodRes.data);
      }
      if (catRes.success && catRes.data) {
        setCategories(catRes.data);
      }
      if (colRes.success && colRes.data) {
        setCollections(colRes.data);
      }
      if (mediaRes.success && mediaRes.data) {
        setMediaList(mediaRes.data);
      }
      if (inqRes.success && inqRes.data) {
        setInquiries(inqRes.data);
      }
    } catch (err) {
      console.warn('[AdminDashboard] Error refreshing console data:', err);
    }
  }, []);

  useEffect(() => {
    if (isAdmin) {
      refreshData();
    }
  }, [isAdmin, refreshData]);

  // Login handler
  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setEmailError('');
    setPasswordError('');

    const trimmedEmail = adminEmail.trim();
    const trimmedPass = adminPassword.trim();

    let hasValidationError = false;

    if (!trimmedEmail) {
      setEmailError('Director email is required.');
      hasValidationError = true;
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(trimmedEmail)) {
        setEmailError('Enter a valid email address.');
        hasValidationError = true;
      }
    }

    if (!trimmedPass) {
      setPasswordError('Security passphrase is required.');
      hasValidationError = true;
    }

    if (hasValidationError) {
      return;
    }

    setIsLoggingIn(true);

    try {
      const normalizedEmail = trimmedEmail.toLowerCase();
      const isSuccess = await login(normalizedEmail, adminPassword);
      if (isSuccess) {
        showToast('Atelier Access Granted', 'Welcome to the Atelier Console', 'success');
        refreshData();
      } else {
        setLoginError('Authentication failed. Verify your director credentials and try again.');
      }
    } catch (err: any) {
      setLoginError(err.message || 'Authentication failed. Verify your director credentials and try again.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  // Sign out handler
  const handleSignOut = () => {
    logout();
    setActivePage('home');
    showToast('Session Terminated', 'Signed out from Atelier Management Console', 'info');
  };

  // Collection Handlers
  const handleSaveCollection = async (collectionData: Omit<Collection, 'id' | 'createdAt'>) => {
    if (editingCollection) {
      const res = await api.collections.update(editingCollection.id, collectionData);
      if (res.success) {
        showToast('Collection Updated', `${collectionData.name} updated successfully`, 'success');
        await refreshData();
        if (refreshGlobalCollections) await refreshGlobalCollections();
      } else {
        showToast('Update Failed', res.error, 'info');
      }
    } else {
      const res = await api.collections.create(collectionData);
      if (res.success) {
        showToast('Collection Created', `${collectionData.name} created successfully`, 'success');
        await refreshData();
        if (refreshGlobalCollections) await refreshGlobalCollections();
      } else {
        showToast('Creation Failed', res.error, 'info');
      }
    }
  };

  const handleDeleteCollection = async (id: string, name: string) => {
    if (window.confirm(`Are you certain you wish to archive and remove "${name}" from active atelier collections?`)) {
      const res = await api.collections.delete(id);
      if (res.success) {
        showToast('Collection Archived', `${name} removed from active curation`, 'info');
        await refreshData();
        if (refreshGlobalCollections) await refreshGlobalCollections();
      }
    }
  };

  // Product Handlers
  const handleOpenCreateProduct = () => {
    setEditingProduct(null);
    setProductFormData({
      name: '',
      subtitle: '',
      category: 'bedding',
      collectionIds: [],
      price: 245,
      originalPrice: 295,
      fabric: '100% Long-Staple Egyptian Cotton Sateen',
      threadCount: '480 Thread Count',
      material: 'Natural Organic Flax & Egyptian Cotton',
      description: '',
      imageUrl: '',
      colorName: 'Natural Oatmeal',
      colorHex: '#D7C7B3',
      inStock: true,
      stockCount: 15,
      isFeatured: true,
    });
    setIsProductModalOpen(true);
  };

  const handleOpenEditProduct = (prod: Product) => {
    setEditingProduct(prod);
    setProductFormData({
      name: prod.name,
      subtitle: prod.subtitle,
      category: prod.category,
      collectionIds: prod.collectionIds || [],
      price: prod.price,
      originalPrice: prod.originalPrice || prod.price,
      fabric: prod.fabric || '100% Long-Staple Egyptian Cotton',
      threadCount: prod.threadCount || '480 Thread Count',
      material: prod.material || 'Natural Organic Flax',
      description: prod.description || '',
      imageUrl: prod.colors?.[0]?.image || prod.images?.[0] || '',
      colorName: prod.colors?.[0]?.name || 'Natural Oatmeal',
      colorHex: prod.colors?.[0]?.hex || '#D7C7B3',
      inStock: prod.inStock,
      stockCount: prod.stockCount || 10,
      isFeatured: Boolean(prod.featured || prod.isBestSeller),
    });
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productFormData.name.trim() || !productFormData.price) {
      showToast('Validation Error', 'Product title and price are required', 'info');
      return;
    }

    const defaultImg =
      productFormData.imageUrl.trim() ||
      'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1200&q=85';

    const payload: Omit<Product, 'id'> = {
      name: productFormData.name.trim(),
      subtitle: productFormData.subtitle.trim() || `${productFormData.threadCount} • Master Loom`,
      category: productFormData.category,
      collectionIds: productFormData.collectionIds,
      price: Number(productFormData.price),
      originalPrice: productFormData.originalPrice ? Number(productFormData.originalPrice) : undefined,
      rating: editingProduct ? editingProduct.rating : 5.0,
      reviewsCount: editingProduct ? editingProduct.reviewsCount : 0,
      inStock: productFormData.inStock,
      stockCount: Number(productFormData.stockCount || 10),
      featured: productFormData.isFeatured,
      isBestSeller: productFormData.isFeatured,
      fabric: productFormData.fabric,
      threadCount: productFormData.threadCount,
      material: productFormData.material,
      description:
        productFormData.description.trim() ||
        `Handcrafted bespoke ${productFormData.name} utilizing premium long-staple yarns finished in our master European mills.`,
      details: [
        `${productFormData.threadCount} weave with bespoke drape`,
        `Fabric: ${productFormData.fabric}`,
        `Origin: Master Loom Certified`,
        'Machine washable on delicate cycle with pH-neutral detergent',
      ],
      careInstructions: 'Cold delicate wash with like linens. Tumble dry low or line dry.',
      sustainability: '100% GOTS & OEKO-TEX Standard 100 Certified organically grown fibers.',
      sku: editingProduct ? editingProduct.sku : `BOSKI-${Date.now().toString().slice(-6)}`,
      tags: [productFormData.category, 'luxury', 'atelier', 'bespoke'],
      sizes: ['Twin', 'Queen', 'King', 'Super King / Cal King'],
      colors: [
        {
          name: productFormData.colorName || 'Natural Flax',
          hex: productFormData.colorHex || '#D7C7B3',
          image: defaultImg,
        },
      ],
      images: [defaultImg],
    };

    if (editingProduct) {
      const res = await api.products.update(editingProduct.id, payload);
      if (res.success) {
        showToast('Product Updated', `Saved changes to ${payload.name}`, 'success');
        setIsProductModalOpen(false);
        await refreshData();
        if (refreshGlobalProducts) await refreshGlobalProducts();
      } else {
        showToast('Update Failed', res.error, 'info');
      }
    } else {
      const res = await api.products.create(payload);
      if (res.success) {
        showToast('Product Created', `Added ${payload.name} to catalog`, 'success');
        setIsProductModalOpen(false);
        await refreshData();
        if (refreshGlobalProducts) await refreshGlobalProducts();
      } else {
        showToast('Creation Failed', res.error, 'info');
      }
    }
  };

  const handleDeleteProduct = async (id: string, name: string) => {
    if (!window.confirm(`Delete product "${name}"?`)) return;
    const res = await api.products.delete(id);
    if (res.success) {
      showToast('Product Deleted', `Removed ${name} from catalog`, 'info');
      await refreshData();
      if (refreshGlobalProducts) await refreshGlobalProducts();
    }
  };

  const handleQuickAdjustStock = async (id: string, newStock: number) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, stockCount: newStock, inStock: newStock > 0 } : p))
    );
    await api.products.update(id, { stockCount: newStock, inStock: newStock > 0 });
  };

  const handleBulkUpdateStatus = async (ids: string[], inStock: boolean) => {
    setProducts((prev) =>
      prev.map((p) =>
        ids.includes(p.id) ? { ...p, inStock, stockCount: inStock ? (p.stockCount > 0 ? p.stockCount : 10) : 0 } : p
      )
    );
    await Promise.all(
      ids.map((id) =>
        api.products.update(id, {
          inStock,
          stockCount: inStock ? 10 : 0,
        })
      )
    );
    showToast('Bulk Status Updated', `Updated ${ids.length} products to ${inStock ? 'In Stock' : 'Sold Out'}`, 'success');
  };

  const handleBulkAssignCollection = async (ids: string[], collectionId: string) => {
    const targetCol = collections.find((c) => c.id === collectionId);
    const targetColName = targetCol ? targetCol.name : 'Collection';

    setProducts((prev) =>
      prev.map((p) => {
        if (ids.includes(p.id)) {
          const cur = p.collectionIds || [];
          return cur.includes(collectionId) ? p : { ...p, collectionIds: [...cur, collectionId] };
        }
        return p;
      })
    );

    await Promise.all(
      ids.map(async (id) => {
        const p = products.find((prod) => prod.id === id);
        const cur = p?.collectionIds || [];
        if (!cur.includes(collectionId)) {
          await api.products.update(id, { collectionIds: [...cur, collectionId] });
        }
      })
    );

    if (targetCol) {
      const updatedPIds = Array.from(new Set([...(targetCol.productIds || []), ...ids]));
      await api.collections.update(collectionId, { productIds: updatedPIds });
    }

    await refreshData();
    showToast('Collection Assigned', `Assigned ${ids.length} products to ${targetColName}`, 'success');
  };

  const handleBulkDelete = async (ids: string[]) => {
    if (window.confirm(`Are you certain you wish to delete ${ids.length} products?`)) {
      setProducts((prev) => prev.filter((p) => !ids.includes(p.id)));
      await Promise.all(ids.map((id) => api.products.delete(id)));
      showToast('Catalog Updated', `Removed ${ids.length} products`, 'info');
      await refreshData();
    }
  };

  // Media Handlers
  const handleUploadImage = async (file: File) => {
    const res = await api.upload.image(file);
    if (res.success && res.data) {
      showToast('Media Synced', `Uploaded ${res.data.filename}`, 'success');
      await refreshData();
    } else {
      showToast('Upload Error', res.error, 'info');
    }
  };

  // CRM Inquiries Handlers
  const handleUpdateInquiryStatus = async (type: 'contact' | 'bespoke' | 'trade', id: string, newStatus: string) => {
    const res = await api.inquiries.updateStatus(id, newStatus as any);
    if (res.success) {
      showToast('Inquiry Stage Updated', `Status changed to ${newStatus}`, 'success');
      await refreshData();
    }
  };

  // Categories Handlers
  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;
    const res = await api.categories.create(newCategoryName.trim());
    if (res.success) {
      showToast('Category Created', `Added ${newCategoryName}`, 'success');
      setNewCategoryName('');
      await refreshData();
      if (refreshGlobalCategories) await refreshGlobalCategories();
    }
  };

  const handleDeleteCategory = async (catName: string) => {
    if (!window.confirm(`Delete category "${catName}"?`)) return;
    const res = await api.categories.delete(catName);
    if (res.success) {
      showToast('Category Removed', catName, 'info');
      await refreshData();
      if (refreshGlobalCategories) await refreshGlobalCategories();
    }
  };

  // View products in specific collection
  const handleViewProductsInCollection = (colId: string) => {
    setInitialCollectionFilter(colId);
    setActiveTab('products');
  };

  // Color & Theme Palette Tokens
  const gold = '#C9A227';
  const consoleBg = isDarkMode ? 'bg-[#0B0D0C] text-[#F5F1E8]' : 'bg-[#FAF8F3] text-[#171717]';
  const headerBg = isDarkMode ? 'bg-[#141716] border-[#222624]' : 'bg-white border-[#E6E1D8]';
  const navBg = isDarkMode ? 'bg-[#101312] border-[#222624]' : 'bg-[#F4EFEA] border-[#E6E1D8]';

  // --- PREVENT SSR HYDRATION MISMATCH ---
  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#0B0D0C] flex items-center justify-center p-6 text-[#F5F1E8]">
        <div className="bg-[#141716] border border-[#222624] w-full max-w-md p-8 shadow-2xl flex flex-col items-center justify-center py-16 space-y-4">
          <div className="w-8 h-8 border-2 border-[#C9A227] border-t-transparent animate-spin" />
          <p className="text-xs font-mono tracking-widest uppercase text-[#C9A227]">
            Initializing Atelier Console...
          </p>
        </div>
      </div>
    );
  }

  // --- ACCESS GATE (When Not Authenticated) ---
  if (!isAdmin) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center p-4 sm:p-6 pb-12 transition-colors duration-300 ${
          isDarkMode ? 'bg-[#151412] text-[#F3EFE7]' : 'bg-[#FAF9F6] text-[#292722]'
        }`}
        style={{ fontFamily: "'Inter', 'Manrope', system-ui, -apple-system, sans-serif" }}
      >
        <div className="w-full max-w-[430px] space-y-7 animate-fadeIn">
          {/* Brand Header */}
          <div className="text-center space-y-2">
            <span className="inline-block text-[10.5px] uppercase tracking-[3.5px] font-medium text-[#C9A227]">
              ATELIER MANAGEMENT CONSOLE
            </span>
            <h1
              className="text-2xl sm:text-[28px] font-normal tracking-[0.22em] text-[#171511] dark:text-[#F3EFE7]"
              style={{ fontFamily: "'Libre Caslon Text', 'Playfair Display', Georgia, serif" }}
            >
              BOSKI LIMITED
            </h1>
            <p className="text-xs text-[#65615A] dark:text-[#A7A197] font-normal tracking-wide max-w-sm mx-auto leading-relaxed">
              Restricted administrative portal for atelier direction &amp; curation.
            </p>
          </div>

          {/* Authentication Card */}
          <div
            className={`border p-6 sm:p-[32px] transition-colors duration-200 ${
              isDarkMode
                ? 'bg-[#1D1B18] border-[#39352E] shadow-[0_20px_45px_rgba(0,0,0,0.45)]'
                : 'bg-[#FCFBF8] border-[#DDD8CE] shadow-[0_20px_45px_rgba(30,25,15,0.08)]'
            }`}
          >
            {/* Card Header: Title & Accessible Theme Toggle */}
            <div
              className={`flex items-center justify-between pb-3.5 border-b ${
                isDarkMode ? 'border-[#2C2923]' : 'border-[#E2DED5]'
              }`}
            >
              <span className="text-[11.5px] uppercase tracking-[1.2px] font-semibold text-[#292722] dark:text-[#F3EFE7]">
                ATELIER CREDENTIALS
              </span>
              <button
                type="button"
                onClick={toggleTheme}
                className={`p-1.5 rounded-none transition-colors duration-150 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A227] flex items-center justify-center ${
                  isDarkMode
                    ? 'text-[#C9A227] hover:bg-[#2A2620]'
                    : 'text-[#65615A] hover:bg-[#EFECE6] hover:text-[#171511]'
                }`}
                aria-label={isDarkMode ? 'Switch to Bright Mode' : 'Switch to Dark Mode'}
              >
                {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>
            </div>

            {/* General Authentication Failure Banner */}
            {loginError && (
              <div
                role="alert"
                className="mt-4 p-3 border border-red-500/30 bg-red-500/10 text-red-600 dark:text-red-400 text-xs font-normal leading-relaxed"
              >
                {loginError}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleAdminLogin} className="mt-5 space-y-4" noValidate>
              {/* Director Email Field */}
              <div>
                <label
                  htmlFor="director-email"
                  className="block text-[10.5px] uppercase tracking-[1px] font-semibold mb-2 text-[#65615A] dark:text-[#A7A197]"
                >
                  DIRECTOR EMAIL
                </label>
                <input
                  id="director-email"
                  type="email"
                  value={adminEmail}
                  onChange={(e) => {
                    setAdminEmail(e.target.value);
                    if (emailError) setEmailError('');
                    if (loginError) setLoginError('');
                  }}
                  placeholder="Enter director email"
                  autoComplete="email"
                  aria-invalid={!!emailError}
                  aria-describedby={emailError ? 'director-email-error' : undefined}
                  className={`w-full h-12 px-3.5 border outline-none text-[13.5px] transition-all duration-150 rounded-none placeholder:text-[#9A958C] dark:placeholder:text-[#746E65] ${
                    isDarkMode
                      ? 'bg-[#201E1A] text-[#F3EFE7]'
                      : 'bg-[#FAF9F6] text-[#292722]'
                  } ${
                    emailError
                      ? 'border-red-500/60 focus:border-red-500 focus:ring-2 focus:ring-red-500/15'
                      : isDarkMode
                      ? 'border-[#39352E] focus:border-[#C9A227] focus:ring-2 focus:ring-[#C9A227]/20'
                      : 'border-[#D9D4CA] focus:border-[#C9A227] focus:ring-2 focus:ring-[#C9A227]/15'
                  }`}
                />
                {emailError && (
                  <p id="director-email-error" className="mt-1.5 text-[11.5px] text-red-500 dark:text-red-400 font-normal">
                    {emailError}
                  </p>
                )}
              </div>

              {/* Security Passphrase Field */}
              <div>
                <label
                  htmlFor="security-passphrase"
                  className="block text-[10.5px] uppercase tracking-[1px] font-semibold mb-2 text-[#65615A] dark:text-[#A7A197]"
                >
                  SECURITY PASSPHRASE
                </label>
                <div className="relative">
                  <input
                    id="security-passphrase"
                    type={showPassword ? 'text' : 'password'}
                    value={adminPassword}
                    onChange={(e) => {
                      setAdminPassword(e.target.value);
                      if (passwordError) setPasswordError('');
                      if (loginError) setLoginError('');
                    }}
                    placeholder="Enter security passphrase"
                    autoComplete="current-password"
                    aria-invalid={!!passwordError}
                    aria-describedby={passwordError ? 'security-passphrase-error' : undefined}
                    className={`w-full h-12 pl-3.5 pr-11 border outline-none text-[13.5px] transition-all duration-150 rounded-none placeholder:text-[#9A958C] dark:placeholder:text-[#746E65] ${
                      isDarkMode
                        ? 'bg-[#201E1A] text-[#F3EFE7]'
                        : 'bg-[#FAF9F6] text-[#292722]'
                    } ${
                      passwordError
                        ? 'border-red-500/60 focus:border-red-500 focus:ring-2 focus:ring-red-500/15'
                        : isDarkMode
                        ? 'border-[#39352E] focus:border-[#C9A227] focus:ring-2 focus:ring-[#C9A227]/20'
                        : 'border-[#D9D4CA] focus:border-[#C9A227] focus:ring-2 focus:ring-[#C9A227]/15'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-0 top-0 bottom-0 px-3.5 flex items-center justify-center text-[#65615A] hover:text-[#292722] dark:text-[#A7A197] dark:hover:text-[#F3EFE7] transition-colors focus:outline-none focus-visible:text-[#C9A227] cursor-pointer"
                    aria-label={showPassword ? 'Hide security passphrase' : 'Show security passphrase'}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                {passwordError && (
                  <p id="security-passphrase-error" className="mt-1.5 text-[11.5px] text-red-500 dark:text-red-400 font-normal">
                    {passwordError}
                  </p>
                )}
              </div>

              {/* Authenticate Button */}
              <button
                type="submit"
                disabled={isLoggingIn}
                className="w-full h-12 mt-2 text-[11px] sm:text-[11.5px] uppercase tracking-[1.5px] font-bold transition-all duration-200 cursor-pointer shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 active:scale-[0.99] focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#C9A227]"
                style={{ backgroundColor: '#C9A227', color: '#171511' }}
              >
                {isLoggingIn ? (
                  <>
                    <div className="w-4 h-4 border-2 border-[#171511] border-t-transparent animate-spin rounded-full" />
                    <span>AUTHENTICATING…</span>
                  </>
                ) : (
                  <span>AUTHENTICATE DIRECTOR ACCESS</span>
                )}
              </button>
            </form>

            {/* Card Footer */}
            <div
              className={`mt-6 pt-4 border-t flex flex-wrap items-center justify-between gap-2 text-[11px] text-[#65615A] dark:text-[#A7A197] ${
                isDarkMode ? 'border-[#2C2923]' : 'border-[#E2DED5]'
              }`}
            >
              <button
                type="button"
                onClick={() => setActivePage('home')}
                className="hover:text-[#171511] dark:hover:text-[#F3EFE7] hover:underline flex items-center gap-1 cursor-pointer transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-[#C9A227]"
              >
                &larr; Return to Storefront
              </button>
              <span className="font-mono text-[10px] tracking-wider opacity-75">
                Unit 4, Balmoral Estate
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- MAIN ATELIER MANAGEMENT CONSOLE ---
  return (
    <div className={`min-h-screen ${consoleBg} transition-colors duration-300 font-sans selection:bg-[#C9A227] selection:text-black`}>
      {/* 1. Master Atelier Top Bar */}
      <header className={`border-b sticky top-0 z-40 backdrop-blur-md transition-colors ${headerBg}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Brand Logo & Console Badge */}
          <div className="flex items-center gap-4">
            <div
              onClick={() => setActiveTab('overview')}
              className="cursor-pointer group flex flex-col"
            >
              <div className="flex items-center gap-2.5">
                <span
                  className="text-sm sm:text-base font-medium tracking-[0.20em]"
                  style={{ fontFamily: "'Libre Caslon Text', Georgia, serif" }}
                >
                  BOSKI LIMITED
                </span>
                <span
                  className="px-2 py-0.5 text-[9.5px] uppercase font-mono tracking-widest font-bold border"
                  style={{ borderColor: `${gold}60`, color: gold, backgroundColor: `${gold}15` }}
                >
                  Atelier Console
                </span>
              </div>
              <span className="text-[10px] font-mono opacity-60 tracking-wider">
                Luxury Textile Operating System
              </span>
            </div>
          </div>

          {/* Right Header Navigation & Actions */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* View Storefront Link */}
            <button
              onClick={() => setActivePage('home')}
              className={`px-3 py-2 text-xs uppercase tracking-wider font-semibold border flex items-center gap-1.5 transition-colors cursor-pointer hidden md:flex ${
                isDarkMode ? 'border-[#2D322F] hover:border-white' : 'border-[#E6E1D8] hover:border-black'
              }`}
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>View Storefront</span>
            </button>

            {/* Dark / Bright Theme Toggle: No background color, no bright/dark text */}
            <button
              onClick={toggleTheme}
              className="p-2 bg-transparent text-inherit hover:opacity-70 transition-opacity cursor-pointer focus:outline-none flex items-center justify-center"
              aria-label={isDarkMode ? 'Switch to Bright Mode' : 'Switch to Dark Mode'}
              title={isDarkMode ? 'Switch to Bright Mode' : 'Switch to Dark Mode'}
            >
              {isDarkMode ? (
                <Sun className="w-[18px] h-[18px] text-[#C9A227]" />
              ) : (
                <Moon className="w-[18px] h-[18px] text-[#171717]" />
              )}
            </button>

            {/* Admin Profile Pill */}
            <div className={`px-3 py-1.5 border hidden lg:flex items-center gap-2.5 ${isDarkMode ? 'border-[#2D322F] bg-[#181B1A]' : 'border-[#E6E1D8] bg-[#FAF8F3]'}`}>
              <div className="w-6 h-6 rounded-full bg-[#C9A227] text-black flex items-center justify-center text-[10px] font-bold">
                BL
              </div>
              <div className="text-left leading-tight">
                <p className="text-[11px] font-semibold">Atelier Director</p>
                <p className="text-[9.5px] font-mono opacity-60">Super Admin</p>
              </div>
            </div>

            {/* Sign Out Button */}
            <button
              onClick={handleSignOut}
              className="p-2 border border-red-500/20 text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
              title="Sign Out of Atelier Console"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 2. Horizontal Navigation Tabs Bar */}
        <div className={`border-t transition-colors ${navBg}`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center overflow-x-auto scrollbar-none py-1">
            {[
              { id: 'overview', label: 'Overview', icon: LayoutDashboard },
              { id: 'products', label: `Products (${products.length})`, icon: Package },
              { id: 'collections', label: `Collections (${collections.length})`, icon: Layers },
              { id: 'categories', label: `Categories (${categories.length})`, icon: Folder },
              { id: 'media', label: `Media DAM (${mediaList.length})`, icon: ImageIcon },
              { id: 'inquiries', label: `Inquiries (${inquiries.length})`, icon: Inbox },
              { id: 'inventory', label: 'Inventory Oversight', icon: Activity },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    if (tab.id === 'products') setInitialCollectionFilter('all');
                    setActiveTab(tab.id as AdminTab);
                  }}
                  className={`px-4 sm:px-5 py-3 text-xs uppercase tracking-wider font-semibold flex items-center gap-2 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                    isActive
                      ? 'border-[#C9A227] text-[#C9A227] font-bold bg-black/5 dark:bg-white/5'
                      : 'border-transparent text-inherit opacity-60 hover:opacity-100 hover:border-inherit'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* 3. Main Workspace Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {/* TAB 1: OVERVIEW BI */}
        {activeTab === 'overview' && (
          <OverviewTab
            isDarkMode={isDarkMode}
            products={products}
            collections={collections}
            inquiries={inquiries}
            mediaList={mediaList}
            onNavigateTab={(t) => setActiveTab(t as AdminTab)}
            onOpenCreateCollection={() => {
              setEditingCollection(null);
              setIsCollectionModalOpen(true);
            }}
            onOpenCreateProduct={handleOpenCreateProduct}
            onOpenUploadModal={() => setIsUploadModalOpen(true)}
          />
        )}

        {/* TAB 2: PRODUCTS TABLE */}
        {activeTab === 'products' && (
          <ProductsTab
            products={products}
            collections={collections}
            isDarkMode={isDarkMode}
            onOpenCreateProduct={handleOpenCreateProduct}
            onOpenEditProduct={handleOpenEditProduct}
            onDeleteProduct={handleDeleteProduct}
            onQuickAdjustStock={handleQuickAdjustStock}
            onBulkUpdateStatus={handleBulkUpdateStatus}
            onBulkAssignCollection={handleBulkAssignCollection}
            onBulkDelete={handleBulkDelete}
            initialCollectionFilter={initialCollectionFilter}
          />
        )}

        {/* TAB 3: COLLECTIONS MANAGEMENT */}
        {activeTab === 'collections' && (
          <CollectionsTab
            collections={collections}
            products={products}
            isDarkMode={isDarkMode}
            onOpenCreateModal={() => {
              setEditingCollection(null);
              setIsCollectionModalOpen(true);
            }}
            onOpenEditModal={(col) => {
              setEditingCollection(col);
              setIsCollectionModalOpen(true);
            }}
            onDeleteCollection={handleDeleteCollection}
            onViewProductsInCollection={handleViewProductsInCollection}
          />
        )}

        {/* TAB 4: CATEGORY MANAGEMENT */}
        {activeTab === 'categories' && (
          <div className="space-y-8 animate-fadeIn">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-inherit">
              <div className="space-y-1">
                <span className="text-[11px] uppercase tracking-[0.25em] font-semibold" style={{ color: gold }}>
                  Taxonomy &bull; Textile Classifications
                </span>
                <h2
                  className="text-3xl sm:text-4xl font-normal tracking-tight"
                  style={{ fontFamily: "'Libre Caslon Text', Georgia, serif" }}
                >
                  Category Management
                </h2>
                <p className="text-sm font-light opacity-70">
                  Organize physical and bespoke textile hierarchies across your catalog.
                </p>
              </div>
            </div>

            {/* Add Category Form */}
            <form
              onSubmit={handleCreateCategory}
              className={`p-6 border max-w-xl space-y-4 ${headerBg}`}
            >
              <h3 className="text-sm uppercase tracking-wider font-semibold">
                Add Curated Category
              </h3>
              <div className="flex gap-2">
                <input
                  type="text"
                  required
                  placeholder="e.g. Cashmere Quilts, Pure Silk Throws..."
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  className={`flex-1 px-4 py-2.5 text-xs border outline-none rounded-none ${
                    isDarkMode
                      ? 'bg-[#181B1A] border-[#2E3330] text-white focus:border-[#C9A227]'
                      : 'bg-[#FAF8F3] border-[#DCD6CA] text-black focus:border-black'
                  }`}
                />
                <button
                  type="submit"
                  className="px-6 py-2.5 text-xs uppercase tracking-wider font-semibold flex items-center gap-2 cursor-pointer shadow-sm"
                  style={{ backgroundColor: gold, color: '#0B0D0C' }}
                >
                  <Plus className="w-4 h-4" />
                  <span>Create</span>
                </button>
              </div>
            </form>

            {/* Categories Table */}
            <div className={`border max-w-3xl overflow-x-auto ${headerBg}`}>
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b uppercase font-semibold opacity-70">
                    <th className="p-4">Category Name</th>
                    <th className="p-4">Catalog Count</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-inherit">
                  {categories.map((c) => (
                    <tr key={c.category} className="hover:bg-black/5 dark:hover:bg-white/5">
                      <td className="p-4 font-medium uppercase font-mono">
                        {c.category}
                      </td>
                      <td className="p-4 font-mono">
                        {c.count} items
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => handleDeleteCategory(c.category)}
                          className="text-red-400 hover:underline text-xs cursor-pointer"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 5: MEDIA DAM */}
        {activeTab === 'media' && (
          <MediaDAMTab
            mediaList={mediaList}
            isDarkMode={isDarkMode}
            onUploadImage={handleUploadImage}
            showToast={showToast}
          />
        )}

        {/* TAB 6: CRM INQUIRIES */}
        {activeTab === 'inquiries' && (
          <CRMInquiriesTab
            inquiries={inquiries}
            isDarkMode={isDarkMode}
            onUpdateStatus={handleUpdateInquiryStatus}
            showToast={showToast}
          />
        )}

        {/* TAB 7: INVENTORY */}
        {activeTab === 'inventory' && (
          <InventoryTab
            products={products}
            isDarkMode={isDarkMode}
            onQuickAdjustStock={handleQuickAdjustStock}
            onOpenEditProduct={handleOpenEditProduct}
          />
        )}
      </main>

      {/* 4. Luxury 5-Step Collection Builder Wizard Modal */}
      <CollectionBuilderModal
        isOpen={isCollectionModalOpen}
        onClose={() => setIsCollectionModalOpen(false)}
        onSave={handleSaveCollection}
        editingCollection={editingCollection}
        products={products}
        isDarkMode={isDarkMode}
        showToast={showToast}
      />

      {/* 5. Product Create & Edit Modal */}
      {isProductModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto"
          onClick={() => setIsProductModalOpen(false)}
        >
          <div
            className={`w-full max-w-3xl border p-6 sm:p-8 shadow-2xl relative space-y-6 max-h-[92vh] overflow-y-auto my-auto ${headerBg}`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 border-b border-inherit">
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-mono tracking-widest text-[#C9A227]">
                  Atelier Catalog Matrix
                </span>
                <h2
                  className="text-2xl font-normal"
                  style={{ fontFamily: "'Libre Caslon Text', Georgia, serif" }}
                >
                  {editingProduct ? `Edit Product: ${editingProduct.name}` : 'New Catalog Piece'}
                </h2>
              </div>
              <button
                onClick={() => setIsProductModalOpen(false)}
                className="p-1 border border-inherit hover:opacity-60 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10.5px] uppercase font-semibold tracking-wider mb-1 text-[#C9A227]">
                    Product Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={productFormData.name}
                    onChange={(e) => setProductFormData({ ...productFormData, name: e.target.value })}
                    placeholder="e.g. Signature Sateen Core Sheet Set"
                    className={`w-full px-3 py-2.5 text-xs border outline-none rounded-none ${
                      isDarkMode ? 'bg-[#181B1A] border-[#2E3330] text-white' : 'bg-[#FAF8F3] border-[#DCD6CA] text-black'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-[10.5px] uppercase font-semibold tracking-wider mb-1 text-[#C9A227]">
                    Category *
                  </label>
                  <select
                    value={productFormData.category}
                    onChange={(e) => setProductFormData({ ...productFormData, category: e.target.value })}
                    className={`w-full px-3 py-2.5 text-xs border outline-none rounded-none uppercase font-mono ${
                      isDarkMode ? 'bg-[#181B1A] border-[#2E3330] text-white' : 'bg-[#FAF8F3] border-[#DCD6CA] text-black'
                    }`}
                  >
                    {categories.map((c) => (
                      <option key={c.category} value={c.category}>
                        {c.category.toUpperCase()}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Multi-Collection Attribution */}
              <div>
                <label className="block text-[10.5px] uppercase font-semibold tracking-wider mb-1.5 text-[#C9A227]">
                  Assign to Collections (Multi-Select)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {collections.map((col) => {
                    const isChecked = productFormData.collectionIds.includes(col.id);
                    return (
                      <label
                        key={col.id}
                        className={`p-2.5 border text-xs flex items-center gap-2 cursor-pointer transition-colors ${
                          isChecked
                            ? isDarkMode
                              ? 'bg-[#1E2321] border-[#C9A227] text-white'
                              : 'bg-[#FAF6EC] border-[#C9A227] text-black'
                            : isDarkMode
                            ? 'bg-[#181B1A] border-[#2E3330]'
                            : 'bg-[#FAF8F3] border-[#E6E1D8]'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => {
                            const cur = productFormData.collectionIds;
                            setProductFormData({
                              ...productFormData,
                              collectionIds: e.target.checked ? [...cur, col.id] : cur.filter((id) => id !== col.id),
                            });
                          }}
                          className="accent-[#C9A227] w-3.5 h-3.5 rounded-none"
                        />
                        <span className="truncate">{col.name}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-[10.5px] uppercase font-semibold tracking-wider mb-1 text-[#C9A227]">
                  Subtitle / Sub-heading
                </label>
                <input
                  type="text"
                  value={productFormData.subtitle}
                  onChange={(e) => setProductFormData({ ...productFormData, subtitle: e.target.value })}
                  placeholder="e.g. 480-Thread-Count Long-Staple Egyptian Cotton"
                  className={`w-full px-3 py-2.5 text-xs border outline-none rounded-none ${
                    isDarkMode ? 'bg-[#181B1A] border-[#2E3330] text-white' : 'bg-[#FAF8F3] border-[#DCD6CA] text-black'
                  }`}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[10.5px] uppercase font-semibold tracking-wider mb-1 text-[#C9A227]">
                    Price (USD) *
                  </label>
                  <input
                    type="number"
                    required
                    value={productFormData.price}
                    onChange={(e) => setProductFormData({ ...productFormData, price: Number(e.target.value) })}
                    className={`w-full px-3 py-2.5 text-xs font-mono border outline-none rounded-none ${
                      isDarkMode ? 'bg-[#181B1A] border-[#2E3330] text-white' : 'bg-[#FAF8F3] border-[#DCD6CA] text-black'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-[10.5px] uppercase font-semibold tracking-wider mb-1 text-[#C9A227]">
                    Original Price (USD)
                  </label>
                  <input
                    type="number"
                    value={productFormData.originalPrice}
                    onChange={(e) => setProductFormData({ ...productFormData, originalPrice: Number(e.target.value) })}
                    className={`w-full px-3 py-2.5 text-xs font-mono border outline-none rounded-none ${
                      isDarkMode ? 'bg-[#181B1A] border-[#2E3330] text-white' : 'bg-[#FAF8F3] border-[#DCD6CA] text-black'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-[10.5px] uppercase font-semibold tracking-wider mb-1 text-[#C9A227]">
                    Vault Inventory Stock
                  </label>
                  <input
                    type="number"
                    value={productFormData.stockCount}
                    onChange={(e) => setProductFormData({ ...productFormData, stockCount: Number(e.target.value) })}
                    className={`w-full px-3 py-2.5 text-xs font-mono border outline-none rounded-none ${
                      isDarkMode ? 'bg-[#181B1A] border-[#2E3330] text-white' : 'bg-[#FAF8F3] border-[#DCD6CA] text-black'
                    }`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10.5px] uppercase font-semibold tracking-wider mb-1 text-[#C9A227]">
                    Material Specifications
                  </label>
                  <input
                    type="text"
                    value={productFormData.material}
                    onChange={(e) => setProductFormData({ ...productFormData, material: e.target.value })}
                    placeholder="e.g. 100% Certified Long-Staple Egyptian Cotton"
                    className={`w-full px-3 py-2.5 text-xs border outline-none rounded-none ${
                      isDarkMode ? 'bg-[#181B1A] border-[#2E3330] text-white' : 'bg-[#FAF8F3] border-[#DCD6CA] text-black'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-[10.5px] uppercase font-semibold tracking-wider mb-1 text-[#C9A227]">
                    High-Res Image URL
                  </label>
                  <input
                    type="url"
                    value={productFormData.imageUrl}
                    onChange={(e) => setProductFormData({ ...productFormData, imageUrl: e.target.value })}
                    placeholder="https://images.unsplash.com/photo-..."
                    className={`w-full px-3 py-2.5 text-xs border outline-none rounded-none ${
                      isDarkMode ? 'bg-[#181B1A] border-[#2E3330] text-white' : 'bg-[#FAF8F3] border-[#DCD6CA] text-black'
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10.5px] uppercase font-semibold tracking-wider mb-1 text-[#C9A227]">
                  Editorial Description
                </label>
                <textarea
                  rows={3}
                  value={productFormData.description}
                  onChange={(e) => setProductFormData({ ...productFormData, description: e.target.value })}
                  placeholder="Atmospheric descriptions for luxury clients..."
                  className={`w-full px-3 py-2.5 text-xs border outline-none rounded-none ${
                    isDarkMode ? 'bg-[#181B1A] border-[#2E3330] text-white' : 'bg-[#FAF8F3] border-[#DCD6CA] text-black'
                  }`}
                />
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 text-xs cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={productFormData.inStock}
                    onChange={(e) => setProductFormData({ ...productFormData, inStock: e.target.checked })}
                    className="accent-[#C9A227] w-4 h-4 rounded-none"
                  />
                  <span>Product is Active in Catalog</span>
                </label>

                <label className="flex items-center gap-2 text-xs cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={productFormData.isFeatured}
                    onChange={(e) => setProductFormData({ ...productFormData, isFeatured: e.target.checked })}
                    className="accent-[#C9A227] w-4 h-4 rounded-none"
                  />
                  <span>Mark as Featured / Best Seller</span>
                </label>
              </div>

              <div className="pt-4 border-t border-inherit flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-5 py-2.5 text-xs uppercase tracking-wider font-semibold hover:underline cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-8 py-3 text-xs uppercase tracking-wider font-bold shadow-md cursor-pointer"
                  style={{ backgroundColor: gold, color: '#0B0D0C' }}
                >
                  {editingProduct ? 'Update Product' : 'Publish Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 6. Upload Modal */}
      {isUploadModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
          onClick={() => setIsUploadModalOpen(false)}
        >
          <div
            className={`w-full max-w-md border p-6 sm:p-8 shadow-2xl relative space-y-5 ${headerBg}`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-inherit">
              <span className="text-[10px] uppercase font-mono tracking-widest text-[#C9A227]">
                DAM Asset Dispatch
              </span>
              <button
                onClick={() => setIsUploadModalOpen(false)}
                className="p-1 border border-inherit hover:opacity-60 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="border-2 border-dashed border-inherit p-6 text-center space-y-3">
              <Upload className="w-8 h-8 mx-auto text-[#C9A227]" />
              <p className="text-xs font-semibold uppercase">Select High-Resolution Asset</p>
              <input
                type="file"
                accept="image/*"
                onChange={async (e) => {
                  if (e.target.files && e.target.files[0]) {
                    await handleUploadImage(e.target.files[0]);
                    setIsUploadModalOpen(false);
                  }
                }}
                className="text-xs"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
