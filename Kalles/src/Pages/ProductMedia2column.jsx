import React, { useState } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  LayoutGrid, 
  Heart, 
  ArrowRightLeft, 
  Minus, 
  Plus, 
  Facebook, 
  Twitter, 
  Instagram, 
  Mail, 
  Share2,
  ShoppingBag,
  X,
  HelpCircle,
  RefreshCw
} from 'lucide-react';
import ProductInfoModal from '../Components/ProductInfoModal';
import { useCart } from '../Context/CartContext';
import { useWishlist } from '../Context/WishlistContext';
import ProductCard from '../Components/ProductCard';

const ProductMedia2column = () => {
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('S');
  const [activeTab, setActiveTab] = useState('Description');
  const [activeModal, setActiveModal] = useState(null);
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const productImages = [
    'https://kalles-5.myshopify.com/cdn/shop/files/11780391-1-white.jpg?v=1717405103&width=823',
    'https://kalles-5.myshopify.com/cdn/shop/files/11780391-2.jpg?v=1717405103&width=823',
    'https://kalles-5.myshopify.com/cdn/shop/files/11780391-3.jpg?v=1717405103&width=823',
    'https://kalles-5.myshopify.com/cdn/shop/files/11780391-4.jpg?v=1717405103&width=823'
  ];

  const product = {
    id: 'long-sleeve-tie-front-top-static',
    name: "Long Sleeve Tie Front Top",
    price: 15.00,
    image1: productImages[0],
    image2: productImages[1]
  };

  const isFavorite = isInWishlist(product.id);
  const [zoomData, setZoomData] = useState({ active: false, x: 0, y: 0, index: -1 });

  const handleMouseMove = (e, index) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    setZoomData({ 
      active: true, 
      x: Math.max(0, Math.min(100, x)), 
      y: Math.max(0, Math.min(100, y)),
      index
    });
  };

  const handleMouseLeave = () => {
    setZoomData({ active: false, x: 0, y: 0, index: -1 });
  };



  const sliderRef = React.useRef(null);

  const scrollSlider = (direction) => {
    if (sliderRef.current) {
      const scrollAmount = sliderRef.current.offsetWidth;
      sliderRef.current.scrollBy({
        left: direction === 'next' ? scrollAmount : -scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="w-full bg-white font-sans text-zinc-900">
      {/* Breadcrumbs & Navigation Bar */}
      <div className="border-b border-zinc-100">
        <div className="max-w-[1400px] mx-auto px-6 py-4 flex items-center justify-between">
          <nav className="flex items-center gap-2 text-[14px] text-zinc-500">
            <span className="hover:text-zinc-900 cursor-pointer text-zinc-400">Home</span>
            <ChevronRight size={14} className="text-zinc-300" />
            <span className="hover:text-zinc-900 cursor-pointer">Long Sleeve Tie Front Top</span>
          </nav>
          <div className="flex items-center gap-4 text-zinc-400">
            <button className="hover:text-zinc-900 transition-colors"><ChevronLeft size={20} /></button>
            <button className="hover:text-zinc-900 transition-colors"><LayoutGrid size={18} /></button>
            <button className="hover:text-zinc-900 transition-colors"><ChevronRight size={20} /></button>
          </div>
        </div>
      </div>

      {/* Main Product Section */}
      <div className="max-w-[1200px] mx-auto px-6 py-10">
        <div className="flex flex-col lg:flex-row gap-12 items-start">
          
          {/* Left: Images (2 Column Grid) */}
          <div className="w-full lg:w-[42%]">
            <div className="grid grid-cols-2 gap-2 md:gap-4">
              {productImages.map((img, idx) => (
                  <div 
                    key={idx} 
                    className="w-full overflow-hidden cursor-crosshair relative animate-rotate-in-manual"
                    style={{ animationDelay: `${idx * 0.15}s` }}
                    onMouseMove={(e) => handleMouseMove(e, idx)}
                    onMouseLeave={handleMouseLeave}
                  >
                    <img 
                      src={img} 
                      alt={`Product ${idx}`} 
                      className={`w-full h-auto object-cover transition-transform duration-200 ease-out ${
                       zoomData.active && zoomData.index === idx ? 'scale-[2]' : 'scale-100'
                     }`}
                     style={
                       zoomData.active && zoomData.index === idx 
                         ? { transformOrigin: `${zoomData.x}% ${zoomData.y}%` } 
                         : {}
                     }
                   />
                 </div>
              ))}
            </div>
          </div>

          {/* Right: Details (Sticky) */}
          <div className="w-full lg:w-[58%] lg:sticky lg:top-10">
            <div className="flex flex-col gap-6">
              <div>
                <h1 className="text-[20px] md:text-[24px] font-bold tracking-tight mb-2">Long Sleeve Tie Front Top</h1>
                <div className="text-[20px] md:text-[24px] text-zinc-500 font-medium">$15.00</div>
              </div>

              <p className="text-[14px] leading-relaxed text-zinc-500">
                Go kalles this summer with this vintage navy and white striped v-neck t-shirt from the Nike. 
                Perfect for pairing with denim and white kicks for a stylish kalles vibe.
              </p>

              {/* Quantity and Add to Cart */}
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center border border-zinc-200 rounded-full px-4 h-12 bg-white">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="text-zinc-500 hover:text-zinc-900 p-1"
                  >
                    <Minus size={16} />
                  </button>
                  <input 
                    type="number" 
                    value={quantity} 
                    onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                    className="w-12 text-center font-bold text-[15px] outline-none"
                  />
                  <button 
                    onClick={() => setQuantity(quantity + 1)}
                    className="text-zinc-500 hover:text-zinc-900 p-1"
                  >
                    <Plus size={16} />
                  </button>
                </div>

                <button 
                  onClick={() => addToCart(product, quantity, selectedSize)}
                  className="flex-1 min-w-[200px] h-12 bg-[#67CFDE] hover:bg-[#55B6C4] text-white font-bold uppercase tracking-widest text-[12px] rounded-full transition-all"
                >
                  ADD TO CART
                </button>

                <div className="flex gap-2">
                   <button 
                    onClick={() => toggleWishlist(product)}
                    className={`w-11 h-11 border border-zinc-200 rounded-full flex items-center justify-center transition-all ${isFavorite ? 'bg-zinc-900 text-white border-zinc-900' : 'text-zinc-600 hover:bg-zinc-900 hover:text-white hover:border-zinc-900'}`}
                  >
                    <Heart size={18} fill={isFavorite ? 'currentColor' : 'none'} />
                  </button>
                  <button className="w-11 h-11 border border-zinc-200 rounded-full flex items-center justify-center text-zinc-600 hover:bg-zinc-900 hover:text-white hover:border-zinc-900 transition-all">
                    <ArrowRightLeft size={18} />
                  </button>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="flex items-center gap-4 py-2">
                <img src="https://kalles-5.myshopify.com/cdn/shop/files/trust_img.png?v=1718015360&width=740" alt="Trust" className="h-8 object-contain" />
              </div>

               <div className="flex flex-wrap items-center gap-6 pb-8 border-b border-gray-100 mb-8">
                  <button className="text-[12px] font-bold text-[#222] flex items-center gap-2 hover:text-[#56cfe1] transition-colors uppercase tracking-widest" onClick={() => setActiveModal('size')}>
                     <HelpCircle size={16} /> Size Guide
                  </button>
                  <button className="text-[12px] font-bold text-[#222] flex items-center gap-2 hover:text-[#56cfe1] transition-colors uppercase tracking-widest" onClick={() => setActiveModal('delivery')}>
                     <RefreshCw size={16} /> Delivery & Return
                  </button>
                  <button className="text-[12px] font-bold text-[#222] flex items-center gap-2 hover:text-[#56cfe1] transition-colors uppercase tracking-widest" onClick={() => setActiveModal('ask')}>
                     <HelpCircle size={16} /> Ask a Question
                  </button>
               </div>

              {/* Product Info */}
              <div className="space-y-1 text-[13px] pt-4 border-t border-zinc-50">
                <div><span className="text-zinc-400">Availability:</span> <span className="text-zinc-600">In stock</span></div>
                <div><span className="text-zinc-400">SKU:</span></div>
                <div><span className="text-zinc-400">Categories:</span> <span className="text-zinc-600">All, Dress, Women</span></div>
                <div><span className="text-zinc-400">Tags:</span> <span className="text-zinc-600">Color White, Price $7–$50, Vendor Monki, women</span></div>
              </div>

              {/* Social Sharing */}
              <div className="flex items-center gap-5 py-2">
                <button className="text-zinc-900 hover:text-cyan-500 transition-colors"><Facebook size={18} /></button>
                <button className="text-zinc-900 hover:text-cyan-500 transition-colors"><Twitter size={18} /></button>
                <button className="text-zinc-900 hover:text-cyan-500 transition-colors">
                  <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
                </button>
                <button className="text-zinc-900 hover:text-cyan-500 transition-colors">
                   <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2c.46-1.7.46-5.33.46-5.33s0-3.63-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg>
                </button>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* Product Tabs Section */}
      <div className="w-full border-t border-zinc-100 py-16 mt-10">
        <div className="max-w-[1200px] mx-auto px-6">
          {/* Tab Headers */}
          <div className="flex flex-wrap items-center justify-center gap-4 md:gap-12 mb-12">
            {['Description', 'Custom tab'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`text-[14px] md:text-[16px] font-bold transition-all px-8 py-2.5 rounded-full border 
                  ${activeTab === tab 
                    ? 'border-zinc-900 text-zinc-900 bg-white' 
                    : 'border-white text-zinc-400 hover:text-zinc-900'}`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="max-w-[1000px] mx-auto">
            {activeTab === 'Description' && (
              <div className="animate-fade-in space-y-12">
                <p className="text-[14px] text-zinc-500 leading-relaxed text-center max-w-[800px] mx-auto">
                  Design inspiration lorem ipsum dolor sit amet, consectetuer adipiscing elit. Morbi commodo, ipsum sed pharetra gravida, orci magna rhoncus neque, id pulvinar odio lorem num turpis. sit amet enim. Suspendisse id velit vitae ligula volutpat condimentum. Aliquam erat volutpat. Sed quis velit. Nulla facilisi. Nulla libero. Vivamus pharetra posuere sapien. Nam consectetuer. Sed aliquam, nunc eget euismod ullamcorper, lectus nunc ullamcorper orci.
                </p>
                
                <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-4 px-4">
                  {/* Left Features */}
                  <div className="flex flex-col gap-12 text-right w-full md:w-1/3 order-2 md:order-1">
                    <div className="flex items-center justify-end gap-4 group cursor-pointer">
                      <div>
                        <h4 className="text-[13px] font-bold text-zinc-800 uppercase tracking-wider mb-1">Rain & Water</h4>
                        <p className="text-[12px] text-zinc-500">Resistant</p>
                      </div>
                      <div className="w-12 h-12 flex-shrink-0 bg-white shadow-sm border border-zinc-100 rounded-sm flex items-center justify-center group-hover:bg-zinc-900 group-hover:text-white transition-all">
                        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" /></svg>
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-4 group cursor-pointer">
                      <div>
                        <h4 className="text-[13px] font-bold text-zinc-800 uppercase tracking-wider mb-1">UV Resistant</h4>
                        <p className="text-[12px] text-zinc-500">Coatings</p>
                      </div>
                      <div className="w-12 h-12 flex-shrink-0 bg-white shadow-sm border border-zinc-100 rounded-sm flex items-center justify-center group-hover:bg-zinc-900 group-hover:text-white transition-all">
                        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-4 group cursor-pointer">
                      <div>
                        <h4 className="text-[13px] font-bold text-zinc-800 uppercase tracking-wider mb-1">Corrosion Resistance</h4>
                        <p className="text-[12px] text-zinc-500">to Sea water</p>
                      </div>
                      <div className="w-12 h-12 flex-shrink-0 bg-white shadow-sm border border-zinc-100 rounded-sm flex items-center justify-center group-hover:bg-zinc-900 group-hover:text-white transition-all">
                         <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M2 6c.6.5 1.2 1 2.5 1C5.8 7 7 6 7 6s1.2-1 2.5-1c1.3 0 2.5 1 2.5 1s1.2 1 2.5 1c1.3 0 2.5-1 2.5-1s1.2-1 2.5-1c1.3 0 2.5 1 2.5 1M2 12c.6.5 1.2 1 2.5 1 1.3 0 2.5-1 2.5-1s1.2-1 2.5-1c1.3 0 2.5 1 2.5 1s1.2 1 2.5 1c1.3 0 2.5-1 2.5-1s1.2-1 2.5-1c1.3 0 2.5 1 2.5 1M2 18c.6.5 1.2 1 2.5 1 1.3 0 2.5-1 2.5-1s1.2-1 2.5-1c1.3 0 2.5 1 2.5 1s1.2 1 2.5 1c1.3 0 2.5-1 2.5-1s1.2-1 2.5-1c1.3 0 2.5 1 2.5 1"/></svg>
                      </div>
                    </div>
                  </div>

                  {/* Center Image */}
                  <div className="w-full md:w-1/3 flex justify-center order-1 md:order-2">
                    <img 
                      src="https://cdn.shopify.com/s/files/1/0616/9480/4174/files/athun_480x480.png?v=1652176156" 
                      alt="Product Detail" 
                      className="max-w-full h-auto object-contain"
                    />
                  </div>

                  {/* Right Features */}
                  <div className="flex flex-col gap-12 text-left w-full md:w-1/3 order-3">
                    <div className="flex items-center gap-4 group cursor-pointer">
                      <div className="w-12 h-12 flex-shrink-0 bg-white shadow-sm border border-zinc-100 rounded-sm flex items-center justify-center group-hover:bg-zinc-900 group-hover:text-white transition-all">
                        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" /></svg>
                      </div>
                      <div>
                        <h4 className="text-[13px] font-bold text-zinc-800 uppercase tracking-wider mb-1">Lead-free</h4>
                        <p className="text-[12px] text-zinc-500">Powdercoat Finish</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 group cursor-pointer">
                      <div className="w-12 h-12 flex-shrink-0 bg-white shadow-sm border border-zinc-100 rounded-sm flex items-center justify-center group-hover:bg-zinc-900 group-hover:text-white transition-all">
                         <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M11 2a2 2 0 0 0-2 2v5H4a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h5v5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2v-5h5a2 2 0 0 0 2-2v-2a2 2 0 0 0-2-2h-5V4a2 2 0 0 0-2-2h-2z"/></svg>
                      </div>
                      <div>
                        <h4 className="text-[13px] font-bold text-zinc-800 uppercase tracking-wider mb-1">Resistant to</h4>
                        <p className="text-[12px] text-zinc-500">Spills</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 group cursor-pointer">
                      <div className="w-12 h-12 flex-shrink-0 bg-white shadow-sm border border-zinc-100 rounded-sm flex items-center justify-center group-hover:bg-zinc-900 group-hover:text-white transition-all">
                        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 12h18M3 6h18M3 18h18" /></svg>
                      </div>
                      <div>
                        <h4 className="text-[13px] font-bold text-zinc-800 uppercase tracking-wider mb-1">Recyclable</h4>
                        <p className="text-[12px] text-zinc-500">Aluminium Frame</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'Custom tab' && (
              <div className="animate-fade-in flex flex-col items-center text-center">
                <div className="flex flex-wrap justify-center gap-6 mb-8 text-zinc-900">
                  {/* Icons from screenshots */}
                  <div className="w-9 h-9 border border-zinc-900 flex items-center justify-center text-[10px] font-bold">30°</div>
                  <div className="w-9 h-9 border border-zinc-900 flex items-center justify-center p-1.5"><svg viewBox="0 0 40 40" className="w-full h-full"><path fill="currentColor" d="M36.7 31.1l-2.8-1.3-4.7-9.1 7.5-3.5c.4-.2.6-.6.4-1s-.6-.5-1-.4l-7.5 3.5-7.8-15c-.3-.5-1.1-.5-1.4 0l-7.8 15L4 15.9c-.4-.2-.8 0-1 .4s0 .8.4 1l7.5 3.5-4.7 9.1-2.8 1.3c-.4.2-.6.6-.4 1 .1.3.4.4.7.4.1 0 .2 0 .3-.1l1-.4-1.5 2.8c-.1.2-.1.5 0 .8.1.2.4.3.7.3h31.7c.3 0 .5-.1.7-.4.1-.2.1-.5 0-.8L35.1 32l1 .4c.1 0 .2.1.3.1.3 0 .6-.2.7-.4.1-.3 0-.8-.4-1zm-5.1-2.3l-9.8-4.6 6-2.8 3.8 7.4zM20 6.4L27.1 20 20 23.3 12.9 20 20 6.4zm-7.8 15l6 2.8-9.8 4.6 3.8-7.4zm22.4 13.1H5.4L7.2 31 20 25l12.8 6 1.8 3.5z"></path></svg></div>
                  <div className="w-9 h-9 border border-zinc-900 flex items-center justify-center p-1.5"><svg viewBox="0 0 40 40" className="w-full h-full"><path fill="currentColor" d="M5.9 5.9v28.2h28.2V5.9H5.9zM19.1 20l-8.3 8.3c-2-2.2-3.2-5.1-3.2-8.3s1.2-6.1 3.2-8.3l8.3 8.3zm-7.4-9.3c2.2-2 5.1-3.2 8.3-3.2s6.1 1.2 8.3 3.2L20 19.1l-8.3-8.4zM20 20.9l8.3 8.3c-2.2 2-5.1 3.2-8.3 3.2s-6.1-1.2-8.3-3.2l8.3-8.3zm.9-.9l8.3-8.3c2 2.2 3.2 5.1 3.2 8.3s-1.2 6.1-3.2 8.3L20.9 20zm8.4-10.2c-1.2-1.1-2.6-2-4.1-2.6h6.6l-2.5 2.6zm-18.6 0L8.2 7.2h6.6c-1.5.6-2.9 1.5-4.1 2.6zm-.9.9c-1.1 1.2-2 2.6-2.6 4.1V8.2l2.6 2.5zM7.2 25.2c.6 1.5 1.5 2.9 2.6 4.1l-2.6 2.6v-6.7zm3.5 5c1.2 1.1 2.6 2 4.1 2.6H8.2l2.5-2.6zm18.6 0l2.6 2.6h-6.6c1.4-.6 2.8-1.5 4-2.6zm.9-.9c1.1-1.2 2-2.6 2.6-4.1v6.6l-2.6-2.5zm2.6-14.5c-.6-1.5-1.5-2.9-2.6-4.1l2.6-2.6v6.7z"></path></svg></div>
                  <div className="w-9 h-9 border border-zinc-900 flex items-center justify-center p-1.5"><svg viewBox="0 0 40 40" className="w-full h-full"><path fill="currentColor" d="M35.1 33.6L33.2 6.2c0-.4-.3-.7-.7-.7H13.9c-.4 0-.7.3-.7.7s.3.7.7.7h18l.7 10.5H20.8c-8.8.2-15.9 7.5-15.9 16.4 0 .4.3.7.7.7h28.9c.2 0 .4-.1.5-.2s.2-.3.2-.5v-.2h-.1zm-28.8-.5C6.7 25.3 13 19 20.8 18.9h11.9l1 14.2H6.3zm11.2-6.8c0 1.2-1 2.1-2.1 2.1s-2.1-1-2.1-2.1 1-2.1 2.1-2.1 2.1 1 2.1 2.1zm6.3 0c0 1.2-1 2.1-2.1 2.1-1.2 0-2.1-1-2.1-2.1s1-2.1 2.1-2.1 2.1 1 2.1 2.1z"></path></svg></div>
                  <div className="w-9 h-9 border border-zinc-900 flex items-center justify-center p-1.5"><svg viewBox="0 0 40 40" className="w-full h-full"><path fill="currentColor" d="M20 33.8c7.6 0 13.8-6.2 13.8-13.8S27.6 6.2 20 6.2 6.2 12.4 6.2 20 12.4 33.8 20 33.8zm0-26.3c6.9 0 12.5 5.6 12.5 12.5S26.9 32.5 20 32.5 7.5 26.9 7.5 20 13.1 7.5 20 7.5zm-.4 15h.5c1.8 0 3-1.1 3-3.7 0-2.2-1.1-3.6-3.1-3.6h-2.6v10.6h2.2v-3.3zm0-5.2h.4c.6 0 .9.5.9 1.7 0 1.1-.3 1.7-.9 1.7h-.4v-3.4z"></path></svg></div>
                  <div className="w-9 h-9 border border-zinc-900 flex items-center justify-center p-1.5"><svg viewBox="0 0 40 40" className="w-full h-full"><path fill="currentColor" d="M30.2 29.3c2.2-2.5 3.6-5.7 3.6-9.3s-1.4-6.8-3.6-9.3l3.6-3.6c.3-.3.3-.7 0-.9-.3-.3-.7-.3-.9 0l-3.6 3.6c-2.5-2.2-5.7-3.6-9.3-3.6s-6.8 1.4-9.3 3.6L7.1 6.2c-.3-.3-.7-.3-.9 0-.3.3-.3.7 0 .9l3.6 3.6c-2.2 2.5-3.6 5.7-3.6 9.3s1.4 6.8 3.6 9.3l-3.6 3.6c-.3.3-.3.7 0 .9.1.1.3.2.5.2s.3-.1.5-.2l3.6-3.6c2.5 2.2 5.7 3.6 9.3 3.6s6.8-1.4 9.3-3.6l3.6 3.6c.1.1.3.2.5.2s.3-.1.5-.2c.3-.3.3-.7 0-.9l-3.8-3.6z"></path></svg></div>
                  <div className="w-9 h-9 border border-zinc-900 flex items-center justify-center p-2"><div className="w-full h-full border-r border-zinc-900"></div></div>
                </div>
                <p className="text-zinc-500 text-[14px]">
                  LT01: 70% wool, 15% polyester, 10% polyamide, 5% acrylic 900 Grms/mt
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* You May Also Like Section */}
      <div className="max-w-[1200px] mx-auto px-6 py-20 border-t border-zinc-100">
        <h2 className="text-[24px] md:text-[28px] font-bold text-center mb-12">You may also like</h2>
        
        <div className="relative group/slider">
          <div ref={sliderRef} className="flex gap-6 overflow-x-auto scroll-smooth no-scrollbar scroll-snap-x mandatory py-4">
            {[
              { id: 1, name: 'Ridley High Waist', price: 36.00, image1: 'https://kalles-5.myshopify.com/cdn/shop/files/acndb3127517966_q1_2-0_1a1dac3d-a619-462e-8846-e28f9706d326.jpg?v=1751276039&width=940', discount_percent: 33, size: 'S, M, L, XL' },
              { id: 2, name: 'Creamy White Tee', price: 25.00, image1: 'https://kalles-5.myshopify.com/cdn/shop/files/cinqa31079186d2_q1_2-0_8236c050-0b73-45e4-a750-7ba93e1b269d.jpg?v=1717404520&width=940', size: 'XS, S, M' },
              { id: 3, name: 'Classic Denim', price: 45.00, image1: 'https://kalles-5.myshopify.com/cdn/shop/files/citiz41130172ef_m1_2-0_4ab86cba-d4f7-485d-9980-7b4e6287f7bc.jpg?v=1717404493&width=940', discount_percent: 15, size: 'S, M, L' },
              { id: 4, name: 'Summer Shorts', price: 30.00, image1: 'https://kalles-5.myshopify.com/cdn/shop/files/p24-11_ec0dcf2b-dcc4-48cf-8b3e-71c6945984db.jpg?v=1717404614&width=720', size: 'S, M, L' },
              { id: 5, name: 'Pink Floral Dress', price: 55.00, originalPrice: 75.00, image1: 'https://kalles-5.myshopify.com/cdn/shop/files/pr16-1_c56afae4-f846-449d-a609-3e6ab9fa8986.jpg?v=1717404558&width=720', discount_percent: 25, size: 'S, M, L, XL' },
              { id: 6, name: 'Casual Cotton Shirt', price: 40.00, image1: 'https://kalles-5.myshopify.com/cdn/shop/files/slife305151578f_q1_2-0_bd6de06f-5e8e-4689-a080-1710df083bea.jpg?v=1717404581&width=940', size: 'XS, S, M' },
              { id: 7, name: 'Leather White Trainers', price: 20.00, image1: 'https://kalles-5.myshopify.com/cdn/shop/files/product-46.jpg?v=1717402725&width=720', size: '7, 8, 9, 10' },
              { id: 8, name: 'Short Sleeved Hoodie', price: 30.00, image1: 'https://kalles-5.myshopify.com/cdn/shop/files/69957116_041_d.jpg?v=1747129694&width=940', size: 'S, M, L' },
              { id: 9, name: 'Sport Sneaker', price: 35.00, image1: 'https://kalles-5.myshopify.com/cdn/shop/files/ezgif.com-webp-to-jpg_e77ecbaa-4aa5-41_b7-ba2f-f057f4ae6aa7.jpg?v=1717403734&width=720', size: '7, 8, 9, 10' },
              { id: 10, name: 'Analogue Resin Strap', price: 30.00, image1: 'https://kalles-5.myshopify.com/cdn/shop/files/product-46.jpg?v=1717402725&width=720', size: 'One Size' },
            ].map((p, index) => (
                <div key={index} className="flex-none w-[calc(50%-12px)] md:w-[calc(25%-18px)] scroll-snap-align-start">
                  <ProductCard product={p} />
                </div>
            ))}
          </div>

          <button 
            onClick={() => scrollSlider('prev')}
            className="absolute left-[-20px] top-[40%] -translate-y-1/2 w-10 h-10 rounded-full bg-white shadow-xl border border-zinc-100 flex items-center justify-center text-zinc-800 opacity-0 group-hover/slider:opacity-100 transition-all hover:bg-cyan-400 hover:text-white z-10"
          >
            <ChevronLeft size={20} />
          </button>
          <button 
            onClick={() => scrollSlider('next')}
            className="absolute right-[-20px] top-[40%] -translate-y-1/2 w-10 h-10 rounded-full bg-white shadow-xl border border-zinc-100 flex items-center justify-center text-zinc-800 opacity-0 group-hover/slider:opacity-100 transition-all hover:bg-cyan-400 hover:text-white z-10"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <ProductInfoModal activeModal={activeModal} setActiveModal={setActiveModal} product={{
        name: "Long Sleeve Tie Front Top",
        price: "15.00",
        image1: productImages[0]
      }} />
    </div>
  );
};

export default ProductMedia2column;
