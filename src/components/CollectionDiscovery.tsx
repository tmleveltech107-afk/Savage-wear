import React from 'react';
import { Category } from '../types';

interface CollectionDiscoveryProps {
  onSelectCategory: (category: Category) => void;
}

interface CollectionItem {
  id: string;
  title: string;
  category: Category;
  image: string;
  alt: string;
}

const COLLECTIONS: CollectionItem[] = [
  {
    id: 'tracksuits',
    title: 'TRACKSUITS',
    category: 'COLLECTIONS',
    image: '/assets/savage_mens_tracksuit_1789641827775.jpg',
    alt: 'Savage Wear Luxury Tracksuits Collection',
  },
  {
    id: 'men',
    title: 'MEN',
    category: 'MEN',
    image: '/assets/savage_mens_look_1789543668563.jpg',
    alt: 'Savage Wear Menswear Streetwear Collection',
  },
  {
    id: 'women',
    title: 'WOMEN',
    category: 'WOMEN',
    image: '/assets/savage_womens_tracksuit_1789641847135.jpg',
    alt: 'Savage Wear Womenswear Collection',
  },
  {
    id: 'new-arrivals',
    title: 'NEW ARRIVALS',
    category: 'NEW ARRIVALS',
    image: '/assets/savage_white_tee_denim_1789546627787.jpg',
    alt: 'Savage Wear New Arrivals Season Drop',
  },
  {
    id: 'best-sellers',
    title: 'BEST SELLERS',
    category: 'BESTSELLERS',
    image: '/assets/savage_hoodie_studio_1789546713458.jpg',
    alt: 'Savage Wear Best Sellers Signature Garments',
  },
  {
    id: 'sale',
    title: 'SALE',
    category: 'SALE',
    image: '/assets/savage_barrel_jeans_1789546640614.jpg',
    alt: 'Savage Wear Archive & Sale Pieces',
  },
];

export const CollectionDiscovery: React.FC<CollectionDiscoveryProps> = ({
  onSelectCategory,
}) => {
  const handleClick = (category: Category) => {
    onSelectCategory(category);
    const catalogEl = document.getElementById('catalog-section');
    if (catalogEl) {
      catalogEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section
      id="collection-discovery"
      aria-label="Savage Wear Collections Discovery"
      className="w-full bg-[#F7F5F0] py-14 sm:py-20 lg:py-24"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-10">
        {/* Horizontal Category Grid / Mobile Scrollable Carousel */}
        <div className="flex lg:grid lg:grid-cols-6 gap-3.5 sm:gap-4 md:gap-5 overflow-x-auto lg:overflow-visible pb-4 lg:pb-0 snap-x snap-mandatory scrollbar-none -mx-4 px-4 sm:-mx-8 sm:px-8 lg:mx-0 lg:px-0">
          {COLLECTIONS.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => handleClick(item.category)}
              className="group relative flex-shrink-0 w-[68vw] min-[420px]:w-[52vw] sm:w-[42vw] md:w-[30vw] lg:w-auto aspect-[3/4] overflow-hidden rounded-none cursor-pointer snap-start text-left select-none focus:outline-none focus-visible:ring-1 focus-visible:ring-[#171717]"
              aria-label={`Explore ${item.title} collection`}
            >
              {/* Card Background Photography with Gentle Subtle Zoom on Hover */}
              <img
                src={item.image}
                alt={item.alt}
                referrerPolicy="no-referrer"
                className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
              />

              {/* Subtle Refined Vignette/Overlay for High Text Legibility */}
              <div
                className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/30 to-black/35 transition-colors duration-500 group-hover:bg-black/45"
                aria-hidden="true"
              />

              {/* Centered Category Typography */}
              <div className="relative z-10 w-full h-full flex flex-col items-center justify-center p-4">
                <span className="text-white text-xs sm:text-[13px] lg:text-[12px] xl:text-xs tracking-[0.22em] sm:tracking-[0.26em] uppercase font-medium text-center transition-all duration-300 drop-shadow-sm group-hover:tracking-[0.3em]">
                  {item.title}
                </span>

                {/* Subtle Centered Underline Accent */}
                <span
                  className="mt-2.5 h-[1.5px] bg-white/80 transition-all duration-300 w-4 group-hover:w-8 group-hover:bg-white"
                  aria-hidden="true"
                />
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};
