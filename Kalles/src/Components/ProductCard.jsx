import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { Heart, RefreshCw, Package } from 'lucide-react';
import QuickAddModal from './QuickAddModal';
import QuickViewModal from './QuickViewModal';
import { useWishlist } from '../Context/WishlistContext';
import { useCurrency } from '../Context/CurrencyContext';

const ProductCard = ({ product }) => {
    const { toggleWishlist, isInWishlist } = useWishlist();
    const { formatPrice } = useCurrency();
    const isFavorite = isInWishlist(product.id);
    const [isHovered, setIsHovered] = useState(false);
    const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
    const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
    const navigate = useNavigate();

    const handleCardClick = () => {
        navigate(`/product/${product.id}`);
    };


    // Calculate badge and prices
    const isNew = product.is_new === 1;
    const discount = product.discount_percent || 0;
    const hasDiscount = discount > 0;

    let badge = null;
    let badgeColor = '';

    const isOutOfStock = product.stock <= 0;

    if (isOutOfStock) {
        badge = 'Sold Out';
        badgeColor = 'text-center bg-gray-500';
    } else if (hasDiscount) {
        badge = `-${discount}%`;
        badgeColor = 'bg-[#ff4e00]';
    } else if (isNew) {
        badge = 'New';
        badgeColor = 'bg-[#00a500]';
    }

    // Parse sizes
    const sizes = typeof product.size === 'string' && product.size
        ? product.size.split(',').map(s => s.trim())
        : Array.isArray(product.size) ? product.size : [];

    // Calculate old price
    const oldPrice = hasDiscount ? (product.price / (1 - discount / 100)).toFixed(2) : null;

    return (
        <>
            <div
                className="group cursor-pointer"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                onClick={handleCardClick}
            >

                <div className="relative overflow-hidden mb-4 bg-[#f6f6f6] rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300">
                    {/* Images */}
                    <div className="relative aspect-[3/4] overflow-hidden">
                        <Link to={`/product/${product.id}`}>
                            {product.image1 ? (
                                <img
                                    src={product.image1}
                                    alt={product.name}
                                    className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${isHovered && product.image2 ? 'opacity-0' : 'opacity-100'}`}
                                    onError={(e) => { e.target.src = 'https://via.placeholder.com/300x400?text=No+Image'; }}
                                />
                            ) : (
                                <div className="absolute inset-0 w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
                                    <Package size={32} />
                                </div>
                            )}

                            {product.image2 ? (
                                <img
                                    src={product.image2}
                                    alt={product.name}
                                    className={`absolute inset-0 w-full h-full object-cover transition-all duration-500 scale-100 group-hover:scale-105 ${isHovered ? 'opacity-100' : 'opacity-0'}`}
                                    onError={(e) => { e.target.src = 'https://via.placeholder.com/300x400?text=No+Image'; }}
                                />
                            ) : (
                                product.image1 && (
                                    <img
                                        src={product.image1}
                                        alt={product.name}
                                        className={`absolute inset-0 w-full h-full object-cover transition-all duration-500 scale-100 group-hover:scale-105 ${isHovered ? 'opacity-100' : 'opacity-100'}`}
                                    />
                                )
                            )}
                        </Link>
                    </div>

                    {/* Badges */}
                    {badge && (
                        <div className={`absolute top-4 right-4 ${badgeColor} text-white font-bold w-10 h-10 rounded-full flex items-center justify-center uppercase leading-none shadow-md text-[10px] z-10`}>
                            {badge}
                        </div>
                    )}

                    {/* Action Icons (Left) */}
                    <div className="absolute top-4 left-4 flex flex-col gap-2 transition-all duration-300 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 z-20">
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                toggleWishlist(product);
                            }}
                            className={`p-2.5 rounded-full transition-colors shadow-lg ${isFavorite ? 'bg-[#56cfe1] text-white' : 'bg-white text-slate-700 hover:bg-[#56cfe1] hover:text-white'}`}
                        >

                            <Heart size={18} strokeWidth={1.5} fill={isFavorite ? "currentColor" : "none"} />
                        </button>
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                            }}
                            className="bg-white p-2.5 rounded-full hover:bg-[#43D1F0] hover:text-white transition-colors shadow-lg text-slate-700"
                        >
                            <RefreshCw size={18} strokeWidth={1.5} />
                        </button>

                    </div>

                    {/* Quick Action Buttons (Center) */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 transition-all duration-500 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto z-10">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsQuickViewOpen(true);
                            }}
                            className="bg-white text-black px-6 py-3 rounded-full text-[13px] font-bold hover:bg-[#222] hover:text-white transition-all duration-300 translate-y-4 group-hover:translate-y-0 w-[80%] max-w-[170px] shadow-xl"
                        >
                            Quick view
                        </button>

                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setIsQuickAddOpen(true);
                            }}
                            className={`text-white px-6 py-3 rounded-full text-[13px] font-bold transition-all duration-300 translate-y-4 group-hover:translate-y-0 w-[80%] max-w-[170px] shadow-xl ${isOutOfStock ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#43D1F0] hover:bg-[#222]'}`}
                            disabled={isOutOfStock}
                        >

                            {isOutOfStock ? 'Sold Out' : 'Quick add'}
                        </button>
                    </div>

                    {/* Bottom Left Sizes (Hover only) */}
                    {sizes.length > 0 && (
                        <div className="absolute bottom-5 left-5 text-white text-[12px] font-bold transition-all duration-300 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 drop-shadow-md z-10 capitalize">
                            {sizes.join(', ')}
                        </div>
                    )}
                </div>

                {/* Info Section */}
                <div className="space-y-1">
                    <Link to={`/product/${product.id}`} className="block">
                        <h3 className="text-[14px] font-medium text-[#222] hover:text-[#43D1F0] transition-colors truncate">
                            {product.name}
                        </h3>
                    </Link>
                    <div className="flex gap-2 items-center text-[14px]">
                        {oldPrice && (
                            <span className="text-gray-400 line-through">
                                {formatPrice(oldPrice)}
                            </span>
                        )}
                        <span className={`font-bold ${hasDiscount ? 'text-[#ff4e00]' : 'text-gray-900'}`}>
                            {formatPrice(product.price)}
                        </span>
                    </div>

                    {/* Color Swatches if available */}
                    {product.colors && (
                        <div className="flex gap-2 pt-1">
                            {product.colors.map((color, index) => (
                                <div
                                    key={index}
                                    className="w-3 h-3 rounded-full border border-gray-100 shadow-sm cursor-pointer hover:scale-125 transition-transform"
                                    style={{ backgroundColor: color }}
                                ></div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <QuickAddModal
                key={`add-${product.id}-${isQuickAddOpen}`}
                product={product}
                isOpen={isQuickAddOpen}
                onClose={() => setIsQuickAddOpen(false)}
            />

            <QuickViewModal
                key={`view-${product.id}-${isQuickViewOpen}`}
                product={product}
                isOpen={isQuickViewOpen}
                onClose={() => setIsQuickViewOpen(false)}
            />
        </>
    );
};

export default ProductCard;
