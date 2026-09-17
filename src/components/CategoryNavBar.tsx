import React from 'react';
import { Category } from '../types';

interface CategoryNavBarProps {
  activeCategory: Category;
  onSelectCategory: (category: Category) => void;
}

export const CategoryNavBar: React.FC<CategoryNavBarProps> = ({
  activeCategory,
  onSelectCategory,
}) => {
  const items: { label: string; category: Category }[] = [
    { label: 'MEN', category: 'MEN' },
    { label: 'WOMEN', category: 'WOMEN' },
    { label: 'JUNIORS', category: 'JUNIORS' },
  ];

  return (
    <nav
      id="fashion-category-bar"
      aria-label="Fashion category navigation"
      className="w-full bg-[#DC381F] select-none"
    >
      <div className="w-full max-w-7xl mx-auto">
        <div className="grid grid-cols-3 w-full items-center text-center">
          {items.map((item) => {
            const isActive = activeCategory === item.category;

            return (
              <button
                key={item.category}
                id={`cat-nav-${item.label.toLowerCase()}`}
                type="button"
                onClick={() => onSelectCategory(item.category)}
                className="group relative w-full h-10 sm:h-11 md:h-12 flex items-center justify-center text-center cursor-pointer"
              >
                <span
                  className={`relative inline-flex flex-col items-center justify-center text-white text-[11px] min-[360px]:text-[12px] sm:text-[13px] md:text-sm tracking-[0.12em] min-[360px]:tracking-[0.16em] sm:tracking-[0.2em] leading-none whitespace-nowrap transition-all duration-200 ${
                    isActive
                      ? 'font-bold opacity-100'
                      : 'font-normal sm:font-medium opacity-85 group-hover:opacity-100'
                  }`}
                >
                  <span>{item.label}</span>

                  {/* Subtle underline on hover & active state */}
                  <span
                    className={`block h-[1.5px] bg-white transition-all duration-200 mt-1.5 ${
                      isActive
                        ? 'w-5 min-[360px]:w-6 sm:w-8 opacity-100'
                        : 'w-0 group-hover:w-4 min-[360px]:group-hover:w-5 sm:group-hover:w-6 opacity-0 group-hover:opacity-80'
                    }`}
                    aria-hidden="true"
                  />
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
