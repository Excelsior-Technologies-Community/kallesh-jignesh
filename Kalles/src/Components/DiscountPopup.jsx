import React, { useState, useEffect } from 'react';
import { X, Search } from 'lucide-react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useCurrency } from '../Context/CurrencyContext';

const DiscountPopup = ({ isOpen, onClose }) => {
    const { formatPrice } = useCurrency();
    const [recommendedProducts, setRecommendedProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (isOpen) {
            const fetchProducts = async () => {
                try {
                    setLoading(true);
                    const response = await axios.get('http://localhost:5000/api/products');
                    
                    if (response.data && response.data.length > 0) {
                        // Get random 3 products for recommendation
                        const shuffled = [...response.data].sort(() => 0.5 - Math.random());
                        setRecommendedProducts(shuffled.slice(0, 3));
                    } else {
                        // Use fallback products if API returns empty
                        setRecommendedProducts(FALLBACK_PRODUCTS);
                    }
                    setLoading(false);
                } catch (error) {
                    console.error("Error fetching products for popup:", error);
                    // Use fallback products on error
                    setRecommendedProducts(FALLBACK_PRODUCTS);
                    setLoading(false);
                }
            };
            fetchProducts();
        }
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[3000] flex items-center justify-center p-4">
            {/* Overlay */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-[2px] animate-in fade-in duration-300"
                onClick={onClose}
            ></div>

            {/* Modal Content */}
            <div className="relative bg-white w-full max-w-[900px] overflow-hidden shadow-2xl animate-in zoom-in duration-300 flex flex-col md:flex-row min-h-[500px]">

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-0 right-0 z-50 w-10 h-10 bg-black text-white flex items-center justify-center hover:bg-gray-800 transition-colors"
                >
                    <X size={20} />
                </button>

                {/* Left Side - Promo Content */}
                <div className="w-full md:w-[55%] relative flex items-center justify-center p-8 text-white">
                    {/* Background Image with Overlay */}
                    <div className="absolute inset-0 z-0">
                        <img
                            src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1000&auto=format&fit=crop"
                            alt="Promo Background"
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/30"></div>
                    </div>

                    <div className="relative z-10 text-center max-w-[320px]">
                        <h2 className="text-[36px] md:text-[42px] font-bold mb-2 leading-tight">
                            Wait! before you leave...
                        </h2>
                        <p className="text-[14px] mb-8 font-medium">
                            Get 15% off for your first order
                        </p>

                        <div className="border border-white/50 py-3 px-6 mb-8 inline-block">
                            <span className="text-[20px] font-bold tracking-[2px]">CODE15OFF</span>
                        </div>

                        <p className="text-[12px] opacity-80 mb-10 leading-relaxed">
                            Use above code to get 15% OFF for your first order when checkout
                        </p>

                        <button
                            onClick={onClose}
                            className="w-full h-[52px] bg-[#56cfe1] hover:bg-white hover:text-black text-white font-bold text-[14px] uppercase tracking-widest transition-all rounded-full"
                        >
                            GRAB THE DISCOUNT
                        </button>
                    </div>
                </div>

                {/* Right Side - Recommended Products */}
                <div className="w-full md:w-[45%] p-8 md:p-10 bg-white flex flex-col justify-center">
                    <h3 className="text-[20px] font-bold text-[#222] mb-8">
                        Recommended Products
                    </h3>

                    <div className="space-y-6">
                        {loading ? (
                            [...Array(3)].map((_, i) => (
                                <div key={i} className="flex gap-4 animate-pulse">
                                    <div className="w-20 h-24 bg-gray-200 shrink-0"></div>
                                    <div className="flex-1 space-y-2 py-1">
                                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                                    </div>
                                </div>
                            ))
                        ) : recommendedProducts.length > 0 ? (
                            recommendedProducts.map((product) => (
                                <Link
                                    to={`/product/${product.id}`}
                                    key={product.id}
                                    className="flex gap-4 group"
                                    onClick={onClose}
                                >
                                    <div className="w-20 h-24 bg-[#f6f6f6] overflow-hidden shrink-0">
                                        <img
                                            src={product.image1}
                                            alt={product.name}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                        />
                                    </div>
                                    <div className="flex flex-col justify-center">
                                        <h4 className="text-[14px] font-medium text-[#222] group-hover:text-[#56cfe1] transition-colors line-clamp-2">
                                            {product.name}
                                        </h4>
                                        <div className="mt-1">
                                            <span className="text-[14px] text-gray-500">{formatPrice(Number(product.price))}</span>
                                        </div>
                                    </div>
                                </Link>
                            ))
                        ) : (
                            <div className="text-center py-10 text-gray-400 italic">
                                No products found. 
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

const FALLBACK_PRODUCTS = [
    {
        id: 1,
        name: "Vintage Navy Stripe Tee",
        price: 45,
        image1: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=400&auto=format&fit=crop"
    },
    {
        id: 2,
        name: "Classic White Sneakers",
        price: 89,
        image1: "https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=400&auto=format&fit=crop"
    },
    {
        id: 3,
        name: "Premium Denim Jacket",
        price: 120,
        image1: "https://images.unsplash.com/photo-1576995883346-f73f2762a40a?q=80&w=400&auto=format&fit=crop"
    }
];

export default DiscountPopup;
