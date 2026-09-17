import React, { useState } from 'react';
import { X, Heart, ShoppingBag, Check, ShieldCheck, Truck, RotateCcw } from 'lucide-react';
import { Product } from '../types';
import { formatPKR, getProductPKRPrice } from '../utils/currency';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToBag: (product: Product, size: string, color: string) => void;
  onToggleWishlist: (product: Product) => void;
  isWishlisted: boolean;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onAddToBag,
  onToggleWishlist,
  isWishlisted,
}) => {
  if (!product) return null;

  const [activeImage, setActiveImage] = useState<'primary' | 'secondary'>('primary');
  const [selectedColor, setSelectedColor] = useState(product.colors[0]?.name || '');
  const [selectedSize, setSelectedSize] = useState(product.sizes[0] || 'M');
  const [addedNotice, setAddedNotice] = useState(false);

  const handleAdd = () => {
    onAddToBag(product, selectedSize, selectedColor);
    setAddedNotice(true);
    setTimeout(() => setAddedNotice(false), 2000);
  };

  return (
    <div
      id="product-detail-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10 bg-black/70 backdrop-blur-sm overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-5xl bg-[#F7F5F0] text-[#171717] shadow-2xl border border-[#DEDAD2] overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          type="button"
          aria-label="Close product details"
          className="absolute top-4 right-4 z-30 p-2 text-[#171717] hover:opacity-60 transition-opacity bg-[#F7F5F0]/80 rounded-full"
        >
          <X className="w-5 h-5 stroke-[1.5]" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Product Photography Section */}
          <div className="relative bg-[#ECEFF1] aspect-[3/4] md:aspect-auto md:h-full flex flex-col justify-between">
            <div className="relative w-full h-full min-h-[380px] md:min-h-[520px]">
              <img
                src={activeImage === 'primary' ? product.primaryImage : product.secondaryImage}
                alt={product.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center transition-all duration-500"
              />
            </div>

            {/* Thumbnail switcher */}
            <div className="absolute bottom-4 left-4 flex gap-2 z-20">
              <button
                type="button"
                onClick={() => setActiveImage('primary')}
                className={`w-12 h-16 border overflow-hidden transition-all ${
                  activeImage === 'primary' ? 'border-[#171717] ring-1 ring-[#171717]' : 'border-white/60 opacity-70'
                }`}
              >
                <img
                  src={product.primaryImage}
                  alt="Front perspective"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </button>
              <button
                type="button"
                onClick={() => setActiveImage('secondary')}
                className={`w-12 h-16 border overflow-hidden transition-all ${
                  activeImage === 'secondary' ? 'border-[#171717] ring-1 ring-[#171717]' : 'border-white/60 opacity-70'
                }`}
              >
                <img
                  src={product.secondaryImage}
                  alt="Detail perspective"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </button>
            </div>
          </div>

          {/* Product Specification & Purchasing Details */}
          <div className="p-6 sm:p-10 flex flex-col justify-between overflow-y-auto max-h-[85vh]">
            <div>
              {/* Category & Title */}
              <div className="flex items-center justify-between gap-4 mb-2">
                <span className="text-[10px] tracking-[0.28em] uppercase text-[#77736C] font-medium">
                  {product.category} // {product.gender}
                </span>
                <button
                  type="button"
                  onClick={() => onToggleWishlist(product)}
                  className="flex items-center gap-1 text-[11px] tracking-wider uppercase text-[#77736C] hover:text-[#171717]"
                >
                  <Heart
                    className={`w-4 h-4 stroke-[1.5] ${
                      isWishlisted ? 'fill-[#171717] text-[#171717]' : ''
                    }`}
                  />
                  <span>{isWishlisted ? 'SAVED' : 'SAVE'}</span>
                </button>
              </div>

              <h2 className="text-xl sm:text-2xl font-light tracking-[0.14em] uppercase text-[#171717] mb-2">
                {product.name}
              </h2>

              <div className="flex items-center gap-3 mb-6">
                <span className="text-lg font-bold text-[#171717] tracking-tight">
                  {formatPKR(getProductPKRPrice(product))}
                </span>
                <span className="text-[10px] tracking-widest text-[#77736C] uppercase pl-2">
                  TAX INCLUDED
                </span>
              </div>

              <p className="text-xs text-[#77736C] leading-relaxed mb-6 font-light">
                {product.description}
              </p>

              {/* Color Selection */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] tracking-[0.24em] uppercase text-[#77736C]">
                    COLOR: <strong className="text-[#171717] font-medium">{selectedColor}</strong>
                  </span>
                </div>
                <div className="flex items-center gap-2.5">
                  {product.colors.map((color) => (
                    <button
                      key={color.name}
                      type="button"
                      onClick={() => setSelectedColor(color.name)}
                      className={`w-6 h-6 rounded-full border transition-all ${
                        selectedColor === color.name
                          ? 'ring-2 ring-[#171717] ring-offset-2 scale-105'
                          : 'border-[#DEDAD2]'
                      }`}
                      style={{ backgroundColor: color.hex }}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>

              {/* Size Selection */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] tracking-[0.24em] uppercase text-[#77736C]">
                    SELECT SIZE
                  </span>
                  <span className="text-[10px] tracking-[0.18em] uppercase text-[#77736C] font-light underline cursor-pointer">
                    SIZE GUIDE
                  </span>
                </div>
                <div className="grid grid-cols-5 gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setSelectedSize(size)}
                      className={`py-2.5 text-xs tracking-wider uppercase font-medium border transition-all ${
                        selectedSize === size
                          ? 'bg-[#171717] text-[#F7F5F0] border-[#171717]'
                          : 'border-[#DEDAD2] text-[#171717] hover:border-[#171717]'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Add to Bag Action */}
              <button
                type="button"
                onClick={handleAdd}
                className="w-full py-4 bg-[#171717] text-[#F7F5F0] hover:bg-black transition-colors flex items-center justify-center gap-2 text-xs tracking-[0.28em] uppercase font-medium mb-6"
              >
                {addedNotice ? (
                  <>
                    <Check className="w-4 h-4 stroke-[2]" />
                    <span>ADDED TO BAG</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4 stroke-[1.5]" />
                    <span>ADD TO BAG — ${product.price}</span>
                  </>
                )}
              </button>

              {/* Craftsmanship Specifications Accordion / List */}
              <div className="border-t border-[#DEDAD2] pt-4 space-y-3">
                <div>
                  <h4 className="text-[10px] tracking-[0.24em] uppercase font-medium text-[#171717] mb-1">
                    FABRIC & COMPOSITION
                  </h4>
                  <p className="text-[11px] text-[#77736C] font-light">{product.fabric}</p>
                </div>

                <div>
                  <h4 className="text-[10px] tracking-[0.24em] uppercase font-medium text-[#171717] mb-1">
                    FIT & TAILORING
                  </h4>
                  <p className="text-[11px] text-[#77736C] font-light">{product.fit}</p>
                </div>

                <div>
                  <h4 className="text-[10px] tracking-[0.24em] uppercase font-medium text-[#171717] mb-1">
                    PRODUCT HIGHLIGHTS
                  </h4>
                  <ul className="list-disc list-inside text-[11px] text-[#77736C] font-light space-y-0.5">
                    {product.details.map((d, i) => (
                      <li key={i}>{d}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Assurance Badges */}
            <div className="grid grid-cols-3 gap-2 pt-6 mt-6 border-t border-[#DEDAD2] text-center">
              <div className="flex flex-col items-center">
                <Truck className="w-4 h-4 stroke-[1.5] text-[#77736C] mb-1" />
                <span className="text-[9px] tracking-[0.14em] uppercase text-[#77736C]">
                  COMPLIMENTARY SHIPPING
                </span>
              </div>
              <div className="flex flex-col items-center">
                <RotateCcw className="w-4 h-4 stroke-[1.5] text-[#77736C] mb-1" />
                <span className="text-[9px] tracking-[0.14em] uppercase text-[#77736C]">
                  30-DAY CONCIERGE RETURN
                </span>
              </div>
              <div className="flex flex-col items-center">
                <ShieldCheck className="w-4 h-4 stroke-[1.5] text-[#77736C] mb-1" />
                <span className="text-[9px] tracking-[0.14em] uppercase text-[#77736C]">
                  AUTHENTICATED CRAFT
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
