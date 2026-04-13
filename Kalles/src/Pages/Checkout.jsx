import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../Context/CartContext';
import { useCurrency } from '../Context/CurrencyContext';
import { Truck, MapPin, CreditCard, ChevronDown, HelpCircle, ShoppingCart, ArrowLeft, ShoppingBag, Lock } from 'lucide-react';

const Checkout = () => {
    const { cartItems, cartTotal, clearCart, discount, appliedCoupon, applyDiscount } = useCart();
    const { formatPrice, getConvertedPrice, selectedCurrency } = useCurrency();
    const navigate = useNavigate();

    const user = JSON.parse(localStorage.getItem('user') || 'null');
    const token = localStorage.getItem('token');

    // STRICT SECURITY: Redirect or block if not logged in
    if (!token || !user || !user.email) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-[#f8f9fa] p-4 text-center">
                <div className="bg-white p-10 rounded-2xl shadow-xl max-w-md w-full border border-gray-100">
                    <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Lock size={40} />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Login Required</h2>
                    <p className="text-gray-500 mb-8">You must be logged in to complete your purchase. Please login or create an account to proceed.</p>
                    <button
                        onClick={() => navigate('/')}
                        className="w-full bg-black text-white h-13 py-4 rounded-full font-bold uppercase text-sm hover:bg-gray-800 transition-colors"
                    >
                        Return to Home & Login
                    </button>
                </div>
            </div>
        );
    }

    const [email, setEmail] = useState(user?.email || '');
    const [firstName, setFirstName] = useState(user?.name?.split(' ')[0] || '');
    const [lastName, setLastName] = useState(user?.name?.split(' ').slice(1).join(' ') || '');
    const [address, setAddress] = useState('');
    const [apartment, setApartment] = useState('');
    const [city, setCity] = useState('');
    const [zipCode, setZipCode] = useState('10115');
    const [country, setCountry] = useState('Germany');
    const [phone, setPhone] = useState('');

    const [newsletter, setNewsletter] = useState(false);
    const [deliveryMethod, setDeliveryMethod] = useState('ship');
    const [shippingMethod, setShippingMethod] = useState('international');
    const [billingSame, setBillingSame] = useState(true);
    const [giftCard, setGiftCard] = useState(appliedCoupon || '');
    const [couponError, setCouponError] = useState('');
    const [couponSuccess, setCouponSuccess] = useState(discount > 0 ? `${discount}% discount applied!` : '');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const subtotal = cartTotal;
    const discountAmount = (subtotal * discount) / 100;
    const shippingCost = shippingMethod === 'international' ? 0 : 16.95;
    const total = subtotal - discountAmount + shippingCost;

    const handleApplyCoupon = async () => {
        setCouponError('');
        setCouponSuccess('');

        if (!giftCard) {
            setCouponError('Please enter a coupon code.');
            return;
        }

        if (giftCard.toUpperCase() === 'CODE15OFF') {
            try {
                // Check if it's the first order
                const response = await fetch(`http://localhost:5000/api/orders/check-first-order/${encodeURIComponent(email)}?userId=${user?.id}`);
                const data = await response.json();

                if (data.isFirstOrder) {
                    applyDiscount(15, 'CODE15OFF');
                    setCouponSuccess('15% discount applied for your first order!');
                } else {
                    setCouponError('This code is only valid for your first order.');
                    applyDiscount(0, '');
                }
            } catch (error) {
                console.error("Error checking order history:", error);
                setCouponError('An error occurred. Please try again.');
            }
        } else {
            setCouponError('Invalid coupon code.');
            applyDiscount(0, '');
        }
    };

    const handlePayNow = async () => {
        if (!token || !user) {
            alert('Your session has expired. Please login again.');
            navigate('/');
            return;
        }

        const isEmail = email.includes('@');
        const isPhone = /^\d{10,}$/.test(email.replace(/\s/g, ''));
        if (!email || !lastName || !address || !city || !zipCode || !country) {
            alert('Please fill in all required fields.');
            return;
        }

        if (!email.includes('@')) {
            alert('Please enter a valid email address so we can send you order updates.');
            return;
        }

        setIsSubmitting(true);
        const orderData = {
            user_id: user?.id || null,
            customer_name: `${firstName} ${lastName}`.trim(),
            customer_email: email,
            customer_phone: phone || '', 
            shipping_address: apartment ? `${address}, ${apartment}` : address,
            city,
            state: '', // Not used in this form currently
            zip_code: zipCode,
            country,
            total_amount: getConvertedPrice(total),
            currency: selectedCurrency?.code || 'AED',
            items: cartItems.map(item => ({
                id: item.id,
                name: item.name,
                image: item.image1,
                quantity: item.quantity,
                price: getConvertedPrice(Number(item.price)),
                selectedSize: item.selectedSize
            }))
        };

        try {
            const response = await fetch('http://localhost:5000/api/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(orderData),
            });

            if (response.ok) {
                const result = await response.json();
                alert('Order placed successfully! Order ID: ' + result.orderId);
                clearCart();
                navigate('/');
            } else {
                const errorText = await response.text();
                alert('Failed to place order: ' + errorText);
            }
        } catch (error) {
            console.error('Error submitting order:', error);
            alert('An error occurred while placing your order. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (cartItems.length === 0) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-white p-4">
                <ShoppingCart size={64} className="text-gray-200 mb-6" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2"> Your cart is empty</h2>
                <p className="text-gray-500 mb-8">Add some items to your cart before checking out.</p>
                <button
                    onClick={() => navigate('/cart')}
                    className="flex items-center gap-2 bg-black text-white px-8 py-3 rounded-full font-bold uppercase text-sm hover:bg-gray-800 transition-all"
                >
                    <ArrowLeft size={16} /> Return to cart
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">
            {/* Top Header */}
            <header className="w-full border-t-[3px] border-[#a89e92] bg-white h-[80px] flex items-center justify-between px-4 lg:px-12 sticky top-0 z-50">
                <div className="w-10"></div> {/* Spacer for symmetry */}
                <Link to="/" className="flex-1 text-center">
                    <h1 className="text-[28px] font-black tracking-tighter text-[#222]">kalles</h1>
                </Link>
                <div className="relative group cursor-pointer" onClick={() => navigate('/cart')}>
                    <ShoppingBag size={22} className="text-[#222]" />
                    <span className="absolute -top-1.5 -right-1.5 w-[17px] h-[17px] bg-[#56cfe1] text-white text-[10px] font-bold flex items-center justify-center rounded-full">
                        {cartItems.reduce((acc, item) => acc + item.quantity, 0)}
                    </span>
                </div>
            </header>

            <div className="flex flex-col lg:flex-row min-h-[calc(100vh-80px)]">

                {/* Left Section - Forms */}
                <div className="flex-1 px-4 py-8 lg:px-24 lg:py-12 border-r border-gray-100">
                    <div className="max-w-[600px] ml-auto">
                        {/* Old Header/Logo removed */}

                        {/* Contact Section */}
                        <section className="mb-10">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-[19px] font-bold text-[#222]">Contact</h2>
                                <Link to="/admin/login" className="text-sm text-gray-500 underline underline-offset-4 hover:text-black">Sign in</Link>
                            </div>
                            <div className="space-y-4">
                                <input
                                    type="email"
                                    placeholder="Email or mobile phone number"
                                    className="w-full h-[50px] px-4 border border-gray-300 rounded-[5px] focus:ring-1 focus:ring-blue-500 outline-none transition-all placeholder:text-gray-400 text-sm"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <input
                                        type="checkbox"
                                        className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                        checked={newsletter}
                                        onChange={(e) => setNewsletter(e.target.checked)}
                                    />
                                    <span className="text-sm text-gray-600 group-hover:text-black transition-colors">Email me with news and offers</span>
                                </label>
                            </div>
                        </section>

                        {/* Delivery Section */}
                        <section className="mb-10">
                            <h2 className="text-[19px] font-bold text-[#222] mb-4">Delivery</h2>
                            <div className="border border-gray-300 rounded-[5px] divide-y divide-gray-300 overflow-hidden mb-4">
                                <label className={`flex items-center justify-between p-4 cursor-pointer transition-colors ${deliveryMethod === 'ship' ? 'bg-blue-50/50' : 'hover:bg-gray-50'}`}>
                                    <div className="flex items-center gap-3">
                                        <input
                                            type="radio"
                                            name="delivery"
                                            className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                                            checked={deliveryMethod === 'ship'}
                                            onChange={() => setDeliveryMethod('ship')}
                                        />
                                        <span className="text-sm font-medium">Ship</span>
                                    </div>
                                    <MapPin size={18} className="text-gray-400" />
                                </label>
                                <label className={`flex items-center justify-between p-4 cursor-pointer transition-colors ${deliveryMethod === 'pickup' ? 'bg-blue-50/50' : 'hover:bg-gray-50'}`}>
                                    <div className="flex items-center gap-3">
                                        <input
                                            type="radio"
                                            name="delivery"
                                            className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                                            checked={deliveryMethod === 'pickup'}
                                            onChange={() => setDeliveryMethod('pickup')}
                                        />
                                        <span className="text-sm font-medium">Pick up</span>
                                    </div>
                                    <div className="w-5 h-5 border border-gray-400 rounded flex items-center justify-center">
                                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                                    </div>
                                </label>
                            </div>

                            <div className="space-y-4">
                                <div className="relative">
                                    <select
                                        className="w-full h-[50px] px-4 pt-4 pb-1 border border-gray-300 rounded-[5px] focus:ring-1 focus:ring-blue-500 outline-none appearance-none text-sm"
                                        value={country}
                                        onChange={(e) => setCountry(e.target.value)}
                                    >
                                        <option>Germany</option>
                                        <option>United Arab Emirates</option>
                                        <option>United States</option>
                                    </select>
                                    <span className="absolute left-4 top-1.5 text-[11px] text-gray-500 font-medium">Country/Region</span>
                                    <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <input
                                        type="text"
                                        placeholder="First name (optional)"
                                        className="w-full h-[50px] px-4 border border-gray-300 rounded-[5px] outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                                        value={firstName}
                                        onChange={(e) => setFirstName(e.target.value)}
                                    />
                                    <input
                                        type="text"
                                        placeholder="Last name"
                                        className="w-full h-[50px] px-4 border border-gray-300 rounded-[5px] outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                                        value={lastName}
                                        onChange={(e) => setLastName(e.target.value)}
                                    />
                                </div>
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Address"
                                        className="w-full h-[50px] px-4 border border-gray-300 rounded-[5px] outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                                        value={address}
                                        onChange={(e) => setAddress(e.target.value)}
                                    />
                                    <HelpCircle size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Apartment, suite, etc. (optional)"
                                    className="w-full h-[50px] px-4 border border-gray-300 rounded-[5px] outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                                    value={apartment}
                                    onChange={(e) => setApartment(e.target.value)}
                                />
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="relative">
                                        <input
                                            type="text"
                                            placeholder="Postal code"
                                            className="w-full h-[50px] px-4 pt-4 pb-1 border border-gray-300 rounded-[5px] outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                                            value={zipCode}
                                            onChange={(e) => setZipCode(e.target.value)}
                                        />
                                        <span className="absolute left-4 top-1.5 text-[11px] text-gray-500 font-medium">Postal code</span>
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="City"
                                        className="w-full h-[50px] px-4 border border-gray-300 rounded-[5px] outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                                        value={city}
                                        onChange={(e) => setCity(e.target.value)}
                                    />
                                </div>
                                <input
                                    type="tel"
                                    placeholder="Phone"
                                    className="w-full h-[50px] px-4 border border-gray-300 rounded-[5px] outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                />
                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                                    <span className="text-sm text-gray-600 group-hover:text-black transition-colors">Save this information for next time</span>
                                </label>
                            </div>
                        </section>

                        {/* Shipping Method Section */}
                        <section className="mb-10">
                            <h2 className="text-[19px] font-bold text-[#222] mb-4">Shipping method</h2>
                            <div className="border border-gray-300 rounded-[5px] divide-y divide-gray-300 overflow-hidden">
                                <label className={`flex items-center justify-between p-4 cursor-pointer transition-colors ${shippingMethod === 'international' ? 'bg-blue-50/50' : 'hover:bg-gray-50'}`}>
                                    <div className="flex items-center gap-3">
                                        <input
                                            type="radio"
                                            name="shipping"
                                            className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                                            checked={shippingMethod === 'international'}
                                            onChange={() => setShippingMethod('international')}
                                        />
                                        <span className="text-sm font-medium">International Shipping</span>
                                    </div>
                                    <span className="text-xs font-bold uppercase tracking-widest text-[#222]">Free</span>
                                </label>
                                <label className={`flex items-center justify-between p-4 cursor-pointer transition-colors ${shippingMethod === 'standard' ? 'bg-blue-50/50' : 'hover:bg-gray-50'}`}>
                                    <div className="flex items-center gap-3">
                                        <input
                                            type="radio"
                                            name="shipping"
                                            className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                                            checked={shippingMethod === 'standard'}
                                            onChange={() => setShippingMethod('standard')}
                                        />
                                        <span className="text-sm font-medium">Standard</span>
                                    </div>
                                    <span className="text-xs font-bold text-[#222]">{formatPrice(16.95)}</span>
                                </label>
                            </div>
                        </section>

                        {/* Payment Section */}
                        <section className="mb-10">
                            <h2 className="text-[19px] font-bold text-[#222] mb-1">Payment</h2>
                            <p className="text-xs text-gray-500 mb-6">All transactions are secure and encrypted.</p>

                            <div className="border border-gray-300 rounded-[5px] overflow-hidden">
                                <div className="bg-blue-50/50 p-4 border-b border-gray-300 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <input type="radio" checked readOnly className="w-4 h-4 text-blue-600 focus:ring-blue-500" />
                                        <span className="text-sm font-medium">Credit card</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 grayscale opacity-70">
                                        <div className="w-8 h-5 bg-orange-400 rounded flex items-center justify-center text-[10px] text-white font-bold">B</div>
                                    </div>
                                </div>
                                <div className="p-4 space-y-4 bg-gray-50/30">
                                    <div className="relative">
                                        <input type="text" placeholder="Card number" className="w-full h-[45px] px-4 border border-gray-300 rounded-[5px] outline-none focus:ring-1 focus:ring-blue-500 bg-white text-sm" />
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2">
                                            <Lock size={18} className="text-gray-400" />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <input type="text" placeholder="Expiration date (MM / YY)" className="w-full h-[45px] px-4 border border-gray-300 rounded-[5px] outline-none focus:ring-1 focus:ring-blue-500 bg-white text-sm" />
                                        <div className="relative">
                                            <input type="text" placeholder="Security code" className="w-full h-[45px] px-4 border border-gray-300 rounded-[5px] outline-none focus:ring-1 focus:ring-blue-500 bg-white text-sm" />
                                            <HelpCircle size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                        </div>
                                    </div>
                                    <input type="text" placeholder="Name on card" className="w-full h-[45px] px-4 border border-gray-300 rounded-[5px] outline-none focus:ring-1 focus:ring-blue-500 bg-white text-sm" />
                                </div>
                                <div className="p-4 bg-white border-t border-gray-300">
                                    <label className="flex items-center gap-3 cursor-pointer group">
                                        <input
                                            type="checkbox"
                                            className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                            checked={billingSame}
                                            onChange={(e) => setBillingSame(e.target.checked)}
                                        />
                                        <span className="text-sm text-gray-600 group-hover:text-black transition-colors">Use shipping address as billing address</span>
                                    </label>
                                </div>
                            </div>
                        </section>

                        {/* Submit Button */}
                        <button
                            className={`w-full h-[60px] bg-[#197bbd] hover:bg-[#156a9e] text-white rounded-[5px] font-bold text-[16px] transition-colors mb-12 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                            onClick={handlePayNow}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Processing...' : 'Pay now'}
                        </button>

                        {/* Footer Sub-links */}
                        <div className="pt-6 flex flex-wrap gap-x-3 gap-y-2 mb-12">
                            {['Refund policy', 'Shipping', 'Privacy policy', 'Terms of service', 'Cancellations', 'Contact'].map((link) => (
                                <Link key={link} to="#" className="text-[12px] text-[#0066cc] hover:text-[#004d99] transition-colors underline underline-offset-2">
                                    {link}
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Section - Summary */}
                <div className="w-full lg:w-[38%] bg-[#f9f9f9] px-4 py-8 lg:px-12 lg:py-16 lg:sticky lg:top-0 lg:max-h-screen lg:overflow-y-auto">
                    <div className="max-w-[440px] mr-auto">
                        {/* Cart Items */}
                        <div className="space-y-6 mb-8 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                            {cartItems.map((item) => (
                                <div key={`${item.id}-${item.selectedSize}`} className="flex items-center gap-4 relative">
                                    <div className="w-[64px] h-[72px] bg-white border border-gray-200 rounded-[8px] overflow-hidden shrink-0 relative">
                                        <img
                                            src={item.image1}
                                            alt={item.name}
                                            className="w-full h-full object-cover"
                                            onError={(e) => { e.target.src = 'https://via.placeholder.com/64x72?text=Product'; }}
                                        />
                                        <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-black text-white text-[11px] font-bold flex items-center justify-center rounded-full z-10 opacity-80">
                                            {item.quantity}
                                        </span>
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-sm font-bold text-[#222] line-clamp-1">{item.name}</h3>
                                        <p className="text-xs text-gray-500 mt-0.5">Black / {item.selectedSize}</p>
                                    </div>
                                    <span className="text-sm font-medium text-[#222]">{formatPrice(Number(item.price))}</span>
                                </div>
                            ))}
                        </div>

                        {/* Gift Card */}
                        <div className="mb-0">
                            <div className="flex gap-2 mb-2">
                                <input
                                    type="text"
                                    placeholder="Gift card"
                                    className="flex-1 h-[45px] px-4 border border-gray-300 rounded-[5px] text-sm bg-white outline-none focus:ring-1 focus:ring-blue-500"
                                    value={giftCard}
                                    onChange={(e) => setGiftCard(e.target.value)}
                                />
                                <button
                                    onClick={handleApplyCoupon}
                                    className="px-6 h-[45px] bg-[#222] text-white font-bold text-xs uppercase rounded-[5px] hover:bg-black transition-colors"
                                >
                                    Apply
                                </button>
                            </div>
                            {couponError && <p className="text-red-500 text-xs mt-1 mb-2">{couponError}</p>}
                            {couponSuccess && <p className="text-green-600 text-xs mt-1 mb-2">{couponSuccess}</p>}
                        </div>
                        <div className="border-b border-gray-200 pb-8 mb-8"></div>

                        {/* Totals Section */}
                        <div className="space-y-3 mb-6">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-600">Subtotal · {cartItems.reduce((acc, item) => acc + item.quantity, 0)} items</span>
                                <span className="font-bold text-[#222]">{formatPrice(subtotal)}</span>
                            </div>
                            {discount > 0 && (
                                <div className="flex justify-between items-center text-sm text-green-600">
                                    <span>Discount (15% OFF)</span>
                                    <span className="font-bold">-{formatPrice(discountAmount)}</span>
                                </div>
                            )}
                            <div className="flex justify-between items-center text-sm">
                                <div className="flex items-center gap-1.5 text-gray-600">
                                    <span>Shipping</span>
                                    <HelpCircle size={14} className="cursor-help" />
                                </div>
                                <span className="text-xs font-bold uppercase text-[#222]">
                                    {shippingCost === 0 ? 'Free' : formatPrice(shippingCost)}
                                </span>
                            </div>
                        </div>

                        <div className="flex justify-between items-baseline pt-4">
                            <span className="text-[20px] font-bold text-[#222]">Total</span>
                            <div className="text-right">
                                <span className="text-[11px] text-gray-500 uppercase mr-2 font-medium">{selectedCurrency?.code || 'AED'}</span>
                                <span className="text-[24px] font-black text-[#222]">{formatPrice(total)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
