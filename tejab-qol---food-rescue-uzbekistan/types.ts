export enum StoreCategory {
  RESTAURANT = 'Restaurant',
  BAKERY = 'Bakery',
  GROCERY = 'Grocery',
  CAFE = 'Cafe',
  FAST_FOOD = 'Fast Food'
}

export interface Store {
  id: string;
  name: string;
  description: string;
  category: StoreCategory;
  rating: number;
  distanceKm: number; // Simulated distance
  image: string;
  lat: number;
  lng: number;
  pickupStart: string; // e.g., "20:00"
  pickupEnd: string;   // e.g., "21:00"
  address: string;
}

export interface SurpriseBag {
  id: string;
  storeId: string;
  originalPrice: number;
  discountPrice: number;
  quantity: number;
  tags: string[]; // e.g., ["Vegetarian", "Pastry"]
}

export enum OrderStatus {
  RESERVED = 'RESERVED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

export interface Order {
  id: string;
  storeId: string;
  bagId: string;
  status: OrderStatus;
  timestamp: number;
  pickupCode: string;
  totalPaid: number;
}

export type ViewState = 'HOME' | 'MAP' | 'STORE_DETAIL' | 'CHECKOUT' | 'PROFILE' | 'ORDERS';

// User Location
export interface Coords {
  lat: number;
  lng: number;
}