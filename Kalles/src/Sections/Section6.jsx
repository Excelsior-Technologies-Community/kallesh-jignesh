import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';

const Section6 = () => {
    const navigate = useNavigate();
    const blogPosts = [
        {
            id: 1,
            title: "Spring – Summer Trending 2025",
            author: "admin",
            date: "Jul 16",
            excerpt: "Typography is the work of typesetters, compositors, typographers, graphic designers, art directors, manga artists, ...",
            image: "https://kalles-5.myshopify.com/cdn/shop/articles/1-7-1.jpg?v=1752720549&width=1920"
        },
        {
            id: 2,
            title: "The Easiest Way to Break Out on Top",
            author: "admin",
            date: "Jul 16",
            excerpt: "While historically the work of typesetters, compositors, typographers, graphic designers, art directors, manga artists,...",
            image: "https://kalles-5.myshopify.com/cdn/shop/articles/2-7-1_45af8fe8-7b6a-460c-b3b4-0766b8de92a9.jpg?v=1752720529&width=1920"
        },
        {
            id: 3,
            title: "Style for couple in Weeding season",
            author: "admin",
            date: "Jul 16",
            excerpt: "Typesetters, compositors, typographers, graphic designers, art directors, manga artists, comic book artists, and graffiti artists have...",
            image: "https://kalles-5.myshopify.com/cdn/shop/articles/couple-7-1_6661d358-744a-4c05-b693-d80ece65bcd5.jpg?v=1752720506&width=1920"
        },
        {
            id: 4,
            title: "Street Style Girl Trending",
            author: "admin",
            date: "May 10",
            excerpt: "Typography is the work of typesetters, compositors, typographers, graphic designers, art directors, manga artists, ...",
            image: "https://kalles-5.myshopify.com/cdn/shop/articles/street-style-girl3-7-1.jpg?v=1717399460&width=1920"
        },
        {
            id: 5,
            title: "Young Woman in Style",
            author: "admin",
            date: "May 10",
            excerpt: "While historically the work of typesetters, compositors, typographers, graphic designers, art directors, manga artists,...",
            image: "https://kalles-5.myshopify.com/cdn/shop/articles/young-woman-1149643_1920-7-1.jpg?v=1717399464&width=1920"
        },
        {
            id: 6,
            title: "Handmade Accessories Guide",
            author: "admin",
            date: "May 10",
            excerpt: "Typesetters, compositors, typographers, graphic designers, art directors, manga artists, comic book artists, and graffiti artists have...",
            image: "https://kalles-5.myshopify.com/cdn/shop/articles/hand-3200400_1920.jpg?v=1717399450&width=1920"
        },
        {
            id: 7,
            title: "Premium Handbag Collection",
            author: "admin",
            date: "May 10",
            excerpt: "Typography is the work of typesetters, compositors, typographers, graphic designers, art directors, manga artists, ...",
            image: "https://kalles-5.myshopify.com/cdn/shop/articles/handbag-1478814_1920.jpg?v=1717399462&width=1920"
        }
    ];

    return (
        <section className="py-10 px-4 max-w-[1240px] mx-auto overflow-hidden">
            {/* Header */}
            <div className="flex flex-col items-center mb-12">
                <div className="flex items-center gap-6 mb-2">
                    <div className="w-16 h-[2px] bg-black"></div>
                    <h2 className="text-[16px] text-center font-bold tracking-widest text-[#222]">LATEST FROM BLOG</h2>
                    <div className="w-16 h-[2px] bg-black"></div>
                </div>
                <p className="text-[#878787] italic font-serif">The freshest and most exciting news</p>
            </div>

            {/* Slider Container */}
            <div className="relative group/slider px-2">
                <Swiper
                    modules={[Navigation]}
                    spaceBetween={30}
                    slidesPerView={1}
                    navigation={{
                        prevEl: '.swiper-button-prev-custom',
                        nextEl: '.swiper-button-next-custom',
                    }}
                    breakpoints={{
                        640: { slidesPerView: 2 },
                        1024: { slidesPerView: 3 },
                    }}
                    className="!pb-4"
                >
                    {blogPosts.map((post) => (
                        <SwiperSlide key={post.id}>
                            <div
                                className="group cursor-pointer"
                                onClick={() => navigate(`/blog/${post.id}`)}
                            >
                                <div className="relative aspect-[3/2] overflow-hidden mb-6 rounded-sm bg-[#f6f6f6]">
                                    <img
                                        src={post.image}
                                        alt={post.title}
                                        className="w-full h-full object-cover transition-transform duration-1000 "
                                    />
                                </div>
                                <div className="space-y-3">
                                    <h3 className="text-[18px] font-semibold text-[#222] hover:text-[#43D1F0] transition-colors leading-tight">
                                        {post.title}
                                    </h3>
                                    <div className="text-[12px] text-[#878787]">
                                        By <span className="text-[#222] font-medium">{post.author}</span> on {post.date}
                                    </div>
                                    <p className="text-[14px] text-[#878787] leading-relaxed line-clamp-3">
                                        {post.excerpt}
                                    </p>
                                </div>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>

                {/* Custom Navigation Arrows */}
                <button className="swiper-button-prev-custom absolute top-[40%] -left-4 z-20 w-10 h-10 bg-white shadow-lg rounded-full flex items-center justify-center text-[#222] hover:bg-[#43D1F0] hover:text-white transition-all opacity-0 group-hover/slider:opacity-100 group-hover/slider:left-2 cursor-pointer">
                    <ChevronLeft size={20} />
                </button>
                <button className="swiper-button-next-custom absolute top-[40%] -right-4 z-20 w-10 h-10 bg-white shadow-lg rounded-full flex items-center justify-center text-[#222] hover:bg-[#43D1F0] hover:text-white transition-all opacity-0 group-hover/slider:opacity-100 group-hover/slider:right-2 cursor-pointer">
                    <ChevronRight size={20} />
                </button>
            </div>
        </section>
    );
};

export default Section6;
