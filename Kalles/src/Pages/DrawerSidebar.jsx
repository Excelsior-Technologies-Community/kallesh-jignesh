import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaPinterest } from "react-icons/fa6";
import { FaHeart } from "react-icons/fa";
import { Link } from 'react-router-dom';
import { useCurrency } from '../Context/CurrencyContext';
import { useWishlist } from '../Context/WishlistContext';
import { useCart } from '../Context/CartContext';
import QuickAddModal from '../Components/QuickAddModal';
import QuickViewModal from '../Components/QuickViewModal';
import {
    Heart,
    RefreshCw,
    Search,
    Grid,
    List,
    ChevronLeft,
    ChevronRight,
    X,
    Check,
    ShoppingBag
} from 'lucide-react';

const ProductListItem = ({ product }) => {
    const { formatPrice } = useCurrency();
    const { toggleWishlist, isInWishlist } = useWishlist();
    const { addToCart } = useCart();
    const isFavorite = isInWishlist(product.id);
    const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
    const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
    // Calculate badge and prices

    const discount = product.discount_percent || 0;
    const hasDiscount = discount > 0;

    // Calculate old price if discount exists
    const oldPrice = hasDiscount ? (product.price / (1 - discount / 100)).toFixed(2) : null;

    // Dummy description if not present (to match the screenshot text density)
    const description = product.description || "PRODUCT DETAILS Design inspiration lorem ipsum dolor sit amet, consectetuer adipiscing elit. Morbi commodo, ipsum sed pharetra gravida, orci magna rhoncus neque, id pulvinar odio lorem non turpis. Nullam sit...";

    const [quantity, setQuantity] = useState(1);

    const handleQuantityChange = (val) => {
        if (quantity + val >= 1) {
            setQuantity(quantity + val);
        }
    };

    return (
        <div className="flex flex-col border p-5 justify-center items-center md:flex-row gap-8 border-b border-gray-200 last:border-0 group/card">
            {/* 1. Image Section */}
            <div className="w-full md:w-[220px] shrink-0 relative overflow-hidden group">
                <div className="aspect-[4/5] relative overflow-hidden bg-[#f6f6f6]">
                    <Link to={`/products/${product.id}`}>
                        {product.image1 ? (
                            <img
                                src={product.image1}
                                alt={product.name}
                                className="absolute inset-0 w-full h-full object-cover"
                                onError={(e) => { e.target.src = 'https://via.placeholder.com/300x400?text=No+Image'; }}
                            />
                        ) : (
                            <div className="absolute inset-0 w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
                                <span>No Image</span>
                            </div>
                        )}
                        {/* Hover Image */}
                        {product.image2 && (
                            <img
                                src={product.image2}
                                alt={product.name}
                                className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                            />
                        )}
                    </Link>

                    {/* Circular Badges (Top Right) */}
                    <div className="absolute top-3 right-3 flex flex-col gap-2 z-10">
                        {Boolean(hasDiscount) && (
                            <div className="w-11 h-11 bg-[#f04e23] text-white rounded-full flex items-center justify-center text-[10px] font-bold shadow-sm">
                                -{discount}%
                            </div>
                        )}
                        {Boolean(product.is_preorder) && (
                            <div className="w-11 h-11 bg-[#0066cc] text-white rounded-full flex items-center justify-center text-[8px] uppercase font-bold text-center leading-tight shadow-sm">
                                Pre-<br />Order
                            </div>
                        )}
                    </div>

                    {/* Left Actions (Wishlist & Quickview Icons) */}
                    <div className="absolute top-0.5 left-1 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                        <button 
                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleWishlist(product); }}
                            className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors shadow-sm ${isFavorite ? 'bg-[#56cfe1] text-white' : 'bg-transparent hover:bg-[#56cfe1] hover:text-white'}`}
                        >
                            <Heart size={16} fill={isFavorite ? "currentColor" : "none"} />
                        </button>
                        <button className="w-8 h-8 bg-transparent shadow-sm rounded-full flex items-center justify-center hover:bg-[#56cfe1] hover:text-white transition-colors shadow-sm">
                            <RefreshCw size={16} />
                        </button>
                    </div>
                </div>
            </div>

            {/* 2. Info Section (Center) */}
            <div className="flex-1 flex flex-col items-start pr-4">
                <h3 className="text-[16px] md:text-[18px] font-bold text-[#222] mb-1 hover:text-[#56cfe1] transition-colors cursor-pointer">
                    <Link to={`/products/${product.id}`}>{product.name}</Link>
                </h3>

                <div className="flex gap-2 items-center mb-4 text-[15px] font-medium">
                    <span className="text-gray-500">
                        {formatPrice(product.price)}
                    </span>
                    {oldPrice && (
                        <span className="text-gray-400 line-through">
                            {oldPrice}
                        </span>
                    )}
                </div>

                <p className="text-gray-500 text-[14px] leading-7 mb-6 line-clamp-3">
                    {description}
                </p>
            </div>

            {/* 3. Actions Section (Right) */}
            <div className="w-full md:w-[220px] shrink-0 flex flex-col gap-3 pt-2">
                {/* Quick View Button */}
                <button 
                    onClick={() => setIsQuickViewOpen(true)}
                    className="w-full h-11 flex items-center justify-center border-2 border-[#56cfe1] text-[#56cfe1] rounded-full text-[14px] font-bold hover:bg-[#56cfe1] hover:text-white transition-all duration-300"
                >
                    Quick view
                </button>

                {/* Add to Cart Group */}
                <div className="flex items-center w-full">
                    {/* Quantity Selector */}
                    <div className="flex items-center bg-[#f2f2f2] rounded-l-full h-[45px] px-2 min-w-[80px]">
                        <button
                            onClick={() => handleQuantityChange(-1)}
                            className="w-full h-full flex items-center justify-center text-gray-500 hover:text-black transition-colors"
                        >
                            -
                        </button>
                        <span className="w-full text-center text-[14px] font-bold text-[#222]">{quantity}</span>
                        <button
                            onClick={() => handleQuantityChange(1)}
                            className="w-full h-full flex items-center justify-center text-gray-500 hover:text-black transition-colors"
                        >
                            +
                        </button>
                    </div>

                    {/* Add Button */}
                    <button
                        onClick={() => {
                            if (product.stock <= 0) return;
                            addToCart(product, quantity, product.size ? String(product.size).split(',')[0].trim() : '');
                        }}
                        disabled={product.stock <= 0}
                        className={`flex-1 h-[45px] font-bold rounded-r-full transition-colors whitespace-nowrap px-4 tracking-wide ${product.stock <= 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#56cfe1] hover:bg-[#3ac3d6]'} text-white text-[14px]`}
                    >
                        {product.stock <= 0 ? 'Sold Out' : 'Add to cart'}
                    </button>
                </div>
                {/* Modals */}
                <QuickViewModal
                    key={`qv-${product.id}-${isQuickViewOpen}`}
                    product={product}
                    isOpen={isQuickViewOpen}
                    onClose={() => setIsQuickViewOpen(false)}
                />
            </div>
        </div>
    );
};

const FilterSidebar = ({ isOpen, onClose, categories = [], selectedCategory, onSelectCategory }) => {
    return (
        <>
            {/* Backdrop */}
            <div
                className={`fixed inset-0 bg-black/50 z-[90] transition-opacity duration-300 ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
                onClick={onClose}
            ></div>

            {/* Sidebar */}
            <div className={`fixed top-0 left-0 h-full w-[300px] bg-white z-[100] transform transition-transform duration-300 shadow-2xl overflow-y-auto ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="p-6">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-[16px] font-bold uppercase tracking-widest">Filter</h2>
                        <button onClick={onClose} className="hover:rotate-90 transition-transform duration-300">
                            <X size={24} strokeWidth={1.5} />
                        </button>
                    </div>

                    {/* Product Categories */}
                    <div className="mb-8 border-b border-gray-100 pb-8">
                        <h3 className="text-[16px] font-bold mb-4">Product categories</h3>
                        <ul className="space-y-3 text-[14px] text-gray-500 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
                            <li
                                className={`cursor-pointer transition-colors relative pl-3 border-l-2 hover:border-black ${!selectedCategory ? 'text-black border-black font-bold' : 'border-transparent hover:text-[#56cfe1]'}`}
                                onClick={() => {
                                    onSelectCategory(null);
                                    onClose(); // Optional: close sidebar on selection
                                }}
                            >
                                All
                            </li>
                            {categories.length > 0 ? (
                                categories.filter(cat => cat.name.toLowerCase() !== 'all').map((cat) => (
                                    <li
                                        key={cat.id}
                                        className={`cursor-pointer transition-colors relative pl-3 border-l-2 hover:border-black ${selectedCategory?.id === cat.id ? 'text-black border-black font-bold' : 'border-transparent hover:text-[#56cfe1]'}`}
                                        onClick={() => {
                                            onSelectCategory(cat);
                                            onClose(); // Optional: close sidebar on selection
                                        }}
                                    >
                                        {cat.name} ({cat.product_count || 0})
                                    </li>
                                ))
                            ) : (
                                <li className="text-gray-400">No categories found</li>
                            )}
                        </ul>
                        <style jsx>{`
                            .custom-scrollbar::-webkit-scrollbar {
                                width: 4px;
                            }
                            .custom-scrollbar::-webkit-scrollbar-track {
                                background: transparent;
                            }
                            .custom-scrollbar::-webkit-scrollbar-thumb {
                                background-color: #e5e7eb;
                                border-radius: 20px;
                            }
                        `}</style>
                    </div>

                    {/* Availability */}
                    <div className="mb-8 border-b border-gray-100 pb-8">
                        <h3 className="text-[16px] font-bold mb-4">Availability</h3>
                        <ul className="space-y-3">
                            <li className="flex items-center gap-3 group cursor-pointer">
                                <div className="w-4 h-4 border border-gray-300 rounded-sm group-hover:border-black flex items-center justify-center"></div>
                                <span className="text-[14px] text-gray-500 group-hover:text-[#56cfe1]">In stock (19)</span>
                            </li>
                            <li className="flex items-center gap-3 group cursor-pointer">
                                <div className="w-4 h-4 border border-gray-300 rounded-sm group-hover:border-black flex items-center justify-center"></div>
                                <span className="text-[14px] text-gray-500 group-hover:text-[#56cfe1]">Out of stock (4)</span>
                            </li>
                        </ul>
                    </div>

                    {/* Color */}
                    <div className="mb-8 border-b border-gray-100 pb-8">
                        <h3 className="text-[16px] font-bold mb-4">Color</h3>
                        <ul className="space-y-3">
                            {[
                                { name: 'Black', count: 3, color: 'bg-black' },
                                { name: 'Blue', count: 2, color: 'bg-[#9fb8d2]' },
                                { name: 'Cyan', count: 1, color: 'bg-[#56cfe1]' },
                                { name: 'Green', count: 1, color: 'bg-[#b6d369]' },
                                { name: 'Grey', count: 2, color: 'bg-[#cccccc]' }
                            ].map((item, idx) => (
                                <li key={idx} className="flex items-center gap-3 group cursor-pointer">
                                    <div className={`w-6 h-6 rounded-full ${item.color} relative flex items-center justify-center`}>
                                        {/* <Check size={12} color="white" /> */}
                                    </div>
                                    <span className="text-[14px] text-gray-500 group-hover:text-[#56cfe1]">{item.name} ({item.count})</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Size */}
                    <div className="mb-8 border-b border-gray-100 pb-8">
                        <h3 className="text-[16px] font-bold mb-4">Size</h3>
                        <ul className="space-y-3">
                            {['xs (2)', 's (8)', 'M (8)', 'l (5)', 'XL (2)'].map((size, idx) => (
                                <li key={idx} className="flex items-center gap-3 group cursor-pointer">
                                    <div className="w-4 h-4 border border-gray-300 rounded-sm group-hover:border-black flex items-center justify-center"></div>
                                    <span className="text-[14px] text-gray-500 uppercase group-hover:text-[#56cfe1]">{size}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Type */}
                    <div className="mb-8 border-b border-gray-100 pb-8">
                        <h3 className="text-[16px] font-bold mb-4">Type</h3>
                        <ul className="space-y-3">
                            {['Accessories (1)', 'Men (1)', 'Women (15)'].map((type, idx) => (
                                <li key={idx} className="flex items-center gap-3 group cursor-pointer">
                                    <div className="w-4 h-4 border border-gray-300 rounded-sm group-hover:border-black flex items-center justify-center"></div>
                                    <span className="text-[14px] text-gray-500 group-hover:text-[#56cfe1]">{type}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Brand */}
                    <div className="mb-8 border-b border-gray-100 pb-8">
                        <h3 className="text-[16px] font-bold mb-4">Brand</h3>
                        <ul className="space-y-3">
                            {['CK (1)', 'Kalles (18)'].map((brand, idx) => (
                                <li key={idx} className="flex items-center gap-3 group cursor-pointer">
                                    <div className="w-4 h-4 border border-gray-300 rounded-sm group-hover:border-black flex items-center justify-center"></div>
                                    <span className="text-[14px] text-gray-500 group-hover:text-[#56cfe1]">{brand}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </>
    );
};



const CategorySlider = ({ categories = [], selectedCategory, onSelectCategory }) => {
    const scrollRef = React.useRef(null);
    const isDown = React.useRef(false);
    const startX = React.useRef(0);
    const scrollLeft = React.useRef(0);
    const isDragging = React.useRef(false);

    const scroll = (direction) => {
        if (scrollRef.current) {
            const { current } = scrollRef;
            const scrollAmount = 200;
            current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    const handleMouseDown = (e) => {
        isDown.current = true;
        startX.current = e.pageX - scrollRef.current.offsetLeft;
        scrollLeft.current = scrollRef.current.scrollLeft;
        isDragging.current = false;
        scrollRef.current.style.cursor = 'grabbing';
    };

    const handleMouseLeave = () => {
        isDown.current = false;
        isDragging.current = false;
        if (scrollRef.current) scrollRef.current.style.cursor = 'grab';
    };

    const handleMouseUp = () => {
        isDown.current = false;
        if (scrollRef.current) scrollRef.current.style.cursor = 'grab';

        // Use a timeout to reset dragging state so click handlers can check it
        setTimeout(() => {
            isDragging.current = false;
        }, 50);
    };

    const handleMouseMove = (e) => {
        if (!isDown.current) return;
        e.preventDefault();
        const x = e.pageX - scrollRef.current.offsetLeft;
        const walk = (x - startX.current) * 2; // Scroll speed
        scrollRef.current.scrollLeft = scrollLeft.current - walk;

        // Mark as dragging if moved significantly
        if (Math.abs(walk) > 5) {
            isDragging.current = true;
        }
    };

    const handleCategoryClick = (cat) => {
        if (isDragging.current) {
            return;
        }
        onSelectCategory(cat);
    };

    return (
        <div className="w-full bg-white border-b border-gray-100 mb-6">
            <div className="container mx-auto px-4 lg:px-8 max-w-[1200px] h-[50px] flex items-center relative group">
                <button
                    onClick={() => scroll('left')}
                    className="absolute left-2 md:left-0 z-10 p-1 hover:text-[#56cfe1] transition-colors bg-white shadow-sm rounded-full border border-gray-100"
                >
                    <ChevronLeft size={16} />
                </button>

                <div
                    ref={scrollRef}
                    className="flex items-center gap-8 overflow-x-auto scrollbar-hide px-8 w-full cursor-grab select-none"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                    onMouseDown={handleMouseDown}
                    onMouseLeave={handleMouseLeave}
                    onMouseUp={handleMouseUp}
                    onMouseMove={handleMouseMove}
                >
                    <div
                        className={`whitespace-nowrap text-[14px] font-medium cursor-pointer transition-colors uppercase tracking-wide ${!selectedCategory ? 'text-black font-bold' : 'text-gray-500 hover:text-black'}`}
                        onClick={() => handleCategoryClick(null)}
                    >
                        All
                    </div>
                    {categories.filter(cat => cat.name.toLowerCase() !== 'all').map((cat) => (
                        <div
                            key={cat.id}
                            className={`whitespace-nowrap text-[14px] font-medium cursor-pointer transition-colors uppercase tracking-wide ${selectedCategory?.id === cat.id ? 'text-black font-bold' : 'text-gray-500 hover:text-black'}`}
                            onClick={() => handleCategoryClick(cat)}
                        >
                            {cat.name}
                        </div>
                    ))}
                </div>

                <button
                    onClick={() => scroll('right')}
                    className="absolute right-2 md:right-0 z-10 p-1 hover:text-[#56cfe1] transition-colors bg-white shadow-sm rounded-full border border-gray-100"
                >
                    <ChevronRight size={16} />
                </button>
            </div>
        </div>
    );
};

const ProductGridItem = ({ product, columns = 3 }) => {
    const { formatPrice } = useCurrency();
    const { toggleWishlist, isInWishlist } = useWishlist();
    const { addToCart } = useCart();
    const isFavorite = isInWishlist(product.id);
    const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
    const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
    const discount = product.discount_percent || 0;
    const hasDiscount = discount > 0;
    const oldPrice = hasDiscount ? (product.price / (1 - discount / 100)).toFixed(2) : null;

    const [quantity, setQuantity] = useState(1);

    const handleQuantityChange = (val) => {
        if (quantity + val >= 1) {
            setQuantity(quantity + val);
        }
    };

    return (
        <div className="group relative overflow-hidden flex flex-col items-center">
            {/* Image Overlay Section */}
            <div className="w-full aspect-[3/4] relative overflow-hidden bg-[#f6f6f6] mb-4">
                <Link to={`/products/${product.id}`}>
                    {product.image1 ? (
                        <img
                            src={product.image1}
                            alt={product.name}
                            className="absolute inset-0 w-full h-full object-cover"
                            onError={(e) => { e.target.src = 'https://via.placeholder.com/300x400?text=No+Image'; }}
                        />
                    ) : (
                        <div className="absolute inset-0 w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
                            <span>No Image</span>
                        </div>
                    )}
                    {product.image2 && (
                        <img
                            src={product.image2}
                            alt={product.name}
                            className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        />
                    )}
                </Link>

                {/* Badges (Top Right - Stacked) */}
                <div className="absolute top-1 right-1 flex flex-col gap-2 z-10">
                    {Boolean(hasDiscount) && (
                        <div className="w-9 h-9 bg-[#f04e23] text-white rounded-full flex items-center justify-center text-[12px] font-bold shadow-md">
                            -{discount}%
                        </div>
                    )}
                    {Boolean(product.is_preorder) && (
                        <div className="w-9 h-9 bg-[#0066cc] text-white rounded-full flex items-center justify-center text-[10px] uppercase font-semibold text-center leading-tight shadow-md">
                            Pre-<br />Order
                        </div>
                    )}
                </div>

                {/* Floating Action Icons (Left Top) */}
                <div className="absolute -top-6 left-1 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform -translate-x-2 group-hover:translate-x-0 z-10">
                    {/* Only show Heart/Refresh if not covered by Sale badge or adjusted position */}
                    <div className="flex flex-col gap-2 mt-8">
                        <button 
                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleWishlist(product); }}
                            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 shadow-md ${isFavorite ? 'bg-[#f04e23] text-white' : 'bg-white text-[#222] hover:bg-[#f04e23] hover:text-white'}`}
                        >
                            <Heart size={15} fill={isFavorite ? "currentColor" : "none"} strokeWidth={2} />
                        </button>
                        <button className="w-8 h-8 bg-transparent shadow-sm rounded-full flex items-center justify-center hover:bg-[#56cfe1] hover:text-white transition-colors shadow-sm">
                            <RefreshCw size={15} />
                        </button>
                    </div>
                </div>

                {/* Hover Action Overlay (Centered) */}
                <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div className={`flex flex-col gap-2 w-full px-4 transform transition-transform duration-300 translate-y-4 group-hover:translate-y-0 ${columns <= 2 ? 'max-w-[210px]' : (columns >= 5 ? 'px-2 gap-1.5' : 'max-w-[160px]')}`}>
                        {/* Quick View */}
                        <button 
                            onClick={() => setIsQuickViewOpen(true)}
                            className={`w-full bg-white text-[#222] font-bold uppercase tracking-wider rounded-full shadow-lg hover:bg-[#222] hover:text-white transition-all ${columns >= 5 ? 'py-1.5 text-[10px]' : (columns >= 4 ? 'py-2 text-[11px]' : 'py-2.5 text-[12px]')}`}
                        >
                            Quick view
                        </button>

                        {/* Add to Cart with Quantity Selector */}
                        <div className="flex items-center w-full">
                            <div className={`flex items-center bg-[#f2f2f2] rounded-l-full px-1 border-r border-gray-200 ${columns >= 5 ? 'h-[32px]' : (columns >= 4 ? 'h-[36px]' : 'h-[40px]')}`}>
                                <button
                                    onClick={(e) => { e.preventDefault(); handleQuantityChange(-1); }}
                                    className="w-4 h-full flex items-center justify-center text-gray-500 hover:text-black"
                                >
                                    -
                                </button>
                                <span className={`text-center font-bold text-[#222] ${columns >= 5 ? 'w-4 text-[11px]' : 'w-6 text-[12px]'}`}>{quantity}</span>
                                <button
                                    onClick={(e) => { e.preventDefault(); handleQuantityChange(1); }}
                                    className="w-4 h-full flex items-center justify-center text-gray-500 hover:text-black"
                                >
                                    +
                                </button>
                            </div>
                            <button
                                onClick={(e) => { 
                                    if (product.stock <= 0) return;
                                    e.preventDefault(); 
                                    addToCart(product, quantity, product.size ? String(product.size).split(',')[0].trim() : ''); 
                                }}
                                disabled={product.stock <= 0}
                                className={`flex-1 font-bold uppercase tracking-wider rounded-r-full transition-all truncate ${product.stock <= 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#56cfe1] hover:bg-black'} text-white ${columns >= 5 ? 'h-[32px] text-[10px] px-1' : (columns >= 4 ? 'h-[36px] text-[11px] px-2' : 'h-[40px] text-[12px] px-3')}`}
                            >
                                {product.stock <= 0 ? 'Sold Out' : 'Add to cart'}
                            </button>
                        </div>
                        {/* Modals */}
                        <QuickViewModal
                            product={product}
                            isOpen={isQuickViewOpen}
                            onClose={() => setIsQuickViewOpen(false)}
                        />
                    </div>
                </div>
            </div>

            {/* Product Title and Price */}
            <div className="text-center px-2">
                <h3 className="text-[14px] md:text-[15px] font-medium text-[#222] mb-1 hover:text-[#56cfe1] transition-colors line-clamp-1">
                    <Link to={`/products/${product.id}`}>{product.name}</Link>
                </h3>
                <div className="flex justify-center gap-2 items-center text-[14px] font-medium">
                    <span className="text-[#222]">
                        {formatPrice(product.price)}
                    </span>
                    {oldPrice && (
                        <span className="text-gray-400 line-through text-[13px]">
                            {formatPrice(oldPrice)}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};

const DrawerSidebar = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    // Layout State: 'list', 2, 3, 4, 6
    const [layout, setLayout] = useState('list');

    // Sort State
    const [sortOption, setSortOption] = useState('featured');
    const [isSortOpen, setIsSortOpen] = useState(false);

    const itemsPerPage = layout === 'list' ? 5 : 12;

    useEffect(() => {
        // api call start
        const fetchData = async () => {
            try {
                // Fetch products and categories in parallel
                const [productsRes, categoriesRes] = await Promise.all([ //axios call
                    axios.get('http://localhost:5000/api/products'),
                    axios.get('http://localhost:5000/api/categories')
                ]);


                setProducts(productsRes.data);
                setCategories(categoriesRes.data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching data:", error);
                setLoading(false);
            }
        };

        fetchData();
    }, []);


    const handleCategorySelect = (category) => {
        setSelectedCategory(category);
        setCurrentPage(1);
    };

    // Filter products
    let filteredProducts = selectedCategory
        ? products.filter(product => {
            if (!product.category_id) return false;
            const productCatIds = String(product.category_id).split(',').map(id => id.trim());
            return productCatIds.includes(String(selectedCategory.id));
        })
        : [...products];

    // Sort products
    if (sortOption === 'price-low-high') {
        filteredProducts.sort((a, b) => a.price - b.price);
    } else if (sortOption === 'price-high-low') {
        filteredProducts.sort((a, b) => b.price - a.price);
    } else if (sortOption === 'a-z') {
        filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortOption === 'z-a') {
        filteredProducts.sort((a, b) => b.name.localeCompare(a.name));
    }
    // 'featured' / 'best-selling' use default order or specific logic if available

    // Pagination Logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentProducts = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const getGridClass = () => {
        switch (layout) {
            case 2: return "grid-cols-1 sm:grid-cols-2";
            case 3: return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";
            case 4: return "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4";
            case 5: return "grid-cols-2 sm:grid-cols-3 lg:grid-cols-5";
            case 6: return "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6";
            default: return "";
        }
    };

    return (
        <div className="w-full">
            {/* Sticky Sidebar Toggle Button */}
            <button
                onClick={() => setIsFilterOpen(true)}
                className="fixed left-0 top-1/2 -translate-y-1/2 z-[80] bg-white border border-gray-200 p-3 shadow-lg hover:bg-[#56cfe1] hover:text-white transition-all duration-300 rounded-r-md group"
            >
                <Grid size={20} strokeWidth={1.5} />
            </button>

            <FilterSidebar
                isOpen={isFilterOpen}
                onClose={() => setIsFilterOpen(false)}
                categories={categories}
                selectedCategory={selectedCategory}
                onSelectCategory={handleCategorySelect}
            />

            {/* Category Slider */}
            <CategorySlider
                categories={categories}
                selectedCategory={selectedCategory}
                onSelectCategory={handleCategorySelect}
            />

            {/* Banner Section */}
            <div className="relative w-full h-[220px] md:h-[280px] flex items-center justify-center mb-16 overflow-hidden">
                <img 
                    src="https://kalles-5.myshopify.com/cdn/shop/files/bg-heading.jpg?v=1717580690&width=1920" 
                    className="absolute inset-0 w-full h-full object-cover scale-105" 
                    alt="Category Banner" 
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/60"></div>
                
                <div className="relative z-10 text-center px-4">
                    <h1 className="text-[32px] md:text-[48px] font-bold uppercase tracking-[0.25em] text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)] leading-tight mb-4">
                        {selectedCategory ? selectedCategory.name : 'Shop'}
                    </h1>
                    <div className="flex items-center justify-center gap-2 text-white/90 text-[13px] md:text-[14px] font-medium tracking-widest uppercase">
                        <Link to="/" className="hover:text-[#56cfe1] transition-colors">Home</Link>
                        <span className="text-[#56cfe1]">/</span>
                        <span className="opacity-80">{selectedCategory ? selectedCategory.name : 'Category'}</span>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-4 lg:px-8 max-w-[1200px] pb-20">
                {/* Toolbar */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-10 pb-4 border-b border-gray-100">
                    {/* Left: Filter */}
                    <div
                        className="flex items-center gap-2 cursor-pointer hover:text-[#56cfe1] transition-colors mb-4 md:mb-0"
                        onClick={() => setIsFilterOpen(true)}
                    > 
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="4" y1="21" x2="4" y2="14"></line>
                            <line x1="4" y1="10" x2="4" y2="3"></line>
                            <line x1="12" y1="21" x2="12" y2="12"></line>
                            <line x1="12" y1="8" x2="12" y2="3"></line>
                            <line x1="20" y1="21" x2="20" y2="16"></line>
                            <line x1="20" y1="12" x2="20" y2="3"></line>
                            <line x1="1" y1="14" x2="7" y2="14"></line>
                            <line x1="9" y1="8" x2="15" y2="8"></line>
                            <line x1="17" y1="16" x2="23" y2="16"></line>
                        </svg>
                        <span className="text-[14px] font-medium uppercase tracking-wide">Filter</span>
                    </div>

                    {/* Center: Layout Switcher */}
                    <div className="flex items-center gap-3 mb-4 md:mb-0 hidden md:flex">
                        {/* List View */}
                        <button
                            onClick={() => setLayout('list')}
                            className={`group w-9 h-9 flex items-center justify-center border transition-all ${layout === 'list' ? 'border-black' : 'border-gray-200 hover:border-black'}`}
                        >
                            <div className="flex flex-col gap-1 w-5">
                                <div className={`h-[3px] w-full ${layout === 'list' ? 'bg-black' : 'bg-gray-300 group-hover:bg-black'}`}></div>
                                <div className={`h-[3px] w-full ${layout === 'list' ? 'bg-black' : 'bg-gray-300 group-hover:bg-black'}`}></div>
                                <div className={`h-[3px] w-full ${layout === 'list' ? 'bg-black' : 'bg-gray-300 group-hover:bg-black'}`}></div>
                            </div>
                        </button>

                        {/* 2 Cols */}
                        <button
                            onClick={() => setLayout(2)}
                            className={`group w-9 h-9 flex items-center justify-center border transition-all ${layout === 2 ? 'border-black' : 'border-gray-200 hover:border-black'}`}
                        >
                            <div className="flex gap-[2px] w-5 h-4">
                                <div className={`flex-1 ${layout === 2 ? 'bg-black' : 'bg-gray-300 group-hover:bg-black'}`}></div>
                                <div className={`flex-1 ${layout === 2 ? 'bg-black' : 'bg-gray-300 group-hover:bg-black'}`}></div>
                            </div>
                        </button>

                        {/* 3 Cols */}
                        <button
                            onClick={() => setLayout(3)}
                            className={`group w-9 h-9 flex items-center justify-center border transition-all ${layout === 3 ? 'border-black' : 'border-gray-200 hover:border-black'}`}
                        >
                            <div className="flex gap-[2px] w-5 h-4">
                                <div className={`flex-1 ${layout === 3 ? 'bg-black' : 'bg-gray-300 group-hover:bg-black'}`}></div>
                                <div className={`flex-1 ${layout === 3 ? 'bg-black' : 'bg-gray-300 group-hover:bg-black'}`}></div>
                                <div className={`flex-1 ${layout === 3 ? 'bg-black' : 'bg-gray-300 group-hover:bg-black'}`}></div>
                            </div>
                        </button>

                        {/* 4 Cols */}
                        <button
                            onClick={() => setLayout(4)}
                            className={`group w-9 h-9 flex items-center justify-center border transition-all ${layout === 4 ? 'border-black' : 'border-gray-200 hover:border-black'}`}
                        >
                            <div className="flex gap-[2px] w-5 h-4">
                                <div className={`flex-1 ${layout === 4 ? 'bg-black' : 'bg-gray-300 group-hover:bg-black'}`}></div>
                                <div className={`flex-1 ${layout === 4 ? 'bg-black' : 'bg-gray-300 group-hover:bg-black'}`}></div>
                                <div className={`flex-1 ${layout === 4 ? 'bg-black' : 'bg-gray-300 group-hover:bg-black'}`}></div>
                                <div className={`flex-1 ${layout === 4 ? 'bg-black' : 'bg-gray-300 group-hover:bg-black'}`}></div>
                            </div>
                        </button>

                        {/* 5 Cols */}
                        <button
                            onClick={() => setLayout(5)}
                            className={`group w-9 h-9 flex items-center justify-center border transition-all ${layout === 5 ? 'border-black' : 'border-gray-200 hover:border-black'}`}
                        >
                            <div className="flex gap-[1px] w-5 h-4">
                                {[...Array(5)].map((_, i) => (
                                    <div key={i} className={`flex-1 ${layout === 5 ? 'bg-black' : 'bg-gray-300 group-hover:bg-black'}`}></div>
                                ))}
                            </div>
                        </button>

                        {/* 6 Cols */}
                        <button
                            onClick={() => setLayout(6)}
                            className={`group w-9 h-9 flex items-center justify-center border transition-all ${layout === 6 ? 'border-black' : 'border-gray-200 hover:border-black'}`}
                        >
                            <div className="flex gap-[1px] w-5 h-4">
                                {[...Array(6)].map((_, i) => (
                                    <div key={i} className={`flex-1 ${layout === 6 ? 'bg-black' : 'bg-gray-300 group-hover:bg-black'}`}></div>
                                ))}
                            </div>
                        </button>
                    </div>

                    {/* Right: Sort Dropdown */}
                    <div className="relative group cursor-pointer" onClick={() => setIsSortOpen(!isSortOpen)}>
                        <div className="flex items-center gap-2 border border-gray-200 rounded-full px-5 py-2 hover:border-black transition-colors">
                            <span className="text-[14px]">
                                {sortOption === 'featured' && 'Featured'}
                                {sortOption === 'best-selling' && 'Best Selling'}
                                {sortOption === 'a-z' && 'Alphabetically, A-Z'}
                                {sortOption === 'z-a' && 'Alphabetically, Z-A'}
                                {sortOption === 'price-low-high' && 'Price, low to high'}
                                {sortOption === 'price-high-low' && 'Price, high to low'}
                            </span>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="6 9 12 15 18 9"></polyline>
                            </svg>
                        </div>
                        {/* Dropdown Menu */}
                        <div className="absolute top-full right-0 mt-2 w-48 bg-white shadow-xl rounded-lg py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-20 border border-gray-100">
                            <div className={`px-4 py-2 hover:bg-gray-50 text-[14px] ${sortOption === 'featured' ? 'font-bold' : ''}`} onClick={() => setSortOption('featured')}>Featured</div>
                            <div className={`px-4 py-2 hover:bg-gray-50 text-[14px] ${sortOption === 'best-selling' ? 'font-bold' : ''}`} onClick={() => setSortOption('best-selling')}>Best Selling</div>
                            <div className={`px-4 py-2 hover:bg-gray-50 text-[14px] ${sortOption === 'a-z' ? 'font-bold' : ''}`} onClick={() => setSortOption('a-z')}>Alphabetically, A-Z</div>
                            <div className={`px-4 py-2 hover:bg-gray-50 text-[14px] ${sortOption === 'z-a' ? 'font-bold' : ''}`} onClick={() => setSortOption('z-a')}>Alphabetically, Z-A</div>
                            <div className={`px-4 py-2 hover:bg-gray-50 text-[14px] ${sortOption === 'price-low-high' ? 'font-bold' : ''}`} onClick={() => setSortOption('price-low-high')}>Price, low to high</div>
                            <div className={`px-4 py-2 hover:bg-gray-50 text-[14px] ${sortOption === 'price-high-low' ? 'font-bold' : ''}`} onClick={() => setSortOption('price-high-low')}>Price, high to low</div>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row gap-8">
                    {/* Sidebar (Empty for now based on screenshot focus, but structural placeholder) */}
                    {/* <div className="hidden md:block w-[250px] shrink-0">
                        Sidebar Filters...
                     </div> */}

                    {/* Product List */}
                    <div className="flex-1">
                        {loading ? (
                            <div className="space-y-8">
                                {[...Array(3)].map((_, i) => (
                                    <div key={i} className="flex gap-6 animate-pulse">
                                        <div className="w-[300px] h-[400px] bg-gray-200 rounded"></div>
                                        <div className="flex-1 py-4">
                                            <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
                                            <div className="h-4 bg-gray-200 rounded w-1/4 mb-6"></div>
                                            <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                                            <div className="h-4 bg-gray-200 rounded w-full mb-6"></div>
                                            <div className="h-10 bg-gray-200 rounded w-32"></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div>
                                {layout === 'list' ? (
                                    <div className="flex flex-col gap-0">
                                        {currentProducts.map(product => (
                                            <ProductListItem key={product.id} product={product} />
                                        ))}
                                    </div>
                                ) : (
                                    <div className={`grid gap-x-6 gap-y-10 ${getGridClass()}`}>
                                        {currentProducts.map(product => (
                                            <ProductGridItem key={product.id} product={product} columns={layout} />
                                        ))}
                                    </div>
                                )}


                                {products.length === 0 && (
                                    <div className="text-center py-20 text-gray-500">
                                        No products found.
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex justify-center items-center gap-2 mt-16 pt-8 border-t border-gray-100">
                                {[...Array(totalPages)].map((_, i) => {
                                    const pageNum = i + 1;
                                    return (
                                        <button
                                            key={pageNum}
                                            onClick={() => {
                                                setCurrentPage(pageNum);
                                                window.scrollTo({ top: 0, behavior: 'smooth' });
                                            }}
                                            className={`w-10 h-10 flex items-center justify-center rounded-full transition-all text-[15px] font-bold ${currentPage === pageNum ? 'bg-[#56cfe1] text-white shadow-lg' : 'text-[#222] hover:text-[#56cfe1]'}`}
                                        >
                                            {pageNum}
                                        </button>
                                    );
                                })}
                                {currentPage < totalPages && (
                                    <button
                                        onClick={() => {
                                            setCurrentPage(currentPage + 1);
                                            window.scrollTo({ top: 0, behavior: 'smooth' });
                                        }}
                                        className="ml-4 flex items-center gap-1 text-[#222] hover:text-[#56cfe1] transition-colors text-[15px] font-bold uppercase tracking-widest"
                                    >
                                        Next <ChevronRight size={18} />
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DrawerSidebar;
