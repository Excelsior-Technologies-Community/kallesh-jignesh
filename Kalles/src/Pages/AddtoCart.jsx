import React, { useState } from 'react';
import { Minus, Plus, ShoppingBag, Trash2, Heart, RefreshCw, ChevronDown } from 'lucide-react';
const GiftWrap = 'https://kalles-5.myshopify.com/cdn/shop/files/gift-wrap.png?v=1717405215&width=160';
import Section3 from '../Sections/Section3';
import { useCart } from '../Context/CartContext';
import { Link, useNavigate } from 'react-router-dom';
import { useCurrency } from '../Context/CurrencyContext';

const AddtoCart = () => {
    const { formatPrice } = useCurrency();
    const {
        cartItems,
        removeFromCart,
        updateQuantity,
        cartTotal,
        discount,
        applyDiscount
    } = useCart();
    
    // Check if user is logged in
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    const [couponError, setCouponError] = useState('');
    const [couponSuccess, setCouponSuccess] = useState('');

    const navigate = useNavigate();
    const [orderNote, setOrderNote] = useState('');
    const [discountCode, setDiscountCode] = useState('');
    const [showEstimate, setShowEstimate] = useState(false);
    const [isAgreed, setIsAgreed] = useState(false);



    return (
        <div className="min-h-screen bg-white">
            {/* Banner Section */}
            <div className="relative h-[140px] w-full flex items-center justify-center bg-gray-100 overflow-hidden">
                <img
                    src="https://kalles-5.myshopify.com/cdn/shop/files/bg-heading.jpg?v=1717580690&width=1920"
                    alt="Cart Banner"
                    className="absolute inset-0 w-full h-full object-cover grayscale-[0.3] brightness-75"
                />
                <div className="relative z-10 text-white text-center">
                    <h1 className="text-[22px] md:text-[28px] font-bold tracking-widest uppercase">YOUR SHOPPING CART</h1>
                </div>
            </div>

            <div className="container mx-auto max-w-[1200px] w-full px-4 py-8 lg:py-16">
                {cartItems.length > 0 ? (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

                        {/* Full Width: Product List */}
                        <div className="lg:col-span-12">
                            <div className="border-t border-gray-100">
                                {cartItems.map((item) => (
                                    <div key={`${item.id}-${item.selectedSize}`} className="flex flex-col md:flex-row items-center gap-6 py-10 border-b border-gray-100 group last:border-0 first:pt-4">
                                        {/* Product Image */}
                                        <div className="w-[120px] h-[155px] shrink-0 bg-[#f7f7f7] rounded-[5px] overflow-hidden">
                                            <img
                                                src={item.image1}
                                                alt={item.name}
                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                                onError={(e) => { e.target.src = 'https://via.placeholder.com/120x150?text=No+Image'; }}
                                            />
                                        </div>

                                        {/* Product Details & Actions */}
                                        <div className="flex-1 flex flex-col md:flex-row md:items-center gap-4 md:gap-8 w-full text-center md:text-left">
                                            {/* Name and Attributes */}
                                            <div className="flex-1 min-w-[200px]">
                                                <h3 className="text-[15px] font-bold text-[#222] hover:text-[#56cfe1] transition-colors mb-2">
                                                    <Link to={`/product/${item.id}`}>{item.name}</Link>
                                                </h3>
                                                <div className="text-[13px] space-y-1">
                                                    <p className="text-gray-400">Color: <span className="text-[#666]">Black</span></p>
                                                    <p className="text-gray-400">Size: <span className="text-[#666] uppercase">{item.selectedSize}</span></p>
                                                </div>
                                                <button
                                                    onClick={() => removeFromCart(item.id, item.selectedSize)}
                                                    className="inline-flex items-center gap-1.5 text-gray-400 hover:text-red-500 transition-colors mt-4 text-[11px] uppercase font-bold tracking-[1px]"
                                                >
                                                    <Trash2 size={13} strokeWidth={2.5} /> REMOVE
                                                </button>
                                            </div>

                                            {/* Unit Price */}
                                            <div className="w-full md:w-[120px] text-[15px] font-medium text-[#222] text-center">
                                                {formatPrice(Number(item.price))}
                                            </div>

                                            {/* Quantity Selection */}
                                            <div className="w-full md:w-[160px] flex justify-center">
                                                <div className="flex items-center border border-gray-500  rounded-full h-[45px] px-2">
                                                    <button
                                                        onClick={() => {
                                                            if (item.quantity > 1) {
                                                                updateQuantity(item.id, item.selectedSize, -1);
                                                            } else {
                                                                removeFromCart(item.id, item.selectedSize);
                                                            }
                                                        }}
                                                        className="w-10 h-full flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors"
                                                    >
                                                        {item.quantity > 1 ? <Minus size={15} /> : <Trash2 size={15} className="text-red-400" />}
                                                    </button>
                                                    <span className="w-10 text-center text-[15px] font-bold text-[#222]">{item.quantity}</span>
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.selectedSize, 1)}
                                                        className="w-10 h-full flex items-center justify-center text-gray-400 hover:text-black transition-colors"
                                                    >
                                                        <Plus size={15} />
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Line Total */}
                                            <div className="w-full md:w-[120px] text-[16px] font-bold text-[#222] text-center md:text-right">
                                                {formatPrice(Number(item.price) * item.quantity)}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Bottom Section: Combined Options and Summary */}
                        <div className="lg:col-span-12 mt-12 pt-8 border-t border-gray-100">
                            {/* Gift Wrap and Free Shipping Row */}
                            <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12 text-center md:text-left">
                                <div className="flex flex-col sm:flex-row items-center gap-4">
                                    <ShoppingBag size={24} strokeWidth={1.5} className="text-[#222]" />
                                    <p className="text-[15px] text-[#222]">
                                        Do you want a gift wrap? <span className="text-gray-400">Only {formatPrice(19.00)}</span>
                                    </p>
                                    <button className="px-6 py-2 border-2 border-[#222] rounded-full text-[13px] font-bold uppercase transition-all hover:bg-[#222] hover:text-white">
                                        Add A Gift Wrap
                                    </button>
                                </div>
                                <div className="md:text-right">
                                    <p className="text-[13px] text-gray-400">
                                        Free Shipping for all orders over <span className="text-[#f04e23]">{formatPrice(375.00)}</span>
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-10">
                                {/* Left Side: Note and Discount */}
                                <div className="space-y-10">
                                    {/* Order Note */}
                                    <div className="space-y-4">
                                        <label className="text-[15px] font-bold text-[#222]">Add Order Note</label>
                                        <textarea
                                            placeholder="How can we help you?"
                                            value={orderNote}
                                            onChange={(e) => setOrderNote(e.target.value)}
                                            className="w-full h-[140px] p-5 border border-gray-200 rounded-[20px] focus:outline-none focus:border-[#56cfe1] transition-colors resize-none placeholder:text-gray-400 text-[14px]"
                                        />
                                    </div>

                                    {/* Discount Code */}
                                    <div className="space-y-4">
                                        <label className="text-[15px] font-bold text-[#222]">Add discount code</label>
                                        <div className="flex gap-4">
                                            <input
                                                type="text"
                                                placeholder="Enter discount code"
                                                value={discountCode}
                                                onChange={(e) => {
                                                    setDiscountCode(e.target.value);
                                                    setCouponError('');
                                                    setCouponSuccess('');
                                                }}
                                                className="flex-1 h-[50px] px-6 border border-gray-200 rounded-full focus:outline-none focus:border-[#56cfe1] placeholder:text-gray-400 text-[14px]"
                                            />
                                            <button 
                                                onClick={async () => {
                                                    setCouponError('');
                                                    setCouponSuccess('');
                                                    
                                                    if (!discountCode) {
                                                        setCouponError('Please enter a code.');
                                                        return;
                                                    }

                                                    if (discountCode.toUpperCase() === 'CODE15OFF') {
                                                        if (!user || !user.email) {
                                                            setCouponError('Please login to use this code.');
                                                            return;
                                                        }

                                                        try {
                                                            const response = await fetch(`http://localhost:5000/api/orders/check-first-order/${encodeURIComponent(user.email)}?userId=${user.id}`);
                                                            const data = await response.json();

                                                            if (data.isFirstOrder) {
                                                                applyDiscount(15, 'CODE15OFF');
                                                                setCouponSuccess('15% discount applied!');
                                                            } else {
                                                                setCouponError('Valid for first order only.');
                                                            }
                                                        } catch (error) {
                                                            setCouponError('Error validating code.');
                                                        }
                                                    } else {
                                                        setCouponError('Invalid code.');
                                                    }
                                                }}
                                                className="px-10 h-[50px] bg-[#222] text-white rounded-full text-[13px] font-bold uppercase hover:bg-black transition-colors"
                                            >
                                                Apply
                                            </button>
                                        </div>
                                        {couponError && <p className="text-red-500 text-xs ml-4">{couponError}</p>}
                                        {couponSuccess && <p className="text-green-600 text-xs ml-4">{couponSuccess}</p>}
                                    </div>
                                </div>

                                {/* Right Side: Summary and Checkout */}
                                <div className="flex flex-col items-center md:items-end space-y-6">
                                    <div className="flex flex-col items-end gap-2 mb-2">
                                        <div className="flex items-baseline gap-6">
                                            <span className="text-[18px] font-bold text-gray-400 uppercase tracking-[2px]">SUBTOTAL</span>
                                            <span className="text-[20px] font-bold text-gray-400 line-through">{formatPrice(cartTotal)}</span>
                                        </div>
                                        {discount > 0 && (
                                            <div className="flex items-baseline gap-6 text-green-600">
                                                <span className="text-[16px] font-bold uppercase tracking-[1px]">FIRST ORDER DISCOUNT (15%)</span>
                                                <span className="text-[18px] font-bold">-{formatPrice((cartTotal * discount) / 100)}</span>
                                            </div>
                                        )}
                                        <div className="flex items-baseline gap-6 pt-2 border-t w-full max-w-[280px] justify-end">
                                            <span className="text-[18px] font-black text-[#222] uppercase tracking-[2px]">TOTAL</span>
                                            <span className="text-[28px] font-black text-[#222]">{formatPrice(cartTotal - (cartTotal * discount) / 100)}</span>
                                        </div>
                                    </div>

                                    <p className="text-[14px] text-gray-500">
                                        Taxes and <Link to="#" className="underline decoration-gray-400 underline-offset-4">shipping</Link> calculated at checkout
                                    </p>

                                    <div className="flex items-center gap-3 py-2">
                                        <input
                                            type="checkbox"
                                            id="cart-terms"
                                            className="w-4 h-4 border-gray-300 rounded focus:ring-[#56cfe1] text-[#56cfe1] cursor-pointer"
                                            checked={isAgreed}
                                            onChange={(e) => setIsAgreed(e.target.checked)}
                                        />
                                        <label htmlFor="cart-terms" className="text-[14px] text-gray-400 cursor-pointer select-none">
                                            I agree with the terms and conditions
                                        </label>
                                    </div>

                                    <button
                                        onClick={() => {
                                            if (!isAgreed) {
                                                alert("Please agree to the terms and conditions to proceed.");
                                                return;
                                            }
                                            navigate('/checkout');
                                        }}
                                        className={`w-full max-w-[280px] h-[54px] rounded-full font-bold text-[15px] transition-all duration-500 ${isAgreed ? 'bg-[#56cfe1] text-white hover:bg-[#222] cursor-pointer' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
                                    >
                                        Check out
                                    </button>

                                    {/* Payment Icons Row */}
                                    <div className="pt-1 flex items-center ">
                                        {[
                                            'https://raw.githubusercontent.com/activemerchant/payment_icons/refs/heads/master/app/assets/images/payment_icons/visa.svg',
                                            'https://raw.githubusercontent.com/activemerchant/payment_icons/refs/heads/master/app/assets/images/payment_icons/paypal.svg',
                                            'https://raw.githubusercontent.com/activemerchant/payment_icons/refs/heads/master/app/assets/images/payment_icons/master.svg',
                                            'https://raw.githubusercontent.com/activemerchant/payment_icons/refs/heads/master/app/assets/images/payment_icons/american_express.svg',
                                            'https://raw.githubusercontent.com/activemerchant/payment_icons/refs/heads/master/app/assets/images/payment_icons/amazon.svg'
                                        ].map((src, i) => (
                                            <div key={i} className="px-3 py-1.5  rounded">
                                                <img src={src} alt="payment icon" className="h-6" />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Estimate Shipping Section */}
                        <div className="lg:col-span-12 mt-16 pt-8">
                            <div className="relative border border-gray-300 rounded-[15px] p-6 md:p-10 pt-12">
                                <h3 className="absolute -top-3 left-1/2 -translate-x-1/2 bg-white px-6 text-[18px] font-bold text-[#222]">
                                    Estimate shipping
                                </h3>
                                <div className="flex flex-col md:flex-row items-center md:items-end justify-center gap-8">
                                    <div className="w-full md:w-[300px] space-y-2">
                                        <label className="text-[13px] text-gray-400 font-medium ml-4">Country</label>
                                        <div className="relative">
                                            <select className="w-full h-[50px] px-6 border border-gray-200 rounded-full appearance-none focus:outline-none focus:border-[#56cfe1] text-[14px] text-gray-500 bg-white cursor-pointer">
                                                <option>---</option>
                                                <option>Germany</option>
                                                <option>United Arab Emirates</option>
                                                <option>United Kingdom</option>
                                                <option>United States</option>
                                                <option>India</option>
                                                <option>Russia</option>
                                                <option>China</option>
                                                <option>Japan</option>
                                                <option>South Africa</option>
                                            </select>
                                            <ChevronDown size={16} className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                        </div>
                                    </div>
                                    <div className="w-full md:w-[300px] space-y-2">
                                        <label className="text-[13px] text-gray-400 font-medium ml-4">Zip code</label>
                                        <input
                                            type="text"
                                            placeholder=""
                                            className="w-full h-[50px] px-6 border border-gray-200 rounded-full focus:outline-none focus:border-[#56cfe1] text-[14px]"
                                        />
                                    </div>
                                    <button
                                        onClick={() => setShowEstimate(true)}
                                        className="w-full md:w-[240px] h-[50px] bg-[#333] text-white rounded-full text-[13px] font-bold uppercase hover:bg-black transition-colors duration-500"
                                    >
                                        ESTIMATE
                                    </button>
                                </div>

                                {showEstimate && (
                                    <div className="mt-8 text-center animate-fadeIn">
                                        <p className="text-[14px] text-gray-600 mb-4">
                                            We found several shipping rates available for your address:
                                        </p>
                                        <ul className="inline-block text-left space-y-2">
                                            <li className="flex items-center gap-2 text-[14px] text-[#2d8a39]">
                                                <span className="w-1.5 h-1.5 rounded-full bg-[#2d8a39]"></span>
                                                International Shipping: FREE
                                            </li>
                                            <li className="flex items-center gap-2 text-[14px] text-[#2d8a39] ml-4">
                                                <span className="w-1.5 h-1.5 rounded-full bg-[#2d8a39]"></span>
                                                Standard: {formatPrice(73.20)}
                                            </li>
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="py-24 text-center">
                        <ShoppingBag size={80} strokeWidth={1} className="text-gray-200 mx-auto mb-6" />
                        <h2 className="text-[24px] font-bold text-[#222] mb-4 uppercase tracking-wider">Your cart is empty</h2>
                        <p className="text-gray-500 mb-8 max-w-md mx-auto">Looks like you haven't added anything to your cart yet. Go ahead and explore our latest collections!</p>
                        <Link
                            to="/"
                            className="inline-block bg-[#222] text-white px-10 py-4 rounded-full font-bold text-[13px] tracking-widest uppercase hover:bg-[#56cfe1] transition-all duration-500 shadow-xl"
                        >
                            Return to shop
                        </Link>
                    </div>
                )}
            </div >
        </div >
    );
};

export default AddtoCart;
