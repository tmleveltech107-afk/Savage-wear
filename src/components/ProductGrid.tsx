import React, { useMemo } from 'react';
import { ProductCard } from './ProductCard';
import { Product, Category } from '../types';

interface ProductGridProps {
  products: Product[];
  activeCategory: Category;
  onSelectCategory: (category: Category) => void;
  onQuickView: (product: Product) => void;
  onAddToBag: (product: Product, size: string, color: string) => void;
  onToggleWishlist: (product: Product) => void;
  wishlistIds: string[];
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  activeCategory,
  onSelectCategory,
  onQuickView,
  onAddToBag,
  onToggleWishlist,
  wishlistIds,
}) => {
  const filteredProducts = useMemo(() => {
    let list = products;

    if (activeCategory === 'NEW ARRIVALS') {
      list = list.filter((p) => p.isNew || p.category === 'NEW ARRIVALS');
    } else if (activeCategory === 'BESTSELLERS') {
      list = list.filter((p) => p.isBestseller || p.category === 'BESTSELLERS');
    } else if (activeCategory === 'MEN') {
      list = list.filter((p) => p.gender === 'men' || p.gender === 'unisex');
    } else if (activeCategory === 'WOMEN') {
      list = list.filter((p) => p.gender === 'women' || p.gender === 'unisex');
    } else if (activeCategory === 'JUNIORS') {
      list = list.filter((p) => p.gender === 'juniors' || p.category === 'JUNIORS');
    } else if (activeCategory === 'COLLECTIONS') {
      list = list.filter((p) => p.category === 'COLLECTIONS');
    } else if (activeCategory === 'SALE') {
      list = list.filter((p) => p.originalPrice !== undefined || p.category === 'SALE');
    }

    return list;
  }, [products, activeCategory]);

  return (
    <section id="catalog-section" className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-10 pt-6 sm:pt-8 lg:pt-10 pb-14 sm:pb-24 lg:pb-28 overflow-hidden">
      {/* Product Grid - 2 columns on mobile, 3 on tablet/laptop, 4 on desktop */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-sm tracking-widest text-[#77736C] uppercase">No garments found in this category.</p>
          <button
            type="button"
            onClick={() => onSelectCategory('ALL')}
            className="mt-4 text-xs tracking-[0.2em] text-[#171717] underline uppercase cursor-pointer"
          >
            VIEW ALL PIECES
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-3.5 sm:gap-x-8 gap-y-10 sm:gap-y-16">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onQuickView={onQuickView}
              onAddToBag={onAddToBag}
              onToggleWishlist={onToggleWishlist}
              isWishlisted={wishlistIds.includes(product.id)}
            />
          ))}
        </div>
      )}
    </section>
  );
};
