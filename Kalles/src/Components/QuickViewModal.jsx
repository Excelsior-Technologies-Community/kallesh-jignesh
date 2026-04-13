import React, { useState } from 'react';
import { X, Minus, Plus, Heart, RefreshCw, ChevronLeft, ChevronRight, HelpCircle, ArrowRight } from 'lucide-react';
import { useCart } from '../Context/CartContext';
import { useWishlist } from '../Context/WishlistContext';
import { useCurrency } from '../Context/CurrencyContext';
import { Link, useNavigate } from 'react-router-dom';
import ProductInfoModal from './ProductInfoModal';

const QuickViewModal = ({ product, isOpen, onClose }) => {
    const { addToCart } = useCart();
    const { formatPrice } = useCurrency();
    const { toggleWishlist, isInWishlist } = useWishlist();
    const navigate = useNavigate();
    const [quantity, setQuantity] = useState(1);
    const [selectedSize, setSelectedSize] = useState(() => {
        if (product && product.size) {
            const sizes = String(product.size).split(',').map(s => s.trim());
            return sizes[0] || '';
        }
        return '';
    });
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [activeModal, setActiveModal] = useState(null);

    const isFavorite = product ? isInWishlist(product.id) : false;
    const isOutOfStock = product ? product.stock <= 0 : false;

    // Get all available images
    const images = product ? [product.image1, product.image2, product.image3, product.image4, product.image5].filter(img => img) : [];

    if (!isOpen || !product) return null;

    const sizes = product.size ? String(product.size).split(',').map(s => s.trim()) : [];

    const handleQuantityChange = (val) => {
        if (quantity + val >= 1) setQuantity(quantity + val);
    };

    const nextImage = () => {
        setCurrentImageIndex((prev) => (prev + 1) % images.length);
    };

    const prevImage = () => {
        setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    const handleBuyNow = () => {
        if (isOutOfStock) return;
        addToCart(product, quantity, selectedSize);
        onClose();
        navigate('/checkout');
    };

    return (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
            {/* Overlay */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"
                onClick={onClose}
            ></div>

            {/* Modal Content */}
            <div className="relative bg-white w-full max-w-[1000px] max-h-[90vh] shadow-2xl overflow-hidden animate-in zoom-in duration-300 flex flex-col md:flex-row">

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-50 w-10 h-10 bg-black text-white flex items-center justify-center hover:bg-gray-800 transition-colors"
                >
                    <X size={20} />
                </button>

                {/* Left Side - Image Gallery */}
                <div className="w-full md:w-1/2 relative bg-[#f6f6f6] h-[400px] md:h-auto border-r border-gray-100">
                    <img
                        src={images[currentImageIndex]}
                        alt={product.name}
                        className="w-full h-full object-cover"
                    />

                    {images.length > 1 && (
                        <>
                            <button
                                onClick={prevImage}
                                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 flex items-center justify-center text-black hover:bg-white transition-all shadow-md"
                            >
                                <ChevronLeft size={24} />
                            </button>
                            <button
                                onClick={nextImage}
                                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 flex items-center justify-center text-black hover:bg-white transition-all shadow-md"
                            >
                                <ChevronRight size={24} />
                            </button>
                        </>
                    )}
                </div>

                {/* Right Side - Product Details */}
                <div className="w-full md:w-1/2 p-6 md:p-10 overflow-y-auto custom-scrollbar bg-white">
                    <div className="max-w-[400px]">
                        <h2 className="text-[24px] font-bold text-[#222] mb-3 leading-tight tracking-tight">
                            {product.name}
                        </h2>

                        <div className="text-[20px] font-medium text-[#222] mb-5">
                            {formatPrice(Number(product.price))}
                        </div>

                        <div className="text-[14px] text-gray-500 mb-6 leading-relaxed">
                            {product.description || "Go kalles this summer with this premium collection. Perfect for any occasion with high-quality materials and stunning design."}
                            <Link to={`/product/${product.id}`} className="inline-block ml-1 text-[#222] font-bold underline underline-offset-4 hover:text-[#56cfe1]">
                                Read more
                            </Link>
                        </div>

                        {/* Sizes */}
                        {sizes.length > 0 && (
                            <div className="mb-8">
                                <div className="text-[12px] font-black mb-4 uppercase tracking-[2px] text-[#222]">
                                    SIZE: <span className="text-gray-400 font-bold">{selectedSize}</span>
                                </div>
                                <div className="flex gap-2.5 flex-wrap">
                                    {sizes.map(size => (
                                        <button
                                            key={size}
                                            className={`w-10 h-10 rounded-full border flex items-center justify-center text-[12px] font-bold transition-all duration-300 ${selectedSize === size ? 'bg-[#222] text-white border-[#222]' : 'border-[#eee] hover:border-[#222] text-[#222]'}`}
                                            onClick={() => setSelectedSize(size)}
                                        >
                                            {size}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Quantity and Actions */}
                        <div className="flex flex-wrap items-center gap-4 mb-6">
                            <div className="flex items-center border border-[#eee] rounded-full h-[48px] px-3">
                                <button
                                    className="w-8 h-full flex items-center justify-center text-[#222] hover:text-[#56cfe1]"
                                    onClick={() => handleQuantityChange(-1)}
                                >
                                    <Minus size={16} />
                                </button>
                                <input
                                    type="text"
                                    value={quantity}
                                    readOnly
                                    className="w-10 text-center text-[15px] font-bold focus:outline-none"
                                />
                                <button
                                    className="w-8 h-full flex items-center justify-center text-[#222] hover:text-[#56cfe1]"
                                    onClick={() => handleQuantityChange(1)}
                                >
                                    <Plus size={16} />
                                </button>
                            </div>

                             <button
                                onClick={() => {
                                    if (isOutOfStock) return;
                                    addToCart(product, quantity, selectedSize);
                                    onClose();
                                }}
                                disabled={isOutOfStock}
                                className={`flex-1 min-w-[140px] h-[48px] font-bold text-[13px] uppercase tracking-widest transition-all rounded-full ${isOutOfStock ? 'bg-gray-400 cursor-not-allowed text-white' : 'bg-[#56cfe1] hover:bg-[#222] text-white'}`}
                            >
                                {isOutOfStock ? 'SOLD OUT' : 'ADD TO CART'}
                            </button>

                            <button
                                onClick={() => toggleWishlist(product)}
                                className={`w-[48px] h-[48px] border rounded-full flex items-center justify-center transition-all duration-300 shadow-sm ${isFavorite ? 'bg-[#f04e23] border-[#f04e23] text-white' : 'bg-white border-gray-100 text-[#222] hover:text-[#f04e23] hover:border-[#f04e23]'}`}
                            >
                                <Heart size={18} strokeWidth={2} fill={isFavorite ? "currentColor" : "none"} />
                            </button>

                            <button className="w-[48px] h-[48px] border border-gray-100 rounded-full flex items-center justify-center bg-white text-[#222] hover:bg-[#222] hover:text-white transition-all shadow-sm">
                                <RefreshCw size={18} strokeWidth={2} />
                            </button>
                        </div>

                        <button 
                            onClick={handleBuyNow}
                            disabled={isOutOfStock}
                            className={`w-full h-[50px] font-bold text-[13px] uppercase tracking-widest transition-all rounded-full mb-8 ${isOutOfStock ? 'bg-gray-300 cursor-not-allowed text-gray-500' : 'bg-[#222] hover:bg-black text-white'}`}
                        >
                            {isOutOfStock ? 'OUT OF STOCK' : 'BUY IT NOW'}
                        </button>

                        {/* Help Links */}
                        <div className="flex flex-wrap items-center gap-6 pb-8 border-b border-gray-100 mb-8">
                            <button className="text-[12px] font-bold text-[#222] flex items-center gap-2 hover:text-[#56cfe1] transition-colors" onClick={() => setActiveModal('size')}>
                                <HelpCircle size={16} /> Size Guide
                            </button>
                            <button className="text-[12px] font-bold text-[#222] flex items-center gap-2 hover:text-[#56cfe1] transition-colors" onClick={() => setActiveModal('delivery')}>
                                <RefreshCw size={16} /> Delivery & Return
                            </button>
                            <button className="text-[12px] font-bold text-[#222] flex items-center gap-2 hover:text-[#56cfe1] transition-colors" onClick={() => setActiveModal('ask')}>
                                <HelpCircle size={16} /> Ask a Question
                            </button>
                        </div>

                        {/* Meta Info */}
                        <div className="space-y-3 text-[13px]">
                            <p><span className="text-[#222] font-bold">Size:</span> <span className="text-gray-500 uppercase">{sizes.join(', ')}</span></p>
                            <p><span className="text-[#222] font-bold">Availability:</span> <span className={`${isOutOfStock ? 'text-red-600' : 'text-green-600'}`}>{isOutOfStock ? 'Out of stock' : 'In stock'}</span></p>
                            <p><span className="text-[#222] font-bold">SKU:</span> <span className="text-gray-500">N/A</span></p>
                            <p>
                                <span className="text-[#222] font-bold">Categories:</span>
                                <span className="text-gray-500 ml-1">All, Bottoms, Dress, Fashion 2, Top, Women</span>
                            </p>
                            <p>
                                <span className="text-[#222] font-bold">Tags:</span>
                                <span className="text-gray-500 ml-1">Color White, Color Black, Price $7-$50, Size L, Size M, Size S, Vendor Kalles, women</span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <ProductInfoModal activeModal={activeModal} setActiveModal={setActiveModal} product={product} />
        </div>
    );
};

export default QuickViewModal;
