import React, { useState } from 'react';
import { useCart } from '../context/CartContext';

const MENU_ITEMS = [
    { id: 1, name: 'The OG Chicken', price: 10.99, desc: 'House-rubbed chicken with velvet garlic toum, pickles, and crisp fries tucked inside.', img: 'https://images.unsplash.com/photo-1561651823-34feb02250e4?auto=format&fit=crop&w=600', popular: true },
    { id: 2, name: 'Saffron Beef', price: 12.50, desc: 'Slow-turned beef doner with sumac-marinated onions and fire-charred tomatoes.', img: 'https://images.unsplash.com/photo-1626700051175-656fc74e0b63?auto=format&fit=crop&w=600' },
    { id: 3, name: 'Green Goddess Falafel', price: 9.50, desc: 'Herb-infused falafels with smoky hummus and pickled purple turnips.', img: 'https://images.unsplash.com/photo-1593001874117-c99c4fe63203?auto=format&fit=crop&w=600' }
];

const UPSELL_ITEMS = [
    { id: 101, name: 'Seasoned Fries', price: 3.50, desc: "Za'atar spiced" },
    { id: 102, name: 'Artisan Baklava', price: 4.00, desc: 'Pistachio & honey' }
];

export default function MenuPage() {
    const [query, setQuery] = useState('');
    const { addToCart } = useCart();

    const filtered = MENU_ITEMS.filter(i => i.name.toLowerCase().includes(query.toLowerCase()));

    return (
        <div className="container">
            <div className="hero-section">
                <h1>Handcrafted Shawarma</h1>
                <p className="hero-subtitle">Traditional recipes, modern soul.</p>
                <div className="search-wrapper">
                    <span className="search-icon">🔍</span>
                    <input
                        className="main-search"
                        placeholder="Search our menu..."
                        onChange={e => setQuery(e.target.value)}
                    />
                </div>
            </div>

            <div className="menu-grid">
                {filtered.map(item => (
                    <div key={item.id} className="menu-card">
                        {item.popular && <span className="popular-badge">Popular</span>}
                        <div className="card-img-wrapper">
                            <img src={item.img} alt={item.name} />
                        </div>
                        <div className="card-content">
                            <h3>{item.name}</h3>
                            <p>{item.desc}</p>
                            <div className="price-action">
                                <span className="item-price">${item.price.toFixed(2)}</span>
                                <button className="add-button" onClick={() => addToCart(item)}>Add to Order</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Upsell Section */}
            <section className="upsell-section">
                <h2>Complete Your Meal</h2>
                <div className="upsell-grid">
                    {UPSELL_ITEMS.map(side => (
                        <div key={side.id} className="upsell-card">
                            <h4>{side.name}</h4>
                            <p>{side.desc}</p>
                            <button className="add-button" onClick={() => addToCart(side)}>
                                + Add ${side.price.toFixed(2)}
                            </button>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}