import React, { useState, useEffect, useRef } from 'react';
import {
  Menu,
  X,
  ShoppingBag,
  Heart,
  Search,
  User,
  Film,
} from 'lucide-react';
import { Category } from '../types';
import { SavageLogo } from './SavageLogo';
import { CategoryNavBar } from './CategoryNavBar';

interface HeaderProps {
  activeCategory: Category;
  onSelectCategory: (category: Category) => void;
  onOpenBag: () => void;
  onOpenWishlist: () => void;
  onOpenSearch: () => void;
  onOpenAccount: () => void;
  bagCount: number;
  wishlistCount: number;
  visitorName?: string;
  onReplayIntro: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeCategory,
  onSelectCategory,
  onOpenBag,
  onOpenWishlist,
  onOpenSearch,
  onOpenAccount,
  bagCount,
  wishlistCount,
  visitorName,
  onReplayIntro,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const lastScrollYRef = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const prevScrollY = lastScrollYRef.current;

      setIsScrolled(currentScrollY > 15);

      if (currentScrollY <= 20) {
        setIsVisible(true);
      } else if (currentScrollY > prevScrollY && currentScrollY > 30) {
        // User scrolling down -> hide header
        setIsVisible(false);
      } else if (currentScrollY < prevScrollY) {
        // User scrolling up -> show header
        setIsVisible(true);
      }

      lastScrollYRef.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const desktopNavItems: { label: string; category: Category }[] = [
    { label: 'NEW ARRIVALS', category: 'NEW ARRIVALS' },
    { label: 'BESTSELLERS', category: 'BESTSELLERS' },
    { label: 'COLLECTIONS', category: 'COLLECTIONS' },
    { label: 'SALE', category: 'SALE' },
  ];

  const mobileNavItems: { label: string; category: Category }[] = [
    { label: 'MEN', category: 'MEN' },
    { label: 'WOMEN', category: 'WOMEN' },
    { label: 'JUNIORS', category: 'JUNIORS' },
    { label: 'NEW ARRIVALS', category: 'NEW ARRIVALS' },
    { label: 'BESTSELLERS', category: 'BESTSELLERS' },
    { label: 'COLLECTIONS', category: 'COLLECTIONS' },
    { label: 'SALE', category: 'SALE' },
  ];

  const showHeader = isVisible || mobileMenuOpen;

  return (
    <header
      id="main-site-header"
      className={`fixed top-0 inset-x-0 z-40 transition-all duration-300 ease-in-out bg-[#F7F5F0]/95 backdrop-blur-md ${
        isScrolled ? 'shadow-[0_2px_12px_rgba(0,0,0,0.04)]' : ''
      } ${
        showHeader
          ? 'translate-y-0 opacity-100'
          : '-translate-y-full opacity-0 pointer-events-none'
      }`}
    >
      <div
        className={`max-w-7xl mx-auto px-2.5 min-[360px]:px-4 sm:px-8 lg:px-10 flex items-center justify-between transition-all duration-300 ${
          isScrolled ? 'py-2 sm:py-2.5' : 'py-2 sm:py-3.5'
        }`}
      >
        {/* Left: Mobile Menu Toggle & Desktop Navigation */}
        <div className="flex items-center gap-2 min-[360px]:gap-4 lg:gap-8 flex-shrink-0">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-1.5 min-[360px]:p-2 -ml-1 text-[#171717] hover:opacity-70 transition-opacity min-w-[38px] min-h-[40px] sm:min-w-[44px] sm:min-h-[44px] flex items-center justify-center cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <nav className="hidden lg:flex items-center gap-7">
            {desktopNavItems.map((item) => {
              const isActive = activeCategory === item.category;
              return (
                <button
                  key={item.category}
                  type="button"
                  onClick={() => onSelectCategory(item.category)}
                  className={`text-[11px] tracking-[0.24em] font-medium transition-all duration-300 relative py-1 uppercase cursor-pointer ${
                    isActive ? 'text-[#171717]' : 'text-[#77736C] hover:text-[#171717]'
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <span className="absolute bottom-0 inset-x-0 h-[1.5px] bg-[#171717] transition-all" />
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Center: SAVAGE WEAR brand identity */}
        <button
          type="button"
          onClick={() => {
            onSelectCategory('ALL');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="flex items-center justify-center transform transition-transform duration-300 hover:opacity-85 py-1 flex-shrink-0"
          aria-label="SAVAGE WEAR Home"
        >
          <div className="scale-[0.8] min-[360px]:scale-90 sm:scale-100 origin-center">
            <SavageLogo variant="horizontal" color="#171717" size="sm" />
          </div>
        </button>

        {/* Right side: SEARCH, ACCOUNT, WISHLIST, BAG */}
        <div className="flex items-center gap-0.5 min-[360px]:gap-1 sm:gap-4 md:gap-6 flex-shrink-0">
          {/* SEARCH */}
          <button
            type="button"
            onClick={onOpenSearch}
            className="group p-1.5 min-[360px]:p-2 text-[#171717] hover:text-[#77736C] transition-colors min-w-[34px] min-[360px]:min-w-[38px] sm:min-w-[40px] min-h-[40px] flex items-center justify-center gap-1.5 cursor-pointer"
            aria-label="Search collection"
          >
            <Search className="w-4 h-4 stroke-[1.5]" />
            <span className="hidden xl:inline text-[11px] tracking-[0.2em] font-medium uppercase">
              SEARCH
            </span>
          </button>

          {/* ACCOUNT */}
          <button
            type="button"
            onClick={onOpenAccount}
            className="group p-1.5 min-[360px]:p-2 text-[#171717] hover:text-[#77736C] transition-colors min-w-[34px] min-[360px]:min-w-[38px] sm:min-w-[40px] min-h-[40px] flex items-center justify-center gap-1.5 cursor-pointer"
            aria-label="User Account"
          >
            <User className="w-4 h-4 stroke-[1.5]" />
            <span className="hidden xl:inline text-[11px] tracking-[0.2em] font-medium uppercase">
              {visitorName ? visitorName.slice(0, 8) : 'ACCOUNT'}
            </span>
          </button>

          {/* WISHLIST */}
          <button
            type="button"
            onClick={onOpenWishlist}
            className="group relative p-1.5 min-[360px]:p-2 text-[#171717] hover:text-[#77736C] transition-colors min-w-[34px] min-[360px]:min-w-[38px] sm:min-w-[40px] min-h-[40px] flex items-center justify-center gap-1.5 cursor-pointer"
            aria-label="Wishlist"
          >
            <Heart className="w-4 h-4 stroke-[1.5]" />
            <span className="hidden xl:inline text-[11px] tracking-[0.2em] font-medium uppercase">
              WISHLIST
            </span>
            {wishlistCount > 0 && (
              <span className="absolute top-1 right-1 sm:-top-1 sm:-right-2 w-3.5 h-3.5 rounded-full bg-[#171717] text-[#F7F5F0] text-[9px] flex items-center justify-center font-bold">
                {wishlistCount}
              </span>
            )}
          </button>

          {/* BAG */}
          <button
            type="button"
            onClick={onOpenBag}
            className="group relative p-1.5 min-[360px]:p-2 text-[#171717] hover:text-[#77736C] transition-colors min-w-[34px] min-[360px]:min-w-[38px] sm:min-w-[40px] min-h-[40px] flex items-center justify-center gap-1.5 cursor-pointer"
            aria-label="Shopping Bag"
          >
            <ShoppingBag className="w-4 h-4 stroke-[1.5]" />
            <span className="hidden xl:inline text-[11px] tracking-[0.2em] font-medium uppercase">
              BAG
            </span>
            {bagCount > 0 && (
              <span className="absolute top-1 right-1 sm:-top-1 sm:-right-2 w-3.5 h-3.5 rounded-full bg-[#171717] text-[#F7F5F0] text-[9px] flex items-center justify-center font-bold">
                {bagCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Horizontal Fashion Category Navigation Bar: MEN | WOMEN | JUNIORS (disappears on scroll) */}
      <div
        className={`transition-all duration-300 ease-in-out overflow-hidden ${
          isScrolled
            ? 'max-h-0 opacity-0 pointer-events-none -translate-y-1'
            : 'max-h-14 opacity-100 translate-y-0'
        }`}
      >
        <CategoryNavBar
          activeCategory={activeCategory}
          onSelectCategory={(cat) => {
            onSelectCategory(cat);
            setMobileMenuOpen(false);
          }}
        />
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#DEDAD2] bg-[#F7F5F0] px-6 py-6 animate-in slide-in-from-top-2 duration-300 shadow-xl max-h-[85vh] overflow-y-auto">
          <div className="mb-4 pb-3 border-b border-[#DEDAD2] flex items-center justify-between">
            <span className="text-[10px] tracking-[0.3em] uppercase text-[#77736C]">
              {visitorName ? `CLIENT: ${visitorName}` : 'SAVAGE WEAR DIRECTORY'}
            </span>
            <button
              type="button"
              onClick={() => {
                onReplayIntro();
                setMobileMenuOpen(false);
              }}
              className="text-[10px] tracking-[0.2em] uppercase text-[#171717] flex items-center gap-1 underline"
            >
              <Film className="w-3 h-3" />
              <span>STORE TOUR</span>
            </button>
          </div>

          <nav className="flex flex-col gap-2">
            <button
              type="button"
              onClick={() => {
                onSelectCategory('ALL');
                setMobileMenuOpen(false);
              }}
              className={`text-left text-sm tracking-[0.28em] uppercase py-3 border-b border-[#DEDAD2]/50 transition-colors ${
                activeCategory === 'ALL' ? 'text-[#171717] font-semibold pl-2 border-l-2 border-l-[#171717]' : 'text-[#77736C]'
              }`}
            >
              ALL COLLECTIONS
            </button>
            {mobileNavItems.map((item) => (
              <button
                key={item.category}
                type="button"
                onClick={() => {
                  onSelectCategory(item.category);
                  setMobileMenuOpen(false);
                }}
                className={`text-left text-sm tracking-[0.28em] uppercase py-3 border-b border-[#DEDAD2]/50 transition-colors cursor-pointer ${
                  activeCategory === item.category ? 'text-[#171717] font-semibold pl-2 border-l-2 border-l-[#171717]' : 'text-[#77736C]'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Quick Mobile Action Bar */}
          <div className="grid grid-cols-2 gap-2 mt-6 pt-4 border-t border-[#DEDAD2]">
            <button
              type="button"
              onClick={() => {
                onOpenSearch();
                setMobileMenuOpen(false);
              }}
              className="flex items-center justify-center gap-2 py-3 bg-white border border-[#DEDAD2] text-xs tracking-wider uppercase text-[#171717]"
            >
              <Search className="w-3.5 h-3.5" />
              <span>SEARCH</span>
            </button>
            <button
              type="button"
              onClick={() => {
                onOpenAccount();
                setMobileMenuOpen(false);
              }}
              className="flex items-center justify-center gap-2 py-3 bg-white border border-[#DEDAD2] text-xs tracking-wider uppercase text-[#171717]"
            >
              <User className="w-3.5 h-3.5" />
              <span>ACCOUNT</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
