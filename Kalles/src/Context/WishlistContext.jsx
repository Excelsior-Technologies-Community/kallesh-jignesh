import React, { createContext, useContext, useState, useEffect } from 'react';

const WishlistContext = createContext();

export const useWishlist = () => useContext(WishlistContext);

export const WishlistProvider = ({ children }) => {
    // Get current user ID to scope the wishlist
    const getUserId = () => {
        const user = JSON.parse(localStorage.getItem('user') || 'null');
        return user?.id || 'guest';
    };

    const [wishlistItems, setWishlistItems] = useState(() => {
        const user = JSON.parse(localStorage.getItem('user') || 'null');
        const userId = user?.id || 'guest';
        const savedWishlist = localStorage.getItem(`kalles_wishlist_${userId}`);
        return savedWishlist ? JSON.parse(savedWishlist) : [];
    });

    // Load user-specific wishlist on mount
    useEffect(() => {
        const userId = getUserId();
        const savedWishlist = localStorage.getItem(`kalles_wishlist_${userId}`);
        if (savedWishlist) {
            setWishlistItems(JSON.parse(savedWishlist));
        } else {
            setWishlistItems([]);
        }

        // Listen for storage changes (login/logout in other tabs)
        const handleStorageChange = (e) => {
            if (e.key === 'user' || e.key === null) { // null means clear() was called
                const newUserId = getUserId();
                const userWishlist = localStorage.getItem(`kalles_wishlist_${newUserId}`);
                setWishlistItems(userWishlist ? JSON.parse(userWishlist) : []);
            }
        };
        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    // Save wishlist whenever it changes
    useEffect(() => {
        const userId = getUserId();
        localStorage.setItem(`kalles_wishlist_${userId}`, JSON.stringify(wishlistItems));
    }, [wishlistItems]);

    const addToWishlist = (product) => {
        setWishlistItems(prevItems => {
            const isExist = prevItems.find(item => item.id === product.id);
            if (!isExist) {
                return [...prevItems, product];
            }
            return prevItems;
        });
    };

    const removeFromWishlist = (productId) => {
        setWishlistItems(prevItems => prevItems.filter(item => String(item.id) !== String(productId)));
    };

    const toggleWishlist = (product) => {
        setWishlistItems(prevItems => {
            const isExist = prevItems.find(item => String(item.id) === String(product.id));
            if (isExist) {
                return prevItems.filter(item => String(item.id) !== String(product.id));
            } else {
                return [...prevItems, product];
            }
        });
    };

    const isInWishlist = (productId) => {
        return wishlistItems.some(item => String(item.id) === String(productId));
    };

    const reloadWishlist = () => {
        const userId = getUserId();
        const savedWishlist = localStorage.getItem(`kalles_wishlist_${userId}`);
        setWishlistItems(savedWishlist ? JSON.parse(savedWishlist) : []);
    };

    const clearWishlist = () => {
        setWishlistItems([]);
        const userId = getUserId();
        localStorage.removeItem(`kalles_wishlist_${userId}`);
    };

    const wishlistCount = wishlistItems.length;

    return (
        <WishlistContext.Provider value={{
            wishlistItems,
            addToWishlist,
            removeFromWishlist,
            toggleWishlist,
            isInWishlist,
            reloadWishlist,
            clearWishlist,
            wishlistCount
        }}>
            {children}
        </WishlistContext.Provider>
    );
};
