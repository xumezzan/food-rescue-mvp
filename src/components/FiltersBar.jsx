import { useState } from 'react';

export default function FiltersBar({ filters, setFilters }) {
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    return (
        <div className="filters-bar">
            <input
                type="text"
                name="search"
                placeholder="Search offers or places..."
                className="search-input"
                value={filters.search}
                onChange={handleChange}
            />

            <select
                name="category"
                className="filter-select"
                value={filters.category}
                onChange={handleChange}
            >
                <option value="All">All Categories</option>
                <option value="Bakery">Bakery</option>
                <option value="Restaurant">Restaurant</option>
                <option value="Cafe">Cafe</option>
                <option value="Grocery">Grocery</option>
                <option value="Other">Other</option>
            </select>

            <select
                name="sortBy"
                className="filter-select"
                value={filters.sortBy}
                onChange={handleChange}
            >
                <option value="newest">Newest</option>
                <option value="cheapest">Cheapest</option>
                <option value="closest">Closest (Demo)</option>
            </select>
        </div>
    );
}
