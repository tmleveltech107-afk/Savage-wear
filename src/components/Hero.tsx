import React, { useState, useEffect } from 'react';
import { Category } from '../types';

interface HeroProps {
  onShopCategory?: (category: Category) => void;
}

interface Slide {
  src: string;
  alt: string;
}

const HERO_SLIDES: Slide[] = [
  {
    src: './assets/savage_campaign_hero_1789543640722.jpg',
    alt: 'SAVAGE WEAR SS26 Collection',
  },
  {
    src: './assets/savage_mens_tracksuit_1789641827775.jpg',
    alt: 'SAVAGE WEAR Men Tracksuit Editorial',
  },
  {
    src: './assets/savage_womens_tracksuit_1789641847135.jpg',
    alt: 'SAVAGE WEAR Women Tracksuit Editorial',
  },
];

export const Hero: React.FC<HeroProps> = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 4500);

    return () => clearInterval(timer);
  }, []);

  return (
    <section
      id="campaign-hero"
      aria-label="Campaign Hero Slideshow"
      className="relative w-full aspect-[1376/768] sm:aspect-auto sm:h-[82vh] lg:h-[86vh] sm:min-h-[420px] max-h-[900px] bg-[#171717] overflow-hidden"
    >
      {/* High-fashion Campaign Editorial Slideshow */}
      {HERO_SLIDES.map((slide, index) => {
        const isActive = index === currentIndex;
        return (
          <div
            key={slide.src}
            className={`absolute inset-0 select-none transition-opacity duration-1000 ease-in-out ${
              isActive ? 'opacity-100 z-10 pointer-events-auto' : 'opacity-0 z-0 pointer-events-none'
            }`}
            aria-hidden={!isActive}
          >
            <img
              src={slide.src}
              alt={slide.alt}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center sm:object-top"
            />
          </div>
        );
      })}
    </section>
  );
};
