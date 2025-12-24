import { generateId } from './utils';

const STORAGE_KEY = 'food_rescue_offers';

// Kept for backward compatibility if needed, but we rely on MOCK_STORES constant now mostly
const SEED_OFFERS = [];

export const storage = {
    // --- Offers (Merchant Side - Legacy/Admin) ---
    getOffers: () => {
        const data = localStorage.getItem(STORAGE_KEY);
        if (!data) return SEED_OFFERS;
        return JSON.parse(data);
    },

    saveOffers: (offers) => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(offers));
    },

    addOffer: (offer) => {
        const offers = storage.getOffers();
        const newOffer = { ...offer, id: generateId(), createdAt: Date.now() };
        const updated = [newOffer, ...offers];
        storage.saveOffers(updated);
        return updated;
    },

    deleteOffer: (id) => {
        const offers = storage.getOffers();
        const updated = offers.filter(o => o.id !== id);
        storage.saveOffers(updated);
        return updated;
    },

    // --- Orders (User Side - Critical for Tejab App) ---
    getOrders: () => {
        const data = localStorage.getItem('food_rescue_orders');
        return data ? JSON.parse(data) : [];
    },

    saveOrder: (order) => {
        const orders = storage.getOrders();
        // Prepend new order
        const updated = [order, ...orders];
        localStorage.setItem('food_rescue_orders', JSON.stringify(updated));
        return updated;
    },

    resetDemo: () => {
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem('food_rescue_orders');
        return [];
    }
};
