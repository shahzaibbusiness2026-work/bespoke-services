'use client';

import React, { useState, useEffect } from 'react';
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
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { api, ConsolidatedInquiry, MediaFile } from '../services/api';
import { Product } from '../types';

export const AdminDashboard: React.FC = () => {
  const { currentUser, setCurrentUser, login, logout, showToast, setActivePage, refreshCategories, refreshProducts } = useShop();

  // Hydration guard to prevent SSR mismatch
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  // Admin Authentication State
  const isAdmin = currentUser?.role === 'admin' || (currentUser?.role as string) === 'superadmin';
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Active Workspace Tab
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'upload' | 'categories' | 'inquiries'>('overview');

  // Products State
  const [products, setProducts] = useState<Product[]>([]);
  const [productSearch, setProductSearch] = useState('');
  const [productFilterCategory, setProductFilterCategory] = useState('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Categories State
  const [categories, setCategories] = useState<{ category: string; count: number }[]>([]);
  const [newCategoryName, setNewCategoryName] = useState('');

  // Media & Upload State
  const [mediaList, setMediaList] = useState<MediaFile[]>([]);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadPreview, setUploadPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

  // Inquiries State
  const [inquiries, setInquiries] = useState<ConsolidatedInquiry[]>([]);
  const [inquiryFilter, setInquiryFilter] = useState<'all' | 'contact' | 'bespoke' | 'trade'>('all');

  // Metrics
  const [metrics, setMetrics] = useState({
    totalProducts: 0,
    inStockCount: 0,
    totalCategories: 0,
    totalMedia: 0,
    pendingInquiries: 0,
  });

  // Product Form State
  const [formData, setFormData] = useState({
    name: '',
    subtitle: '',
    category: 'bedding',
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
  const refreshData = async () => {
    try {
      const [prodRes, catRes, mediaRes, inqRes] = await Promise.all([
        api.products.getAll(),
        api.categories.getAll(),
        api.upload.getMediaList(),
        api.inquiries.getAll(),
      ]);

      if (prodRes.success && prodRes.data) {
        setProducts(prodRes.data);
        setMetrics((prev) => ({
          ...prev,
          totalProducts: prodRes.data.length,
          inStockCount: prodRes.data.filter((p) => p.inStock).length,
        }));
      }

      if (catRes.success && catRes.data) {
        setCategories(catRes.data);
        setMetrics((prev) => ({
          ...prev,
          totalCategories: catRes.data.length,
        }));
      }

      if (mediaRes.success && mediaRes.data) {
        setMediaList(mediaRes.data);
        setMetrics((prev) => ({
          ...prev,
          totalMedia: mediaRes.data.length,
        }));
      }

      if (inqRes.success && inqRes.data) {
        setInquiries(inqRes.data);
        setMetrics((prev) => ({
          ...prev,
          pendingInquiries: inqRes.data.filter((i) => i.status === 'pending').length,
        }));
      }
    } catch {
      // Graceful fallback
    }
  };

  useEffect(() => {
    if (isAdmin) {
      refreshData();
    }
  }, [isAdmin]);


  // Handle Admin Login — validates credentials via the API
  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    const cleanEmail = adminEmail.trim();
    const cleanPass = adminPassword.trim();

    if (!cleanEmail || !cleanPass) {
      setLoginError('Email and password are required.');
      return;
    }

    setIsLoggingIn(true);
    try {
      const res = await api.auth.login(cleanEmail, cleanPass);

      if (res.success && res.data?.user) {
        const authUser = res.data.user;
        const role = String(authUser.role || '').toLowerCase();
        if (role === 'admin' || role === 'superadmin') {
          setCurrentUser(authUser);
          showToast('Atelier Admin Access Granted', 'Welcome to the Master Administrator Console', 'success');
        } else {
          setLoginError('Your account does not have administrator privileges.');
        }
      } else {
        setLoginError(res.error || 'Invalid email or password. Please try again.');
      }
    } catch (err: any) {
      setLoginError(err.message || 'An error occurred during authentication.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  // Image File Selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploadFile(file);
      setUploadPreview(URL.createObjectURL(file));
    }
  };

  // Execute Image Upload
  const handleUploadImage = async () => {
    if (!uploadFile) {
      showToast('Select Image', 'Please choose an image file to upload', 'info');
      return;
    }

    setIsUploading(true);
    try {
      const res = await api.upload.image(uploadFile);
      if (res.success && res.data) {
        showToast('Image Uploaded', `CDN path: ${res.data.url}`, 'success');
        setFormData((prev) => ({ ...prev, imageUrl: res.data!.url }));
        setUploadFile(null);
        setUploadPreview(null);
        refreshData();
      } else {
        showToast('Upload Error', res.error || 'Failed to upload image', 'info');
      }
    } catch {
      showToast('Upload Error', 'Failed to upload image', 'info');
    } finally {
      setIsUploading(false);
    }
  };

  // Copy to Clipboard
  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    showToast('Copied URL', url, 'info');
    setTimeout(() => setCopiedUrl(null), 2500);
  };

  // Save Product (Create or Update)
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.price) {
      showToast('Validation Error', 'Product title and price are required', 'info');
      return;
    }

    const defaultImg =
      formData.imageUrl.trim() ||
      'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1200&q=85';

    const payload: Omit<Product, 'id'> = {
      name: formData.name.trim(),
      subtitle: formData.subtitle.trim() || `${formData.threadCount} • Master Loom`,
      category: formData.category,
      price: Number(formData.price),
      originalPrice: formData.originalPrice ? Number(formData.originalPrice) : undefined,
      rating: editingProduct ? editingProduct.rating : 5.0,
      reviewsCount: editingProduct ? editingProduct.reviewsCount : 0,
      inStock: formData.inStock,
      stockCount: Number(formData.stockCount || 10),
      featured: formData.isFeatured,
      isBestSeller: formData.isFeatured,
      fabric: formData.fabric,
      threadCount: formData.threadCount,
      material: formData.material,
      description:
        formData.description.trim() ||
        `Handcrafted bespoke ${formData.name} utilizing premium long-staple yarns finished in our master European mills.`,
      details: [
        `${formData.threadCount} weave with bespoke drape`,
        `Fabric: ${formData.fabric}`,
        `Origin: Master Loom Certified`,
        'Machine washable on delicate cycle with pH-neutral detergent',
      ],
      careInstructions: 'Cold delicate wash with like linens. Tumble dry low or line dry.',
      sustainability: '100% GOTS & OEKO-TEX Standard 100 Certified organically grown fibers.',
      sku: editingProduct ? editingProduct.sku : `BOSKI-${Date.now().toString().slice(-6)}`,
      tags: [formData.category, 'luxury', 'atelier', 'bespoke'],
      sizes: ['Twin', 'Queen', 'King', 'Super King / Cal King'],
      colors: [
        {
          name: formData.colorName || 'Natural Flax',
          hex: formData.colorHex || '#D7C7B3',
          image: defaultImg,
        },
      ],
      images: [defaultImg],
    };

    if (editingProduct) {
      const res = await api.products.update(editingProduct.id, payload);
      if (res.success) {
        showToast('Product Updated', `Saved changes to ${payload.name}`, 'success');
        setEditingProduct(null);
        setIsCreateModalOpen(false);
        await refreshData();
        if (refreshProducts) await refreshProducts();
        if (refreshCategories) await refreshCategories();
      } else {
        showToast('Update Failed', res.error, 'info');
      }
    } else {
      const res = await api.products.create(payload);
      if (res.success) {
        showToast('Product Created', `Added ${payload.name} to catalog`, 'success');
        setIsCreateModalOpen(false);
        resetForm();
        await refreshData();
        if (refreshProducts) await refreshProducts();
        if (refreshCategories) await refreshCategories();
      } else {
        showToast('Creation Failed', res.error, 'info');
      }
    }
  };

  // Open Edit Product Modal
  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      subtitle: product.subtitle,
      category: product.category,
      price: product.price,
      originalPrice: product.originalPrice || product.price,
      fabric: product.fabric || '100% Long-Staple Egyptian Cotton Sateen',
      threadCount: product.threadCount || '480 Thread Count',
      material: product.material,
      description: product.description,
      imageUrl: product.images[0] || '',
      colorName: product.colors[0]?.name || 'Natural Flax',
      colorHex: product.colors[0]?.hex || '#D7C7B3',
      inStock: product.inStock,
      stockCount: product.stockCount,
      isFeatured: !!product.featured,
    });
    setIsCreateModalOpen(true);
  };

  // Delete Product
  const handleDeleteProduct = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to remove "${name}" from the active catalog?`)) return;
    const res = await api.products.delete(id);
    if (res.success) {
      showToast('Product Deleted', `Removed ${name}`, 'info');
      await refreshData();
      if (refreshProducts) await refreshProducts();
      if (refreshCategories) await refreshCategories();
    } else {
      showToast('Delete Error', res.error, 'info');
    }
  };

  // Quick Toggle Status
  const handleToggleStatus = async (id: string, field: 'inStock' | 'featured') => {
    const res = await api.products.toggleStatus(id, field);
    if (res.success && res.data) {
      showToast('Status Toggled', `${res.data.name} ${field} updated`, 'success');
      await refreshData();
      if (refreshProducts) await refreshProducts();
    }
  };

  // Create Category
  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;
    const res = await api.categories.create(newCategoryName.trim());
    if (res.success) {
      showToast('Category Created', `Added ${newCategoryName}`, 'success');
      setNewCategoryName('');
      await refreshData();
      if (refreshCategories) await refreshCategories();
    } else {
      showToast('Error', res.error, 'info');
    }
  };

  // Delete Category
  const handleDeleteCategory = async (catName: string) => {
    if (!window.confirm(`Delete category "${catName}"?`)) return;
    const res = await api.categories.delete(catName);
    if (res.success) {
      showToast('Category Removed', catName, 'info');
      await refreshData();
      if (refreshCategories) await refreshCategories();
    } else {
      showToast('Error', res.error, 'info');
    }
  };

  // Update Inquiry Status
  const handleUpdateInquiryStatus = async (id: string, status: 'pending' | 'contacted' | 'resolved') => {
    const res = await api.inquiries.updateStatus(id, status);
    if (res.success) {
      showToast('Status Updated', `Inquiry marked as ${status}`, 'success');
      refreshData();
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      subtitle: '',
      category: 'bedding',
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
    setEditingProduct(null);
  };

  // --- PREVENT SSR HYDRATION MISMATCH ---
  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#1a1c1b] flex items-center justify-center p-6 text-white">
        <div className="bg-[#242625] border border-[#383838] w-full max-w-md p-8 shadow-2xl flex flex-col items-center justify-center py-16 space-y-4">
          <div className="w-8 h-8 border-2 border-[#d7c7b3] border-t-transparent animate-spin" />
          <p className="text-body-xs text-[#d7c7b3] font-mono tracking-widest uppercase">
            Initializing Atelier Portal...
          </p>
        </div>
      </div>
    );
  }

  // --- UN-AUTHENTICATED ADMIN LOGIN WALL ---
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-[#1a1c1b] flex items-center justify-center p-3.5 sm:p-6 text-white">
        <div className="bg-[#242625] border border-[#383838] w-full max-w-md p-5 sm:p-8 shadow-2xl">
          <div className="text-center mb-6 sm:mb-8">
            <div className="w-11 h-11 sm:w-12 sm:h-12 bg-[#1a1c1b] border border-[#d7c7b3]/40 flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <Lock className="w-5 h-5 sm:w-6 sm:h-6 text-[#d7c7b3]" />
            </div>
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#d7c7b3] font-mono block mb-1">
              Restricted Portal
            </span>
            <h1
              className="text-xl sm:text-2xl font-normal uppercase tracking-wider text-white"
              style={{ fontFamily: "'Libre Caslon Text', Georgia, serif" }}
            >
              Atelier Administrator
            </h1>
            <p className="text-body-xs text-[#e3e2e0]/60 mt-2 font-light">
              Sign in with Master Concierge credentials to access product management, categories, image uploads, and client inquiries.
            </p>
          </div>

          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div className="space-y-1">
              <label className="text-label-caps text-[#d7c7b3] block">Admin Email</label>
              <input
                type="email"
                required
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                placeholder="boskilimited@boskilimited.info"
                className="w-full bg-[#1a1c1b] border border-[#444748] px-3 py-2 text-body-sm text-white focus:border-[#d7c7b3] outline-none transition-colors"
              />
            </div>

            <div className="space-y-1">
              <label className="text-label-caps text-[#d7c7b3] block">Password</label>
              <input
                type="password"
                required
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#1a1c1b] border border-[#444748] px-3 py-2 text-body-sm text-white focus:border-[#d7c7b3] outline-none transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full py-3 bg-[#d7c7b3] text-[#1a1c1b] font-medium text-label-caps tracking-widest uppercase hover:bg-white transition-colors flex items-center justify-center gap-2 mt-4 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>{isLoggingIn ? 'Verifying Credentials...' : 'Authenticate as Admin'}</span>
            </button>

            {/* Error message display */}
            {loginError && (
              <div className="mt-3 p-3 bg-red-900/30 border border-red-800/50 text-red-300 text-[12px] font-mono text-center">
                {loginError}
              </div>
            )}
          </form>

          <div className="mt-6 text-center">
            <a
              href="/"
              onClick={(e) => {
                if (window.location.pathname === '/') {
                  e.preventDefault();
                  setActivePage('home');
                }
              }}
              className="text-body-xs text-[#e3e2e0]/60 hover:text-white transition-colors underline-offset-4 hover:underline inline-block"
            >
              ← Return to Client Storefront
            </a>
          </div>
        </div>
      </div>
    );
  }

  // --- AUTHENTICATED ADMIN CONSOLE ---
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.category.toLowerCase().includes(productSearch.toLowerCase());
    const matchesCat = productFilterCategory === 'all' || p.category === productFilterCategory;
    return matchesSearch && matchesCat;
  });

  const filteredInquiries = inquiries.filter((i) => {
    if (inquiryFilter === 'all') return true;
    return i.type === inquiryFilter;
  });

  return (
    <div className="min-h-screen bg-[#faf9f7] text-[#1a1c1b]">
      {/* Top Admin Header */}
      <header className="bg-[#1a1c1b] text-white border-b border-[#383838] px-3 sm:px-6 py-2.5 sm:py-4 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 sm:gap-4 min-w-0">
            <span
              className="text-sm sm:text-xl uppercase tracking-widest text-white truncate"
              style={{ fontFamily: "'Libre Caslon Text', Georgia, serif" }}
            >
              BOSKI LIMITED
            </span>
            <span className="text-[9px] sm:text-[10px] bg-[#d7c7b3] text-[#1a1c1b] px-1.5 sm:px-2 py-0.5 font-mono uppercase tracking-wider font-semibold shrink-0">
              Admin
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            <a
              href="/"
              onClick={(e) => {
                if (window.location.pathname === '/') {
                  e.preventDefault();
                  setActivePage('home');
                }
              }}
              className="text-[11px] sm:text-body-xs text-[#d7c7b3] hover:text-white flex items-center gap-1 sm:gap-1.5 transition-colors cursor-pointer py-1"
              title="View Storefront"
            >
              <span className="hidden sm:inline">View Storefront</span>
              <span className="sm:hidden font-mono">Store</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <div className="h-4 w-px bg-[#383838]" />
            <button
              onClick={logout}
              className="text-[11px] sm:text-body-xs text-white/70 hover:text-white flex items-center gap-1 sm:gap-1.5 transition-colors py-1"
              title="Sign Out"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Workspace Navigation Tabs — Horizontally Scrollable on Mobile */}
      <div className="bg-[#efeeec] border-b border-[#c4c7c7] px-2 sm:px-6">
        <div className="max-w-7xl mx-auto flex gap-1 overflow-x-auto py-1 scrollbar-none">
          <button
            onClick={() => setActiveTab('overview')}
            className={`shrink-0 px-3 sm:px-5 py-2 sm:py-3 text-[10px] sm:text-label-caps uppercase tracking-wider flex items-center gap-1.5 sm:gap-2 border-b-2 transition-all ${
              activeTab === 'overview'
                ? 'border-[#1a1c1b] bg-[#faf9f7] text-[#1a1c1b] font-semibold'
                : 'border-transparent text-[#444748] hover:text-[#1a1c1b]'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>Overview</span>
          </button>

          <button
            onClick={() => setActiveTab('products')}
            className={`shrink-0 px-3 sm:px-5 py-2 sm:py-3 text-[10px] sm:text-label-caps uppercase tracking-wider flex items-center gap-1.5 sm:gap-2 border-b-2 transition-all ${
              activeTab === 'products'
                ? 'border-[#1a1c1b] bg-[#faf9f7] text-[#1a1c1b] font-semibold'
                : 'border-transparent text-[#444748] hover:text-[#1a1c1b]'
            }`}
          >
            <Package className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>Products ({products.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('upload')}
            className={`shrink-0 px-3 sm:px-5 py-2 sm:py-3 text-[10px] sm:text-label-caps uppercase tracking-wider flex items-center gap-1.5 sm:gap-2 border-b-2 transition-all ${
              activeTab === 'upload'
                ? 'border-[#1a1c1b] bg-[#faf9f7] text-[#1a1c1b] font-semibold'
                : 'border-transparent text-[#444748] hover:text-[#1a1c1b]'
            }`}
          >
            <Upload className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>Media ({mediaList.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('categories')}
            className={`shrink-0 px-3 sm:px-5 py-2 sm:py-3 text-[10px] sm:text-label-caps uppercase tracking-wider flex items-center gap-1.5 sm:gap-2 border-b-2 transition-all ${
              activeTab === 'categories'
                ? 'border-[#1a1c1b] bg-[#faf9f7] text-[#1a1c1b] font-semibold'
                : 'border-transparent text-[#444748] hover:text-[#1a1c1b]'
            }`}
          >
            <Layers className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>Categories ({categories.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('inquiries')}
            className={`shrink-0 px-3 sm:px-5 py-2 sm:py-3 text-[10px] sm:text-label-caps uppercase tracking-wider flex items-center gap-1.5 sm:gap-2 border-b-2 transition-all ${
              activeTab === 'inquiries'
                ? 'border-[#1a1c1b] bg-[#faf9f7] text-[#1a1c1b] font-semibold'
                : 'border-transparent text-[#444748] hover:text-[#1a1c1b]'
            }`}
          >
            <Inbox className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>Inquiries ({inquiries.length})</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto p-3 sm:p-6 md:p-8">
        {/* --- TAB 1: OVERVIEW --- */}
        {activeTab === 'overview' && (
          <div className="space-y-6 sm:space-y-8 animate-fadeIn">
            <div>
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#8c9a86] font-mono block mb-1">
                Executive Console
              </span>
              <h2
                className="text-2xl sm:text-3xl font-normal uppercase tracking-wider text-[#1a1c1b]"
                style={{ fontFamily: "'Libre Caslon Text', Georgia, serif" }}
              >
                Atelier Operations Summary
              </h2>
            </div>

            {/* KPI Metric Cards — 2 cols on mobile, 4 on desktop */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
              <div className="bg-white border border-[#c4c7c7] p-3.5 sm:p-6">
                <span className="text-[10px] sm:text-label-caps text-[#444748] block mb-1">Total Products</span>
                <span
                  className="text-2xl sm:text-4xl text-[#1a1c1b] font-normal"
                  style={{ fontFamily: "'Libre Caslon Text', Georgia, serif" }}
                >
                  {products.length}
                </span>
                <span className="text-[11px] sm:text-body-xs text-[#8c9a86] block mt-1.5 font-mono">
                  {products.filter((p) => p.inStock).length} In Stock
                </span>
              </div>

              <div className="bg-white border border-[#c4c7c7] p-3.5 sm:p-6">
                <span className="text-[10px] sm:text-label-caps text-[#444748] block mb-1">Categories</span>
                <span
                  className="text-2xl sm:text-4xl text-[#1a1c1b] font-normal"
                  style={{ fontFamily: "'Libre Caslon Text', Georgia, serif" }}
                >
                  {categories.length}
                </span>
                <span className="text-[11px] sm:text-body-xs text-[#444748] block mt-1.5 font-mono">
                  Active taxonomies
                </span>
              </div>

              <div className="bg-white border border-[#c4c7c7] p-3.5 sm:p-6">
                <span className="text-[10px] sm:text-label-caps text-[#444748] block mb-1">Inquiries</span>
                <span
                  className="text-2xl sm:text-4xl text-[#1a1c1b] font-normal"
                  style={{ fontFamily: "'Libre Caslon Text', Georgia, serif" }}
                >
                  {inquiries.length}
                </span>
                <span className="text-[11px] sm:text-body-xs text-[#d7c7b3] font-mono block mt-1.5">
                  {inquiries.filter((i) => i.status === 'pending').length} Pending
                </span>
              </div>

              <div className="bg-white border border-[#c4c7c7] p-3.5 sm:p-6">
                <span className="text-[10px] sm:text-label-caps text-[#444748] block mb-1">Media Assets</span>
                <span
                  className="text-2xl sm:text-4xl text-[#1a1c1b] font-normal"
                  style={{ fontFamily: "'Libre Caslon Text', Georgia, serif" }}
                >
                  {mediaList.length}
                </span>
                <span className="text-[11px] sm:text-body-xs text-[#8c9a86] block mt-1.5 font-mono">
                  CDN hosted
                </span>
              </div>
            </div>

            {/* Quick Actions Bar */}
            <div className="bg-[#efeeec] border border-[#c4c7c7] p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-base sm:text-title-md font-normal uppercase text-[#1a1c1b]">
                  Quick Atelier Actions
                </h3>
                <p className="text-body-xs text-[#444748] font-light mt-0.5">
                  Directly dispatch additions to the production catalog and media repository.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-2.5 w-full sm:w-auto">
                <button
                  onClick={() => {
                    resetForm();
                    setIsCreateModalOpen(true);
                  }}
                  className="w-full sm:w-auto px-5 py-2.5 bg-[#1a1c1b] text-white text-label-caps tracking-widest uppercase hover:bg-black transition-colors flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4 text-[#d7c7b3]" />
                  <span>Create Product</span>
                </button>

                <button
                  onClick={() => setActiveTab('upload')}
                  className="w-full sm:w-auto px-5 py-2.5 bg-white border border-[#1a1c1b] text-[#1a1c1b] text-label-caps tracking-widest uppercase hover:bg-[#faf9f7] transition-colors flex items-center justify-center gap-2"
                >
                  <Upload className="w-4 h-4" />
                  <span>Upload Image</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* --- TAB 2: PRODUCT MANAGEMENT --- */}
        {activeTab === 'products' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] uppercase tracking-[0.25em] text-[#8c9a86] font-mono block mb-1">
                  Catalog Inventory
                </span>
                <h2
                  className="text-xl sm:text-2xl font-normal uppercase tracking-wider text-[#1a1c1b]"
                  style={{ fontFamily: "'Libre Caslon Text', Georgia, serif" }}
                >
                  Product Management ({filteredProducts.length})
                </h2>
              </div>

              <button
                onClick={() => {
                  resetForm();
                  setIsCreateModalOpen(true);
                }}
                className="w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-3 bg-[#1a1c1b] text-white text-label-caps tracking-widest uppercase hover:bg-black transition-colors flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4 text-[#d7c7b3]" />
                <span>Add New Product</span>
              </button>
            </div>

            {/* Filter & Search Bar — Stacked on Mobile */}
            <div className="bg-white border border-[#c4c7c7] p-3 sm:p-4 flex flex-col sm:flex-row gap-2.5 sm:gap-4 justify-between">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-[#444748] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search products by title or category..."
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 border border-[#c4c7c7] text-body-sm text-[#1a1c1b] focus:border-[#1a1c1b] outline-none"
                />
              </div>

              <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
                <label className="text-label-caps text-[#444748] shrink-0">Category:</label>
                <select
                  value={productFilterCategory}
                  onChange={(e) => setProductFilterCategory(e.target.value)}
                  className="w-full sm:w-auto border border-[#c4c7c7] px-3 py-2 text-body-sm text-[#1a1c1b] bg-white outline-none"
                >
                  <option value="all">All Categories</option>
                  {categories.map((c) => (
                    <option key={c.category} value={c.category}>
                      {c.category.toUpperCase()} ({c.count})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Mobile Product Cards View (Visible only on screens < md) */}
            <div className="md:hidden space-y-3">
              {filteredProducts.map((p) => (
                <div key={p.id} className="bg-white border border-[#c4c7c7] p-3.5 space-y-3">
                  <div className="flex gap-3 items-start">
                    <img
                      src={p.images[0] || 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af'}
                      alt={p.name}
                      className="w-16 h-16 object-cover border border-[#c4c7c7] shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 bg-[#efeeec] text-[#444748] truncate">
                          {p.category}
                        </span>
                        {p.featured && (
                          <span className="text-[9px] uppercase font-mono px-1.5 py-0.5 bg-[#d7c7b3]/30 border border-[#d7c7b3] text-[#1a1c1b] shrink-0">
                            Featured
                          </span>
                        )}
                      </div>
                      <h4 className="font-medium text-[#1a1c1b] text-sm mt-1 truncate">{p.name}</h4>
                      <p className="text-[11px] text-[#444748] line-clamp-1">{p.subtitle}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-[#efeeec] text-xs">
                    <div>
                      <span className="font-mono font-medium text-sm text-[#1a1c1b]">${p.price}</span>
                      {p.originalPrice && (
                        <span className="text-[11px] text-[#444748]/50 line-through ml-1.5">
                          ${p.originalPrice}
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] font-mono text-[#444748]">
                      {p.stockCount} units
                    </span>
                  </div>

                  {/* Touch Action Buttons */}
                  <div className="flex items-center justify-between gap-2 pt-2 border-t border-[#efeeec]">
                    <button
                      onClick={() => handleToggleStatus(p.id, 'inStock')}
                      className={`px-3 py-1.5 text-[11px] uppercase font-mono tracking-wider border transition-colors flex-1 text-center ${
                        p.inStock
                          ? 'bg-[#8c9a86]/20 border-[#8c9a86] text-[#2c3d26]'
                          : 'bg-red-50 border-red-300 text-red-700'
                      }`}
                    >
                      {p.inStock ? '✓ In Stock' : '✕ Out of Stock'}
                    </button>

                    <button
                      onClick={() => openEditModal(p)}
                      className="px-3 py-1.5 bg-[#efeeec] hover:bg-[#e3e2e0] text-[#1a1c1b] text-xs flex items-center justify-center gap-1 border border-[#c4c7c7] transition-colors"
                      title="Edit Product"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>

                    <button
                      onClick={() => handleDeleteProduct(p.id, p.name)}
                      className="p-2 hover:bg-red-50 text-[#444748] hover:text-red-600 border border-[#c4c7c7] transition-colors"
                      title="Delete Product"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}

              {filteredProducts.length === 0 && (
                <div className="p-6 text-center text-[#444748] bg-white border border-[#c4c7c7] text-sm">
                  No products match your search query.
                </div>
              )}
            </div>

            {/* Desktop Products Table (Visible on screens >= md) */}
            <div className="hidden md:block bg-white border border-[#c4c7c7] overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#efeeec] border-b border-[#c4c7c7] text-label-caps text-[#444748]">
                    <th className="p-4">Item</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Price</th>
                    <th className="p-4">Stock</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#efeeec] text-body-sm">
                  {filteredProducts.map((p) => (
                    <tr key={p.id} className="hover:bg-[#faf9f7] transition-colors">
                      <td className="p-4 flex items-center gap-3">
                        <img
                          src={p.images[0] || 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af'}
                          alt={p.name}
                          className="w-12 h-12 object-cover border border-[#c4c7c7] shrink-0"
                        />
                        <div>
                          <div className="font-medium text-[#1a1c1b]">{p.name}</div>
                          <div className="text-body-xs text-[#444748] line-clamp-1">{p.subtitle}</div>
                        </div>
                      </td>

                      <td className="p-4 uppercase font-mono text-body-xs text-[#444748]">
                        {p.category}
                      </td>

                      <td className="p-4 font-mono font-medium text-[#1a1c1b]">
                        ${p.price}
                        {p.originalPrice && (
                          <span className="text-body-xs text-[#444748]/50 line-through ml-2">
                            ${p.originalPrice}
                          </span>
                        )}
                      </td>

                      <td className="p-4 font-mono text-body-xs">
                        {p.stockCount} units
                      </td>

                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleToggleStatus(p.id, 'inStock')}
                            className={`px-2 py-0.5 text-[10px] uppercase font-mono tracking-wider border ${
                              p.inStock
                                ? 'bg-[#8c9a86]/20 border-[#8c9a86] text-[#2c3d26]'
                                : 'bg-red-50 border-red-300 text-red-700'
                            }`}
                          >
                            {p.inStock ? 'In Stock' : 'Out of Stock'}
                          </button>
                          {p.featured && (
                            <span className="px-2 py-0.5 text-[10px] uppercase font-mono tracking-wider bg-[#d7c7b3]/30 border border-[#d7c7b3] text-[#1a1c1b]">
                              Featured
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openEditModal(p)}
                            className="p-1.5 hover:bg-[#efeeec] text-[#444748] hover:text-black transition-colors"
                            title="Edit Product"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(p.id, p.name)}
                            className="p-1.5 hover:bg-red-50 text-[#444748] hover:text-red-600 transition-colors"
                            title="Delete Product"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredProducts.length === 0 && (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-[#444748]">
                        No products match your search query.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* --- TAB 3: IMAGE UPLOAD & MEDIA CDN --- */}
        {activeTab === 'upload' && (
          <div className="space-y-8 animate-fadeIn">
            <div>
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#8c9a86] font-mono block mb-1">
                Asset Engine
              </span>
              <h2
                className="text-2xl font-normal uppercase tracking-wider text-[#1a1c1b]"
                style={{ fontFamily: "'Libre Caslon Text', Georgia, serif" }}
              >
                Image Upload & Media Library
              </h2>
            </div>

            {/* Uploader Box */}
            <div className="bg-white border-2 border-dashed border-[#c4c7c7] p-4 sm:p-8 text-center">
              <div className="max-w-md mx-auto space-y-4">
                <div className="w-12 h-12 bg-[#efeeec] flex items-center justify-center mx-auto">
                  <Upload className="w-6 h-6 text-[#1a1c1b]" />
                </div>
                <h3 className="text-base sm:text-title-md uppercase tracking-wider text-[#1a1c1b]">
                  Upload Atelier Imagery
                </h3>
                <p className="text-body-xs text-[#444748] font-light">
                  Select high-resolution product photography (JPEG, PNG, WEBP, AVIF). Uploads are stored on the local backend CDN and instantly available across products.
                </p>

                <input
                  type="file"
                  id="image-file-input"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />

                <div className="flex flex-col sm:flex-row justify-center gap-2 sm:gap-3 pt-2">
                  <label
                    htmlFor="image-file-input"
                    className="w-full sm:w-auto px-6 py-2.5 bg-[#efeeec] hover:bg-[#e3e2e0] text-[#1a1c1b] text-label-caps tracking-widest uppercase cursor-pointer transition-colors border border-[#c4c7c7] text-center"
                  >
                    Select File
                  </label>

                  {uploadFile && (
                    <button
                      type="button"
                      onClick={handleUploadImage}
                      disabled={isUploading}
                      className="w-full sm:w-auto px-6 py-2.5 bg-[#1a1c1b] text-white text-label-caps tracking-widest uppercase hover:bg-black transition-colors flex items-center justify-center gap-2"
                    >
                      <Check className="w-4 h-4 text-[#d7c7b3]" />
                      <span>{isUploading ? 'Uploading...' : 'Confirm Upload'}</span>
                    </button>
                  )}
                </div>

                {uploadPreview && (
                  <div className="mt-4 pt-4 border-t border-[#efeeec]">
                    <span className="text-label-caps text-[#444748] block mb-2">Upload Preview</span>
                    <img
                      src={uploadPreview}
                      alt="Preview"
                      className="w-40 h-28 sm:w-48 sm:h-36 object-cover mx-auto border border-[#c4c7c7]"
                    />
                    <span className="text-body-xs font-mono text-[#444748] mt-1 block truncate">
                      {uploadFile?.name} ({Math.round((uploadFile?.size || 0) / 1024)} KB)
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Media Gallery */}
            <div>
              <h3 className="text-base sm:text-title-md uppercase tracking-wider text-[#1a1c1b] mb-3 sm:mb-4">
                Media Library ({mediaList.length} Images)
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5 sm:gap-4">
                {mediaList.map((media) => (
                  <div
                    key={media.filename}
                    className="bg-white border border-[#c4c7c7] overflow-hidden group hover:border-[#1a1c1b] transition-all"
                  >
                    <div className="aspect-square relative overflow-hidden bg-[#efeeec]">
                      <img
                        src={media.url}
                        alt={media.filename}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <div className="p-2 space-y-1">
                      <div className="text-[10px] font-mono text-[#444748] truncate" title={media.filename}>
                        {media.filename}
                      </div>
                      <button
                        onClick={() => copyToClipboard(media.url)}
                        className="w-full py-1 text-[10px] bg-[#efeeec] hover:bg-[#1a1c1b] hover:text-white transition-colors uppercase font-mono tracking-wider flex items-center justify-center gap-1"
                      >
                        <Copy className="w-3 h-3" />
                        <span>{copiedUrl === media.url ? 'Copied' : 'Copy URL'}</span>
                      </button>
                    </div>
                  </div>
                ))}
                {mediaList.length === 0 && (
                  <div className="col-span-full p-8 text-center text-[#444748] bg-white border border-[#c4c7c7] text-sm">
                    No images uploaded yet. Upload your first product photograph above.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* --- TAB 4: CATEGORY MANAGEMENT --- */}
        {activeTab === 'categories' && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#8c9a86] font-mono block mb-1">
                Taxonomy & Groupings
              </span>
              <h2
                className="text-xl sm:text-2xl font-normal uppercase tracking-wider text-[#1a1c1b]"
                style={{ fontFamily: "'Libre Caslon Text', Georgia, serif" }}
              >
                Category Management
              </h2>
            </div>

            {/* Add Category Form */}
            <form onSubmit={handleCreateCategory} className="bg-white border border-[#c4c7c7] p-4 sm:p-6 max-w-xl">
              <h3 className="text-base sm:text-title-md uppercase tracking-wider text-[#1a1c1b] mb-3 sm:mb-4">
                Add New Category
              </h3>
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                <input
                  type="text"
                  required
                  placeholder="e.g. Silk Quilts, Loungewear, Cashmere"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  className="flex-1 px-4 py-2 border border-[#c4c7c7] text-body-sm text-[#1a1c1b] outline-none focus:border-[#1a1c1b]"
                />
                <button
                  type="submit"
                  className="w-full sm:w-auto px-6 py-2 bg-[#1a1c1b] text-white text-label-caps tracking-widest uppercase hover:bg-black transition-colors flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4 text-[#d7c7b3]" />
                  <span>Create</span>
                </button>
              </div>
            </form>

            {/* Categories Table */}
            <div className="bg-white border border-[#c4c7c7] max-w-2xl overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#efeeec] border-b border-[#c4c7c7] text-label-caps text-[#444748]">
                    <th className="p-3 sm:p-4">Category Name</th>
                    <th className="p-3 sm:p-4">Active Items</th>
                    <th className="p-3 sm:p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#efeeec] text-body-sm">
                  {categories.map((c) => (
                    <tr key={c.category} className="hover:bg-[#faf9f7] transition-colors">
                      <td className="p-3 sm:p-4 uppercase font-mono font-medium text-[#1a1c1b] text-xs sm:text-sm">
                        {c.category}
                      </td>
                      <td className="p-3 sm:p-4 font-mono text-[#444748] text-xs sm:text-sm">
                        {c.count} products
                      </td>
                      <td className="p-3 sm:p-4 text-right">
                        <button
                          onClick={() => handleDeleteCategory(c.category)}
                          className="p-2 hover:bg-red-50 text-[#444748] hover:text-red-600 transition-colors"
                          title="Remove Category"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* --- TAB 5: INQUIRIES & CONTACT MESSAGES --- */}
        {activeTab === 'inquiries' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
              <div>
                <span className="text-[10px] uppercase tracking-[0.25em] text-[#8c9a86] font-mono block mb-1">
                  Client Sanctuary
                </span>
                <h2
                  className="text-xl sm:text-2xl font-normal uppercase tracking-wider text-[#1a1c1b]"
                  style={{ fontFamily: "'Libre Caslon Text', Georgia, serif" }}
                >
                  Client Inquiries & Contact Forms ({filteredInquiries.length})
                </h2>
              </div>

              {/* Type Filter Chips */}
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {(['all', 'contact', 'bespoke', 'trade'] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() => setInquiryFilter(type)}
                    className={`px-3 py-1 text-[11px] sm:text-label-caps uppercase font-mono transition-colors border ${
                      inquiryFilter === type
                        ? 'bg-[#1a1c1b] text-white border-[#1a1c1b]'
                        : 'bg-white text-[#444748] border-[#c4c7c7] hover:bg-[#efeeec]'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Inquiries Stream */}
            <div className="space-y-3 sm:space-y-4">
              {filteredInquiries.map((inq) => (
                <div key={inq.id} className="bg-white border border-[#c4c7c7] p-3.5 sm:p-6 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#efeeec] pb-2.5 sm:pb-3">
                    <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                      <span
                        className={`text-[9.5px] font-mono uppercase px-1.5 py-0.5 border shrink-0 ${
                          inq.type === 'bespoke'
                            ? 'bg-purple-50 text-purple-800 border-purple-200'
                            : inq.type === 'trade'
                            ? 'bg-blue-50 text-blue-800 border-blue-200'
                            : 'bg-amber-50 text-amber-800 border-amber-200'
                        }`}
                      >
                        {inq.type}
                      </span>
                      <h4 className="text-sm sm:text-title-sm font-medium text-[#1a1c1b]">{inq.title}</h4>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-2 w-full sm:w-auto">
                      <span className="text-[11px] font-mono text-[#444748]">
                        {new Date(inq.submittedAt).toLocaleDateString()}
                      </span>
                      <select
                        value={inq.status}
                        onChange={(e) =>
                          handleUpdateInquiryStatus(
                            inq.id,
                            e.target.value as 'pending' | 'contacted' | 'resolved'
                          )
                        }
                        className={`text-[10px] font-mono uppercase px-2 py-1 border outline-none ${
                          inq.status === 'resolved'
                            ? 'bg-[#8c9a86]/20 border-[#8c9a86] text-[#2c3d26]'
                            : inq.status === 'contacted'
                            ? 'bg-[#d7c7b3]/30 border-[#d7c7b3] text-[#1a1c1b]'
                            : 'bg-red-50 border-red-300 text-red-700'
                        }`}
                      >
                        <option value="pending">Pending</option>
                        <option value="contacted">Contacted</option>
                        <option value="resolved">Resolved</option>
                      </select>
                    </div>
                  </div>

                  <p className="text-xs sm:text-body-sm text-[#444748] leading-relaxed">{inq.details}</p>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 text-[11px] sm:text-body-xs text-[#444748] border-t border-[#efeeec]">
                    <div className="flex flex-wrap items-center gap-2 sm:gap-4">
                      <span>Sender: <strong className="text-[#1a1c1b]">{inq.sender}</strong></span>
                      <a
                        href={`mailto:${inq.email}?subject=Regarding your BOSKI LIMITED inquiry`}
                        className="text-[#1a1c1b] underline hover:text-[#d7c7b3] break-all"
                      >
                        {inq.email}
                      </a>
                      {inq.phone && <span>Tel: {inq.phone}</span>}
                    </div>
                  </div>
                </div>
              ))}
              {filteredInquiries.length === 0 && (
                <div className="bg-white border border-[#c4c7c7] p-6 sm:p-8 text-center text-[#444748] text-sm">
                  No inquiries found under the selected filter.
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* --- CREATE / EDIT PRODUCT MODAL --- */}
      {isCreateModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/60 backdrop-blur-sm overflow-y-auto"
          onClick={() => setIsCreateModalOpen(false)}
        >
          <div
            className="bg-[#faf9f7] w-full max-w-3xl border border-[#c4c7c7] shadow-2xl p-4 sm:p-6 md:p-8 max-h-[92vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[#c4c7c7] pb-3 sm:pb-4 mb-4 sm:mb-6">
              <h3
                className="text-xl sm:text-2xl font-normal uppercase tracking-wider text-[#1a1c1b]"
                style={{ fontFamily: "'Libre Caslon Text', Georgia, serif" }}
              >
                {editingProduct ? 'Edit Catalog Piece' : 'New Atelier Product'}
              </h3>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="w-8 h-8 flex items-center justify-center text-[#444748] hover:text-black hover:bg-[#efeeec] transition-colors"
                title="Close"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                <div className="space-y-1">
                  <label className="text-label-caps text-[#444748] block">Product Title *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Master Atelier Linen Duvet"
                    className="w-full px-3 py-2 border border-[#c4c7c7] bg-white text-body-sm outline-none focus:border-black"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-label-caps text-[#444748] block">Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 border border-[#c4c7c7] bg-white text-body-sm outline-none focus:border-black uppercase font-mono"
                  >
                    {categories.map((c) => (
                      <option key={c.category} value={c.category}>
                        {c.category.toUpperCase()}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-label-caps text-[#444748] block">Subtitle / Sub-heading</label>
                <input
                  type="text"
                  value={formData.subtitle}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  placeholder="e.g. 480-Thread-Count Egyptian Cotton Sateen"
                  className="w-full px-3 py-2 border border-[#c4c7c7] bg-white text-body-sm outline-none focus:border-black"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                <div className="space-y-1">
                  <label className="text-label-caps text-[#444748] block">Price (USD) *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-[#c4c7c7] bg-white text-body-sm outline-none focus:border-black font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-label-caps text-[#444748] block">Original Price (USD)</label>
                  <input
                    type="number"
                    value={formData.originalPrice}
                    onChange={(e) => setFormData({ ...formData, originalPrice: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-[#c4c7c7] bg-white text-body-sm outline-none focus:border-black font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-label-caps text-[#444748] block">Inventory Stock</label>
                  <input
                    type="number"
                    value={formData.stockCount}
                    onChange={(e) => setFormData({ ...formData, stockCount: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-[#c4c7c7] bg-white text-body-sm outline-none focus:border-black font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-label-caps text-[#444748] block">Primary Image URL</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    placeholder="/uploads/... or https://images.unsplash.com/..."
                    className="flex-1 px-3 py-2 border border-[#c4c7c7] bg-white text-body-sm outline-none focus:border-black font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setActiveTab('upload')}
                    className="px-3 py-2 bg-[#efeeec] border border-[#c4c7c7] text-[11px] sm:text-label-caps uppercase text-[#1a1c1b] hover:bg-black hover:text-white transition-colors shrink-0"
                  >
                    Open CDN
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="space-y-1">
                  <label className="text-label-caps text-[#444748] block">Color Swatch Name</label>
                  <input
                    type="text"
                    value={formData.colorName}
                    onChange={(e) => setFormData({ ...formData, colorName: e.target.value })}
                    placeholder="e.g. Warm Ivory, Slate Grey"
                    className="w-full px-3 py-2 border border-[#c4c7c7] bg-white text-body-sm outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-label-caps text-[#444748] block">Color Hex</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={formData.colorHex}
                      onChange={(e) => setFormData({ ...formData, colorHex: e.target.value })}
                      className="w-10 h-10 border border-[#c4c7c7] p-1 bg-white cursor-pointer"
                    />
                    <input
                      type="text"
                      value={formData.colorHex}
                      onChange={(e) => setFormData({ ...formData, colorHex: e.target.value })}
                      className="flex-1 px-3 py-2 border border-[#c4c7c7] bg-white text-body-sm font-mono outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-label-caps text-[#444748] block">Description</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Editorial copy describing the textile drape, loom characteristics and feel..."
                  className="w-full px-3 py-2 border border-[#c4c7c7] bg-white text-body-sm outline-none focus:border-black resize-none"
                />
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 pt-2">
                <label className="flex items-center gap-2 text-body-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.inStock}
                    onChange={(e) => setFormData({ ...formData, inStock: e.target.checked })}
                    className="w-4 h-4 accent-black"
                  />
                  <span>Mark as In Stock</span>
                </label>

                <label className="flex items-center gap-2 text-body-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isFeatured}
                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                    className="w-4 h-4 accent-black"
                  />
                  <span>Feature on Storefront Homepage</span>
                </label>
              </div>

              <div className="flex flex-col-reverse sm:flex-row justify-end gap-2.5 sm:gap-3 pt-4 border-t border-[#c4c7c7]">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="w-full sm:w-auto px-6 py-3 sm:py-2.5 bg-[#efeeec] text-[#1a1c1b] text-label-caps uppercase tracking-wider hover:bg-[#e3e2e0] transition-colors text-center"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-full sm:w-auto px-8 py-3 sm:py-2.5 bg-[#1a1c1b] text-white text-label-caps uppercase tracking-wider hover:bg-black transition-colors text-center"
                >
                  {editingProduct ? 'Save Modifications' : 'Create in Catalog'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
