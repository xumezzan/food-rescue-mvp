import { useState, useEffect, useMemo } from 'react';
import { storage } from './lib/storage';
import OfferList from './components/OfferList';
import OfferForm from './components/OfferForm';
import FiltersBar from './components/FiltersBar';
import './index.css';

function App() {
  const [offers, setOffers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    category: 'All',
    sortBy: 'newest'
  });

  // Load initial data
  useEffect(() => {
    setOffers(storage.getOffers());
  }, []);

  const handleCreate = (newOffer) => {
    const updated = storage.addOffer(newOffer);
    setOffers(updated);
    setShowForm(false);
  };

  const handleDelete = (id) => {
    const updated = storage.deleteOffer(id);
    setOffers(updated);
  };

  const handleReset = () => {
    if (window.confirm('Reset all data to default demo offers?')) {
      setOffers(storage.resetDemo());
      setFilters({ search: '', category: 'All', sortBy: 'newest' });
    }
  };

  // Filter & Sort Logic
  const filteredOffers = useMemo(() => {
    let result = [...offers];

    // Filter by Search
    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(o =>
        o.title.toLowerCase().includes(q) ||
        o.place.toLowerCase().includes(q)
      );
    }

    // Filter by Category
    if (filters.category !== 'All') {
      result = result.filter(o => o.category === filters.category);
    }

    // Sort
    if (filters.sortBy === 'newest') {
      result.sort((a, b) => b.createdAt - a.createdAt);
    } else if (filters.sortBy === 'cheapest') {
      result.sort((a, b) => a.price - b.price);
    } else if (filters.sortBy === 'closest') {
      // Fake logic for demo: sort by place name length (random-ish)
      result.sort((a, b) => a.place.length - b.place.length);
    }

    return result;
  }, [offers, filters]);

  return (
    <div>
      <header>
        <div className="logo">
          <h1>🥡 Food Rescue UZ</h1>
          <span>Save food, save money, save the planet.</span>
        </div>
        <button className="btn-primary" onClick={() => setShowForm(true)}>
          + Add Offer
        </button>
      </header>

      <main>
        <FiltersBar filters={filters} setFilters={setFilters} />

        <div style={{ marginBottom: '1rem', color: '#666' }}>
          Found {filteredOffers.length} {filteredOffers.length === 1 ? 'offer' : 'offers'} near Tashkent
        </div>

        <OfferList offers={filteredOffers} onDelete={handleDelete} />
      </main>

      <footer>
        <p>Food Rescue MVP — Open Source Demo</p>
        <p>
          Data is stored locally in your browser.
          <button onClick={handleReset} className="reset-link">
            Reset Demo Data
          </button>
        </p>
      </footer>

      {showForm && (
        <OfferForm
          onSubmit={handleCreate}
          onClose={() => setShowForm(false)}
        />
      )}
    </div>
  );
}

export default App;
