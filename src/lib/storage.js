import { generateId } from './utils';

const STORAGE_KEY = 'food_rescue_offers';

const SEED_OFFERS = [
    {
        id: 'seed-1',
        title: 'Evening Bakery Bag',
        place: 'Bon Appétit Tashkent',
        category: 'Bakery',
        price: 15000,
        originalValue: 45000,
        pickupFrom: '21:00',
        pickupTo: '22:00',
        quantity: 5,
        createdAt: Date.now() - 100000
    },
    {
        id: 'seed-2',
        title: 'Lunch Leftovers Surprise',
        place: 'Plov Center #1',
        category: 'Restaurant',
        price: 25000,
        originalValue: 60000,
        pickupFrom: '15:00',
        pickupTo: '16:00',
        quantity: 3,
        createdAt: Date.now() - 200000
    },
    {
        id: 'seed-3',
        title: 'Grocery Mix Bag',
        place: 'Korzinka Supermarket',
        category: 'Grocery',
        price: 30000,
        originalValue: 90000,
        pickupFrom: '22:00',
        pickupTo: '23:00',
        quantity: 2,
        createdAt: Date.now() - 50000
    },
    {
        id: 'seed-4',
        title: 'Pastry Selection',
        place: 'Safia',
        category: 'Cafe',
        price: 18000,
        originalValue: 40000,
        pickupFrom: '20:30',
        pickupTo: '21:30',
        quantity: 4,
        createdAt: Date.now() - 15000
    },
    {
        id: 'seed-5',
        title: 'Sushi Set leftovers',
        place: 'Yapona Mama',
        category: 'Restaurant',
        price: 45000,
        originalValue: 120000,
        pickupFrom: '22:30',
        pickupTo: '23:30',
        quantity: 1,
        createdAt: Date.now()
    }
];

export const storage = {
    getOffers: () => {
        const data = localStorage.getItem(STORAGE_KEY);
        if (!data) {
            // If empty, seed and save
            localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_OFFERS));
            return SEED_OFFERS;
        }
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

    resetDemo: () => {
        localStorage.removeItem(STORAGE_KEY);
        return storage.getOffers(); // Will re-seed
    }
};
