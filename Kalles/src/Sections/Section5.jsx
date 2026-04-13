import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductCard from '../Components/ProductCard';

const Section5 = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [visibleProducts, setVisibleProducts] = useState(8);

    useEffect(() => {
        const fetchBestSellers = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/products?category=6');
                setProducts(response.data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching best sellers:", error);
                setLoading(false);
            }
        };

        fetchBestSellers();
    }, []);

    const handleLoadMore = () => {
        setVisibleProducts(prev => prev + 8);
    };

    return (
        <section className="py-20 px-4 max-w-[1240px] mx-auto border-b border-[#e5e5e5]">
            {/* Header */}
            <div className="flex flex-col items-center mb-12">
                <div className="flex items-center gap-6 mb-2">
                    <div className="w-16 h-[2px] bg-black"></div>
                    <h2 className="text-[18px] text-center font-bold tracking-widest text-[#222]">BEST SELLER</h2>
                    <div className="w-16 h-[2px] bg-black"></div>
                </div>
                <p className="text-[#878787] italic font-serif">Top sale in this week</p>
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-6 gap-y-10">
                {loading ? (
                    [...Array(8)].map((_, i) => (
                        <div key={i} className="animate-pulse">
                            <div className="bg-gray-100 aspect-[3/4] rounded mb-4"></div>
                            <div className="h-4 bg-gray-100 rounded w-3/4 mb-2"></div>
                            <div className="h-4 bg-gray-100 rounded w-1/4"></div>
                        </div>
                    ))
                ) : products.length > 0 ? (
                    products.slice(0, visibleProducts).map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))
                ) : (
                    <div className="col-span-full py-20 text-center text-gray-500 font-medium font-serif italic">
                        No best sellers found.
                    </div>
                )}
            </div>

            {/* Load More Button */}
            {!loading && products.length > visibleProducts && (
                <div className="flex justify-center mt-12">
                    <button
                        onClick={handleLoadMore}
                        className="px-10 py-3 border-2 border-[#222] rounded-full text-[14px] font-bold hover:bg-[#222] hover:text-white transition-all duration-300"
                    >
                        Load more
                    </button>
                </div>
            )}
        </section>
    );
};

export default Section5;
