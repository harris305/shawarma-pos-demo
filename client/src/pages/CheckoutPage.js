import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import Payment from '../components/Payment';
import { useNavigate } from 'react-router-dom';

export default function CheckoutPage() {
    const { cartItems, subtotal, updateQty, clearCart } = useCart();
    const [promo, setPromo] = useState('');
    const [discount, setDiscount] = useState(0);
    const [promoApplied, setPromoApplied] = useState(false);
    const navigate = useNavigate();

    // San Antonio Sales Tax Logic
    const TAX_RATE = 0.0825;

    const handlePromo = () => {
        if (promo.toUpperCase() === 'SHAWARMA10') {
            setDiscount(subtotal * 0.1);
            setPromoApplied(true);
        } else {
            alert('Invalid promo code. Try SHAWARMA10');
            setPromoApplied(false);
        }
    };

    // Financial Calculations
    const discountedSubtotal = subtotal - discount;
    const taxAmount = discountedSubtotal * TAX_RATE;
    const grandTotal = discountedSubtotal + taxAmount;

    if (cartItems.length === 0) {
        return (
            <div className="status-screen">
                <div className="empty-cart-emoji">🛒</div>
                <h2>Your cart is empty!</h2>
                <p>Head back to the menu to find something delicious.</p>
                <button className="browse-menu-btn" onClick={() => navigate('/')}>
                    Browse Menu
                </button>
            </div>
        );
    }

    return (
        <div className="checkout-layout">
            {/* Left Column: Order Summary */}
            <div className="order-box shadow-card">
                <h2 className="section-title">Review Order</h2>
                <div className="cart-items-list">
                    {cartItems.map((item) => (
                        <div key={item.cartId} className="receipt-row">
                            <div className="item-info">
                                <span className="item-name">{item.name}</span>
                                <div className="qty-stepper">
                                    <button
                                        className={`qty-btn ${item.qty === 1 ? 'remove' : ''}`}
                                        onClick={() => updateQty(item.cartId, item.qty - 1)}
                                        title={item.qty === 1 ? 'Remove item' : 'Decrease quantity'}
                                    >
                                        {item.qty === 1 ? '✕' : '−'}
                                    </button>
                                    <span className="qty-display">{item.qty}</span>
                                    <button
                                        className="qty-btn"
                                        onClick={() => updateQty(item.cartId, item.qty + 1)}
                                        title="Increase quantity"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>
                            <span className="item-price-total">
                                ${(item.price * item.qty).toFixed(2)}
                            </span>
                        </div>
                    ))}
                </div>

                {/* Promo Section */}
                <div className="promo-wrapper">
                    <div className={`promo-input-group ${promoApplied ? 'applied' : ''}`}>
                        <input
                            className="promo-field"
                            placeholder="Enter Promo Code"
                            value={promo}
                            onChange={(e) => setPromo(e.target.value)}
                            disabled={promoApplied}
                        />
                        <button
                            className="promo-submit-btn"
                            onClick={handlePromo}
                            disabled={promoApplied}
                        >
                            {promoApplied ? 'Applied ✓' : 'Apply'}
                        </button>
                    </div>
                    {promoApplied && (
                        <p className="promo-success-msg">Nice! You saved ${discount.toFixed(2)}</p>
                    )}
                </div>
            </div>

            {/* Right Column: Final Totals & Square Payment */}
            <div className="payment-box shadow-card">
                <h2 className="section-title">Payment Detail</h2>

                <div className="price-breakdown">
                    <div className="breakdown-row">
                        <span>Subtotal</span>
                        <span>${subtotal.toFixed(2)}</span>
                    </div>

                    {discount > 0 && (
                        <div className="breakdown-row discount-text">
                            <span>Promo Discount (10%)</span>
                            <span>-${discount.toFixed(2)}</span>
                        </div>
                    )}

                    <div className="breakdown-row">
                        <span>Sales Tax (8.25%)</span>
                        <span>${taxAmount.toFixed(2)}</span>
                    </div>

                    <div className="breakdown-row grand-total-row">
                        <span>Grand Total</span>
                        <span>${grandTotal.toFixed(2)}</span>
                    </div>
                </div>

                <div className="payment-gateway-container">
                    <Payment
                        amount={Math.round(grandTotal * 100)}
                        onPaymentSuccess={() => {
                            clearCart();
                            navigate('/success');
                        }}
                    />
                </div>

                <p className="secure-text">
                    🔒 Secure payment processed via Square
                </p>
            </div>
        </div>
    );
}