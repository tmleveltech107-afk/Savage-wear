import React, { useState, useMemo } from 'react';
import { Search, X, ArrowRight } from 'lucide-react';
import { Product } from '../types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onSelectProduct: (product: Product) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  products,
  onSelectProduct,
}) => {
  const [query, setQuery] = useState('');

  const quickTerms = ['HOODIE', 'CARGO', 'BOMBER', 'IVORY', '480 GSM', 'WOMEN', 'MEN'];

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.fabric.toLowerCase().includes(q) ||
        p.colors.some((c) => c.name.toLowerCase().includes(q))
    );
  }, [products, query]);

  if (!isOpen) return null;

  return (
    <div
      id="search-modal"
      className="fixed inset-0 z-50 bg-[#F7F5F0]/98 text-[#171717] flex flex-col p-4 sm:p-12 overflow-y-auto animate-fadeIn"
    >
      <div className="max-w-4xl mx-auto w-full flex-1 flex flex-col">
        {/* Top bar with close */}
        <div className="flex justify-end mb-6 sm:mb-8">
          <button
            type="button"
            onClick={onClose}
            aria-label="Close search"
            className="flex items-center gap-2 text-xs tracking-[0.2em] uppercase text-[#77736C] hover:text-[#171717] transition-colors py-2 min-h-[44px]"
          >
            <span>CLOSE</span>
            <X className="w-5 h-5 stroke-[1.5]" />
          </button>
        </div>

        {/* Large Understated Search Input */}
        <div className="border-b border-[#171717] pb-3 sm:pb-4 mb-6 sm:mb-8 flex items-center gap-3 sm:gap-4">
          <Search className="w-5 h-5 sm:w-6 sm:h-6 stroke-[1.5] text-[#171717] flex-shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="SEARCH GARMENTS, SILHOUETTES..."
            className="w-full bg-transparent text-base sm:text-2xl font-light tracking-[0.12em] uppercase text-[#171717] placeholder:text-[#77736C]/60 placeholder:text-xs sm:placeholder:text-lg focus:outline-none"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="text-xs text-[#77736C] hover:text-[#171717] uppercase tracking-widest"
            >
              CLEAR
            </button>
          )}
        </div>

        {/* Quick Suggestion Tags */}
        {!query && (
          <div className="mb-12">
            <span className="text-[10px] tracking-[0.3em] uppercase text-[#77736C] block mb-3 font-normal">
              POPULAR SEARCHES
            </span>
            <div className="flex flex-wrap gap-2">
              {quickTerms.map((term) => (
                <button
                  key={term}
                  type="button"
                  onClick={() => setQuery(term)}
                  className="text-xs tracking-[0.2em] uppercase px-3.5 py-1.5 border border-[#DEDAD2] text-[#77736C] hover:text-[#171717] hover:border-[#171717] transition-colors"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Search Results */}
        {query && (
          <div className="flex-1">
            <span className="text-[10px] tracking-[0.3em] uppercase text-[#77736C] block mb-6">
              RESULTS ({results.length})
            </span>

            {results.length === 0 ? (
              <p className="text-sm tracking-widest text-[#77736C] uppercase font-light">
                No matching garments found for "{query}".
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {results.map((product) => (
                  <div
                    key={product.id}
                    onClick={() => {
                      onSelectProduct(product);
                      onClose();
                    }}
                    className="group flex gap-4 items-center p-3 bg-white/40 hover:bg-white border border-transparent hover:border-[#DEDAD2] cursor-pointer transition-all"
                  >
                    <div className="w-16 h-20 bg-[#ECEFF1] overflow-hidden flex-shrink-0">
                      <img
                        src={product.primaryImage}
                        alt={product.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs tracking-wider uppercase font-medium text-[#171717] truncate">
                        {product.name}
                      </h4>
                      <p className="text-[10px] text-[#77736C] uppercase tracking-wider font-light mt-0.5">
                        {product.subtitle}
                      </p>
                      <span className="text-xs font-semibold text-[#171717] mt-1 block">
                        ${product.price}
                      </span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-[#77736C] group-hover:text-[#171717] group-hover:translate-x-1 transition-all flex-shrink-0" />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
