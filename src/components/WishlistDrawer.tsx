import React from 'react';
import { X, Trash2, ShoppingBag } from 'lucide-react';
import { Product } from '../types';
import { formatPKR, getProductPKRPrice } from '../utils/currency';

interface WishlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: Product[];
  onRemove: (productId: string) => void;
  onMoveToBag: (product: Product) => void;
}

export const WishlistDrawer: React.FC<WishlistDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onRemove,
  onMoveToBag,
}) => {
  if (!isOpen) return null;

  return (
    <div
      id="wishlist-drawer"
      className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm flex justify-end"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-[#F7F5F0] text-[#171717] h-full flex flex-col justify-between shadow-2xl relative border-l border-[#DEDAD2]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-[#DEDAD2] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-xs tracking-[0.24em] uppercase font-medium text-[#171717]">
              SAVED PIECES
            </h2>
            <span className="text-xs text-[#77736C]">({items.length})</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close wishlist drawer"
            className="p-1 text-[#171717] hover:opacity-60 transition-opacity"
          >
            <X className="w-5 h-5 stroke-[1.5]" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-16">
              <p className="text-xs tracking-[0.2em] uppercase text-[#77736C] mb-4">
                NO SAVED PIECES YET
              </p>
              <button
                type="button"
                onClick={onClose}
                className="text-[11px] tracking-[0.24em] uppercase text-[#171717] underline underline-offset-4 hover:opacity-75"
              >
                EXPLORE CATALOGUE
              </button>
            </div>
          ) : (
            items.map((product) => (
              <div key={product.id} className="flex gap-4 pb-6 border-b border-[#DEDAD2] last:border-b-0">
                <div className="w-20 h-24 bg-[#ECEFF1] flex-shrink-0 overflow-hidden">
                  <img
                    src={product.primaryImage}
                    alt={product.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-xs tracking-[0.1em] uppercase font-normal text-[#171717]">
                        {product.name}
                      </h4>
                      <button
                        type="button"
                        onClick={() => onRemove(product.id)}
                        className="text-[#77736C] hover:text-[#171717] p-0.5"
                        aria-label="Remove from wishlist"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <span className="text-xs tracking-wider font-bold text-[#171717] mt-1 block">
                      {formatPKR(getProductPKRPrice(product))}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      onMoveToBag(product);
                      onRemove(product.id);
                    }}
                    className="flex items-center justify-center gap-1.5 w-full py-2 bg-[#171717] text-[#F7F5F0] text-[10px] tracking-[0.2em] uppercase font-medium hover:bg-black transition-colors mt-2"
                  >
                    <ShoppingBag className="w-3 h-3" />
                    <span>MOVE TO BAG</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
