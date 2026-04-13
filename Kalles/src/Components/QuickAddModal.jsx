import React, { useState } from 'react';
import { X, Minus, Plus, Heart, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../Context/CartContext';
import { useWishlist } from '../Context/WishlistContext';
import { useCurrency } from '../Context/CurrencyContext';

const QuickAddModal = ({ product, isOpen, onClose }) => {
    const { formatPrice } = useCurrency();
    const { addToCart } = useCart();
    const { toggleWishlist, isInWishlist } = useWishlist();
    const navigate = useNavigate();
    const [quantity, setQuantity] = useState(1);
    const [selectedSize, setSelectedSize] = useState(() => {
        if (product && product.size) {
            return String(product.size).split(',')[0].trim();
        }
    });

    const isOutOfStock = product ? product.stock <= 0 : false;

    if (!isOpen || !product) return null;

    const sizes = product.size ? String(product.size).split(',').map(s => s.trim()) : [];

    const handleQuantityChange = (val) => {
        if (quantity + val >= 1) setQuantity(quantity + val);
    };

    const handleBuyNow = () => {
        if (isOutOfStock) return;
        addToCart(product, quantity, selectedSize);
        onClose();
        navigate('/checkout');
    };

    return (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
            {/* Overlay */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            ></div>

            {/* Modal Content */}
            <div className="relative bg-white w-full max-w-[450px] shadow-2xl rounded-sm overflow-visible animate-in zoom-in duration-300">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute -top-12 -right-0 md:-right-12 w-10 h-10 bg-black/80 text-white flex items-center justify-center hover:bg-black transition-colors rounded-sm"
                >
                    <X size={24} />
                </button>

                <div className="p-8">
                    {/* Header */}
                    <div className="mb-6">
                        <h2 className="text-[20px] font-bold text-[#222] mb-2 uppercase tracking-tight">{product.name}</h2>
                        <div className="text-[18px] text-[#666]">{formatPrice(product.price)}</div>
                    </div>

                    {/* Sizes */}
                    {sizes.length > 0 && (
                        <div className="mb-6">
                            <div className="text-[13px] font-bold mb-4 uppercase tracking-wider">
                                SIZE: <span className="font-medium text-[#777] ml-2">{selectedSize}</span>
                            </div>
                            <div className="flex gap-2 flex-wrap">
                                {sizes.map(size => (
                                    <button
                                        key={size}
                                        className={`min-w-[40px] h-[40px] px-3 border flex items-center justify-center text-[13px] font-bold transition-all duration-300 ${selectedSize === size ? 'bg-[#222] text-white border-[#222]' : 'border-[#eee] hover:border-[#222] text-[#222]'}`}
                                        onClick={() => setSelectedSize(size)}
                                    >
                                        {size}
                                    </button>
                                )) /* end map */}
                            </div>
                        </div>
                    )}

                    {/* Quantity and Actions */}
                    <div className="flex items-center gap-4 mb-6">
                        <div className="flex items-center border border-[#eee] h-[44px] px-2 rounded-full">
                            <button
                                className="w-8 h-full flex items-center justify-center text-[#222] hover:text-[#43D1F0]"
                                onClick={() => handleQuantityChange(-1)}
                            >
                                <Minus size={16} />
                            </button>
                            <input
                                type="text"
                                value={quantity}
                                readOnly
                                className="w-10 text-center text-[14px] font-bold focus:outline-none"
                            />
                            <button
                                className="w-8 h-full flex items-center justify-center text-[#222] hover:text-[#43D1F0]"
                                onClick={() => handleQuantityChange(1)}
                            >
                                <Plus size={16} />
                            </button>
                        </div>
                        <button 
                            onClick={() => toggleWishlist(product)}
                            className={`w-11 h-11 border rounded-full flex items-center justify-center transition-all duration-300 shadow-sm ${isInWishlist(product.id) ? 'bg-[#f04e23] border-[#f04e23] text-white' : 'bg-white border-gray-100 text-[#222] hover:text-[#f04e23] hover:border-[#f04e23]'}`}
                        >
                            <Heart size={18} strokeWidth={2} fill={isInWishlist(product.id) ? "currentColor" : "none"} />
                        </button>
                        <button className="w-11 h-11 border border-gray-100 rounded-full flex items-center justify-center bg-white text-[#222] hover:bg-[#222] hover:text-white transition-all shadow-sm">
                            <RefreshCw size={18} strokeWidth={2} />
                        </button>
                    </div>

                    {/* Main Actions */}
                    <div className="space-y-3">
                        <button
                            onClick={() => {
                                if (isOutOfStock) return;
                                addToCart(product, quantity, selectedSize);
                                onClose();
                            }}
                            disabled={isOutOfStock}
                            className={`w-full h-[50px] font-bold text-[13px] uppercase tracking-widest transition-all rounded-full shadow-lg ${isOutOfStock ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#43D1F0] hover:bg-[#222]'} text-white`}
                        >
                            {isOutOfStock ? 'SOLD OUT' : 'ADD TO CART'}
                        </button>
                        <button 
                            onClick={handleBuyNow}
                            disabled={isOutOfStock}
                            className={`w-full h-[50px] font-bold text-[13px] uppercase tracking-widest transition-all rounded-full shadow-lg ${isOutOfStock ? 'bg-gray-300 cursor-not-allowed text-gray-500' : 'bg-[#222] hover:bg-black text-white'}`}
                        >
                            {isOutOfStock ? 'OUT OF STOCK' : 'BUY IT NOW'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QuickAddModal;
