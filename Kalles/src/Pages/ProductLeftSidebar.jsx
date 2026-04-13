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
  Truck,
  Headphones,
  RotateCcw,
  Clock,
  HelpCircle,
  RefreshCw
} from 'lucide-react';
import ProductInfoModal from '../Components/ProductInfoModal';
import { useCart } from '../Context/CartContext';
import { useWishlist } from '../Context/WishlistContext';

const ProductLeftSidebar = () => {
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('S');
  const [selectedColor, setSelectedColor] = useState('Pink');
  const [activeTab, setActiveTab] = useState('Description');
  const [activeModal, setActiveModal] = useState(null);
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const productImages = [
    'https://kalles-5.myshopify.com/cdn/shop/files/skinn3060927901_q1_2-0.jpg?v=1717404430&width=1100',
    'https://kalles-5.myshopify.com/cdn/shop/files/skinn3060927901_q4_2-0.jpg?v=1717404430&width=1100',
    'https://kalles-5.myshopify.com/cdn/shop/files/skinn3060927901_q5_2-0.jpg?v=1717404430&width=493'
  ];

  const product = {
    id: 'skin-sweatpans-static',
    name: "Skin Sweatpans",
    price: 45.00,
    image1: productImages[0],
    image2: productImages[1]
  };

  const isFavorite = isInWishlist(product.id);

  const instagramImages = [
    'https://kalles-5.myshopify.com/cdn/shop/files/ins1_2022-03-02.jpg?v=1717463752&width=300',
    'https://kalles-5.myshopify.com/cdn/shop/files/ins2_2022-03-02.jpg?v=1717463752&width=300',
    'https://kalles-5.myshopify.com/cdn/shop/files/ins3_2022-03-02.jpg?v=1717463752&width=300',
    'https://kalles-5.myshopify.com/cdn/shop/files/ins4_2022-03-02.jpg?v=1717463752&width=300',
    'https://kalles-5.myshopify.com/cdn/shop/files/ins5_2022-03-02.jpg?v=1717463753&width=300',
    'https://kalles-5.myshopify.com/cdn/shop/files/ins6_2022-03-02.jpg?v=1717463752&width=300',
    'https://kalles-5.myshopify.com/cdn/shop/files/ins7_2022-03-02.jpg?v=1717463752&width=300',
    'https://kalles-5.myshopify.com/cdn/shop/files/ins8_2022-03-02.jpg?v=1717463752&width=300',
    'https://kalles-5.myshopify.com/cdn/shop/files/bg-pin-02.jpg?v=1745574764&width=500'
    
  ];

  const [activeIndex, setActiveIndex] = useState(0);
  const sliderRef = React.useRef(null);
  const [zoomData, setZoomData] = useState({ active: false, x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomData({ 
      active: true, 
      x: Math.max(0, Math.min(100, x)), 
      y: Math.max(0, Math.min(100, y)) 
    });
  };

  const handleMouseLeave = () => {
    setZoomData({ active: false, x: 0, y: 0 });
  };

  const nextImage = () => {
    setActiveIndex((prev) => (prev === productImages.length - 1 ? 0 : prev + 1));
  };

  const prevImage = () => {
    setActiveIndex((prev) => (prev === 0 ? productImages.length - 1 : prev - 1));
  };

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
          <nav className="flex items-center gap-2 text-[14px] text-zinc-500 font-medium">
            <span className="hover:text-zinc-900 cursor-pointer">Home</span>
            <ChevronRight size={14} strokeWidth={3} />
            <span className="text-zinc-900 font-semibold italic">Skin Sweatpans</span>
          </nav>
          <div className="flex items-center gap-4 text-zinc-400">
            <button className="hover:text-zinc-900 transition-colors"><ChevronLeft size={20} /></button>
            <button className="hover:text-zinc-900 transition-colors"><LayoutGrid size={18} /></button>
            <button className="hover:text-zinc-900 transition-colors"><ChevronRight size={20} /></button>
          </div>
        </div>
      </div>

      {/* Main Content Layout with Sidebar */}
      <div className="max-w-[1400px] mx-auto px-6 py-10">
        <div className="flex flex-col lg:flex-row gap-12 items-start">

          
          {/* LEFT SIDEBAR SECTION */}
          <aside className="w-full lg:w-[280px] order-2 lg:order-1 space-y-12">
            
            {/* Shipping & Delivery Info */}
            <div className="space-y-8">
              <h3 className="text-[20px] font-bold border-b-2 border-zinc-900 inline-block pb-1 mb-4 italic">Shipping & Delivery</h3>
              
              <div className="flex items-start gap-4 group cursor-default">
                  <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center text-zinc-900">
                    <Truck size={36} strokeWidth={1} />
                  </div>
                  <div>
                    <h4 className="text-[13px] font-black uppercase tracking-widest mb-1 text-zinc-900">Free Shipping</h4>
                    <p className="text-[14px] text-zinc-500 italic">Free shipping for all US orders</p>
                  </div>
              </div>

              <div className="flex items-start gap-4 group cursor-default">
                  <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center text-zinc-900">
                    <Headphones size={36} strokeWidth={1} />
                  </div>
                  <div>
                    <h4 className="text-[13px] font-black uppercase tracking-widest mb-1 text-zinc-900">Support 24/7</h4>
                    <p className="text-[14px] text-zinc-500 italic">We support 24 hours a day</p>
                  </div>
              </div>

              <div className="flex items-start gap-4 group cursor-default">
                  <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center text-zinc-900">
                    <RotateCcw size={36} strokeWidth={1} />
                  </div>
                  <div>
                    <h4 className="text-[13px] font-black uppercase tracking-widest mb-1 text-zinc-900">30 Days Return</h4>
                    <p className="text-[14px] text-zinc-500 italic">You have 30 days to return</p>
                  </div>
              </div>
            </div>

            {/* Instagram Section */}
            <div className="space-y-6">
              <h3 className="text-[20px] font-bold border-b-2 border-zinc-900 inline-block pb-1 mb-2 italic text-zinc-900">Instagram</h3>
              <div className="grid grid-cols-3 gap-1">
                {instagramImages.map((img, idx) => (
                  <div 
                    key={idx} 
                    className="aspect-square overflow-hidden relative group cursor-pointer animate-rotate-in-manual"
                    style={{ animationDelay: `${idx * 0.1}s` }}
                  >
                     <img src={img} alt={`instagram-${idx}`} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  </div>
                ))}
              </div>
            </div>
          </aside>

          {/* RIGHT MAIN CONTENT SECTION */}
          <div className="flex-1 w-full order-1 lg:order-2 grid grid-cols-1 md:grid-cols-[350px_1fr] lg:grid-cols-[400px_1fr] gap-12 items-start">


            
            {/* main gallery */}
            <div 
              className="sticky top-24 overflow-hidden group relative bg-zinc-50 cursor-crosshair h-fit self-start border border-zinc-100"

              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
            >
                <img 
                  key={activeIndex}
                  src={productImages[activeIndex]} 
                  alt="Product" 
                  className="w-full h-auto object-cover animate-fade-in"
                />
                
                {/* Zoom Lens */}
                {zoomData.active && (
                  <div 
                    className="absolute border border-zinc-400 bg-white/10 pointer-events-none"
                    style={{
                      width: '180px',
                      height: '240px',
                      left: `calc(${zoomData.x}% - 90px)`,
                      top: `calc(${zoomData.y}% - 120px)`,
                      boxShadow: '0 0 0 1000px rgba(0,0,0,0.05)'
                    }}
                  />
                )}

                {/* Navigation Buttons */}
                <button 
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white text-zinc-900 flex items-center justify-center shadow-lg transition-all hover:bg-cyan-400 hover:text-white hover:scale-110 sm:opacity-0 group-hover:opacity-100 z-10"
                >
                  <ChevronLeft size={24} />
                </button>
                <button 
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white text-zinc-900 flex items-center justify-center shadow-lg transition-all hover:bg-cyan-400 hover:text-white hover:scale-110 sm:opacity-0 group-hover:opacity-100 z-10"
                >
                  <ChevronRight size={24} />
                </button>
            </div>

            {/* Product Details Section */}
            <div className="flex flex-col gap-6 relative">
              {/* Detailed Zoom Window Portal */}
              {zoomData.active && (
                <div 
                  className="absolute top-0 left-0 w-full h-[550px] z-50 bg-white border border-zinc-200 overflow-hidden hidden lg:block shadow-2xl"
                  style={{
                    backgroundImage: `url(${productImages[activeIndex]})`,
                    backgroundPosition: `${zoomData.x}% ${zoomData.y}%`,
                    backgroundSize: '250%', 
                    backgroundRepeat: 'no-repeat'
                  }}
                />
              )}
              <div>
                <h1 className="text-[28px] md:text-[36px] font-bold tracking-tight mb-2 text-zinc-900 italic">Skin Sweatpans</h1>
                <div className="flex items-center gap-3">
                  <span className="text-[20px] md:text-[24px] text-zinc-400 line-through">$75.00</span>
                  <span className="text-[24px] md:text-[28px] text-[#f15412] font-black">$45.00</span>
                </div>
              </div>

              <p className="text-[15px] leading-relaxed text-zinc-600 font-medium">
                Go kalles this summer with this vintage navy and white striped v-neck t-shirt from the Nike. 
                Perfect for pairing with denim and white kicks for a stylish kalles vibe.
              </p>

              {/* Countdown Sale Timer */}
              <div className="bg-[#fdf9f9] border border-[#fdeeee] rounded-md p-6 py-4 flex flex-col items-center gap-4">
                 <div className="flex items-center gap-2 text-zinc-900 font-bold italic">
                   <Clock size={18} className="text-[#f15412]" />
                   <span className="text-[16px] tracking-tight">Hurry up! Sale Ends in</span>
                 </div>
                 <div className="flex gap-8 text-center">
                    <div className="flex flex-col">
                       <span className="text-[28px] font-black text-zinc-900 leading-none">99</span>
                       <span className="text-[11px] text-zinc-500 font-bold uppercase tracking-widest mt-2">Days</span>
                    </div>
                    <div className="flex flex-col">
                       <span className="text-[28px] font-black text-zinc-900 leading-none">15</span>
                       <span className="text-[11px] text-zinc-500 font-bold uppercase tracking-widest mt-2">hours</span>
                    </div>
                    <div className="flex flex-col">
                       <span className="text-[28px] font-black text-zinc-900 leading-none">57</span>
                       <span className="text-[11px] text-zinc-500 font-bold uppercase tracking-widest mt-2">minutes</span>
                    </div>
                    <div className="flex flex-col">
                       <span className="text-[28px] font-black text-zinc-900 leading-none">18</span>
                       <span className="text-[11px] text-zinc-500 font-bold uppercase tracking-widest mt-2">seconds</span>
                    </div>
                 </div>
              </div>

              {/* Color Selector */}
              <div className="space-y-3">
                <div className="text-[13px] font-black uppercase tracking-widest text-zinc-900 italic">
                  COLOR: <span className="font-bold text-zinc-500 ml-1 uppercase">{selectedColor}</span>
                </div>
                <div className="flex gap-3">
                   <button 
                    onClick={() => setSelectedColor('Pink')}
                    className={`w-8 h-8 rounded-full border-2 p-0.5 transition-all ${selectedColor === 'Pink' ? 'border-zinc-900' : 'border-transparent'}`}
                   >
                     <div className="w-full h-full rounded-full bg-[#f9c6cf] shadow-inner"></div>
                   </button>
                   <button 
                    onClick={() => setSelectedColor('Grey/White')}
                    className={`w-8 h-8 rounded-full border-2 p-0.5 transition-all ${selectedColor === 'Grey/White' ? 'border-zinc-900' : 'border-transparent'}`}
                   >
                     <div className="w-full h-full rounded-full bg-[#e5e5e5] shadow-inner"></div>
                   </button>
                </div>
              </div>

              {/* Size Selector */}
              <div className="space-y-3">
                <div className="text-[13px] font-black uppercase tracking-widest text-zinc-900 italic">
                  SIZE: <span className="font-bold text-zinc-500 ml-1">{selectedSize}</span>
                </div>
                <div className="flex gap-2">
                  {['S', 'M'].map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`w-10 h-10 rounded-full border text-[13px] font-black transition-all flex items-center justify-center
                        ${selectedSize === size 
                          ? 'bg-zinc-900 border-zinc-900 text-white' 
                          : 'border-zinc-200 text-zinc-700 hover:border-zinc-900'}`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity and Add to Cart */}
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center border-2 border-zinc-100 rounded-full px-4 h-11 bg-white">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="text-zinc-500 hover:text-zinc-900 p-1"
                  >
                    <Minus size={16} strokeWidth={2.5} />
                  </button>
                  <input 
                    type="number" 
                    value={quantity} 
                    onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                    className="w-10 text-center font-black text-[15px] outline-none"
                  />
                  <button 
                    onClick={() => setQuantity(quantity + 1)}
                    className="text-zinc-500 hover:text-zinc-900 p-1"
                  >
                    <Plus size={16} strokeWidth={2.5} />
                  </button>
                </div>

                <button 
                  onClick={() => addToCart(product, quantity, selectedSize)}
                  className="flex-1 min-w-[200px] h-11 bg-[#67cfde] hover:bg-zinc-900 text-white font-black uppercase tracking-widest text-[13px] rounded-full transition-all shadow-xl shadow-cyan-100/50"
                >
                  ADD TO CART
                </button>

                <div className="flex gap-2">
                  <button 
                    onClick={() => toggleWishlist(product)}
                    className={`w-11 h-11 border-2 border-zinc-100 rounded-full flex items-center justify-center transition-all group ${isFavorite ? 'bg-[#67cfde] text-white border-[#67cfde]' : 'text-zinc-600 hover:bg-[#67cfde] hover:text-white hover:border-[#67cfde]'}`}
                  >
                    <Heart size={18} fill={isFavorite ? 'currentColor' : 'none'} />
                  </button>
                  <button className="w-11 h-11 border-2 border-zinc-100 rounded-full flex items-center justify-center text-zinc-600 hover:bg-[#67cfde] hover:text-white hover:border-[#67cfde] transition-all group">
                    <ArrowRightLeft size={18} />
                  </button>
                </div>
              </div>

              {/* Security/Trust Icons */}
              <div className="py-4 border-b border-zinc-100">
                <img 
                  src="https://kalles-5.myshopify.com/cdn/shop/files/trust_img.png?v=1718015360&width=740" 
                  alt="Security Badges" 
                  className="max-w-full h-auto opacity-80 hover:opacity-100 transition-opacity"
                />
              </div>

              {/* Extra Info Links */}
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
                 
                 <div className="space-y-3 text-[14px]">
                    <div><span className="font-bold text-zinc-800 italic">Availability:</span> <span className="text-zinc-500 italic ml-2 font-medium">In stock</span></div>
                    <div><span className="font-bold text-zinc-800 italic">SKU:</span> <span className="text-zinc-400 ml-2 font-medium">N/A</span></div>
                    <div><span className="font-bold text-zinc-800 italic">Categories:</span> <span className="text-zinc-500 ml-2 font-medium underline underline-offset-4 decoration-zinc-200">All, Dress, Fashion 2</span></div>
                    <div className="flex items-start gap-1">
                      <span className="font-bold text-zinc-800 italic flex-shrink-0">Tags:</span> 
                      <span className="text-zinc-500 font-medium ml-2 italic leading-6">Color Cyan, Color Pink, Price $7–$50, Size M, Size S, Vendor Kalles, women</span>
                    </div>
                 </div>

              {/* Social Sharing */}
              <div className="flex items-center gap-4 py-4 pt-0">
                {[
                  { icon: <Facebook size={16} fill="currentColor" /> },
                  { icon: <Twitter size={16} fill="currentColor" /> },
                  { icon: <Share2 size={16} /> },
                  { icon: <Instagram size={16} /> },
                  { icon: <Mail size={16} /> }
                ].map((social, idx) => (
                  <button key={idx} className="text-zinc-400 hover:text-zinc-900 transition-colors">
                    {social.icon}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Product Tabs Section */}
      <div className="w-full bg-[#f6f6f6] py-16 mt-10">
        <div className="max-w-[1200px] mx-auto px-6">
          {/* Tab Headers */}
          <div className="flex flex-wrap items-center justify-center gap-4 md:gap-12 mb-10 border-b border-zinc-200/50 pb-4">
            {['Description', 'Additional Information', 'Custom tab'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`text-[14px] md:text-[16px] font-bold transition-all px-6 py-2 rounded-full border-2 
                  ${activeTab === tab 
                    ? 'bg-white border-zinc-900 text-zinc-900 shadow-sm' 
                    : 'border-transparent text-zinc-500 hover:text-zinc-900'}`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="max-w-[1000px] mx-auto animate-fade-in">
            {activeTab === 'Description' && (
              <div className="animate-fade-in space-y-12">
                <p className="text-[14px] text-zinc-500 leading-relaxed text-center max-w-[800px] mx-auto">
                  Design inspiration lorem ipsum dolor sit amet, consectetuer adipiscing elit. Morbi commodo, ipsum sed pharetra gravida, orci magna rhoncus neque, id pulvinar odio lorem num turpis. sit amet enim. Suspendisse id velit vitae ligula volutpat condimentum. Aliquam erat volutpat. Sed quis velit. Nulla facilisi. Nulla libero. Vivamus pharetra posuere sapien. Nam consectetuer. Sed aliquam, nunc eget euismod ullamcorper, lectus nunc ullamcorper orci.
                </p>
                
                <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-4 px-4 overflow-hidden">
                  {/* Left Features */}
                  <div className="flex flex-col gap-12 text-left md:text-right w-full md:w-1/3 order-2 md:order-1">
                    <div className="flex items-center md:flex-row-reverse justify-start md:justify-end gap-4 group cursor-pointer">
                      <div className="w-12 h-12 flex-shrink-0 bg-white shadow-sm border border-zinc-100 rounded-sm flex items-center justify-center group-hover:bg-zinc-900 group-hover:text-white transition-all">
                        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" /></svg>
                      </div>
                      <div>
                        <h4 className="text-[13px] font-bold text-zinc-800 uppercase tracking-wider mb-1">Rain & Water</h4>
                        <p className="text-[12px] text-zinc-500">Resistant</p>
                      </div>
                    </div>

                    <div className="flex items-center md:flex-row-reverse justify-start md:justify-end gap-4 group cursor-pointer">
                      <div className="w-12 h-12 flex-shrink-0 bg-white shadow-sm border border-zinc-100 rounded-sm flex items-center justify-center group-hover:bg-zinc-900 group-hover:text-white transition-all">
                        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>
                      </div>
                      <div>
                        <h4 className="text-[13px] font-bold text-zinc-800 uppercase tracking-wider mb-1">UV Resistant</h4>
                        <p className="text-[12px] text-zinc-500">Coatings</p>
                      </div>
                    </div>

                    <div className="flex items-center md:flex-row-reverse justify-start md:justify-end gap-4 group cursor-pointer">
                      <div className="w-12 h-12 flex-shrink-0 bg-white shadow-sm border border-zinc-100 rounded-sm flex items-center justify-center group-hover:bg-zinc-900 group-hover:text-white transition-all">
                         <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M2 6c.6.5 1.2 1 2.5 1C5.8 7 7 6 7 6s1.2-1 2.5-1c1.3 0 2.5 1 2.5 1s1.2-1 2.5 1c1.3 0 2.5-1 2.5-1s1.2-1 2.5-1c1.3 0 2.5 1 2.5 1M2 12c.6.5 1.2 1 2.5 1 1.3 0 2.5-1 2.5-1s1.2-1 2.5-1c1.3 0 2.5 1 2.5 1s1.2 1 2.5 1c1.3 0 2.5-1 2.5-1s1.2-1 2.5-1c1.3 0 2.5 1 2.5 1M2 18c.6.5 1.2 1 2.5 1 1.3 0 2.5-1 2.5-1s1.2-1 2.5-1c1.3 0 2.5 1 2.5 1s1.2 1 2.5 1c1.3 0 2.5-1 2.5-1s1.2-1 2.5-1c1.3 0 2.5 1 2.5 1"/></svg>
                      </div>
                      <div>
                        <h4 className="text-[13px] font-bold text-zinc-800 uppercase tracking-wider mb-1">Corrosion Resistance</h4>
                        <p className="text-[12px] text-zinc-500">to Sea water</p>
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
            {activeTab === 'Additional Information' && (
              <div className="animate-fade-in">
                <div className="border border-zinc-100 rounded-sm overflow-hidden bg-white">
                  <table className="w-full border-collapse">
                    <tbody>
                      <tr className="border-b border-zinc-100 last:border-0">
                        <th className="w-[200px] md:w-[350px] bg-[#fdfdfd] text-left p-4 font-black text-zinc-900 border-r border-zinc-100 uppercase tracking-widest text-[12px]">Size</th>
                        <td className="p-4 text-zinc-500 text-[14px] font-medium italic">S, M, L</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            {activeTab === 'Custom tab' && (
              <div className="animate-fade-in flex flex-col items-center text-center">
                <div className="flex flex-wrap justify-center gap-6 mb-8 text-zinc-400">
                  {/* Wash 30° */}
                  <div className="w-10 h-10">
                    <svg viewBox="0 0 40 40" className="w-full h-full"><path fill="currentColor" d="M8.7 30.7h22.7c.3 0 .6-.2.7-.6l4-25.3c-.1-.4-.3-.7-.7-.8s-.7.2-.8.6L34 8.9l-3-1.1c-2.4-.9-5.1-.5-7.2 1-2.3 1.6-5.3 1.6-7.6 0-2.1-1.5-4.8-1.9-7.2-1L6 8.9l-.7-4.3c0-.4-.4-.7-.7-.6-.4.1-.6.4-.6.8l4 25.3c.1.3.3.6.7.6zm.8-21.6c2-.7 4.2-.4 6 .8 1.4 1 3 1.5 4.6 1.5s3.2-.5 4.6-1.5c1.7-1.2 4-1.6 6-.8l3.3 1.2-3 19.1H9.2l-3-19.1 3.3-1.2zM32 32H8c-.4 0-.7.3-.7.7s.3.7.7.7h24c.4 0 .7-.3.7-.7s-.3-.7-.7-.7zm0 2.7H8c-.4 0-.7.3-.7.7s.3.6.7.6h24c.4 0 .7-.3.7-.7s-.3-.6-.7-.6zm-17.9-8.9c-1 0-1.8-.3-2.4-.6l.1-2.1c.6.4 1.4.6 2 .6.8 0 1.2-.4 1.2-1.3s-.4-1.3-1.3-1.3h-1.3l.2-1.9h1.1c.6 0 1-.3 1-1.3 0-.8-.4-1.2-1.1-1.2s-1.2.2-1.9.4l-.2-1.9c.7-.4 1.5-.6 2.3-.6 2 0 3 1.3 3 2.9 0 1.2-.4 1.9-1.1 2.3 1 .4 1.3 1.4 1.3 2.5.3 1.8-.6 3.5-2.9 3.5zm4-5.5c0-3.9 1.2-5.5 3.2-5.5s3.2 1.6 3.2 5.5-1.2 5.5-3.2 5.5-3.2-1.6-3.2-5.5zm4.1 0c0-2-.1-3.5-.9-3.5s-1 1.5-1 3.5.1 3.5 1 3.5c.8 0 .9-1.5.9-3.5zm4.5-1.4c-.9 0-1.5-.8-1.5-2.1s.6-2.1 1.5-2.1 1.5.8 1.5 2.1-.5 2.1-1.5 2.1zm0-.8c.4 0 .7-.5.7-1.2s-.2-1.2-.7-1.2-.7.5-.7 1.2.3 1.2.7 1.2z"></path></svg>
                  </div>
                  {/* Do Not Bleach */}
                  <div className="w-10 h-10">
                    <svg viewBox="0 0 40 40" className="w-full h-full"><path fill="currentColor" d="M36.7 31.1l-2.8-1.3-4.7-9.1 7.5-3.5c.4-.2.6-.6.4-1s-.6-.5-1-.4l-7.5 3.5-7.8-15c-.3-.5-1.1-.5-1.4 0l-7.8 15L4 15.9c-.4-.2-.8 0-1 .4s0 .8.4 1l7.5 3.5-4.7 9.1-2.8 1.3c-.4.2-.6.6-.4 1 .1.3.4.4.7.4.1 0 .2 0 .3-.1l1-.4-1.5 2.8c-.1.2-.1.5 0 .8.1.2.4.3.7.3h31.7c.3 0 .5-.1.7-.4.1-.2.1-.5 0-.8L35.1 32l1 .4c.1 0 .2.1.3.1.3 0 .6-.2.7-.4.1-.3 0-.8-.4-1zm-5.1-2.3l-9.8-4.6 6-2.8 3.8 7.4zM20 6.4L27.1 20 20 23.3 12.9 20 20 6.4zm-7.8 15l6 2.8-9.8 4.6 3.8-7.4zm22.4 13.1H5.4L7.2 31 20 25l12.8 6 1.8 3.5z"></path></svg>
                  </div>
                  {/* Do Not Tumble Dry */}
                  <div className="w-10 h-10">
                    <svg viewBox="0 0 40 40" className="w-full h-full"><path fill="currentColor" d="M5.9 5.9v28.2h28.2V5.9H5.9zM19.1 20l-8.3 8.3c-2-2.2-3.2-5.1-3.2-8.3s1.2-6.1 3.2-8.3l8.3 8.3zm-7.4-9.3c2.2-2 5.1-3.2 8.3-3.2s6.1 1.2 8.3 3.2L20 19.1l-8.3-8.4zM20 20.9l8.3 8.3c-2.2 2-5.1 3.2-8.3 3.2s-6.1-1.2-8.3-3.2l8.3-8.3zm.9-.9l8.3-8.3c2 2.2 3.2 5.1 3.2 8.3s-1.2 6.1-3.2 8.3L20.9 20zm8.4-10.2c-1.2-1.1-2.6-2-4.1-2.6h6.6l-2.5 2.6zm-18.6 0L8.2 7.2h6.6c-1.5.6-2.9 1.5-4.1 2.6zm-.9.9c-1.1 1.2-2 2.6-2.6 4.1V8.2l2.6 2.5zM7.2 25.2c.6 1.5 1.5 2.9 2.6 4.1l-2.6 2.6v-6.7zm3.5 5c1.2 1.1 2.6 2 4.1 2.6H8.2l2.5-2.6zm18.6 0l2.6 2.6h-6.6c1.4-.6 2.8-1.5 4-2.6zm.9-.9c1.1-1.2 2-2.6 2.6-4.1v6.6l-2.6-2.5zm2.6-14.5c-.6-1.5-1.5-2.9-2.6-4.1l2.6-2.6v6.7z"></path></svg>
                  </div>
                  {/* Ironing */}
                  <div className="w-10 h-10">
                    <svg viewBox="0 0 40 40" className="w-full h-full"><path fill="currentColor" d="M35.1 33.6L33.2 6.2c0-.4-.3-.7-.7-.7H13.9c-.4 0-.7.3-.7.7s.3.7.7.7h18l.7 10.5H20.8c-8.8.2-15.9 7.5-15.9 16.4 0 .4.3.7.7.7h28.9c.2 0 .4-.1.5-.2s.2-.3.2-.5v-.2h-.1zm-28.8-.5C6.7 25.3 13 19 20.8 18.9h11.9l1 14.2H6.3zm11.2-6.8c0 1.2-1 2.1-2.1 2.1s-2.1-1-2.1-2.1 1-2.1 2.1-2.1 2.1 1 2.1 2.1zm6.3 0c0 1.2-1 2.1-2.1 2.1-1.2 0-2.1-1-2.1-2.1s1-2.1 2.1-2.1 2.1 1 2.1 2.1z"></path></svg>
                  </div>
                  {/* Chemical Wash */}
                  <div className="w-10 h-10">
                    <svg viewBox="0 0 40 40" className="w-full h-full"><path fill="currentColor" d="M20 33.8c7.6 0 13.8-6.2 13.8-13.8S27.6 6.2 20 6.2 6.2 12.4 6.2 20 12.4 33.8 20 33.8zm0-26.3c6.9 0 12.5 5.6 12.5 12.5S26.9 32.5 20 32.5 7.5 26.9 7.5 20 13.1 7.5 20 7.5zm-.4 15h.5c1.8 0 3-1.1 3-3.7 0-2.2-1.1-3.6-3.1-3.6h-2.6v10.6h2.2v-3.3zm0-5.2h.4c.6 0 .9.5.9 1.7 0 1.1-.3 1.7-.9 1.7h-.4v-3.4z"></path></svg>
                  </div>
                  {/* Do Not Chemical Wash */}
                  <div className="w-10 h-10">
                    <svg viewBox="0 0 40 40" className="w-full h-full"><path fill="currentColor" d="M30.2 29.3c2.2-2.5 3.6-5.7 3.6-9.3s-1.4-6.8-3.6-9.3l3.6-3.6c.3-.3.3-.7 0-.9-.3-.3-.7-.3-.9 0l-3.6 3.6c-2.5-2.2-5.7-3.6-9.3-3.6s-6.8 1.4-9.3 3.6L7.1 6.2c-.3-.3-.7-.3-.9 0-.3.3-.3.7 0 .9l3.6 3.6c-2.2 2.5-3.6 5.7-3.6 9.3s1.4 6.8 3.6 9.3l-3.6 3.6c-.3.3-.3.7 0 .9.1.1.3.2.5.2s.3-.1.5-.2l3.6-3.6c2.5 2.2 5.7 3.6 9.3 3.6s6.8-1.4 9.3-3.6l3.6 3.6c.1.1.3.2.5.2s.3-.1.5-.2c.3-.3.3-.7 0-.9l-3.8-3.6z"></path></svg>
                  </div>
                  {/* Vertical Line Dry */}
                  <div className="w-10 h-10">
                    <svg viewBox="0 0 40 40" className="w-full h-full"><path fill="currentColor" d="M34.1 34.1H5.9V5.9h28.2v28.2zM7.2 32.8h25.6V7.2H7.2v25.6zm13.5-18.3a.68.68 0 0 0-.7-.7.68.68 0 0 0-.7.7v10.9a.68.68 0 0 0 .7.7.68.68 0 0 0 .7-.7V14.5z"></path></svg>
                  </div>
                </div>
                <p className="text-zinc-400 text-[13px] md:text-[14px]">
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
              { id: 1, title: 'Ridley High Waist', price: '$36.00', img: 'https://kalles-5.myshopify.com/cdn/shop/files/acndb3127517966_q1_2-0_1a1dac3d-a619-462e-8846-e28f9706d326.jpg?v=1751276039&width=940', discount: '-33%', sizes: 'S, M, L, XL' },
              { id: 2, title: 'Creamy White Tee', price: '$25.00', img: 'https://kalles-5.myshopify.com/cdn/shop/files/cinqa31079186d2_q1_2-0_8236c050-0b73-45e4-a750-7ba93e1b269d.jpg?v=1717404520&width=940', sizes: 'XS, S, M' },
              { id: 3, title: 'Classic Denim', price: '$45.00', img: 'https://kalles-5.myshopify.com/cdn/shop/files/citiz41130172ef_m1_2-0_4ab86cba-d4f7-485d-9980-7b4e6287f7bc.jpg?v=1717404493&width=940', discount: '-15%', sizes: 'S, M, L' },
              { id: 4, title: 'Summer Shorts', price: '$30.00', img: 'https://kalles-5.myshopify.com/cdn/shop/files/p24-11_ec0dcf2b-dcc4-48cf-8b3e-71c6945984db.jpg?v=1717404614&width=720', sizes: 'S, M, L' },
              { id: 5, title: 'Pink Floral Dress', price: '$55.00', originalPrice: '$75.00', img: 'https://kalles-5.myshopify.com/cdn/shop/files/pr16-1_c56afae4-f846-449d-a609-3e6ab9fa8986.jpg?v=1717404558&width=720', discount: '-25%', sizes: 'S, M, L, XL' },
              { id: 6, title: 'Casual Cotton Shirt', price: '$40.00', img: 'https://kalles-5.myshopify.com/cdn/shop/files/slife305151578f_q1_2-0_bd6de06f-5e8e-4689-a080-1710df083bea.jpg?v=1717404581&width=940', sizes: 'XS, S, M' },
              { id: 7, title: 'Leather White Trainers', price: '$20.00', img: 'https://kalles-5.myshopify.com/cdn/shop/files/product-46.jpg?v=1717402725&width=720', sizes: '7, 8, 9, 10' },
              { id: 8, title: 'Short Sleeved Hoodie', price: '$30.00', img: 'https://kalles-5.myshopify.com/cdn/shop/files/69957116_041_d.jpg?v=1747129694&width=940', sizes: 'S, M, L' },
              { id: 9, title: 'Sport Sneaker', price: '$35.00', img: 'https://kalles-5.myshopify.com/cdn/shop/files/ezgif.com-webp-to-jpg_e77ecbaa-4aa5-41b7-ba2f-f057f4ae6aa7.jpg?v=1717403734&width=720', sizes: '7, 8, 9, 10' },
              { id: 10, title: 'Analogue Resin Strap', price: '$30.00', img: 'https://kalles-5.myshopify.com/cdn/shop/files/product-46.jpg?v=1717402725&width=720', sizes: 'One Size' },
            ].map((product, index) => (
              <div 
                key={index} 
                className="group/item cursor-pointer flex-none w-[calc(50%-12px)] md:w-[calc(25%-18px)] scroll-snap-align-start animate-fade-in-up-manual"
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                <div className="relative aspect-[1/1.2] overflow-hidden bg-zinc-100 mb-4 rounded-sm group">
                  <img src={product.img} alt={product.title} className="w-full h-full object-cover transition-transform duration-700 group-hover/item:scale-110" />
                  
                  {/* Discount Badge */}
                  {product.discount && (
                    <div className="absolute top-3 right-3 w-12 h-12 bg-[#f15412] text-white rounded-full flex items-center justify-center text-[12px] font-bold z-10 transition-transform duration-300 group-hover/item:scale-110 shadow-lg">
                      {product.discount}
                    </div>
                  )}

                  {/* Left Side Icons - Wishlist & Compare */}
                  <div className="absolute top-3 left-3 flex flex-col gap-2 z-30 transition-all duration-300 transform -translate-x-10 opacity-0 group-hover/item:translate-x-0 group-hover/item:opacity-100">
                    <button className="w-8 h-8 bg-white text-zinc-800 rounded-full flex items-center justify-center hover:bg-[#67cfde] hover:text-white transition-all shadow-md group/btn relative">
                      <Heart size={16} />
                    </button>
                    <button className="w-8 h-8 bg-white text-zinc-800 rounded-full flex items-center justify-center hover:bg-[#67cfde] hover:text-white transition-all shadow-md group/btn relative">
                      <ArrowRightLeft size={16} />
                    </button>
                  </div>

                  {/* Sizes (Bottom Left) - Visible on Hover */}
                  <div className="absolute bottom-3 left-3 z-30 transition-all duration-300 transform translate-y-4 opacity-0 group-hover/item:translate-y-0 group-hover/item:opacity-100 text-[11px] font-bold text-white drop-shadow-md uppercase tracking-wider">
                    {product.sizes}
                  </div>

                  {/* Center Buttons - Quick View & Quick Add */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 z-20 opacity-0 group-hover/item:opacity-100 transition-all duration-500 transform translate-y-4 group-hover/item:translate-y-0">
                    <button className="w-[120px] h-9 bg-white text-zinc-900 text-[12px] font-bold rounded-full hover:bg-zinc-900 hover:text-white transition-all shadow-xl uppercase tracking-wider">
                      Quick view
                    </button>
                    <button className="w-[120px] h-9 bg-[#67cfde] text-white text-[12px] font-bold rounded-full hover:bg-zinc-900 transition-all shadow-xl uppercase tracking-wider">
                      Quick add
                    </button>
                  </div>

                  {/* Sale/Label for items with original price but no set discount */}
                  {product.originalPrice && !product.discount && (
                    <div className="absolute top-3 left-3 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-sm uppercase tracking-wider">Sale</div>
                  )}
                </div>
                
                <h3 className="text-[14px] font-bold text-zinc-900 mb-1 group-hover/item:text-cyan-500 transition-colors uppercase tracking-tight">{product.title}</h3>
                <div className="text-[14px] font-medium text-zinc-500">
                  {product.originalPrice ? (
                    <div className="flex items-center gap-2">
                      <span className="text-zinc-400 line-through">{product.originalPrice}</span>
                      <span className="text-red-500">{product.price}</span>
                    </div>
                  ) : (
                    <span>{product.price}</span>
                  )}
                </div>
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
        name: "Skin Sweatpans",
        price: "45.00",
        image1: productImages[0]
      }} />
    </div>
  );
};

export default ProductLeftSidebar;
