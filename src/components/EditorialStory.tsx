import React from 'react';
import { Play, ArrowUpRight } from 'lucide-react';
import { Category } from '../types';

interface EditorialStoryProps {
  onReplayFilm: () => void;
  onSelectCategory: (category: Category) => void;
}

export const EditorialStory: React.FC<EditorialStoryProps> = ({ onReplayFilm, onSelectCategory }) => {
  return (
    <section className="bg-[#171717] text-[#F7F5F0] py-14 sm:py-28 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-10">
        {/* Editorial Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 sm:mb-16 pb-5 border-b border-white/15 gap-5">
          <div>
            <span className="text-[10px] tracking-[0.38em] uppercase text-[#77736C] block mb-2 font-normal">
              THE MANIFESTO // 01
            </span>
            <h2 className="text-2xl sm:text-5xl font-light tracking-[0.16em] uppercase text-[#F7F5F0] leading-tight">
              MOVE DIFFERENT.
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={onReplayFilm}
              className="flex items-center justify-center gap-2.5 text-[9px] min-[360px]:text-[10px] sm:text-[11px] tracking-[0.16em] min-[360px]:tracking-[0.24em] uppercase text-[#F7F5F0] border border-white/30 hover:border-white px-3 min-[360px]:px-4 sm:px-5 py-3 transition-all duration-300 bg-white/5 hover:bg-white/10 w-full sm:w-auto min-h-[44px]"
            >
              <Play className="w-3 h-3 fill-current" />
              <span>EXPERIENCE THE STORE FILM</span>
            </button>
          </div>
        </div>

        {/* Dual Editorial Lookbook Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-16 items-center">
          {/* Left: Men's Lookbook Feature */}
          <div className="group relative flex flex-col">
            <div className="relative aspect-[3/4] w-full overflow-hidden bg-black/40">
              <img
                src="/assets/savage_mens_look_1789543668563.jpg"
                alt="SAVAGE WEAR Men Lookbook"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-1000 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-90" />

              <div className="absolute bottom-5 left-5 right-5 sm:bottom-8 sm:left-8 sm:right-8">
                <span className="text-[10px] tracking-[0.3em] uppercase text-[#77736C] block mb-1">
                  MENSWEAR // ARCHITECTURAL FLEECE
                </span>
                <h3 className="text-lg sm:text-2xl font-light tracking-[0.14em] uppercase text-[#F7F5F0] mb-2 sm:mb-3">
                  THE MATTE NOIR SUITE
                </h3>
                <p className="text-xs text-[#F7F5F0]/80 font-light leading-relaxed max-w-sm mb-3 sm:mb-4">
                  Constructed from heavyweight 480 GSM French terry with tonal hexagonal crest embroidery and bonded tactical trims.
                </p>
                <button
                  type="button"
                  onClick={() => onSelectCategory('MEN')}
                  className="inline-flex items-center gap-1.5 text-[11px] tracking-[0.24em] uppercase text-[#F7F5F0] underline underline-offset-4 hover:opacity-75 transition-opacity min-h-[36px]"
                >
                  <span>EXPLORE MENSWEAR</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Right: Women's Lookbook Feature */}
          <div className="group relative flex flex-col">
            <div className="relative aspect-[3/4] w-full overflow-hidden bg-black/40">
              <img
                src="/assets/savage_womens_look_1789543688852.jpg"
                alt="SAVAGE WEAR Women Lookbook"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-1000 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-90" />

              <div className="absolute bottom-5 left-5 right-5 sm:bottom-8 sm:left-8 sm:right-8">
                <span className="text-[10px] tracking-[0.3em] uppercase text-[#77736C] block mb-1">
                  WOMENSWEAR // WARM IVORY CAPSULE
                </span>
                <h3 className="text-lg sm:text-2xl font-light tracking-[0.14em] uppercase text-[#F7F5F0] mb-2 sm:mb-3">
                  STRUCTURED SCULPTURAL SILHOUETTES
                </h3>
                <p className="text-xs text-[#F7F5F0]/80 font-light leading-relaxed max-w-sm mb-4">
                  Fluid drapes paired with architectural cocoon tailoring. Designed for elevated poise in pure neutral tones.
                </p>
                <button
                  type="button"
                  onClick={() => onSelectCategory('WOMEN')}
                  className="inline-flex items-center gap-1.5 text-[11px] tracking-[0.24em] uppercase text-[#F7F5F0] underline underline-offset-4 hover:opacity-75 transition-opacity"
                >
                  <span>EXPLORE WOMENSWEAR</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Brand pillars from the Flagship Store Video */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20 pt-12 border-t border-white/10">
          <div>
            <span className="text-[10px] tracking-[0.3em] uppercase text-[#77736C] block mb-2">
              01 // CRAFTSMANSHIP
            </span>
            <h4 className="text-sm tracking-[0.16em] uppercase text-[#F7F5F0] font-medium mb-2">
              480 GSM ORGANIC FLEECE
            </h4>
            <p className="text-xs text-[#77736C] font-light leading-relaxed">
              Custom-milled heavyweight yarns with pre-shrunk density. Retains its sculpted architectural drape for decades of wear.
            </p>
          </div>

          <div>
            <span className="text-[10px] tracking-[0.3em] uppercase text-[#77736C] block mb-2">
              02 // HARDWARE PRECISION
            </span>
            <h4 className="text-sm tracking-[0.16em] uppercase text-[#F7F5F0] font-medium mb-2">
              GUNMETAL RIRI ZIPPERS
            </h4>
            <p className="text-xs text-[#77736C] font-light leading-relaxed">
              Solid matte metal components engineered in Switzerland. Heavy-gauge teeth designed for tactile satisfaction and weather resistance.
            </p>
          </div>

          <div>
            <span className="text-[10px] tracking-[0.3em] uppercase text-[#77736C] block mb-2">
              03 // IDENTITY
            </span>
            <h4 className="text-sm tracking-[0.16em] uppercase text-[#F7F5F0] font-medium mb-2">
              WEAR YOUR STORY
            </h4>
            <p className="text-xs text-[#77736C] font-light leading-relaxed">
              Discreet tonal branding. The dimensional hexagonal Savage emblem stands as an understated seal of distinction.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
