import React, { useState, useRef } from 'react';
import { 
  ChevronRight, 
  Heart, 
  Minus, 
  Plus, 
  Facebook, 
  Twitter,
  ShoppingBag,
  Maximize2,
  ArrowRightLeft,
  ChevronLeft,
  HelpCircle,
  RefreshCw
} from 'lucide-react';
import ProductInfoModal from '../Components/ProductInfoModal';
import { useCart } from '../Context/CartContext';
import { useWishlist } from '../Context/WishlistContext';
import ProductCard from '../Components/ProductCard';

const ProductGroup = () => {
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('Description');
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState('PINK');
  const [selectedSize, setSelectedSize] = useState('S');
  const [activeModal, setActiveModal] = useState(null);
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const productImages = [
    'https://kalles-5.myshopify.com/cdn/shop/files/pr1-pink-3_b86d9255-a26f-488b-a3da-f15a1e3854b4.jpg?v=1751276039&width=1100',
    'https://kalles-5.myshopify.com/cdn/shop/files/pr1-pink-2_83b0439e-3e8b-4cd9-bbb7-5deabe60f0e0.jpg?v=1717404626&width=1100',
    'https://kalles-5.myshopify.com/cdn/shop/files/size.png?v=1758168281&width=493',
  ];

  const product = {
    id: 'blush-beanie-static',
    name: "Blush Beanie",
    price: 20.00,
    image1: productImages[0],
    image2: productImages[1]
  };

  const isFavorite = isInWishlist(product.id);

  const sliderRef = useRef(null);

  const scrollSlider = (direction) => {
    if (sliderRef.current) {
      const scrollAmount = sliderRef.current.offsetWidth;
      sliderRef.current.scrollBy({
        left: direction === 'next' ? scrollAmount : -scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const colors = [
    { name: 'WHITE', hex: '#f8f9fa' },
    { name: 'PINK', hex: '#ffb6c1' },
    { name: 'BLACK', hex: '#000000' }
  ];

  const sizes = ['S', 'M', 'L'];

  return (
    <div className="w-full bg-white font-sans text-zinc-900 relative">
      {/* Top Banner / Navigation */}
      <div className="bg-[#f6f6f8] py-4">
        <div className="max-w-[1200px] mx-auto px-6 flex items-center justify-between">
          <nav className="flex items-center gap-2 text-[13px] text-zinc-500">
            <span className="hover:text-zinc-900 cursor-pointer">Home</span>
            <ChevronRight size={14} className="text-zinc-400" />
            <span className="text-zinc-900">Blush Beanie</span>
          </nav>
        </div>
      </div>

      {/* Main Product Section */}
      <div className="max-w-[1200px] mx-auto px-6 py-12">
        <div className="flex flex-col lg:flex-row gap-10 items-start">
          
          {/* Left: Images */}
          <div className="flex w-full lg:w-[50%] gap-4">
            {/* Thumbnails Sidebar */}
            <div className="hidden md:flex flex-col gap-3 w-[80px]">
              {productImages.map((img, idx) => (
                <div 
                  key={idx} 
                  onClick={() => setActiveIndex(idx)}
                  className={`cursor-pointer transition-all aspect-[3/4] overflow-hidden ${
                    activeIndex === idx ? 'border-2 border-zinc-900' : 'border border-zinc-200'
                  }`}
                >
                  <img src={img} alt={`Thumb ${idx}`} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>

            {/* Main Image */}
            <div className="flex-1 relative overflow-hidden bg-zinc-50 aspect-[3/4]">
              <img 
                src={productImages[activeIndex]} 
                alt="Product Center" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Right: Details */}
          <div className="w-full lg:w-[50%] flex flex-col gap-6">
            <div>
              <h1 className="text-[26px] font-bold tracking-tight mb-2">Blush Beanie</h1>
              <div className="flex items-center gap-3">
                <span className="text-[22px] text-zinc-400 line-through">$40.00</span>
                <span className="text-[22px] text-red-500 font-medium">$20.00</span>
              </div>
            </div>

            <p className="text-[14px] leading-relaxed text-zinc-500">
              Go kalles this summer with this vintage navy and white striped v-neck t-shirt from the Nike. 
              Perfect for pairing with denim and white kicks for a stylish kalles vibe.
            </p>

            {/* Color Selection */}
            <div className="space-y-3">
              <div className="text-[13px] font-bold uppercase tracking-wider">
                COLOR: <span className="font-normal text-zinc-500 ml-1">{selectedColor}</span>
              </div>
              <div className="flex items-center gap-3">
                {colors.map((color) => (
                  <button
                    key={color.name}
                    onClick={() => setSelectedColor(color.name)}
                    className={`w-9 h-9 rounded-full relative ${
                      selectedColor === color.name ? 'border-2 border-zinc-900' : 'border border-zinc-200'
                    }`}
                  >
                    <span 
                      className="absolute inset-[2px] rounded-full border border-zinc-200 shadow-inner" 
                      style={{ backgroundColor: color.hex }}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Size Selection */}
            <div className="space-y-3">
              <div className="flex items-center justify-between md:justify-start md:gap-4">
                <div className="text-[13px] font-bold uppercase tracking-wider">
                  SIZE: <span className="font-normal text-zinc-500 ml-1">{selectedSize}</span>
                </div>
                <button onClick={() => setActiveModal('size')} className="text-[13px] text-zinc-900 font-medium border-b border-zinc-900 pb-0.5 whitespace-nowrap">
                  Size Guide
                </button>
              </div>
              <div className="flex items-center gap-2">
                {sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`w-10 h-10 rounded-full text-[13px] font-medium transition-all flex items-center justify-center border ${
                      selectedSize === size 
                        ? 'bg-zinc-900 text-white border-zinc-900' 
                        : 'bg-white text-zinc-500 border-zinc-200 hover:border-zinc-900'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity and Add to Cart */}
            <div className="flex flex-wrap items-center gap-4 py-2">
              <div className="flex items-center border border-zinc-200 rounded-full px-4 h-12 bg-white flex-shrink-0">
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
                  className="w-10 text-center font-bold text-[15px] outline-none"
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
                className="flex-1 min-w-[180px] h-12 bg-[#56CFE1] hover:bg-[#45b7c8] text-white font-bold uppercase tracking-widest text-[13px] rounded-full transition-all flex items-center justify-center shadow-md"
              >
                ADD TO CART
              </button>

              <div className="flex gap-2">
                <button 
                  onClick={() => toggleWishlist(product)}
                  className={`w-12 h-12 border border-zinc-200 rounded-full flex items-center justify-center transition-all shadow-sm ${isFavorite ? 'bg-zinc-900 text-white border-zinc-900' : 'text-zinc-600 hover:border-zinc-900'}`}
                >
                  <Heart size={18} fill={isFavorite ? 'currentColor' : 'none'} />
                </button>
                <button className="w-12 h-12 border border-zinc-200 rounded-full flex items-center justify-center text-zinc-600 hover:border-zinc-900 transition-all shadow-sm">
                  <Maximize2 size={18} />
                </button>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="py-2">
              <img 
                src="https://kalles-5.myshopify.com/cdn/shop/files/trust_img.png?v=1718015360&width=740" 
                alt="Trust Badges" 
                className="max-w-full h-auto h-[30px] object-contain"
              />
            </div>

            <div className="flex flex-wrap items-center gap-6 pb-8 border-b border-gray-100 mb-8 pt-2">
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

            {/* Metadata Info */}
            <div className="space-y-1.5 text-[13px] pt-4">
               <div><span className="text-zinc-400 w-24 inline-block">Availability:</span> <span className="text-zinc-900 font-medium">In stock</span></div>
               <div><span className="text-zinc-400 w-24 inline-block">SKU:</span> <span className="text-zinc-900 font-medium">P15-1</span></div>
               <div><span className="text-zinc-400 w-24 inline-block">Categories:</span> <span className="text-zinc-900 hover:text-[#56CFE1] cursor-pointer">All, Bottoms, Fashion 2, Women</span></div>
               <div>
                  <span className="text-zinc-400 inline-block md:w-24 align-top">Tags:</span> 
                  <span className="text-zinc-900 hover:text-[#56CFE1] cursor-pointer inline-block flex-1 sm:max-w-[calc(100%-6rem)]">
                    Color Black, Color Grey, Color Pink, Price $7–$50, Size L, Size M, Size S, Vendor H&M
                  </span>
               </div>
            </div>

            {/* Social Sharing */}
            <div className="flex items-center gap-4 py-2">
              <button className="text-zinc-900 hover:text-[#56CFE1]"><Facebook size={16} /></button>
              <button className="text-zinc-900 hover:text-[#56CFE1]">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </button>
              <button className="text-zinc-900 hover:text-[#56CFE1]">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3.81l.19-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
              </button>
              <button className="text-zinc-900 hover:text-[#56CFE1]">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
              </button>
              <button className="text-zinc-900 hover:text-[#56CFE1]">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
              </button>
            </div>
            
          </div>
        </div>
      </div>

      {/* Product Information Accordions */}
      <div className="max-w-[1200px] mx-auto px-6 py-10 mt-10">
        <div className="max-w-[1200px] mx-auto space-y-4">
          {[
            { 
              id: 'Description', 
              title: 'Description',
              content: (
                <div className="flex flex-col gap-6 text-[14px] text-zinc-500 leading-[1.8] py-6">
                  <p>
                    Go sporty this summer with this vintage navy and white striped v-neck t-shirt from the Abercrombie & Fitch. 
                    Perfect for pairing with denim and white kicks for a stylish sporty vibe. Will fit a UK 8-10, model shown is a UK 8 and 5'5. !!
                  </p>
                  <p>
                    Typography is the work of typesetters, compositors, typographers, graphic designers, art directors, manga artists, 
                    comic book artists, graffiti artists, and now—anyone who arranges words, letters, numbers, and symbols for publication, 
                    display, or distribution—from clerical workers and newsletter writers to anyone self-publishing materials.
                  </p>
                  <p className="font-medium italic text-zinc-800 text-[15px] py-2">
                    Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit...
                  </p>
                  <p>
                    Hit your next boxing workout with a combination it's never seen before in the Combat Drop Arm Tank, 
                    including a freedom-instilling regular fit and dropped armhole to allow you to throw jabs and hooks 
                    at the punching bag with ease. A lightweight material keeps you fighting fit, and fresh.
                  </p>
                  <p>
                    Design inspiration lorem ipsum dolor sit amet, consectetuer adipiscing elit. Morbi commodo, ipsum sed pharetra gravida, 
                    orci magna rhoncus neque, id pulvinar odio lorem non turpis. Nullam sit amet enim. Suspendisse id velit vitae ligula volutpat 
                    condimentum. Aliquam erat volutpat. Sed quis velit. Nulla facilisi. Nulla libero. Vivamus pharetra posuere sapien. Nam consectetuer. 
                    Sed aliquam, nunc eget euismod ullamcorper, lectus nunc ullamcorper orci.
                  </p>
                </div>
              )
            },
            { 
              id: 'Additional Information', 
              title: 'Additional Information',
              content: (
                <div className="text-center text-zinc-500 py-10">
                  <table className="w-full max-w-[400px] mx-auto text-left text-[14px] border-collapse">
                    <tbody>
                      <tr className="border-b border-zinc-100"><th className="py-3 font-medium text-zinc-900">Color</th><td className="py-3 text-zinc-600">Black, Grey, Pink, White</td></tr>
                      <tr className="border-b border-zinc-100"><th className="py-3 font-medium text-zinc-900">Size</th><td className="py-3 text-zinc-600">S, M, L</td></tr>
                      <tr className="border-b border-zinc-100"><th className="py-3 font-medium text-zinc-900">Material</th><td className="py-3 text-zinc-600">Wool, Cotton</td></tr>
                    </tbody>
                  </table>
                </div>
              )
            },
            { 
              id: 'Custom tab', 
              title: 'Custom tab',
              content: (
                <div className="text-center text-zinc-500 py-10">
                  Custom tab content area. 
                </div>
              )
            }
          ].map((item) => (
            <div key={item.id} className="border border-zinc-100 rounded-sm overflow-hidden bg-white">
              <button
                onClick={() => setActiveTab(activeTab === item.id ? '' : item.id)}
                className="w-full flex items-center justify-between py-4 px-5 bg-[#eeeeee] hover:bg-[#ececec] transition-colors group"
              >
                <span className="text-[14px] font-bold text-zinc-900 group-hover:text-cyan-500 transition-colors">
                  {item.title}
                </span>
                <div className="bg-zinc-900 text-white w-8 h-8 flex items-center justify-center rounded-sm transition-all duration-300">
                   {activeTab === item.id ? <Minus size={16} strokeWidth={3} /> : <Plus size={16} strokeWidth={3} />}
                </div>
              </button>
              
              <div 
                className={`grid transition-all duration-500 ease-in-out ${activeTab === item.id ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
              >
                <div className="overflow-hidden">
                  <div className="px-5">
                    {item.content}
                  </div>
                </div>
              </div>
            </div>
          ))}
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

      {/* Floating Demo Actions */}
      <div className="fixed right-0 top-1/2 -translate-y-1/2 z-50 flex flex-col items-end shadow-2xl">
        <div className="bg-white px-5 py-3 text-[14px] font-bold text-zinc-900 border border-zinc-100 mb-[1px] hover:text-[#56CFE1] cursor-pointer w-full text-center">
          47+ demos
        </div>
        <button className="bg-[#56CFE1] hover:bg-[#45b7c8] text-white px-5 py-3 text-[14px] font-bold flex items-center justify-center gap-2 transition-colors w-full">
          <ShoppingBag size={16} /> Buy now
        </button>
      </div>

      <ProductInfoModal activeModal={activeModal} setActiveModal={setActiveModal} product={{
        name: "Blush Beanie",
        price: "20.00",
        image1: productImages[0]
      }} />
    </div>
  );
};

export default ProductGroup;
