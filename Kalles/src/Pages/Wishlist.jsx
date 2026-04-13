import React from 'react';
import { Trash2, Heart, ShoppingBag, Eye, ShoppingCart } from 'lucide-react';
import { useWishlist } from '../Context/WishlistContext';
import { useCart } from '../Context/CartContext';
import { useCurrency } from '../Context/CurrencyContext';
import { Link } from 'react-router-dom';
import QuickViewModal from '../Components/QuickViewModal';
import QuickAddModal from '../Components/QuickAddModal';
import { useState } from 'react';

const Wishlist = () => {
    const { formatPrice } = useCurrency();
    const { wishlistItems, removeFromWishlist } = useWishlist();
    const { addToCart } = useCart();
    
    // Quick View and Quick Add state
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
    const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);

    const handleQuickView = (product) => {
        setSelectedProduct(product);
        setIsQuickViewOpen(true);
    };

    const handleQuickAdd = (product) => {
        setSelectedProduct(product);
        setIsQuickAddOpen(true);
    };

    return (
        <div className="min-h-screen bg-white pb-20">
            {/* Banner Section */}
            <div className="relative h-[250px] md:h-[300px] w-full flex items-center justify-center overflow-hidden">
                <img
                    src="https://kalles-5.myshopify.com/cdn/shop/files/bg-heading.jpg?v=1717580690&width=1920"
                    alt="Wishlist Banner"
                    className="absolute inset-0 w-full h-full object-cover scale-105"
                />
                {/* Modern Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60"></div>
                
                <div className="relative z-10 text-center px-4">
                    <h1 className="text-[36px] md:text-[56px] font-bold tracking-[0.3em] uppercase text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)] leading-tight">
                        Wishlist
                    </h1>
                    <div className="flex items-center justify-center gap-4 my-6">
                        <div className="w-12 h-[1px] bg-[#56cfe1]/50"></div>
                        <div className="w-2 h-2 rounded-full bg-[#56cfe1]"></div>
                        <div className="w-12 h-[1px] bg-[#56cfe1]/50"></div>
                    </div>
                    <p className="text-[16px] md:text-[18px] text-white/90 font-medium tracking-[0.1em] italic">
                        View your wishlist products
                    </p>
                </div>
            </div>

            <div className="container mx-auto max-w-[1200px] px-4 py-12">
                {wishlistItems.length > 0 ? (
                    <div className="space-y-6">
                        {/* Headers (Desktop) */}
                        <div className="hidden md:grid grid-cols-12 gap-8 pb-6 border-b border-gray-100 items-center">
                            <div className="col-span-1"></div>
                            <div className="col-span-6 text-[14px] font-bold uppercase tracking-wider text-[#222]">Product Name</div>
                            <div className="col-span-2 text-[14px] font-bold uppercase tracking-wider text-[#222] text-center">Price</div>
                            <div className="col-span-3 text-right text-[14px] font-bold uppercase tracking-wider text-[#222]">Action</div>
                        </div>

                        {wishlistItems.map((item) => (
                            <div key={item.id} className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 py-8 border-b border-gray-100 items-center group relative">
                                {/* Remove Icon */}
                                <div className="absolute top-4 right-4 md:static md:col-span-1 flex items-center justify-center">
                                    <button
                                        onClick={() => removeFromWishlist(item.id)}
                                        className="w-10 h-10 flex items-center justify-center text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-full transition-all duration-300"
                                        title="Remove from wishlist"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>

                                {/* Product Info Section */}
                                <div className="md:col-span-6 flex items-center gap-6">
                                    <div className="relative w-[100px] h-[130px] shrink-0 bg-[#f6f6f6] rounded overflow-hidden">
                                        <img
                                            src={item.image1}
                                            alt={item.name}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                            onError={(e) => { e.target.src = 'https://via.placeholder.com/100x130?text=No+Image'; }}
                                        />
                                        {item.is_new === 1 && (
                                            <span className="absolute top-2 right-2 bg-[#00a500] text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase">New</span>
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-[16px] font-bold text-[#222] hover:text-[#56cfe1] transition-colors mb-2">
                                            <Link to={`/product/${item.id}`}>{item.name}</Link>
                                        </h3>
                                        {/* Simplified Description/Details as in screenshot */}
                                        <div className="text-[13px] text-gray-500 space-y-1">
                                            <p>Size: <span className="font-medium text-[#222]">XS, S, M, L, XL</span></p>
                                            <p className="line-clamp-2 mt-2 leading-relaxed">
                                                {item.description || "Viverra a consectetur Go sporty this summer with this vintage navy and white striped v-neck t-shirt from the Nike. Perfect for pairing with denim and white kicks for a stylish..."}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Price Section */}
                                <div className="md:col-span-2 text-center">
                                    <span className="text-[15px] font-black text-[#222]">{formatPrice(Number(item.price))}</span>
                                </div>

                                {/* Action Buttons */}
                                <div className="md:col-span-3 flex flex-col gap-3">
                                    <button
                                        onClick={() => handleQuickView(item)}
                                        className="w-full bg-white border border-[#56cfe1] text-[#56cfe1] hover:bg-[#56cfe1] hover:text-white h-[45px] rounded-full text-[12px] font-bold uppercase tracking-widest transition-all shadow-sm flex items-center justify-center gap-2"
                                    >
                                        <Eye size={14} /> Quick view
                                    </button>
                                    <button
                                        onClick={() => handleQuickAdd(item)}
                                        className="w-full bg-[#56cfe1] text-white hover:bg-[#222] h-[45px] rounded-full text-[12px] font-bold uppercase tracking-widest transition-all shadow-md flex items-center justify-center gap-2"
                                    >
                                        <ShoppingCart size={14} /> Quick add
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="py-24 text-center">
                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Heart size={40} strokeWidth={1} className="text-gray-300" />
                        </div>
                        <h2 className="text-[24px] font-bold text-[#222] mb-4 uppercase tracking-wider">Your wishlist is empty</h2>
                        <p className="text-gray-500 mb-8 max-w-sm mx-auto">Save your favorite items here to keep track of them and buy later.</p>
                        <Link
                            to="/"
                            className="inline-block bg-[#222] text-white px-10 py-4 rounded-full font-bold text-[13px] tracking-widest uppercase hover:bg-[#56cfe1] transition-all duration-500 shadow-xl"
                        >
                            Explore Products
                        </Link>
                    </div>
                )}
            </div>

            {/* Modals */}
            <QuickViewModal
                isOpen={isQuickViewOpen}
                onClose={() => setIsQuickViewOpen(false)}
                product={selectedProduct}
            />
            <QuickAddModal
                isOpen={isQuickAddOpen}
                onClose={() => setIsQuickAddOpen(false)}
                product={selectedProduct}
            />
        </div>
    );
};

export default Wishlist;
