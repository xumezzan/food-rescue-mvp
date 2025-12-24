import OfferCard from './OfferCard';

export default function OfferList({ offers, onDelete }) {
    if (offers.length === 0) {
        return (
            <div style={{
                textAlign: 'center',
                padding: '3rem',
                color: '#888',
                background: 'white',
                borderRadius: '12px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
            }}>
                <h2>No offers found 😔</h2>
                <p>Try adjusting your filters or check back later!</p>
            </div>
        );
    }

    return (
        <div className="offer-grid">
            {offers.map(offer => (
                <OfferCard
                    key={offer.id}
                    offer={offer}
                    onDelete={onDelete}
                />
            ))}
        </div>
    );
}
