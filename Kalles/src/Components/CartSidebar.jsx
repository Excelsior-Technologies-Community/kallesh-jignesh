import React, { useState } from 'react';
import { X, Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react';
import { useCart } from '../Context/CartContext';
import { useCurrency } from '../Context/CurrencyContext';
import { Link, useNavigate } from 'react-router-dom';

const CartSidebar = () => {
    const { formatPrice } = useCurrency();
    const {
        cartItems,
        isCartOpen,
        closeCart,
        removeFromCart,
        updateQuantity,
        cartTotal
    } = useCart();

    const [isAgreed, setIsAgreed] = useState(false);
    const navigate = useNavigate();

    const freeShippingLimit = 375;
    const progress = Math.min((cartTotal / freeShippingLimit) * 100, 100);
    const amountToFreeShipping = Math.max(0, freeShippingLimit - cartTotal);

    if (!isCartOpen) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/50 z-[1001] transition-opacity duration-300"
                onClick={closeCart}
            ></div>

            {/* Sidebar */}
            <div className={`fixed top-0 right-0 h-full w-full max-w-[340px] md:max-w-[400px] bg-white z-[1002] shadow-2xl flex flex-col transform transition-transform duration-300 ${isCartOpen ? 'translate-x-0' : 'translate-x-full'}`}>

                {/* Header */}
                <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0 z-10">
                    <h2 className="text-[18px] font-bold text-[#222]">Your cart</h2>
                    <button onClick={closeCart} className="hover:rotate-90 transition-transform duration-300 p-1">
                        <X size={24} strokeWidth={1.5} />
                    </button>
                </div>

                {/* Free Shipping Progress - Only show when cart has items */}
                {cartItems.length > 0 && (
                <div className="p-5 bg-white border-b border-gray-50">
                    <div className="flex justify-between items-center mb-2">
                        <p className="text-[13px] text-gray-500">
                            {amountToFreeShipping > 0 ? (
                                <>Free Shipping for all orders over <span className="text-[#f04e23] font-bold">{formatPrice(freeShippingLimit)}</span></>
                            ) : (
                                <span className="text-[#00a500] font-bold italic">Congratulations! You've got free shipping!</span>
                            )}
                        </p>
                    </div>
                    <div className="relative w-full h-[6px] bg-[#f2f2f2] rounded-full overflow-hidden">
                        <div
                            className={`absolute top-0 left-0 h-full transition-all duration-500 rounded-full ${amountToFreeShipping === 0 ? 'bg-[#00a500]' : 'bg-[#f04e23]'}`}
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>
                </div>
                )}

                {/* Cart Items */}
                <div className="flex-1 overflow-y-auto p-5 custom-scrollbar">
                    {cartItems.length > 0 ? (
                        <div className="space-y-6">
                            {cartItems.map((item) => (
                                <div key={`${item.id}-${item.selectedSize}`} className="flex gap-4 group">
                                    <div className="w-[80px] h-[100px] shrink-0 bg-[#f6f6f6] rounded overflow-hidden">
                                        <img
                                            src={item.image1}
                                            alt={item.name}
                                            className="w-full h-full object-cover"
                                            onError={(e) => { e.target.src = 'https://via.placeholder.com/80x100?text=No+Image'; }}
                                        />
                                    </div>
                                    <div className="flex-1 flex flex-col">
                                        <div className="flex justify-between items-start mb-1">
                                            <h3 className="text-[14px] font-bold text-[#222] hover:text-[#56cfe1] transition-colors line-clamp-1">
                                                <Link to={`/product/${item.id}`} onClick={closeCart}>{item.name}</Link>
                                            </h3>
                                            <button
                                                onClick={() => removeFromCart(item.id, item.selectedSize)}
                                                className="text-gray-400 hover:text-red-500 transition-colors"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                        <p className="text-[12px] text-gray-400 mb-2 uppercase tracking-wider">{item.selectedSize}</p>
                                        <div className="mt-auto flex justify-between items-center">
                                            <div className="flex items-center border border-gray-200 rounded-full h-[32px] px-2">
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.selectedSize, -1)}
                                                    className="w-6 h-full flex items-center justify-center text-gray-500 hover:text-black transition-colors"
                                                >
                                                    <Minus size={12} />
                                                </button>
                                                <span className="w-8 text-center text-[13px] font-bold text-[#222]">{item.quantity}</span>
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.selectedSize, 1)}
                                                    className="w-6 h-full flex items-center justify-center text-gray-500 hover:text-black transition-colors"
                                                >
                                                    <Plus size={12} />
                                                </button>
                                            </div>
                                            <span className="text-[14px] font-bold text-[#222]">{formatPrice(Number(item.price) * item.quantity)}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-center px-4">
                            <ShoppingBag size={64} strokeWidth={1} className="text-gray-200 mb-4" />
                            <p className="text-gray-500 text-[15px] mb-6">Your cart is currently empty.</p>
                            <Link
                                to="/"
                                onClick={closeCart}
                                className="bg-black text-white px-8 py-3 rounded-full text-[13px] font-bold hover:bg-[#56cfe1] transition-all duration-300 tracking-wider uppercase"
                            >
                                Return to shop
                            </Link>
                        </div>
                    )}
                </div>

                {/* Footer */}
                {cartItems.length > 0 && (
                    <div className="p-5 border-t border-gray-100 bg-[#f9f9f9]">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-[16px] font-bold text-[#222]">Subtotal</span>
                            <span className="text-[18px] font-black text-[#222]">{formatPrice(cartTotal)}</span>
                        </div>
                        <p className="text-[12px] text-gray-500 mb-4">
                            Taxes and <Link to="#" className="underline">shipping</Link> calculated at checkout
                        </p>
                        <div className="flex items-center gap-2 mb-6">
                            <input
                                type="checkbox"
                                id="terms"
                                className="w-4 h-4 rounded border-gray-300 accent-black cursor-pointer"
                                checked={isAgreed}
                                onChange={(e) => setIsAgreed(e.target.checked)}
                            />
                            <label htmlFor="terms" className="text-[12px] text-gray-500 cursor-pointer select-none">
                                I agree with the <Link to="#" className="underline">terms and conditions</Link>
                            </label>
                        </div>
                        <div className="space-y-3">
                            <button
                                onClick={(e) => {
                                    if (!isAgreed) {
                                        alert("Please agree to the terms and conditions to proceed.");
                                        e.preventDefault();
                                        return;
                                    }
                                    closeCart();
                                    navigate('/cart');
                                }}
                                className={`block w-full text-center py-3.5 rounded-full font-bold text-[13px] tracking-widest uppercase transition-all duration-300 ${isAgreed ? 'bg-[#56cfe1] text-white hover:bg-black cursor-pointer' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
                            >
                                View Cart
                            </button>
                            <button
                                onClick={() => {
                                    if (!isAgreed) {
                                        alert("Please agree to the terms and conditions to proceed.");
                                        return;
                                    }
                                    // Handle checkout logic
                                    closeCart();
                                    navigate('/checkout');
                                }}
                                className={`block w-full py-3.5 rounded-full font-bold text-[13px] tracking-widest uppercase transition-all duration-300 ${isAgreed ? 'bg-[#222] text-white hover:bg-[#56cfe1] cursor-pointer' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
                            >
                                Check Out
                            </button>
                        </div>

                        {/* Payment Icons */}
                        <div className="mt-6 flex justify-center items-center gap-3 grayscale hover:grayscale-0 transition-all opacity-60">
                            <img src="https://raw.githubusercontent.com/activemerchant/payment_icons/refs/heads/master/app/assets/images/payment_icons/visa.svg" alt="visa" className="h-4" />
                            <img src="https://raw.githubusercontent.com/activemerchant/payment_icons/refs/heads/master/app/assets/images/payment_icons/paypal.svg" alt="paypal" className="h-4" />
                            <img src="https://raw.githubusercontent.com/activemerchant/payment_icons/refs/heads/master/app/assets/images/payment_icons/master.svg" alt="mastercard" className="h-4" />
                            <img src="https://raw.githubusercontent.com/activemerchant/payment_icons/refs/heads/master/app/assets/images/payment_icons/american_express.svg" alt="amex" className="h-4" />
                            <img src="https://raw.githubusercontent.com/activemerchant/payment_icons/refs/heads/master/app/assets/images/payment_icons/amazon.svg" alt="amazon" className="h-4" />
                        </div>
                    </div>
                )}

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
        </>
    );
};

export default CartSidebar;
