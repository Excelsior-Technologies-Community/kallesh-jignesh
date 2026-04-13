import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import axios from 'axios';

import { Plus, ArrowRight, Truck, Clock, RefreshCw, Lock, Heart, Maximize2, ChevronLeft, ChevronRight, ShoppingBag, Loader2 } from 'lucide-react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { SlBag } from "react-icons/sl";
import { Link } from 'react-router-dom';
import { useCurrency } from '../Context/CurrencyContext';
import { useWishlist } from '../Context/WishlistContext';
import Section7 from '../Sections/Section7';
import QuickAddModal from '../Components/QuickAddModal';
import QuickViewModal from '../Components/QuickViewModal';

const productsData = {
    1: { id: 1, name: "Analogue Resin Strap", price: 113.00, image1: "https://kalles-5.myshopify.com/cdn/shop/files/famer2052212158_q1_2-1.jpg?v=1717405215&width=940", image2: "https://kalles-5.myshopify.com/cdn/shop/files/famer2052212158_q5_2-0.jpg?v=1717405215&width=940", sizes: ["XS", "S", "M", "L", "XL"] },
    2: { id: 2, name: "Wide Fit Dusty", price: 45.00, image1: "https://kalles-5.myshopify.com/cdn/shop/files/p26-3_5d35798e-8bab-47db-97c2-aba6d65148a7.jpg?v=1717404640&width=720", image2: "https://kalles-5.myshopify.com/cdn/shop/files/p26-2_f44997c0-71d0-4a57-801b-9337e3672212.jpg?v=1717404640&width=720", sizes: ["S", "M", "L"] },
    3: { id: 3, name: "Barre Gripper Socks", price: 8.00, oldPrice: 19.00, badge: "-58%", badgeColor: "bg-[#ff4e00]", image1: "https://kalles-5.myshopify.com/cdn/shop/files/171.jpg?v=1717400214&width=720", image2: "https://kalles-5.myshopify.com/cdn/shop/files/175.jpg?v=1717400214&width=720", sizes: ["S", "M", "L"] },
    4: { id: 4, name: "Long Oversize Sweatshirt", price: 356.00, image1: "https://kalles-5.myshopify.com/cdn/shop/files/ezgif.com-webp-to-jpg_28.jpg?v=1717403696&width=720", image2: "https://kalles-5.myshopify.com/cdn/shop/files/ezgif.com-webp-to-jpg_29.jpg?v=1717403696&width=720", sizes: ["S", "M", "L"] },
    5: { id: 5, name: "White Workout Set", price: 259.00, image1: "https://kalles-5.myshopify.com/cdn/shop/files/14609539-1-grey.jpg?v=1717405062&width=720", image2: "https://kalles-5.myshopify.com/cdn/shop/files/14609539-2.jpg?v=1717405062&width=720", sizes: ["S", "M", "L"] },
    6: { id: 6, name: "Sport Yoga Pant", price: 75.00, image1: "https://kalles-5.myshopify.com/cdn/shop/files/2.png?v=1717403014&width=720", image2: "https://kalles-5.myshopify.com/cdn/shop/files/0.1.png?v=1717403014&width=720", sizes: ["S", "M", "L"] },
    7: { id: 7, name: "Have a Nice Day Hoodie", price: 120.00, image1: "https://kalles-5.myshopify.com/cdn/shop/files/14281795-1-haveaniceday.jpg?v=1717405054&width=720", image2: "https://kalles-5.myshopify.com/cdn/shop/files/14281795-2.jpg?v=1717405054&width=720", sizes: ["S", "M", "L"] },
    8: { id: 8, name: "Navy White Sweater", price: 95.00, image1: "https://kalles-5.myshopify.com/cdn/shop/files/13893318-1-navywhite.jpg?v=1717405040&width=720", image2: "https://kalles-5.myshopify.com/cdn/shop/files/13893318-2.jpg?v=1717405040&width=720", sizes: ["S", "M", "L"] },
    9: { id: 9, name: "Classic High Top", price: 65.00, image1: "https://kalles-5.myshopify.com/cdn/shop/files/10_829ed7e8-cc40-4be2-b01d-378aa98da99b.jpg?v=1717404130&width=720", image2: "https://kalles-5.myshopify.com/cdn/shop/files/10.1.jpg?v=1717404130&width=720", sizes: ["S", "M", "L"] }
};

const ProductPopupCard = ({ product, onClose }) => {
    const { formatPrice } = useCurrency();
    const { toggleWishlist, isInWishlist } = useWishlist();
    const isFavorite = isInWishlist(product?.id);
    if (!product) return null;
    return (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 mt-4 z-50 w-[240px] bg-white shadow-2xl rounded-sm group/card overflow-hidden animate-in fade-in zoom-in duration-300">
            <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white rotate-45"></div>
            <div className="relative p-2">
                <div className="relative aspect-[3/4] overflow-hidden mb-3">
                    <img src={product.image1} alt={product.name} className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500 group-hover/card:opacity-0" />
                    <img src={product.image2} alt={product.name} className="absolute inset-0 w-full h-full object-cover transition-all duration-500 scale-100 group-hover/card:scale-105 opacity-0 group-hover/card:opacity-100" />
                    {product.badge && <div className={`absolute top-2 right-2 ${product.badgeColor} text-white text-[9px] font-bold w-9 h-9 rounded-full flex items-center justify-center uppercase leading-none z-10`}>{product.badge}</div>}
                    <div className="absolute top-3 left-3 flex flex-col gap-2 transition-all duration-300 opacity-0 -translate-x-4 group-hover/card:opacity-100 group-hover/card:translate-x-0">
                        <button 
                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleWishlist(product); }}
                            className={`p-2 rounded-full transition-colors shadow-sm ${isFavorite ? 'bg-[#43D1F0] text-white' : 'bg-white hover:bg-[#43D1F0] hover:text-white'}`}
                        >
                            <Heart size={14} fill={isFavorite ? "currentColor" : "none"} />
                        </button>
                        <button className="bg-white p-2 rounded-full hover:bg-[#43D1F0] hover:text-white transition-colors shadow-sm"><Maximize2 size={14} /></button>
                    </div>
                </div>
                <div className="px-1 pb-1 text-center">
                    <h3 className="text-[13px] font-medium text-[#222] mb-1 group-hover/card:text-[#43D1F0] transition-colors truncate">{product.name}</h3>
                    <div className="flex justify-center items-center gap-2">
                        {product.oldPrice && <span className="text-[13px] text-gray-400 line-through">{formatPrice(product.oldPrice)}</span>}
                        <div className={`text-[13px] font-semibold ${product.oldPrice ? 'text-[#ff4e00]' : 'text-gray-600'}`}>{formatPrice(product.price)}</div>
                    </div>
                </div>
                <button onClick={(e) => { e.stopPropagation(); onClose(); }} className="absolute top-1 right-1 w-6 h-6 flex items-center justify-center text-gray-400 hover:text-black md:hidden">×</button>
            </div>
        </div>
    );
};

const LookbookInstagram = () => {
    const { formatPrice } = useCurrency();
    const [blogs, setBlogs] = useState([]);
    const [loadingBlogs, setLoadingBlogs] = useState(true);
    const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
    const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
    
    // Static watch product for this specific featured section
    const watchProduct = {
        id: 'watch-featured',
        name: "La Bohème Rose Gold",
        price: 34.95,
        oldPrice: 51.95,
        image1: "https://kalles-5.myshopify.com/cdn/shop/files/p24-11_ec0dcf2b-dcc4-48cf-8b3e-71c6945984db.jpg?v=1717404614&width=720",
        image2: "https://kalles-5.myshopify.com/cdn/shop/files/p24-12_b2546235-782d-4fa9-88e8-c63282bb6178.jpg?v=1717404614&width=720",
        size: "Regular"
    };

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/blogs');
                setBlogs(response.data);
                setLoadingBlogs(false);
            } catch (error) {
                console.error("Error fetching blogs:", error);
                setLoadingBlogs(false);
            }
        };
        fetchBlogs();
    }, []);

    const categories = [
        { name: 'Footwear', image: 'https://kalles-5.myshopify.com/cdn/shop/files/cat-bn-01.jpg?v=1718260453&width=400' },
        { name: 'Watches', image: 'https://kalles-5.myshopify.com/cdn/shop/files/cat-bn-03.jpg?v=1747122731&width=1000' },
        { name: 'Bags', image: 'https://kalles-5.myshopify.com/cdn/shop/files/cat-bn-02.jpg?v=1718260453&width=400' },
        { name: 'Caps', image: 'https://kalles-5.myshopify.com/cdn/shop/files/cat-bn-04.jpg?v=1718260453&width=400' }
    ];


    const [activeTag, setActiveTag] = useState(null);

    const instagramImages = [
        "https://kalles-5.myshopify.com/cdn/shop/files/ins8_2022-03-02.jpg?v=1717463752&width=300",
        "https://kalles-5.myshopify.com/cdn/shop/files/ins7_2022-03-02.jpg?v=1717463752&width=300",
        "https://kalles-5.myshopify.com/cdn/shop/files/ins6_2022-03-02.jpg?v=1717463752&width=300",
        "https://kalles-5.myshopify.com/cdn/shop/files/ins5_2022-03-02.jpg?v=1717463753&width=300",
        "https://kalles-5.myshopify.com/cdn/shop/files/ins4_2022-03-02.jpg?v=1717463752&width=300",
        "https://kalles-5.myshopify.com/cdn/shop/files/ins3_2022-03-02.jpg?v=1717463752&width=300",
        "https://kalles-5.myshopify.com/cdn/shop/files/ins1_2022-03-02.jpg?v=1717463752&width=300",
        "https://kalles-5.myshopify.com/cdn/shop/files/ins2_2022-03-02.jpg?v=1717463752&width=300",
    ];

    const handleTagClick = (e, slideIndex, tagId) => {
        e.stopPropagation();
        if (activeTag?.slideIndex === slideIndex && activeTag?.tagId === tagId) {
            setActiveTag(null);
        } else {
            setActiveTag({ slideIndex, tagId });
        }
    };

    const getProductForTag = (slideIndex, tagId) => {
        if (slideIndex === 0) return productsData[1];
        if (slideIndex === 1) return productsData[2];
        if (slideIndex === 2) return tagId === 1 ? productsData[3] : productsData[4];
        if (slideIndex === 3) return productsData[5];
        if (slideIndex === 4) return productsData[6];
        if (slideIndex === 5) return productsData[7];
        if (slideIndex === 6) return productsData[8];
        if (slideIndex === 7) return productsData[9];
        return null;
    };




    return (
        <>
            <div className="font-['Inter',_sans-serif] bg-white text-[#222] " onClick={() => setActiveTag(null)}>
                {/* Hero Section */}
                <section className="relative h-[600px] flex items-center justify-center text-center overflow-hidden group">
                    <img
                        src="https://kalles-5.myshopify.com/cdn/shop/files/bg-loobook.jpg?v=1718351866&width=1200"
                        alt="Hero"
                        className="absolute inset-0 w-full h-full object-cover scale-105 group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="relative z-10 px-4">
                        <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg tracking-wider">
                            CLEARANCE SALE OFF TO 70%
                        </h1>
                        <p className="text-white text-lg md:text-xl mb-8 opacity-90 italic">Shop our Collection 2024</p>
                        <button className="bg-transparent text-white border-2 border-white px-10 py-3.5 rounded-full font-bold hover:bg-[#43d1f0] hover:border-[#43d1f0] hover:text-white transition-all duration-300 transform hover:scale-105 shadow-xl">
                            Shop Now
                        </button>
                    </div>
                    <div className="absolute inset-0 bg-black/10"></div>
                </section>

                {/* Category Grid */}
                <section className="max-w-[1400px] mx-auto pt-20 px-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {categories.map((cat, idx) => (
                            <Link to="/grid-layout" key={idx} className="group cursor-pointer relative overflow-hidden bg-gray-100 shadow-sm transition-all duration-500 block">
                                <div className="aspect-[4/5] overflow-hidden">
                                    <img src={cat.image} alt={cat.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                </div>
                                <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
                                    <span className="bg-white px-8 py-2.5 rounded-sm font-semibold shadow-md transition-colors duration-300 hover:bg-black hover:text-white">
                                        {cat.name}
                                    </span>
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>

                {/* Promotional Section */}
                <section className="max-w-[1240px] mx-auto py-8 px-4">
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
                                <button className="w-9 h-9 rounded-full bg-white text-[#222] hover:bg-[#43d1f0] hover:text-white shadow-md flex items-center justify-center transition-all">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                                </button>
                                <button className="w-9 h-9 rounded-full bg-white text-[#222] hover:bg-[#43d1f0] hover:text-white shadow-md flex items-center justify-center transition-all">
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
                                    onClick={() => setIsQuickViewOpen(true)}
                                    className="px-10 py-3 bg-white text-[#222] rounded-full text-[13px] font-bold uppercase tracking-widest hover:bg-[#222] hover:text-white transition-all shadow-xl min-w-[180px]"
                                >
                                    Quick view
                                </button>
                                <button 
                                    onClick={() => setIsQuickAddOpen(true)}
                                    className="px-10 py-3 bg-[#43d1f0] text-white rounded-full text-[13px] font-bold uppercase tracking-widest hover:bg-[#222] transition-all shadow-xl min-w-[180px]"
                                >
                                    Quick add
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
            </div>
            {/* Instagram Shop Section */}
            <section className="pt-20 w-full bg-white">
                <div className="text-center mb-12">
                    <div className="flex items-center justify-center gap-4 mb-2">
                        <div className="h-[1px] w-12 bg-gray-300"></div>
                        <h2 className="text-2xl font-bold uppercase tracking-[4px]">Instagram Shop</h2>
                        <div className="h-[1px] w-12 bg-gray-300"></div>
                    </div>
                    <p className="text-[#888] italic">Shop your Instagram style</p>
                </div>
                <div className="max-w-[1400px] mx-auto grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {instagramImages.map((src, index) => (
                        <div key={index} className={`group relative aspect-square cursor-pointer overflow-visible ${activeTag?.slideIndex === index ? 'z-50' : 'z-10'}`}>
                            <div className="w-full h-full overflow-hidden rounded-md">
                                <img
                                    src={src}
                                    alt={`Instagram ${index + 1}`}
                                    className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
                                />

                            </div>

                            {/* Hotspot Tag 1 */}
                            <div
                                className="absolute top-[40%] left-[60%] -translate-x-1/2 -translate-y-1/2 z-20"
                                onClick={(e) => handleTagClick(e, index, 1)}
                            >
                                <div className={`w-6 h-6 ${activeTag?.slideIndex === index && activeTag?.tagId === 1 ? 'bg-[#43D1F0]' : 'bg-[#222]/80'} text-white rounded-full flex items-center justify-center text-[11px] font-bold border border-white/30 shadow-lg transition-all hover:scale-110 animate-pulse`}>
                                    1
                                </div>
                                {activeTag?.slideIndex === index && activeTag?.tagId === 1 && (
                                    <div className="absolute top-full left-1/2 -translate-x-1/2 z-50">
                                        <ProductPopupCard product={getProductForTag(index, 1)} onClose={() => setActiveTag(null)} />
                                    </div>
                                )}
                            </div>

                            {/* Hotspot Tag 2 (only for 3rd image) */}
                            {index === 2 && (
                                <div
                                    className="absolute top-[70%] left-[40%] -translate-x-1/2 -translate-y-1/2 z-20"
                                    onClick={(e) => handleTagClick(e, index, 2)}
                                >
                                    <div className={`w-6 h-6 ${activeTag?.slideIndex === index && activeTag?.tagId === 2 ? 'bg-[#43D1F0]' : 'bg-[#222]/80'} text-white rounded-full flex items-center justify-center text-[11px] font-bold border border-white/30 shadow-lg transition-all hover:scale-110 animate-pulse`}>
                                        2
                                    </div>
                                    {activeTag?.slideIndex === index && activeTag?.tagId === 2 && (
                                        <div className="absolute top-full left-1/2 -translate-x-1/2 z-50">
                                            <ProductPopupCard product={getProductForTag(index, 2)} onClose={() => setActiveTag(null)} />
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>

            </section>

            <div className='px-20 bg-white'>
                {/* Blog Section */}
                <section className="pt-20 px-4 relative group/blog">
                    <div className="text-center mb-16">
                        <div className="flex items-center justify-center gap-4 mb-2">
                            <div className="h-[1px] w-12 bg-gray-300"></div>
                            <h2 className="text-2xl font-bold uppercase tracking-[4px]">Latest From Blog</h2>
                            <div className="h-[1px] w-12 bg-gray-300"></div>
                        </div>
                        <p className="text-[#888] italic">The freshest and most exciting news</p>
                    </div>

                    {loadingBlogs ? (
                        <div className="flex flex-col items-center justify-center py-20">
                            <Loader2 className="w-10 h-10 animate-spin text-[#43d1f0] mb-4" />
                            <p className="text-gray-500 font-medium tracking-widest text-[12px]">LOADING BLOGS...</p>
                        </div>
                    ) : (
                        <div className="max-w-[1400px] mx-auto relative px-10">
                            <Swiper
                                modules={[Navigation, Autoplay]}
                                spaceBetween={30}
                                slidesPerView={1}
                                loop={blogs.length > 3}
                                autoplay={{
                                    delay: 4000,
                                    disableOnInteraction: false,
                                }}
                                navigation={{
                                    prevEl: '.blog-swiper-prev',
                                    nextEl: '.blog-swiper-next',
                                }}
                                breakpoints={{
                                    640: { slidesPerView: 2 },
                                    1024: { slidesPerView: 3 },
                                }}
                                className="pb-12"
                            >
                                {blogs.map((blog) => (
                                    <SwiperSlide key={blog.id}>
                                        <div className="group bg-white overflow-hidden shadow-sm  transition-all duration-500 h-full flex flex-col">
                                            <Link to={`/blog/${blog.id}`} className="block overflow-hidden aspect-[16/10]">
                                                <img src={blog.image} alt={blog.title} className="w-full h-full object-cover transition-transform duration-500" />
                                            </Link>
                                            <div className="p-8 flex-1 flex flex-col">
                                                <div className="flex items-center gap-3 text-[11px] font-bold uppercase tracking-wider text-[#888] mb-4">
                                                    <span className="text-black">{blog.category}</span>
                                                    <span>/</span>
                                                    <span>{blog.date}</span>
                                                </div>
                                                <Link to={`/blog/${blog.id}`}>
                                                    <h3 className="text-xl font-bold mb-4 group-hover:text-[#43d1f0] transition-colors line-clamp-2">{blog.title}</h3>
                                                </Link>
                                                <p className="text-[#666] text-[15px] leading-relaxed mb-6 line-clamp-3 italic flex-1">
                                                    {blog.desc || "Typography is the work of typesetters, composers, typographers, graphic designers, art directors, manga artists..."}
                                                </p>
                                                <Link to={`/blog/${blog.id}`} className="text-sm font-bold border-b-2 border-black pb-1 hover:text-[#43d1f0] hover:border-[#43d1f0] transition-colors inline-block w-fit">
                                                    Read More
                                                </Link>
                                            </div>
                                        </div>
                                    </SwiperSlide>
                                ))}
                            </Swiper>

                            {/* Navigation Buttons */}
                            <button className="blog-swiper-prev absolute left-0 top-1/2 -translate-y-1/2 z-20 w-11 h-11 bg-white rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover/blog:opacity-100 transition-opacity duration-300 hover:bg-[#43d1f0] hover:text-white">
                                <ChevronLeft size={24} />
                            </button>
                            <button className="blog-swiper-next absolute right-0 top-1/2 -translate-y-1/2 z-20 w-11 h-11 bg-white rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover/blog:opacity-100 transition-opacity duration-300 hover:bg-[#43d1f0] hover:text-white">
                                <ChevronRight size={24} />
                            </button>
                        </div>
                    )}
                </section>
            </div>

            {/* Follow Instagram Section */}

            <div className='bg-white'>
                <Section7 />
            </div>
            
            {/* Modals for Featured Product */}
            <QuickViewModal
                isOpen={isQuickViewOpen}
                onClose={() => setIsQuickViewOpen(false)}
                product={watchProduct}
            />
            <QuickAddModal
                isOpen={isQuickAddOpen}
                onClose={() => setIsQuickAddOpen(false)}
                product={watchProduct}
            />
        </>
    );
};

export default LookbookInstagram;
