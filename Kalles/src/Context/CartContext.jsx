import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    // Get current user ID to scope the cart
    const getUserId = () => {
        const user = JSON.parse(localStorage.getItem('user') || 'null');
        return user?.id || 'guest';
    };

    const [cartItems, setCartItems] = useState(() => {
        const user = JSON.parse(localStorage.getItem('user') || 'null');
        const userId = user?.id || 'guest';
        const savedCart = localStorage.getItem(`kalles_cart_${userId}`);
        return savedCart ? JSON.parse(savedCart) : [];
    });
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [discount, setDiscount] = useState(0); 
    const [appliedCoupon, setAppliedCoupon] = useState('');

    // Whenever user changes, sync the state with their specific cart
    useEffect(() => {
        const userId = getUserId();
        const savedCart = localStorage.getItem(`kalles_cart_${userId}`);
        setCartItems(savedCart ? JSON.parse(savedCart) : []);
        
        const handleStorageChange = (e) => {
            if (e.key === 'user') {
                const newUserId = getUserId();
                const userCart = localStorage.getItem(`kalles_cart_${newUserId}`);
                setCartItems(userCart ? JSON.parse(userCart) : []);
            }
        };
        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    // Also watch for login/logout in the same tab by checking localStorage periodically or via custom event
    // For now, we'll rely on the Navbar calling a manual refresh or just regular re-render if user is part of context
    // Actually, let's add a manual clear method and a reload method
    
    useEffect(() => {
        const userId = getUserId();
        localStorage.setItem(`kalles_cart_${userId}`, JSON.stringify(cartItems));
    }, [cartItems]);

    const addToCart = (product, quantity, size) => {
        setCartItems(prevItems => {
            const existingItemIndex = prevItems.findIndex(
                item => item.id === product.id && item.selectedSize === size
            );

            if (existingItemIndex !== -1) {
                const updatedItems = [...prevItems];
                updatedItems[existingItemIndex].quantity += quantity;
                return updatedItems;
            }

            return [...prevItems, { ...product, price: Number(product.price), quantity, selectedSize: size }];
        });
        setIsCartOpen(true);
    };

    const removeFromCart = (productId, size) => {
        setCartItems(prevItems =>
            prevItems.filter(item => !(item.id === productId && item.selectedSize === size))
        );
    };

    const updateQuantity = (productId, size, delta) => {
        setCartItems(prevItems => {
            return prevItems.map(item => {
                if (item.id === productId && item.selectedSize === size) {
                    const newQty = Math.max(1, item.quantity + delta);
                    return { ...item, quantity: newQty };
                }
                return item;

            });
        });
    };

    const toggleCart = () => setIsCartOpen(!isCartOpen);
    const openCart = () => setIsCartOpen(true);
    const closeCart = () => setIsCartOpen(false);

    const clearCart = () => {
        setCartItems([]);
        setDiscount(0);
        setAppliedCoupon('');
        const userId = getUserId();
        localStorage.removeItem(`kalles_cart_${userId}`);
    };

    // Manual reload for when login happens
    const reloadCart = () => {
        const userId = getUserId();
        const savedCart = localStorage.getItem(`kalles_cart_${userId}`);
        setCartItems(savedCart ? JSON.parse(savedCart) : []);
    };

    const applyDiscount = (percent, code) => {
        setDiscount(percent);
        setAppliedCoupon(code);
    };

    const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
    const cartTotal = cartItems.reduce((acc, item) => acc + (Number(item.price) * item.quantity), 0);

    return (
        <CartContext.Provider value={{
            cartItems,
            isCartOpen,
            addToCart,
            removeFromCart,
            updateQuantity,
            toggleCart,
            openCart,
            closeCart,
            clearCart,
            reloadCart, // Added this
            cartCount,
            cartTotal,
            discount,
            appliedCoupon,
            applyDiscount
        }}>
            {children}
        </CartContext.Provider>
    );
};
