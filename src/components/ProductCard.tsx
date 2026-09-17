import React, { useState } from 'react';
import { Heart, Plus, Star } from 'lucide-react';
import { Product } from '../types';
import { formatPKR, getProductPKRPrice } from '../utils/currency';

interface ProductCardProps {
  product: Product;
  onQuickView: (product: Product) => void;
  onAddToBag: (product: Product, size: string, color: string) => void;
  onToggleWishlist: (product: Product) => void;
  isWishlisted: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onQuickView,
  onAddToBag,
  onToggleWishlist,
  isWishlisted,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [selectedColor, setSelectedColor] = useState(product.colors[0]?.name || '');
  const [selectedSize, setSelectedSize] = useState(product.sizes[0] || 'M');

  return (
    <div
      id={`product-card-${product.id}`}
      className="group relative flex flex-col transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Large Product Photography Container */}
      <div
        onClick={() => onQuickView(product)}
        className="relative aspect-[3/4] w-full overflow-hidden bg-[#ECEFF1] cursor-pointer"
      >
        {/* Primary Image */}
        <img
          src={product.primaryImage}
          alt={product.name}
          referrerPolicy="no-referrer"
          className={`h-full w-full object-cover object-center transition-all duration-700 ease-out ${
            isHovered ? 'scale-105 opacity-0' : 'scale-100 opacity-100'
          }`}
        />

        {/* Secondary Angle on Hover */}
        <img
          src={product.secondaryImage}
          alt={`${product.name} alternative perspective`}
          referrerPolicy="no-referrer"
          className={`absolute inset-0 h-full w-full object-cover object-center transition-all duration-700 ease-out ${
            isHovered ? 'scale-105 opacity-100' : 'scale-100 opacity-0 pointer-events-none'
          }`}
        />

        {/* Subtle Tag (New / Sale) */}
        <div className="absolute top-3 left-3 flex flex-col gap-1 z-10 pointer-events-none">
          {product.isNew && (
            <span className="text-[9px] tracking-[0.2em] uppercase font-medium bg-[#171717] text-[#F7F5F0] px-2 py-0.5">
              NEW
            </span>
          )}
          {product.originalPrice && (
            <span className="text-[9px] tracking-[0.2em] uppercase font-medium bg-[#77736C] text-[#F7F5F0] px-2 py-0.5">
              SALE
            </span>
          )}
        </div>

        {/* Subtle Wishlist Icon */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist(product);
          }}
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          className="absolute top-3 right-3 z-20 p-2 rounded-full bg-white/70 hover:bg-white text-[#171717] transition-colors shadow-sm"
        >
          <Heart
            className={`w-3.5 h-3.5 stroke-[1.5] transition-transform duration-300 ${
              isWishlisted ? 'fill-[#171717] text-[#171717] scale-110' : 'text-[#171717] hover:scale-110'
            }`}
          />
        </button>

        {/* Quick Add Overlay on Desktop Hover */}
        <div
          onClick={(e) => e.stopPropagation()}
          className={`absolute inset-x-0 bottom-0 px-1.5 sm:px-3 py-2 sm:py-3 bg-gradient-to-t from-black/60 to-transparent transition-all duration-300 flex items-center justify-between gap-1 sm:gap-2 z-20 ${
            isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'
          }`}
        >
          {/* Quick Size Select */}
          <div className="flex items-center gap-0.5 sm:gap-1 bg-[#F7F5F0]/90 backdrop-blur-sm p-0.5 sm:p-1 rounded-sm flex-shrink-0">
            {product.sizes.slice(0, 4).map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => setSelectedSize(size)}
                className={`text-[8.5px] min-[360px]:text-[9px] px-1 min-[360px]:px-1.5 py-0.5 font-medium transition-colors ${
                  selectedSize === size
                    ? 'bg-[#171717] text-[#F7F5F0]'
                    : 'text-[#171717] hover:bg-black/10'
                }`}
              >
                {size}
              </button>
            ))}
          </div>

          {/* Quick Add Button */}
          <button
            type="button"
            onClick={() => onAddToBag(product, selectedSize, selectedColor)}
            className="flex items-center gap-0.5 sm:gap-1 text-[9px] min-[360px]:text-[10px] tracking-[0.08em] sm:tracking-[0.16em] uppercase font-medium bg-[#171717] text-[#F7F5F0] hover:bg-black px-2 min-[360px]:px-2.5 sm:px-3 py-1 sm:py-1.5 transition-colors flex-shrink-0 whitespace-nowrap"
          >
            <Plus className="w-2.5 h-2.5 sm:w-3 sm:h-3 stroke-[2] flex-shrink-0" />
            <span className="whitespace-nowrap">ADD</span>
          </button>
        </div>
      </div>

      {/* Product Metadata / Information */}
      <div className="pt-3 pb-2 flex flex-col">
        {/* Color swatches */}
        {product.colors.length > 1 && (
          <div className="flex items-center gap-1.5 mb-1.5">
            {product.colors.map((color) => (
              <button
                key={color.name}
                type="button"
                onClick={() => setSelectedColor(color.name)}
                title={color.name}
                className={`w-2.5 h-2.5 rounded-full border transition-transform ${
                  selectedColor === color.name
                    ? 'ring-1 ring-[#171717] ring-offset-1 scale-110'
                    : 'border-[#DEDAD2]'
                }`}
                style={{ backgroundColor: color.hex }}
              />
            ))}
            <span className="text-[10px] text-[#77736C] font-light pl-1 tracking-wider">
              {product.colors.length} colors
            </span>
          </div>
        )}

        <div className="flex flex-col min-[390px]:flex-row min-[390px]:items-baseline justify-between gap-0.5 min-[390px]:gap-2">
          <h3
            onClick={() => onQuickView(product)}
            className="text-xs sm:text-[13px] tracking-[0.08em] sm:tracking-[0.1em] font-normal uppercase text-[#171717] hover:opacity-75 transition-opacity cursor-pointer truncate"
          >
            {product.name}
          </h3>

          <div className="flex items-center gap-1.5 flex-shrink-0">
            <span className="text-xs sm:text-[13px] font-bold text-[#171717] tracking-tight">
              {formatPKR(getProductPKRPrice(product))}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between text-[10px] text-[#77736C] font-light tracking-wide uppercase mt-0.5">
          <span className="truncate pr-2">{product.subtitle}</span>
          <span className="flex items-center gap-1 text-[#171717] flex-shrink-0 font-medium">
            <Star className="w-2.5 h-2.5 fill-amber-500 text-amber-500" />
            <span>{product.rating || '4.9'}</span>
          </span>
        </div>
      </div>
    </div>
  );
};
