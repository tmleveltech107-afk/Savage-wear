import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Star,
  ShieldCheck,
  Camera,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Pause,
  Play,
  Maximize2,
  X,
} from 'lucide-react';
import { GLOBAL_REVIEWS } from '../data/reviews';
import { Review } from '../types';

export const ReviewsSection: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<string>('ALL');
  const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(true);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedPhoto, setSelectedPhoto] = useState<Review | null>(null);

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const categories = ['ALL', 'TEES & TOPS', 'DENIM', 'POLOS'];

  const filteredReviews = GLOBAL_REVIEWS.filter((rev) => {
    if (activeFilter === 'ALL') return true;
    if (activeFilter === 'TEES & TOPS')
      return (
        rev.productName?.toLowerCase().includes('tee') ||
        rev.productName?.toLowerCase().includes('top')
      );
    if (activeFilter === 'DENIM')
      return rev.productName?.toLowerCase().includes('denim') || rev.productName?.toLowerCase().includes('jeans');
    if (activeFilter === 'POLOS')
      return rev.productName?.toLowerCase().includes('polo') || rev.productName?.toLowerCase().includes('jersey');
    return true;
  });

  // Track scroll position to update active index indicator
  const handleScroll = () => {
    if (!scrollContainerRef.current) return;
    const { scrollLeft } = scrollContainerRef.current;
    const cardWidth = 285; // card width + gap
    const index = Math.round(scrollLeft / cardWidth);
    setCurrentIndex(Math.min(index, filteredReviews.length - 1));
  };

  const scroll = useCallback((direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return;
    const cardWidth = 295;
    scrollContainerRef.current.scrollBy({
      left: direction === 'left' ? -cardWidth : cardWidth,
      behavior: 'smooth',
    });
  }, []);

  const scrollToIndex = (index: number) => {
    if (!scrollContainerRef.current) return;
    const cardWidth = 295;
    scrollContainerRef.current.scrollTo({
      left: index * cardWidth,
      behavior: 'smooth',
    });
    setCurrentIndex(index);
  };

  // Auto-play carousel gently
  useEffect(() => {
    if (!isAutoPlaying || filteredReviews.length <= 1) return;

    const interval = setInterval(() => {
      if (!scrollContainerRef.current) return;
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      const cardWidth = 295;

      if (scrollLeft + clientWidth >= scrollWidth - 20) {
        scrollContainerRef.current.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        scrollContainerRef.current.scrollBy({ left: cardWidth, behavior: 'smooth' });
      }
    }, 4500);

    return () => clearInterval(interval);
  }, [isAutoPlaying, filteredReviews.length]);

  return (
    <section
      id="reviews-section"
      className="py-12 sm:py-16 bg-[#F7F5F0] border-t border-[#DEDAD2] relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12">
        {/* Curved Header Banner Container */}
        <div className="bg-white/80 backdrop-blur-sm border border-[#E5E2DA] rounded-2xl sm:rounded-3xl p-4 min-[360px]:p-5 sm:p-7 mb-6 shadow-[0_4px_24px_rgba(0,0,0,0.02)]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 min-[360px]:px-3 py-1 rounded-full bg-[#F3F0E8] border border-[#E2DDD3] text-[#77736C] text-[9px] min-[360px]:text-[10px] tracking-[0.14em] min-[360px]:tracking-[0.24em] uppercase font-semibold mb-2">
                <ShieldCheck className="w-3.5 h-3.5 text-[#171717]" />
                <span>VERIFIED CLIENT FIT & DRAPE</span>
              </div>

              <div className="flex flex-wrap items-center gap-2 min-[360px]:gap-3">
                <h2 className="text-lg min-[360px]:text-xl sm:text-2xl font-light tracking-[0.12em] min-[360px]:tracking-[0.14em] uppercase text-[#171717]">
                  COMMUNITY EDITORIAL
                </h2>
                <span className="inline-flex items-center gap-1 text-[9px] min-[360px]:text-[10px] tracking-wider uppercase bg-amber-50/80 px-2.5 min-[360px]:px-3 py-1 rounded-full border border-amber-200/80 text-amber-900 font-semibold shadow-2xs">
                  <Sparkles className="w-3 h-3 text-amber-500 fill-amber-500" />
                  4.9 / 5.0 (1.2K+ VERIFIED)
                </span>
              </div>
            </div>

            {/* Controls: Prev / Next buttons & Auto-play toggle with smooth curves */}
            <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#E5E2DA]">
              {/* Auto play toggle */}
              <button
                type="button"
                onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                title={isAutoPlaying ? 'Pause carousel' : 'Play carousel'}
                className="px-3 py-1.5 rounded-full bg-[#F3F0E8] hover:bg-white text-[10px] tracking-wider uppercase text-[#77736C] hover:text-[#171717] border border-[#E2DDD3] flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer"
              >
                {isAutoPlaying ? (
                  <>
                    <Pause className="w-3 h-3" />
                    <span>PAUSE</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3 h-3" />
                    <span>AUTO</span>
                  </>
                )}
              </button>

              {/* Curved Navigation Arrows */}
              <div className="flex items-center gap-2">
                <motion.button
                  type="button"
                  whileTap={{ scale: 0.92 }}
                  whileHover={{ scale: 1.06 }}
                  onClick={() => scroll('left')}
                  aria-label="Previous review"
                  className="w-9 h-9 rounded-full bg-white border border-[#DEDAD2] hover:border-[#171717] hover:bg-[#171717] hover:text-white text-[#171717] flex items-center justify-center transition-all shadow-sm cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4 stroke-[2]" />
                </motion.button>
                <motion.button
                  type="button"
                  whileTap={{ scale: 0.92 }}
                  whileHover={{ scale: 1.06 }}
                  onClick={() => scroll('right')}
                  aria-label="Next review"
                  className="w-9 h-9 rounded-full bg-white border border-[#DEDAD2] hover:border-[#171717] hover:bg-[#171717] hover:text-white text-[#171717] flex items-center justify-center transition-all shadow-sm cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4 stroke-[2]" />
                </motion.button>
              </div>
            </div>
          </div>

          {/* Curved Category Filter Pills */}
          <div className="flex items-center gap-2 mt-5 overflow-x-auto pb-1 scrollbar-none">
            {categories.map((cat) => {
              const isActive = activeFilter === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => {
                    setActiveFilter(cat);
                    if (scrollContainerRef.current) {
                      scrollContainerRef.current.scrollTo({ left: 0, behavior: 'smooth' });
                    }
                  }}
                  className={`relative px-4 py-1.5 rounded-full text-[10px] tracking-[0.2em] uppercase transition-all duration-200 whitespace-nowrap font-medium ${
                    isActive
                      ? 'bg-[#171717] text-[#F7F5F0] shadow-sm'
                      : 'bg-white text-[#77736C] hover:text-[#171717] hover:bg-[#F9F8F6] border border-[#E0DDD5]'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Compact Animated Curved Reviews Carousel */}
        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          onMouseEnter={() => setIsAutoPlaying(false)}
          onMouseLeave={() => setIsAutoPlaying(true)}
          className="flex items-stretch gap-4 sm:gap-5 overflow-x-auto scroll-smooth snap-x snap-mandatory scrollbar-none pb-4 pt-1 -mx-4 px-4 sm:mx-0 sm:px-0"
          style={{ scrollSnapType: 'x mandatory' }}
        >
          <AnimatePresence mode="popLayout">
            {filteredReviews.map((review, idx) => (
              <motion.div
                key={review.id}
                layout
                initial={{ opacity: 0, scale: 0.95, y: 12 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.35, delay: idx * 0.05 }}
                whileHover={{ y: -6, transition: { duration: 0.22 } }}
                className="w-[245px] sm:w-[270px] md:w-[285px] flex-shrink-0 bg-white border border-[#E5E2DA] hover:border-[#171717] rounded-2xl transition-all duration-300 snap-start flex flex-col justify-between shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] group overflow-hidden"
              >
                {/* Curved Image Container with Hover Zoom & Photo Lightbox */}
                {review.reviewImage && (
                  <div
                    className="relative w-full h-44 sm:h-48 bg-[#ECEFF1] overflow-hidden rounded-t-2xl border-b border-[#EAE7DF] cursor-pointer"
                    onClick={() => setSelectedPhoto(review)}
                  >
                    <img
                      src={review.reviewImage}
                      alt={`Client fit by ${review.author}`}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover object-top transition-transform duration-600 ease-out group-hover:scale-108"
                    />

                    {/* Vignette Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 opacity-70 group-hover:opacity-50 transition-opacity" />

                    {/* Top Tag: Curved Client Fit Badge */}
                    <div className="absolute top-2.5 right-2.5 z-10 bg-black/75 backdrop-blur-xs text-white px-2.5 py-1 rounded-full text-[8px] tracking-[0.2em] uppercase flex items-center gap-1 font-semibold shadow-xs">
                      <Camera className="w-2.5 h-2.5" />
                      <span>CLIENT FIT</span>
                    </div>

                    {/* Hover expand icon with curved pill */}
                    <div className="absolute top-2.5 left-2.5 z-10 opacity-0 group-hover:opacity-100 transition-all bg-white/95 text-black p-1.5 rounded-full shadow-sm">
                      <Maximize2 className="w-3 h-3" />
                    </div>

                    {/* Bottom Tag: Curved Product Name Pill */}
                    {review.productName && (
                      <div className="absolute bottom-2.5 inset-x-2.5 z-10">
                        <span className="inline-block max-w-full truncate bg-white/95 backdrop-blur-xs text-black px-3 py-1 rounded-full text-[8px] tracking-[0.16em] uppercase font-bold shadow-sm border border-black/5">
                          {review.productName}
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {/* Compact Review Content with Soft Curves */}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Stars & Date */}
                    <div className="flex items-center justify-between mb-2.5">
                      <div className="flex text-amber-500 gap-0.5">
                        {[...Array(review.rating)].map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-amber-500 text-amber-500" />
                        ))}
                      </div>
                      <span className="text-[9px] text-[#77736C] tracking-wider uppercase font-light">
                        {review.date}
                      </span>
                    </div>

                    {/* Curved Fit Feedback Tag */}
                    {review.fitFeedback && (
                      <div className="mb-2.5">
                        <span className="inline-block text-[8px] tracking-[0.16em] uppercase px-2.5 py-0.5 rounded-full bg-[#F3F0E8] border border-[#E2DDD3] text-[#171717] font-semibold">
                          {review.fitFeedback}
                        </span>
                      </div>
                    )}

                    {/* Review Quote - 3 line clamp */}
                    <p className="text-[11px] text-[#171717] leading-relaxed font-light line-clamp-3 mb-3">
                      "{review.comment}"
                    </p>
                  </div>

                  {/* Compact Footer: Author & Curved Verified Pill */}
                  <div className="pt-3 border-t border-[#EAE7DF] flex items-center justify-between">
                    <div className="truncate mr-2">
                      <span className="text-[11px] font-semibold tracking-wider uppercase text-[#171717] block truncate">
                        {review.author}
                      </span>
                      <span className="text-[9px] text-[#77736C] font-light block truncate">
                        {review.location}
                      </span>
                    </div>

                    {review.verified && (
                      <span className="text-[8px] tracking-wider uppercase text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 flex-shrink-0 font-bold">
                        VERIFIED
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Curved Progress Indicators (Dots) */}
        <div className="flex items-center justify-center gap-1.5 mt-5">
          {filteredReviews.map((rev, i) => (
            <button
              key={rev.id}
              type="button"
              onClick={() => scrollToIndex(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                currentIndex === i
                  ? 'w-7 bg-[#171717]'
                  : 'w-2 bg-[#DEDAD2] hover:bg-[#77736C]'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Curved Lightbox Modal for Full Client Fit View */}
      <AnimatePresence>
        {selectedPhoto && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4"
            onClick={() => setSelectedPhoto(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.94 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-md w-full bg-white border border-gray-200 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden"
            >
              <button
                type="button"
                onClick={() => setSelectedPhoto(null)}
                aria-label="Close photo preview"
                className="absolute top-3.5 right-3.5 z-10 p-2 rounded-full bg-black/60 text-white hover:bg-black transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="relative aspect-[4/5] bg-gray-100 rounded-t-2xl sm:rounded-t-3xl overflow-hidden">
                <img
                  src={selectedPhoto.reviewImage}
                  alt={selectedPhoto.productName || 'Client fit'}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="p-5 bg-white border-t border-gray-200">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold uppercase tracking-wider text-black">
                    {selectedPhoto.author} — {selectedPhoto.location}
                  </span>
                  <div className="flex text-amber-500">
                    {[...Array(selectedPhoto.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                    ))}
                  </div>
                </div>
                {selectedPhoto.productName && (
                  <p className="text-[10px] tracking-widest uppercase text-gray-500 mb-2 font-medium">
                    {selectedPhoto.productName}
                  </p>
                )}
                <p className="text-xs text-gray-800 italic leading-relaxed">
                  "{selectedPhoto.comment}"
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
