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
    <div id="my-account-page" className="w-full min-h-[85vh] bg-[#FAF9F6] pb-24 animate-in fade-in duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
          {/* Left Sidebar matching new sec.png */}
          <aside className="lg:col-span-3">
            <h2 className="font-serif text-2xl sm:text-3xl text-neutral-950 font-normal mb-8">
              My Account
            </h2>

            <nav className="space-y-4 text-sm" aria-label="Account sections">
              {navTabs.map((tab) => (
                <button
                  key={tab.key}
                  id={`account-tab-${tab.key}`}
                  onClick={() => setActiveTab(tab.key)}
                  className={`block w-full text-left transition-colors font-light ${
                    activeTab === tab.key
                      ? 'text-neutral-950 font-semibold'
                      : 'text-neutral-600 hover:text-neutral-950'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
              <div className="pt-4 mt-4 border-t border-neutral-200">
                <button
                  onClick={() => setActivePage('admin')}
                  className="block w-full text-left text-xs uppercase tracking-widest text-[#8c9a86] hover:text-black font-mono transition-colors"
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
              <h1 className="font-serif text-3xl sm:text-5xl text-neutral-950 font-normal tracking-tight">
                Welcome Back, {currentUser?.firstName || 'Eleanor'}
              </h1>
              <p className="text-neutral-600 text-sm sm:text-base font-light leading-relaxed">
                Manage your orders, update your details, and curate your space with our premium linens.
              </p>
            </div>

            {/* Tab: Overview (Exact recreation of new sec.png) */}
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-14 pt-4">
                {/* Recent Order Card matching new sec.png */}
                <div className="space-y-4">
                  <div className="flex items-baseline justify-between border-b border-neutral-300 pb-2">
                    <h3 className="font-serif text-xl sm:text-2xl text-neutral-950 font-normal">
                      Recent Order
                    </h3>
                    <button
                      id="account-view-all-orders-btn"
                      onClick={() => setActiveTab('orders')}
                      className="text-xs uppercase tracking-widest text-neutral-900 hover:text-neutral-600 underline font-medium"
                    >
                      View All
                    </button>
                  </div>

                  <div className="pt-2 flex items-start gap-5">
                    {/* Folded sheets image on wooden bench matching new sec.png */}
                    <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-none overflow-hidden bg-neutral-100 shrink-0 border border-neutral-200">
                      <img
                        src="https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=400&q=80"
                        alt="Signature Sateen Core Sheet Set"
                        className="w-full h-full object-cover object-center"
                      />
                    </div>

                    <div className="space-y-1 text-xs sm:text-sm">
                      <p className="text-[10px] uppercase tracking-widest text-neutral-500 font-semibold">
                        ORDER #LL-4921
                      </p>
                      <h4 className="font-serif text-base sm:text-lg text-neutral-900 font-normal leading-snug">
                        Signature Sateen Core Sheet Set
                      </h4>
                      <p className="text-neutral-600 text-xs">
                        Warm Ivory &bull; Queen
                      </p>
                      <p className="text-neutral-500 text-xs pt-1">
                        Delivered on Oct 24, 2023
                      </p>
                    </div>
                  </div>
                </div>

                {/* Default Address Card matching new sec.png */}
                <div className="space-y-4">
                  <div className="flex items-baseline justify-between border-b border-neutral-300 pb-2">
                    <h3 className="font-serif text-xl sm:text-2xl text-neutral-950 font-normal">
                      Default Address
                    </h3>
                    <button
                      id="account-edit-address-btn"
                      onClick={() => setIsEditingAddress(true)}
                      className="text-xs uppercase tracking-widest text-neutral-900 hover:text-neutral-600 underline font-medium"
                    >
                      Edit
                    </button>
                  </div>

                  <div className="pt-2 text-xs sm:text-sm text-neutral-700 font-light space-y-1 leading-relaxed">
                    <p className="font-medium text-neutral-900">
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
                <div className="border-b border-neutral-300 pb-2 flex items-center justify-between">
                  <h3 className="font-serif text-2xl text-neutral-950 font-normal">
                    Order History
                  </h3>
                  <span className="text-xs text-neutral-500">
                    {orderHistory.length} order{orderHistory.length === 1 ? '' : 's'} recorded
                  </span>
                </div>

                <div className="space-y-6">
                  {orderHistory.map((order) => (
                    <div
                      key={order.orderId}
                      className="bg-white border border-neutral-200 p-6 sm:p-8 space-y-4"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-neutral-100 pb-4 text-xs">
                        <div>
                          <span className="text-[10px] uppercase tracking-widest text-neutral-400 block font-medium">
                            Order Number
                          </span>
                          <span className="font-semibold text-neutral-900">#{order.orderId}</span>
                        </div>
                        <div>
                          <span className="text-[10px] uppercase tracking-widest text-neutral-400 block font-medium">
                            Date Placed
                          </span>
                          <span className="text-neutral-700">{order.date}</span>
                        </div>
                        <div>
                          <span className="text-[10px] uppercase tracking-widest text-neutral-400 block font-medium">
                            Total
                          </span>
                          <span className="font-semibold text-neutral-900">
                            {formatPrice(order.total)}
                          </span>
                        </div>
                        <div>
                          <span className="inline-block px-3 py-1 bg-neutral-100 text-neutral-800 text-[11px] uppercase tracking-wider font-semibold rounded-full">
                            {order.status}
                          </span>
                        </div>
                      </div>

                      <div className="divide-y divide-neutral-100">
                        {order.items.map((item) => (
                          <div key={item.id} className="py-3 flex items-center gap-4">
                            <img
                              src={item.selectedColor.image}
                              alt={item.product.name}
                              className="w-14 h-14 object-cover border border-neutral-200"
                            />
                            <div className="flex-1 text-xs">
                              <h5 className="font-medium text-neutral-900 text-sm">{item.product.name}</h5>
                              <p className="text-neutral-500">
                                {item.selectedColor.name} &bull; {item.selectedSize} &bull; Qty {item.quantity}
                              </p>
                            </div>
                            <span className="text-xs font-semibold text-neutral-900">
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
                <div className="border-b border-neutral-300 pb-2 flex items-center justify-between">
                  <h3 className="font-serif text-2xl text-neutral-950 font-normal">
                    Saved Bedding & Linen
                  </h3>
                  <button
                    onClick={() => setIsWishlistOpen(true)}
                    className="text-xs uppercase tracking-widest text-neutral-900 underline"
                  >
                    Open Drawer
                  </button>
                </div>
                <p className="text-neutral-600 text-sm font-light">
                  Your curated favorites are saved here. You have {wishlist.length} item{wishlist.length === 1 ? '' : 's'} on your wish list.
                </p>
                <div className="pt-4">
                  <button
                    onClick={() => setIsWishlistOpen(true)}
                    className="px-6 py-3 bg-neutral-950 text-white text-xs uppercase tracking-widest hover:bg-neutral-800 transition-colors"
                  >
                    View Wishlist Items
                  </button>
                </div>
              </div>
            )}

            {/* Tab: Personal Details */}
            {activeTab === 'personal' && (
              <div className="space-y-6 pt-2 max-w-lg">
                <div className="border-b border-neutral-300 pb-2">
                  <h3 className="font-serif text-2xl text-neutral-950 font-normal">
                    Personal Details
                  </h3>
                </div>
                <div className="space-y-4 text-sm font-light">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-widest text-neutral-400 font-semibold block">
                      Full Name
                    </label>
                    <p className="text-neutral-900 font-normal">
                      {currentUser?.firstName} {currentUser?.lastName}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-widest text-neutral-400 font-semibold block">
                      Email Address
                    </label>
                    <p className="text-neutral-900 font-normal">{currentUser?.email}</p>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-widest text-neutral-400 font-semibold block">
                      Client Tier
                    </label>
                    <p className="text-neutral-900 font-normal">{currentUser?.vipTier}</p>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-widest text-neutral-400 font-semibold block">
                      Phone
                    </label>
                    <p className="text-neutral-900 font-normal">{currentUser?.phone || '+1 (617) 555-0192'}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Tab: Addresses */}
            {activeTab === 'addresses' && (
              <div className="space-y-6 pt-2">
                <div className="border-b border-neutral-300 pb-2 flex items-center justify-between">
                  <h3 className="font-serif text-2xl text-neutral-950 font-normal">
                    Shipping & Billing Addresses
                  </h3>
                  <button
                    onClick={() => setIsEditingAddress(true)}
                    className="text-xs uppercase tracking-widest text-neutral-900 underline"
                  >
                    + Add New Address
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {currentUser?.addresses.map((addr) => (
                    <div
                      key={addr.id}
                      className={`p-6 border ${
                        addr.isDefault ? 'border-neutral-900 bg-white shadow-sm' : 'border-neutral-200 bg-[#FCFBF9]'
                      } space-y-3 relative`}
                    >
                      {addr.isDefault && (
                        <span className="inline-block px-2.5 py-0.5 bg-neutral-950 text-white text-[9px] uppercase tracking-widest font-semibold">
                          Default Address
                        </span>
                      )}
                      <h4 className="font-serif text-base text-neutral-900 font-normal">{addr.label}</h4>
                      <div className="text-xs text-neutral-600 space-y-0.5 font-light">
                        <p className="text-neutral-900 font-medium">{addr.firstName} {addr.lastName}</p>
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
                <div className="border-b border-neutral-300 pb-2">
                  <h3 className="font-serif text-2xl text-neutral-950 font-normal">
                    Payment Methods
                  </h3>
                </div>
                <div className="bg-white border border-neutral-200 p-6 flex items-center justify-between max-w-md">
                  <div className="flex items-center gap-3">
                    <CreditCard className="w-6 h-6 text-neutral-700" />
                    <div className="text-xs">
                      <p className="font-semibold text-neutral-900">Mastercard ending in 8842</p>
                      <p className="text-neutral-500">Expires 08/27 &bull; Default Payment</p>
                    </div>
                  </div>
                  <span className="text-[10px] uppercase tracking-widest text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded font-semibold">
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
            className="bg-white w-full max-w-lg p-8 shadow-2xl border border-neutral-300 space-y-6"
          >
            <div className="border-b border-neutral-200 pb-3 flex items-center justify-between">
              <h3 className="font-serif text-2xl text-neutral-950 font-normal">Edit Default Address</h3>
              <button
                onClick={() => setIsEditingAddress(false)}
                className="text-xs text-neutral-400 hover:text-black uppercase tracking-widest"
              >
                Close
              </button>
            </div>

            <form onSubmit={handleSaveAddress} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-widest text-neutral-500">First Name</label>
                  <input
                    type="text"
                    required
                    value={addressForm.firstName}
                    onChange={(e) => setAddressForm({ ...addressForm, firstName: e.target.value })}
                    className="w-full pb-1 border-b border-neutral-300 focus:border-neutral-900 focus:outline-none text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-widest text-neutral-500">Last Name</label>
                  <input
                    type="text"
                    required
                    value={addressForm.lastName}
                    onChange={(e) => setAddressForm({ ...addressForm, lastName: e.target.value })}
                    className="w-full pb-1 border-b border-neutral-300 focus:border-neutral-900 focus:outline-none text-sm"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-widest text-neutral-500">Address Line 1</label>
                <input
                  type="text"
                  required
                  value={addressForm.addressLine1}
                  onChange={(e) => setAddressForm({ ...addressForm, addressLine1: e.target.value })}
                  className="w-full pb-1 border-b border-neutral-300 focus:border-neutral-900 focus:outline-none text-sm"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-widest text-neutral-500">Apartment / Suite</label>
                <input
                  type="text"
                  value={addressForm.addressLine2}
                  onChange={(e) => setAddressForm({ ...addressForm, addressLine2: e.target.value })}
                  className="w-full pb-1 border-b border-neutral-300 focus:border-neutral-900 focus:outline-none text-sm"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-widest text-neutral-500">City</label>
                  <input
                    type="text"
                    required
                    value={addressForm.city}
                    onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                    className="w-full pb-1 border-b border-neutral-300 focus:border-neutral-900 focus:outline-none text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-widest text-neutral-500">State</label>
                  <input
                    type="text"
                    required
                    value={addressForm.state}
                    onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                    className="w-full pb-1 border-b border-neutral-300 focus:border-neutral-900 focus:outline-none text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-widest text-neutral-500">Postal Code</label>
                  <input
                    type="text"
                    required
                    value={addressForm.zipCode}
                    onChange={(e) => setAddressForm({ ...addressForm, zipCode: e.target.value })}
                    className="w-full pb-1 border-b border-neutral-300 focus:border-neutral-900 focus:outline-none text-sm"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditingAddress(false)}
                  className="px-5 py-2 border border-neutral-300 text-neutral-700 text-xs uppercase tracking-widest hover:bg-neutral-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-neutral-950 text-white text-xs uppercase tracking-widest hover:bg-neutral-800"
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
