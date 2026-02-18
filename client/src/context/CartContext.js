import React, { createContext, useState, useContext } from 'react';

const CartContext = createContext();

// San Antonio Tax Rate (8.25%)
const SAN_ANTONIO_TAX = 0.0825;

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);

    const addToCart = (product, selectedOptions = []) => {
        const optionsKey = selectedOptions.map(o => o.name).sort().join(',');
        const uniqueId = `${product.id}-${optionsKey}`;

        setCartItems(prev => {
            const exists = prev.find(i => i.cartId === uniqueId);
            if (exists) {
                return prev.map(i => i.cartId === uniqueId ? { ...i, qty: i.qty + 1 } : i);
            }
            return [...prev, {
                ...product,
                cartId: uniqueId,
                qty: 1,
                selectedOptions,
                totalPrice: product.price + selectedOptions.reduce((acc, o) => acc + o.price, 0)
            }];
        });
    };

    const updateQty = (cartId, newQty) => {
        if (newQty < 1) {
            setCartItems(prev => prev.filter(i => i.cartId !== cartId));
        } else {
            setCartItems(prev => prev.map(i => i.cartId === cartId ? { ...i, qty: newQty } : i));
        }
    };

    const removeFromCart = (cartId) => {
        setCartItems(prev => prev.filter(i => i.cartId !== cartId));
    };

    const clearCart = () => setCartItems([]);

    // Calculation Logic
    const subtotal = cartItems.reduce((acc, item) => acc + (item.totalPrice * item.qty), 0);
    const taxTotal = subtotal * SAN_ANTONIO_TAX;
    const grandTotal = subtotal + taxTotal;

    return (
        <CartContext.Provider value={{
            cartItems,
            addToCart,
            updateQty,
            removeFromCart,
            clearCart,
            subtotal,
            taxTotal,
            grandTotal
        }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);