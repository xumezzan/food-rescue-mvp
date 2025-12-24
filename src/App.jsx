import { useState, useCallback, useEffect } from 'react';
import { MapPin, ChevronLeft, ShoppingBag, Star, Clock, Home } from 'lucide-react';
import { storage } from './lib/storage';
import { MOCK_STORES, MOCK_BAGS, StoreCategory, formatCurrency } from './lib/constants';
import { BottomNav, StoreCard, MapView, Button, Badge, LoadingSpinner, CategoryIcon } from './components/TejabUI';
import { generateBagHint, generateReviews } from './services/geminiService';
import './index.css';

// Main App Component adapted from Tejab Qol
export default function App() {
  const [view, setView] = useState('HOME');
  const [selectedStore, setSelectedStore] = useState(null);
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // AI/Dynamic Content State
  const [bagHint, setBagHint] = useState("");
  const [isGeneratingHint, setIsGeneratingHint] = useState(false);
  const [storeReviews, setStoreReviews] = useState([]);

  // Init Data
  useEffect(() => {
    setOrders(storage.getOrders());
  }, []);

  const handleStoreClick = useCallback((storeId) => {
    const store = MOCK_STORES.find(s => s.id === storeId);
    if (store) {
      setSelectedStore(store);
      setView('STORE_DETAIL');

      // Trigger AI Generation (Mocked for now)
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

  const confirmPayment = (method) => {
    if (!selectedStore) return;
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      const bag = MOCK_BAGS[selectedStore.id];
      const newOrder = {
        id: Math.random().toString(36).substr(2, 9),
        storeId: selectedStore.id,
        bagId: bag.id,
        status: 'RESERVED',
        timestamp: Date.now(),
        pickupCode: Math.floor(1000 + Math.random() * 9000).toString(),
        totalPaid: bag.discountPrice
      };

      // Persist order
      const updatedOrders = storage.saveOrder(newOrder);
      setOrders(updatedOrders);

      setIsLoading(false);
      setView('ORDERS');
    }, 1500);
  };

  const [filterCategory, setFilterCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const renderHome = () => {
    // Filter logic
    const filteredStores = MOCK_STORES.filter(store => {
      const matchesCategory = filterCategory === 'All' || store.category === filterCategory;
      const matchesSearch = store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        store.category.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });

    return (
      <div className="pb-24 pt-4 px-4 max-w-md mx-auto">
        <header className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Tejab Qol</h1>
            <p className="text-sm text-gray-500 flex items-center">
              <MapPin size={12} className="mr-1" /> Tashkent, Uzbekistan
            </p>
          </div>
          <div className="bg-[#00665f]/10 p-2 rounded-full">
            <span className="text-[#00665f] font-bold text-xs">UZS</span>
          </div>
        </header>

        {/* Search Bar */}
        <div className="mb-6 relative">
          <input
            type="text"
            placeholder="Search stores..."
            className="w-full pl-10 pr-4 py-3 rounded-xl border-none bg-white shadow-sm focus:ring-2 focus:ring-[#00665f] focus:outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="absolute left-3 top-3.5 text-gray-400">
            <Home size={20} className="hidden" /> {/* keeping import valid, hacky but safe */}
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
          </div>
        </div>

        {/* Categories */}
        <div className="flex space-x-3 overflow-x-auto pb-4 no-scrollbar">
          <button
            className={`flex-shrink-0 px-4 py-2 border rounded-full text-sm font-medium whitespace-nowrap transition-colors shadow-sm ${filterCategory === 'All' ? 'bg-[#00665f] text-white border-transparent' : 'bg-white border-gray-200 text-gray-700 hover:border-[#00665f]'}`}
            onClick={() => setFilterCategory('All')}
          >
            All
          </button>
          {Object.values(StoreCategory).map(cat => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat === filterCategory ? 'All' : cat)}
              className={`flex-shrink-0 px-4 py-2 border rounded-full text-sm font-medium whitespace-nowrap transition-colors shadow-sm ${filterCategory === cat ? 'bg-[#00665f] text-white border-transparent' : 'bg-white border-gray-200 text-gray-700 hover:border-[#00665f]'}`}
            >
              <CategoryIcon category={cat} /> <span className="ml-1">{cat}</span>
            </button>
          ))}
        </div>

        <h2 className="text-lg font-bold text-gray-800 mb-4 mt-2">
          {searchTerm || filterCategory !== 'All' ? 'Results' : 'Nearby Bags'}
        </h2>

        {filteredStores.length === 0 ? (
          <div className="text-center py-10 text-gray-500">
            <p>No stores found 😔</p>
          </div>
        ) : (
          filteredStores.map(store => (
            <StoreCard key={store.id} store={store} onClick={() => handleStoreClick(store.id)} />
          ))
        )}
      </div>
    );
  };

  const renderStoreDetail = () => {
    if (!selectedStore) return null;
    const bag = MOCK_BAGS[selectedStore.id];

    return (
      <div className="bg-white min-h-screen pb-24">
        {/* Header Image */}
        <div className="relative h-64">
          <img src={selectedStore.image} className="w-full h-full object-cover" alt="store" />
          <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/50 to-transparent">
            <button onClick={() => setView('HOME')} className="text-white hover:text-gray-200 bg-black/20 p-2 rounded-full backdrop-blur-sm">
              <ChevronLeft size={32} />
            </button>
          </div>
        </div>

        <div className="px-5 -mt-6 relative z-10 bg-white rounded-t-3xl pt-6 shadow-[0_-5px_20px_rgba(0,0,0,0.1)]">
          <div className="flex justify-between items-start">
            <h1 className="text-2xl font-bold text-gray-900">{selectedStore.name}</h1>
            <div className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-sm font-bold">
              {bag.quantity} left
            </div>
          </div>

          <div className="flex items-center text-sm text-gray-500 mt-2 space-x-4">
            <span className="flex items-center"><Star size={14} className="text-yellow-400 mr-1" /> {selectedStore.rating}</span>
            <span className="flex items-center"><MapPin size={14} className="mr-1" /> {selectedStore.distanceKm} km</span>
            <span className="flex items-center"><Clock size={14} className="mr-1" /> {selectedStore.pickupStart} - {selectedStore.pickupEnd}</span>
          </div>

          <hr className="my-6 border-gray-100" />

          {/* Surprise Bag Info */}
          <div className="bg-[#00665f]/5 rounded-2xl p-5 border border-[#00665f]/10">
            <div className="flex items-center mb-3">
              <div className="bg-[#00665f] text-white p-2 rounded-lg mr-3">
                <ShoppingBag size={24} />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Surprise Bag</h3>
                <p className="text-xs text-gray-500">Value: {formatCurrency(bag.originalPrice)}</p>
              </div>
              <div className="ml-auto text-xl font-bold text-[#00665f]">
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
                <p className="text-sm text-gray-700 italic border-l-2 border-[#00665f] pl-3">
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
                      <div className="flex text-yellow-400"><Star size={12} fill="currentColor" /> <span className="text-gray-400 ml-1 text-xs">{review.rating}</span></div>
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
          <button onClick={() => setView('STORE_DETAIL')} className="mr-4"><ChevronLeft /></button>
          <h1 className="font-bold text-lg">Checkout</h1>
        </div>

        <div className="flex-1 p-4 space-y-4">
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
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

          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-900 mb-4">Payment Method</h3>
            <div className="space-y-3">
              <button onClick={() => confirmPayment('Click')} className="w-full flex items-center justify-between p-4 border rounded-xl hover:border-[#00665f] hover:bg-[#00665f]/5 transition-all">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold text-xs mr-3">Click</div>
                  <span className="font-medium">Pay with Click</span>
                </div>
                <div className="w-4 h-4 border rounded-full border-gray-300"></div>
              </button>
              <button onClick={() => confirmPayment('Payme')} className="w-full flex items-center justify-between p-4 border rounded-xl hover:border-[#00665f] hover:bg-[#00665f]/5 transition-all">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-teal-400 rounded-lg flex items-center justify-center text-white font-bold text-xs mr-3">Payme</div>
                  <span className="font-medium">Pay with Payme</span>
                </div>
                <div className="w-4 h-4 border rounded-full border-gray-300"></div>
              </button>
            </div>
          </div>

          <p className="text-xs text-gray-500 text-center px-4 mt-8">
            By purchasing, you agree to pick up your bag between {selectedStore.pickupStart} and {selectedStore.pickupEnd}.
          </p>
        </div>
      </div>
    );
  };

  const renderOrders = () => {
    // Sort by timestamp desc
    const userOrders = [...orders].sort((a, b) => b.timestamp - a.timestamp);

    return (
      <div className="pb-24 pt-4 px-4 max-w-md mx-auto min-h-screen">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">My Orders</h1>

        {userOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-400">
            <ShoppingBag size={48} className="mb-4 opacity-20" />
            <p>No active orders</p>
            <Button variant="ghost" onClick={() => setView('HOME')} className="mt-4 text-[#00665f]">Go to Home</Button>
          </div>
        ) : (
          userOrders.map(order => {
            const store = MOCK_STORES.find(s => s.id === order.storeId);
            if (!store) return null;

            return (
              <div key={order.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mb-6">
                <div className="bg-[#00665f] text-white p-4 text-center">
                  <p className="text-sm opacity-80 mb-1">Pickup Code</p>
                  <p className="text-3xl font-mono font-bold tracking-widest">{order.pickupCode}</p>
                </div>
                <div className="p-5 text-center">
                  <div className="w-32 h-32 bg-gray-900 mx-auto rounded-xl flex items-center justify-center mb-4 overflow-hidden relative">
                    {/* Simulated QR Code Pattern */}
                    <div className="absolute inset-0 grid grid-cols-4 gap-1 p-2 opacity-50">
                      {[...Array(16)].map((_, i) => (
                        <div key={i} className={`w-full h-full ${Math.random() > 0.4 ? 'bg-white' : 'bg-transparent'}`}></div>
                      ))}
                    </div>
                    <div className="z-10 bg-white p-1 rounded">
                      <ShoppingBag size={20} />
                    </div>
                  </div>
                  <h3 className="font-bold text-xl mb-1">{store.name}</h3>
                  <p className="text-gray-500 text-sm mb-4">{store.address}</p>
                  <div className="inline-flex items-center px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-bold">
                    Pickup: {store.pickupStart} - {store.pickupEnd}
                  </div>
                </div>
                <div className="bg-gray-50 p-4 border-t border-gray-100 text-center">
                  <button className="text-[#00665f] font-medium text-sm">Need help?</button>
                </div>
              </div>
            );
          })
        )}

        <div className="mt-8 text-center">
          <button
            className="text-xs text-red-300 underline"
            onClick={() => {
              if (window.confirm("Clear all orders?")) {
                storage.resetDemo();
                setOrders([]);
              }
            }}
          >
            Reset Demo Data
          </button>
        </div>
      </div>
    )
  };

  const renderProfile = () => (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-6">Profile</h1>
      <div className="bg-white rounded-xl shadow-sm p-4 flex items-center mb-6">
        <div className="w-16 h-16 bg-[#00665f]/10 rounded-full flex items-center justify-center text-[#00665f] text-2xl font-bold mr-4">
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
          <Badge color="green">{orders.length} Bags Saved</Badge>
        </div>
        <div className="p-4 flex justify-between items-center">
          <span>Money Saved</span>
          <span className="font-bold text-[#00665f]">{formatCurrency(orders.reduce((acc, o) => acc + o.totalPaid, 0))}</span>
        </div>
        <div className="p-4 flex justify-between items-center">
          <span>CO2 Avoided</span>
          <span>{orders.length * 2.5} kg</span>
        </div>
      </div>

      <button className="w-full mt-6 p-4 text-red-500 font-medium bg-white rounded-xl shadow-sm hover:bg-red-50 transition-colors">Log Out</button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900 pb-safe">
      {view === 'HOME' && renderHome()}
      {view === 'MAP' && <MapView stores={MOCK_STORES} onStoreSelect={handleStoreClick} />}
      {view === 'STORE_DETAIL' && renderStoreDetail()}
      {view === 'CHECKOUT' && renderCheckout()}
      {view === 'ORDERS' && renderOrders()}
      {view === 'PROFILE' && renderProfile()}

      {/* Show Bottom Nav only on main screens (not checkout/detail) */}
      {['HOME', 'MAP', 'ORDERS', 'PROFILE'].includes(view) && (
        <BottomNav currentView={view} setView={setView} />
      )}
    </div>
  );
}
