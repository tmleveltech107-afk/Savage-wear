import React, { useState } from 'react';
import { ArrowRight, Check } from 'lucide-react';
import { SavageLogo } from './SavageLogo';
import { Category } from '../types';

interface FooterProps {
  onSelectCategory: (category: Category) => void;
  onReplayFilm: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectCategory, onReplayFilm }) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setTimeout(() => {
        setEmail('');
        setSubscribed(false);
      }, 4000);
    }
  };

  return (
    <footer id="brand-footer" className="bg-[#171717] text-[#F7F5F0] pt-16 sm:pt-20 pb-12 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 min-[360px]:px-6 sm:px-10">
        {/* Brand Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-12 sm:pb-16 border-b border-white/10 gap-8">
          <div className="flex items-center gap-4">
            <SavageLogo size="md" color="#F7F5F0" />
          </div>

          {/* Minimalist Newsletter Subscription */}
          <div className="w-full max-w-md">
            <span className="text-[10px] tracking-[0.3em] uppercase text-[#77736C] block mb-2 font-light">
              THE DISPATCH // PRIVATE RELEASES
            </span>
            <form onSubmit={handleSubscribe} className="flex border-b border-white/30 pb-2 focus-within:border-white transition-colors">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ENTER YOUR EMAIL FOR EDITORIAL DROPS"
                className="w-full bg-transparent text-[10px] min-[360px]:text-xs tracking-[0.14em] min-[360px]:tracking-[0.2em] uppercase text-[#F7F5F0] placeholder:text-[#77736C] focus:outline-none pr-4"
              />
              <button
                type="submit"
                aria-label="Subscribe to newsletter"
                className="text-[#F7F5F0] opacity-70 hover:opacity-100 transition-opacity flex-shrink-0"
              >
                {subscribed ? <Check className="w-4 h-4 text-emerald-400" /> : <ArrowRight className="w-4 h-4" />}
              </button>
            </form>
            {subscribed && (
              <p className="text-[10px] tracking-widest text-emerald-400 mt-2 uppercase font-light">
                PRIVILEGED ACCESS GRANTED.
              </p>
            )}
          </div>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 min-[360px]:gap-8 sm:gap-10 py-12 sm:py-16 text-xs tracking-[0.16em] uppercase">
          {/* Col 1: Collections */}
          <div>
            <h4 className="font-semibold text-[11px] tracking-[0.24em] text-[#F7F5F0] mb-5">
              COLLECTIONS
            </h4>
            <ul className="space-y-3 font-light text-[#77736C]">
              <li>
                <button
                  type="button"
                  onClick={() => onSelectCategory('MEN')}
                  className="hover:text-[#F7F5F0] transition-colors"
                >
                  MENSWEAR
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onSelectCategory('WOMEN')}
                  className="hover:text-[#F7F5F0] transition-colors"
                >
                  WOMENSWEAR
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onSelectCategory('NEW ARRIVALS')}
                  className="hover:text-[#F7F5F0] transition-colors"
                >
                  NEW ARRIVALS
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onSelectCategory('COLLECTIONS')}
                  className="hover:text-[#F7F5F0] transition-colors"
                >
                  CAPSULES
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onSelectCategory('SALE')}
                  className="hover:text-[#F7F5F0] transition-colors"
                >
                  ARCHIVE SALE
                </button>
              </li>
            </ul>
          </div>

          {/* Col 2: Flagship Boutique */}
          <div>
            <h4 className="font-semibold text-[11px] tracking-[0.24em] text-[#F7F5F0] mb-5">
              BOUTIQUE
            </h4>
            <ul className="space-y-3 font-light text-[#77736C]">
              <li>FLAGSHIP STORE: 48 MERCER ST</li>
              <li>SOHO, NEW YORK</li>
              <li>MON — SAT: 11:00 — 20:00</li>
              <li>SUN: 12:00 — 18:00</li>
              <li>
                <button
                  type="button"
                  onClick={onReplayFilm}
                  className="text-[#F7F5F0] underline underline-offset-4 hover:opacity-80"
                >
                  REPLAY STORE TOUR
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Client Concierge */}
          <div>
            <h4 className="font-semibold text-[11px] tracking-[0.24em] text-[#F7F5F0] mb-5">
              CONCIERGE
            </h4>
            <ul className="space-y-3 font-light text-[#77736C]">
              <li>COMPLIMENTARY SHIPPING</li>
              <li>30-DAY CONCIERGE RETURNS</li>
              <li>BESPOKE TAILORING</li>
              <li>GARMENT CARE DIRECTORY</li>
              <li>AUTHENTICITY VERIFICATION</li>
            </ul>
          </div>

          {/* Col 4: Manifesto */}
          <div>
            <h4 className="font-semibold text-[11px] tracking-[0.24em] text-[#F7F5F0] mb-5">
              SAVAGE WEAR
            </h4>
            <p className="text-[#77736C] font-light leading-relaxed mb-4 normal-case text-xs">
              A modern architectural streetwear house. Engineered for modern thinkers who move different.
            </p>
            <span className="text-[10px] tracking-[0.3em] uppercase text-[#F7F5F0]/60 block">
              EST. 2026 // MILAN & NEW YORK
            </span>
          </div>
        </div>

        {/* Bottom Bar - Perfectly Centered Copyright and Legal Links */}
        <div className="pt-8 border-t border-white/10 flex flex-col items-center justify-center text-center text-[10px] tracking-[0.16em] min-[360px]:tracking-[0.22em] uppercase text-[#77736C] font-light gap-3">
          <div className="flex flex-wrap items-center justify-center gap-x-2.5 min-[360px]:gap-x-4 gap-y-2 sm:gap-6">
            <span className="hover:text-[#F7F5F0] cursor-pointer transition-colors">PRIVACY POLICY</span>
            <span className="text-white/20">•</span>
            <span className="hover:text-[#F7F5F0] cursor-pointer transition-colors">TERMS OF SERVICE</span>
            <span className="text-white/20">•</span>
            <span className="hover:text-[#F7F5F0] cursor-pointer transition-colors">ACCESSIBILITY</span>
            <span className="text-white/20">•</span>
            <span className="hover:text-[#F7F5F0] cursor-pointer transition-colors">WHATSAPP CONCIERGE</span>
          </div>
          <div id="footer-copyright" className="text-center text-[#77736C] mt-1 font-light tracking-[0.14em] min-[360px]:tracking-[0.24em] text-[9px] min-[360px]:text-[10px]">
            © {new Date().getFullYear()} SAVAGE WEAR INC. ALL RIGHTS RESERVED.
          </div>
        </div>
      </div>
    </footer>
  );
};
