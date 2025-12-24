import { formatCurrency, calculateDiscount } from '../lib/utils';

export default function OfferCard({ offer, onDelete }) {
    const discount = calculateDiscount(offer.price, offer.originalValue);

    return (
        <div className="offer-card">
            <div className="card-header">
                {/* Simple visual placeholders based on category */}
                {offer.category === 'Bakery' && '🥐'}
                {offer.category === 'Cafe' && '☕'}
                {offer.category === 'Restaurant' && '🍱'}
                {offer.category === 'Grocery' && '🛒'}
                {offer.category === 'Other' && '🛍️'}

                {discount > 0 && (
                    <div className="discount-badge">-{discount}%</div>
                )}
            </div>

            <div className="card-body">
                <div className="card-meta">
                    <span className="category-tag">{offer.category}</span>
                    <span>{offer.quantity} left</span>
                </div>

                <h3 className="offer-title">{offer.title}</h3>
                <p className="offer-place">📍 {offer.place}</p>

                <div className="pickup-info">
                    Collect today: <strong>{offer.pickupFrom} - {offer.pickupTo}</strong>
                </div>

                <div className="price-row">
                    <span className="current-price">{formatCurrency(offer.price)}</span>
                    {offer.originalValue > offer.price && (
                        <span className="original-price">{formatCurrency(offer.originalValue)}</span>
                    )}
                </div>

                <div className="card-footer">
                    <button
                        className="btn-danger"
                        onClick={() => {
                            if (window.confirm('Delete this offer?')) onDelete(offer.id);
                        }}
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
}
