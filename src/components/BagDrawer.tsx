import React from 'react';
import { X, Trash2, Bell } from 'lucide-react';
import { CartItem, Product } from '../types';
import { PRODUCTS } from '../data/products';
import { formatPKR, formatInstallmentRs, getProductPKRPrice } from '../utils/currency';

interface BagDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (index: number, quantity: number) => void;
  onRemoveItem: (index: number) => void;
  onClearBag: () => void;
  visitorName: string;
  onProceedToCheckout: () => void;
  onSelectProduct?: (product: Product) => void;
  onQuickAdd?: (product: Product, size: string, color: string) => void;
}

export const BagDrawer: React.FC<BagDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout,
  onSelectProduct,
  onQuickAdd,
}) => {
  if (!isOpen) return null;

  // Calculate total in PKR
  const totalPKR = items.reduce((acc, item) => {
    const itemPrice = getProductPKRPrice(item.product);
    return acc + itemPrice * item.quantity;
  }, 0);

  const handleCheckoutClick = () => {
    onClose();
    onProceedToCheckout();
  };

  // Recommended products for "YOU MAY ALSO LIKE"
  const currentItemIds = new Set(items.map((i) => i.product.id));
  const recommendations = PRODUCTS.filter((p) => !currentItemIds.has(p.id)).slice(0, 3);

  return (
    <div
      id="added-to-basket-drawer"
      className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm flex justify-end transition-opacity duration-300"
      onClick={onClose}
    >
      <div
        className="w-full max-w-[430px] bg-white text-black h-full flex flex-col justify-between shadow-2xl relative border-l border-neutral-200 animate-in slide-in-from-right duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header matching user screenshot */}
        <div className="px-6 py-5 flex items-center justify-between border-b border-neutral-100 bg-white">
          <h2 className="text-sm font-bold tracking-[0.16em] uppercase text-black">
            ADDED TO YOUR BASKET
          </h2>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close basket"
            className="p-1 text-black hover:opacity-60 transition-opacity cursor-pointer"
          >
            <X className="w-5 h-5 stroke-[1.5]" />
          </button>
        </div>

        {/* Scrollable Main Area */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="h-48 flex flex-col items-center justify-center text-center py-10">
              <span className="text-xs tracking-[0.2em] uppercase text-neutral-500 mb-2">
                YOUR BASKET IS CURRENTLY EMPTY
              </span>
              <p className="text-xs text-neutral-400 font-light max-w-xs mb-4">
                Explore our catalog to add items to your shopping basket.
              </p>
              <button
                type="button"
                onClick={onClose}
                className="py-2.5 px-5 border border-black text-xs tracking-wider uppercase font-medium hover:bg-black hover:text-white transition-colors"
              >
                CONTINUE BROWSING
              </button>
            </div>
          ) : (
            <div>
              {/* Product items list */}
              <div className="space-y-4">
                {items.map((item, index) => {
                  const pkrPrice = getProductPKRPrice(item.product);
                  const seasonTag = item.product.season || 'SS-26';

                  return (
                    <div
                      key={`${item.product.id}-${item.selectedSize}-${item.selectedColor}-${index}`}
                      className="pb-4 border-b border-neutral-200"
                    >
                      <div className="flex gap-4">
                        {/* Square/Portrait Thumbnail on Light Gray Studio Background */}
                        <div className="w-20 h-24 sm:w-22 sm:h-28 bg-[#ECEFF1] shrink-0 overflow-hidden flex items-center justify-center">
                          <img
                            src={item.product.primaryImage}
                            alt={item.product.name}
                            className="w-full h-full object-cover object-top"
                          />
                        </div>

                        {/* Details */}
                        <div className="flex-1 flex flex-col justify-between py-0.5">
                          <div>
                            {/* Product Name & Trash Icon */}
                            <div className="flex items-start justify-between gap-2">
                              <h3 className="text-sm font-bold text-black leading-snug">
                                {item.product.name}
                              </h3>
                              <button
                                type="button"
                                onClick={() => onRemoveItem(index)}
                                className="text-black hover:opacity-50 transition-opacity p-0.5"
                                aria-label="Remove item"
                              >
                                <Trash2 className="w-4 h-4 stroke-[1.5]" />
                              </button>
                            </div>

                            {/* Color / Size / Season tag */}
                            <p className="text-xs text-neutral-500 mt-1 font-normal">
                              {item.selectedColor} / {item.selectedSize} / {seasonTag}
                            </p>
                          </div>

                          {/* Quantity & Price */}
                          <div className="flex items-baseline justify-between pt-3">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-semibold text-black">
                                {item.quantity}x
                              </span>
                              <div className="inline-flex items-center border border-neutral-200 rounded text-[11px] overflow-hidden">
                                <button
                                  type="button"
                                  onClick={() => onUpdateQuantity(index, item.quantity - 1)}
                                  className="px-1.5 py-0.5 hover:bg-neutral-100 text-neutral-700"
                                  aria-label="Decrease quantity"
                                >
                                  -
                                </button>
                                <button
                                  type="button"
                                  onClick={() => onUpdateQuantity(index, item.quantity + 1)}
                                  className="px-1.5 py-0.5 hover:bg-neutral-100 text-neutral-700"
                                  aria-label="Increase quantity"
                                >
                                  +
                                </button>
                              </div>
                            </div>

                            <span className="text-sm sm:text-base font-bold text-black">
                              {formatPKR(pkrPrice * item.quantity)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Total & Installments */}
              <div className="mt-4">
                <div className="flex items-baseline justify-end gap-2 text-black">
                  <span className="text-sm font-bold">Total:</span>
                  <span className="text-sm sm:text-base font-bold text-black">
                    {formatPKR(totalPKR)}
                  </span>
                </div>

                {/* baadmay installment promo */}
                <div className="flex items-center justify-end gap-1.5 mt-2 text-xs text-neutral-800">
                  <span className="bg-[#6B21A8] text-white text-[10px] font-bold px-2 py-0.5 rounded tracking-tight">
                    baadmay
                  </span>
                  <span>
                    Pay in 3 Installments of{' '}
                    <strong className="text-[#6B21A8] font-bold">
                      {formatInstallmentRs(totalPKR, 3)}
                    </strong>
                  </span>
                </div>

                {/* Delivery disclaimer */}
                <p className="text-[9.5px] sm:text-[10px] tracking-wide text-neutral-500 uppercase text-center mt-4 mb-4 font-light">
                  *ALL ORDERS MAY TAKE UPTO 5 to 7 WORKING DAYS TO BE DELIVERED TO YOUR DOORSTEP
                </p>

                {/* Main Action Buttons */}
                <button
                  type="button"
                  onClick={handleCheckoutClick}
                  className="w-full py-3.5 bg-black text-white hover:bg-neutral-800 transition-colors text-center text-sm font-semibold tracking-wide cursor-pointer shadow-sm"
                >
                  Check out
                </button>

                <button
                  type="button"
                  onClick={onClose}
                  className="w-full py-3 bg-white text-black border border-black hover:bg-neutral-50 transition-colors text-center text-xs tracking-wider uppercase font-semibold mt-2 cursor-pointer"
                >
                  VIEW SHOPPING BASKET
                </button>
              </div>
            </div>
          )}

          {/* "YOU MAY ALSO LIKE" Section */}
          {recommendations.length > 0 && (
            <div className="mt-8 pt-6 border-t border-neutral-200">
              <h4 className="text-xs font-semibold tracking-[0.2em] uppercase text-black text-center mb-4">
                YOU MAY ALSO LIKE
              </h4>

              <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
                {recommendations.map((rec) => {
                  const recPkrPrice = getProductPKRPrice(rec);
                  return (
                    <div
                      key={rec.id}
                      className="group cursor-pointer flex flex-col"
                      onClick={() => {
                        if (onSelectProduct) {
                          onClose();
                          onSelectProduct(rec);
                        }
                      }}
                    >
                      <div className="aspect-[3/4] bg-[#ECEFF1] overflow-hidden relative border border-neutral-100">
                        <img
                          src={rec.primaryImage}
                          alt={rec.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        {onQuickAdd && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onQuickAdd(rec, rec.sizes[0] || 'M', rec.colors[0]?.name || 'Standard');
                            }}
                            className="absolute bottom-1 right-1 bg-black text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow opacity-90 hover:opacity-100 transition-opacity"
                            title="Quick Add"
                          >
                            + ADD
                          </button>
                        )}
                      </div>
                      <span className="text-[11px] font-medium text-black mt-1.5 line-clamp-1">
                        {rec.name}
                      </span>
                      <span className="text-[10px] font-bold text-neutral-800">
                        {formatPKR(recPkrPrice)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Floating Dark Notification Bell widget seen in user screenshot */}
        <div className="fixed bottom-6 right-6 z-50 pointer-events-auto">
          <button
            type="button"
            onClick={() => {
              // Quick helper notification or tooltip
            }}
            className="w-12 h-12 rounded-2xl bg-[#1e293b] text-white shadow-2xl flex items-center justify-center hover:bg-slate-800 hover:scale-105 transition-all cursor-pointer border border-slate-700/50"
            aria-label="Order updates and notifications"
            title="Order Updates & Delivery Tracking"
          >
            <Bell className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
};
