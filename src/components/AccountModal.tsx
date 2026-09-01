import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { Address } from '../types';
import {
  X,
  User as UserIcon,
  Package,
  MapPin,
  Crown,
  Sparkles,
  Truck,
  Download,
  Plus,
  Edit2,
  Trash2,
  Check,
  LogOut,
  ShieldCheck,
  Clock,
  ChevronRight,
  Save,
  RotateCcw,
  ShoppingBag
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const AccountModal: React.FC = () => {
  const {
    isAccountOpen,
    setIsAccountOpen,
    currentUser,
    logout,
    setIsAuthOpen,
    setAuthMode,
    orderHistory,
    formatPrice,
    updateUserProfile,
    addAddress,
    editAddress,
    deleteAddress,
    setDefaultAddress,
    addToCart,
    showToast,
  } = useShop();

  const [activeTab, setActiveTab] = useState<'orders' | 'profile' | 'addresses' | 'privileges'>('orders');

  // Tracking modal state
  const [selectedTrackingOrder, setSelectedTrackingOrder] = useState<any | null>(null);

  // Address Form Modal state
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [addressForm, setAddressForm] = useState<Omit<Address, 'id'>>({
    label: '',
    firstName: '',
    lastName: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States',
    phone: '',
    isDefault: false,
  });

  // Profile Edit State
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({
    firstName: currentUser?.firstName || '',
    lastName: currentUser?.lastName || '',
    email: currentUser?.email || '',
    phone: currentUser?.phone || '',
  });

  if (!isAccountOpen) return null;

  if (!currentUser) {
    return (
      <AnimatePresence>
        <div
          id="account-guest-overlay"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md"
          onClick={() => setIsAccountOpen(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            id="account-guest-content"
            className="bg-[#FAF9F6] w-full max-w-md rounded-3xl p-8 shadow-2xl border border-neutral-200 text-center space-y-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-16 h-16 rounded-full bg-neutral-900 text-amber-300 flex items-center justify-center mx-auto shadow-md">
              <Crown className="w-8 h-8" />
            </div>

            <div>
              <h3 className="font-serif text-2xl text-neutral-950 font-medium">
                Client Sign In Required
              </h3>
              <p className="text-xs text-neutral-500 mt-2 leading-relaxed">
                Sign in to your private Atelier account to inspect your order history, manage saved residences, and claim VIP privileges.
              </p>
            </div>

            <div className="space-y-3">
              <button
                id="account-guest-login-btn"
                onClick={() => {
                  setIsAccountOpen(false);
                  setAuthMode('login');
                  setIsAuthOpen(true);
                }}
                className="w-full py-3.5 bg-neutral-950 hover:bg-neutral-800 text-white text-xs font-bold uppercase tracking-[0.2em] rounded-xl shadow-lg transition-all"
              >
                Sign In to Account
              </button>

              <button
                id="account-guest-register-btn"
                onClick={() => {
                  setIsAccountOpen(false);
                  setAuthMode('signup');
                  setIsAuthOpen(true);
                }}
                className="w-full py-3 bg-white hover:bg-neutral-100 border border-neutral-300 text-neutral-900 text-xs font-bold uppercase tracking-wider rounded-xl transition-all"
              >
                Create New Account
              </button>
            </div>
          </motion.div>
        </div>
      </AnimatePresence>
    );
  }

  const mockPastOrders = [
    {
      orderId: 'EA-948102',
      date: 'January 14, 2025',
      status: 'Delivered',
      subtotal: 1250,
      discount: 0,
      shipping: 0,
      tax: 100,
      total: 1350,
      itemsSummary: 'Chronograph No. 04 (Silver / 40mm)',
      trackingNumber: 'ATEL-8831920194',
    },
    {
      orderId: 'EA-719302',
      date: 'December 20, 2024',
      status: 'Delivered',
      subtotal: 890,
      discount: 178,
      shipping: 0,
      tax: 71,
      total: 783,
      itemsSummary: 'The Cashmere Overcoat (Camel Taupe / M)',
      trackingNumber: 'ATEL-6629103941',
    },
  ];

  const allOrders = [
    ...orderHistory.map((o) => ({
      orderId: o.orderId,
      date: o.date,
      status: o.status,
      subtotal: o.subtotal,
      discount: o.discount,
      shipping: o.shipping,
      tax: o.tax,
      total: o.total,
      itemsSummary: o.items.map((i) => `${i.product.name} (${i.selectedColor.name}, ${i.selectedSize}) x${i.quantity}`).join(', '),
      items: o.items,
      trackingNumber: o.trackingNumber,
    })),
    ...mockPastOrders,
  ];

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({
      firstName: profileForm.firstName,
      lastName: profileForm.lastName,
      email: profileForm.email,
      phone: profileForm.phone,
    });
    setIsEditingProfile(false);
  };

  const handleOpenNewAddress = () => {
    setEditingAddressId(null);
    setAddressForm({
      label: 'Home Residence',
      firstName: currentUser.firstName,
      lastName: currentUser.lastName,
      addressLine1: '',
      addressLine2: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'United States',
      phone: currentUser.phone || '',
      isDefault: currentUser.addresses.length === 0,
    });
    setIsAddressModalOpen(true);
  };

  const handleOpenEditAddress = (addr: Address) => {
    setEditingAddressId(addr.id);
    setAddressForm({
      label: addr.label,
      firstName: addr.firstName,
      lastName: addr.lastName,
      addressLine1: addr.addressLine1,
      addressLine2: addr.addressLine2 || '',
      city: addr.city,
      state: addr.state,
      zipCode: addr.zipCode,
      country: addr.country,
      phone: addr.phone,
      isDefault: addr.isDefault,
    });
    setIsAddressModalOpen(true);
  };

  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addressForm.addressLine1 || !addressForm.city || !addressForm.zipCode) {
      showToast('Incomplete Address', 'Please provide full street and postal details.', 'info');
      return;
    }

    if (editingAddressId) {
      editAddress(editingAddressId, addressForm);
    } else {
      addAddress(addressForm);
    }
    setIsAddressModalOpen(false);
  };

  return (
    <AnimatePresence>
      <div
        id="account-modal-overlay"
        className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/75 backdrop-blur-md overflow-y-auto"
        onClick={() => setIsAccountOpen(false)}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 15 }}
          transition={{ duration: 0.22 }}
          id="account-modal-content"
          className="bg-[#FAF9F6] w-full max-w-4xl rounded-3xl shadow-2xl border border-neutral-200 overflow-hidden flex flex-col max-h-[92vh]"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header Profile Summary Bar */}
          <div className="p-6 bg-white border-b border-neutral-200 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-neutral-950 text-amber-300 flex items-center justify-center font-serif text-2xl font-bold shadow-md border border-neutral-800">
                {currentUser.firstName.charAt(0)}
                {currentUser.lastName.charAt(0)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-serif text-xl sm:text-2xl text-neutral-950 font-medium">
                    {currentUser.firstName} {currentUser.lastName}
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-900 border border-amber-300 text-[10px] uppercase font-bold tracking-wider flex items-center gap-1">
                    <Crown className="w-3 h-3 text-amber-600" />
                    {currentUser.vipTier} VIP
                  </span>
                </div>
                <p className="text-xs text-neutral-500 mt-0.5">
                  {currentUser.email} &bull; Member since {currentUser.joinedDate}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                id="account-logout-btn"
                onClick={logout}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold text-neutral-600 hover:text-rose-600 hover:bg-rose-50 border border-neutral-200 transition-colors flex items-center gap-1.5"
                title="Sign out of account"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>

              <button
                id="account-close-btn"
                onClick={() => setIsAccountOpen(false)}
                className="p-2 rounded-full text-neutral-400 hover:text-neutral-950 hover:bg-neutral-100 transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Subsections Navigation Tabs */}
          <div className="px-6 py-3 bg-neutral-100/90 border-b border-neutral-200 flex items-center gap-2 overflow-x-auto no-scrollbar">
            <button
              id="account-tab-orders"
              onClick={() => setActiveTab('orders')}
              className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'orders'
                  ? 'bg-neutral-950 text-white shadow-sm'
                  : 'text-neutral-600 hover:text-neutral-950 hover:bg-neutral-200/60'
              }`}
            >
              <Package className="w-3.5 h-3.5" />
              <span>Order History ({allOrders.length})</span>
            </button>

            <button
              id="account-tab-profile"
              onClick={() => setActiveTab('profile')}
              className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'profile'
                  ? 'bg-neutral-950 text-white shadow-sm'
                  : 'text-neutral-600 hover:text-neutral-950 hover:bg-neutral-200/60'
              }`}
            >
              <UserIcon className="w-3.5 h-3.5" />
              <span>Personal Details</span>
            </button>

            <button
              id="account-tab-addresses"
              onClick={() => setActiveTab('addresses')}
              className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'addresses'
                  ? 'bg-neutral-950 text-white shadow-sm'
                  : 'text-neutral-600 hover:text-neutral-950 hover:bg-neutral-200/60'
              }`}
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>Addresses ({currentUser.addresses.length})</span>
            </button>

            <button
              id="account-tab-privileges"
              onClick={() => setActiveTab('privileges')}
              className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'privileges'
                  ? 'bg-neutral-950 text-white shadow-sm'
                  : 'text-neutral-600 hover:text-neutral-950 hover:bg-neutral-200/60'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>VIP Privileges</span>
            </button>
          </div>

          {/* Tab Contents */}
          <div className="p-6 overflow-y-auto space-y-6 flex-1">
            {/* 1. ORDER HISTORY TAB */}
            {activeTab === 'orders' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                    Acquisition & Dispatch History
                  </h4>
                  <span className="text-xs text-neutral-400 font-medium">
                    Showing {allOrders.length} verified orders
                  </span>
                </div>

                {allOrders.map((ord) => (
                  <div
                    key={ord.orderId}
                    id={`order-item-${ord.orderId}`}
                    className="p-5 bg-white rounded-2xl border border-neutral-200 shadow-xs hover:border-neutral-300 transition-all space-y-3"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-neutral-100 flex items-center justify-center text-neutral-700">
                          <Package className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-neutral-950 font-serif">
                              Order #{ord.orderId}
                            </span>
                            <span
                              className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                ord.status === 'Delivered'
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                  : 'bg-amber-50 text-amber-800 border border-amber-200'
                              }`}
                            >
                              {ord.status}
                            </span>
                          </div>
                          <span className="text-xs text-neutral-400">Placed on {ord.date}</span>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-base font-bold text-neutral-950">
                          {formatPrice(ord.total)}
                        </span>
                      </div>
                    </div>

                    {/* Items Summary */}
                    <div className="p-3 bg-neutral-50 rounded-xl text-xs text-neutral-700 font-medium">
                      {ord.itemsSummary}
                    </div>

                    {/* Order Details & Actions */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-neutral-100 text-xs">
                      <span className="font-mono text-neutral-500 text-[11px] flex items-center gap-1">
                        <Truck className="w-3.5 h-3.5 text-neutral-400" />
                        Tracking: <strong className="text-neutral-800">{ord.trackingNumber}</strong>
                      </span>

                      <div className="flex items-center gap-2">
                        <button
                          id={`track-order-btn-${ord.orderId}`}
                          onClick={() => setSelectedTrackingOrder(ord)}
                          className="px-3 py-1.5 bg-neutral-950 hover:bg-neutral-800 text-white rounded-lg font-semibold text-xs uppercase tracking-wider transition-colors flex items-center gap-1"
                        >
                          <Truck className="w-3.5 h-3.5" />
                          <span>Track Dispatch</span>
                        </button>

                        <button
                          id={`invoice-btn-${ord.orderId}`}
                          onClick={() => showToast('Invoice Generated', `Invoice PDF for #${ord.orderId} ready for download.`, 'info')}
                          className="px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded-lg font-semibold text-xs transition-colors flex items-center gap-1"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Invoice</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* 2. PERSONAL DETAILS TAB */}
            {activeTab === 'profile' && (
              <div className="space-y-6">
                {/* Profile Form Card */}
                <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-xs space-y-5">
                  <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
                    <div>
                      <h4 className="font-serif text-lg text-neutral-950 font-medium">
                        Client Credentials
                      </h4>
                      <p className="text-xs text-neutral-500">
                        Manage your primary contact and VIP concierge preferences.
                      </p>
                    </div>

                    {!isEditingProfile && (
                      <button
                        id="edit-profile-btn"
                        onClick={() => {
                          setProfileForm({
                            firstName: currentUser.firstName,
                            lastName: currentUser.lastName,
                            email: currentUser.email,
                            phone: currentUser.phone || '',
                          });
                          setIsEditingProfile(true);
                        }}
                        className="px-3.5 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        <span>Edit Details</span>
                      </button>
                    )}
                  </div>

                  {isEditingProfile ? (
                    <form onSubmit={handleSaveProfile} className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700">
                            First Name
                          </label>
                          <input
                            type="text"
                            required
                            value={profileForm.firstName}
                            onChange={(e) => setProfileForm({ ...profileForm, firstName: e.target.value })}
                            className="w-full px-3.5 py-2.5 bg-white rounded-xl border border-neutral-200 text-xs text-neutral-900 focus:outline-none focus:border-neutral-950"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700">
                            Last Name
                          </label>
                          <input
                            type="text"
                            required
                            value={profileForm.lastName}
                            onChange={(e) => setProfileForm({ ...profileForm, lastName: e.target.value })}
                            className="w-full px-3.5 py-2.5 bg-white rounded-xl border border-neutral-200 text-xs text-neutral-900 focus:outline-none focus:border-neutral-950"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700">
                            Email Address
                          </label>
                          <input
                            type="email"
                            required
                            value={profileForm.email}
                            onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                            className="w-full px-3.5 py-2.5 bg-white rounded-xl border border-neutral-200 text-xs text-neutral-900 focus:outline-none focus:border-neutral-950"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700">
                            Concierge Phone
                          </label>
                          <input
                            type="tel"
                            value={profileForm.phone}
                            onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                            className="w-full px-3.5 py-2.5 bg-white rounded-xl border border-neutral-200 text-xs text-neutral-900 focus:outline-none focus:border-neutral-950"
                          />
                        </div>
                      </div>

                      <div className="flex justify-end gap-2 pt-3">
                        <button
                          type="button"
                          onClick={() => setIsEditingProfile(false)}
                          className="px-4 py-2 text-xs font-semibold text-neutral-600 hover:text-neutral-900"
                        >
                          Cancel
                        </button>
                        <button
                          id="save-profile-btn"
                          type="submit"
                          className="px-5 py-2 bg-neutral-950 hover:bg-neutral-800 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-1.5"
                        >
                          <Save className="w-3.5 h-3.5" />
                          <span>Save Changes</span>
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                      <div className="p-3.5 bg-neutral-50 rounded-xl border border-neutral-100">
                        <span className="text-neutral-400 font-medium block">Full Name</span>
                        <span className="text-sm font-bold text-neutral-900 mt-0.5 block">
                          {currentUser.firstName} {currentUser.lastName}
                        </span>
                      </div>
                      <div className="p-3.5 bg-neutral-50 rounded-xl border border-neutral-100">
                        <span className="text-neutral-400 font-medium block">Primary Email</span>
                        <span className="text-sm font-bold text-neutral-900 mt-0.5 block">
                          {currentUser.email}
                        </span>
                      </div>
                      <div className="p-3.5 bg-neutral-50 rounded-xl border border-neutral-100">
                        <span className="text-neutral-400 font-medium block">Phone Contact</span>
                        <span className="text-sm font-bold text-neutral-900 mt-0.5 block">
                          {currentUser.phone || 'None on file'}
                        </span>
                      </div>
                      <div className="p-3.5 bg-neutral-50 rounded-xl border border-neutral-100">
                        <span className="text-neutral-400 font-medium block">Member Standing</span>
                        <span className="text-sm font-bold text-neutral-900 mt-0.5 block flex items-center gap-1">
                          <Crown className="w-3.5 h-3.5 text-amber-500" />
                          {currentUser.vipTier} Tier
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Password & Security Card */}
                <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-xs flex items-center justify-between">
                  <div>
                    <h4 className="font-serif text-base text-neutral-950 font-medium">
                      Security & Passcode
                    </h4>
                    <p className="text-xs text-neutral-500">
                      Last updated 3 months ago &bull; Two-factor biometric verification enabled
                    </p>
                  </div>
                  <button
                    onClick={() => showToast('Passcode Update', 'A secure reset link has been dispatched to your email.', 'info')}
                    className="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-semibold rounded-xl transition-colors"
                  >
                    Change Password
                  </button>
                </div>
              </div>
            )}

            {/* 3. ADDRESSES SUBSECTION */}
            {activeTab === 'addresses' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                      Saved Residences & Destinations
                    </h4>
                    <p className="text-xs text-neutral-400">
                      Complimentary white-glove courier delivery to all addresses.
                    </p>
                  </div>
                  <button
                    id="add-address-btn"
                    onClick={handleOpenNewAddress}
                    className="px-4 py-2 bg-neutral-950 hover:bg-neutral-800 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-colors flex items-center gap-1.5 shadow-sm"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add New Address</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {currentUser.addresses.map((addr) => (
                    <div
                      key={addr.id}
                      id={`address-card-${addr.id}`}
                      className={`p-5 bg-white rounded-2xl border transition-all relative flex flex-col justify-between space-y-4 ${
                        addr.isDefault
                          ? 'border-neutral-950 shadow-md ring-1 ring-neutral-950'
                          : 'border-neutral-200 hover:border-neutral-300'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-bold uppercase tracking-wider text-neutral-900 flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-neutral-500" />
                            {addr.label}
                          </span>
                          {addr.isDefault && (
                            <span className="px-2.5 py-0.5 rounded-full bg-neutral-950 text-white text-[10px] font-bold uppercase tracking-wider">
                              Default Primary
                            </span>
                          )}
                        </div>

                        <div className="text-xs text-neutral-600 space-y-1">
                          <p className="font-bold text-neutral-900">
                            {addr.firstName} {addr.lastName}
                          </p>
                          <p>{addr.addressLine1}</p>
                          {addr.addressLine2 && <p>{addr.addressLine2}</p>}
                          <p>
                            {addr.city}, {addr.state} {addr.zipCode}
                          </p>
                          <p className="text-neutral-500">{addr.country}</p>
                          <p className="text-neutral-400 pt-1">Tel: {addr.phone}</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-neutral-100">
                        {!addr.isDefault && (
                          <button
                            id={`set-default-addr-${addr.id}`}
                            onClick={() => setDefaultAddress(addr.id)}
                            className="text-xs text-neutral-600 hover:text-neutral-950 font-semibold underline underline-offset-2"
                          >
                            Set as Default
                          </button>
                        )}
                        {addr.isDefault && <span />}

                        <div className="flex items-center gap-2">
                          <button
                            id={`edit-addr-btn-${addr.id}`}
                            onClick={() => handleOpenEditAddress(addr)}
                            className="p-1.5 rounded-lg text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100"
                            title="Edit Address"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          {currentUser.addresses.length > 1 && (
                            <button
                              id={`delete-addr-btn-${addr.id}`}
                              onClick={() => deleteAddress(addr.id)}
                              className="p-1.5 rounded-lg text-neutral-400 hover:text-rose-600 hover:bg-rose-50"
                              title="Delete Address"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 4. PRIVILEGES SUBSECTION */}
            {activeTab === 'privileges' && (
              <div className="space-y-6">
                {/* VIP Points Card */}
                <div className="bg-gradient-to-r from-neutral-900 via-neutral-950 to-neutral-900 text-white p-6 rounded-3xl border border-neutral-800 shadow-xl space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <span className="text-[10px] uppercase tracking-[0.25em] text-amber-400 font-bold block">
                        VIP Tier Balance
                      </span>
                      <h4 className="font-serif text-3xl font-normal text-white mt-1">
                        {currentUser.pointsBalance.toLocaleString()} Atelier Points
                      </h4>
                    </div>
                    <span className="px-3.5 py-1.5 bg-amber-400/20 text-amber-300 text-xs font-bold uppercase tracking-wider rounded-full border border-amber-400/30">
                      Tier: {currentUser.vipTier}
                    </span>
                  </div>

                  {/* Progress to Diamond */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs text-neutral-300">
                      <span>Progress to Diamond Concierge</span>
                      <span>$750 remaining</span>
                    </div>
                    <div className="w-full h-2.5 bg-neutral-800 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-amber-400 via-amber-300 to-amber-200 rounded-full w-4/5" />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    {
                      title: 'Bespoke Atelier Monogramming',
                      desc: 'Complimentary hand-embossed initials on all Tuscan leather goods and luggage tags.',
                    },
                    {
                      title: 'Private Vault 48-Hour Pre-Access',
                      desc: 'First rights to acquire limited edition run seasonal drops before public announcements.',
                    },
                    {
                      title: 'Dedicated Senior Stylist Consultations',
                      desc: 'Direct WhatsApp and private video fitting appointments with our Milan styling salon.',
                    },
                    {
                      title: 'Complimentary Lifetime Garment Care',
                      desc: 'Annual cashmere de-pilling, leather conditioning, and watch regulation checkups.',
                    },
                  ].map((priv, i) => (
                    <div
                      key={i}
                      className="p-5 bg-white rounded-2xl border border-neutral-200 space-y-1.5 shadow-xs"
                    >
                      <div className="flex items-center gap-2 text-neutral-900 font-bold text-xs uppercase tracking-wider">
                        <Sparkles className="w-4 h-4 text-amber-600" />
                        <span>{priv.title}</span>
                      </div>
                      <p className="text-xs text-neutral-600 font-light leading-relaxed pl-6">
                        {priv.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Tracking Milestone Modal Overlay */}
          {selectedTrackingOrder && (
            <div
              id="tracking-modal-suboverlay"
              className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
              onClick={() => setSelectedTrackingOrder(null)}
            >
              <div
                className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-neutral-200 space-y-6"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
                  <div>
                    <h4 className="font-serif text-xl text-neutral-950">
                      Dispatch Progress
                    </h4>
                    <p className="text-xs text-neutral-400">Order #{selectedTrackingOrder.orderId}</p>
                  </div>
                  <button
                    onClick={() => setSelectedTrackingOrder(null)}
                    className="p-1 rounded-full text-neutral-400 hover:text-black"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Progress Steps */}
                <div className="space-y-4">
                  {[
                    { step: 'Order Placed & Vault Reserved', done: true, time: '10:00 AM' },
                    { step: 'Artisan Quality & Authenticity Inspection', done: true, time: '02:30 PM' },
                    { step: 'Embossed & Sealed in Signature Box', done: true, time: '05:45 PM' },
                    {
                      step: 'Courier Handover & In Transit',
                      done: selectedTrackingOrder.status === 'Shipped' || selectedTrackingOrder.status === 'Delivered',
                      time: 'Next Day',
                    },
                    {
                      step: 'Delivered to Concierge / Residence',
                      done: selectedTrackingOrder.status === 'Delivered',
                      time: 'Completed',
                    },
                  ].map((s, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${
                          s.done ? 'bg-neutral-950 text-white' : 'bg-neutral-200 text-neutral-400'
                        }`}
                      >
                        {s.done ? <Check className="w-3.5 h-3.5" /> : idx + 1}
                      </div>
                      <div className="flex-1">
                        <p className={`text-xs font-semibold ${s.done ? 'text-neutral-900' : 'text-neutral-400'}`}>
                          {s.step}
                        </p>
                        <span className="text-[10px] text-neutral-400">{s.time}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-3.5 bg-neutral-50 rounded-xl border border-neutral-200 text-xs text-neutral-600">
                  <span>Tracking Reference: <strong>{selectedTrackingOrder.trackingNumber}</strong></span>
                </div>
              </div>
            </div>
          )}

          {/* Add / Edit Address Modal Overlay */}
          {isAddressModalOpen && (
            <div
              id="address-editor-suboverlay"
              className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
              onClick={() => setIsAddressModalOpen(false)}
            >
              <div
                className="bg-[#FAF9F6] rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-neutral-200 space-y-5"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
                  <h4 className="font-serif text-xl text-neutral-950 font-medium">
                    {editingAddressId ? 'Edit Address' : 'Add New Residence Destination'}
                  </h4>
                  <button
                    onClick={() => setIsAddressModalOpen(false)}
                    className="p-1 rounded-full text-neutral-400 hover:text-black"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleSaveAddress} className="space-y-4 text-xs">
                  <div className="space-y-1">
                    <label className="font-bold uppercase tracking-wider text-neutral-700">
                      Address Nickname / Label
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Manhattan Penthouse, Paris Pied-à-terre"
                      value={addressForm.label}
                      onChange={(e) => setAddressForm({ ...addressForm, label: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-white rounded-xl border border-neutral-200 text-neutral-900 focus:outline-none focus:border-neutral-950"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="font-bold uppercase tracking-wider text-neutral-700">
                        First Name
                      </label>
                      <input
                        type="text"
                        required
                        value={addressForm.firstName}
                        onChange={(e) => setAddressForm({ ...addressForm, firstName: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-white rounded-xl border border-neutral-200 text-neutral-900 focus:outline-none focus:border-neutral-950"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-bold uppercase tracking-wider text-neutral-700">
                        Last Name
                      </label>
                      <input
                        type="text"
                        required
                        value={addressForm.lastName}
                        onChange={(e) => setAddressForm({ ...addressForm, lastName: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-white rounded-xl border border-neutral-200 text-neutral-900 focus:outline-none focus:border-neutral-950"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold uppercase tracking-wider text-neutral-700">
                      Street Address
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="740 Park Avenue"
                      value={addressForm.addressLine1}
                      onChange={(e) => setAddressForm({ ...addressForm, addressLine1: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-white rounded-xl border border-neutral-200 text-neutral-900 focus:outline-none focus:border-neutral-950"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold uppercase tracking-wider text-neutral-700">
                      Apartment / Suite / Floor (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="Apt 14B"
                      value={addressForm.addressLine2}
                      onChange={(e) => setAddressForm({ ...addressForm, addressLine2: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-white rounded-xl border border-neutral-200 text-neutral-900 focus:outline-none focus:border-neutral-950"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div className="space-y-1">
                      <label className="font-bold uppercase tracking-wider text-neutral-700">
                        City
                      </label>
                      <input
                        type="text"
                        required
                        value={addressForm.city}
                        onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                        className="w-full px-3 py-2.5 bg-white rounded-xl border border-neutral-200 text-neutral-900 focus:outline-none focus:border-neutral-950"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-bold uppercase tracking-wider text-neutral-700">
                        State/Region
                      </label>
                      <input
                        type="text"
                        required
                        value={addressForm.state}
                        onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                        className="w-full px-3 py-2.5 bg-white rounded-xl border border-neutral-200 text-neutral-900 focus:outline-none focus:border-neutral-950"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-bold uppercase tracking-wider text-neutral-700">
                        ZIP / Postal
                      </label>
                      <input
                        type="text"
                        required
                        value={addressForm.zipCode}
                        onChange={(e) => setAddressForm({ ...addressForm, zipCode: e.target.value })}
                        className="w-full px-3 py-2.5 bg-white rounded-xl border border-neutral-200 text-neutral-900 focus:outline-none focus:border-neutral-950"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="font-bold uppercase tracking-wider text-neutral-700">
                        Country
                      </label>
                      <select
                        value={addressForm.country}
                        onChange={(e) => setAddressForm({ ...addressForm, country: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-white rounded-xl border border-neutral-200 text-neutral-900 focus:outline-none focus:border-neutral-950"
                      >
                        <option value="United States">United States</option>
                        <option value="United Kingdom">United Kingdom</option>
                        <option value="France">France</option>
                        <option value="Italy">Italy</option>
                        <option value="Switzerland">Switzerland</option>
                        <option value="Japan">Japan</option>
                        <option value="Canada">Canada</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="font-bold uppercase tracking-wider text-neutral-700">
                        Phone
                      </label>
                      <input
                        type="tel"
                        required
                        value={addressForm.phone}
                        onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-white rounded-xl border border-neutral-200 text-neutral-900 focus:outline-none focus:border-neutral-950"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <input
                      id="addr-default-chk"
                      type="checkbox"
                      checked={addressForm.isDefault}
                      onChange={(e) => setAddressForm({ ...addressForm, isDefault: e.target.checked })}
                      className="rounded border-neutral-300 text-neutral-950 focus:ring-neutral-950 cursor-pointer"
                    />
                    <label htmlFor="addr-default-chk" className="text-xs text-neutral-700 cursor-pointer font-medium">
                      Set as primary default destination
                    </label>
                  </div>

                  <div className="flex justify-end gap-2 pt-4 border-t border-neutral-200">
                    <button
                      type="button"
                      onClick={() => setIsAddressModalOpen(false)}
                      className="px-4 py-2.5 text-xs font-semibold text-neutral-600 hover:text-neutral-900"
                    >
                      Cancel
                    </button>
                    <button
                      id="submit-address-btn"
                      type="submit"
                      className="px-6 py-2.5 bg-neutral-950 hover:bg-neutral-800 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors"
                    >
                      Save Destination
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
