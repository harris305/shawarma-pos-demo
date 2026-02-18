import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { CartProvider, useCart } from './context/CartContext';
import MenuPage from './pages/MenuPage';
import CheckoutPage from './pages/CheckoutPage';
import SuccessPage from './pages/SuccessPage';
import './App.css';

function Navbar() {
    const { cartItems, subtotal } = useCart();
    const count = cartItems.reduce((acc, item) => acc + item.qty, 0);

    return (
        <nav className="navbar">
            <Link to="/" className="logo">🥙 Shawarma Station</Link>

            <Link to="/checkout" className="cart-pill-link">
                <div className="cart-pill">
                    <span className="cart-icon">🛒</span>
                    <div className="cart-details">
                        <span className="cart-count">{count} {count === 1 ? 'item' : 'items'}</span>
                        <span className="cart-divider">|</span>
                        <span className="cart-subtotal">${subtotal.toFixed(2)}</span>
                    </div>
                </div>
            </Link>
        </nav>
    );
}

function Footer() {
    return (
        <footer className="site-footer">
            <p>© {new Date().getFullYear()} <span>Shawarma Station</span> — Handcrafted with ❤️ in San Antonio</p>
        </footer>
    );
}

function App() {
    return (
        <CartProvider>
            <Router>
                <Navbar />
                <main>
                    <Routes>
                        <Route path="/" element={<MenuPage />} />
                        <Route path="/checkout" element={<CheckoutPage />} />
                        <Route path="/success" element={<SuccessPage />} />
                    </Routes>
                </main>
                <Footer />
            </Router>
        </CartProvider>
    );
}
export default App;