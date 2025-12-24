import React, { useState, useEffect, useCallback } from 'react';
import { 
  MapPin, 
  ShoppingBag, 
  User, 
  Search, 
  Clock, 
  Star, 
  ChevronLeft, 
  CreditCard, 
  CheckCircle2, 
  Map as MapIcon,
  List,
  Heart
} from 'lucide-react';
import { Store, Order, OrderStatus, ViewState, StoreCategory } from './types';
import { MOCK_STORES, MOCK_BAGS, formatCurrency } from './constants';
import { Button, Badge, CategoryIcon, LoadingSpinner } from './components/UIComponents';
import { generateBagHint, generateReviews } from './services/geminiService';

// --- Components ---

// 1. Navigation Bar (Bottom)
const BottomNav: React.FC<{ currentView: ViewState; setView: (v: ViewState) => void }> = ({ currentView, setView }) => {
  const navItems = [
    { id: 'HOME', icon: Search, label: 'Discover' },
    { id: 'MAP', icon: MapIcon, label: 'Map' },
    { id: 'ORDERS', icon: ShoppingBag, label: 'My Orders' },
    { id: 'PROFILE', icon: User, label: 'Profile' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-2 px-4 flex justify-between items-center z-50 safe-area-bottom">
      {navItems.map((item) => (
        <button
          key={item.id}
          onClick={() => setView(item.id as ViewState)}
          className={`flex flex-col items-center space-y-1 w-full p-2 rounded-lg transition-colors ${
            currentView === item.id ? 'text-brand font-medium' : 'text-gray-400 hover:text-gray-600'
          }`}
        >
          <item.icon size={24} strokeWidth={currentView === item.id ? 2.5 : 2} />
          <span className="text-xs">{item.label}</span>
        </button>
      ))}
    </div>
  );
};

// 2. Store Card (List View)
const StoreCard: React.FC<{ store: Store; onClick: () => void }> = ({ store, onClick }) => {
  const bag = MOCK_BAGS[store.id];
  const hasStock = bag && bag.quantity > 0;

  return (
    <div 
      onClick={onClick}
      className={`bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-4 active:scale-[0.98] transition-transform cursor-pointer ${!hasStock ? 'opacity-60' : ''}`}
    >
      <div className="relative h-40 w-full">
        <img src={store.image} alt={store.name} className="w-full h-full object-cover" />
        <div className="absolute top-3 left-3">
          <Badge color={hasStock ? 'green' : 'gray'}>
            {hasStock ? `${bag.quantity} left` : 'Sold out'}
          </Badge>
        </div>
        <button className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-sm rounded-full text-gray-500 hover:text-red-500 transition-colors">
          <Heart size={16} />
        </button>
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
            <span className="text-lg font-bold text-brand-dark">{formatCurrency(bag.discountPrice)}</span>
          </div>
        )}
      </div>
    </div>
  );
};

// 3. Map View Placeholder
const MapView: React.FC<{ onStoreSelect: (id: string) => void }> = ({ onStoreSelect }) => {
  return (
    <div className="h-[calc(100vh-64px-60px)] relative bg-gray-200 w-full overflow-hidden">
        {/* Placeholder for Map Image */}
        <div className="absolute inset-0 flex items-center justify-center text-gray-400 bg-gray-200 bg-[url('https://upload.wikimedia.org/wikipedia/commons/e/ec/Tashkent_map.png')] bg-cover opacity-50">
           <span className="sr-only">Map View</span>
        </div>
        
        {MOCK_STORES.map((store) => (
            <button
                key={store.id}
                onClick={() => onStoreSelect(store.id)}
                className="absolute transform -translate-x-1/2 -translate-y-full hover:scale-110 transition-transform"
                style={{ 
                    // Simple simulation of lat/lng mapping to % for demo
                    top: `${50 + (41.3 - store.lat) * 1000}%`, 
                    left: `${50 + (store.lng - 69.25) * 1000}%` 
                }}
            >
                <div className={`flex flex-col items-center ${MOCK_BAGS[store.id].quantity > 0 ? 'text-brand' : 'text-gray-500'}`}>
                    <div className="bg-white px-2 py-1 rounded shadow text-xs font-bold mb-1 whitespace-nowrap">
                        {store.name}
                    </div>
                    <MapPin size={32} fill="currentColor" className="drop-shadow-lg" />
                </div>
            </button>
        ))}

        <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur p-3 rounded-lg text-xs text-center text-gray-500">
            Simulated Map View of Tashkent
        </div>
    </div>
  );
};

// --- Main App Logic ---

export default function App() {
  const [view, setView] = useState<ViewState>('HOME');
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // AI Generated Content State
  const [bagHint, setBagHint] = useState<string>("");
  const [isGeneratingHint, setIsGeneratingHint] = useState(false);
  const [storeReviews, setStoreReviews] = useState<any[]>([]);

  const handleStoreClick = useCallback((storeId: string) => {
    const store = MOCK_STORES.find(s => s.id === storeId);
    if (store) {
      setSelectedStore(store);
      setView('STORE_DETAIL');
      
      // Trigger AI Generation
      setIsGeneratingHint(true);
      generateBagHint(store.category, store.name).then(hint => {
        setBagHint(hint);
        setIsGeneratingHint(false);
      });
      generateReviews(store.name).then(reviews => setStoreReviews(reviews));
    }
  }, []);

  const handleReserve = () => {
    setView('CHECKOUT');
  };

  const confirmPayment = (method: 'Click' | 'Payme') => {
    if (!selectedStore) return;
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const bag = MOCK_BAGS[selectedStore.id];
      const newOrder: Order = {
        id: Math.random().toString(36).substr(2, 9),
        storeId: selectedStore.id,
        bagId: bag.id,
        status: OrderStatus.RESERVED,
        timestamp: Date.now(),
        pickupCode: Math.floor(1000 + Math.random() * 9000).toString(),
        totalPaid: bag.discountPrice
      };
      
      setOrders([newOrder, ...orders]);
      setIsLoading(false);
      setView('ORDERS');
    }, 1500);
  };

  // --- Views ---

  const renderHome = () => (
    <div className="pb-24 pt-4 px-4 max-w-md mx-auto">
      <header className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tejab Qol</h1>
          <p className="text-sm text-gray-500 flex items-center">
            <MapPin size={12} className="mr-1" /> Tashkent, Uzbekistan
          </p>
        </div>
        <div className="bg-brand-light/10 p-2 rounded-full">
           <span className="text-brand font-bold text-xs">UZS</span>
        </div>
      </header>

      {/* Categories */}
      <div className="flex space-x-3 overflow-x-auto pb-4 no-scrollbar">
        {Object.values(StoreCategory).map(cat => (
          <button key={cat} className="flex-shrink-0 px-4 py-2 bg-white border border-gray-200 rounded-full text-sm font-medium text-gray-700 whitespace-nowrap hover:border-brand hover:text-brand transition-colors">
            <CategoryIcon category={cat} /> <span className="ml-1">{cat}</span>
          </button>
        ))}
      </div>

      <h2 className="text-lg font-bold text-gray-800 mb-4 mt-2">Nearby Bags</h2>
      {MOCK_STORES.map(store => (
        <StoreCard key={store.id} store={store} onClick={() => handleStoreClick(store.id)} />
      ))}
    </div>
  );

  const renderStoreDetail = () => {
    if (!selectedStore) return null;
    const bag = MOCK_BAGS[selectedStore.id];

    return (
      <div className="bg-white min-h-screen pb-24">
        {/* Header Image */}
        <div className="relative h-64">
          <img src={selectedStore.image} className="w-full h-full object-cover" alt="store" />
          <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/50 to-transparent">
            <button onClick={() => setView('HOME')} className="text-white hover:text-gray-200">
              <ChevronLeft size={32} />
            </button>
          </div>
        </div>

        <div className="px-5 -mt-6 relative z-10 bg-white rounded-t-3xl pt-6">
          <div className="flex justify-between items-start">
            <h1 className="text-2xl font-bold text-gray-900">{selectedStore.name}</h1>
            <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-bold">
               {bag.quantity} left
            </div>
          </div>
          
          <div className="flex items-center text-sm text-gray-500 mt-2 space-x-4">
             <span className="flex items-center"><Star size={14} className="text-yellow-400 mr-1"/> {selectedStore.rating}</span>
             <span className="flex items-center"><MapPin size={14} className="mr-1"/> {selectedStore.distanceKm} km</span>
             <span className="flex items-center"><Clock size={14} className="mr-1"/> {selectedStore.pickupStart} - {selectedStore.pickupEnd}</span>
          </div>

          <hr className="my-6 border-gray-100" />

          {/* Surprise Bag Info */}
          <div className="bg-brand-light/5 rounded-2xl p-5 border border-brand/10">
            <div className="flex items-center mb-3">
              <div className="bg-brand text-white p-2 rounded-lg mr-3">
                <ShoppingBag size={24} />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Surprise Bag</h3>
                <p className="text-xs text-gray-500">Value: {formatCurrency(bag.originalPrice)}</p>
              </div>
              <div className="ml-auto text-xl font-bold text-brand-dark">
                {formatCurrency(bag.discountPrice)}
              </div>
            </div>
            
            <div className="mt-3">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">What might be inside?</h4>
                {isGeneratingHint ? (
                    <div className="flex items-center text-sm text-gray-400 animate-pulse">
                        <span className="mr-2">✨</span> Asking AI...
                    </div>
                ) : (
                    <p className="text-sm text-gray-700 italic border-l-2 border-brand pl-3">
                       "{bagHint}"
                    </p>
                )}
            </div>
          </div>

          <div className="mt-6">
             <h3 className="font-bold mb-3">About the store</h3>
             <p className="text-sm text-gray-600 leading-relaxed">{selectedStore.description}</p>
             <p className="text-sm text-gray-500 mt-2">{selectedStore.address}</p>
          </div>

          {storeReviews.length > 0 && (
              <div className="mt-6">
                  <h3 className="font-bold mb-3">Community Reviews</h3>
                  <div className="space-y-3">
                      {storeReviews.map((review, idx) => (
                          <div key={idx} className="bg-gray-50 p-3 rounded-lg text-sm">
                              <div className="flex justify-between mb-1">
                                  <span className="font-semibold">{review.user}</span>
                                  <div className="flex text-yellow-400"><Star size={12} fill="currentColor"/> <span className="text-gray-400 ml-1 text-xs">{review.rating}</span></div>
                              </div>
                              <p className="text-gray-600">"{review.text}"</p>
                          </div>
                      ))}
                  </div>
              </div>
          )}
        </div>

        {/* Sticky Reserve Button */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 safe-area-bottom z-50">
          <Button onClick={handleReserve}>Reserve for {formatCurrency(bag.discountPrice)}</Button>
        </div>
      </div>
    );
  };

  const renderCheckout = () => {
    if (!selectedStore) return null;
    const bag = MOCK_BAGS[selectedStore.id];

    if (isLoading) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-white">
          <LoadingSpinner />
          <p className="mt-4 text-gray-500 font-medium">Processing payment...</p>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <div className="bg-white p-4 shadow-sm flex items-center">
            <button onClick={() => setView('STORE_DETAIL')} className="mr-4"><ChevronLeft/></button>
            <h1 className="font-bold text-lg">Checkout</h1>
        </div>

        <div className="flex-1 p-4 space-y-4">
            <div className="bg-white p-4 rounded-xl shadow-sm">
                <h3 className="font-bold text-gray-900 mb-2">{selectedStore.name}</h3>
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>1 x Surprise Bag</span>
                    <span>{formatCurrency(bag.discountPrice)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg text-gray-900 border-t pt-2 mt-2">
                    <span>Total</span>
                    <span>{formatCurrency(bag.discountPrice)}</span>
                </div>
            </div>

            <div className="bg-white p-4 rounded-xl shadow-sm">
                <h3 className="font-bold text-gray-900 mb-4">Payment Method</h3>
                <div className="space-y-3">
                    <button onClick={() => confirmPayment('Click')} className="w-full flex items-center justify-between p-4 border rounded-xl hover:border-brand hover:bg-brand-light/5 transition-all">
                        <div className="flex items-center">
                            <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold text-xs mr-3">Click</div>
                            <span className="font-medium">Pay with Click</span>
                        </div>
                        <div className="w-4 h-4 border rounded-full border-gray-300"></div>
                    </button>
                    <button onClick={() => confirmPayment('Payme')} className="w-full flex items-center justify-between p-4 border rounded-xl hover:border-brand hover:bg-brand-light/5 transition-all">
                        <div className="flex items-center">
                            <div className="w-10 h-10 bg-teal-400 rounded-lg flex items-center justify-center text-white font-bold text-xs mr-3">Payme</div>
                            <span className="font-medium">Pay with Payme</span>
                        </div>
                        <div className="w-4 h-4 border rounded-full border-gray-300"></div>
                    </button>
                </div>
            </div>
            
            <p className="text-xs text-gray-500 text-center px-4">
                By purchasing, you agree to pick up your bag between {selectedStore.pickupStart} and {selectedStore.pickupEnd}.
            </p>
        </div>
      </div>
    );
  };

  const renderOrders = () => {
      const activeOrders = orders.filter(o => o.status === OrderStatus.RESERVED);

      return (
          <div className="pb-24 pt-4 px-4 max-w-md mx-auto min-h-screen">
              <h1 className="text-2xl font-bold text-gray-900 mb-6">My Orders</h1>
              
              {activeOrders.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                      <ShoppingBag size={48} className="mb-4 opacity-20"/>
                      <p>No active orders</p>
                      <Button variant="ghost" onClick={() => setView('HOME')} className="mt-4 text-brand">Go to Home</Button>
                  </div>
              ) : (
                  activeOrders.map(order => {
                      const store = MOCK_STORES.find(s => s.id === order.storeId);
                      if(!store) return null;
                      
                      return (
                          <div key={order.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mb-6">
                              <div className="bg-brand text-white p-4 text-center">
                                  <p className="text-sm opacity-80 mb-1">Pickup Code</p>
                                  <p className="text-3xl font-mono font-bold tracking-widest">{order.pickupCode}</p>
                              </div>
                              <div className="p-5 text-center">
                                  <div className="w-32 h-32 bg-gray-900 mx-auto rounded-xl flex items-center justify-center mb-4">
                                      {/* Mock QR Code */}
                                      <div className="grid grid-cols-5 gap-1 p-2">
                                          {[...Array(25)].map((_, i) => (
                                              <div key={i} className={`w-full h-full ${Math.random() > 0.5 ? 'bg-white' : 'bg-transparent'}`}></div>
                                          ))}
                                      </div>
                                  </div>
                                  <h3 className="font-bold text-xl mb-1">{store.name}</h3>
                                  <p className="text-gray-500 text-sm mb-4">{store.address}</p>
                                  <div className="inline-flex items-center px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-bold">
                                      Pickup: {store.pickupStart} - {store.pickupEnd}
                                  </div>
                              </div>
                              <div className="bg-gray-50 p-4 border-t border-gray-100 text-center">
                                  <button onClick={() => setView('HOME')} className="text-brand font-medium text-sm">Need help?</button>
                              </div>
                          </div>
                      );
                  })
              )}
          </div>
      )
  };

  const renderProfile = () => (
      <div className="p-4 max-w-md mx-auto">
          <h1 className="text-2xl font-bold mb-6">Profile</h1>
          <div className="bg-white rounded-xl shadow-sm p-4 flex items-center mb-6">
              <div className="w-16 h-16 bg-brand-light rounded-full flex items-center justify-center text-white text-2xl font-bold mr-4">
                  U
              </div>
              <div>
                  <h2 className="font-bold text-lg">Uzbek User</h2>
                  <p className="text-gray-500 text-sm">+998 90 123 45 67</p>
              </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm overflow-hidden divide-y divide-gray-100">
             <div className="p-4 flex justify-between items-center">
                 <span>Impact</span>
                 <Badge color="green">2 Bags Saved</Badge>
             </div>
             <div className="p-4 flex justify-between items-center">
                 <span>Money Saved</span>
                 <span className="font-bold text-brand">{formatCurrency(85000)}</span>
             </div>
             <div className="p-4 flex justify-between items-center">
                 <span>CO2 Avoided</span>
                 <span>5 kg</span>
             </div>
          </div>
          
          <button className="w-full mt-6 p-4 text-red-500 font-medium bg-white rounded-xl shadow-sm">Log Out</button>
      </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      {view === 'HOME' && renderHome()}
      {view === 'MAP' && <MapView onStoreSelect={handleStoreClick} />}
      {view === 'STORE_DETAIL' && renderStoreDetail()}
      {view === 'CHECKOUT' && renderCheckout()}
      {view === 'ORDERS' && renderOrders()}
      {view === 'PROFILE' && renderProfile()}

      {/* Show Bottom Nav only on main screens */}
      {(view === 'HOME' || view === 'MAP' || view === 'ORDERS' || view === 'PROFILE') && (
        <BottomNav currentView={view} setView={setView} />
      )}
    </div>
  );
}