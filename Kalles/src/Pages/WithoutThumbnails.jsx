import React, { useState, useEffect } from 'react';
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
  Mail,
  Clock,
  Share2,
  HelpCircle,
  RefreshCw
} from 'lucide-react';
import ProductInfoModal from '../Components/ProductInfoModal';
import { useCart } from '../Context/CartContext';
import { useWishlist } from '../Context/WishlistContext';

const WithoutThumbnails = () => {
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('Description');
  const [activeModal, setActiveModal] = useState(null);
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const productImages = [
    'https://kalles-5.myshopify.com/cdn/shop/files/p30-1_c03ab079-0235-4dc7-936b-112999e131ee.jpg?v=1717404721&width=823',
    'https://kalles-5.myshopify.com/cdn/shop/files/p30-2_cfee0448-9931-4d4b-831f-16c7fb61a535.jpg?v=1717404721&width=823',
    'https://kalles-5.myshopify.com/cdn/shop/files/p30-3_2a6d4c60-0302-4dda-b5f3-6b01bb27b3fb.jpg?v=1717404721&width=823',
    'https://kalles-5.myshopify.com/cdn/shop/files/p30-4_5245a0d0-5b1a-47a8-89ff-6ddc23d5043f.jpg?v=1717404721&width=823'
  ];

  const product = {
    id: 'large-icon-bag-static',
    name: "Large Icon Bag",
    price: 45.00,
    image1: productImages[0],
    image2: productImages[1]
  };

  const isFavorite = isInWishlist(product.id);
  const [zoomData, setZoomData] = useState({ active: false, x: 0, y: 0 });
  const [showStickyBar, setShowStickyBar] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  // Countdown timer logic
  const [timeLeft, setTimeLeft] = useState({
    days: 99,
    hours: 12,
    minutes: 6,
    seconds: 50
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        if (prev.days > 0) return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Handle sticky bar visibility on scroll
  useEffect(() => {
    const handleScroll = () => {
      setShowStickyBar(window.scrollY > 500);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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

  return (
    <div className="w-full bg-white font-sans text-zinc-900 border-b">
      {/* Breadcrumbs */}
      <div className="border-b border-zinc-100">
        <div className="max-w-[1400px] mx-auto px-6 py-4 flex items-center justify-between">
          <nav className="flex items-center gap-2 text-[14px] text-zinc-500">
            <span className="hover:text-zinc-900 cursor-pointer text-zinc-400">Home</span>
            <ChevronRight size={14} className="text-zinc-300" />
            <span className="hover:text-zinc-900 cursor-pointer text-zinc-400 font-medium">Large Icon Bag</span>
          </nav>
        </div>
      </div>

      {/* Main Product Section */}
      <div className="max-w-[1200px] mx-auto px-6 py-10">
        <div className="flex flex-col lg:flex-row gap-12 items-start">
          
          {/* Left: Product Image */}
          <div className="w-full lg:w-[48%] group relative">
             <div 
               className="w-full relative overflow-hidden bg-zinc-50 cursor-crosshair"
               onMouseMove={handleMouseMove}
               onMouseLeave={handleMouseLeave}
             >
                <img 
                  src={productImages[activeIndex]} 
                  alt="Large Icon Bag" 
                  className="w-full h-auto object-cover animate-rotate-in-manual"
                />
                
                {/* Navigation Arrows */}
                <button 
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white text-zinc-900 flex items-center justify-center shadow-lg hover:bg-cyan-400 hover:text-white transition-all z-10 opacity-0 group-hover:opacity-100"
                >
                  <ChevronLeft size={20} />
                </button>
                <button 
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white text-zinc-900 flex items-center justify-center shadow-lg hover:bg-cyan-400 hover:text-white transition-all z-10 opacity-0 group-hover:opacity-100"
                >
                  <ChevronRight size={20} />
                </button>

                {/* Zoom Lens */}
                {zoomData.active && (
                  <div 
                    className="absolute border border-zinc-200 bg-white/10 pointer-events-none hidden lg:block"
                    style={{
                      width: '200px',
                      height: '240px',
                      left: `calc(${zoomData.x}% - 100px)`,
                      top: `calc(${zoomData.y}% - 120px)`,
                      boxShadow: '0 0 0 1000px rgba(0,0,0,0.05)'
                    }}
                  />
                )}
             </div>
          </div>

          {/* Right: Details (Sticky) */}
          <div className="w-full lg:w-[52%] lg:sticky lg:top-10 relative">
            {/* Zoom Portal */}
            {zoomData.active && (
              <div 
                className="absolute top-0 left-0 w-full h-[600px] z-50 bg-white border border-zinc-100 overflow-hidden hidden lg:block shadow-2xl"
                style={{
                  backgroundImage: `url(${productImages[activeIndex]})`,
                  backgroundPosition: `${zoomData.x}% ${zoomData.y}%`,
                  backgroundSize: '200%', 
                  backgroundRepeat: 'no-repeat'
                }}
              />
            )}

            <div className="flex flex-col gap-6">
              <div>
                <h1 className="text-[24px] md:text-[32px] font-bold tracking-tight mb-2">Large Icon Bag</h1>
                <div className="text-[20px] md:text-[24px] text-zinc-500 font-medium">$45.00</div>
              </div>

              <p className="text-[14px] leading-relaxed text-zinc-500">
                Go kalles this summer with this vintage navy and white striped v-neck t-shirt from the Nike. 
                Perfect for pairing with denim and white kicks for a stylish kalles vibe.
              </p>

              {/* Countdown Timer */}
              <div className="flex flex-col items-center py-6 border-t border-b border-zinc-50">
                <span className="flex items-center gap-2 text-[14px] font-bold text-zinc-800 mb-6">
                  <Clock size={18} className="text-zinc-500" /> Hurry up! Sale Ends in
                </span>
                <div className="flex gap-8 justify-center">
                   <div className="flex flex-col items-center min-w-[60px]">
                      <span className="text-[28px] font-bold text-zinc-900 leading-none mb-1">{timeLeft.days}</span>
                      <span className="text-[12px] text-zinc-400 font-medium">Days</span>
                   </div>
                   <div className="flex flex-col items-center min-w-[60px]">
                      <span className="text-[28px] font-bold text-zinc-900 leading-none mb-1">{timeLeft.hours}</span>
                      <span className="text-[12px] text-zinc-400 font-medium">hours</span>
                   </div>
                   <div className="flex flex-col items-center min-w-[60px]">
                      <span className="text-[28px] font-bold text-zinc-900 leading-none mb-1">{String(timeLeft.minutes).padStart(2, '0')}</span>
                      <span className="text-[12px] text-zinc-400 font-medium">minutes</span>
                   </div>
                   <div className="flex flex-col items-center min-w-[60px]">
                      <span className="text-[28px] font-bold text-zinc-900 leading-none mb-1">{String(timeLeft.seconds).padStart(2, '0')}</span>
                      <span className="text-[12px] text-zinc-400 font-medium">seconds</span>
                   </div>
                </div>
              </div>

              {/* Quantity and Add to Cart */}
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center border border-zinc-200 rounded-full px-4 h-12 bg-white">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="text-zinc-500 hover:text-zinc-900 p-1"><Minus size={16} /></button>
                  <input type="number" value={quantity} onChange={(e) => setQuantity(parseInt(e.target.value) || 1)} className="w-12 text-center font-bold text-[15px] outline-none" />
                  <button onClick={() => setQuantity(quantity + 1)} className="text-zinc-500 hover:text-zinc-900 p-1"><Plus size={16} /></button>
                </div>

                <button 
                  onClick={() => addToCart(product, quantity)}
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
                  <button className="w-11 h-11 border border-zinc-200 rounded-full flex items-center justify-center text-zinc-600 hover:bg-zinc-900 hover:text-white hover:border-zinc-900 transition-all"><ArrowRightLeft size={18} /></button>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="py-2">
                <img src="https://kalles-5.myshopify.com/cdn/shop/files/trust_img.png?v=1718015360&width=740" alt="Trust Badges" className="max-w-full h-auto" />
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

              <div className="space-y-1 text-[13px] pt-4 text-zinc-400">
                 <div><span>Availability:</span> <span className="text-black ml-1 italic">In stock</span></div>
                 <div><span>SKU:</span></div>
                 <div><span>Categories:</span> <span className="text-black ml-1">All, Bags, Shoes</span></div>
                 <div><span>Tags:</span> <span className="text-black ml-1 italic">Acessories, Color Black, Price $7–$50, Shoes, Vendor H&M</span></div>
              </div>              {/* Social Sharing */}
              <div className="flex items-center gap-5 pt-4">
                <button className="text-zinc-900 hover:text-cyan-500 transition-colors"><Facebook size={18} /></button>
                <button className="text-zinc-900 hover:text-cyan-500 transition-colors">
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path></svg>
                </button>
                <button className="text-zinc-900 hover:text-cyan-500 transition-colors">
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M12 2C6.477 2 2 6.477 2 12c0 4.237 2.636 7.855 6.356 9.312-.088-.791-.167-2.005.035-2.868.181-.778 1.172-4.97 1.172-4.97s-.299-.599-.299-1.484c0-1.39.805-2.428 1.81-2.428.854 0 1.265.64 1.265 1.408 0 .858-.546 2.141-.828 3.33-.236.995.5 1.807 1.48 1.807 1.778 0 3.144-1.874 3.144-4.58 0-2.393-1.72-4.068-4.177-4.068-2.847 0-4.515 2.135-4.515 4.34 0 .859.331 1.781.744 2.281.082.1.094.188.069.288l-.278 1.133c-.044.183-.145.223-.335.134-1.249-.581-2.03-2.407-2.03-3.874 0-3.154 2.292-6.052 6.608-6.052 3.469 0 6.165 2.473 6.165 5.776 0 3.447-2.173 6.22-5.19 6.22-1.013 0-1.965-.525-2.291-1.148l-.623 2.378c-.226.869-.835 1.958-1.244 2.621 1.1.339 2.26.521 3.465.521 5.523 0 10-4.477 10-10S17.523 2 12 2z"></path></svg>
                </button>
                <button className="text-zinc-900 hover:text-cyan-500 transition-colors">
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M19.098 10.638c-1.503 1.147-2.3 3.018-2.3 5.4v5.712H13.6V13.8c0-1.85-.75-3-2.6-3-1.4 0-2.2 1-2.6 1.95-.15.4-.25.95-.25 1.5v7.502H4.9V4.288h3.2v1.35s1-1.65 3.55-1.65c2.6 0 3.825 1.7 3.825 4.95v1.7z"></path></svg>
                </button>
                <button className="text-zinc-900 hover:text-cyan-500 transition-colors">
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.13-.31-1.08-.66.02-.18.27-.36.74-.55 2.9-1.26 4.83-2.1 5.8-2.51 2.76-1.16 3.33-1.36 3.71-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .33z"></path></svg>
                </button>
                <button className="text-zinc-900 hover:text-cyan-500 transition-colors"><Mail size={18} /></button>
                <button className="text-zinc-900 hover:text-cyan-500 transition-colors">
                   <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"></path></svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Product Tabs Section */}
      <div className="w-full border-t border-zinc-100 py-16 mt-10">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="flex flex-wrap items-center justify-center gap-4 md:gap-12 mb-12">
            {['Description', 'Tab Custom HTML'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`text-[14px] md:text-[16px] font-bold transition-all px-10 py-2.5 rounded-full border 
                  ${activeTab === tab 
                    ? 'border-zinc-900 text-zinc-900 bg-white shadow-sm' 
                    : 'border-transparent text-zinc-400 hover:text-zinc-900'}`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="max-w-[1000px] mx-auto animate-fade-in text-[14px] text-zinc-500 leading-relaxed space-y-8">
            {activeTab === 'Description' && (
              <div className="animate-fade-in space-y-12 text-zinc-500">
                <p className="text-[14px] leading-relaxed text-center max-w-[800px] mx-auto">
                  Design inspiration lorem ipsum dolor sit amet, consectetuer adipiscing elit. Morbi commodo, ipsum sed pharetra gravida, orci magna rhoncus neque, id pulvinar odio lorem num turpis. sit amet enim. Suspendisse id velit vitae ligula volutpat condimentum. Aliquam erat volutpat. Sed quis velit. Nulla facilisi. Nulla libero. Vivamus pharetra posuere sapien. Nam consectetuer. Sed aliquam, nunc eget euismod ullamcorper, lectus nunc ullamcorper orci.
                </p>
                
                <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-4 px-4 overflow-hidden">
                  {/* Left Features */}
                  <div className="flex flex-col gap-12 text-left md:text-right w-full md:w-1/3 order-2 md:order-1">
                    <div className="flex items-center md:flex-row-reverse justify-start md:justify-end gap-4 group cursor-pointer">
                      <div className="w-12 h-12 flex-shrink-0 bg-white shadow-sm border border-zinc-100 rounded-sm flex items-center justify-center group-hover:bg-zinc-900 group-hover:text-white transition-all text-zinc-900">
                        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" /></svg>
                      </div>
                      <div>
                        <h4 className="text-[13px] font-bold text-zinc-800 uppercase tracking-wider mb-1">Rain & Water</h4>
                        <p className="text-[12px]">Resistant</p>
                      </div>
                    </div>

                    <div className="flex items-center md:flex-row-reverse justify-start md:justify-end gap-4 group cursor-pointer">
                      <div className="w-12 h-12 flex-shrink-0 bg-white shadow-sm border border-zinc-100 rounded-sm flex items-center justify-center group-hover:bg-zinc-900 group-hover:text-white transition-all text-zinc-900">
                        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>
                      </div>
                      <div>
                        <h4 className="text-[13px] font-bold text-zinc-800 uppercase tracking-wider mb-1">UV Resistant</h4>
                        <p className="text-[12px]">Coatings</p>
                      </div>
                    </div>

                    <div className="flex items-center md:flex-row-reverse justify-start md:justify-end gap-4 group cursor-pointer">
                      <div className="w-12 h-12 flex-shrink-0 bg-white shadow-sm border border-zinc-100 rounded-sm flex items-center justify-center group-hover:bg-zinc-900 group-hover:text-white transition-all text-zinc-900">
                         <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M2 6c.6.5 1.2 1 2.5 1C5.8 7 7 6 7 6s1.2-1 2.5-1c1.3 0 2.5 1 2.5 1s1.2-1 2.5-1c1.3 0 2.5-1 2.5-1s1.2-1 2.5-1c1.3 0 2.5 1 2.5 1M2 12c.6.5 1.2 1 2.5 1 1.3 0 2.5-1 2.5-1s1.2-1 2.5-1c1.3 0 2.5 1 2.5 1s1.2 1 2.5 1c1.3 0 2.5-1 2.5-1s1.2-1 2.5-1c1.3 0 2.5 1 2.5 1M2 18c.6.5 1.2 1 2.5 1 1.3 0 2.5-1 2.5-1s1.2-1 2.5-1c1.3 0 2.5 1 2.5 1s1.2 1 2.5 1c1.3 0 2.5-1 2.5-1s1.2-1 2.5-1c1.3 0 2.5 1 2.5 1"/></svg>
                      </div>
                      <div>
                        <h4 className="text-[13px] font-bold text-zinc-800 uppercase tracking-wider mb-1">Corrosion Resistance</h4>
                        <p className="text-[12px]">to Sea water</p>
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
                      <div className="w-12 h-12 flex-shrink-0 bg-white shadow-sm border border-zinc-100 rounded-sm flex items-center justify-center group-hover:bg-zinc-900 group-hover:text-white transition-all text-zinc-900">
                        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" /></svg>
                      </div>
                      <div>
                        <h4 className="text-[13px] font-bold text-zinc-800 uppercase tracking-wider mb-1">Lead-free</h4>
                        <p className="text-[12px]">Powdercoat Finish</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 group cursor-pointer">
                      <div className="w-12 h-12 flex-shrink-0 bg-white shadow-sm border border-zinc-100 rounded-sm flex items-center justify-center group-hover:bg-zinc-900 group-hover:text-white transition-all text-zinc-900">
                         <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M11 2a2 2 0 0 0-2 2v5H4a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h5v5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2v-5h5a2 2 0 0 0 2-2v-2a2 2 0 0 0-2-2h-5V4a2 2 0 0 0-2-2h-2z"/></svg>
                      </div>
                      <div>
                        <h4 className="text-[13px] font-bold text-zinc-800 uppercase tracking-wider mb-1">Resistant to</h4>
                        <p className="text-[12px]">Spills</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 group cursor-pointer">
                      <div className="w-12 h-12 flex-shrink-0 bg-white shadow-sm border border-zinc-100 rounded-sm flex items-center justify-center group-hover:bg-zinc-900 group-hover:text-white transition-all text-zinc-900">
                        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 12h18M3 6h18M3 18h18" /></svg>
                      </div>
                      <div>
                        <h4 className="text-[13px] font-bold text-zinc-800 uppercase tracking-wider mb-1">Recyclable</h4>
                        <p className="text-[12px]">Aluminium Frame</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'Tab Custom HTML' && (
              <div className="animate-fade-in flex flex-col items-center">
                 <div className="flex items-center gap-6 mb-6 text-zinc-400">
                    {/* Laundry icons set */}
                    <div className="w-8 h-8">
                      <svg viewBox="0 0 40 40" className="w-full h-full"><path fill="currentColor" d="M8.7 30.7h22.7c.3 0 .6-.2.7-.6l4-25.3c-.1-.4-.3-.7-.7-.8s-.7.2-.8.6L34 8.9l-3-1.1c-2.4-.9-5.1-.5-7.2 1-2.3 1.6-5.3 1.6-7.6 0-2.1-1.5-4.8-1.9-7.2-1L6 8.9l-.7-4.3c0-.4-.4-.7-.7-.6-.4.1-.6.4-.6.8l4 25.3c.1.3.3.6.7.6zm.8-21.6c2-.7 4.2-.4 6 .8 1.4 1 3 1.5 4.6 1.5s3.2-.5 4.6-1.5c1.7-1.2 4-1.6 6-.8l3.3 1.2-3 19.1H9.2l-3-19.1 3.3-1.2zM32 32H8c-.4 0-.7.3-.7.7s.3.7.7.7h24c.4 0 .7-.3.7-.7s-.3-.7-.7-.7zm0 2.7H8c-.4 0-.7.3-.7.7s.3.6.7.6h24c.4 0 .7-.3.7-.7s-.3-.6-.7-.6zm-17.9-8.9c-1 0-1.8-.3-2.4-.6l.1-2.1c.6.4 1.4.6 2 .6.8 0 1.2-.4 1.2-1.3s-.4-1.3-1.3-1.3h-1.3l.2-1.9h1.1c.6 0 1-.3 1-1.3 0-.8-.4-1.2-1.1-1.2s-1.2.2-1.9.4l-.2-1.9c.7-.4 1.5-.6 2.3-.6 2 0 3 1.3 3 2.9 0 1.2-.4 1.9-1.1 2.3 1 .4 1.3 1.4 1.3 2.5.3 1.8-.6 3.5-2.9 3.5zm4-5.5c0-3.9 1.2-5.5 3.2-5.5s3.2 1.6 3.2 5.5-1.2 5.5-3.2 5.5-3.2-1.6-3.2-5.5zm4.1 0c0-2-.1-3.5-.9-3.5s-1 1.5-1 3.5.1 3.5 1 3.5c.8 0 .9-1.5.9-3.5zm4.5-1.4c-.9 0-1.5-.8-1.5-2.1s.6-2.1 1.5-2.1 1.5.8 1.5 2.1-.5 2.1-1.5 2.1zm0-.8c.4 0 .7-.5.7-1.2s-.2-1.2-.7-1.2-.7.5-.7 1.2.3 1.2.7 1.2z"></path></svg>
                    </div>
                    <div className="w-8 h-8">
                      <svg viewBox="0 0 40 40" className="w-full h-full"><path fill="currentColor" d="M36.7 31.1l-2.8-1.3-4.7-9.1 7.5-3.5c.4-.2.6-.6.4-1s-.6-.5-1-.4l-7.5 3.5-7.8-15c-.3-.5-1.1-.5-1.4 0l-7.8 15L4 15.9c-.4-.2-.8 0-1 .4s0 .8.4 1l7.5 3.5-4.7 9.1-2.8 1.3c-.4.2-.6.6-.4 1 .1.3.4.4.7.4.1 0 .2 0 .3-.1l1-.4-1.5 2.8c-.1.2-.1.5 0 .8.1.2.4.3.7.3h31.7c.3 0 .5-.1.7-.4.1-.2.1-.5 0-.8L35.1 32l1 .4c.1 0 .2.1.3.1.3 0 .6-.2.7-.4.1-.3 0-.8-.4-1zm-5.1-2.3l-9.8-4.6 6-2.8 3.8 7.4zM20 6.4L27.1 20 20 23.3 12.9 20 20 6.4zm-7.8 15l6 2.8-9.8 4.6 3.8-7.4zm22.4 13.1H5.4L7.2 31 20 25l12.8 6 1.8 3.5z"></path></svg>
                    </div>
                    <div className="w-8 h-8">
                      <svg viewBox="0 0 40 40" className="w-full h-full"><path fill="currentColor" d="M5.9 5.9v28.2h28.2V5.9H5.9zM19.1 20l-8.3 8.3c-2-2.2-3.2-5.1-3.2-8.3s1.2-6.1 3.2-8.3l8.3 8.3zm-7.4-9.3c2.2-2 5.1-3.2 8.3-3.2s6.1 1.2 8.3 3.2L20 19.1l-8.3-8.4zM20 20.9l8.3 8.3c-2.2 2-5.1 3.2-8.3 3.2s-6.1-1.2-8.3-3.2l8.3-8.3zm.9-.9l8.3-8.3c2 2.2 3.2 5.1 3.2 8.3s-1.2 6.1-3.2 8.3L20.9 20zm8.4-10.2c-1.2-1.1-2.6-2-4.1-2.6h6.6l-2.5 2.6zm-18.6 0L8.2 7.2h6.6c-1.5.6-2.9 1.5-4.1 2.6zm-.9.9c-1.1 1.2-2 2.6-2.6 4.1V8.2l2.6 2.5zM7.2 25.2c.6 1.5 1.5 2.9 2.6 4.1l-2.6 2.6v-6.7zm3.5 5c1.2 1.1 2.6 2 4.1 2.6H8.2l2.5-2.6zm18.6 0l2.6 2.6h-6.6c1.4-.6 2.8-1.5 4-2.6zm.9-.9c1.1-1.2 2-2.6 2.6-4.1v6.6l-2.6-2.5zm2.6-14.5c-.6-1.5-1.5-2.9-2.6-4.1l2.6-2.6v6.7z"></path></svg>
                    </div>
                    <div className="w-8 h-8">
                      <svg viewBox="0 0 40 40" className="w-full h-full"><path fill="currentColor" d="M35.1 33.6L33.2 6.2c0-.4-.3-.7-.7-.7H13.9c-.4 0-.7.3-.7.7s.3.7.7.7h18l.7 10.5H20.8c-8.8.2-15.9 7.5-15.9 16.4 0 .4.3.7.7.7h28.9c.2 0 .4-.1.5-.2s.2-.3.2-.5v-.2h-.1zm-28.8-.5C6.7 25.3 13 19 20.8 18.9h11.9l1 14.2H6.3zm11.2-6.8c0 1.2-1 2.1-2.1 2.1s-2.1-1-2.1-2.1 1-2.1 2.1-2.1 2.1 1 2.1 2.1zm6.3 0c0 1.2-1 2.1-2.1 2.1-1.2 0-2.1-1-2.1-2.1s1-2.1 2.1-2.1 2.1 1 2.1 2.1z"></path></svg>
                    </div>
                    <div className="w-8 h-8">
                      <svg viewBox="0 0 40 40" className="w-full h-full"><path fill="currentColor" d="M20 33.8c7.6 0 13.8-6.2 13.8-13.8S27.6 6.2 20 6.2 6.2 12.4 6.2 20 12.4 33.8 20 33.8zm0-26.3c6.9 0 12.5 5.6 12.5 12.5S26.9 32.5 20 32.5 7.5 26.9 7.5 20 13.1 7.5 20 7.5zm-.4 15h.5c1.8 0 3-1.1 3-3.7 0-2.2-1.1-3.6-3.1-3.6h-2.6v10.6h2.2v-3.3zm0-5.2h.4c.6 0 .9.5.9 1.7 0 1.1-.3 1.7-.9 1.7h-.4v-3.4z"></path></svg>
                    </div>
                    <div className="w-8 h-8">
                       <svg viewBox="0 0 40 40" className="w-full h-full"><path fill="currentColor" d="M30.2 29.3c2.2-2.5 3.6-5.7 3.6-9.3s-1.4-6.8-3.6-9.3l3.6-3.6c.3-.3.3-.7 0-.9-.3-.3-.7-.3-.9 0l-3.6 3.6c-2.5-2.2-5.7-3.6-9.3-3.6s-6.8 1.4-9.3 3.6L7.1 6.2c-.3-.3-.7-.3-.9 0-.3.3-.3.7 0 .9l3.6 3.6c-2.2 2.5-3.6 5.7-3.6 9.3s1.4 6.8 3.6 9.3l-3.6 3.6c-.3.3-.3.7 0 .9.1.1.3.2.5.2s.3-.1.5-.2l3.6-3.6c2.5 2.2 5.7 3.6 9.3 3.6s6.8-1.4 9.3-3.6l3.6 3.6c.1.1.3.2.5.2s.3-.1.5-.2c.3-.3.3-.7 0-.9l-3.8-3.6z"></path></svg>
                    </div>
                    <div className="w-8 h-8">
                      <svg viewBox="0 0 40 40" className="w-full h-full"><path fill="currentColor" d="M34.1 34.1H5.9V5.9h28.2v28.2zM7.2 32.8h25.6V7.2H7.2v25.6zm13.5-18.3a.68.68 0 0 0-.7-.7.68.68 0 0 0-.7.7v10.9a.68.68 0 0 0 .7.7.68.68 0 0 0 .7-.7V14.5z"></path></svg>
                    </div>
                 </div>
                 <p className="text-[16px] text-zinc-500 font-medium">LT01: 70% wool, 15% polyester, 10% polyamide, 5% acrylic 900 Grms/mt</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Sticky Bottom Add-To-Cart Bar */}
      <div className={`fixed bottom-0 left-0 w-full bg-white border-t border-zinc-100 shadow-[0_-5px_20px_rgba(0,0,0,0.05)] transform transition-transform duration-300 z-50 ${showStickyBar ? 'translate-y-0' : 'translate-y-full'}`}>
         <div className="max-w-[1200px] mx-auto px-6 py-4 flex items-center justify-between">
            <div className="hidden md:flex items-center gap-4">
               <img src={productImages[0]} alt="Bag" className="w-12 h-12 rounded object-cover" />
               <div className="flex flex-col">
                  <span className="font-bold text-[14px]">Large Icon Bag</span>
                  <span className="text-zinc-500 text-[13px]">$45.00</span>
               </div>
            </div>
            <div className="flex items-center gap-4 flex-grow md:flex-grow-0 justify-center">
              <div className="flex items-center border border-zinc-200 rounded-full px-3 h-10 bg-zinc-50">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="text-zinc-500 hover:text-zinc-900"><Minus size={14} /></button>
                <input type="number" value={quantity} readOnly className="w-8 text-center font-bold text-[14px] bg-transparent outline-none" />
                <button onClick={() => setQuantity(quantity + 1)} className="text-zinc-500 hover:text-zinc-900"><Plus size={14} /></button>
              </div>
               <button 
                onClick={() => addToCart(product, quantity)}
                className="px-10 h-10 bg-[#67CFDE] hover:bg-[#55B6C4] text-white font-bold uppercase tracking-wider text-[11px] rounded-full transition-all"
              >
                ADD TO CART
              </button>
            </div>
         </div>
      </div>

      <ProductInfoModal activeModal={activeModal} setActiveModal={setActiveModal} product={{
        name: "Large Icon Bag",
        price: "45.00",
        image1: productImages[0]
      }} />
    </div>
  );
};

export default WithoutThumbnails;
