import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { OrderDetails } from '../types';
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
  } = useShop();

  // Step indicator: 1 = Shipping, 2 = Delivery, 3 = Payment, 4 = Confirmation
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);

  // Form State
  const [formData, setFormData] = useState({
    firstName: 'Victoria',
    lastName: 'Kensington',
    email: 'victoria.kensington@luxuryclient.com',
    phone: '+1 (555) 234-8921',
    address: '740 Park Avenue, Apt 14B',
    city: 'New York',
    state: 'NY',
    zipCode: '10021',
    country: 'United States',
  });

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

  return (
    <AnimatePresence>
      <div
        id="checkout-modal-overlay"
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-md overflow-y-auto"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 20 }}
          id="checkout-modal-content"
          className="bg-[#FAF9F6] w-full max-w-4xl rounded-3xl shadow-2xl border border-neutral-200 overflow-hidden flex flex-col my-auto max-h-[92vh]"
        >
          {/* Header */}
          <div className="p-5 sm:p-6 bg-white border-b border-neutral-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="font-serif text-xl sm:text-2xl font-bold tracking-widest text-neutral-950">
                ÉLÉGANCE
              </div>
              <span className="text-neutral-300 font-light">|</span>
              <span className="text-xs uppercase tracking-widest text-neutral-500 font-semibold">
                {currentStep === 4 ? 'Order Confirmation' : 'Secure Express Checkout'}
              </span>
            </div>

            <button
              id="close-checkout-modal-btn"
              onClick={handleClose}
              className="p-1.5 rounded-full text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Stepper Progress Bar (Steps 1-3) */}
          {currentStep < 4 && (
            <div className="px-6 py-4 bg-neutral-100/70 border-b border-neutral-200 flex items-center justify-center gap-4 text-xs font-semibold uppercase tracking-wider">
              <div className={`flex items-center gap-2 ${currentStep >= 1 ? 'text-neutral-950 font-bold' : 'text-neutral-400'}`}>
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${currentStep >= 1 ? 'bg-neutral-950 text-white' : 'bg-neutral-300 text-neutral-600'}`}>
                  1
                </span>
                <span>Shipping Address</span>
              </div>
              <span className="text-neutral-300">&bull;&bull;&bull;</span>
              <div className={`flex items-center gap-2 ${currentStep >= 2 ? 'text-neutral-950 font-bold' : 'text-neutral-400'}`}>
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${currentStep >= 2 ? 'bg-neutral-950 text-white' : 'bg-neutral-300 text-neutral-600'}`}>
                  2
                </span>
                <span>Delivery Method</span>
              </div>
              <span className="text-neutral-300">&bull;&bull;&bull;</span>
              <div className={`flex items-center gap-2 ${currentStep >= 3 ? 'text-neutral-950 font-bold' : 'text-neutral-400'}`}>
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${currentStep >= 3 ? 'bg-neutral-950 text-white' : 'bg-neutral-300 text-neutral-600'}`}>
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
                  <h3 className="font-serif text-xl text-neutral-900 font-medium mb-4">
                    Client & Delivery Details
                  </h3>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
                        First Name
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className="w-full px-3.5 py-2.5 bg-white border border-neutral-300 rounded-xl text-xs text-neutral-900 focus:outline-none focus:border-neutral-900"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
                        Last Name
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className="w-full px-3.5 py-2.5 bg-white border border-neutral-300 rounded-xl text-xs text-neutral-900 focus:outline-none focus:border-neutral-900"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-3.5 py-2.5 bg-white border border-neutral-300 rounded-xl text-xs text-neutral-900 focus:outline-none focus:border-neutral-900"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
                        Mobile Phone (For Courier Updates)
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full px-3.5 py-2.5 bg-white border border-neutral-300 rounded-xl text-xs text-neutral-900 focus:outline-none focus:border-neutral-900"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
                      Street Address & Residence / Apt
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="w-full px-3.5 py-2.5 bg-white border border-neutral-300 rounded-xl text-xs text-neutral-900 focus:outline-none focus:border-neutral-900"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
                        City
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        className="w-full px-3.5 py-2.5 bg-white border border-neutral-300 rounded-xl text-xs text-neutral-900 focus:outline-none focus:border-neutral-900"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
                        State / Province
                      </label>
                      <input
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        className="w-full px-3.5 py-2.5 bg-white border border-neutral-300 rounded-xl text-xs text-neutral-900 focus:outline-none focus:border-neutral-900"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
                        Postal Code
                      </label>
                      <input
                        type="text"
                        name="zipCode"
                        value={formData.zipCode}
                        onChange={handleInputChange}
                        className="w-full px-3.5 py-2.5 bg-white border border-neutral-300 rounded-xl text-xs text-neutral-900 focus:outline-none focus:border-neutral-900"
                      />
                    </div>
                  </div>

                  <button
                    id="checkout-step1-continue-btn"
                    onClick={handleNextStep}
                    className="w-full py-4 bg-neutral-950 hover:bg-neutral-800 text-white rounded-xl text-xs font-bold uppercase tracking-[0.2em] shadow-lg transition-colors flex items-center justify-center gap-2 mt-4"
                  >
                    <span>Continue to Delivery Options</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Right Mini Order Summary */}
                <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-neutral-200 space-y-4">
                  <h4 className="text-xs uppercase font-bold tracking-wider text-neutral-400">
                    Order Summary ({cart.length} items)
                  </h4>
                  <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                    {cart.map((item) => (
                      <div key={item.id} className="flex items-center gap-3">
                        <img
                          src={item.selectedColor.image || item.product.images[0]}
                          alt={item.product.name}
                          className="w-12 h-14 rounded-lg object-cover bg-neutral-100 shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-neutral-900 truncate">{item.product.name}</p>
                          <p className="text-[11px] text-neutral-500">
                            {item.selectedColor.name} &bull; {item.selectedSize} (Qty: {item.quantity})
                          </p>
                        </div>
                        <span className="text-xs font-bold text-neutral-900">
                          {formatPrice(item.product.price * item.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-4 border-t border-neutral-100 space-y-1.5 text-xs text-neutral-600">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span className="font-semibold text-neutral-900">{formatPrice(totals.subtotal)}</span>
                    </div>
                    {totals.discount > 0 && (
                      <div className="flex justify-between text-emerald-600 font-semibold">
                        <span>VIP Discount</span>
                        <span>-{formatPrice(totals.discount)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm font-bold text-neutral-950 pt-2 border-t border-neutral-200">
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
                  <h3 className="font-serif text-2xl text-neutral-900 font-medium">
                    Select Atelier Delivery Protocol
                  </h3>
                  <p className="text-xs text-neutral-500 font-light mt-1">
                    All deliveries are insured at full valuation and require signature upon receipt.
                  </p>
                </div>

                <div className="space-y-3">
                  {SHIPPING_METHODS.map((method) => (
                    <div
                      key={method.id}
                      id={`shipping-option-${method.id}`}
                      onClick={() => setSelectedShippingMethod(method)}
                      className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-start gap-4 ${
                        selectedShippingMethod.id === method.id
                          ? 'border-neutral-950 bg-white shadow-md'
                          : 'border-neutral-200 bg-white/60 hover:bg-white hover:border-neutral-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="shipping"
                        checked={selectedShippingMethod.id === method.id}
                        onChange={() => setSelectedShippingMethod(method)}
                        className="accent-neutral-950 mt-1 cursor-pointer"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-bold text-neutral-900">{method.name}</h4>
                          <span className="text-xs font-bold text-neutral-950">
                            {method.price === 0 ? 'Complimentary' : formatPrice(method.price)}
                          </span>
                        </div>
                        <p className="text-xs text-neutral-600 mt-0.5">{method.description}</p>
                        <span className="inline-block mt-2 text-[10px] font-semibold tracking-wider text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full">
                          Estimated: {method.estimatedDays}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-4 pt-4">
                  <button
                    onClick={() => setCurrentStep(1)}
                    className="px-6 py-3.5 border border-neutral-300 hover:bg-neutral-100 text-neutral-700 rounded-xl text-xs font-semibold uppercase tracking-wider transition-colors flex items-center gap-2"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back</span>
                  </button>

                  <button
                    id="checkout-step2-continue-btn"
                    onClick={handleNextStep}
                    className="flex-1 py-4 bg-neutral-950 hover:bg-neutral-800 text-white rounded-xl text-xs font-bold uppercase tracking-[0.2em] shadow-lg transition-colors flex items-center justify-center gap-2"
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
                    <h3 className="font-serif text-2xl text-neutral-900 font-medium">
                      Payment Authorization
                    </h3>
                    <p className="text-xs text-neutral-500 font-light mt-1">
                      Encrypted end-to-end via PCI-DSS Level 1 bank vault gateway.
                    </p>
                  </div>

                  {/* Payment Type Tabs */}
                  <div className="grid grid-cols-3 gap-3">
                    <button
                      onClick={() => setPaymentType('card')}
                      className={`p-3 rounded-xl border text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors ${
                        paymentType === 'card'
                          ? 'bg-neutral-950 text-white border-neutral-950 shadow-sm'
                          : 'bg-white text-neutral-700 border-neutral-300 hover:bg-neutral-50'
                      }`}
                    >
                      <CreditCard className="w-4 h-4" />
                      <span>Card</span>
                    </button>
                    <button
                      onClick={() => setPaymentType('applepay')}
                      className={`p-3 rounded-xl border text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors ${
                        paymentType === 'applepay'
                          ? 'bg-neutral-950 text-white border-neutral-950 shadow-sm'
                          : 'bg-white text-neutral-700 border-neutral-300 hover:bg-neutral-50'
                      }`}
                    >
                      <span> Apple Pay</span>
                    </button>
                    <button
                      onClick={() => setPaymentType('paypal')}
                      className={`p-3 rounded-xl border text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors ${
                        paymentType === 'paypal'
                          ? 'bg-neutral-950 text-white border-neutral-950 shadow-sm'
                          : 'bg-white text-neutral-700 border-neutral-300 hover:bg-neutral-50'
                      }`}
                    >
                      <span>PayPal</span>
                    </button>
                  </div>

                  {/* Visual Luxury Card */}
                  {paymentType === 'card' && (
                    <div className="space-y-4">
                      <div className="bg-gradient-to-tr from-neutral-950 via-neutral-900 to-neutral-800 text-white p-6 rounded-2xl shadow-xl border border-neutral-700/60 max-w-sm mx-auto space-y-6">
                        <div className="flex items-center justify-between">
                          <span className="font-serif text-sm tracking-widest uppercase font-bold text-amber-300">
                            ATELIER CARD
                          </span>
                          <span className="text-xs font-semibold tracking-wider text-neutral-400">
                            VISA PLATINUM
                          </span>
                        </div>
                        <div className="text-lg tracking-[0.25em] font-mono font-bold text-neutral-100">
                          {cardNumber || '•••• •••• •••• ••••'}
                        </div>
                        <div className="flex items-center justify-between text-xs uppercase font-medium text-neutral-300">
                          <div>
                            <span className="text-[9px] text-neutral-500 block">Cardholder</span>
                            <span>{cardHolder || 'CLIENT NAME'}</span>
                          </div>
                          <div>
                            <span className="text-[9px] text-neutral-500 block">Expires</span>
                            <span>{cardExpiry || 'MM/YY'}</span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
                            Card Number
                          </label>
                          <input
                            type="text"
                            value={cardNumber}
                            onChange={(e) => setCardNumber(e.target.value)}
                            className="w-full px-3.5 py-2.5 bg-white border border-neutral-300 rounded-xl text-xs text-neutral-900 focus:outline-none focus:border-neutral-900 font-mono"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
                            Cardholder Name
                          </label>
                          <input
                            type="text"
                            value={cardHolder}
                            onChange={(e) => setCardHolder(e.target.value)}
                            className="w-full px-3.5 py-2.5 bg-white border border-neutral-300 rounded-xl text-xs text-neutral-900 focus:outline-none focus:border-neutral-900"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
                              Expiry Date
                            </label>
                            <input
                              type="text"
                              placeholder="MM/YY"
                              value={cardExpiry}
                              onChange={(e) => setCardExpiry(e.target.value)}
                              className="w-full px-3.5 py-2.5 bg-white border border-neutral-300 rounded-xl text-xs text-neutral-900 focus:outline-none focus:border-neutral-900 font-mono"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
                              Security Code (CVC)
                            </label>
                            <input
                              type="password"
                              placeholder="123"
                              maxLength={4}
                              value={cardCvc}
                              onChange={(e) => setCardCvc(e.target.value)}
                              className="w-full px-3.5 py-2.5 bg-white border border-neutral-300 rounded-xl text-xs text-neutral-900 focus:outline-none focus:border-neutral-900 font-mono"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-4 pt-4">
                    <button
                      onClick={() => setCurrentStep(2)}
                      className="px-6 py-3.5 border border-neutral-300 hover:bg-neutral-100 text-neutral-700 rounded-xl text-xs font-semibold uppercase tracking-wider transition-colors flex items-center gap-2"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>Back</span>
                    </button>

                    <button
                      id="place-order-confirm-btn"
                      onClick={handleSubmitOrder}
                      disabled={isProcessing}
                      className="flex-1 py-4 bg-neutral-950 hover:bg-neutral-800 disabled:bg-neutral-600 text-white rounded-xl text-xs font-bold uppercase tracking-[0.2em] shadow-xl hover:shadow-2xl transition-all flex items-center justify-center gap-2"
                    >
                      {isProcessing ? (
                        <span className="flex items-center gap-2">
                          <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
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
                <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-neutral-200 space-y-4">
                  <h4 className="text-xs uppercase font-bold tracking-wider text-neutral-400">
                    Grand Total Breakdown
                  </h4>
                  <div className="space-y-2 text-xs text-neutral-600">
                    <div className="flex justify-between">
                      <span>Items Subtotal</span>
                      <span className="font-semibold text-neutral-900">{formatPrice(totals.subtotal)}</span>
                    </div>
                    {totals.discount > 0 && (
                      <div className="flex justify-between text-emerald-600 font-semibold">
                        <span>VIP Discount</span>
                        <span>-{formatPrice(totals.discount)}</span>
                      </div>
                    )}
                    {appliedGiftWrap && (
                      <div className="flex justify-between">
                        <span>Luxury Gift Packaging</span>
                        <span className="font-semibold text-neutral-900">{formatPrice(15)}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span>Delivery Method ({selectedShippingMethod.name})</span>
                      <span className="font-semibold text-neutral-900">
                        {selectedShippingMethod.price === 0 ? 'Complimentary' : formatPrice(selectedShippingMethod.price)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Taxes & Duties</span>
                      <span className="font-semibold text-neutral-900">{formatPrice(totals.tax)}</span>
                    </div>
                    <div className="flex justify-between text-base font-bold text-neutral-950 pt-3 border-t border-neutral-200">
                      <span>Total Amount</span>
                      <span>{formatPrice(finalGrandTotal)}</span>
                    </div>
                  </div>

                  <div className="p-3 bg-neutral-50 rounded-xl text-[11px] text-neutral-500 space-y-1">
                    <p className="font-semibold text-neutral-800">Delivering to:</p>
                    <p>{formData.firstName} {formData.lastName}</p>
                    <p>{formData.address}, {formData.city}, {formData.zipCode}</p>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 4: Live Order Confirmation & Receipt */}
            {currentStep === 4 && recentOrder && (
              <div className="max-w-2xl mx-auto space-y-8 text-center py-4">
                <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
                  <CheckCircle2 className="w-10 h-10" />
                </div>

                <div className="space-y-2">
                  <span className="text-xs uppercase tracking-[0.3em] font-semibold text-amber-700">
                    Order Confirmed
                  </span>
                  <h3 className="font-serif text-3xl sm:text-4xl font-normal text-neutral-950">
                    Thank You, {recentOrder.customer.firstName}
                  </h3>
                  <p className="text-xs sm:text-sm text-neutral-500 font-light max-w-md mx-auto">
                    Your bespoke order has been registered in our Milan Atelier. An official invoice and confirmation email have been sent to <strong>{recentOrder.customer.email}</strong>.
                  </p>
                </div>

                {/* Receipt Card */}
                <div className="bg-white rounded-3xl border border-neutral-200 p-6 sm:p-8 text-left shadow-sm space-y-6">
                  <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-neutral-100">
                    <div>
                      <span className="text-[10px] uppercase font-bold tracking-wider text-neutral-400 block">
                        Order Identifier
                      </span>
                      <span className="text-sm font-bold text-neutral-900">{recentOrder.orderId}</span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold tracking-wider text-neutral-400 block">
                        Tracking Number
                      </span>
                      <span className="text-xs font-mono font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded">
                        {recentOrder.trackingNumber}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold tracking-wider text-neutral-400 block">
                        Estimated Delivery
                      </span>
                      <span className="text-xs font-semibold text-neutral-800">
                        {recentOrder.shippingMethod.estimatedDays}
                      </span>
                    </div>
                  </div>

                  {/* Items */}
                  <div className="space-y-3">
                    <span className="text-xs uppercase font-bold tracking-wider text-neutral-500 block">
                      Ordered Creations
                    </span>
                    {recentOrder.items.map((item) => (
                      <div key={item.id} className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-3">
                          <img
                            src={item.selectedColor.image || item.product.images[0]}
                            alt={item.product.name}
                            className="w-10 h-12 rounded object-cover"
                          />
                          <div>
                            <p className="font-semibold text-neutral-900">{item.product.name}</p>
                            <p className="text-[11px] text-neutral-500">
                              {item.selectedColor.name} &bull; {item.selectedSize} &bull; Qty: {item.quantity}
                            </p>
                          </div>
                        </div>
                        <span className="font-bold text-neutral-950">
                          {formatPrice(item.product.price * item.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Summary Totals */}
                  <div className="pt-4 border-t border-neutral-100 flex justify-between items-baseline text-sm font-bold text-neutral-950">
                    <span>Total Paid</span>
                    <span className="text-lg">{formatPrice(recentOrder.total)}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap items-center justify-center gap-4">
                  <button
                    onClick={handleClose}
                    className="px-8 py-4 bg-neutral-950 hover:bg-neutral-800 text-white rounded-full text-xs font-bold uppercase tracking-[0.2em] shadow-lg transition-colors"
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
