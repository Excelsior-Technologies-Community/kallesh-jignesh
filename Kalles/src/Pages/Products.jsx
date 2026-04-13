import React, { useState, useEffect } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import {
    Heart,
    RefreshCw,
    Share2,
    Facebook,
    Twitter,
    Instagram,
    Mail,
    ChevronLeft,
    ChevronRight,
    Minus,
    Plus,
    X,
    HelpCircle
} from 'lucide-react';
import Section3 from '../Sections/Section3';
import ProductCard from '../Components/ProductCard';
import ProductInfoModal from '../Components/ProductInfoModal';
import { useCurrency } from '../Context/CurrencyContext';
import { useCart } from '../Context/CartContext';
import { useWishlist } from '../Context/WishlistContext';

const Products = () => {
    const { formatPrice } = useCurrency();
    const { addToCart } = useCart();
    const { toggleWishlist, isInWishlist } = useWishlist();
    const { id } = useParams();
    const location = useLocation();
    const [product, setProduct] = useState(location.state?.product || null);
    const [loading, setLoading] = useState(!location.state?.product);
    const [quantity, setQuantity] = useState(1);
    const [selectedSize, setSelectedSize] = useState(() => {
        if (location.state?.product?.size) {
            return String(location.state.product.size).split(',')[0].trim();
        }
        return '';
    });
    const [activeImage, setActiveImage] = useState(location.state?.product?.image1 || '');
    const [activeTab, setActiveTab] = useState('description');
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [recentlyViewed, setRecentlyViewed] = useState([]);
    const [showStickyBar, setShowStickyBar] = useState(false);
    const [zoomPos, setZoomPos] = useState({ x: 0, y: 0, show: false });
    const [imageIndex, setImageIndex] = useState(0);
    const [activeModal, setActiveModal] = useState(null);

    const images = product ? [product.image1, product.image2, product.image3, product.image4, product.image5].filter(img => img) : [];

    useEffect(() => {
        const fetchProductData = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`http://localhost:5000/api/products/${id}`);
                const data = response.data;
                setProduct(data);
                setActiveImage(data.image1);

                // Parse sizes
                const sizes = data.size ? String(data.size).split(',').map(s => s.trim()) : [];
                if (sizes.length > 0) setSelectedSize(sizes[0]);

                // Fetch Related Products (same category)
                if (data.category_id) {
                    const catId = String(data.category_id).split(',')[0];
                    const relatedRes = await axios.get(`http://localhost:5000/api/products?category=${catId}`);
                    setRelatedProducts(relatedRes.data.filter(p => String(p.id) !== String(id)).slice(0, 4));
                }

                // Handle Recently Viewed
                const viewed = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
                const updatedViewed = [data, ...viewed.filter(p => String(p.id) !== String(id))].slice(0, 8);
                localStorage.setItem('recentlyViewed', JSON.stringify(updatedViewed));
                setRecentlyViewed(updatedViewed.filter(p => String(p.id) !== String(id)));

                setLoading(false);
            } catch (error) {
                if (error.response && error.response.status === 404) {
                    // Just a 404, product not found - no need to blast the console with a red error
                    setProduct(null);
                } else {
                    console.error("Error fetching product details:", error);
                }
                setLoading(false);
            }
        };

        fetchProductData();
        window.scrollTo(0, 0);

        const handleScroll = () => {
            if (window.scrollY > 600) {
                setShowStickyBar(true);
            } else {
                setShowStickyBar(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [id]);

    const handleQuantityChange = (val) => {
        if (quantity + val >= 1) setQuantity(quantity + val);
    };

    const handleAddToCart = () => {
        if (!product) return;
        addToCart(product, quantity, selectedSize);
    };

    const nextImg = () => {
        const nextIdx = (imageIndex + 1) % images.length;
        setImageIndex(nextIdx);
        setActiveImage(images[nextIdx]);
    };

    const prevImg = () => {
        const prevIdx = (imageIndex - 1 + images.length) % images.length;
        setImageIndex(prevIdx);
        setActiveImage(images[prevIdx]);
    };

    const handleMouseMove = (e) => {
        const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
        const x = ((e.clientX - left) / width) * 100;
        const y = ((e.clientY - top) / height) * 100;
        setZoomPos({ x, y, show: true });
    };

    const handleMouseEnter = () => setZoomPos(prev => ({ ...prev, show: true }));
    const handleMouseLeave = () => setZoomPos(prev => ({ ...prev, show: false }));

    if (loading) {
        return (
            <div className="product-page-container flex items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#43d1f0]"></div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="product-page-container text-center py-20">
                <h2 className="text-2xl font-bold">Product not found</h2>
                <Link to="/" className="text-[#43d1f0] mt-4 inline-block hover:underline">Back to Home</Link>
            </div>
        );
    }

    const sizes = product.size ? String(product.size).split(',').map(s => s.trim()) : [];

    return (
        <div className="relative font-['Inter',_sans-serif]">
            <div className="max-w-[1240px] mx-auto py-10 px-[15px] md:py-[60px] md:px-10">
                <div className="flex flex-col lg:flex-row gap-[30px] lg:gap-[50px] mb-20 items-start">
                    {/* Left: Gallery */}
                    <div className="w-full lg:w-[55%] flex gap-[15px] lg:sticky lg:top-[100px]">
                        <div className="w-20 hidden md:flex flex-col gap-3 shrink-0">
                            {images.map((img, idx) => (
                                <div
                                    key={idx}
                                    className={`aspect-[3/4] cursor-pointer border transition-all duration-300 bg-[#f6f6f6] overflow-hidden rounded ${activeImage === img ? 'border-[#222]' : 'border-[#eee] hover:border-[#222]'}`}
                                    onClick={() => {
                                        setActiveImage(img);
                                        setImageIndex(idx);
                                    }}
                                >
                                    <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                                </div>
                            ))}
                        </div>
                        <div
                            className="grow aspect-[3/4] bg-[#f6f6f6] overflow-hidden relative rounded-lg cursor-crosshair group"
                            onMouseMove={handleMouseMove}
                            onMouseEnter={handleMouseEnter}
                            onMouseLeave={handleMouseLeave}
                        >
                            <img src={activeImage} alt={product.name} className="w-full h-full object-cover" />

                            {/* Navigation Arrows */}
                            <button
                                onClick={(e) => { e.stopPropagation(); prevImg(); }}
                                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full border border-gray-300 bg-white/80 flex items-center justify-center text-gray-800 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white z-10"
                            >
                                <ChevronLeft size={20} />
                            </button>
                            <button
                                onClick={(e) => { e.stopPropagation(); nextImg(); }}
                                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full border border-gray-300 bg-white/80 flex items-center justify-center text-gray-800 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white z-10"
                            >
                                <ChevronRight size={20} />
                            </button>

                            {/* Zoom Lens */}
                            {zoomPos.show && (
                                <div
                                    className="absolute border border-gray-400 bg-white/30 pointer-events-none z-20"
                                    style={{
                                        width: '40%',
                                        height: '40%',
                                        left: `${Math.min(Math.max(zoomPos.x - 20, 0), 60)}%`,
                                        top: `${Math.min(Math.max(zoomPos.y - 20, 0), 60)}%`,
                                    }}
                                />
                            )}
                        </div>

                        {/* Zoom Result Window (Desktop only) */}
                        {zoomPos.show && (
                            <div
                                className="hidden lg:block absolute left-[105%] top-0 w-[400px] h-[400px] border border-gray-200 bg-white z-[100] overflow-hidden rounded-lg shadow-2xl"
                                style={{
                                    backgroundImage: `url(${activeImage})`,
                                    backgroundSize: '800px 1066px', // 2x of main image roughly, or fixed large size
                                    backgroundPosition: `${zoomPos.x}% ${zoomPos.y}%`,
                                    backgroundRepeat: 'no-repeat'
                                }}
                            />
                        )}
                    </div>

                    {/* Right: Info */}
                    <div className="w-full lg:w-[45%] flex flex-col">
                        <div className="text-[12px] text-[#878787] mb-3 uppercase tracking-[0.5px]">
                            Home / {product.category_name || 'Collection'} / {product.name}
                        </div>
                        <h1 className="text-[28px] font-semibold text-[#222] mb-3 leading-tight uppercase tracking-wide">{product.name}</h1>
                        <div className="text-2xl font-medium text-[#222] mb-5">
                            {formatPrice(product.price)}
                        </div>

                        <div className="text-sm leading-[1.7] text-[#666] mb-[30px]">
                            Go kalles this summer with this vintage navy and white striped v-neck t-shirt from the Nike. Perfect for pairing with denim and white kicks for a stylish kalles vibe.
                        </div>

                        {/* Sizes */}
                        {sizes.length > 0 && (
                            <div className="mb-[25px] border-t border-[#f0f0f0] pt-5">
                                <div className="text-[13px] font-semibold mb-[15px] flex justify-between uppercase tracking-[0.5px]">
                                    <span>SIZE: <strong>{selectedSize}</strong></span>
                                    {!(String(product.id) === '39' || String(product.id) === '40' || String(product.id) === '41') && (
                                        <span className="text-[12px] font-normal text-[#878787] underline cursor-pointer normal-case hover:text-[#222]" onClick={() => setActiveModal('size')}>Size Guide</span>
                                    )}
                                </div>
                                <div className="flex gap-3 flex-wrap">
                                    {sizes.map(size => (
                                        <button
                                            key={size}
                                            className={`min-w-[44px] h-[44px] px-[10px] border flex items-center justify-center text-sm font-medium cursor-pointer transition-all duration-300 rounded-full ${selectedSize === size ? 'bg-[#222] text-white border-[#222]' : 'border-[#e5e5e5] bg-transparent hover:border-[#222]'}`}
                                            onClick={() => setSelectedSize(size)}
                                        >
                                            {size}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Purchase actions */}
                        <div className="flex flex-wrap gap-[15px] mb-[30px]">
                            <div className="flex items-center border border-[#e5e5e5] rounded-[25px] h-[50px] w-[120px] overflow-hidden">
                                <button className="flex-1 h-full flex items-center justify-center cursor-pointer border-none bg-transparent text-lg text-[#222] transition-colors duration-300 hover:bg-[#f9f9f9]" onClick={() => handleQuantityChange(-1)}><Minus size={16} /></button>
                                <span className="w-[30px] text-center font-semibold text-sm">{quantity}</span>
                                <button className="flex-1 h-full flex items-center justify-center cursor-pointer border-none bg-transparent text-lg text-[#222] transition-colors duration-300 hover:bg-[#f9f9f9]" onClick={() => handleQuantityChange(1)}><Plus size={16} /></button>
                            </div>
                            <button
                                onClick={handleAddToCart}
                                className={`grow min-w-[200px] h-[50px] text-white border-none rounded-[25px] font-semibold text-sm uppercase tracking-wider cursor-pointer transition-all duration-300 shadow-lg ${product.stock <= 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#43d1f0] hover:bg-[#222] hover:-translate-y-[2px] hover:shadow-[0_5px_15px_rgba(0,0,0,0.1)]'}`}
                                disabled={product.stock <= 0}
                            >
                                {product.stock <= 0 ? 'Sold Out' : 'Add to Cart'}
                            </button>
                             <div className="flex gap-[10px]">
                                <button 
                                    onClick={() => toggleWishlist(product)}
                                    className={`w-[50px] h-[50px] border rounded-full flex items-center justify-center transition-all duration-300 shadow-sm ${isInWishlist(product.id) ? 'bg-[#f04e23] border-[#f04e23] text-white' : 'bg-white border-gray-200 text-gray-500 hover:text-[#f04e23] hover:border-[#f04e23]'}`}
                                    title={isInWishlist(product.id) ? "Remove from Wishlist" : "Add to Wishlist"}
                                >
                                    <Heart size={20} fill={isInWishlist(product.id) ? "currentColor" : "none"} strokeWidth={2} />
                                </button>
                                <button className="w-[50px] h-[50px] border border-gray-200 rounded-full flex items-center justify-center bg-white text-gray-500 hover:bg-[#222] hover:text-white transition-all shadow-sm">
                                    <RefreshCw size={20} strokeWidth={2} />
                                </button>
                            </div>
                        </div>

                        {/* Trust Badges */}
                        <div className="mb-[30px] py-5 border-y border-[#f0f0f0]">
                            <div className="flex flex-wrap gap-4">
                                <img src="https://kalles-5.myshopify.com/cdn/shop/files/trust_img.png?v=1718015360&width=740" alt="Trust Badge" className="h-12 object-contain" />
                            </div>
                        </div>

                        <div className="flex gap-[20px] mb-[25px] flex-wrap">
                            {!(String(product.id) === '39' || String(product.id) === '40' || String(product.id) === '41') && (
                                <span className="text-[13px] font-medium text-[#222] cursor-pointer flex items-center gap-[5px] hover:underline hover:text-[#43d1f0]" onClick={() => setActiveModal('size')}>
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg> 
                                    Size guide
                                </span>
                            )}
                            <span className="text-[13px] font-medium text-[#222] cursor-pointer flex items-center gap-[5px] hover:underline hover:text-[#43d1f0]" onClick={() => setActiveModal('delivery')}>
                                <RefreshCw size={16} /> Delivery & Return
                            </span>
                            <span className="text-[13px] font-medium text-[#222] cursor-pointer flex items-center gap-[5px] hover:underline hover:text-[#43d1f0]" onClick={() => setActiveModal('ask')}>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg> 
                                Ask a Question
                            </span>
                        </div>

                        <div className="text-[13px] text-[#878787] mb-[30px] leading-[2.2]">
                            <div className="flex gap-2">Availability: <span className="text-[#222] font-medium">{product.stock > 0 ? 'In stock' : 'Out of stock'}</span></div>
                            <div className="flex gap-2">SKU: <span className="text-[#222] font-medium">KAL-{product.id || '12345'}</span></div>
                            <div className="flex gap-2">Categories: <span className="text-[#222] font-medium">{product.category_name || 'All, Women'}</span></div>
                            <div className="flex gap-2">Tags: <span className="text-[#222] font-medium">Modern, Premium, {product.name}</span></div>
                        </div>

                        <div className="flex gap-[15px] items-center">
                            <div className="w-10 h-10 flex items-center justify-center bg-[#f6f6f6] text-[#222] rounded-full cursor-pointer transition-all duration-300 hover:bg-[#43d1f0] hover:text-white ">
                                <Facebook size={18} />
                            </div>
                            <div className="w-10 h-10 flex items-center justify-center bg-[#f6f6f6] text-[#222] rounded-full cursor-pointer transition-all duration-300 hover:bg-[#43d1f0] hover:text-white ">
                                <Twitter size={18} />
                            </div>
                            <div className="w-10 h-10 flex items-center justify-center bg-[#f6f6f6] text-[#222] rounded-full cursor-pointer transition-all duration-300 hover:bg-[#43d1f0] hover:text-white ">
                                <Instagram size={18} />
                            </div>
                            <div className="w-10 h-10 flex items-center justify-center bg-[#f6f6f6] text-[#222] rounded-full cursor-pointer transition-all duration-300 hover:bg-[#43d1f0] hover:text-white ">
                                <Mail size={18} />
                            </div>
                            <div className="w-10 h-10 flex items-center justify-center bg-[#f6f6f6] text-[#222] rounded-full cursor-pointer transition-all duration-300 hover:bg-[#43d1f0] hover:text-white ">
                                <Share2 size={18} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="mt-[60px] border-t border-[#f0f0f0] pt-[50px]">
                    <div className="flex justify-center gap-[30px] mb-10 flex-wrap border-b border-[#f0f0f0]">
                        <button
                            className={`text-base font-semibold bg-none border-none cursor-pointer px-[5px] pb-[15px] relative transition-all duration-300 uppercase tracking-wider ${activeTab === 'description' ? 'text-[#222] after:content-[""] after:absolute after:bottom-[-1px] after:left-0 after:w-full after:h-[2px] after:bg-[#222]' : 'text-[#878787]'}`}
                            onClick={() => setActiveTab('description')}
                        >
                            Description
                        </button>
                        <button
                            className={`text-base font-semibold bg-none border-none cursor-pointer px-[5px] pb-[15px] relative transition-all duration-300 uppercase tracking-wider ${activeTab === 'info' ? 'text-[#222] after:content-[""] after:absolute after:bottom-[-1px] after:left-0 after:w-full after:h-[2px] after:bg-[#222]' : 'text-[#878787]'}`}
                            onClick={() => setActiveTab('info')}
                        >
                            Additional Information
                        </button>
                        <button
                            className={`text-base font-semibold bg-none border-none cursor-pointer px-[5px] pb-[15px] relative transition-all duration-300 uppercase tracking-wider ${activeTab === 'custom' ? 'text-[#222] after:content-[""] after:absolute after:bottom-[-1px] after:left-0 after:w-full after:h-[2px] after:bg-[#222]' : 'text-[#878787]'}`}
                            onClick={() => setActiveTab('custom')}
                        >
                            Custom tab
                        </button>
                    </div>
                    <div className="text-[15px] leading-[1.8] text-[#666] max-w-[900px] mx-auto">
                        {activeTab === 'description' && (
                            <div className="animate-in fade-in duration-500">
                                <p>{product.description || "Go sporty this summer with this vintage navy and white striped v-neck t-shirt. Perfect for pairing with denim and white kicks for a stylish sporty vibe."}</p>
                                <p className="mt-8 text-gray-500 italic border-l-4 border-[#43d1f0] pl-4">"Quality and design are at the heart of everything we create. This piece represents our commitment to excellence and style."</p>
                                <p className="mt-8">Typography is the work of typesetters, composers, typographers, graphic designers, art directors, manga artists, comic book artists, graffiti artists, and now—anyone who arranges words, letters, numbers, and symbols for publication, display, or distribution—from clerical workers and newsletter writers to anyone self-publishing materials.</p>
                            </div>
                        )}
                        {activeTab === 'info' && (
                            <div className="animate-in fade-in duration-500">
                                <table className="w-full border-collapse">
                                    <tbody>
                                        <tr className="border-b">
                                            <td className="py-4 font-bold w-1/3 text-black">Weight</td>
                                            <td className="py-4 text-gray-600">0.5 kg</td>
                                        </tr>
                                        <tr className="border-b">
                                            <td className="py-4 font-bold text-black">Dimensions</td>
                                            <td className="py-4 text-gray-600">10 × 10 × 10 cm</td>
                                        </tr>
                                        <tr className="border-b">
                                            <td className="py-4 font-bold text-black">Color</td>
                                            <td className="py-4 text-gray-600">Black, White, Blue</td>
                                        </tr>
                                        <tr className="border-b">
                                            <td className="py-4 font-bold text-black">Material</td>
                                            <td className="py-4 text-gray-600">100% Organic Cotton</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        )}
                        {activeTab === 'custom' && (
                            <div className="animate-in fade-in duration-500">
                                <p className="font-bold text-black mb-4">Shipping Information</p>
                                <p>We offer global shipping. Delivery times vary by location:</p>
                                <ul className="list-disc ml-5 mt-2 space-y-1">
                                    <li>UAE: 1-2 business days</li>
                                    <li>GCC: 3-5 business days</li>
                                    <li>International: 7-10 business days</li>
                                </ul>
                            </div>
                        )}
                    </div>
                </div>

                {/* Related Products */}
                {relatedProducts.length > 0 && (
                    <div className="mt-20 pt-10 border-t border-[#f0f0f0]">
                        <h2 className="text-[22px] font-bold text-center mb-10 uppercase tracking-[2px] text-[#222]">
                            You may also like
                            <div className="w-[50px] h-[2px] bg-[#43d1f0] mx-auto mt-[15px]"></div>
                        </h2>
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                            {relatedProducts.map(item => (
                                <ProductCard key={item.id} product={item} />
                            ))}
                        </div>
                    </div>
                )}

                {/* Recently Viewed */}
                {recentlyViewed.length > 0 && (
                    <div className="mt-20 pt-10 border-t border-[#f0f0f0]">
                        <h2 className="text-[22px] font-bold text-center mb-10 uppercase tracking-[2px] text-[#222]">
                            Recently viewed products
                            <div className="w-[50px] h-[2px] bg-[#43d1f0] mx-auto mt-[15px]"></div>
                        </h2>
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                            {recentlyViewed.map(item => (
                                <ProductCard key={item.id} product={item} />
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Sticky Bottom Bar */}
            <div className={`fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 z-[1000] transition-transform duration-500 shadow-[0_-5px_20px_rgba(0,0,0,0.05)] ${showStickyBar ? 'translate-y-0' : 'translate-y-full'}`}>
                <div className="max-w-[1240px] mx-auto h-[80px] flex items-center justify-between px-[15px] md:px-10 font-['Inter',_sans-serif]">
                    <div className="flex items-center gap-4">
                        <img src={images[0]} alt={product?.name} className="w-12 h-12 rounded object-cover border border-gray-100" />
                        <div className="hidden sm:block">
                            <h4 className="text-sm font-semibold truncate max-w-[200px]">{product?.name}</h4>
                            <p className="text-[#43d1f0] font-bold">{formatPrice(product?.price)}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="hidden md:flex items-center bg-[#f6f6f6] rounded-full px-4 py-2">
                            <span className="text-[12px] font-bold text-gray-400 mr-2 uppercase">Size:</span>
                            <span className="text-sm font-bold text-black uppercase">{selectedSize}</span>
                        </div>

                        <div className="flex items-center border border-[#e5e5e5] rounded-[25px] h-[44px] w-[100px] overflow-hidden bg-white">
                            <button className="flex-1 h-full flex items-center justify-center cursor-pointer border-none bg-transparent text-[#222] hover:bg-[#f9f9f9]" onClick={() => handleQuantityChange(-1)}><Minus size={14} /></button>
                            <span className="w-[30px] text-center font-bold text-sm">{quantity}</span>
                            <button className="flex-1 h-full flex items-center justify-center cursor-pointer border-none bg-transparent text-[#222] hover:bg-[#f9f9f9]" onClick={() => handleQuantityChange(1)}><Plus size={14} /></button>
                        </div>

                        <button
                            onClick={handleAddToCart}
                            className={`h-[44px] px-8 text-white rounded-[25px] font-bold text-xs uppercase tracking-widest transition-all ${product?.stock <= 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#43d1f0] hover:bg-[#222]'}`}
                            disabled={product?.stock <= 0}
                        >
                            {product?.stock <= 0 ? 'Sold Out' : 'Add to Cart'}
                        </button>
                    </div>
                </div>
            </div>

            <ProductInfoModal activeModal={activeModal} setActiveModal={setActiveModal} product={product} />
        </div>
    );
};

export default Products;
