import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Loader2, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';

const Portfolio3 = () => {
    const [portfolios, setPortfolios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Mock data fallback
    const mockData = [
        {
            id: 1,
            img: "https://kalles-5.myshopify.com/cdn/shop/files/portfolio-1.jpg?v=1652174352&width=800",
            name: "Fashion Editorial",
            collection: "Photography",
            description: "A stunning fashion editorial shoot featuring the latest summer collection."
        },
        {
            id: 2,
            img: "https://kalles-5.myshopify.com/cdn/shop/files/portfolio-2.jpg?v=1652174352&width=800",
            name: "Minimalist Branding",
            collection: "Design",
            description: "Complete branding package for a modern minimalist coffee shop."
        },
        {
            id: 3,
            img: "https://kalles-5.myshopify.com/cdn/shop/files/portfolio-3.jpg?v=1652174352&width=800",
            name: "Urban Architecture",
            collection: "Architecture",
            description: "Capturing the essence of modern urban architecture and design."
        },
        {
            id: 4,
            img: "https://kalles-5.myshopify.com/cdn/shop/files/portfolio-4.jpg?v=1652174352&width=800",
            name: "Product Showcase",
            collection: "Commercial",
            description: "High-end product photography for a luxury watch brand."
        },
        {
            id: 5,
            img: "https://kalles-5.myshopify.com/cdn/shop/files/portfolio-5.jpg?v=1652174352&width=800",
            name: "Travel Diary",
            collection: "Lifestyle",
            description: "A visual journey through the streets of Paris."
        },
        {
            id: 6,
            img: "https://kalles-5.myshopify.com/cdn/shop/files/portfolio-6.jpg?v=1652174352&width=800",
            name: "Abstract Art",
            collection: "Art",
            description: "An exploration of color and form in abstract digital art."
        }
    ];

    useEffect(() => {
        const fetchPortfolios = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/portfolio');
                if (Array.isArray(response.data) && response.data.length > 0) {
                    setPortfolios(response.data);
                } else {
                    // If API returns empty array, use mock data? 
                    // Or just show empty. Let's stick to empty if API is alive but empty.
                    // But if API fails, we use mock data.
                    setPortfolios([]);
                }
                setLoading(false);
            } catch (err) {
                console.error("Error fetching portfolios:", err);
                // Fallback to mock data on error (e.g. server down)
                setPortfolios(mockData);
                setLoading(false);
                // content might be different than mock data structure if not carefully aligned
            }
        };

        fetchPortfolios();
    }, []);

    // Filter categories (derived from data)
    const categories = ["All", ...new Set(portfolios.map(item => item.collection).filter(Boolean))];
    const [activeFilter, setActiveFilter] = useState("All");

    const filteredItems = activeFilter === "All"
        ? portfolios
        : portfolios.filter(item => item.collection === activeFilter);

    if (loading) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center">
                <Loader2 className="w-10 h-10 animate-spin text-teal-500 mb-4" />
                <p className="text-gray-500 font-medium tracking-wide">LOADING PORTFOLIO...</p>
            </div>
        );
    }

    // Slider Data (from Section6)
    const blogPosts = [
        {
            id: 1,
            title: "SPRING - SUMMER TRENDING 2025",
            author: "admin",
            category: "Fashion, Life Style",
            date: "Jul 16",
            image: "https://kalles-5.myshopify.com/cdn/shop/articles/1-7-1.jpg?v=1752720549&width=1920"
        },
        {
            id: 2,
            title: "THE EASIEST WAY TO BREAK OUT ON TOP",
            author: "admin",
            category: "Tech, Fashion, Life Style",
            date: "Jul 16",
            image: "https://kalles-5.myshopify.com/cdn/shop/articles/2-7-1_45af8fe8-7b6a-460c-b3b4-0766b8de92a9.jpg?v=1752720529&width=1920"
        },
        {
            id: 3,
            title: "STYLE FOR COUPLE IN WEEDING SEASON",
            author: "admin",
            category: "Fashion, Travel",
            date: "Jul 16",
            image: "https://kalles-5.myshopify.com/cdn/shop/articles/couple-7-1_6661d358-744a-4c05-b693-d80ece65bcd5.jpg?v=1752720506&width=1920"
        },
        {
            id: 4,
            title: "COOL SPRING STREET STYLE LOOKS",
            author: "admin",
            category: "Fashion, Life Style",
            date: "May 10",
            image: "https://kalles-5.myshopify.com/cdn/shop/articles/street-style-girl3-7-1.jpg?v=1717399460&width=1920"
        },
        {
            id: 5,
            title: "101 BEAUTY TIPS EVERY GIRL SHOULD KNOW",
            author: "admin",
            category: "Life Style, Travel",
            date: "May 10",
            image: "https://kalles-5.myshopify.com/cdn/shop/articles/young-woman-1149643_1920-7-1.jpg?v=1717399464&width=1920"
        },
        {
            id: 6,
            title: "MEN IN STYLE",
            author: "admin",
            category: "Life Style, Travel",
            date: "May 10",
            image: "https://kalles-5.myshopify.com/cdn/shop/articles/hand-3200400_1920.jpg?v=1717399450&width=1920"
        }
    ];

    return (
        <div className="w-full">
            {/* Slider Section */}
            <div className="relative group/slider w-full mb-12">
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
                    className="h-[150px] md:h-[250px] lg:h-[350px]"
                >
                    {blogPosts.map((post) => (
                        <SwiperSlide key={post.id} className="relative h-full">
                            <div className="relative w-full h-full overflow-hidden cursor-pointer group/item">
                                <img
                                    src={post.image}
                                    alt={post.title}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover/item:scale-110"
                                />
                                {/* Overlay Gradient */}
                                <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col justify-end p-6 text-center items-center">
                                    <div className="transform translate-y-4 group-hover/item:translate-y-0 transition-transform duration-500">
                                        <div className="text-[11px] md:text-[12px] text-gray-300 uppercase tracking-wider mb-2 font-medium">
                                            By <span className="text-white">{post.author}</span> In <span className="text-white">{post.category}</span>
                                        </div>
                                        <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-white uppercase tracking-wider mb-2 leading-tight">
                                            {post.title}
                                        </h3>
                                        <div className="text-[11px] md:text-[12px] text-gray-400 font-serif italic">
                                            {post.date}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>

                {/* Custom Navigation Arrows */}
                <button className="swiper-button-prev-custom absolute top-1/2 -translate-y-1/2 left-4 z-20 w-10 h-10 md:w-12 md:h-12 border border-white/30 hover:border-white rounded-full flex items-center justify-center text-white hover:bg-white hover:text-black transition-all opacity-0 group-hover/slider:opacity-100 cursor-pointer">
                    <ChevronLeft size={24} strokeWidth={1.5} />
                </button>
                <button className="swiper-button-next-custom absolute top-1/2 -translate-y-1/2 right-4 z-20 w-10 h-10 md:w-12 md:h-12 border border-white/30 hover:border-white rounded-full flex items-center justify-center text-white hover:bg-white hover:text-black transition-all opacity-0 group-hover/slider:opacity-100 cursor-pointer">
                    <ChevronRight size={24} strokeWidth={1.5} />
                </button>
            </div>

            <div className="container mx-auto px-4 max-w-[1200px] mb-20">
                {/* Filters */}
                <div className="flex flex-wrap justify-center gap-6 mb-12">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setActiveFilter(cat)}
                            className={`text-sm font-bold uppercase tracking-widest transition-all duration-300 relative pb-1
                                ${activeFilter === cat
                                    ? 'text-black after:w-full'
                                    : 'text-gray-500 hover:text-black after:w-0 hover:after:w-full'
                                }
                                after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-[2px] after:bg-black after:transition-all after:duration-300
                            `}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Grid Layout */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredItems.map((item) => (
                        <div key={item.id} className="group cursor-pointer">
                            <div className="relative overflow-hidden mb-4 rounded-sm bg-gray-100 aspect-[3/4]">
                                <img
                                    src={item.img || "https://via.placeholder.com/600x450?text=No+Image"}
                                    alt={item.name}
                                    className="w-full h-full object-cover transition-transform duration-700 "
                                />
                                {/* Overlay Effect */}
                                <div className="absolute inset-0 bg-white/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-6 text-center">
                                    <div className="absolute  inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-300">
                                        <p className="text-gray-800 text-sm font-semibold leading-relaxed line-clamp-3 text-center">
                                            {item.name || "No description available."}
                                            <br />
                                            {item.collection || "No collection available."}
                                        </p>
                                    </div>

                                </div>
                            </div>

                        </div>
                    ))}
                </div>

                {filteredItems.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-20 text-gray-500">
                        <AlertCircle className="w-12 h-12 mb-4 opacity-20" />
                        <p className="text-lg">No items found in this category.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Portfolio3;
