import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import { useCurrency } from '../Context/CurrencyContext';
import { useWishlist } from '../Context/WishlistContext';
import QuickAddModal from '../Components/QuickAddModal';
import QuickViewModal from '../Components/QuickViewModal';
import {
    Heart,
    Maximize2,
    RefreshCw,
    ChevronLeft,
    ChevronRight,
    Truck,
    LifeBuoy,
    RotateCcw,
    Lock,
    ShoppingBag
} from 'lucide-react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';

const productsData = {
    1: {
        id: 1,
        name: "Analogue Resin Strap",
        price: 113.00,
        image1: "https://kalles-5.myshopify.com/cdn/shop/files/famer2052212158_q1_2-1.jpg?v=1717405215&width=940",
        image2: "https://kalles-5.myshopify.com/cdn/shop/files/famer2052212158_q5_2-0.jpg?v=1717405215&width=940",
        sizes: ["XS", "S", "M", "L", "XL"]
    },
    2: {
        id: 2,
        name: "Wide Fit Dusty",
        price: 45.00,
        image1: "https://kalles-5.myshopify.com/cdn/shop/files/p26-3_5d35798e-8bab-47db-97c2-aba6d65148a7.jpg?v=1717404640&width=720",
        image2: "https://kalles-5.myshopify.com/cdn/shop/files/p26-2_f44997c0-71d0-4a57-801b-9337e3672212.jpg?v=1717404640&width=720",
        sizes: ["S", "M", "L"]
    },
    3: {
        id: 3,
        name: "Barre Gripper Socks",
        price: 8.00,
        oldPrice: 19.00,
        badge: "-58%",
        badgeColor: "bg-[#ff4e00]",
        image1: "https://kalles-5.myshopify.com/cdn/shop/files/171.jpg?v=1717400214&width=720",
        image2: "https://kalles-5.myshopify.com/cdn/shop/files/175.jpg?v=1717400214&width=720",
        sizes: ["S", "M", "L"]
    },
    4: {
        id: 4,
        name: "Long Oversize Sweatshirt",
        price: 356.00,
        image1: "https://kalles-5.myshopify.com/cdn/shop/files/ezgif.com-webp-to-jpg_28.jpg?v=1717403696&width=720",
        image2: "https://kalles-5.myshopify.com/cdn/shop/files/ezgif.com-webp-to-jpg_29.jpg?v=1717403696&width=720",
        sizes: ["S", "M", "L"]
    },
    5: {
        id: 5,
        name: "White Workout Set",
        price: 259.00,
        image1: "https://kalles-5.myshopify.com/cdn/shop/files/14609539-1-grey.jpg?v=1717405062&width=720",
        image2: "https://kalles-5.myshopify.com/cdn/shop/files/14609539-2.jpg?v=1717405062&width=720",
        sizes: ["S", "M", "L"]
    },
    6: {
        id: 6,
        name: "Sport Yoga Pant",
        price: 75.00,
        image1: "https://kalles-5.myshopify.com/cdn/shop/files/2.png?v=1717403014&width=720",
        image2: "https://kalles-5.myshopify.com/cdn/shop/files/0.1.png?v=1717403014&width=720",
        sizes: ["S", "M", "L"]
    },
    7: {
        id: 7,
        name: "Have a Nice Day Hoodie",
        price: 120.00,
        image1: "https://kalles-5.myshopify.com/cdn/shop/files/14281795-1-haveaniceday.jpg?v=1717405054&width=720",
        image2: "https://kalles-5.myshopify.com/cdn/shop/files/14281795-2.jpg?v=1717405054&width=720",
        sizes: ["S", "M", "L"]
    },
    8: {
        id: 8,
        name: "Navy White Sweater",
        price: 95.00,
        image1: "https://kalles-5.myshopify.com/cdn/shop/files/13893318-1-navywhite.jpg?v=1717405040&width=720",
        image2: "https://kalles-5.myshopify.com/cdn/shop/files/13893318-2.jpg?v=1717405040&width=720",
        sizes: ["S", "M", "L"]
    },
    9: {
        id: 9,
        name: "Classic High Top",
        price: 65.00,
        image1: "https://kalles-5.myshopify.com/cdn/shop/files/10_829ed7e8-cc40-4be2-b01d-378aa98da99b.jpg?v=1717404130&width=720",
        image2: "https://kalles-5.myshopify.com/cdn/shop/files/10.1.jpg?v=1717404130&width=720",
        sizes: ["S", "M", "L"]
    }
};

const ProductPopupCard = ({ product, onClose }) => {
    const { formatPrice } = useCurrency();
    const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
    const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
    if (!product) return null;

    return (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 mt-4 z-50 w-[280px] bg-white shadow-2xl rounded-sm group overflow-hidden animate-in fade-in zoom-in duration-300">
            {/* Top triangle pointer */}
            <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white rotate-45"></div>

            <div className="relative p-2">
                {/* Images */}
                <div className="relative aspect-[3/4] overflow-hidden mb-3">
                    <img
                        src={product.image1}
                        alt={product.name}
                        className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500 group-hover:opacity-0"
                    />
                    <img
                        src={product.image2}
                        alt={product.name}
                        className="absolute inset-0 w-full h-full object-cover transition-all duration-500 scale-100 group-hover:scale-105 opacity-0 group-hover:opacity-100"
                    />

                    {/* Badges */}
                    {product.badge && (
                        <div className={`absolute top-2 right-2 ${product.badgeColor} text-white text-[9px] font-bold w-9 h-9 rounded-full flex items-center justify-center uppercase leading-none z-10`}>
                            {product.badge}
                        </div>
                    )}

                    {/* Left Side Icons */}
                    <div className="absolute top-3 left-3 flex flex-col gap-2 transition-all duration-300 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0">
                        <button className="bg-white p-2 rounded-full hover:bg-[#43D1F0] hover:text-white transition-colors shadow-sm">
                            <Heart size={14} strokeWidth={1.5} />
                        </button>
                        <button className="bg-white p-2 rounded-full hover:bg-[#43D1F0] hover:text-white transition-colors shadow-sm">
                            <Maximize2 size={14} strokeWidth={1.5} />
                        </button>
                    </div>

                    {/* Center Buttons */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 transition-all duration-300 opacity-0 group-hover:opacity-100 uppercase">
                        <button
                            onClick={() => setIsQuickViewOpen(true)}
                            className="bg-white text-black px-4 py-2 rounded-full text-[14px] font-bold hover:bg-[#222] hover:text-white transition-all duration-300"
                        >
                            Quick view
                        </button>
                        <button
                            onClick={() => setIsQuickAddOpen(true)}
                            disabled={product.stock <= 0}
                            className={`px-4 py-2 rounded-full text-[14px] font-bold transition-all duration-300 ${product.stock <= 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#43D1F0] text-white hover:bg-[#222]'}`}
                        >
                            {product.stock <= 0 ? 'Sold Out' : 'Quick add'}
                        </button>
                    </div>

                    {/* Bottom Left Sizes */}
                    {product.sizes && (
                        <div className="absolute bottom-3 left-3 text-white text-[10px] font-bold transition-all duration-300 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 text-shadow-sm">
                            {product.sizes.join(', ')}
                        </div>
                    )}
                </div>

                {/* Product Info */}
                <div className="px-1 pb-1 text-center">
                    <h3 className="text-[13px] font-medium text-[#222] mb-1 group-hover:text-[#43D1F0] transition-colors truncate">
                        {product.name}
                    </h3>
                    <div className="flex justify-center items-center gap-2">
                        {product.oldPrice && (
                            <span className="text-[13px] text-gray-400 line-through">{formatPrice(product.oldPrice)}</span>
                        )}
                        <span className={`text-[15px] font-bold ${product.oldPrice ? 'text-red-500' : 'text-[#222]'}`}>
                            {formatPrice(product.price)}
                        </span>
                    </div>
                </div>

                {/* Close Button Mobile */}
                <button
                    onClick={(e) => { e.stopPropagation(); onClose(); }}
                    className="absolute top-1 right-1 w-6 h-6 flex items-center justify-center text-gray-400 hover:text-black md:hidden"
                >
                    ×
                </button>
            </div>
            {/* Modals */}
            <QuickViewModal
                key={`qv-${product.id}-${isQuickViewOpen}`}
                product={product}
                isOpen={isQuickViewOpen}
                onClose={() => setIsQuickViewOpen(false)}
            />
            <QuickAddModal
                key={`qa-${product.id}-${isQuickAddOpen}`}
                product={product}
                isOpen={isQuickAddOpen}
                onClose={() => setIsQuickAddOpen(false)}
            />
        </div>
    );
};

const Section7 = () => {
    const { formatPrice } = useCurrency();
    const { toggleWishlist, isInWishlist } = useWishlist();
    const [activeTag, setActiveTag] = useState(null); // { slideIndex: number, tagId: number }

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

    const features = [
        {
            icon: <Truck size={36} strokeWidth={1} className="text-[#878787]" />,
            title: "FREE SHIPPING",
            desc: "Free shipping on all US orders or orders above $100"
        },
        {
            icon: <LifeBuoy size={36} strokeWidth={1} className="text-[#878787]" />,
            title: "SUPPORT 24/7",
            desc: "Contact us 24 hours a day, 7 days a week"
        },
        {
            icon: <RotateCcw size={36} strokeWidth={1} className="text-[#878787]" />,
            title: "30 DAYS RETURN",
            desc: "Simply return it within 30 days for an exchange"
        },
        {
            icon: <Lock size={36} strokeWidth={1} className="text-[#878787]" />,
            title: "100% PAYMENT SECURE",
            desc: "We ensure secure payment with PEV"
        }
    ];

    return (
        <section className="pt-5 relative" onClick={() => setActiveTag(null)}>
            {/* Header */}
            <div className="flex flex-col items-center mb-10 px-4">
                <div className="flex items-center gap-6 mb-2">
                    <div className="w-16 md:w-16 h-[2px] bg-black "></div>
                    <h2 className="text-[16px] text-center md:text-[24px] font-bold tracking-[.2em] text-[#222]">@ FOLLOW US ON INSTAGRAM</h2>
                    <div className="w-16 md:w-16 h-[2px] bg-black "></div>
                </div>
            </div>

            {/* Full-width Slider */}
            <div className="w-full group relative">
                <Swiper
                    modules={[Navigation]}
                    spaceBetween={0}
                    slidesPerView={2}
                    loop={false}
                    navigation={{
                        nextEl: '.swiper-button-next-section7',
                        prevEl: '.swiper-button-prev-section7',
                    }}
                    breakpoints={{
                        480: { slidesPerView: 3 },
                        768: { slidesPerView: 4 },
                        1024: { slidesPerView: 6 },
                    }}
                    className="w-full !overflow-visible"
                >
                    {instagramImages.map((src, index) => (
                        <SwiperSlide key={index} className={`!overflow-visible ${activeTag?.slideIndex === index ? 'z-50' : 'z-10'}`}>
                            <div className=" relative aspect-square cursor-pointer">
                                <div className="w-full h-full overflow-hidden">
                                    <img
                                        src={src}
                                        alt={`Instagram ${index + 1}`}
                                        className="w-full h-full object-cover transition-transform duration-700 "
                                    />
                                </div>

                                {/* Tag 1 */}
                                <div
                                    className="absolute top-[40%] left-[60%] -translate-x-1/2 -translate-y-1/2 z-20"
                                    onClick={(e) => handleTagClick(e, index, 1)}
                                >
                                    <div className={`w-6 h-6 ${activeTag?.slideIndex === index && activeTag?.tagId === 1 ? 'bg-[#43D1F0]' : 'bg-[#222]/80'} text-white rounded-full flex items-center justify-center text-[11px] font-bold border border-white/30 shadow-lg transition-all hover:scale-110`}>
                                        1
                                    </div>
                                    {activeTag?.slideIndex === index && activeTag?.tagId === 1 && (
                                        <div className="absolute top-full left-1/2 -translate-x-1/2 z-50">
                                            <ProductPopupCard product={getProductForTag(index, 1)} onClose={() => setActiveTag(null)} />
                                        </div>
                                    )}
                                </div>

                                {/* Tag 2 (only for 3rd image) */}
                                {index === 2 && (
                                    <div
                                        className="absolute top-[70%] left-[40%] -translate-x-1/2 -translate-y-1/2 z-20"
                                        onClick={(e) => handleTagClick(e, index, 2)}
                                    >
                                        <div className={`w-6 h-6 ${activeTag?.slideIndex === index && activeTag?.tagId === 2 ? 'bg-[#43D1F0]' : 'bg-[#222]/80'} text-white rounded-full flex items-center justify-center text-[11px] font-bold border border-white/30 shadow-lg transition-all hover:scale-110`}>
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
                        </SwiperSlide>
                    ))}
                </Swiper>

                {/* Custom Navigation Buttons */}
                <button className="swiper-button-prev-section7 absolute left-4 top-1/2 -translate-y-1/2 z-30 w-11 h-11 bg-white rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-[#222] hover:text-white">
                    <ChevronLeft size={24} />
                </button>
                <button className="swiper-button-next-section7 absolute right-4 top-1/2 -translate-y-1/2 z-30 w-11 h-11 bg-white rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-[#222] hover:text-white">
                    <ChevronRight size={24} />
                </button>
            </div>

            {/* Features Section */}
            <div className="container mx-auto px-4 mt-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 max-w-7xl mx-auto">
                    {features.map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-4 py-2">
                            <div className="flex-shrink-0 opacity-80">
                                {feature.icon}
                            </div>
                            <div className="flex flex-col">
                                <h4 className="text-[14px] font-bold text-[#222] tracking-wider mb-1 uppercase leading-tight">
                                    {feature.title}
                                </h4>
                                <p className="text-[13px] lg:pr-10 text-gray-500 font-medium leading-[2]">
                                    {feature.desc}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Section7;
