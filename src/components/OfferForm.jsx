import { useState } from 'react';

export default function OfferForm({ onSubmit, onClose }) {
    const [formData, setFormData] = useState({
        title: '',
        place: '',
        category: 'Bakery',
        price: '',
        originalValue: '',
        pickupFrom: '18:00',
        pickupTo: '19:00',
        quantity: 1
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Basic validation
        if (!formData.title || !formData.place) return;

        onSubmit({
            ...formData,
            price: Number(formData.price),
            originalValue: Number(formData.originalValue),
            quantity: Number(formData.quantity)
        });
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <h2>Add Surplus Offer</h2>
                <p style={{ marginBottom: '1rem', color: '#666' }}>Merchant Demo Mode</p>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Title</label>
                        <input
                            name="title"
                            required
                            placeholder="e.g. Surprise Bag"
                            value={formData.title}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-group">
                        <label>Place / Store Name</label>
                        <input
                            name="place"
                            required
                            placeholder="e.g. Tashkent Bakery"
                            value={formData.place}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-group">
                        <label>Category</label>
                        <select name="category" value={formData.category} onChange={handleChange}>
                            <option value="Bakery">Bakery</option>
                            <option value="Restaurant">Restaurant</option>
                            <option value="Cafe">Cafe</option>
                            <option value="Grocery">Grocery</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <div className="form-group" style={{ flex: 1 }}>
                            <label>Price (UZS)</label>
                            <input
                                type="number"
                                name="price"
                                required
                                min="0"
                                value={formData.price}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-group" style={{ flex: 1 }}>
                            <label>Original Value (UZS)</label>
                            <input
                                type="number"
                                name="originalValue"
                                min="0"
                                value={formData.originalValue}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <div className="form-group" style={{ flex: 1 }}>
                            <label>Pickup From</label>
                            <input
                                type="time"
                                name="pickupFrom"
                                required
                                value={formData.pickupFrom}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-group" style={{ flex: 1 }}>
                            <label>Pickup To</label>
                            <input
                                type="time"
                                name="pickupTo"
                                required
                                value={formData.pickupTo}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Quantity</label>
                        <input
                            type="number"
                            name="quantity"
                            required
                            min="1"
                            value={formData.quantity}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-actions">
                        <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
                        <button type="submit" className="btn-primary">Add Offer</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
