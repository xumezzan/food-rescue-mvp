import { Store, StoreCategory, SurpriseBag } from "./types";

// Mock Tashkent Stores
export const MOCK_STORES: Store[] = [
  {
    id: '1',
    name: "Safia Bakery",
    description: "Famous local bakery chain with fresh pastries and cakes.",
    category: StoreCategory.BAKERY,
    rating: 4.8,
    distanceKm: 0.5,
    image: "https://picsum.photos/400/300?random=1",
    lat: 41.2995,
    lng: 69.2401,
    pickupStart: "20:00",
    pickupEnd: "22:00",
    address: "Amir Temur Ave, 15"
  },
  {
    id: '2',
    name: "Osh Markazi (Plov Center)",
    description: "Traditional Uzbek Plov and salads.",
    category: StoreCategory.RESTAURANT,
    rating: 4.9,
    distanceKm: 1.2,
    image: "https://picsum.photos/400/300?random=2",
    lat: 41.3111,
    lng: 69.2797,
    pickupStart: "14:00",
    pickupEnd: "15:00",
    address: "Shakhriston St, 5"
  },
  {
    id: '3',
    name: "Korzinka Supermarket",
    description: "Daily fresh produce and bakery items.",
    category: StoreCategory.GROCERY,
    rating: 4.5,
    distanceKm: 2.1,
    image: "https://picsum.photos/400/300?random=3",
    lat: 41.3200,
    lng: 69.2500,
    pickupStart: "22:00",
    pickupEnd: "23:30",
    address: "Sebzar St, 8"
  },
  {
    id: '4',
    name: "Bon!",
    description: "French style cafe with sandwiches and coffee.",
    category: StoreCategory.CAFE,
    rating: 4.6,
    distanceKm: 0.8,
    image: "https://picsum.photos/400/300?random=4",
    lat: 41.3000,
    lng: 69.2600,
    pickupStart: "19:00",
    pickupEnd: "20:30",
    address: "Oybek St, 24"
  },
  {
    id: '5',
    name: "Evos",
    description: "Popular fast food chain, lavash and burgers.",
    category: StoreCategory.FAST_FOOD,
    rating: 4.4,
    distanceKm: 1.5,
    image: "https://picsum.photos/400/300?random=5",
    lat: 41.2800,
    lng: 69.2200,
    pickupStart: "23:00",
    pickupEnd: "00:00",
    address: "Chilanzar, Qatortol"
  }
];

export const MOCK_BAGS: Record<string, SurpriseBag> = {
  '1': { id: 'bag_1', storeId: '1', originalPrice: 60000, discountPrice: 20000, quantity: 5, tags: ['Pastry', 'Sweet'] },
  '2': { id: 'bag_2', storeId: '2', originalPrice: 45000, discountPrice: 15000, quantity: 2, tags: ['Plov', 'Salad'] },
  '3': { id: 'bag_3', storeId: '3', originalPrice: 80000, discountPrice: 25000, quantity: 10, tags: ['Bread', 'Dairy', 'Produce'] },
  '4': { id: 'bag_4', storeId: '4', originalPrice: 55000, discountPrice: 18000, quantity: 3, tags: ['Sandwich', 'Croissant'] },
  '5': { id: 'bag_5', storeId: '5', originalPrice: 40000, discountPrice: 15000, quantity: 8, tags: ['Lavash', 'Fries'] },
};

export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('uz-UZ', { style: 'currency', currency: 'UZS', maximumFractionDigits: 0 }).format(amount);
};
