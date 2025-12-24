import React from 'react';
import { Search, Map as MapIcon, ShoppingBag, User, Heart, Star, MapPin } from 'lucide-react';
import { formatCurrency, MOCK_BAGS } from '../lib/constants';

// --- UI Components ---

export const Badge = ({ children, color = 'gray' }) => {
    const colors = {
        green: 'bg-emerald-100 text-emerald-800',
        gray: 'bg-gray-100 text-gray-800',
        red: 'bg-red-100 text-red-800',
    };
    return (
        <span className={`px-2 py-1 rounded-md text-xs font-bold ${colors[color] || colors.gray}`}>
            {children}
        </span>
    );
};

export const Button = ({ children, onClick, variant = 'primary', className = '' }) => {
    const baseStyle = "w-full py-3 px-4 rounded-xl font-bold transition-transform active:scale-95";
    const variants = {
        primary: "bg-[#00665f] text-white shadow-lg shadow-[#00665f]/30 hover:bg-[#004d47]",
        ghost: "bg-transparent text-[#00665f] hover:bg-[#00665f]/10",
    };
    return (
        <button onClick={onClick} className={`${baseStyle} ${variants[variant]} ${className}`}>
            {children}
        </button>
    );
};

export const BottomNav = ({ currentView, setView }) => {
    const navItems = [
        { id: 'HOME', icon: Search, label: 'Discover' },
        { id: 'MAP', icon: MapIcon, label: 'Map' },
        { id: 'ORDERS', icon: ShoppingBag, label: 'My Orders' },
        { id: 'PROFILE', icon: User, label: 'Profile' },
    ];

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-2 px-4 flex justify-between items-center z-50 safe-area-bottom pb-6">
            {navItems.map((item) => (
                <button
                    key={item.id}
                    onClick={() => setView(item.id)}
                    className={`flex flex-col items-center space-y-1 w-full p-2 rounded-lg transition-colors ${currentView === item.id ? 'text-[#00665f] font-medium' : 'text-gray-400 hover:text-gray-600'
                        }`}
                >
                    <item.icon size={24} strokeWidth={currentView === item.id ? 2.5 : 2} />
                    <span className="text-xs">{item.label}</span>
                </button>
            ))}
        </div>
    );
};

export const CategoryIcon = ({ category }) => {
    const emojis = {
        'Restaurant': '🍱',
        'Bakery': '🥐',
        'Grocery': '🛒',
        'Cafe': '☕',
        'Fast Food': '🍔'
    };
    return <span className="text-lg">{emojis[category] || '🛍️'}</span>;
};

export const StoreCard = ({ store, onClick }) => {
    const bag = MOCK_BAGS[store.id];
    const hasStock = bag && bag.quantity > 0;

    return (
        <div
            onClick={onClick}
            className={`bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-4 active:scale-[0.98] transition-all cursor-pointer hover:shadow-md ${!hasStock ? 'opacity-60' : ''}`}
        >
            <div className="relative h-40 w-full bg-gray-200">
                <img src={store.image} alt={store.name} className="w-full h-full object-cover" loading="lazy" />
                <div className="absolute top-3 left-3">
                    <Badge color={hasStock ? 'green' : 'gray'}>
                        {hasStock ? `${bag.quantity} left` : 'Sold out'}
                    </Badge>
                </div>
                <div className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-sm rounded-full text-gray-400 hover:text-red-500 transition-colors">
                    <Heart size={16} />
                </div>
            </div>
            <div className="p-4">
                <div className="flex justify-between items-start mb-1">
                    <h3 className="text-lg font-bold text-gray-900">{store.name}</h3>
                    <div className="flex items-center text-yellow-500">
                        <Star size={14} fill="currentColor" />
                        <span className="ml-1 text-sm font-medium text-gray-700">{store.rating}</span>
                    </div>
                </div>
                <p className="text-gray-500 text-sm mb-3 flex items-center">
                    <CategoryIcon category={store.category} />
                    <span className="mx-1">•</span>
                    {store.distanceKm} km away
                    <span className="mx-1">•</span>
                    {store.pickupStart} - {store.pickupEnd}
                </p>

                {hasStock && (
                    <div className="flex justify-between items-center mt-2 pt-3 border-t border-gray-100">
                        <span className="text-sm text-gray-400 line-through">{formatCurrency(bag.originalPrice)}</span>
                        <span className="text-lg font-bold text-[#00665f]">{formatCurrency(bag.discountPrice)}</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export const MapView = ({ stores, onStoreSelect }) => {
    return (
        <div className="h-[calc(100vh-64px)] relative bg-gray-100 w-full overflow-hidden">
            {/* Placeholder for Map Image - using a generic map pattern or Tashkent screenshot if available */}
            <div className="absolute inset-0 flex items-center justify-center text-gray-400 bg-[#e5e5e5] bg-[url('https://upload.wikimedia.org/wikipedia/commons/e/ec/Tashkent_map.png')] bg-cover opacity-60 grayscale-[30%]">
                <span className="sr-only">Map View</span>
            </div>

            {stores.map((store) => (
                <button
                    key={store.id}
                    onClick={() => onStoreSelect(store.id)}
                    className="absolute transform -translate-x-1/2 -translate-y-full hover:scale-110 transition-transform group"
                    style={{
                        // Simple simulation of lat/lng mapping to % for demo
                        // Center approx: 41.3, 69.25
                        top: `${50 + (41.3 - store.lat) * 1000}%`,
                        left: `${50 + (store.lng - 69.25) * 1000}%`
                    }}
                >
                    <div className={`flex flex-col items-center ${MOCK_BAGS[store.id].quantity > 0 ? 'text-[#00665f]' : 'text-gray-500'}`}>
                        <div className="bg-white px-2 py-1 rounded shadow-md text-xs font-bold mb-1 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                            {store.name}
                        </div>
                        <MapPin size={40} fill="currentColor" stroke="white" strokeWidth={2} className="drop-shadow-lg" />
                    </div>
                </button>
            ))}

            <div className="absolute bottom-20 left-4 right-4 bg-white/90 backdrop-blur p-3 rounded-xl text-xs text-center text-gray-500 shadow-sm border border-white">
                Simulated Map View of Tashkent
            </div>
        </div>
    );
};

export const LoadingSpinner = () => (
    <div className="w-8 h-8 border-4 border-[#00665f]/20 border-t-[#00665f] rounded-full animate-spin"></div>
);
