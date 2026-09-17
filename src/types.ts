export type AppScreen = 'entrance' | 'video_transition' | 'store';

export type Category = 'ALL' | 'NEW ARRIVALS' | 'BESTSELLERS' | 'MEN' | 'WOMEN' | 'JUNIORS' | 'COLLECTIONS' | 'SALE';

export interface ProductColor {
  name: string;
  hex: string;
}

export interface Review {
  id: string;
  author: string;
  location: string;
  rating: number;
  date: string;
  verified: boolean;
  comment: string;
  fitFeedback?: string;
  reviewImage?: string;
  productName?: string;
}

export interface Product {
  id: string;
  name: string;
  subtitle: string;
  category: Category;
  gender: 'men' | 'women' | 'unisex' | 'juniors';
  price: number;
  pkrPrice?: number;
  season?: string;
  originalPrice?: number;
  isNew?: boolean;
  isBestseller?: boolean;
  colors: ProductColor[];
  sizes: string[];
  primaryImage: string;
  secondaryImage: string;
  galleryImages?: string[];
  description: string;
  details: string[];
  fabric: string;
  fit: string;
  rating?: number;
  reviewsCount?: number;
  reviews?: Review[];
}

export interface CartItem {
  product: Product;
  selectedColor: string;
  selectedSize: string;
  quantity: number;
}

export interface UserProfile {
  name: string;
  enteredAt: number;
  vipStatus: boolean;
}
