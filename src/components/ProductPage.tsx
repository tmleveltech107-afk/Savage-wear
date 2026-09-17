import React, { useState } from 'react';
import {
  ArrowLeft,
  Heart,
  ShoppingBag,
  Check,
  Star,
  ShieldCheck,
  Truck,
  RotateCcw,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  X,
  Zap,
  Info,
  Ruler,
} from 'lucide-react';
import { Product, Review } from '../types';
import { GLOBAL_REVIEWS } from '../data/reviews';
import { formatPKR, formatInstallmentRs, getProductPKRPrice } from '../utils/currency';

interface ProductPageProps {
  product: Product;
  onBack: () => void;
  onAddToBag: (product: Product, size: string, color: string) => void;
  onExpressCheckout?: (product: Product, size: string, color: string) => void;
  onToggleWishlist: (product: Product) => void;
  isWishlisted: boolean;
}

export const ProductPage: React.FC<ProductPageProps> = ({
  product,
  onBack,
  onAddToBag,
  onExpressCheckout,
  onToggleWishlist,
  isWishlisted,
}) => {
  const [selectedColor, setSelectedColor] = useState(product.colors[0]?.name || '');
  const [selectedSize, setSelectedSize] = useState(product.sizes[0] || 'M');
  const [addedNotice, setAddedNotice] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isZoomModalOpen, setIsZoomModalOpen] = useState(false);
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [sizeUnit, setSizeUnit] = useState<'cm' | 'in'>('in');

  // Filter reviews for this product or fallback to relevant global reviews
  const productReviews: Review[] =
    product.reviews && product.reviews.length > 0
      ? product.reviews
      : GLOBAL_REVIEWS.filter(
          (r) => r.productName?.toLowerCase() === product.name.toLowerCase()
        ).length > 0
      ? GLOBAL_REVIEWS.filter(
          (r) => r.productName?.toLowerCase() === product.name.toLowerCase()
        )
      : GLOBAL_REVIEWS.slice(0, 3);

  const gallery =
    product.galleryImages && product.galleryImages.length > 0
      ? product.galleryImages
      : [product.primaryImage, product.secondaryImage];

  const rating = product.rating || 4.9;
  const reviewsCount = product.reviewsCount || 48;

  const handleAdd = () => {
    onAddToBag(product, selectedSize, selectedColor);
    setAddedNotice(true);
    setTimeout(() => setAddedNotice(false), 2200);
  };

  const handleBuyNow = () => {
    if (onExpressCheckout) {
      onExpressCheckout(product, selectedSize, selectedColor);
    } else {
      handleAdd();
    }
  };

  const handleNextImage = () => {
    setActiveImageIndex((prev) => (prev + 1) % gallery.length);
  };

  const handlePrevImage = () => {
    setActiveImageIndex((prev) => (prev - 1 + gallery.length) % gallery.length);
  };

  return (
    <div id="product-detail-page" className="w-full bg-[#F7F5F0] text-[#171717] min-h-screen pt-2 sm:pt-4 pb-28">
      {/* Top Breadcrumb Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 py-3 sm:py-4 mb-2 flex items-center justify-between border-b border-[#DEDAD2]">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-2 text-xs tracking-[0.24em] uppercase text-[#77736C] hover:text-[#171717] transition-colors group min-h-[44px]"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>BACK TO COLLECTION</span>
        </button>

        <div className="flex items-center gap-3">
          <span className="text-[10px] tracking-[0.3em] uppercase text-[#77736C] hidden sm:inline-block">
            FLAGSHIP STUDIO // {product.category}
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse hidden sm:inline-block" />
        </div>
      </div>

      {/* Main Layout: Fixed Sticky Product Image on Left + Scrollable Moving Content on Right */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 pt-4 sm:pt-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start">
          
          {/* =========================================================================
              LEFT COLUMN: FIXED / STICKY PRODUCT IMAGE SHOWCASE
              Keeps image firmly pinned on screen while user scrolls through the rich details!
             ========================================================================= */}
          <div className="lg:col-span-7 lg:sticky lg:top-24 z-20 self-start">
            <div className="flex flex-col gap-3">
              
              {/* Featured High-Resolution Image Viewport */}
              <div className="w-full bg-[#ECEFF1] aspect-[3/4] max-h-[calc(100vh-12rem)] overflow-hidden relative shadow-sm border border-[#DEDAD2] group">
                <img
                  src={gallery[activeImageIndex] || product.primaryImage}
                  alt={`${product.name} active perspective`}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center cursor-zoom-in transition-transform duration-500 hover:scale-105"
                  onClick={() => setIsZoomModalOpen(true)}
                />

                {/* Floating Angle Tag */}
                <div className="absolute top-3 left-3 bg-[#171717]/80 backdrop-blur-md px-3 py-1 text-[9px] tracking-widest text-[#F7F5F0] uppercase flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-white" />
                  <span>PERSPECTIVE 0{activeImageIndex + 1} / 0{gallery.length}</span>
                </div>

                {/* Zoom / Fullscreen Button */}
                <button
                  type="button"
                  onClick={() => setIsZoomModalOpen(true)}
                  className="absolute top-3 right-3 p-2 bg-white/80 hover:bg-white text-[#171717] border border-[#DEDAD2] transition-all opacity-80 hover:opacity-100 shadow-sm"
                  title="Enlarge high-resolution photograph"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                </button>

                {/* Arrow Navigators */}
                {gallery.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePrevImage();
                      }}
                      className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-white/70 hover:bg-white text-[#171717] transition-all opacity-0 group-hover:opacity-100 shadow-sm border border-[#DEDAD2]"
                      aria-label="Previous image"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleNextImage();
                      }}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-white/70 hover:bg-white text-[#171717] transition-all opacity-0 group-hover:opacity-100 shadow-sm border border-[#DEDAD2]"
                      aria-label="Next image"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </>
                )}

                {/* Bottom Studio Spec label */}
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between gap-1 pointer-events-none overflow-hidden">
                  <span className="text-[8px] min-[360px]:text-[9px] tracking-[0.12em] min-[360px]:tracking-[0.2em] uppercase bg-white/70 backdrop-blur-sm text-[#171717] px-1.5 min-[360px]:px-2 py-0.5 border border-[#DEDAD2]/50 truncate">
                    CYCLORAMA STUDIO ARCHIVE
                  </span>
                  <span className="text-[8px] min-[360px]:text-[9px] tracking-wider text-[#77736C] bg-white/70 backdrop-blur-sm px-1.5 min-[360px]:px-2 py-0.5 border border-[#DEDAD2]/50 flex-shrink-0">
                    CLICK TO EXPAND
                  </span>
                </div>
              </div>

              {/* Horizontal Thumbnail Strip directly beneath the fixed image */}
              <div className="grid grid-cols-4 gap-2 sm:gap-2.5">
                {gallery.map((imgUrl, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveImageIndex(idx)}
                    className={`aspect-[3/4] bg-[#ECEFF1] border overflow-hidden transition-all relative ${
                      activeImageIndex === idx
                        ? 'border-[#171717] ring-2 ring-[#171717] opacity-100 scale-[1.02]'
                        : 'border-[#DEDAD2] opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={imgUrl}
                      alt={`${product.name} thumbnail 0${idx + 1}`}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute bottom-1 right-1 text-[8px] bg-black/60 text-white px-1 py-0.2">
                      0{idx + 1}
                    </span>
                  </button>
                ))}
              </div>

              {/* Mini Status reassurance under image */}
              <div className="flex flex-wrap sm:flex-nowrap items-center justify-between gap-1 text-[9px] min-[360px]:text-[10px] tracking-wider text-[#77736C] pt-1 uppercase font-light">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#171717]" />
                  <span>AUTHENTICATED RUNWAY GARMENT</span>
                </span>
                <span>MILAN // PARIS // TOKYO</span>
              </div>

            </div>
          </div>

          {/* =========================================================================
              RIGHT COLUMN: SCROLLABLE MOVING CONTENT
              Users can scroll through details, reviews, fit guides, and fabric specs!
             ========================================================================= */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            
            {/* Primary Product Card Box */}
            <div className="bg-[#F7F5F0] border border-[#DEDAD2] p-5 sm:p-7 shadow-sm">
              
              {/* Category & Wishlist */}
              <div className="flex items-center justify-between gap-4 mb-2">
                <span className="text-[10px] tracking-[0.3em] uppercase text-[#77736C] font-semibold">
                  {product.category} // {product.gender.toUpperCase()}
                </span>
                <button
                  type="button"
                  onClick={() => onToggleWishlist(product)}
                  className="flex items-center gap-1.5 text-xs tracking-wider uppercase text-[#77736C] hover:text-[#171717] transition-colors min-h-[36px]"
                >
                  <Heart
                    className={`w-4 h-4 stroke-[1.5] ${
                      isWishlisted ? 'fill-[#171717] text-[#171717]' : ''
                    }`}
                  />
                  <span>{isWishlisted ? 'SAVED' : 'SAVE TO WISHLIST'}</span>
                </button>
              </div>

              {/* Title & Subtitle */}
              <h1 className="text-xl sm:text-2xl font-light tracking-[0.14em] uppercase text-[#171717] mb-1.5 leading-tight">
                {product.name}
              </h1>

              <p className="text-[10px] sm:text-[11px] tracking-[0.2em] uppercase text-[#77736C] font-light mb-4">
                {product.subtitle}
              </p>

              {/* Price & Rating Bar */}
              <div className="pb-4 border-b border-[#DEDAD2] mb-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <span className="text-xl sm:text-2xl font-bold tracking-tight text-[#171717]">
                      {formatPKR(getProductPKRPrice(product))}
                    </span>
                    <span className="text-[9px] tracking-widest text-[#77736C] uppercase pl-1 font-light">
                      TAX INCLUDED
                    </span>
                  </div>

                  {/* Rating Link (Scrolls to reviews) */}
                  <a
                    href="#product-reviews"
                    className="flex items-center gap-1.5 text-[#171717] hover:underline transition-all cursor-pointer"
                  >
                    <div className="flex text-amber-500">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                      ))}
                    </div>
                    <span className="text-xs font-medium tracking-wider">
                      {rating}
                    </span>
                    <span className="text-[10px] text-[#77736C] font-light">
                      ({reviewsCount})
                    </span>
                  </a>
                </div>

                {/* Baadmay installment indicator on product page */}
                <div className="flex items-center gap-2 mt-2 pt-2 border-t border-dashed border-[#DEDAD2] text-xs text-neutral-800">
                  <span className="bg-[#6B21A8] text-white text-[10px] font-bold px-2 py-0.5 rounded tracking-tight">
                    baadmay
                  </span>
                  <span className="text-xs text-[#171717]">
                    Pay in 3 Installments of <strong className="text-[#6B21A8] font-bold">{formatInstallmentRs(getProductPKRPrice(product), 3)}</strong>
                  </span>
                </div>
              </div>

              {/* Colorway Selection */}
              <div className="mb-5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] tracking-[0.26em] uppercase text-[#77736C]">
                    COLORWAY: <strong className="text-[#171717] font-semibold">{selectedColor}</strong>
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  {product.colors.map((color) => (
                    <button
                      key={color.name}
                      type="button"
                      onClick={() => setSelectedColor(color.name)}
                      className={`w-7 h-7 rounded-full border transition-all ${
                        selectedColor === color.name
                          ? 'ring-2 ring-[#171717] ring-offset-2 scale-105'
                          : 'border-[#DEDAD2] hover:scale-105'
                      }`}
                      style={{ backgroundColor: color.hex }}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>

              {/* Size Selector */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] tracking-[0.26em] uppercase text-[#77736C]">
                    SIZE
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowSizeGuide(!showSizeGuide)}
                    className="text-[10px] tracking-[0.2em] uppercase text-[#77736C] underline cursor-pointer hover:text-[#171717] flex items-center gap-1"
                  >
                    <Ruler className="w-3 h-3" />
                    <span>{showSizeGuide ? 'HIDE MEASUREMENTS' : 'SIZE GUIDE'}</span>
                  </button>
                </div>

                <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setSelectedSize(size)}
                      className={`py-2.5 min-h-[44px] text-xs tracking-wider uppercase font-medium border transition-all flex items-center justify-center ${
                        selectedSize === size
                          ? 'bg-[#171717] text-[#F7F5F0] border-[#171717]'
                          : 'border-[#DEDAD2] text-[#171717] hover:border-[#171717] bg-white/40'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>

                {/* Interactive Size Guide Table Dropdown */}
                {showSizeGuide && (
                  <div className="mt-3 p-3.5 bg-white border border-[#DEDAD2] text-xs space-y-2">
                    <div className="flex items-center justify-between pb-2 border-b border-[#DEDAD2]">
                      <span className="text-[10px] font-semibold tracking-wider uppercase">
                        FIT MEASUREMENT CHART ({sizeUnit.toUpperCase()})
                      </span>
                      <div className="flex gap-1">
                        <button
                          type="button"
                          onClick={() => setSizeUnit('in')}
                          className={`px-2 py-0.5 text-[10px] uppercase ${
                            sizeUnit === 'in' ? 'bg-[#171717] text-white' : 'bg-gray-100'
                          }`}
                        >
                          IN
                        </button>
                        <button
                          type="button"
                          onClick={() => setSizeUnit('cm')}
                          className={`px-2 py-0.5 text-[10px] uppercase ${
                            sizeUnit === 'cm' ? 'bg-[#171717] text-white' : 'bg-gray-100'
                          }`}
                        >
                          CM
                        </button>
                      </div>
                    </div>
                    <table className="w-full text-left text-[11px]">
                      <thead>
                        <tr className="border-b border-[#DEDAD2] text-[#77736C]">
                          <th className="py-1">Size</th>
                          <th className="py-1">Chest / Waist</th>
                          <th className="py-1">Length / Inseam</th>
                          <th className="py-1">Shoulder</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#DEDAD2]/50">
                        <tr>
                          <td className="py-1 font-semibold">S</td>
                          <td>{sizeUnit === 'in' ? '42"' : '107 cm'}</td>
                          <td>{sizeUnit === 'in' ? '28.5"' : '72 cm'}</td>
                          <td>{sizeUnit === 'in' ? '21"' : '53 cm'}</td>
                        </tr>
                        <tr className="bg-zinc-50">
                          <td className="py-1 font-semibold">M</td>
                          <td>{sizeUnit === 'in' ? '44"' : '112 cm'}</td>
                          <td>{sizeUnit === 'in' ? '29.5"' : '75 cm'}</td>
                          <td>{sizeUnit === 'in' ? '22"' : '56 cm'}</td>
                        </tr>
                        <tr>
                          <td className="py-1 font-semibold">L</td>
                          <td>{sizeUnit === 'in' ? '46"' : '117 cm'}</td>
                          <td>{sizeUnit === 'in' ? '30.5"' : '77 cm'}</td>
                          <td>{sizeUnit === 'in' ? '23"' : '58 cm'}</td>
                        </tr>
                        <tr className="bg-zinc-50">
                          <td className="py-1 font-semibold">XL</td>
                          <td>{sizeUnit === 'in' ? '48"' : '122 cm'}</td>
                          <td>{sizeUnit === 'in' ? '31.5"' : '80 cm'}</td>
                          <td>{sizeUnit === 'in' ? '24"' : '61 cm'}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Low Stock Indicator */}
              <div className="flex items-center gap-2 mb-4 text-[10px] text-amber-700 bg-amber-50 px-3 py-1.5 border border-amber-200">
                <Info className="w-3.5 h-3.5 flex-shrink-0" />
                <span>LIMITED RUN // ONLY 4 UNITS AVAILABLE IN SIZE {selectedSize}</span>
              </div>

              {/* DUAL ACTION BUTTONS: ADD TO BAG & PROFESSIONAL 1-CLICK CHECKOUT */}
              <div className="space-y-2.5 mb-6">
                {/* 1. Add to Bag */}
                <button
                  id="product-page-add-to-bag"
                  type="button"
                  onClick={handleAdd}
                  className="w-full py-3.5 min-h-[46px] bg-[#171717] text-[#F7F5F0] hover:bg-black active:bg-black transition-all duration-300 flex items-center justify-center gap-2 text-xs tracking-[0.26em] uppercase font-medium shadow-md"
                >
                  {addedNotice ? (
                    <>
                      <Check className="w-4 h-4 stroke-[2]" />
                      <span>ADDED TO SHOPPING BAG</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4 stroke-[1.5]" />
                      <span>ADD TO BAG — ${product.price}</span>
                    </>
                  )}
                </button>

                {/* 2. Express Checkout / Buy Now */}
                <button
                  id="product-page-buy-now"
                  type="button"
                  onClick={handleBuyNow}
                  className="w-full py-3.5 min-h-[46px] bg-white text-[#171717] border-2 border-[#171717] hover:bg-[#171717] hover:text-[#F7F5F0] transition-all duration-300 flex items-center justify-center gap-2 text-xs tracking-[0.26em] uppercase font-semibold shadow-sm"
                >
                  <Zap className="w-4 h-4 fill-current" />
                  <span>BUY NOW // EXPRESS CHECKOUT</span>
                </button>
              </div>

              {/* Concierge Assurances */}
              <div className="grid grid-cols-3 gap-2 pt-5 border-t border-[#DEDAD2] text-center">
                <div className="flex flex-col items-center">
                  <Truck className="w-4 h-4 stroke-[1.5] text-[#171717] mb-1" />
                  <span className="text-[8.5px] tracking-[0.14em] uppercase text-[#77736C]">
                    COMPLIMENTARY SHIPPING
                  </span>
                </div>
                <div className="flex flex-col items-center">
                  <RotateCcw className="w-4 h-4 stroke-[1.5] text-[#171717] mb-1" />
                  <span className="text-[8.5px] tracking-[0.14em] uppercase text-[#77736C]">
                    30-DAY CONCIERGE RETURN
                  </span>
                </div>
                <div className="flex flex-col items-center">
                  <ShieldCheck className="w-4 h-4 stroke-[1.5] text-[#171717] mb-1" />
                  <span className="text-[8.5px] tracking-[0.14em] uppercase text-[#77736C]">
                    AUTHENTICATED RUNWAY
                  </span>
                </div>
              </div>

            </div>

            {/* Scrollable Story & Technical Craft Specifications */}
            <div className="bg-white border border-[#DEDAD2] p-5 sm:p-7 shadow-sm space-y-5">
              
              <div>
                <h3 className="text-[10px] tracking-[0.26em] uppercase font-semibold text-[#171717] mb-2 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#171717]" />
                  <span>DESCRIPTION & SILHOUETTE</span>
                </h3>
                <p className="text-xs text-[#77736C] leading-relaxed font-light">
                  {product.description}
                </p>
              </div>

              <div className="pt-4 border-t border-[#DEDAD2]">
                <span className="text-[10px] tracking-[0.26em] uppercase font-semibold text-[#171717] block mb-1">
                  FABRICATION & TEXTILE WEAVE
                </span>
                <p className="text-xs text-[#77736C] font-light leading-relaxed">
                  {product.fabric}
                </p>
              </div>

              <div className="pt-4 border-t border-[#DEDAD2]">
                <span className="text-[10px] tracking-[0.26em] uppercase font-semibold text-[#171717] block mb-1">
                  FIT & POSTURE SPECIFICATIONS
                </span>
                <p className="text-xs text-[#77736C] font-light leading-relaxed">
                  {product.fit}
                </p>
              </div>

              <div className="pt-4 border-t border-[#DEDAD2]">
                <span className="text-[10px] tracking-[0.26em] uppercase font-semibold text-[#171717] block mb-2">
                  ATELIER CONSTRUCTION DETAILS
                </span>
                <ul className="list-disc list-inside text-xs text-[#77736C] font-light space-y-1.5">
                  {product.details.map((d, i) => (
                    <li key={i}>{d}</li>
                  ))}
                </ul>
              </div>

              <div className="pt-4 border-t border-[#DEDAD2]">
                <span className="text-[10px] tracking-[0.26em] uppercase font-semibold text-[#171717] block mb-1">
                  GARMENT PRESERVATION & CARE
                </span>
                <p className="text-xs text-[#77736C] font-light leading-relaxed">
                  Machine wash cold with similar colors inside out. Do not tumble dry. Hang in shade. Iron low avoiding embroidered hardware.
                </p>
              </div>

            </div>

            {/* Editorial Drape / Craftsmanship Callout Photos */}
            <div className="bg-white border border-[#DEDAD2] p-5 sm:p-7 shadow-sm">
              <span className="text-[10px] tracking-[0.26em] uppercase font-semibold text-[#171717] block mb-3">
                DETAIL MACRO & CRAFT PERSPECTIVES
              </span>
              <div className="grid grid-cols-2 gap-3">
                <div className="aspect-[4/5] bg-[#ECEFF1] border border-[#DEDAD2] overflow-hidden">
                  <img
                    src={product.secondaryImage}
                    alt="Craftsmanship macro"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="aspect-[4/5] bg-[#ECEFF1] border border-[#DEDAD2] overflow-hidden">
                  <img
                    src={gallery[gallery.length - 1] || product.primaryImage}
                    alt="Drape profile"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* =========================================================================
            BOTTOM SECTION: CUSTOMER REVIEWS & CLIENT GALLERY
           ========================================================================= */}
        <div id="product-reviews" className="mt-14 sm:mt-20 pt-12 sm:pt-16 border-t border-[#DEDAD2]">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-10 gap-4">
            <div>
              <span className="text-[10px] tracking-[0.34em] uppercase text-[#77736C] block mb-2">
                VERIFIED CLIENT EXPERIENCES
              </span>
              <h2 className="text-xl sm:text-3xl font-light tracking-[0.18em] uppercase text-[#171717]">
                REVIEWS & CLIENT GALLERY
              </h2>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-white px-4 py-2 border border-[#DEDAD2]">
                <div className="flex text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                  ))}
                </div>
                <span className="text-xs font-semibold tracking-wider text-[#171717]">
                  {rating} / 5.0
                </span>
                <span className="text-[10px] text-[#77736C]">
                  ({reviewsCount} Reviews)
                </span>
              </div>
            </div>
          </div>

          {/* Client Reviews Grid with Images */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {productReviews.map((rev) => (
              <div
                key={rev.id}
                className="bg-white border border-[#DEDAD2] p-5 sm:p-6 flex flex-col justify-between hover:border-[#171717] transition-all duration-300"
              >
                <div>
                  {/* Review image if present */}
                  {rev.reviewImage && (
                    <div className="w-full aspect-[4/3] bg-[#ECEFF1] mb-4 overflow-hidden border border-[#DEDAD2]">
                      <img
                        src={rev.reviewImage}
                        alt={`Review fit by ${rev.author}`}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  )}

                  {/* Rating Stars */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex text-amber-500">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-amber-500 text-amber-500" />
                      ))}
                    </div>
                    <span className="text-[10px] tracking-wider text-[#77736C]">
                      {rev.date}
                    </span>
                  </div>

                  {/* Fit Feedback badge */}
                  {rev.fitFeedback && (
                    <span className="inline-block text-[9px] tracking-[0.16em] uppercase px-2 py-0.5 bg-[#F7F5F0] border border-[#DEDAD2] text-[#171717] mb-3">
                      FIT: {rev.fitFeedback}
                    </span>
                  )}

                  {/* Comment */}
                  <p className="text-xs text-[#171717] leading-relaxed font-light mb-4">
                    "{rev.comment}"
                  </p>
                </div>

                {/* Author footer */}
                <div className="pt-3 border-t border-[#DEDAD2] flex items-center justify-between">
                  <div>
                    <span className="text-xs tracking-wider uppercase font-medium text-[#171717] block">
                      {rev.author}
                    </span>
                    <span className="text-[10px] text-[#77736C] font-light">
                      {rev.location}
                    </span>
                  </div>
                  {rev.verified && (
                    <span className="text-[9px] tracking-widest uppercase text-emerald-700 bg-emerald-50 px-2 py-0.5 border border-emerald-200">
                      VERIFIED CLIENT
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* MOBILE STICKY BOTTOM QUICK-BUY BAR */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 bg-[#F7F5F0]/95 backdrop-blur-md border-t border-[#DEDAD2] px-4 py-3 z-30 flex items-center justify-between gap-3 shadow-lg">
        <div>
          <span className="text-[10px] text-[#77736C] uppercase tracking-wider block">
            {selectedSize} / {selectedColor}
          </span>
          <span className="text-sm font-semibold tracking-wider text-[#171717]">
            ${product.price}
          </span>
        </div>
        
        <div className="flex items-center gap-2 flex-1 max-w-[280px]">
          <button
            type="button"
            onClick={handleAdd}
            className="flex-1 py-3 bg-[#171717] text-[#F7F5F0] text-[10px] tracking-[0.2em] uppercase font-medium flex items-center justify-center gap-1 shadow"
          >
            {addedNotice ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>ADDED</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>BAG</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleBuyNow}
            className="flex-1 py-3 bg-white border border-[#171717] text-[#171717] text-[10px] tracking-[0.2em] uppercase font-semibold flex items-center justify-center gap-1 shadow-sm"
          >
            <Zap className="w-3 h-3 fill-current" />
            <span>BUY NOW</span>
          </button>
        </div>
      </div>

      {/* FULLSCREEN / ZOOM LIGHTBOX MODAL */}
      {isZoomModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setIsZoomModalOpen(false)}
        >
          <div
            className="relative max-w-4xl max-h-[90vh] w-full flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setIsZoomModalOpen(false)}
              className="absolute -top-12 right-0 p-2 text-white/80 hover:text-white"
              aria-label="Close zoom modal"
            >
              <X className="w-6 h-6" />
            </button>
            <img
              src={gallery[activeImageIndex] || product.primaryImage}
              alt={product.name}
              className="max-h-[82vh] w-auto object-contain border border-white/20 shadow-2xl"
            />
            <div className="flex items-center gap-4 mt-4 text-white/80 text-xs tracking-widest uppercase">
              <button
                type="button"
                onClick={handlePrevImage}
                className="p-1 hover:text-white"
              >
                PREV
              </button>
              <span>ANGLE 0{activeImageIndex + 1} / 0{gallery.length}</span>
              <button
                type="button"
                onClick={handleNextImage}
                className="p-1 hover:text-white"
              >
                NEXT
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
