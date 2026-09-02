'use client';

import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { Address } from '../types';
import {
  Package,
  MapPin,
  CreditCard,
  User as UserIcon,
  Heart,
  ExternalLink,
  ChevronRight,
  Edit2,
  Check,
  Plus,
  Trash2,
  Sparkles,
  ShoppingBag,
  ArrowRight
} from 'lucide-react';
import { motion } from 'motion/react';

export const MyAccountPage: React.FC = () => {
  const {
    currentUser,
    orderHistory,
    wishlist,
    formatPrice,
    updateUserProfile,
    editAddress,
    addAddress,
    deleteAddress,
    setDefaultAddress,
    setIsWishlistOpen,
    setSelectedProductForQuickView,
    showToast,
    setActivePage,
    isDarkMode,
  } = useShop();

  const [activeTab, setActiveTab] = useState<
    'overview' | 'orders' | 'wishlist' | 'personal' | 'addresses' | 'payment'
  >('overview');

  // Edit Address Modal State
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const defaultAddress = currentUser?.addresses.find((a) => a.isDefault) || currentUser?.addresses[0];
  const [addressForm, setAddressForm] = useState({
    firstName: defaultAddress?.firstName || 'Eleanor',
    lastName: defaultAddress?.lastName || 'Vance',
    addressLine1: defaultAddress?.addressLine1 || '142 Hill House Lane',
    addressLine2: defaultAddress?.addressLine2 || 'Apt 3B',
    city: defaultAddress?.city || 'Boston',
    state: defaultAddress?.state || 'MA',
    zipCode: defaultAddress?.zipCode || '02116',
    country: defaultAddress?.country || 'United States',
    phone: defaultAddress?.phone || '+1 (617) 555-0192',
  });

  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (defaultAddress) {
      editAddress(defaultAddress.id, addressForm);
    } else {
      addAddress({
        ...addressForm,
        label: 'Default Address',
        isDefault: true,
      });
    }
    setIsEditingAddress(false);
    showToast('Default Address Updated', 'Your changes have been saved', 'success');
  };

  const navTabs = [
    { key: 'overview', label: 'Overview' },
    { key: 'orders', label: 'Orders' },
    { key: 'wishlist', label: 'Wishlist' },
    { key: 'personal', label: 'Personal Details' },
    { key: 'addresses', label: 'Addresses' },
    { key: 'payment', label: 'Payment Methods' },
  ] as const;

  return (
    <div id="my-account-page" className={`w-full min-h-[85vh] pb-24 animate-in fade-in duration-300 transition-colors ${
      isDarkMode ? 'bg-[#111312] text-[#FAF8F5]' : 'bg-[#FAF9F6] text-[#1a1c1b]'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
          {/* Left Sidebar matching new sec.png */}
          <aside className="lg:col-span-3">
            <h2 className={`font-serif text-2xl sm:text-3xl font-normal mb-8 ${isDarkMode ? 'text-[#FAF8F5]' : 'text-neutral-950'}`}>
              My Account
            </h2>

            <nav className="space-y-4 text-sm" aria-label="Account sections">
              {navTabs.map((tab) => (
                <button
                  key={tab.key}
                  id={`account-tab-${tab.key}`}
                  onClick={() => setActiveTab(tab.key)}
                  className={`block w-full text-left transition-colors font-light cursor-pointer ${
                    activeTab === tab.key
                      ? isDarkMode
                        ? 'text-[#C5A059] font-semibold'
                        : 'text-neutral-950 font-semibold'
                      : isDarkMode
                        ? 'text-[#A8A49C] hover:text-[#FAF8F5]'
                        : 'text-neutral-600 hover:text-neutral-950'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
              <div className={`pt-4 mt-4 border-t ${isDarkMode ? 'border-[#2A2E2C]' : 'border-neutral-200'}`}>
                <button
                  onClick={() => setActivePage('admin')}
                  className={`block w-full text-left text-xs uppercase tracking-widest font-mono transition-colors cursor-pointer ${
                    isDarkMode ? 'text-[#C5A059] hover:text-white' : 'text-[#8c9a86] hover:text-black'
                  }`}
                >
                  ⚙ Atelier Portal (Admin)
                </button>
              </div>
            </nav>
          </aside>

          {/* Right Main Content Area matching new sec.png */}
          <main className="lg:col-span-9 space-y-12">
            {/* Greeting Header matching new sec.png */}
            <div className="space-y-3">
              <h1 className={`font-serif text-3xl sm:text-5xl font-normal tracking-tight ${isDarkMode ? 'text-[#FAF8F5]' : 'text-neutral-950'}`}>
                Welcome Back, {currentUser?.firstName || 'Eleanor'}
              </h1>
              <p className={`text-sm sm:text-base font-light leading-relaxed ${isDarkMode ? 'text-[#A8A49C]' : 'text-neutral-600'}`}>
                Manage your orders, update your details, and curate your space with our premium linens.
              </p>
            </div>

            {/* Tab: Overview (Exact recreation of new sec.png) */}
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-14 pt-4">
                {/* Recent Order Card matching new sec.png */}
                <div className="space-y-4">
                  <div className={`flex items-baseline justify-between border-b pb-2 ${isDarkMode ? 'border-[#2A2E2C]' : 'border-neutral-300'}`}>
                    <h3 className={`font-serif text-xl sm:text-2xl font-normal ${isDarkMode ? 'text-[#FAF8F5]' : 'text-neutral-950'}`}>
                      Recent Order
                    </h3>
                    <button
                      id="account-view-all-orders-btn"
                      onClick={() => setActiveTab('orders')}
                      className={`text-xs uppercase tracking-widest underline font-medium cursor-pointer ${
                        isDarkMode ? 'text-[#C5A059] hover:text-white' : 'text-neutral-900 hover:text-neutral-600'
                      }`}
                    >
                      View All
                    </button>
                  </div>

                  <div className="pt-2 flex items-start gap-5">
                    {/* Folded sheets image on wooden bench matching new sec.png */}
                    <div className={`w-24 h-24 sm:w-28 sm:h-28 rounded-none overflow-hidden shrink-0 border ${
                      isDarkMode ? 'bg-[#181B1A] border-[#383D3A]' : 'bg-neutral-100 border-neutral-200'
                    }`}>
                      <img
                        src="https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=400&q=80"
                        alt="Signature Sateen Core Sheet Set"
                        className="w-full h-full object-cover object-center"
                      />
                    </div>

                    <div className="space-y-1 text-xs sm:text-sm">
                      <p className={`text-[10px] uppercase tracking-widest font-semibold ${isDarkMode ? 'text-[#C5A059]' : 'text-neutral-500'}`}>
                        ORDER #LL-4921
                      </p>
                      <h4 className={`font-serif text-base sm:text-lg font-normal leading-snug ${isDarkMode ? 'text-[#FAF8F5]' : 'text-neutral-900'}`}>
                        Signature Sateen Core Sheet Set
                      </h4>
                      <p className={`text-xs ${isDarkMode ? 'text-[#A8A49C]' : 'text-neutral-600'}`}>
                        Warm Ivory &bull; Queen
                      </p>
                      <p className={`text-xs pt-1 ${isDarkMode ? 'text-[#6E6B65]' : 'text-neutral-500'}`}>
                        Delivered on Oct 24, 2023
                      </p>
                    </div>
                  </div>
                </div>

                {/* Default Address Card matching new sec.png */}
                <div className="space-y-4">
                  <div className={`flex items-baseline justify-between border-b pb-2 ${isDarkMode ? 'border-[#2A2E2C]' : 'border-neutral-300'}`}>
                    <h3 className={`font-serif text-xl sm:text-2xl font-normal ${isDarkMode ? 'text-[#FAF8F5]' : 'text-neutral-950'}`}>
                      Default Address
                    </h3>
                    <button
                      id="account-edit-address-btn"
                      onClick={() => setIsEditingAddress(true)}
                      className={`text-xs uppercase tracking-widest underline font-medium cursor-pointer ${
                        isDarkMode ? 'text-[#C5A059] hover:text-white' : 'text-neutral-900 hover:text-neutral-600'
                      }`}
                    >
                      Edit
                    </button>
                  </div>

                  <div className={`pt-2 text-xs sm:text-sm font-light space-y-1 leading-relaxed ${
                    isDarkMode ? 'text-[#A8A49C]' : 'text-neutral-700'
                  }`}>
                    <p className={`font-medium ${isDarkMode ? 'text-[#FAF8F5]' : 'text-neutral-900'}`}>
                      {defaultAddress?.firstName || 'Eleanor'} {defaultAddress?.lastName || 'Vance'}
                    </p>
                    <p>{defaultAddress?.addressLine1 || '142 Hill House Lane'}</p>
                    {defaultAddress?.addressLine2 && <p>{defaultAddress.addressLine2}</p>}
                    <p>
                      {defaultAddress?.city || 'Boston'}, {defaultAddress?.state || 'MA'}{' '}
                      {defaultAddress?.zipCode || '02116'}
                    </p>
                    <p>{defaultAddress?.country || 'United States'}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Tab: Orders */}
            {activeTab === 'orders' && (
              <div className="space-y-6 pt-2">
                <div className={`border-b pb-2 flex items-center justify-between ${isDarkMode ? 'border-[#2A2E2C]' : 'border-neutral-300'}`}>
                  <h3 className={`font-serif text-2xl font-normal ${isDarkMode ? 'text-[#FAF8F5]' : 'text-neutral-950'}`}>
                    Order History
                  </h3>
                  <span className={`text-xs ${isDarkMode ? 'text-[#A8A49C]' : 'text-neutral-500'}`}>
                    {orderHistory.length} order{orderHistory.length === 1 ? '' : 's'} recorded
                  </span>
                </div>

                <div className="space-y-6">
                  {orderHistory.map((order) => (
                    <div
                      key={order.orderId}
                      className={`p-6 sm:p-8 space-y-4 border ${
                        isDarkMode ? 'bg-[#181B1A] border-[#2A2E2C]' : 'bg-white border-neutral-200'
                      }`}
                    >
                      <div className={`flex flex-wrap items-center justify-between gap-4 border-b pb-4 text-xs ${
                        isDarkMode ? 'border-[#2A2E2C]' : 'border-neutral-100'
                      }`}>
                        <div>
                          <span className={`text-[10px] uppercase tracking-widest block font-medium ${isDarkMode ? 'text-[#C5A059]' : 'text-neutral-400'}`}>
                            Order Number
                          </span>
                          <span className={`font-semibold ${isDarkMode ? 'text-[#FAF8F5]' : 'text-neutral-900'}`}>#{order.orderId}</span>
                        </div>
                        <div>
                          <span className={`text-[10px] uppercase tracking-widest block font-medium ${isDarkMode ? 'text-[#C5A059]' : 'text-neutral-400'}`}>
                            Date Placed
                          </span>
                          <span className={isDarkMode ? 'text-[#A8A49C]' : 'text-neutral-700'}>{order.date}</span>
                        </div>
                        <div>
                          <span className={`text-[10px] uppercase tracking-widest block font-medium ${isDarkMode ? 'text-[#C5A059]' : 'text-neutral-400'}`}>
                            Total
                          </span>
                          <span className={`font-semibold ${isDarkMode ? 'text-[#FAF8F5]' : 'text-neutral-900'}`}>
                            {formatPrice(order.total)}
                          </span>
                        </div>
                        <div>
                          <span className={`inline-block px-3 py-1 text-[11px] uppercase tracking-wider font-semibold rounded-full ${
                            isDarkMode ? 'bg-[#242826] text-[#C5A059]' : 'bg-neutral-100 text-neutral-800'
                          }`}>
                            {order.status}
                          </span>
                        </div>
                      </div>

                      <div className={`divide-y ${isDarkMode ? 'divide-[#2A2E2C]' : 'divide-neutral-100'}`}>
                        {order.items.map((item) => (
                          <div key={item.id} className="py-3 flex items-center gap-4">
                            <img
                              src={item.selectedColor.image}
                              alt={item.product.name}
                              className={`w-14 h-14 object-cover border ${isDarkMode ? 'border-[#383D3A] bg-[#141615]' : 'border-neutral-200'}`}
                            />
                            <div className="flex-1 text-xs">
                              <h5 className={`font-medium text-sm ${isDarkMode ? 'text-[#FAF8F5]' : 'text-neutral-900'}`}>{item.product.name}</h5>
                              <p className={isDarkMode ? 'text-[#A8A49C]' : 'text-neutral-500'}>
                                {item.selectedColor.name} &bull; {item.selectedSize} &bull; Qty {item.quantity}
                              </p>
                            </div>
                            <span className={`text-xs font-semibold ${isDarkMode ? 'text-[#FAF8F5]' : 'text-neutral-900'}`}>
                              {formatPrice(item.product.price * item.quantity)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab: Wishlist */}
            {activeTab === 'wishlist' && (
              <div className="space-y-6 pt-2">
                <div className={`border-b pb-2 flex items-center justify-between ${isDarkMode ? 'border-[#2A2E2C]' : 'border-neutral-300'}`}>
                  <h3 className={`font-serif text-2xl font-normal ${isDarkMode ? 'text-[#FAF8F5]' : 'text-neutral-950'}`}>
                    Saved Bedding &amp; Linen
                  </h3>
                  <button
                    onClick={() => setIsWishlistOpen(true)}
                    className={`text-xs uppercase tracking-widest underline cursor-pointer ${
                      isDarkMode ? 'text-[#C5A059] hover:text-white' : 'text-neutral-900'
                    }`}
                  >
                    Open Drawer
                  </button>
                </div>
                <p className={`text-sm font-light ${isDarkMode ? 'text-[#A8A49C]' : 'text-neutral-600'}`}>
                  Your curated favorites are saved here. You have {wishlist.length} item{wishlist.length === 1 ? '' : 's'} on your wish list.
                </p>
                <div className="pt-4">
                  <button
                    onClick={() => setIsWishlistOpen(true)}
                    className={`px-6 py-3 text-xs uppercase tracking-widest transition-colors cursor-pointer font-medium ${
                      isDarkMode
                        ? 'bg-[#C5A059] text-black hover:bg-[#D8B468]'
                        : 'bg-neutral-950 text-white hover:bg-neutral-800'
                    }`}
                  >
                    View Wishlist Items
                  </button>
                </div>
              </div>
            )}

            {/* Tab: Personal Details */}
            {activeTab === 'personal' && (
              <div className="space-y-6 pt-2 max-w-lg">
                <div className={`border-b pb-2 ${isDarkMode ? 'border-[#2A2E2C]' : 'border-neutral-300'}`}>
                  <h3 className={`font-serif text-2xl font-normal ${isDarkMode ? 'text-[#FAF8F5]' : 'text-neutral-950'}`}>
                    Personal Details
                  </h3>
                </div>
                <div className="space-y-4 text-sm font-light">
                  <div className="space-y-1">
                    <label className={`text-[10px] uppercase tracking-widest font-semibold block ${isDarkMode ? 'text-[#C5A059]' : 'text-neutral-400'}`}>
                      Full Name
                    </label>
                    <p className={`font-normal ${isDarkMode ? 'text-[#FAF8F5]' : 'text-neutral-900'}`}>
                      {currentUser?.firstName} {currentUser?.lastName}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <label className={`text-[10px] uppercase tracking-widest font-semibold block ${isDarkMode ? 'text-[#C5A059]' : 'text-neutral-400'}`}>
                      Email Address
                    </label>
                    <p className={`font-normal ${isDarkMode ? 'text-[#FAF8F5]' : 'text-neutral-900'}`}>{currentUser?.email}</p>
                  </div>
                  <div className="space-y-1">
                    <label className={`text-[10px] uppercase tracking-widest font-semibold block ${isDarkMode ? 'text-[#C5A059]' : 'text-neutral-400'}`}>
                      Client Tier
                    </label>
                    <p className={`font-normal ${isDarkMode ? 'text-[#FAF8F5]' : 'text-neutral-900'}`}>{currentUser?.vipTier}</p>
                  </div>
                  <div className="space-y-1">
                    <label className={`text-[10px] uppercase tracking-widest font-semibold block ${isDarkMode ? 'text-[#C5A059]' : 'text-neutral-400'}`}>
                      Phone
                    </label>
                    <p className={`font-normal ${isDarkMode ? 'text-[#FAF8F5]' : 'text-neutral-900'}`}>{currentUser?.phone || '+1 (617) 555-0192'}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Tab: Addresses */}
            {activeTab === 'addresses' && (
              <div className="space-y-6 pt-2">
                <div className={`border-b pb-2 flex items-center justify-between ${isDarkMode ? 'border-[#2A2E2C]' : 'border-neutral-300'}`}>
                  <h3 className={`font-serif text-2xl font-normal ${isDarkMode ? 'text-[#FAF8F5]' : 'text-neutral-950'}`}>
                    Shipping &amp; Billing Addresses
                  </h3>
                  <button
                    onClick={() => setIsEditingAddress(true)}
                    className={`text-xs uppercase tracking-widest underline cursor-pointer ${
                      isDarkMode ? 'text-[#C5A059] hover:text-white' : 'text-neutral-900'
                    }`}
                  >
                    + Add New Address
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {currentUser?.addresses.map((addr) => (
                    <div
                      key={addr.id}
                      className={`p-6 border space-y-3 relative ${
                        addr.isDefault
                          ? isDarkMode
                            ? 'border-[#C5A059] bg-[#181B1A] shadow-sm'
                            : 'border-neutral-900 bg-white shadow-sm'
                          : isDarkMode
                            ? 'border-[#2A2E2C] bg-[#141615]'
                            : 'border-neutral-200 bg-[#FCFBF9]'
                      }`}
                    >
                      {addr.isDefault && (
                        <span className={`inline-block px-2.5 py-0.5 text-[9px] uppercase tracking-widest font-semibold ${
                          isDarkMode ? 'bg-[#C5A059] text-black' : 'bg-neutral-950 text-white'
                        }`}>
                          Default Address
                        </span>
                      )}
                      <h4 className={`font-serif text-base font-normal ${isDarkMode ? 'text-[#FAF8F5]' : 'text-neutral-900'}`}>{addr.label}</h4>
                      <div className={`text-xs space-y-0.5 font-light ${isDarkMode ? 'text-[#A8A49C]' : 'text-neutral-600'}`}>
                        <p className={`font-medium ${isDarkMode ? 'text-[#FAF8F5]' : 'text-neutral-900'}`}>{addr.firstName} {addr.lastName}</p>
                        <p>{addr.addressLine1}</p>
                        {addr.addressLine2 && <p>{addr.addressLine2}</p>}
                        <p>{addr.city}, {addr.state} {addr.zipCode}</p>
                        <p>{addr.country}</p>
                        <p className="pt-1">{addr.phone}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab: Payment Methods */}
            {activeTab === 'payment' && (
              <div className="space-y-6 pt-2">
                <div className={`border-b pb-2 ${isDarkMode ? 'border-[#2A2E2C]' : 'border-neutral-300'}`}>
                  <h3 className={`font-serif text-2xl font-normal ${isDarkMode ? 'text-[#FAF8F5]' : 'text-neutral-950'}`}>
                    Payment Methods
                  </h3>
                </div>
                <div className={`border p-6 flex items-center justify-between max-w-md ${
                  isDarkMode ? 'bg-[#181B1A] border-[#2A2E2C]' : 'bg-white border-neutral-200'
                }`}>
                  <div className="flex items-center gap-3">
                    <CreditCard className={`w-6 h-6 ${isDarkMode ? 'text-[#C5A059]' : 'text-neutral-700'}`} />
                    <div className="text-xs">
                      <p className={`font-semibold ${isDarkMode ? 'text-[#FAF8F5]' : 'text-neutral-900'}`}>Mastercard ending in 8842</p>
                      <p className={isDarkMode ? 'text-[#A8A49C]' : 'text-neutral-500'}>Expires 08/27 &bull; Default Payment</p>
                    </div>
                  </div>
                  <span className={`text-[10px] uppercase tracking-widest px-2 py-0.5 rounded font-semibold ${
                    isDarkMode ? 'text-[#4ade80] bg-[#1b3824]' : 'text-emerald-800 bg-emerald-50'
                  }`}>
                    Verified
                  </span>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Edit Address Modal */}
      {isEditingAddress && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`w-full max-w-lg p-8 shadow-2xl border space-y-6 ${
              isDarkMode ? 'bg-[#161817] border-[#2A2E2C] text-[#FAF8F5]' : 'bg-white border-neutral-300 text-black'
            }`}
          >
            <div className={`border-b pb-3 flex items-center justify-between ${
              isDarkMode ? 'border-[#2A2E2C]' : 'border-neutral-200'
            }`}>
              <h3 className={`font-serif text-2xl font-normal ${isDarkMode ? 'text-[#FAF8F5]' : 'text-neutral-950'}`}>Edit Default Address</h3>
              <button
                onClick={() => setIsEditingAddress(false)}
                className={`text-xs uppercase tracking-widest cursor-pointer ${
                  isDarkMode ? 'text-[#A8A49C] hover:text-[#FAF8F5]' : 'text-neutral-400 hover:text-black'
                }`}
              >
                Close
              </button>
            </div>

            <form onSubmit={handleSaveAddress} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className={`text-[10px] uppercase tracking-widest ${isDarkMode ? 'text-[#C5A059]' : 'text-neutral-500'}`}>First Name</label>
                  <input
                    type="text"
                    required
                    value={addressForm.firstName}
                    onChange={(e) => setAddressForm({ ...addressForm, firstName: e.target.value })}
                    className={`w-full pb-1 border-b focus:outline-none text-sm bg-transparent ${
                      isDarkMode ? 'border-[#383D3A] text-[#FAF8F5] focus:border-[#C5A059]' : 'border-neutral-300 text-black focus:border-neutral-900'
                    }`}
                  />
                </div>
                <div className="space-y-1">
                  <label className={`text-[10px] uppercase tracking-widest ${isDarkMode ? 'text-[#C5A059]' : 'text-neutral-500'}`}>Last Name</label>
                  <input
                    type="text"
                    required
                    value={addressForm.lastName}
                    onChange={(e) => setAddressForm({ ...addressForm, lastName: e.target.value })}
                    className={`w-full pb-1 border-b focus:outline-none text-sm bg-transparent ${
                      isDarkMode ? 'border-[#383D3A] text-[#FAF8F5] focus:border-[#C5A059]' : 'border-neutral-300 text-black focus:border-neutral-900'
                    }`}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className={`text-[10px] uppercase tracking-widest ${isDarkMode ? 'text-[#C5A059]' : 'text-neutral-500'}`}>Address Line 1</label>
                <input
                  type="text"
                  required
                  value={addressForm.addressLine1}
                  onChange={(e) => setAddressForm({ ...addressForm, addressLine1: e.target.value })}
                  className={`w-full pb-1 border-b focus:outline-none text-sm bg-transparent ${
                    isDarkMode ? 'border-[#383D3A] text-[#FAF8F5] focus:border-[#C5A059]' : 'border-neutral-300 text-black focus:border-neutral-900'
                  }`}
                />
              </div>

              <div className="space-y-1">
                <label className={`text-[10px] uppercase tracking-widest ${isDarkMode ? 'text-[#C5A059]' : 'text-neutral-500'}`}>Apartment / Suite</label>
                <input
                  type="text"
                  value={addressForm.addressLine2}
                  onChange={(e) => setAddressForm({ ...addressForm, addressLine2: e.target.value })}
                  className={`w-full pb-1 border-b focus:outline-none text-sm bg-transparent ${
                    isDarkMode ? 'border-[#383D3A] text-[#FAF8F5] focus:border-[#C5A059]' : 'border-neutral-300 text-black focus:border-neutral-900'
                  }`}
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className={`text-[10px] uppercase tracking-widest ${isDarkMode ? 'text-[#C5A059]' : 'text-neutral-500'}`}>City</label>
                  <input
                    type="text"
                    required
                    value={addressForm.city}
                    onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                    className={`w-full pb-1 border-b focus:outline-none text-sm bg-transparent ${
                      isDarkMode ? 'border-[#383D3A] text-[#FAF8F5] focus:border-[#C5A059]' : 'border-neutral-300 text-black focus:border-neutral-900'
                    }`}
                  />
                </div>
                <div className="space-y-1">
                  <label className={`text-[10px] uppercase tracking-widest ${isDarkMode ? 'text-[#C5A059]' : 'text-neutral-500'}`}>State</label>
                  <input
                    type="text"
                    required
                    value={addressForm.state}
                    onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                    className={`w-full pb-1 border-b focus:outline-none text-sm bg-transparent ${
                      isDarkMode ? 'border-[#383D3A] text-[#FAF8F5] focus:border-[#C5A059]' : 'border-neutral-300 text-black focus:border-neutral-900'
                    }`}
                  />
                </div>
                <div className="space-y-1">
                  <label className={`text-[10px] uppercase tracking-widest ${isDarkMode ? 'text-[#C5A059]' : 'text-neutral-500'}`}>Postal Code</label>
                  <input
                    type="text"
                    required
                    value={addressForm.zipCode}
                    onChange={(e) => setAddressForm({ ...addressForm, zipCode: e.target.value })}
                    className={`w-full pb-1 border-b focus:outline-none text-sm bg-transparent ${
                      isDarkMode ? 'border-[#383D3A] text-[#FAF8F5] focus:border-[#C5A059]' : 'border-neutral-300 text-black focus:border-neutral-900'
                    }`}
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditingAddress(false)}
                  className={`px-5 py-2 border text-xs uppercase tracking-widest cursor-pointer ${
                    isDarkMode
                      ? 'border-[#383D3A] text-[#FAF8F5] hover:bg-[#252827]'
                      : 'border-neutral-300 text-neutral-700 hover:bg-neutral-100'
                  }`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`px-6 py-2 text-xs uppercase tracking-widest transition-colors cursor-pointer font-medium ${
                    isDarkMode
                      ? 'bg-[#C5A059] text-black hover:bg-[#D8B468]'
                      : 'bg-neutral-950 text-white hover:bg-neutral-800'
                  }`}
                >
                  Save Address
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};
