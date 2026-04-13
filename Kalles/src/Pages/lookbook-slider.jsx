import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { Plus, ChevronLeft, ChevronRight, Truck, Headphones, RotateCcw, ShieldCheck } from 'lucide-react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { SlBag } from "react-icons/sl";
import { Link } from 'react-router-dom';
import { useCurrency } from '../Context/CurrencyContext';
import { useWishlist } from '../Context/WishlistContext';
import { useCart } from '../Context/CartContext';
import Section7 from '../Sections/Section7';
import QuickAddModal from '../Components/QuickAddModal';
import QuickViewModal from '../Components/QuickViewModal';
import { Eye, ShoppingCart, Maximize2, Heart, RefreshCw } from 'lucide-react';

const LookbookSlider = () => {
    const { toggleWishlist, isInWishlist } = useWishlist();
    const { addToCart } = useCart();
    const { formatPrice } = useCurrency();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    
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

    useEffect(() => {
        const fetchTrendingProducts = async () => {
            try {
                setLoading(true);
                // Category ID 21 is "Fashion 2"
                const response = await axios.get('http://localhost:5000/api/products?category=21');
                setProducts(response.data.slice(0, 4));
                setLoading(false);
            } catch (error) {
                console.error("Error fetching trending products:", error);
                setLoading(false);
            }
        };
        fetchTrendingProducts();
    }, []);

    const heroSlides = [
        {
            image: "https://kalles-5.myshopify.com/cdn/shop/files/lookbook-carousel_1.jpg?v=1718351969&width=1800",
            hotspots: [
                { top: '30%', left: '45%', productId: '1' },
                { top: '60%', left: '70%', productId: '2' }
            ]
        },
        {
            image: "https://kalles-5.myshopify.com/cdn/shop/files/slide-01_1e92356f-ddbd-4d32-b723-6ff72738fc4c.jpg?v=1718336590&width=1800",
            hotspots: [
                { top: '40%', left: '30%', productId: '3' }
            ]
        },
        {
            image: "https://kalles-5.myshopify.com/cdn/shop/files/girl_1950x_b2fe82ef-cceb-4aa2-b258-04e0f38bfbfd_2022-03-07.jpg?v=1718352153&width=1800",
            hotspots: [
                { top: '50%', left: '50%', productId: '4' }
            ]
        }
    ];

    const categories = [
        { name: 'Bags', image: 'https://kalles-5.myshopify.com/cdn/shop/files/dance_nylon_main_7ac80de8-ce83-477a-9890-bffad32624e8.png?v=1717405226&width=1000' },
        { name: 'Caps & Hats', image: 'https://kalles-5.myshopify.com/cdn/shop/files/5-1_952def73-ea55-44e5-950c-4283004f72e3.png?v=1746467358&width=1000' },
        { name: 'Watches', image: 'https://kalles-5.myshopify.com/cdn/shop/files/casio-1_6debb2b3-993b-462a-b020-69ec4d08afe1.jpg?v=1717404997&width=800' },
        { name: 'Footwear', image: 'https://kalles-5.myshopify.com/cdn/shop/files/14709485-2_38a39c0f-45ca-4247-b3f4-0d1be8b7bb8b.jpg?v=1717405096&width=800' }
    ];

    const watchProduct = {
        id: 'watch-featured',
        name: "La Bohème Rose Gold",
        price: 34.95,
        oldPrice: 51.95,
        image1: "https://kalles-5.myshopify.com/cdn/shop/files/p24-11_ec0dcf2b-dcc4-48cf-8b3e-71c6945984db.jpg?v=1717404614&width=720",
        image2: "https://kalles-5.myshopify.com/cdn/shop/files/p24-12_b2546235-782d-4fa9-88e8-c63282bb6178.jpg?v=1717404614&width=720",
        size: "Regular"
    };

    const bottomSliderImages = [
        "https://kalles-5.myshopify.com/cdn/shop/files/gallery-01.jpg?v=1718351866&width=375",
        "https://kalles-5.myshopify.com/cdn/shop/files/gallery-02.jpg?v=1718351866&width=375",
        "https://kalles-5.myshopify.com/cdn/shop/files/gallery-03.jpg?v=1718351866&width=375",
        "https://kalles-5.myshopify.com/cdn/shop/files/gallery-04.jpg?v=1718351866&width=375",
        "https://kalles-5.myshopify.com/cdn/shop/files/gallery-05.jpg?v=1718351866&width=375",
        "https://kalles-5.myshopify.com/cdn/shop/files/gallery-06.jpg?v=1718351866&width=375"
    ];

    return (
        <div className="bg-white font-['Inter',_sans-serif]">
            {/* Hero Slider */}
            <section className="relative group/hero">
                <Swiper
                    modules={[Navigation, Pagination, Autoplay]}
                    navigation={{
                        prevEl: '.hero-prev',
                        nextEl: '.hero-next',
                    }}
                    pagination={{ clickable: true, el: '.hero-pagination' }}
                    autoplay={{ delay: 5000 }}
                    loop={true}
                    className="h-[600px] md:h-[800px]"
                >
                    {heroSlides.map((slide, idx) => (
                        <SwiperSlide key={idx}>
                            <div className="relative h-full w-full">
                                <img src={slide.image} alt={`Slide ${idx}`} className="w-full h-full object-cover" />
                                {slide.hotspots.map((spot, sIdx) => (
                                    <div
                                        key={sIdx}
                                        className="absolute group/spot cursor-pointer"
                                        style={{ top: spot.top, left: spot.left }}
                                    >
                                        <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-[#43d1f0] text-white flex items-center justify-center shadow-lg relative z-20 hover:scale-110 transition-transform">
                                            <Plus size={16} />
                                            {/* Hotspot Pulse Effect */}
                                            <div className="absolute inset-0 rounded-full bg-[#43d1f0] animate-ping opacity-40"></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
                <div className="hero-prev absolute left-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-white/80 flex items-center justify-center cursor-pointer opacity-0 group-hover/hero:opacity-100 transition-opacity shadow-sm">
                    <ChevronLeft size={20} />
                </div>
                <div className="hero-next absolute right-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-white/80 flex items-center justify-center cursor-pointer opacity-0 group-hover/hero:opacity-100 transition-opacity shadow-sm">
                    <ChevronRight size={20} />
                </div>
                <div className="hero-pagination absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex gap-2"></div>
            </section>

            {/* Category Section */}
            <section className="max-w-[1240px] mx-auto py-12 px-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {categories.map((cat, idx) => (
                        <div key={idx} className="relative group cursor-pointer overflow-hidden rounded overflow-hidden">
                            <img src={cat.image} alt={cat.name} className="w-full aspect-[4/5] object-cover group-hover:scale-110 transition-transform duration-700" />
                            <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
                                <button className="px-6 py-2 bg-[#222] text-white text-xs font-bold uppercase tracking-widest hover:bg-[#43d1f0] transition-colors shadow-lg">
                                    {cat.name}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Promotional Section */}
            <section className="max-w-[1240px] mx-auto py-12 px-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
                    {/* Left Column: View Collection Lookbook */}
                    <div className="relative group overflow-hidden h-[450px] md:h-[550px]">
                        <img src="https://kalles-5.myshopify.com/cdn/shop/files/bn-01.jpg?v=1718273782&width=400" alt="Lookbook" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                        <div className="absolute bottom-10 left-6 text-black">
                            <p className="text-[12px] font-bold uppercase tracking-widest mb-1 opacity-80">VIEW COLLECTIONS</p>
                            <h2 className="text-[32px] font-bold uppercase leading-tight mb-2">LOOKBOOK</h2>
                            <p className="text-[14px] italic opacity-70">your world of fashion in numbers</p>
                        </div>
                    </div>

                    {/* Middle Column: Watch Featured with Detailed Hover Effect */}
                    <div className="relative group overflow-hidden rounded-md h-[450px] md:h-[550px] w-full cursor-pointer bg-[#f6f6f6]">
                        {/* Images */}
                        <img
                            src="https://kalles-5.myshopify.com/cdn/shop/files/p24-11_ec0dcf2b-dcc4-48cf-8b3e-71c6945984db.jpg?v=1717404614&width=720"
                            alt="Watch 1"
                            className="w-full h-full object-cover transition-all duration-1000 absolute inset-0 opacity-100 group-hover:scale-110 group-hover:opacity-0"
                        />
                        <img
                            src="https://kalles-5.myshopify.com/cdn/shop/files/p24-12_b2546235-782d-4fa9-88e8-c63282bb6178.jpg?v=1717404614&width=720"
                            alt="Watch 2"
                            className="w-full h-full object-cover transition-all duration-1000 absolute inset-0 opacity-0 group-hover:opacity-100 group-hover:scale-110"
                        />

                        {/* Top Left Icons */}
                        <div className="absolute top-4 left-4 flex flex-col gap-2 z-20 transition-all duration-500 opacity-0 -translate-x-4 group-hover:translate-x-0 group-hover:opacity-100">
                            <button 
                                onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleWishlist(watchProduct); }}
                                className={`w-9 h-9 rounded-full shadow-md flex items-center justify-center transition-all ${isInWishlist(watchProduct.id) ? 'bg-[#43d1f0] text-white' : 'bg-white text-[#222] hover:bg-[#43d1f0] hover:text-white'}`}
                            >
                                <svg width="18" height="18" viewBox="0 0 24 24" fill={isInWishlist(watchProduct.id) ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                            </button>
                            <button 
                                onClick={() => handleQuickView(watchProduct)}
                                className="w-9 h-9 rounded-full bg-white text-[#222] hover:bg-[#43d1f0] hover:text-white shadow-md flex items-center justify-center transition-all"
                            >
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" /></svg>
                            </button>
                        </div>

                        {/* Top Right Badge */}
                        <div className="absolute top-4 right-4 w-12 h-12 rounded-full bg-[#f64e1f] text-white flex items-center justify-center text-[12px] font-bold shadow-lg z-10 transition-transform duration-500 group-hover:scale-110">
                            -33%
                        </div>

                        {/* Center Buttons */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 z-20 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
                            <button 
                                onClick={() => handleQuickView(watchProduct)}
                                className="px-10 py-3 bg-white text-[#222] rounded-full text-[13px] font-bold uppercase tracking-widest hover:bg-[#222] hover:text-white transition-all shadow-xl min-w-[180px]"
                            >
                                Quick view
                            </button>
                            <button 
                                onClick={() => handleQuickAdd(watchProduct)}
                                disabled={watchProduct.stock <= 0}
                                className={`px-10 py-3 rounded-full text-[13px] font-bold uppercase tracking-widest transition-all shadow-xl min-w-[180px] ${watchProduct.stock <= 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#43d1f0] text-white hover:bg-[#222]'}`}
                            >
                                {watchProduct.stock <= 0 ? 'Sold Out' : 'Quick add'}
                            </button>
                        </div>

                        {/* Bottom Info Overlay */}
                        <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10 transition-opacity duration-500 opacity-0 group-hover:opacity-100">
                            <h3 className="text-white text-[18px] font-bold mb-1">La Bohème Rose Gold</h3>
                            <div className="flex items-center gap-2 text-[15px]">
                                <span className="text-white/70 line-through">{formatPrice(51.95)}</span>
                                <span className="text-[#f64e1f] font-bold">{formatPrice(34.95)}</span>
                            </div>
                            <div className="flex gap-2.5 mt-4">
                                <div className="w-6 h-6 rounded-full bg-[#eec2c2] border-2 border-white ring-1 ring-black/10 cursor-pointer hover:scale-125 transition-transform" title="Pink"></div>
                                <div className="w-6 h-6 rounded-full bg-black border-2 border-white ring-1 ring-black/10 cursor-pointer hover:scale-125 transition-transform" title="Black"></div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Men's Collection Sale */}
                    <div className="relative group overflow-hidden h-[450px] md:h-[550px]">
                        <img src="https://kalles-5.myshopify.com/cdn/shop/files/pr-big-26.jpg?v=1718006610&width=400" alt="Men's Collection" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/20">
                            <div className="text-center">
                                <p className="text-[14px] font-bold uppercase tracking-widest mb-1">MEN'S COLLECTION</p>
                                <h2 className="text-[54px] font-bold uppercase leading-none mb-1">SALE</h2>
                                <h2 className="text-[54px] font-bold uppercase leading-none mb-6">70%</h2>
                                <button className="px-10 py-3 border border-black rounded-full text-[13px] font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-all bg-white/10 backdrop-blur-sm">
                                    Shop now
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Trending Section */}
            <section className="max-w-[1240px] mx-auto py-12 px-4 text-center">
                <div className="flex items-center justify-center gap-6 mb-2">
                    <div className="h-[1px] w-12 md:w-24 bg-black"></div>
                    <h2 className="text-2xl md:text-3xl font-bold uppercase tracking-[2px]">TRENDING</h2>
                    <div className="h-[1px] w-12 md:w-24 bg-black"></div>
                </div>
                <p className="text-[14px] italic text-[#878787] mb-10">Top view in this week</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {loading ? (
                        [1, 2, 3, 4].map((i) => (
                            <div key={i} className="animate-pulse">
                                <div className="bg-gray-200 aspect-[3/4] rounded mb-4"></div>
                                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                            </div>
                        ))
                    ) : (
                        products.map((product) => (
                            <div key={product.id} className="group cursor-pointer">
                                {/* Image Container */}
                                <div className="relative aspect-[3/4] mb-4 bg-[#f6f6f6] rounded overflow-hidden">
                                    {/* Images with Transition */}
                                    <img
                                        src={product.image1 || 'https://via.placeholder.com/400x533?text=No+Image'}
                                        alt={product.name}
                                        className="w-full h-full object-cover transition-all duration-1000 absolute inset-0 opacity-100 group-hover:scale-110 group-hover:opacity-0"
                                    />
                                    <img
                                        src={product.image2 || product.image1 || 'https://via.placeholder.com/400x533?text=No+Image'}
                                        alt={product.name}
                                        className="w-full h-full object-cover transition-all duration-1000 absolute inset-0 opacity-0 group-hover:opacity-100 group-hover:scale-110"
                                    />

                                    {/* Top Left Icons */}
                                    <div className="absolute top-4 left-4 flex flex-col gap-2 z-20 transition-all duration-500 opacity-0 -translate-x-4 group-hover:translate-x-0 group-hover:opacity-100">
                                        <button 
                                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleWishlist(product); }}
                                            className={`transition-colors ${isInWishlist(product.id) ? 'text-[#43d1f0]' : 'text-[#222] hover:text-[#43d1f0]'}`}
                                        >
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill={isInWishlist(product.id) ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                                        </button>
                                        <button className="text-[#222] hover:text-[#43d1f0] transition-colors">
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" /></svg>
                                        </button>
                                    </div>

                                    {/* Top Right Badges */}
                                    <div className="absolute top-4 right-4 z-10 transition-transform duration-500 group-hover:scale-110">
                                        {product.stock <= 0 ? (
                                            <div className="px-4 py-1.5 bg-gray-600 text-white flex items-center justify-center text-[10px] font-bold shadow-lg uppercase rounded-full">
                                                Sold Out
                                            </div>
                                        ) : product.discount_percent > 30 ? (
                                            <div className="w-12 h-12 rounded-full bg-[#ec1212] text-white flex items-center justify-center text-[11px] font-bold shadow-lg uppercase">
                                                Hot
                                            </div>
                                        ) : product.is_new === 1 ? (
                                            <div className="w-12 h-12 rounded-full bg-[#48c412] text-white flex items-center justify-center text-[11px] font-bold shadow-lg uppercase">
                                                New
                                            </div>
                                        ) : product.discount_percent > 0 ? (
                                            <div className="w-12 h-12 rounded-full bg-[#f64e1f] text-white flex items-center justify-center text-[10px] font-bold shadow-lg">
                                                -{product.discount_percent}%
                                            </div>
                                        ) : null}
                                    </div>

                                    {/* Center Quick View Button */}
                                    <div className="absolute inset-0 flex items-center justify-center z-20 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
                                        <button 
                                            onClick={() => handleQuickView(product)}
                                            className="px-8 py-3 bg-white text-[#222] rounded-full text-[13px] font-bold uppercase tracking-widest hover:bg-[#222] hover:text-white transition-all shadow-xl"
                                        >
                                            Quick view
                                        </button>
                                    </div>

                                    {/* Bottom Add to Cart Section (Quantity + Add) */}
                                    <div className="absolute bottom-6 inset-x-4 z-20 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
                                        <div className="flex bg-white rounded-full overflow-hidden shadow-xl border border-gray-100">
                                            <div className="flex items-center px-4 border-r border-gray-100 gap-4">
                                                <button className="text-[#222] hover:text-[#43d1f0] transition-colors">-</button>
                                                <span className="text-[13px] font-bold min-w-[15px] text-center">1</span>
                                                <button className="text-[#222] hover:text-[#43d1f0] transition-colors">+</button>
                                            </div>
                                            <button 
                                                onClick={() => {
                                                    if (product.stock <= 0) return;
                                                    addToCart(product, 1, product.size ? String(product.size).split(',')[0].trim() : '');
                                                }}
                                                disabled={product.stock <= 0}
                                                className={`flex-1 py-3 px-4 text-[12px] font-bold uppercase tracking-widest transition-colors ${product.stock <= 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#43d1f0] hover:bg-[#222]'} text-white`}
                                            >
                                                {product.stock <= 0 ? 'Sold Out' : 'Add to cart'}
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Product Info Below Image */}
                                <div className="text-left flex flex-col">
                                    <h3 className="text-[14px] font-bold text-[#222] hover:text-[#43d1f0] transition-colors mb-1 truncate">
                                        {product.name}
                                    </h3>
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="text-[14px] text-[#222]">{formatPrice(product.price)}</span>
                                        {product.discount_percent > 0 && (
                                            <span className="text-[14px] text-[#878787] line-through">
                                                {formatPrice(product.price / (1 - product.discount_percent / 100))}
                                            </span>
                                        )}
                                    </div>
                                    {/* Swatches Grid */}
                                    <div className="flex gap-2">
                                        <div className="w-5 h-5 rounded-full bg-gray-200 border-2 border-white ring-1 ring-black/5 cursor-pointer hover:ring-[#222] transition-all"></div>
                                        <div className="w-5 h-5 rounded-full bg-gray-300 border-2 border-white ring-1 ring-black/5 cursor-pointer hover:ring-[#222] transition-all"></div>
                                        <div className="w-5 h-5 rounded-full bg-gray-400 border-2 border-white ring-1 ring-black/5 cursor-pointer hover:ring-[#222] transition-all"></div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </section>

            {/* Gallery Slider */}
                    <div className='w-[80%] mx-auto overflow-hidden'>
                        <Section7/>
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

export default LookbookSlider;
