import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar, User, MessageCircle, Loader2 } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import { Link } from 'react-router-dom';
import axios from 'axios';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';

const BlogGridLayout = () => {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/blogs');
                setBlogs(response.data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching blogs:", error);
                setLoading(false);
            }
        };

        fetchBlogs();
    }, []);

    if (loading) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center">
                <Loader2 className="w-10 h-10 animate-spin text-[#43d1f0] mb-4" />
                <p className="text-gray-500 font-medium tracking-widest text-[12px]">LOADING BLOGS...</p>
            </div>
        );
    }

    // Slider Data (Top 6 blogs)
    const sliderPosts = blogs.slice(0, 6);
    // Grid Data (All blogs)
    const blogPosts = blogs;

    return (
        <div className="w-full font-['Inter',_sans-serif]">
            {/* Slider Section (Ported from Portfolio.jsx) */}
            <div className="relative group/slider w-full">
                <Swiper
                    modules={[Navigation, Autoplay]}
                    spaceBetween={0}
                    slidesPerView={1}
                    loop={true}
                    autoplay={{
                        delay: 5000,
                        disableOnInteraction: false,
                    }}
                    navigation={{
                        prevEl: '.swiper-button-prev-custom',
                        nextEl: '.swiper-button-next-custom',
                    }}
                    breakpoints={{
                        640: { slidesPerView: 2 },
                        1024: { slidesPerView: 3 },
                    }}
                    className="h-[250px] md:h-[350px] lg:h-[450px]"
                >
                    {sliderPosts.map((post) => (
                        <SwiperSlide key={post.id} className="relative h-full">
                            <div className="relative w-full h-full overflow-hidden cursor-pointer group/item">
                                <img
                                    src={post.image}
                                    alt={post.title}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover/item:scale-110"
                                />
                                {/* Overlay Gradient */}
                                <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col justify-end p-8 text-center items-center">
                                    <div className="transform translate-y-4 group-hover/item:translate-y-0 transition-transform duration-500">
                                        <div className="text-[11px] md:text-[12px] text-gray-300 uppercase tracking-widest mb-3 font-medium">
                                            By <span className="text-white font-bold">{post.author}</span> In <span className="text-white font-bold">{post.category}</span>
                                        </div>
                                        <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-white uppercase tracking-widest mb-3 leading-tight group-hover/item:text-[#43d1f0] transition-colors">
                                            {post.title}
                                        </h3>
                                        <div className="text-[11px] md:text-[12px] text-gray-400 font-serif italic tracking-wider">
                                            {post.date}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>

                {/* Custom Navigation Arrows */}
                <button className="swiper-button-prev-custom absolute top-1/2 -translate-y-1/2 left-4 z-20 w-10 h-10 md:w-12 md:h-12 border border-white/30 hover:border-white rounded-full flex items-center justify-center text-white hover:bg-white hover:text-black transition-all opacity-0 group-hover/slider:opacity-100 cursor-pointer shadow-xl">
                    <ChevronLeft size={24} strokeWidth={1.5} />
                </button>
                <button className="swiper-button-next-custom absolute top-1/2 -translate-y-1/2 right-4 z-20 w-10 h-10 md:w-12 md:h-12 border border-white/30 hover:border-white rounded-full flex items-center justify-center text-white hover:bg-white hover:text-black transition-all opacity-0 group-hover/slider:opacity-100 cursor-pointer shadow-xl">
                    <ChevronRight size={24} strokeWidth={1.5} />
                </button>
            </div>

            {/* Main Content: Blog Grid */}
            <div className="max-w-[1240px] mx-auto px-4 py-20">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-24">
                    {blogPosts.map((post) => (
                        <article key={post.id} className="group flex flex-col items-start px-2">
                            {/* Image Container */}
                            <Link
                                to={`/blog/${post.id}`}
                                className="block w-full aspect-[16/10] overflow-hidden bg-[#f6f6f6] mb-8 rounded-sm relative"
                            >
                                <img
                                    src={post.image}
                                    alt={post.title}
                                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                />
                            </Link>

                            {/* Title */}
                            <Link to={`/blog/${post.id}`} className="block mb-2">
                                <h2 className="text-[18px] font-semibold text-[#222] group-hover:text-[#43d1f0] transition-colors tracking-tight">
                                    {post.title}
                                </h2>
                            </Link>

                            {/* Post Meta */}
                            <div className="text-[13px] text-[#878787] mb-0">
                                by <span className="text-[#222] font-medium">{post.author}</span> on {post.date}
                            </div>
                        </article>
                    ))}
                </div>

                {/* Pagination (Matching Screenshot) */}
                <div className="mt-24 flex items-center justify-center gap-6 text-[13px] font-medium uppercase tracking-widest text-[#878787]">
                    <span className="text-[#43d1f0] cursor-pointer">1</span>
                    <span className="hover:text-[#222] cursor-pointer transition-colors">2</span>
                    <span className="hover:text-[#222] cursor-pointer transition-colors ml-4">Next</span>
                </div>
            </div>
        </div>
    );
};

export default BlogGridLayout;
