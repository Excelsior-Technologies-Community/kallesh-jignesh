import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductCard from '../Components/ProductCard';

const Section3 = () => {
    const [allProducts, setAllProducts] = useState([]);
    const [visibleLimit, setVisibleLimit] = useState(8);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                // Fetch all products
                const response = await axios.get('http://localhost:5000/api/products');
                setAllProducts(response.data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching trending products:", error);
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    const visibleProducts = allProducts.slice(0, visibleLimit);

    const handleLoadMore = () => {
        setVisibleLimit(allProducts.length);
    };

    return (
        <section className="py-10 lg:py-16 -mt-8 lg:mt-16 px-4 max-w-[1240px] mx-auto overflow-hidden">
            {/* Header */}
            <div className="text-center mb-12">
                <div className="flex items-center justify-center gap-4 mb-2">
                    <div className="h-[2px] w-16 bg-black"></div>
                    <h2 className="text-[18px] text-center font-bold tracking-[3px] uppercase">TRENDING</h2>
                    <div className="h-[2px] w-16 bg-black"></div>
                </div>
                <p className="text-gray-500 italic font-serif text-[15px]">Top view in this week</p>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-10">
                {loading ? (
                    // Skeleton Loaders
                    [...Array(8)].map((_, i) => (
                        <div key={i} className="animate-pulse">
                            <div className="bg-gray-200 aspect-[3/4] rounded-xl mb-4"></div>
                            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                        </div>
                    ))
                ) : visibleProducts.length > 0 ? (
                    visibleProducts.map(product => (
                        <ProductCard key={product.id} product={product} />
                    ))
                ) : (
                    <div className="col-span-full text-center text-gray-400 py-10">
                        No trending products found.
                    </div>
                )}
            </div>

            {/* Load More */}
            {visibleLimit < allProducts.length && (
                <div className="text-center mt-16">
                    <button
                        onClick={handleLoadMore}
                        className="px-10 py-3 border-2 border-gray-900 rounded-full text-[14px] font-bold hover:bg-[#222] hover:text-white hover:border-[#222] transition-all duration-300"
                    >
                        Load more
                    </button>
                </div>
            )}
        </section>
    );
};

export default Section3;
