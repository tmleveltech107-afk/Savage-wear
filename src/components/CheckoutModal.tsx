import React, { useState } from 'react';
import {
  X,
  Lock,
  ShieldCheck,
  CreditCard,
  Truck,
  Check,
  ArrowRight,
  Tag,
  Copy,
  Printer,
  ChevronDown,
  Sparkles,
  MapPin,
  Clock,
  ExternalLink,
} from 'lucide-react';
import { CartItem } from '../types';
import { formatPKR, getProductPKRPrice } from '../utils/currency';

export interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onOrderCompleted: (orderNumber: string) => void;
  visitorName?: string;
}

type PaymentMethod = 'card' | 'cod' | 'klarna' | 'applepay' | 'wire';
type ShippingSpeed = 'standard' | 'express' | 'concierge';

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  onOrderCompleted,
  visitorName = 'Valued Client',
}) => {
  // Step & Flow state
  const [step, setStep] = useState<'details' | 'processing' | 'confirmed'>('details');
  const [orderNumber, setOrderNumber] = useState<string>('');
  const [copiedOrder, setCopiedOrder] = useState(false);

  // Form Fields
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState('United States');
  const [firstName, setFirstName] = useState(visitorName === 'GUEST' || visitorName === 'Valued Client' ? '' : visitorName.split(' ')[0] || '');
  const [lastName, setLastName] = useState(visitorName.split(' ').slice(1).join(' ') || '');
  const [address, setAddress] = useState('');
  const [apartment, setApartment] = useState('');
  const [city, setCity] = useState('');
  const [stateRegion, setStateRegion] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [newsletter, setNewsletter] = useState(true);

  // Shipping & Payment
  const [shippingSpeed, setShippingSpeed] = useState<ShippingSpeed>('standard');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');
  const [sameAsShipping, setSameAsShipping] = useState(true);

  // Card details
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState(firstName ? `${firstName} ${lastName}`.trim() : '');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');

  // Promo code engine
  const [promoCodeInput, setPromoCodeInput] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState<{ code: string; percent: number; label: string } | null>(null);
  const [promoError, setPromoError] = useState('');
  const [promoSuccess, setPromoSuccess] = useState('');

  if (!isOpen) return null;

  // Price Calculations in PKR
  const subtotal = items.reduce((acc, item) => acc + getProductPKRPrice(item.product) * item.quantity, 0);
  
  const discountAmount = appliedDiscount ? Math.round((subtotal * appliedDiscount.percent) / 100) : 0;
  
  const shippingCost = (() => {
    if (appliedDiscount?.code === 'FREESHIP') return 0;
    if (shippingSpeed === 'concierge') return 490;
    if (shippingSpeed === 'express') return 250;
    return subtotal >= 5000 ? 0 : 200; // standard delivery
  })();

  const estimatedTax = 0; // standard inclusive VAT
  const totalAmount = Math.max(0, subtotal - discountAmount + shippingCost + estimatedTax);

  // Card number input formatter
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 16);
    const formatted = raw.replace(/(\d{4})/g, '$1 ').trim();
    setCardNumber(formatted);
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 4);
    if (raw.length > 2) {
      setCardExpiry(`${raw.slice(0, 2)}/${raw.slice(2)}`);
    } else {
      setCardExpiry(raw);
    }
  };

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCardCvv(e.target.value.replace(/\D/g, '').slice(0, 4));
  };

  // Promo Code Validation
  const handleApplyPromo = () => {
    setPromoError('');
    setPromoSuccess('');
    const code = promoCodeInput.trim().toUpperCase();

    if (!code) return;

    if (code === 'SAVAGE10') {
      setAppliedDiscount({ code: 'SAVAGE10', percent: 10, label: 'SAVAGE10 (10% Off Entire Order)' });
      setPromoSuccess('Promo code SAVAGE10 applied successfully: 10% OFF!');
    } else if (code === 'VIP20') {
      setAppliedDiscount({ code: 'VIP20', percent: 20, label: 'VIP20 (20% Off Archival Member Access)' });
      setPromoSuccess('VIP Code applied: 20% OFF your archive purchase!');
    } else if (code === 'FREESHIP') {
      setAppliedDiscount({ code: 'FREESHIP', percent: 0, label: 'FREESHIP (Complimentary Global Express)' });
      setPromoSuccess('Free Express Shipping unlocked!');
    } else {
      setPromoError('Invalid promotional code. Try "SAVAGE10" or "VIP20".');
    }
  };

  // Autofill demo data helper
  const handleAutofillDemo = () => {
    setEmail('client.archive@savagewear.com');
    setPhone('+1 (555) 382-9014');
    setCountry('United States');
    setFirstName('Marcus');
    setLastName('Vance');
    setAddress('742 Fashion Boulevard, Suite 12B');
    setCity('New York');
    setStateRegion('NY');
    setPostalCode('10012');
    setCardNumber('4532 8921 7310 9481');
    setCardName('MARCUS VANCE');
    setCardExpiry('08/28');
    setCardCvv('782');
  };

  // Form submission / Order placement
  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('processing');

    setTimeout(() => {
      const generatedOrderNum = `SW-${Math.floor(100000 + Math.random() * 900000)}`;
      setOrderNumber(generatedOrderNum);
      setStep('confirmed');
      onOrderCompleted(generatedOrderNum);
    }, 1800);
  };

  const handleCopyOrder = () => {
    if (orderNumber) {
      navigator.clipboard.writeText(orderNumber);
      setCopiedOrder(true);
      setTimeout(() => setCopiedOrder(false), 2000);
    }
  };

  const handlePrintReceipt = () => {
    window.print();
  };

  return (
    <div
      id="professional-checkout-overlay"
      className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-md flex items-center justify-center p-0 sm:p-4 lg:p-6"
    >
      <div
        className="w-full max-w-5xl bg-[#F7F5F0] text-[#171717] min-h-screen sm:min-h-0 sm:max-h-[92vh] flex flex-col shadow-2xl border border-[#DEDAD2] relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Bar */}
        <div className="px-6 py-4 border-b border-[#DEDAD2] flex items-center justify-between bg-white/60 sticky top-0 z-30 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold tracking-[0.24em] uppercase text-[#171717]">
              SAVAGE WEAR
            </span>
            <span className="text-[#DEDAD2] hidden sm:inline">|</span>
            <div className="flex items-center gap-1.5 text-[10px] tracking-[0.2em] text-[#77736C] uppercase font-light">
              <Lock className="w-3 h-3 text-emerald-600" />
              <span>256-BIT ENCRYPTED CHECKOUT</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {step === 'details' && (
              <button
                type="button"
                onClick={handleAutofillDemo}
                className="hidden md:flex items-center gap-1 text-[10px] tracking-widest text-[#77736C] hover:text-[#171717] uppercase px-2.5 py-1 border border-[#DEDAD2] hover:border-[#171717] transition-all bg-white"
                title="Quickly fill test fields"
              >
                <Sparkles className="w-3 h-3 text-amber-500" />
                <span>AUTOFILL DEMO INFO</span>
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-[#77736C] hover:text-[#171717] hover:bg-black/5 transition-all"
              aria-label="Close checkout"
            >
              <X className="w-5 h-5 stroke-[1.5]" />
            </button>
          </div>
        </div>

        {/* PROCESSING SCREEN */}
        {step === 'processing' && (
          <div className="flex-1 flex flex-col items-center justify-center p-12 text-center my-auto min-h-[460px]">
            <div className="w-16 h-16 border-2 border-[#171717] border-t-transparent rounded-full animate-spin mb-6" />
            <span className="text-xs tracking-[0.3em] uppercase text-[#77736C] block mb-2">
              PROCESSING TRANSACTION
            </span>
            <h2 className="text-2xl font-light tracking-[0.16em] uppercase text-[#171717] mb-3">
              SECURING YOUR ATELIER SELECTION
            </h2>
            <p className="text-xs text-[#77736C] max-w-md font-light leading-relaxed">
              Verifying payment authorization and routing reserve allocation to the Milan flagship fulfillment hub.
            </p>
          </div>
        )}

        {/* ORDER CONFIRMATION SCREEN */}
        {step === 'confirmed' && (
          <div className="flex-1 overflow-y-auto p-6 sm:p-10 max-w-3xl mx-auto w-full">
            <div className="text-center pb-8 border-b border-[#DEDAD2]">
              <div className="w-14 h-14 bg-[#171717] text-[#F7F5F0] rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-7 h-7 stroke-[2.5]" />
              </div>
              <span className="text-[10px] tracking-[0.34em] uppercase text-emerald-700 font-medium block mb-1">
                TRANSACTION AUTHORIZED & RECORDED
              </span>
              <h1 className="text-2xl sm:text-4xl font-light tracking-[0.14em] uppercase text-[#171717] mb-3">
                THANK YOU FOR YOUR ORDER
              </h1>
              <p className="text-xs text-[#77736C] font-light max-w-md mx-auto leading-relaxed mb-6">
                A confirmation with your complimentary courier tracking link and digital invoice has been generated for {email || 'your account'}.
              </p>

              {/* Order Reference Pill */}
              <div className="inline-flex items-center gap-3 px-5 py-3 bg-white border border-[#DEDAD2] shadow-sm">
                <div>
                  <span className="text-[9px] tracking-widest text-[#77736C] uppercase block">
                    ORDER REFERENCE NUMBER
                  </span>
                  <span className="text-base font-semibold tracking-wider text-[#171717]">
                    #{orderNumber}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleCopyOrder}
                  className="p-1.5 hover:bg-black/5 text-[#77736C] hover:text-[#171717] transition-colors"
                  title="Copy reference number"
                >
                  <Copy className="w-4 h-4" />
                </button>
                {copiedOrder && (
                  <span className="text-[10px] text-emerald-600 font-medium">COPIED</span>
                )}
              </div>
            </div>

            {/* Courier Dispatch Timeline */}
            <div className="py-8 border-b border-[#DEDAD2]">
              <span className="text-[10px] tracking-[0.28em] uppercase text-[#77736C] block mb-4 font-semibold">
                LOGISTICS & ATELIER TIMELINE
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 relative">
                <div className="bg-white p-4 border border-[#171717] relative">
                  <div className="flex items-center gap-2 mb-1 text-emerald-600">
                    <Check className="w-4 h-4" />
                    <span className="text-[10px] font-semibold tracking-wider uppercase">CONFIRMED</span>
                  </div>
                  <span className="text-xs font-medium text-[#171717] block">Order Placed</span>
                  <span className="text-[10px] text-[#77736C]">Just now</span>
                </div>

                <div className="bg-white/70 p-4 border border-[#DEDAD2]">
                  <div className="flex items-center gap-2 mb-1 text-[#171717]">
                    <Clock className="w-4 h-4 text-amber-600" />
                    <span className="text-[10px] font-semibold tracking-wider uppercase">IN PREPARATION</span>
                  </div>
                  <span className="text-xs font-medium text-[#171717] block">Quality Inspection</span>
                  <span className="text-[10px] text-[#77736C]">Milan Atelier (24h)</span>
                </div>

                <div className="bg-white/40 p-4 border border-[#DEDAD2]">
                  <div className="flex items-center gap-2 mb-1 text-[#77736C]">
                    <Truck className="w-4 h-4" />
                    <span className="text-[10px] font-medium tracking-wider uppercase">TRANSIT</span>
                  </div>
                  <span className="text-xs text-[#77736C] block">DHL Express Air</span>
                  <span className="text-[10px] text-[#77736C]">Tracked & Insured</span>
                </div>

                <div className="bg-white/40 p-4 border border-[#DEDAD2]">
                  <div className="flex items-center gap-2 mb-1 text-[#77736C]">
                    <MapPin className="w-4 h-4" />
                    <span className="text-[10px] font-medium tracking-wider uppercase">DELIVERY</span>
                  </div>
                  <span className="text-xs text-[#77736C] block">Est. 3-4 Days</span>
                  <span className="text-[10px] text-[#77736C]">Signature Required</span>
                </div>
              </div>
            </div>

            {/* Purchased Items Overview */}
            <div className="py-6 border-b border-[#DEDAD2]">
              <span className="text-[10px] tracking-[0.28em] uppercase text-[#77736C] block mb-3 font-semibold">
                ITEMS IN THIS SHIPMENT ({items.reduce((s, i) => s + i.quantity, 0)})
              </span>
              <div className="space-y-3">
                {items.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-4 bg-white p-3 border border-[#DEDAD2]">
                    <div className="w-14 h-16 bg-[#ECEFF1] overflow-hidden flex-shrink-0">
                      <img
                        src={item.product.primaryImage}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs uppercase font-medium text-[#171717] truncate">
                        {item.product.name}
                      </h4>
                      <p className="text-[10px] text-[#77736C] uppercase tracking-wider">
                        Size: {item.selectedSize} // Color: {item.selectedColor} // Qty: {item.quantity}
                      </p>
                    </div>
                    <span className="text-xs font-semibold text-[#171717]">
                      ${item.product.price * item.quantity}
                    </span>
                  </div>
                ))}
              </div>

              {/* Totals Breakdown */}
              <div className="mt-4 pt-4 border-t border-[#DEDAD2] space-y-1.5 text-xs">
                <div className="flex justify-between text-[#77736C]">
                  <span>Subtotal</span>
                  <span>${subtotal}</span>
                </div>
                {appliedDiscount && (
                  <div className="flex justify-between text-emerald-700">
                    <span>Discount ({appliedDiscount.code})</span>
                    <span>-${discountAmount}</span>
                  </div>
                )}
                <div className="flex justify-between text-[#77736C]">
                  <span>Shipping ({shippingSpeed.toUpperCase()})</span>
                  <span>{shippingCost === 0 ? 'FREE' : `$${shippingCost}`}</span>
                </div>
                <div className="flex justify-between text-[#77736C]">
                  <span>Estimated Tax / Import Duty</span>
                  <span>${estimatedTax}</span>
                </div>
                <div className="flex justify-between text-sm font-semibold text-[#171717] pt-2 border-t border-[#DEDAD2]">
                  <span>Total Paid</span>
                  <span>${totalAmount}</span>
                </div>
              </div>
            </div>

            {/* Destination Address Confirmation */}
            <div className="py-6 flex flex-col sm:flex-row justify-between gap-4 text-xs">
              <div>
                <span className="text-[10px] tracking-widest uppercase text-[#77736C] block mb-1 font-semibold">
                  SHIPPING DESTINATION
                </span>
                <p className="font-medium text-[#171717]">{firstName} {lastName}</p>
                <p className="text-[#77736C]">{address} {apartment}</p>
                <p className="text-[#77736C]">{city}, {stateRegion} {postalCode}</p>
                <p className="text-[#77736C]">{country}</p>
              </div>

              <div>
                <span className="text-[10px] tracking-widest uppercase text-[#77736C] block mb-1 font-semibold">
                  PAYMENT METHOD
                </span>
                <p className="font-medium text-[#171717] uppercase">
                  {paymentMethod === 'card' && `CREDIT CARD (ENDING IN ${cardNumber.slice(-4) || '9481'})`}
                  {paymentMethod === 'cod' && 'CASH ON DELIVERY (DOORSTEP VERIFIED)'}
                  {paymentMethod === 'klarna' && 'KLARNA (4 INTEREST-FREE INSTALLMENTS)'}
                  {paymentMethod === 'applepay' && 'APPLE PAY (TOUCH ID AUTHORIZED)'}
                  {paymentMethod === 'wire' && 'DIRECT BANK WIRE'}
                </p>
                <p className="text-[#77736C]">Billing Address: Same as Shipping</p>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-6 border-t border-[#DEDAD2] flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={handlePrintReceipt}
                className="flex-1 py-3 px-4 border border-[#DEDAD2] hover:border-[#171717] text-[#171717] text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all bg-white"
              >
                <Printer className="w-4 h-4" />
                <span>PRINT INVOICE RECEIPT</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 px-4 bg-[#171717] text-[#F7F5F0] hover:bg-black text-xs uppercase tracking-[0.24em] font-medium flex items-center justify-center gap-2 transition-all shadow-md"
              >
                <span>CONTINUE SHOPPING</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* MAIN CHECKOUT DETAILS FORM */}
        {step === 'details' && (
          <form onSubmit={handleSubmitOrder} className="flex-1 overflow-y-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 min-h-full">
              
              {/* LEFT COLUMN: Customer Information & Steps (7 Cols) */}
              <div className="lg:col-span-7 p-5 sm:p-8 space-y-8 border-b lg:border-b-0 lg:border-r border-[#DEDAD2]">
                
                {/* 1-Click Express Checkout */}
                <div>
                  <span className="text-[10px] tracking-[0.26em] uppercase text-[#77736C] block mb-3 font-semibold">
                    EXPRESS 1-CLICK CHECKOUT
                  </span>
                  <div className="grid grid-cols-3 gap-2 sm:gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        handleAutofillDemo();
                        setPaymentMethod('applepay');
                      }}
                      className="py-3 px-2 bg-black text-white hover:bg-zinc-800 transition-colors flex items-center justify-center gap-1 text-xs font-medium tracking-wide rounded-sm shadow-sm"
                    >
                      <span> Pay</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        handleAutofillDemo();
                        setPaymentMethod('card');
                      }}
                      className="py-3 px-2 bg-white text-zinc-900 border border-[#DEDAD2] hover:border-[#171717] transition-colors flex items-center justify-center gap-1 text-xs font-semibold tracking-wide rounded-sm shadow-sm"
                    >
                      <span>G Pay</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        handleAutofillDemo();
                        setPaymentMethod('klarna');
                      }}
                      className="py-3 px-2 bg-[#FFB3C7] text-[#171717] hover:bg-[#ffa3bc] transition-colors flex items-center justify-center gap-1 text-xs font-bold tracking-wide rounded-sm shadow-sm"
                    >
                      <span>Klarna.</span>
                    </button>
                  </div>

                  <div className="relative flex items-center justify-center mt-6">
                    <div className="border-t border-[#DEDAD2] w-full" />
                    <span className="bg-[#F7F5F0] px-4 text-[10px] tracking-[0.24em] uppercase text-[#77736C] absolute font-medium">
                      OR ENTER SHIPPING ADDRESS
                    </span>
                  </div>
                </div>

                {/* Section 1: Contact Information */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xs tracking-[0.24em] uppercase font-semibold text-[#171717]">
                      1. CONTACT INFORMATION
                    </h3>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="text-[10px] tracking-wider uppercase text-[#77736C] block mb-1">
                        EMAIL ADDRESS <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="client@luxury.com"
                        className="w-full px-3.5 py-2.5 bg-white border border-[#DEDAD2] focus:border-[#171717] text-xs text-[#171717] outline-none transition-colors"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] tracking-wider uppercase text-[#77736C] block mb-1">
                        MOBILE PHONE (FOR COURIER SMS UPDATES) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+1 (555) 000-0000"
                        className="w-full px-3.5 py-2.5 bg-white border border-[#DEDAD2] focus:border-[#171717] text-xs text-[#171717] outline-none transition-colors"
                      />
                    </div>

                    <label className="flex items-center gap-2 cursor-pointer pt-1">
                      <input
                        type="checkbox"
                        checked={newsletter}
                        onChange={(e) => setNewsletter(e.target.checked)}
                        className="w-3.5 h-3.5 accent-[#171717]"
                      />
                      <span className="text-[11px] text-[#77736C] font-light">
                        Receive private access invitations to future archival runway drops
                      </span>
                    </label>
                  </div>
                </div>

                {/* Section 2: Delivery Address */}
                <div>
                  <h3 className="text-xs tracking-[0.24em] uppercase font-semibold text-[#171717] mb-3">
                    2. SHIPPING ADDRESS
                  </h3>

                  <div className="space-y-3">
                    <div>
                      <label className="text-[10px] tracking-wider uppercase text-[#77736C] block mb-1">
                        COUNTRY / TERRITORY <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-white border border-[#DEDAD2] focus:border-[#171717] text-xs text-[#171717] outline-none transition-colors"
                      >
                        <option value="United States">United States</option>
                        <option value="United Kingdom">United Kingdom</option>
                        <option value="Pakistan">Pakistan</option>
                        <option value="United Arab Emirates">United Arab Emirates</option>
                        <option value="Germany">Germany</option>
                        <option value="France">France</option>
                        <option value="Italy">Italy</option>
                        <option value="Japan">Japan</option>
                        <option value="Canada">Canada</option>
                        <option value="Australia">Australia</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[10px] tracking-wider uppercase text-[#77736C] block mb-1">
                          FIRST NAME <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          placeholder="First Name"
                          className="w-full px-3.5 py-2.5 bg-white border border-[#DEDAD2] focus:border-[#171717] text-xs text-[#171717] outline-none transition-colors"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] tracking-wider uppercase text-[#77736C] block mb-1">
                          LAST NAME <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          placeholder="Last Name"
                          className="w-full px-3.5 py-2.5 bg-white border border-[#DEDAD2] focus:border-[#171717] text-xs text-[#171717] outline-none transition-colors"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] tracking-wider uppercase text-[#77736C] block mb-1">
                        STREET ADDRESS <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="House / Building number, Street name"
                        className="w-full px-3.5 py-2.5 bg-white border border-[#DEDAD2] focus:border-[#171717] text-xs text-[#171717] outline-none transition-colors"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] tracking-wider uppercase text-[#77736C] block mb-1">
                        APARTMENT, SUITE, UNIT (OPTIONAL)
                      </label>
                      <input
                        type="text"
                        value={apartment}
                        onChange={(e) => setApartment(e.target.value)}
                        placeholder="Apt, Suite, Floor (optional)"
                        className="w-full px-3.5 py-2.5 bg-white border border-[#DEDAD2] focus:border-[#171717] text-xs text-[#171717] outline-none transition-colors"
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="text-[10px] tracking-wider uppercase text-[#77736C] block mb-1">
                          CITY <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          placeholder="City"
                          className="w-full px-3.5 py-2.5 bg-white border border-[#DEDAD2] focus:border-[#171717] text-xs text-[#171717] outline-none transition-colors"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] tracking-wider uppercase text-[#77736C] block mb-1">
                          STATE / PROVINCE
                        </label>
                        <input
                          type="text"
                          value={stateRegion}
                          onChange={(e) => setStateRegion(e.target.value)}
                          placeholder="State"
                          className="w-full px-3.5 py-2.5 bg-white border border-[#DEDAD2] focus:border-[#171717] text-xs text-[#171717] outline-none transition-colors"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] tracking-wider uppercase text-[#77736C] block mb-1">
                          POSTAL CODE <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={postalCode}
                          onChange={(e) => setPostalCode(e.target.value)}
                          placeholder="Postal Code"
                          className="w-full px-3.5 py-2.5 bg-white border border-[#DEDAD2] focus:border-[#171717] text-xs text-[#171717] outline-none transition-colors"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Section 3: Shipping Method */}
                <div>
                  <h3 className="text-xs tracking-[0.24em] uppercase font-semibold text-[#171717] mb-3">
                    3. SHIPPING SPEED & LOGISTICS
                  </h3>

                  <div className="space-y-2.5">
                    <label
                      onClick={() => setShippingSpeed('standard')}
                      className={`flex items-center justify-between p-3.5 border cursor-pointer transition-all ${
                        shippingSpeed === 'standard'
                          ? 'border-[#171717] bg-white ring-1 ring-[#171717]'
                          : 'border-[#DEDAD2] bg-white/40 hover:bg-white'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="shipping"
                          checked={shippingSpeed === 'standard'}
                          onChange={() => setShippingSpeed('standard')}
                          className="accent-[#171717]"
                        />
                        <div>
                          <span className="text-xs uppercase font-medium text-[#171717] block">
                            STANDARD INSURED COURIER (3-5 BUSINESS DAYS)
                          </span>
                          <span className="text-[10px] text-[#77736C] font-light">
                            Fully tracked delivery with carbon-neutral transit
                          </span>
                        </div>
                      </div>
                      <span className="text-xs font-semibold text-[#171717]">
                        {subtotal >= 200 || appliedDiscount?.code === 'FREESHIP' ? 'FREE' : '$15'}
                      </span>
                    </label>

                    <label
                      onClick={() => setShippingSpeed('express')}
                      className={`flex items-center justify-between p-3.5 border cursor-pointer transition-all ${
                        shippingSpeed === 'express'
                          ? 'border-[#171717] bg-white ring-1 ring-[#171717]'
                          : 'border-[#DEDAD2] bg-white/40 hover:bg-white'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="shipping"
                          checked={shippingSpeed === 'express'}
                          onChange={() => setShippingSpeed('express')}
                          className="accent-[#171717]"
                        />
                        <div>
                          <span className="text-xs uppercase font-medium text-[#171717] block flex items-center gap-1.5">
                            <span>DHL PRIORITY AIR EXPRESS (1-2 BUSINESS DAYS)</span>
                            <span className="text-[9px] bg-[#171717] text-[#F7F5F0] px-1.5 py-0.2 tracking-wider">FASTEST</span>
                          </span>
                          <span className="text-[10px] text-[#77736C] font-light">
                            Direct dispatch from European central atelier with signature requirement
                          </span>
                        </div>
                      </div>
                      <span className="text-xs font-semibold text-[#171717]">
                        {appliedDiscount?.code === 'FREESHIP' ? 'FREE' : formatPKR(250)}
                      </span>
                    </label>

                    <label
                      onClick={() => setShippingSpeed('concierge')}
                      className={`flex items-center justify-between p-3.5 border cursor-pointer transition-all ${
                        shippingSpeed === 'concierge'
                          ? 'border-[#171717] bg-white ring-1 ring-[#171717]'
                          : 'border-[#DEDAD2] bg-white/40 hover:bg-white'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="shipping"
                          checked={shippingSpeed === 'concierge'}
                          onChange={() => setShippingSpeed('concierge')}
                          className="accent-[#171717]"
                        />
                        <div>
                          <span className="text-xs uppercase font-medium text-[#171717] block">
                            WHITE-GLOVE ATELIER CONCIERGE (SAME-DAY / APPOINTMENT)
                          </span>
                          <span className="text-[10px] text-[#77736C] font-light">
                            Hand-delivered garment bag with hanger & personal fitting arrangement
                          </span>
                        </div>
                      </div>
                      <span className="text-xs font-semibold text-[#171717]">
                        {formatPKR(490)}
                      </span>
                    </label>
                  </div>
                </div>

                {/* Section 4: Payment Options */}
                <div>
                  <h3 className="text-xs tracking-[0.24em] uppercase font-semibold text-[#171717] mb-3">
                    4. PAYMENT METHOD
                  </h3>

                  {/* Payment Method Selector Pills */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('card')}
                      className={`py-2.5 px-3 border text-[11px] uppercase tracking-wider font-medium flex items-center justify-center gap-1.5 transition-all ${
                        paymentMethod === 'card'
                          ? 'border-[#171717] bg-[#171717] text-[#F7F5F0]'
                          : 'border-[#DEDAD2] bg-white text-[#171717] hover:border-[#171717]'
                      }`}
                    >
                      <CreditCard className="w-3.5 h-3.5" />
                      <span>CARD</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('cod')}
                      className={`py-2.5 px-3 border text-[11px] uppercase tracking-wider font-medium flex items-center justify-center gap-1.5 transition-all ${
                        paymentMethod === 'cod'
                          ? 'border-[#171717] bg-[#171717] text-[#F7F5F0]'
                          : 'border-[#DEDAD2] bg-white text-[#171717] hover:border-[#171717]'
                      }`}
                    >
                      <Truck className="w-3.5 h-3.5" />
                      <span>COD</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('klarna')}
                      className={`py-2.5 px-3 border text-[11px] uppercase tracking-wider font-medium flex items-center justify-center gap-1.5 transition-all ${
                        paymentMethod === 'klarna'
                          ? 'border-[#171717] bg-[#171717] text-[#F7F5F0]'
                          : 'border-[#DEDAD2] bg-white text-[#171717] hover:border-[#171717]'
                      }`}
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>KLARNA</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('wire')}
                      className={`py-2.5 px-3 border text-[11px] uppercase tracking-wider font-medium flex items-center justify-center gap-1.5 transition-all ${
                        paymentMethod === 'wire'
                          ? 'border-[#171717] bg-[#171717] text-[#F7F5F0]'
                          : 'border-[#DEDAD2] bg-white text-[#171717] hover:border-[#171717]'
                      }`}
                    >
                      <Lock className="w-3.5 h-3.5" />
                      <span>WIRE</span>
                    </button>
                  </div>

                  {/* Card Input Interface */}
                  {paymentMethod === 'card' && (
                    <div className="bg-white p-4 sm:p-5 border border-[#DEDAD2] space-y-4">
                      {/* Virtual Card Preview */}
                      <div className="w-full max-w-sm mx-auto bg-gradient-to-tr from-[#171717] via-[#232323] to-[#3a3a3a] text-white p-4 sm:p-5 rounded-lg shadow-lg relative overflow-hidden">
                        <div className="flex justify-between items-start mb-6">
                          <span className="text-[10px] tracking-[0.24em] font-light text-zinc-400 uppercase">
                            SAVAGE WEAR CLIENT CARD
                          </span>
                          <span className="text-xs font-bold tracking-widest text-zinc-300">
                            VISA / MC
                          </span>
                        </div>
                        <div className="text-sm sm:text-base font-mono tracking-[0.2em] mb-4 text-zinc-100">
                          {cardNumber || '•••• •••• •••• ••••'}
                        </div>
                        <div className="flex justify-between items-end text-[9px] uppercase tracking-wider text-zinc-400">
                          <div>
                            <span className="block text-[8px] text-zinc-500">CARDHOLDER</span>
                            <span className="font-medium text-white">{cardName || 'YOUR NAME'}</span>
                          </div>
                          <div>
                            <span className="block text-[8px] text-zinc-500">EXPIRES</span>
                            <span className="font-medium text-white">{cardExpiry || 'MM/YY'}</span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="text-[10px] tracking-wider uppercase text-[#77736C] block mb-1">
                          CARD NUMBER <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            required={paymentMethod === 'card'}
                            value={cardNumber}
                            onChange={handleCardNumberChange}
                            placeholder="4532 0000 0000 0000"
                            maxLength={19}
                            className="w-full px-3.5 py-2.5 bg-white border border-[#DEDAD2] focus:border-[#171717] text-xs text-[#171717] font-mono outline-none transition-colors"
                          />
                          <CreditCard className="w-4 h-4 absolute right-3 top-3 text-[#77736C]" />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-[10px] tracking-wider uppercase text-[#77736C] block mb-1">
                            CARDHOLDER NAME <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            required={paymentMethod === 'card'}
                            value={cardName}
                            onChange={(e) => setCardName(e.target.value)}
                            placeholder="NAME AS SHOWN ON CARD"
                            className="w-full px-3.5 py-2.5 bg-white border border-[#DEDAD2] focus:border-[#171717] text-xs text-[#171717] uppercase outline-none transition-colors"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="text-[10px] tracking-wider uppercase text-[#77736C] block mb-1">
                              EXPIRY <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              required={paymentMethod === 'card'}
                              value={cardExpiry}
                              onChange={handleExpiryChange}
                              placeholder="MM/YY"
                              maxLength={5}
                              className="w-full px-3.5 py-2.5 bg-white border border-[#DEDAD2] focus:border-[#171717] text-xs text-[#171717] outline-none transition-colors text-center"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] tracking-wider uppercase text-[#77736C] block mb-1">
                              CVV <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="password"
                              required={paymentMethod === 'card'}
                              value={cardCvv}
                              onChange={handleCvvChange}
                              placeholder="•••"
                              maxLength={4}
                              className="w-full px-3.5 py-2.5 bg-white border border-[#DEDAD2] focus:border-[#171717] text-xs text-[#171717] outline-none transition-colors text-center"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Cash On Delivery Interface */}
                  {paymentMethod === 'cod' && (
                    <div className="bg-white p-5 border border-[#DEDAD2] text-xs space-y-2">
                      <div className="flex items-center gap-2 text-emerald-700 font-medium">
                        <Check className="w-4 h-4" />
                        <span>DOORSTEP INSPECTION & VERIFICATION INCLUDED</span>
                      </div>
                      <p className="text-[#77736C] font-light leading-relaxed">
                        Pay in cash or with a contactless credit/debit card upon delivery. The courier provides a formal printed VAT invoice and receipt directly to your hand.
                      </p>
                    </div>
                  )}

                  {/* Klarna Interface */}
                  {paymentMethod === 'klarna' && (
                    <div className="bg-white p-5 border border-[#DEDAD2] text-xs space-y-3">
                      <span className="font-semibold tracking-wider text-[#171717] block">
                        SPLIT INTO 4 INTEREST-FREE PAYMENTS OF ${(totalAmount / 4).toFixed(2)}
                      </span>
                      <p className="text-[#77736C] font-light leading-relaxed">
                        No added interest. No upfront full payment. First installment charged when order ships, remaining 3 payments auto-deducted every 2 weeks.
                      </p>
                    </div>
                  )}

                  {/* Bank Wire Interface */}
                  {paymentMethod === 'wire' && (
                    <div className="bg-white p-5 border border-[#DEDAD2] text-xs space-y-2">
                      <span className="font-semibold text-[#171717] block">DIRECT ATELIER WIRE TRANSFER</span>
                      <p className="text-[#77736C] font-light">
                        Upon placing this order, unique Swift/IBAN routing credentials will be issued to your email. Garments are placed on 48-hour reserve pending wire confirmation.
                      </p>
                    </div>
                  )}
                </div>

                {/* Section 5: Billing Address Toggle */}
                <div className="pt-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={sameAsShipping}
                      onChange={(e) => setSameAsShipping(e.target.checked)}
                      className="w-3.5 h-3.5 accent-[#171717]"
                    />
                    <span className="text-xs text-[#171717] font-medium">
                      Billing address same as shipping address
                    </span>
                  </label>
                </div>

              </div>

              {/* RIGHT COLUMN: Order Summary & Placement (5 Cols) */}
              <div className="lg:col-span-5 p-5 sm:p-8 bg-[#ECEFF1]/50 flex flex-col justify-between">
                
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-[#DEDAD2] mb-4">
                    <h3 className="text-xs tracking-[0.24em] uppercase font-semibold text-[#171717]">
                      ORDER SUMMARY ({items.reduce((s, i) => s + i.quantity, 0)})
                    </h3>
                    <span className="text-xs font-semibold text-[#171717]">
                      {formatPKR(totalAmount)}
                    </span>
                  </div>

                  {/* Item List Thumbnails */}
                  <div className="space-y-3 max-h-64 overflow-y-auto pr-1 mb-6">
                    {items.map((item, idx) => {
                      const itemPkr = getProductPKRPrice(item.product);
                      return (
                        <div key={idx} className="flex gap-3 bg-white p-2.5 border border-[#DEDAD2]">
                          <div className="w-16 h-20 bg-[#ECEFF1] overflow-hidden flex-shrink-0 relative">
                            <img
                              src={item.product.primaryImage}
                              alt={item.product.name}
                              className="w-full h-full object-cover"
                            />
                            <span className="absolute bottom-0 right-0 bg-[#171717] text-white text-[9px] px-1.5 py-0.5">
                              ×{item.quantity}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0 flex flex-col justify-between">
                            <div>
                              <h4 className="text-xs font-medium text-[#171717] uppercase truncate">
                                {item.product.name}
                              </h4>
                              <span className="text-[10px] text-[#77736C] uppercase tracking-wider block">
                                Size: {item.selectedSize} // {item.selectedColor}
                              </span>
                            </div>
                            <span className="text-xs font-semibold text-[#171717]">
                              {formatPKR(itemPkr * item.quantity)}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Promotional Code Form */}
                  <div className="mb-6 pt-4 border-t border-[#DEDAD2]">
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <Tag className="w-3.5 h-3.5 absolute left-3 top-3 text-[#77736C]" />
                        <input
                          type="text"
                          value={promoCodeInput}
                          onChange={(e) => setPromoCodeInput(e.target.value)}
                          placeholder="PROMO OR GIFT CODE (e.g. SAVAGE10)"
                          className="w-full pl-9 pr-3 py-2.5 bg-white border border-[#DEDAD2] focus:border-[#171717] text-xs uppercase tracking-wider text-[#171717] outline-none"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={handleApplyPromo}
                        className="px-4 py-2.5 bg-[#171717] text-[#F7F5F0] hover:bg-black text-xs font-medium tracking-wider uppercase transition-colors"
                      >
                        APPLY
                      </button>
                    </div>

                    {promoSuccess && (
                      <p className="text-[11px] text-emerald-700 font-medium mt-1.5 flex items-center gap-1">
                        <Check className="w-3 h-3" />
                        {promoSuccess}
                      </p>
                    )}
                    {promoError && (
                      <p className="text-[11px] text-red-600 font-medium mt-1.5">
                        {promoError}
                      </p>
                    )}
                  </div>

                  {/* Calculation Breakdown */}
                  <div className="space-y-2 text-xs border-t border-[#DEDAD2] pt-4 mb-6">
                    <div className="flex justify-between text-[#77736C]">
                      <span>Bag Subtotal</span>
                      <span className="text-[#171717] font-medium">{formatPKR(subtotal)}</span>
                    </div>

                    {appliedDiscount && (
                      <div className="flex justify-between text-emerald-700 font-medium">
                        <span>Discount ({appliedDiscount.code})</span>
                        <span>-{formatPKR(discountAmount)}</span>
                      </div>
                    )}

                    <div className="flex justify-between text-[#77736C]">
                      <span>Shipping ({shippingSpeed.toUpperCase()})</span>
                      <span className="text-[#171717] font-medium">
                        {shippingCost === 0 ? 'FREE' : formatPKR(shippingCost)}
                      </span>
                    </div>

                    <div className="flex justify-between text-base font-semibold text-[#171717] pt-3 border-t border-[#DEDAD2]">
                      <span>Total Amount</span>
                      <span>{formatPKR(totalAmount)}</span>
                    </div>
                  </div>
                </div>

                {/* Final Order Placement Button & Assurances */}
                <div>
                  <button
                    type="submit"
                    className="w-full py-4 bg-[#171717] text-[#F7F5F0] hover:bg-black active:bg-black text-xs uppercase tracking-[0.28em] font-medium flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-xl cursor-pointer"
                  >
                    <Lock className="w-3.5 h-3.5 stroke-[2]" />
                    <span>AUTHORIZE & PLACE ORDER — {formatPKR(totalAmount)}</span>
                  </button>

                  <div className="mt-4 pt-4 border-t border-[#DEDAD2] space-y-2 text-[10px] text-[#77736C] font-light">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                      <span>30-Day Compliant Worldwide Returns with prepaid labels</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Truck className="w-3.5 h-3.5 text-[#171717] flex-shrink-0" />
                      <span>Insured DHL Express tracking link generated immediately</span>
                    </div>
                  </div>
                </div>

              </div>

            </div>
          </form>
        )}

      </div>
    </div>
  );
};
