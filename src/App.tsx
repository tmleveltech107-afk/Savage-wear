import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { AppScreen, Category, Product, CartItem } from './types';
import { PRODUCTS } from './data/products';
import { EntranceScreen } from './components/EntranceScreen';
import { VideoTransition } from './components/VideoTransition';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { ProductGrid } from './components/ProductGrid';
import { CollectionDiscovery } from './components/CollectionDiscovery';
import { ProductPage } from './components/ProductPage';
import { ReviewsSection } from './components/ReviewsSection';
import { EditorialStory } from './components/EditorialStory';
import { BagDrawer } from './components/BagDrawer';
import { WishlistDrawer } from './components/WishlistDrawer';
import { SearchModal } from './components/SearchModal';
import { AccountModal } from './components/AccountModal';
import { CheckoutModal } from './components/CheckoutModal';
import { WhatsAppButton } from './components/WhatsAppButton';
import { Footer } from './components/Footer';

export default function App() {
  // Screen state
  const [currentScreen, setCurrentScreen] = useState<AppScreen>(() => {
    const stored = sessionStorage.getItem('savage_screen_seen');
    return stored === 'true' ? 'store' : 'entrance';
  });

  // Visitor profile state
  const [visitorName, setVisitorName] = useState<string>(() => {
    return localStorage.getItem('savage_visitor_name') || '';
  });

  // Ecommerce state
  const [activeCategory, setActiveCategory] = useState<Category>('ALL');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('savage_cart');
    return saved ? JSON.parse(saved) : [];
  });
  const [wishlistIds, setWishlistIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('savage_wishlist');
    return saved ? JSON.parse(saved) : [];
  });

  // Drawers & Modals
  const [isBagOpen, setIsBagOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [checkoutDirectItems, setCheckoutDirectItems] = useState<CartItem[] | null>(null);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('savage_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('savage_wishlist', JSON.stringify(wishlistIds));
  }, [wishlistIds]);

  // Entrance flow handlers
  const handleNameEntered = (name: string) => {
    const clean = name.trim() || 'GUEST';
    setVisitorName(clean);
    localStorage.setItem('savage_visitor_name', clean);
    setCurrentScreen('video_transition');
  };

  const handleVideoFinished = () => {
    sessionStorage.setItem('savage_screen_seen', 'true');
    setCurrentScreen('store');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReplayIntro = () => {
    setCurrentScreen('video_transition');
  };

  const handleRestartFullEntrance = () => {
    sessionStorage.removeItem('savage_screen_seen');
    setCurrentScreen('entrance');
  };

  // Product selection handler (switches to dedicated Product Page)
  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToCollection = () => {
    setSelectedProduct(null);
    setTimeout(() => {
      const catalogEl = document.getElementById('catalog-section');
      if (catalogEl) {
        catalogEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 50);
  };

  // Cart operations
  const handleAddToBag = (product: Product, size: string, color: string) => {
    setCart((prev) => {
      const existingIdx = prev.findIndex(
        (item) =>
          item.product.id === product.id &&
          item.selectedSize === size &&
          item.selectedColor === color
      );
      if (existingIdx > -1) {
        const updated = [...prev];
        updated[existingIdx].quantity += 1;
        return updated;
      }
      return [...prev, { product, selectedSize: size, selectedColor: color, quantity: 1 }];
    });
    setIsBagOpen(true);
  };

  // Express 1-Click Buy Now Checkout
  const handleExpressCheckout = (product: Product, size: string, color: string) => {
    // Also ensure it's in the cart or set direct item
    const directItem: CartItem = {
      product,
      selectedSize: size,
      selectedColor: color,
      quantity: 1,
    };
    setCheckoutDirectItems([directItem]);
    setIsCheckoutOpen(true);
  };

  const handleUpdateQuantity = (index: number, quantity: number) => {
    setCart((prev) => {
      if (quantity <= 0) {
        return prev.filter((_, i) => i !== index);
      }
      const updated = [...prev];
      updated[index].quantity = quantity;
      return updated;
    });
  };

  const handleRemoveItem = (index: number) => {
    setCart((prev) => prev.filter((_, i) => i !== index));
  };

  const handleClearBag = () => {
    setCart([]);
  };

  // Wishlist operations
  const handleToggleWishlist = (product: Product) => {
    setWishlistIds((prev) => {
      if (prev.includes(product.id)) {
        return prev.filter((id) => id !== product.id);
      } else {
        return [...prev, product.id];
      }
    });
  };

  const handleRemoveWishlist = (productId: string) => {
    setWishlistIds((prev) => prev.filter((id) => id !== productId));
  };

  // Smooth Category Selection
  const handleSelectCategoryAndScroll = (category: Category) => {
    setSelectedProduct(null);
    setActiveCategory(category);
    setTimeout(() => {
      const catalogEl = document.getElementById('catalog-section');
      if (catalogEl) {
        catalogEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 50);
  };

  // Open Checkout from Bag Drawer
  const handleOpenCheckoutFromBag = () => {
    setCheckoutDirectItems(null); // use full cart
    setIsCheckoutOpen(true);
  };

  const handleOrderCompleted = (orderNumber: string) => {
    setCart([]);
  };

  // Derived lists
  const wishlistedProducts = PRODUCTS.filter((p) => wishlistIds.includes(p.id));
  const totalCartCount = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <div className="min-h-screen bg-[#F7F5F0] text-[#171717] font-sans antialiased selection:bg-[#171717] selection:text-[#F7F5F0]">
      <AnimatePresence mode="wait">
        {/* Screen 1: Minimal Typography Full-Screen Entrance */}
        {currentScreen === 'entrance' && (
          <motion.div
            key="entrance-screen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
          >
            <EntranceScreen onContinue={handleNameEntered} />
          </motion.div>
        )}

        {/* Screen 2: Cinematic Fashion Video Transition */}
        {currentScreen === 'video_transition' && (
          <motion.div
            key="video-transition-screen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
          >
            <VideoTransition onComplete={handleVideoFinished} visitorName={visitorName} />
          </motion.div>
        )}

        {/* Screen 3: High-End Fashion Boutique Store */}
        {currentScreen === 'store' && (
          <motion.div
            key="store-view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.9 }}
            className="flex flex-col min-h-screen w-full max-w-[100vw] overflow-x-hidden"
          >
            {/* Minimal & Spacious Header */}
            <Header
              activeCategory={activeCategory}
              onSelectCategory={handleSelectCategoryAndScroll}
              onOpenBag={() => setIsBagOpen(true)}
              onOpenWishlist={() => setIsWishlistOpen(true)}
              onOpenSearch={() => setIsSearchOpen(true)}
              onOpenAccount={() => setIsAccountOpen(true)}
              bagCount={totalCartCount}
              wishlistCount={wishlistIds.length}
              visitorName={visitorName}
              onReplayIntro={handleReplayIntro}
            />

            {/* Main Content Area */}
            <main className="flex-1 pt-24 sm:pt-28 w-full overflow-x-hidden">
              {selectedProduct ? (
                /* DEDICATED PRODUCT PAGE WITH FIXED PRODUCT IMAGE & MOVING/SCROLLABLE CONTENT */
                <ProductPage
                  product={selectedProduct}
                  onBack={handleBackToCollection}
                  onAddToBag={handleAddToBag}
                  onExpressCheckout={handleExpressCheckout}
                  onToggleWishlist={handleToggleWishlist}
                  isWishlisted={wishlistIds.includes(selectedProduct.id)}
                />
              ) : (
                /* HOME FLAGSHIP CATALOGUE & EDITORIAL */
                <>
                  {/* Clean Campaign Hero */}
                  <Hero onShopCategory={handleSelectCategoryAndScroll} />

                  {/* Product Catalog Sections */}
                  <ProductGrid
                    products={PRODUCTS}
                    activeCategory={activeCategory}
                    onSelectCategory={setActiveCategory}
                    onQuickView={handleSelectProduct}
                    onAddToBag={handleAddToBag}
                    onToggleWishlist={handleToggleWishlist}
                    wishlistIds={wishlistIds}
                  />

                  {/* Curated Collection Discovery Section */}
                  <CollectionDiscovery
                    onSelectCategory={handleSelectCategoryAndScroll}
                  />

                  {/* Community Voices & Client Editorial Reviews (with image reviews) */}
                  <ReviewsSection />

                  {/* Editorial Manifesto & Lookbook Showcase ("MOVE DIFFERENT.") */}
                  <EditorialStory
                    onReplayFilm={handleReplayIntro}
                    onSelectCategory={handleSelectCategoryAndScroll}
                  />
                </>
              )}
            </main>

            {/* Luxury Brand Footer with Centered Copyright */}
            <Footer
              onSelectCategory={handleSelectCategoryAndScroll}
              onReplayFilm={handleReplayIntro}
            />

            {/* WhatsApp Concierge Support Floating Widget */}
            <WhatsAppButton phoneNumber="03295895704" visitorName={visitorName} />

            {/* Slide-out Shopping Bag Drawer */}
            <BagDrawer
              isOpen={isBagOpen}
              onClose={() => setIsBagOpen(false)}
              items={cart}
              onUpdateQuantity={handleUpdateQuantity}
              onRemoveItem={handleRemoveItem}
              onClearBag={handleClearBag}
              visitorName={visitorName}
              onProceedToCheckout={handleOpenCheckoutFromBag}
              onSelectProduct={handleSelectProduct}
              onQuickAdd={handleAddToBag}
            />

            {/* Professional 256-Bit SSL Checkout Modal */}
            <CheckoutModal
              isOpen={isCheckoutOpen}
              onClose={() => {
                setIsCheckoutOpen(false);
                setCheckoutDirectItems(null);
              }}
              items={checkoutDirectItems && checkoutDirectItems.length > 0 ? checkoutDirectItems : cart}
              onOrderCompleted={handleOrderCompleted}
              visitorName={visitorName}
            />

            {/* Slide-out Wishlist Drawer */}
            <WishlistDrawer
              isOpen={isWishlistOpen}
              onClose={() => setIsWishlistOpen(false)}
              items={wishlistedProducts}
              onRemove={handleRemoveWishlist}
              onMoveToBag={(prod) =>
                handleAddToBag(prod, prod.sizes[0] || 'M', prod.colors[0]?.name || '')
              }
            />

            {/* Instant Search Modal */}
            <SearchModal
              isOpen={isSearchOpen}
              onClose={() => setIsSearchOpen(false)}
              products={PRODUCTS}
              onSelectProduct={handleSelectProduct}
            />

            {/* Client Privileges & Account Modal */}
            <AccountModal
              isOpen={isAccountOpen}
              onClose={() => setIsAccountOpen(false)}
              visitorName={visitorName}
              onUpdateName={(name) => {
                setVisitorName(name);
                localStorage.setItem('savage_visitor_name', name);
              }}
              onReplayFilm={handleReplayIntro}
              onRestartEntrance={handleRestartFullEntrance}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
