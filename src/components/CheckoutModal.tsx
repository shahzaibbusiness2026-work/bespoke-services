'use client';

import React, { useState, useEffect } from 'react';
import { useShop } from '../context/ShopContext';
import { OrderDetails, Address } from '../types';
import {
  X,
  ShieldCheck,
  CheckCircle2,
  CreditCard,
  Truck,
  ArrowRight,
  ArrowLeft,
  Lock,
  Sparkles,
  Package,
  Calendar,
  Download,
  Copy
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const SHIPPING_METHODS = [
  {
    id: 'std',
    name: 'Complimentary Atelier Express',
    price: 0,
    estimatedDays: '3 - 5 Business Days',
    description: 'Dispatched in signature embossed gift box with tracking.',
  },
  {
    id: 'priority',
    name: 'Priority Air Courier (DHL Express)',
    price: 35,
    estimatedDays: '1 - 2 Business Days',
    description: 'Direct priority routing from European fulfillment vault.',
  },
  {
    id: 'concierge',
    name: 'White Glove Concierge Delivery',
    price: 75,
    estimatedDays: 'Scheduled Appointment',
    description: 'Hand-delivered in structured garment travel trunk by personal courier.',
  },
];

export const CheckoutModal: React.FC = () => {
  const {
    isCheckoutOpen,
    setIsCheckoutOpen,
    cart,
    formatPrice,
    getTotals,
    placeOrder,
    recentOrder,
    setRecentOrder,
    appliedGiftWrap,
    appliedPromo,
    showToast,
    currentUser,
  } = useShop();

  // Step indicator: 1 = Shipping, 2 = Delivery, 3 = Payment, 4 = Confirmation
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);

  // Form State — starts blank, pre-filled from logged-in user profile by useEffect below
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
  });

  // Sync with logged in client if available
  useEffect(() => {
    if (currentUser) {
      const defAddr = currentUser.addresses.find((a) => a.isDefault) || currentUser.addresses[0];
      setFormData({
        firstName: currentUser.firstName || defAddr?.firstName || 'Eleanor',
        lastName: currentUser.lastName || defAddr?.lastName || 'Vance',
        email: currentUser.email || 'eleanor.vance@boski-limited.com',
        phone: currentUser.phone || defAddr?.phone || '+1 (617) 555-0192',
        address: defAddr ? `${defAddr.addressLine1}${defAddr.addressLine2 ? ', ' + defAddr.addressLine2 : ''}` : '142 Hill House Lane, Apt 3B',
        city: defAddr?.city || 'Boston',
        state: defAddr?.state || 'MA',
        zipCode: defAddr?.zipCode || '02116',
        country: defAddr?.country || 'United States',
      });
      setCardHolder(`${(currentUser.firstName || 'ELEANOR').toUpperCase()} ${(currentUser.lastName || 'VANCE').toUpperCase()}`);
    }
  }, [currentUser]);

  const [selectedShippingMethod, setSelectedShippingMethod] = useState(SHIPPING_METHODS[0]);

  // Payment Form State
  const [paymentType, setPaymentType] = useState<'card' | 'applepay' | 'paypal'>('card');
  const [cardNumber, setCardNumber] = useState('4532 8920 1192 4892');
  const [cardHolder, setCardHolder] = useState('VICTORIA KENSINGTON');
  const [cardExpiry, setCardExpiry] = useState('08/28');
  const [cardCvc, setCardCvc] = useState('482');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isCheckoutOpen) return null;

  const totals = getTotals();
  const finalShippingPrice = selectedShippingMethod.price;
  const finalGrandTotal =
    totals.subtotal - totals.discount + (appliedGiftWrap ? 15 : 0) + finalShippingPrice + totals.tax;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNextStep = () => {
    if (currentStep === 1) {
      if (!formData.firstName || !formData.lastName || !formData.address || !formData.email) {
        showToast('Please complete shipping details', 'All address fields are required', 'info');
        return;
      }
      setCurrentStep(2);
    } else if (currentStep === 2) {
      setCurrentStep(3);
    }
  };

  const handleSubmitOrder = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      const newOrder = placeOrder(
        formData,
        selectedShippingMethod,
        paymentType === 'card' ? 'Visa ending in 4892' : paymentType === 'applepay' ? 'Apple Pay' : 'PayPal'
      );
      setCurrentStep(4);
    }, 1500);
  };

  const handleClose = () => {
    setIsCheckoutOpen(false);
    setCurrentStep(1);
    setRecentOrder(null);
  };

  const inputClass = "w-full px-3.5 py-2.5 bg-white border border-[#c4c7c7] rounded-none text-body-sm text-[#1a1c1b] focus:border-[#000000] outline-none transition-colors";
  const labelClass = "block text-label-caps text-[#444748] uppercase tracking-wider mb-1 font-semibold";

  return (
    <AnimatePresence>
      <div
        id="checkout-modal-overlay"
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-md overflow-y-auto"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.98, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.98, y: 15 }}
          id="checkout-modal-content"
          className="bg-[#faf9f7] w-full max-w-4xl rounded-none shadow-2xl border border-[#c4c7c7] overflow-hidden flex flex-col my-auto max-h-[92vh]"
        >
          {/* Header */}
          <div className="p-5 sm:p-6 bg-white border-b border-[#c4c7c7] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span
                className="text-[20px] sm:text-[22px] tracking-[0.14em] font-normal text-[#000000] uppercase"
                style={{ fontFamily: "'Libre Caslon Text', Georgia, serif" }}
              >
                BOSKI LIMITED
              </span>
              <span className="text-[#c4c7c7] font-light">|</span>
              <span className="text-label-caps uppercase tracking-widest text-[#505252] font-semibold">
                {currentStep === 4 ? 'Order Confirmation' : 'Secure Express Checkout'}
              </span>
            </div>

            <button
              id="close-checkout-modal-btn"
              onClick={handleClose}
              className="p-2 text-[#444748] hover:text-[#000000] hover:bg-[#f4f3f1] transition-colors cursor-pointer"
              aria-label="Close checkout"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Stepper Progress Bar (Steps 1-3) */}
          {currentStep < 4 && (
            <div className="px-6 py-4 bg-[#f4f3f1] border-b border-[#c4c7c7] flex items-center justify-center gap-4 text-label-caps font-semibold uppercase tracking-wider">
              <div className={`flex items-center gap-2 ${currentStep >= 1 ? 'text-[#000000] font-bold' : 'text-[#8e908f]'}`}>
                <span className={`w-5 h-5 flex items-center justify-center text-[10px] ${currentStep >= 1 ? 'bg-[#000000] text-white' : 'border border-[#c4c7c7] text-[#505252]'}`}>
                  1
                </span>
                <span>Shipping Address</span>
              </div>
              <span className="text-[#c4c7c7]">&bull;&bull;&bull;</span>
              <div className={`flex items-center gap-2 ${currentStep >= 2 ? 'text-[#000000] font-bold' : 'text-[#8e908f]'}`}>
                <span className={`w-5 h-5 flex items-center justify-center text-[10px] ${currentStep >= 2 ? 'bg-[#000000] text-white' : 'border border-[#c4c7c7] text-[#505252]'}`}>
                  2
                </span>
                <span>Delivery Method</span>
              </div>
              <span className="text-[#c4c7c7]">&bull;&bull;&bull;</span>
              <div className={`flex items-center gap-2 ${currentStep >= 3 ? 'text-[#000000] font-bold' : 'text-[#8e908f]'}`}>
                <span className={`w-5 h-5 flex items-center justify-center text-[10px] ${currentStep >= 3 ? 'bg-[#000000] text-white' : 'border border-[#c4c7c7] text-[#505252]'}`}>
                  3
                </span>
                <span>Payment</span>
              </div>
            </div>
          )}

          {/* Body */}
          <div className="overflow-y-auto flex-1 p-6 sm:p-8">
            {/* STEP 1: Shipping Address */}
            {currentStep === 1 && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-7 space-y-4">
                  <h3
                    className="text-headline-sm text-[#000000] font-normal mb-4"
                    style={{ fontFamily: "'Libre Caslon Text', Georgia, serif" }}
                  >
                    Client &amp; Delivery Details
                  </h3>

                  {currentUser && currentUser.addresses && currentUser.addresses.length > 0 && (
                    <div className="p-3 bg-[#faf9f7] border border-[#c4c7c7] mb-2 rounded-none">
                      <span className="text-label-caps uppercase text-[#505252] font-semibold block mb-2 text-[10.5px] tracking-wider">
                        Deliver to Saved Client Address:
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {currentUser.addresses.map((addr) => (
                          <button
                            key={addr.id}
                            type="button"
                            onClick={() => {
                              setFormData((prev) => ({
                                ...prev,
                                firstName: addr.firstName,
                                lastName: addr.lastName,
                                phone: addr.phone,
                                address: `${addr.addressLine1}${addr.addressLine2 ? ', ' + addr.addressLine2 : ''}`,
                                city: addr.city,
                                state: addr.state,
                                zipCode: addr.zipCode,
                                country: addr.country,
                              }));
                              showToast('Address Loaded', `Selected ${addr.label}`, 'info');
                            }}
                            className="px-2.5 py-1.5 border border-[#c4c7c7] bg-white text-[11.5px] hover:border-black transition-colors rounded-none cursor-pointer flex items-center gap-1"
                          >
                            <span className="font-semibold text-black">{addr.label}</span>
                            <span className="text-[#505252]">({addr.city}, {addr.state})</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={labelClass}>First Name</label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Last Name</label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className={inputClass}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={labelClass}>Email Address</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Mobile Phone</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className={inputClass}
                      />
                    </div>
                  </div>

                  <div>
                    <label className={labelClass}>Street Address &amp; Residence / Apt</label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className={inputClass}
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className={labelClass}>City</label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>State / Province</label>
                      <input
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Postal Code</label>
                      <input
                        type="text"
                        name="zipCode"
                        value={formData.zipCode}
                        onChange={handleInputChange}
                        className={inputClass}
                      />
                    </div>
                  </div>

                  <button
                    id="checkout-step1-continue-btn"
                    onClick={handleNextStep}
                    className="w-full py-4 bg-[#000000] hover:bg-[#252726] text-white text-label-caps uppercase tracking-[0.16em] transition-colors flex items-center justify-center gap-2 mt-4 cursor-pointer rounded-none"
                  >
                    <span>Continue to Delivery Options</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Right Mini Order Summary */}
                <div className="lg:col-span-5 bg-white p-6 border border-[#c4c7c7] space-y-4 rounded-none">
                  <h4 className="text-label-caps uppercase tracking-wider text-[#505252] font-semibold">
                    Order Summary ({cart.length} items)
                  </h4>
                  <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                    {cart.map((item) => (
                      <div key={item.id} className="flex items-center gap-3">
                        <img
                          src={item.selectedColor.image || item.product.images[0]}
                          alt={item.product.name}
                          className="w-12 h-14 object-cover bg-[#efeeec] shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-body-sm font-medium text-[#000000] truncate">{item.product.name}</p>
                          <p className="text-[11px] text-[#505252]">
                            {item.selectedColor.name} &bull; {item.selectedSize} (Qty: {item.quantity})
                          </p>
                        </div>
                        <span className="text-body-sm font-semibold text-[#000000]">
                          {formatPrice(item.product.price * item.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-4 border-t border-[#e3e2e0] space-y-1.5 text-body-sm text-[#444748]">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span className="font-semibold text-[#000000]">{formatPrice(totals.subtotal)}</span>
                    </div>
                    {totals.discount > 0 && (
                      <div className="flex justify-between text-[#1b6b3e] font-semibold">
                        <span>VIP Discount</span>
                        <span>-{formatPrice(totals.discount)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-body-md font-bold text-[#000000] pt-2 border-t border-[#c4c7c7]">
                      <span>Total Due</span>
                      <span>{formatPrice(finalGrandTotal)}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: Delivery Method */}
            {currentStep === 2 && (
              <div className="max-w-2xl mx-auto space-y-6">
                <div>
                  <h3
                    className="text-headline-sm text-[#000000] font-normal"
                    style={{ fontFamily: "'Libre Caslon Text', Georgia, serif" }}
                  >
                    Select Atelier Delivery Protocol
                  </h3>
                  <p className="text-body-sm text-[#444748] font-light mt-1">
                    All deliveries are insured at full valuation and dispatched in bespoke archival boxes.
                  </p>
                </div>

                <div className="space-y-3">
                  {SHIPPING_METHODS.map((method) => (
                    <div
                      key={method.id}
                      id={`shipping-option-${method.id}`}
                      onClick={() => setSelectedShippingMethod(method)}
                      className={`p-4 border cursor-pointer transition-all flex items-start gap-4 rounded-none ${
                        selectedShippingMethod.id === method.id
                          ? 'border-[#000000] bg-white shadow-xs'
                          : 'border-[#c4c7c7] bg-white/60 hover:bg-white hover:border-[#000000]'
                      }`}
                    >
                      <input
                        type="radio"
                        name="shipping"
                        checked={selectedShippingMethod.id === method.id}
                        onChange={() => setSelectedShippingMethod(method)}
                        className="accent-[#000000] mt-1 cursor-pointer"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="text-body-sm font-semibold text-[#000000]">{method.name}</h4>
                          <span className="text-body-sm font-bold text-[#000000]">
                            {method.price === 0 ? 'Complimentary' : formatPrice(method.price)}
                          </span>
                        </div>
                        <p className="text-body-sm text-[#444748] mt-0.5">{method.description}</p>
                        <span className="inline-block mt-2 text-[10px] font-semibold tracking-wider text-[#675d50] bg-[#efe0cf]/60 px-2 py-0.5 uppercase">
                          Estimated: {method.estimatedDays}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-4 pt-4">
                  <button
                    onClick={() => setCurrentStep(1)}
                    className="px-6 py-3.5 border border-[#c4c7c7] hover:bg-[#f4f3f1] text-[#000000] text-label-caps uppercase tracking-wider transition-colors flex items-center gap-2 cursor-pointer rounded-none"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back</span>
                  </button>

                  <button
                    id="checkout-step2-continue-btn"
                    onClick={handleNextStep}
                    className="flex-1 py-4 bg-[#000000] hover:bg-[#252726] text-white text-label-caps uppercase tracking-[0.16em] transition-colors flex items-center justify-center gap-2 cursor-pointer rounded-none"
                  >
                    <span>Proceed to Payment</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: Payment */}
            {currentStep === 3 && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-7 space-y-6">
                  <div>
                    <h3
                      className="text-headline-sm text-[#000000] font-normal"
                      style={{ fontFamily: "'Libre Caslon Text', Georgia, serif" }}
                    >
                      Payment Authorization
                    </h3>
                    <p className="text-body-sm text-[#444748] font-light mt-1">
                      Encrypted end-to-end via PCI-DSS Level 1 bank vault gateway.
                    </p>
                  </div>

                  {/* Payment Type Tabs */}
                  <div className="grid grid-cols-3 gap-3">
                    <button
                      onClick={() => setPaymentType('card')}
                      className={`p-3 border text-label-caps uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors cursor-pointer rounded-none ${
                        paymentType === 'card'
                          ? 'bg-[#000000] text-white border-[#000000]'
                          : 'bg-white text-[#2b2d2c] border-[#c4c7c7] hover:bg-[#efeeec]'
                      }`}
                    >
                      <CreditCard className="w-4 h-4" />
                      <span>Card</span>
                    </button>
                    <button
                      onClick={() => setPaymentType('applepay')}
                      className={`p-3 border text-label-caps uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors cursor-pointer rounded-none ${
                        paymentType === 'applepay'
                          ? 'bg-[#000000] text-white border-[#000000]'
                          : 'bg-white text-[#2b2d2c] border-[#c4c7c7] hover:bg-[#efeeec]'
                      }`}
                    >
                      <span> Apple Pay</span>
                    </button>
                    <button
                      onClick={() => setPaymentType('paypal')}
                      className={`p-3 border text-label-caps uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors cursor-pointer rounded-none ${
                        paymentType === 'paypal'
                          ? 'bg-[#000000] text-white border-[#000000]'
                          : 'bg-white text-[#2b2d2c] border-[#c4c7c7] hover:bg-[#efeeec]'
                      }`}
                    >
                      <span>PayPal</span>
                    </button>
                  </div>

                  {/* Visual Luxury Card */}
                  {paymentType === 'card' && (
                    <div className="space-y-4">
                      <div className="bg-[#1a1c1b] text-white p-6 border border-[#383838] max-w-sm mx-auto space-y-6 shadow-md rounded-none">
                        <div className="flex items-center justify-between">
                          <span
                            className="text-xs tracking-widest uppercase text-white font-normal"
                            style={{ fontFamily: "'Libre Caslon Text', Georgia, serif" }}
                          >
                            BOSKI ATELIER
                          </span>
                          <span className="text-[10px] font-semibold tracking-wider text-white/60">
                            VISA PLATINUM
                          </span>
                        </div>
                        <div className="text-lg tracking-[0.25em] font-mono font-medium text-white">
                          {cardNumber || '•••• •••• •••• ••••'}
                        </div>
                        <div className="flex items-center justify-between text-xs uppercase font-medium text-white/70">
                          <div>
                            <span className="text-[9px] text-white/50 block">Cardholder</span>
                            <span>{cardHolder || 'CLIENT NAME'}</span>
                          </div>
                          <div>
                            <span className="text-[9px] text-white/50 block">Expires</span>
                            <span>{cardExpiry || 'MM/YY'}</span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <label className={labelClass}>Card Number</label>
                          <input
                            type="text"
                            value={cardNumber}
                            onChange={(e) => setCardNumber(e.target.value)}
                            className={`${inputClass} font-mono`}
                          />
                        </div>
                        <div>
                          <label className={labelClass}>Cardholder Name</label>
                          <input
                            type="text"
                            value={cardHolder}
                            onChange={(e) => setCardHolder(e.target.value)}
                            className={inputClass}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className={labelClass}>Expiry Date</label>
                            <input
                              type="text"
                              placeholder="MM/YY"
                              value={cardExpiry}
                              onChange={(e) => setCardExpiry(e.target.value)}
                              className={`${inputClass} font-mono`}
                            />
                          </div>
                          <div>
                            <label className={labelClass}>Security Code (CVC)</label>
                            <input
                              type="password"
                              placeholder="123"
                              maxLength={4}
                              value={cardCvc}
                              onChange={(e) => setCardCvc(e.target.value)}
                              className={`${inputClass} font-mono`}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-4 pt-4">
                    <button
                      onClick={() => setCurrentStep(2)}
                      className="px-6 py-3.5 border border-[#c4c7c7] hover:bg-[#f4f3f1] text-[#000000] text-label-caps uppercase tracking-wider transition-colors flex items-center gap-2 cursor-pointer rounded-none"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>Back</span>
                    </button>

                    <button
                      id="place-order-confirm-btn"
                      onClick={handleSubmitOrder}
                      disabled={isProcessing}
                      className="flex-1 py-4 bg-[#000000] hover:bg-[#252726] disabled:bg-[#8e908f] text-white text-label-caps uppercase tracking-[0.16em] transition-all flex items-center justify-center gap-2 cursor-pointer rounded-none"
                    >
                      {isProcessing ? (
                        <span className="flex items-center gap-2">
                          <span className="w-4 h-4 border-2 border-white border-t-transparent animate-spin" />
                          <span>Authorizing Payment...</span>
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          <Lock className="w-4 h-4" />
                          <span>Place Order &bull; {formatPrice(finalGrandTotal)}</span>
                        </span>
                      )}
                    </button>
                  </div>
                </div>

                {/* Right Final Totals */}
                <div className="lg:col-span-5 bg-white p-6 border border-[#c4c7c7] space-y-4 rounded-none">
                  <h4 className="text-label-caps uppercase tracking-wider text-[#505252] font-semibold">
                    Grand Total Breakdown
                  </h4>
                  <div className="space-y-2 text-body-sm text-[#444748]">
                    <div className="flex justify-between">
                      <span>Items Subtotal</span>
                      <span className="font-semibold text-[#000000]">{formatPrice(totals.subtotal)}</span>
                    </div>
                    {totals.discount > 0 && (
                      <div className="flex justify-between text-[#1b6b3e] font-semibold">
                        <span>VIP Discount</span>
                        <span>-{formatPrice(totals.discount)}</span>
                      </div>
                    )}
                    {appliedGiftWrap && (
                      <div className="flex justify-between">
                        <span>Luxury Gift Packaging</span>
                        <span className="font-semibold text-[#000000]">{formatPrice(15)}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span>Delivery ({selectedShippingMethod.name})</span>
                      <span className="font-semibold text-[#000000]">
                        {selectedShippingMethod.price === 0 ? 'Complimentary' : formatPrice(selectedShippingMethod.price)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Taxes &amp; Duties</span>
                      <span className="font-semibold text-[#000000]">{formatPrice(totals.tax)}</span>
                    </div>
                    <div className="flex justify-between text-body-md font-bold text-[#000000] pt-3 border-t border-[#c4c7c7]">
                      <span>Total Amount</span>
                      <span>{formatPrice(finalGrandTotal)}</span>
                    </div>
                  </div>

                  <div className="p-3 bg-[#f4f3f1] border border-[#e3e2e0] text-body-sm text-[#444748] space-y-1 rounded-none">
                    <p className="font-semibold text-[#000000]">Delivering to:</p>
                    <p>{formData.firstName} {formData.lastName}</p>
                    <p>{formData.address}, {formData.city}, {formData.zipCode}</p>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 4: Live Order Confirmation & Receipt */}
            {currentStep === 4 && recentOrder && (
              <div className="max-w-2xl mx-auto space-y-8 text-center py-4">
                <div className="w-16 h-16 bg-[#1b6b3e]/10 text-[#1b6b3e] flex items-center justify-center mx-auto border border-[#1b6b3e]/30 rounded-none">
                  <CheckCircle2 className="w-8 h-8" />
                </div>

                <div className="space-y-2">
                  <span className="text-label-caps uppercase tracking-[0.25em] font-semibold text-[#675d50]">
                    Order Confirmed
                  </span>
                  <h3
                    className="text-headline-md font-normal text-[#000000]"
                    style={{ fontFamily: "'Libre Caslon Text', Georgia, serif" }}
                  >
                    Thank You, {recentOrder.customer.firstName}
                  </h3>
                  <p className="text-body-sm text-[#444748] font-light max-w-md mx-auto">
                    Your bespoke order has been registered at BOSKI LIMITED. An official confirmation email has been sent to <strong>{recentOrder.customer.email}</strong>.
                  </p>
                </div>

                {/* Receipt Card */}
                <div className="bg-white border border-[#c4c7c7] p-6 sm:p-8 text-left shadow-xs space-y-6 rounded-none">
                  <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#e3e2e0]">
                    <div>
                      <span className="text-label-caps uppercase tracking-wider text-[#505252] block">
                        Order Identifier
                      </span>
                      <span className="text-body-md font-bold text-[#000000]">{recentOrder.orderId}</span>
                    </div>
                    <div>
                      <span className="text-label-caps uppercase tracking-wider text-[#505252] block">
                        Tracking Number
                      </span>
                      <span className="text-body-sm font-mono font-medium text-[#1a1c1b] bg-[#f4f3f1] border border-[#c4c7c7] px-2 py-0.5">
                        {recentOrder.trackingNumber}
                      </span>
                    </div>
                    <div>
                      <span className="text-label-caps uppercase tracking-wider text-[#505252] block">
                        Estimated Delivery
                      </span>
                      <span className="text-body-sm font-medium text-[#000000]">
                        {recentOrder.shippingMethod.estimatedDays}
                      </span>
                    </div>
                  </div>

                  {/* Items */}
                  <div className="space-y-3">
                    <span className="text-label-caps uppercase tracking-wider text-[#505252] block">
                      Ordered Creations
                    </span>
                    {recentOrder.items.map((item) => (
                      <div key={item.id} className="flex items-center justify-between text-body-sm">
                        <div className="flex items-center gap-3">
                          <img
                            src={item.selectedColor.image || item.product.images[0]}
                            alt={item.product.name}
                            className="w-10 h-12 object-cover bg-[#efeeec]"
                          />
                          <div>
                            <p className="font-semibold text-[#000000]">{item.product.name}</p>
                            <p className="text-[11px] text-[#505252]">
                              {item.selectedColor.name} &bull; {item.selectedSize} &bull; Qty: {item.quantity}
                            </p>
                          </div>
                        </div>
                        <span className="font-bold text-[#000000]">
                          {formatPrice(item.product.price * item.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Summary Totals */}
                  <div className="pt-4 border-t border-[#e3e2e0] flex justify-between items-baseline text-body-md font-bold text-[#000000]">
                    <span>Total Paid</span>
                    <span className="text-headline-sm" style={{ fontFamily: "'Libre Caslon Text', Georgia, serif" }}>
                      {formatPrice(recentOrder.total)}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap items-center justify-center gap-4">
                  <button
                    onClick={handleClose}
                    className="px-8 py-4 bg-[#000000] hover:bg-[#252726] text-white rounded-none text-label-caps uppercase tracking-[0.16em] transition-colors cursor-pointer"
                  >
                    Continue Shopping
                  </button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
