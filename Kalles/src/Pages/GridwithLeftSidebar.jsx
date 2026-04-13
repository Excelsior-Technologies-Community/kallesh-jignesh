import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { FaPinterest } from "react-icons/fa6";
import { Link } from 'react-router-dom';
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
    ShoppingBag,
    Truck,
    Clock,
    RotateCcw,
    Facebook,
    Twitter,
    Instagram,
    Youtube,
} from 'lucide-react';
import QuickAddModal from '../Components/QuickAddModal';
import QuickViewModal from '../Components/QuickViewModal';
import { useCurrency } from '../Context/CurrencyContext'; // Import useCurrency hook
import { useWishlist } from '../Context/WishlistContext'; // Import useWishlist hook
import { useCart } from '../Context/CartContext';

const ProductListItem = ({ product }) => {
    const { formatPrice } = useCurrency(); // Use the useCurrency hook
    const { toggleWishlist, isInWishlist } = useWishlist();
    const { addToCart } = useCart();
    const isFavorite = isInWishlist(product.id);
    const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
    const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
    const discount = product.discount_percent || 0;
    const hasDiscount = discount > 0;
    const oldPrice = hasDiscount ? (product.price / (1 - discount / 100)).toFixed(2) : null;
    const description = product.description || "PRODUCT DETAILS Design inspiration lorem ipsum dolor sit amet, consectetuer adipiscing elit. Morbi commodo, ipsum sed pharetra gravida, orci magna rhoncus neque, id pulvinar odio lorem non turpis. Nullam sit...";
    const [quantity, setQuantity] = useState(1);

    const handleQuantityChange = (val) => {
        if (quantity + val >= 1) {
            setQuantity(quantity + val);
        }
    };

    return (
        <div className="flex flex-col border p-5 justify-center items-center md:flex-row gap-8 border-b border-gray-200 last:border-0 group/card">
            <div className="w-full md:w-[220px] shrink-0 relative overflow-hidden group">
                <div className="aspect-[4/5] relative overflow-hidden bg-[#f6f6f6]">
                    <Link to={`/product/${product.id}`}>
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

                    {/* Circular Badges (Top Right) */}
                    <div className="absolute top-3 right-3 flex flex-col gap-2 z-10">
                        {product.stock <= 0 && (
                            <div className="w-11 h-11 bg-gray-500 text-white rounded-full flex items-center justify-center text-[8px] uppercase font-bold text-center leading-tight shadow-sm">
                                Sold<br />Out
                            </div>
                        )}
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

                    <div className="absolute top-1 left-1 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                        <button 
                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleWishlist(product); }}
                            className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors shadow-sm ${isFavorite ? 'bg-[#56cfe1] text-white' : 'bg-transparent hover:bg-[#56cfe1] hover:text-white'}`}
                        >
                            <Heart size={16} fill={isFavorite ? "currentColor" : "none"} />
                        </button>
                        <button className="w-8 h-8 bg-transparent shadow-sm rounded-full flex items-center justify-center hover:bg-[#56cfe1] hover:text-white transition-colors">
                            <RefreshCw size={16} />
                        </button>
                    </div>
                </div>
            </div>

            <div className="flex-1 flex flex-col items-start pr-4">
                <h3 className="text-[16px] md:text-[18px] font-bold text-[#222] mb-1 hover:text-[#56cfe1] transition-colors cursor-pointer">
                    <Link to={`/product/${product.id}`}>{product.name}</Link>
                </h3>
                <div className="flex gap-2 items-center mb-4 text-[15px] font-medium">
                    <span className="text-gray-500">{formatPrice(product.price)}</span>
                    {oldPrice && <span className="text-gray-400 line-through">{oldPrice}</span>}
                </div>
                <p className="text-gray-500 text-[14px] leading-7 mb-6 line-clamp-3">{description}</p>
            </div>

            <div className="w-full md:w-[220px] shrink-0 flex flex-col gap-3 pt-2">
                <button 
                    onClick={() => setIsQuickViewOpen(true)}
                    className="w-full h-11 flex items-center justify-center border-2 border-[#56cfe1] text-[#56cfe1] rounded-full text-[14px] font-bold hover:bg-[#56cfe1] hover:text-white transition-all duration-300"
                >
                    Quick view
                </button>
                <button
                    onClick={() => setIsQuickAddOpen(true)}
                    className="w-full h-11 flex items-center justify-center border-2 border-black text-black rounded-full text-[14px] font-bold hover:bg-black hover:text-white transition-all duration-300"
                >
                    Quick add
                </button>
                <QuickAddModal
                    key={`add-${product.id}-${isQuickAddOpen}`}
                    product={product}
                    isOpen={isQuickAddOpen}
                    onClose={() => setIsQuickAddOpen(false)}
                />
                <QuickViewModal
                    key={`qv-${product.id}-${isQuickViewOpen}`}
                    product={product}
                    isOpen={isQuickViewOpen}
                    onClose={() => setIsQuickViewOpen(false)}
                />
                <div className="flex items-center w-full">
                    <div className="flex items-center bg-[#f2f2f2] rounded-l-full h-[45px] px-2 min-w-[80px]">
                        <button onClick={() => handleQuantityChange(-1)} className="w-full h-full flex items-center justify-center text-gray-500 hover:text-black transition-colors">-</button>
                        <span className="w-full text-center text-[14px] font-bold text-[#222]">{quantity}</span>
                        <button onClick={() => handleQuantityChange(1)} className="w-full h-full flex items-center justify-center text-gray-500 hover:text-black transition-colors">+</button>
                    </div>
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
        if (quantity + val >= 1) setQuantity(quantity + val);
    };

    return (
        <div className="group relative overflow-hidden flex flex-col items-center">
            <div className="w-full aspect-[3/4] relative overflow-hidden bg-[#f6f6f6] mb-4">
                <Link to={`/product/${product.id}`}>
                    {product.image1 ? (
                        <img src={product.image1} alt={product.name} className="absolute inset-0 w-full h-full object-cover" />
                    ) : (
                        <div className="absolute inset-0 w-full h-full flex items-center justify-center bg-gray-100 text-gray-400"><span>No Image</span></div>
                    )}
                    {product.image2 && (
                        <img src={product.image2} alt={product.name} className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    )}
                </Link>

                <div className="absolute top-1 right-1 flex flex-col gap-2 z-10">
                    {product.stock <= 0 && (
                        <div className="w-9 h-9 bg-gray-500 text-white rounded-full flex items-center justify-center text-[10px] uppercase font-bold text-center leading-tight shadow-md">Sold<br />Out</div>
                    )}
                    {Boolean(hasDiscount) && (
                        <div className="w-9 h-9 bg-[#f04e23] text-white rounded-full flex items-center justify-center text-[12px] font-bold shadow-md">-{discount}%</div>
                    )}
                    {Boolean(product.is_preorder) && (
                        <div className="w-9 h-9 bg-[#0066cc] text-white rounded-full flex items-center justify-center text-[10px] uppercase font-semibold text-center leading-tight shadow-md">Pre-<br />Order</div>
                    )}
                </div>

                <div className="absolute -top-6 left-1 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform -translate-x-2 group-hover:translate-x-0 z-10">
                    <div className="flex flex-col gap-2 mt-8">
                        <button 
                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleWishlist(product); }}
                            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 shadow-md ${isFavorite ? 'bg-[#f04e23] text-white' : 'bg-white text-[#222] hover:bg-[#f04e23] hover:text-white'}`}
                        >
                            <Heart size={15} fill={isFavorite ? "currentColor" : "none"} strokeWidth={2} />
                        </button>
                        <button className="w-8 h-8 bg-transparent shadow-sm rounded-full flex items-center justify-center hover:bg-[#56cfe1] hover:text-white transition-colors"><RefreshCw size={15} /></button>
                    </div>
                </div>

                <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div className={`flex flex-col gap-2 w-full px-4 transform transition-transform duration-300 translate-y-4 group-hover:translate-y-0 ${columns <= 2 ? 'max-w-[210px]' : (columns >= 5 ? 'px-2 gap-1.5' : 'max-w-[160px]')}`}>
                        <button 
                            onClick={() => setIsQuickViewOpen(true)}
                            className={`w-full bg-white text-[#222] font-bold uppercase tracking-wider rounded-full shadow-lg hover:bg-[#222] hover:text-white transition-all ${columns >= 5 ? 'py-1.5 text-[10px]' : (columns >= 4 ? 'py-2 text-[11px]' : 'py-2.5 text-[12px]')}`}
                        >
                            Quick view
                        </button>
                        <button
                            onClick={(e) => { e.preventDefault(); setIsQuickAddOpen(true); }}
                            className={`w-full bg-black text-white font-bold uppercase tracking-wider rounded-full shadow-lg hover:bg-[#56cfe1] transition-all ${columns >= 5 ? 'py-1.5 text-[10px]' : (columns >= 4 ? 'py-2 text-[11px]' : 'py-2.5 text-[12px]')}`}
                        >
                            Quick add
                        </button>
                        <div className="flex items-center w-full">
                            <div className={`flex items-center bg-[#f2f2f2] rounded-l-full px-1 border-r border-gray-200 ${columns >= 5 ? 'h-[32px]' : (columns >= 4 ? 'h-[36px]' : 'h-[40px]')}`}>
                                <button onClick={(e) => { e.preventDefault(); handleQuantityChange(-1); }} className="w-4 h-full flex items-center justify-center text-gray-500 hover:text-black">-</button>
                                <span className={`text-center font-bold text-[#222] ${columns >= 5 ? 'w-4 text-[11px]' : 'w-6 text-[12px]'}`}>{quantity}</span>
                                <button onClick={(e) => { e.preventDefault(); handleQuantityChange(1); }} className="w-4 h-full flex items-center justify-center text-gray-500 hover:text-black">+</button>
                            </div>
                            <button
                                onClick={(e) => { 
                                    if (product.stock <= 0) return;
                                    e.preventDefault(); 
                                    addToCart(product, quantity, product.size ? String(product.size).split(',')[0].trim() : ''); 
                                }}
                                className={`flex-1 text-white font-bold uppercase tracking-wider rounded-r-full transition-all truncate ${product.stock <= 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#56cfe1] hover:bg-black'} ${columns >= 5 ? 'h-[32px] text-[10px] px-1' : (columns >= 4 ? 'h-[36px] text-[11px] px-2' : 'h-[40px] text-[12px] px-3')}`}
                                disabled={product.stock <= 0}
                            >
                                {product.stock <= 0 ? 'Sold Out' : 'Add to cart'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="text-center px-2">
                <h3 className="text-[14px] md:text-[15px] font-medium text-[#222] mb-1 hover:text-[#56cfe1] transition-colors line-clamp-1">
                    <Link to={`/product/${product.id}`}>{product.name}</Link>
                </h3>
                <div className="flex justify-center gap-2 items-center text-[14px] font-medium">
                    <span className="text-[#222]">{formatPrice(product.price)}</span>
                    {oldPrice && <span className="text-gray-400 line-through text-[13px]">{formatPrice(oldPrice)}</span>}
                </div>
            </div>

            <QuickAddModal
                key={`${product.id}-${isQuickAddOpen}`}
                product={product}
                isOpen={isQuickAddOpen}
                onClose={() => setIsQuickAddOpen(false)}
            />
            <QuickViewModal
                key={`qv-${product.id}-${isQuickViewOpen}`}
                product={product}
                isOpen={isQuickViewOpen}
                onClose={() => setIsQuickViewOpen(false)}
            />
        </div>
    );
};

const GridwithLeftSidebar = () => {
    const currency = useCurrency();
    const formatPrice = currency.formatPrice;
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [layout, setLayout] = useState(2);
    const [sortOption, setSortOption] = useState('featured');

    const itemsPerPage = layout === 'list' ? 6 : 12;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [productsRes, categoriesRes] = await Promise.all([
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

    let filteredProducts = selectedCategory
        ? products.filter(product => {
            if (!product.category_id) return false;
            const productCatIds = String(product.category_id).split(',').map(id => id.trim());
            return productCatIds.includes(String(selectedCategory.id));
        })
        : [...products];

    // Sorting logic (simplified)
    if (sortOption === 'price-low-high') filteredProducts.sort((a, b) => a.price - b.price);
    else if (sortOption === 'price-high-low') filteredProducts.sort((a, b) => b.price - a.price);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentProducts = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

    const getGridClass = () => {
        switch (layout) {
            case 2: return "grid-cols-1 sm:grid-cols-2";
            case 3: return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";
            case 4: return "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4";
            default: return "grid-cols-1";
        }
    };

    return (
        <div className="w-full bg-white">
            {/* Page Title / Banner Section */}
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

            <div className="container mx-auto px-4 lg:px-8 max-w-[1240px] pb-20">
                <div className="flex flex-col lg:flex-row gap-10">
                    {/* Left Sidebar */}
                    <aside className="w-full lg:w-[280px] shrink-0">
                        {/* 1. Product Categories */}
                        <div className="mb-10">
                            <h3 className="text-[16px] font-bold uppercase tracking-wider mb-6 pb-2 border-b-2 border-[#56cfe1] w-fit">Product Categories</h3>
                            <ul className="space-y-3 text-[14px] max-h-[220px] overflow-y-auto pr-2 custom-scrollbar">
                                <li className={`cursor-pointer hover:text-[#56cfe1] transition-colors ${!selectedCategory ? 'text-[#56cfe1] font-bold' : 'text-gray-600'}`} onClick={() => handleCategorySelect(null)}>
                                    All Products <span className="text-gray-400 ml-1">({products.length})</span>
                                </li>
                                {categories.map(cat => (
                                    <li key={cat.id} className={`cursor-pointer hover:text-[#56cfe1] transition-colors ${selectedCategory?.id === cat.id ? 'text-[#56cfe1] font-bold' : 'text-gray-600'}`} onClick={() => handleCategorySelect(cat)}>
                                        {cat.name} <span className="text-gray-400 ml-1">({cat.product_count || 0})</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* 2. Sale Products */}
                        <div className="mb-10">
                            <h3 className="text-[16px] font-bold uppercase tracking-wider mb-6 pb-2 border-b-2 border-[#56cfe1] w-fit">Sale products</h3>
                            <div className="space-y-6">
                                {products.filter(p => p.discount_percent > 0).slice(0, 3).map(p => (
                                    <div key={p.id} className="flex gap-4 group">
                                        <div className="w-[80px] h-[100px] shrink-0 overflow-hidden bg-gray-100">
                                            <img src={p.image1} alt={p.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                        </div>
                                        <div>
                                            <h4 className="text-[14px] font-medium text-[#222] hover:text-[#56cfe1] transition-colors line-clamp-2 mb-1 cursor-pointer">{p.name}</h4>
                                            <div className="flex gap-2 text-[14px]">
                                                <span className="text-red-500 font-bold">{formatPrice(p.price)}</span>
                                                <span className="text-gray-400 line-through">{formatPrice((p.price / (1 - p.discount_percent / 100)).toFixed(0))}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* 3. Shipping & Delivery */}
                        <div className="mb-10 space-y-8">
                            <div className="flex gap-4 items-start">
                                <Truck className="text-[#56cfe1] shrink-0" size={24} />
                                <div>
                                    <h4 className="text-[14px] font-bold uppercase mb-1">FREE SHIPPING</h4>
                                    <p className="text-[13px] text-gray-500">For all orders over $100</p>
                                </div>
                            </div>
                            <div className="flex gap-4 items-start">
                                <Clock className="text-[#56cfe1] shrink-0" size={24} />
                                <div>
                                    <h4 className="text-[14px] font-bold uppercase mb-1">SUPPORT 24/7</h4>
                                    <p className="text-[13px] text-gray-500">We support 24 hours a day</p>
                                </div>
                            </div>
                            <div className="flex gap-4 items-start">
                                <RotateCcw className="text-[#56cfe1] shrink-0" size={24} />
                                <div>
                                    <h4 className="text-[14px] font-bold uppercase mb-1">30 DAYS RETURN</h4>
                                    <p className="text-[13px] text-gray-500">You have 30 days to return</p>
                                </div>
                            </div>
                        </div>

                        {/* 4. Gallery */}
                        <div className="mb-10">
                            <h3 className="text-[16px] font-bold uppercase tracking-wider mb-6 pb-2 border-b-2 border-[#56cfe1] w-fit">Gallery</h3>
                            <div className="grid grid-cols-3 gap-0.5">
                                {[
                                    "https://kalles-5.myshopify.com/cdn/shop/files/ins1_2022-03-02.jpg?v=1717463752&width=300",
                                    "https://kalles-5.myshopify.com/cdn/shop/files/ins2_2022-03-02.jpg?v=1717463752&width=300",
                                    "https://kalles-5.myshopify.com/cdn/shop/files/ins3_2022-03-02.jpg?v=1717463752&width=300",
                                    "https://kalles-5.myshopify.com/cdn/shop/files/ins4_2022-03-02.jpg?v=1717463752&width=300",
                                    "https://kalles-5.myshopify.com/cdn/shop/files/ins5_2022-03-02.jpg?v=1717463753&width=300",
                                    "https://kalles-5.myshopify.com/cdn/shop/files/ins6_2022-03-02.jpg?v=1717463752&width=300",
                                    "https://kalles-5.myshopify.com/cdn/shop/files/ins7_2022-03-02.jpg?v=1717463752&width=300",
                                    "https://kalles-5.myshopify.com/cdn/shop/files/ins8_2022-03-02.jpg?v=1717463752&width=300",
                                    "https://kalles-5.myshopify.com/cdn/shop/files/ins1_3_540x_7d754c9d-2d8e-4a6d-922b-2d487f361340_2022-03-25.jpg?v=1717552854&width=500"
                                ].map((url, i) => (
                                    <div key={i} className="aspect-square bg-gray-100 overflow-hidden group cursor-pointer">
                                        <img src={url} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 group-hover:grayscale" alt="gallery" />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* 5. Follow Us */}
                        <div>
                            <h3 className="text-[16px] font-bold uppercase tracking-wider mb-6 pb-2 border-b-2 border-[#56cfe1] w-fit">Follow us</h3>
                            <div className="flex gap-4">
                                <Facebook size={18} className="text-gray-400 hover:text-[#56cfe1] cursor-pointer" />
                                <Twitter size={18} className="text-gray-400 hover:text-[#56cfe1] cursor-pointer" />
                                <Instagram size={18} className="text-gray-400 hover:text-[#56cfe1] cursor-pointer" />
                                <Youtube size={18} className="text-gray-400 hover:text-[#56cfe1] cursor-pointer" />
                                <FaPinterest size={18} className="text-gray-400 hover:text-[#56cfe1] cursor-pointer" />
                            </div>
                        </div>
                    </aside>

                    {/* Main Content Area */}
                    <div className="flex-1">
                        {/* Toolbar */}
                        <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-100">
                            <div className="flex items-center gap-2">
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

                                {/* 2 Columns */}
                                <button
                                    onClick={() => setLayout(2)}
                                    className={`group w-9 h-9 flex items-center justify-center border transition-all ${layout === 2 ? 'border-black' : 'border-gray-200 hover:border-black'}`}
                                >
                                    <div className="flex gap-[2px] w-5 h-4">
                                        <div className={`flex-1 ${layout === 2 ? 'bg-black' : 'bg-gray-300 group-hover:bg-black'}`}></div>
                                        <div className={`flex-1 ${layout === 2 ? 'bg-black' : 'bg-gray-300 group-hover:bg-black'}`}></div>
                                    </div>
                                </button>

                                {/* 3 Columns */}
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

                                {/* 4 Columns */}
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
                            </div>
                            <select value={sortOption} onChange={(e) => setSortOption(e.target.value)} className="border-none text-[14px] font-medium outline-none cursor-pointer text-gray-600 hover:text-black">
                                <option value="featured">Featured</option>
                                <option value="price-low-high">Price, low to high</option>
                                <option value="price-high-low">Price, high to low</option>
                            </select>
                        </div>

                        {/* Product List */}
                        {loading ? (
                            <div className="grid grid-cols-2 gap-8 animate-pulse">
                                {[...Array(6)].map((_, i) => <div key={i} className="aspect-[3/4] bg-gray-100 rounded-xl"></div>)}
                            </div>
                        ) : (
                            <>
                                {layout === 'list' ? (
                                    <div className="space-y-0">
                                        {currentProducts.map(p => <ProductListItem key={p.id} product={p} />)}
                                    </div>
                                ) : (
                                    <div className={`grid gap-8 ${getGridClass()}`}>
                                        {currentProducts.map(p => <ProductGridItem key={p.id} product={p} columns={layout} />)}
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
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GridwithLeftSidebar;
