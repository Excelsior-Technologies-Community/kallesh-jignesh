import {
    Heart,
    Mail,
    Maximize2
} from 'lucide-react';
import { useState } from 'react';
import {
    FaFacebookF,
    FaInstagram,
    FaPinterestP,
    FaTwitter
} from 'react-icons/fa';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import { useCurrency } from '../Context/CurrencyContext';

const productsData = {
    1: { id: 1, name: "Analogue Resin Strap", price: 113.00, image1: "https://kalles-5.myshopify.com/cdn/shop/files/famer2052212158_q1_2-1.jpg?v=1717405215&width=940", image2: "https://kalles-5.myshopify.com/cdn/shop/files/famer2052212158_q5_2-0.jpg?v=1717405215&width=940" },
    2: { id: 2, name: "Wide Fit Dusty", price: 45.00, image1: "https://kalles-5.myshopify.com/cdn/shop/files/p26-3_5d35798e-8bab-47db-97c2-aba6d65148a7.jpg?v=1717404640&width=720", image2: "https://kalles-5.myshopify.com/cdn/shop/files/p26-2_f44997c0-71d0-4a57-801b-9337e3672212.jpg?v=1717404640&width=720" },
    3: { id: 3, name: "Barre Gripper Socks", price: 8.00, image1: "https://kalles-5.myshopify.com/cdn/shop/files/171.jpg?v=1717400214&width=720", image2: "https://kalles-5.myshopify.com/cdn/shop/files/175.jpg?v=1717400214&width=720" }
};

const ProductPopupCard = ({ product, onClose }) => {
    const { formatPrice } = useCurrency();
    if (!product) return null;
    return (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 mt-4 z-50 w-[240px] bg-white shadow-2xl rounded-sm group/card overflow-hidden animate-in fade-in zoom-in duration-300">
            <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white rotate-45"></div>
            <div className="relative p-2">
                <div className="relative aspect-[3/4] overflow-hidden mb-3">
                    <img src={product.image1} alt={product.name} className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500 group-hover/card:opacity-0" />
                    <img src={product.image2} alt={product.name} className="absolute inset-0 w-full h-full object-cover transition-all duration-500 scale-100 group-hover/card:scale-105 opacity-0 group-hover/card:opacity-100" />
                    <div className="absolute top-3 left-3 flex flex-col gap-2 transition-all duration-300 opacity-0 -translate-x-4 group-hover/card:opacity-100 group-hover/card:translate-x-0">
                        <button className="bg-white p-2 rounded-full hover:bg-[#43D1F0] hover:text-white transition-colors shadow-sm"><Heart size={14} /></button>
                        <button className="bg-white p-2 rounded-full hover:bg-[#43D1F0] hover:text-white transition-colors shadow-sm"><Maximize2 size={14} /></button>
                    </div>
                </div>
                <div className="px-1 pb-1 text-center">
                    <h3 className="text-[13px] font-medium text-[#222] mb-1 group-hover/card:text-[#43D1F0] transition-colors truncate">{product.name}</h3>
                    <div className="text-[13px] font-semibold text-gray-600">{formatPrice(product.price)}</div>
                </div>
                <button onClick={(e) => { e.stopPropagation(); onClose(); }} className="absolute top-1 right-1 w-6 h-6 flex items-center justify-center text-gray-400 hover:text-black">×</button>
            </div>
        </div>
    );
};

const LookbookBlog = () => {
    const [activeTag, setActiveTag] = useState(null);

    const handleTagClick = (e, index, tagId) => {
        e.stopPropagation();
        if (activeTag?.index === index && activeTag?.tagId === tagId) {
            setActiveTag(null);
        } else {
            setActiveTag({ index, tagId });
        }
    };

    return (
        <div className="bg-white font-['Inter',_sans-serif] text-[#222]" onClick={() => setActiveTag(null)}>
            {/* Hero Section */}
            <section className="relative h-[250px] flex items-center justify-center text-center overflow-hidden">
                <img
                    src="https://kalles-5.myshopify.com/cdn/shop/articles/young-woman-1149643_1920-7-1.jpg?v=1717399464&width=1920"
                    alt="Hero"
                    className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/60"></div>
                <div className="relative z-10 px-4 max-w-[800px]">
                    <h1 className="text-xl md:text-2xl font-bold text-white mb-6 uppercase tracking-wider leading-tight">
                        101 Beauty Tips Every Girl Should Know
                    </h1>
                    <div className="flex items-center justify-center gap-6 text-white text-[13px] font-medium uppercase tracking-widest opacity-90">
                        <span className="flex items-center gap-2">
                            August 27, 2024
                        </span>
                        <span className="flex items-center gap-2">
                            <span>Fashion</span>
                        </span>
                    </div>
                </div>
            </section>

            {/* Content Section */}
            <div className="max-w-[1240px] mx-auto px-4 py-20">
                {/* Intro Paragraph */}
                <p className="text-[#666] text-lg leading-relaxed mb-16  italic max-w-full mx-auto">
                    Typography is the work of typesetters, composers, typographers, graphic designers, art directors, manga artists, comic book artists, graffiti artists, and now—anyone who arranges words, letters, numbers, and symbols for publication, display, or distribution—from the design of billboards and brochures to the layout and typography found on websites.
                </p>

                {/* Main Image Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-2 mb-20">
                    <div className="aspect-[4/5] overflow-hidden ">
                        <img src="https://kalles-5.myshopify.com/cdn/shop/files/gallery-01_a0f7d27a-0b61-456c-b8f8-32df0ed83a33.jpg?v=1744787501&width=375" alt="grid-1" className="w-full h-full object-cover hover:scale-110 transition-transform duration-700" />
                    </div>
                    <div className="aspect-[4/5] overflow-hidden ">
                        <img src="https://kalles-5.myshopify.com/cdn/shop/files/gallery-02_788a9e41-2692-4b95-837f-6b27454a6c08.jpg?v=1744787501&width=375" alt="grid-2" className="w-full h-full object-cover hover:scale-110 transition-transform duration-700" />
                    </div>
                    <div className="aspect-[4/5] overflow-hidden ">
                        <img src="https://kalles-5.myshopify.com/cdn/shop/files/gallery-03_d1a97dce-7ea1-4f96-a51f-f1e5d166f318.jpg?v=1744787501&width=375" alt="grid-3" className="w-full h-full object-cover hover:scale-110 transition-transform duration-700" />
                    </div>
                    <div className="aspect-[4/5] overflow-hidden ">
                        <img src="https://kalles-5.myshopify.com/cdn/shop/files/gallery-04_8988b88b-a90c-4116-bbd8-b3412df4ddfe.jpg?v=1744787501&width=375" alt="grid-4" className="w-full h-full object-cover hover:scale-110 transition-transform duration-700" />
                    </div>
                    <div className="aspect-[4/5] overflow-hidden ">
                        <img src="https://kalles-5.myshopify.com/cdn/shop/files/p1-2_7fc374e5-b489-4007-af7c-8e478aec362f.jpg?v=1744946662&width=720" alt="grid-5" className="w-full h-full object-cover hover:scale-110 transition-transform duration-700" />
                    </div>
                    <div className="aspect-[4/5] overflow-hidden ">
                        <img src="https://kalles-5.myshopify.com/cdn/shop/files/gallery-06_fa91763a-2d7a-462b-af31-d464fe21c004.jpg?v=1744787501&width=375" alt="grid-6" className="w-full h-full object-cover hover:scale-110 transition-transform duration-700" />
                    </div>
                </div>

                {/* Shop The Look Section */}
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold uppercase tracking-[4px] mb-4">Shop The Look</h2>
                    <div className="h-[2px] w-20 bg-[#43d1f0] mx-auto"></div>
                </div>

                <div className="relative group overflow-visible max-w-[1200px] mx-auto mb-20">
                    <img src="https://kalles-5.myshopify.com/cdn/shop/files/bg-loobook_9a8f1797-fe3e-4039-9bc4-5a4c498c33b5.jpg?v=1744943986&width=1200" alt="shop the look" className="w-full h-auto rounded-sm" />

                    {/* Hotspot 1 */}
                    <div className="absolute top-[25%] left-[22%] z-20" onClick={(e) => handleTagClick(e, 1, 1)}>
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white cursor-pointer shadow-lg transition-all animate-bounce ${activeTag?.index === 1 && activeTag?.tagId === 1 ? 'bg-[#43d1f0] scale-125' : 'bg-pink-500 hover:bg-[#43d1f0]'}`}>1</div>
                        {activeTag?.index === 1 && activeTag?.tagId === 1 && <ProductPopupCard product={productsData[1]} onClose={() => setActiveTag(null)} />}
                    </div>

                    {/* Hotspot 2 */}
                    <div className="absolute top-[45%] left-[48%] z-20" onClick={(e) => handleTagClick(e, 1, 2)}>
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white cursor-pointer shadow-lg transition-all animate-bounce ${activeTag?.index === 1 && activeTag?.tagId === 2 ? 'bg-[#43d1f0] scale-125' : 'bg-pink-500 hover:bg-[#43d1f0]'}`}>2</div>
                        {activeTag?.index === 1 && activeTag?.tagId === 2 && <ProductPopupCard product={productsData[2]} onClose={() => setActiveTag(null)} />}
                    </div>

                    {/* Hotspot 3 */}
                    <div className="absolute top-[65%] left-[35%] z-20" onClick={(e) => handleTagClick(e, 1, 3)}>
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white cursor-pointer shadow-lg transition-all animate-bounce ${activeTag?.index === 1 && activeTag?.tagId === 3 ? 'bg-[#43d1f0] scale-125' : 'bg-pink-500 hover:bg-[#43d1f0]'}`}>3</div>
                        {activeTag?.index === 1 && activeTag?.tagId === 3 && <ProductPopupCard product={productsData[3]} onClose={() => setActiveTag(null)} />}
                    </div>

                    {/* Hotspot 4 */}
                    <div className="absolute top-[30%] left-[75%] z-20" onClick={(e) => handleTagClick(e, 1, 4)}>
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white cursor-pointer shadow-lg transition-all animate-bounce ${activeTag?.index === 1 && activeTag?.tagId === 4 ? 'bg-[#43d1f0] scale-125' : 'bg-pink-500 hover:bg-[#43d1f0]'}`}>4</div>
                        {activeTag?.index === 1 && activeTag?.tagId === 4 && <ProductPopupCard product={productsData[1]} onClose={() => setActiveTag(null)} />}
                    </div>

                    {/* Hotspot 5 */}
                    <div className="absolute bottom-[25%] right-[20%] z-20" onClick={(e) => handleTagClick(e, 1, 5)}>
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white cursor-pointer shadow-lg transition-all animate-bounce ${activeTag?.index === 1 && activeTag?.tagId === 5 ? 'bg-[#43d1f0] scale-125' : 'bg-pink-500 hover:bg-[#43d1f0]'}`}>5</div>
                        {activeTag?.index === 1 && activeTag?.tagId === 5 && <ProductPopupCard product={productsData[2]} onClose={() => setActiveTag(null)} />}
                    </div>
                </div>

                {/* Post Footer */}
                <div className="border-t border-b border-gray-100 py-6 flex flex-wrap items-center justify-between gap-6 mb-20 text-[13px]">
                    <div className="flex items-center gap-8">
                        <div className="flex items-center gap-2">
                            <span className="font-bold uppercase text-[11px] text-gray-400">CATEGORY:</span>
                            <span className="font-medium hover:text-[#43d1f0] cursor-pointer transition-colors">Fashion, Travel</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="font-bold uppercase text-[11px] text-gray-400">AUTHOR:</span>
                            <span className="font-medium">Admin</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="font-bold uppercase text-[11px] text-gray-400">SHARE:</span>
                        <div className="flex items-center gap-3">
                            <FaFacebookF size={16} className="text-gray-400 hover:text-[#43d1f0] cursor-pointer transition-colors" />
                            <FaTwitter size={16} className="text-gray-400 hover:text-[#43d1f0] cursor-pointer transition-colors" />
                            <FaInstagram size={16} className="text-gray-400 hover:text-[#43d1f0] cursor-pointer transition-colors" />
                            <FaPinterestP size={16} className="text-gray-400 hover:text-[#43d1f0] cursor-pointer transition-colors" />
                            <Mail size={16} className="text-gray-400 hover:text-[#43d1f0] cursor-pointer transition-colors" />
                        </div>
                    </div>
                </div>

                {/* Related Portfolio */}
                <div className="text-center mb-12">
                    <h2 className="text-2xl font-bold uppercase tracking-[4px] mb-4">Related Portfolio</h2>
                    <div className="h-[2px] w-12 bg-[#43d1f0] mx-auto"></div>
                </div>
                <div className="mb-20">
                    <Swiper
                        modules={[Autoplay, Pagination, Navigation]}
                        spaceBetween={30}
                        slidesPerView={1}
                        autoplay={{
                            delay: 3000,
                            disableOnInteraction: false,
                        }}
                        pagination={{ clickable: true }}
                        breakpoints={{
                            640: { slidesPerView: 2 },
                            1024: { slidesPerView: 3 },
                        }}
                        className="pb-12 !static"
                    >
                        {[
                            "https://kalles-5.myshopify.com/cdn/shop/articles/handbag-1478814_1920.jpg?v=1717399462&width=1920",
                            "https://kalles-5.myshopify.com/cdn/shop/articles/street-style-girl3-7-1.jpg?v=1717399460&width=1920",
                            "https://kalles-5.myshopify.com/cdn/shop/articles/hand-3200400_1920.jpg?v=1717399450&width=1920",
                            "https://kalles-5.myshopify.com/cdn/shop/articles/1-7-1.jpg?v=1752720549&width=1920",
                            "https://kalles-5.myshopify.com/cdn/shop/articles/2-7-1_45af8fe8-7b6a-460c-b3b4-0766b8de92a9.jpg?v=1752720529&width=1920",
                            "https://kalles-5.myshopify.com/cdn/shop/articles/couple-7-1_6661d358-744a-4c05-b693-d80ece65bcd5.jpg?v=1752720506&width=1920"
                        ].map((img, idx) => (
                            <SwiperSlide key={idx}>
                                <div className="group relative overflow-hidden aspect-[16/10] bg-gray-100">
                                    <img src={img} alt={`related-${idx}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-[#222]">
                                            <Maximize2 size={18} />
                                        </div>
                                    </div>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>

                {/* Comments Section */}
                <div className="max-w-[1200px] mx-auto">
                    <h2 className="text-2xl font-bold mb-10 pb-4 border-b border-gray-100 italic">1 thought on "101 Beauty Tips Every Girl Should Know"</h2>
                    <div className="flex gap-6 mb-16">
                        <div className="w-16 h-16 rounded-full bg-gray-100 overflow-hidden flex-shrink-0">
                            <img src="https://secure.gravatar.com/avatar/64e1ad1c6f962900fa997813aaccf13b?s=120&d=mm&r=g" alt="avatar" className="w-full h-full object-cover" />
                        </div>
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <span className="font-bold text-[#222]">Liza Rose Clien</span>
                                <span className="text-[11px] font-bold text-[#43d1f0] uppercase tracking-widest">Admin</span>
                            </div>
                            <p className="text-[#666] leading-relaxed italic">
                                Learning how to apply makeup like a pro is no easy feat. But if you’re looking to master the basics, we’ve got you covered with our top beauty tips every girl should know.
                            </p>
                        </div>
                    </div>

                    {/* Comment Form */}
                    <div className="bg-gray-50 p-10 rounded-sm">
                        <h2 className="text-2xl font-bold mb-2 uppercase tracking-tight">Leave a comment</h2>
                        <p className="text-[13px] text-gray-500 mb-8 italic">Your email address will not be published. Required fields are marked *</p>

                        <form className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-[11px] font-bold uppercase tracking-widest text-[#222] mb-2">Name *</label>
                                    <input type="text" className="w-full px-4 py-3 border border-gray-200 focus:outline-none focus:border-[#43d1f0] transition-colors rounded-sm" />
                                </div>
                                <div>
                                    <label className="block text-[11px] font-bold uppercase tracking-widest text-[#222] mb-2">Email *</label>
                                    <input type="email" className="w-full px-4 py-3 border border-gray-200 focus:outline-none focus:border-[#43d1f0] transition-colors rounded-sm" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-[11px] font-bold uppercase tracking-widest text-[#222] mb-2">Comment *</label>
                                <textarea rows="6" className="w-full px-4 py-3 border border-gray-200 focus:outline-none focus:border-[#43d1f0] transition-colors rounded-sm resize-none"></textarea>
                            </div>
                            <button className="bg-[#222] text-white px-10 py-3.5 rounded-full font-bold uppercase tracking-widest text-[12px] hover:bg-[#43d1f0] transition-all duration-300">
                                Post Comment
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LookbookBlog;
