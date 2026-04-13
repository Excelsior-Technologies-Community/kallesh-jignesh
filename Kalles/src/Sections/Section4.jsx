import React from 'react';
import { Link } from 'react-router-dom';

const Section4 = () => {
    return (
        <section className="lg:py-10 px-4 max-w-[1240px] mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Banner - Lookbook */}
                <Link to="/lookbook" className="relative group overflow-hidden cursor-pointer h-[250px] md:h-[350px]">
                    <img
                        src="https://kalles-5.myshopify.com/cdn/shop/files/5_2022-03-02.jpg?v=1717725345&width=720"
                        alt="Lookbook 2026"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:rotate-12 group-hover:scale-[1.25]"
                    />
                    <div className="absolute inset-0 bg-black/5 flex flex-col items-center justify-center text-white text-center">
                        <h4 className="text-[14px] md:text-[28px] font-bold tracking-[2px] uppercase mb-2">LOOKBOOK 2026</h4>
                        <h2 className="text-[20px] md:text-[18px] font-bold uppercase tracking-tight">MAKE LOVE THIS LOOK</h2>
                    </div>
                </Link>

                {/* Right Banner - Summer Sale */}
                <Link to="/sale" className="relative group overflow-hidden cursor-pointer h-[250px] md:h-[350px]">
                    <img
                        src="https://kalles-5.myshopify.com/cdn/shop/files/6_2022-03-02_50f70a60-cd60-4f21-a6c5-9cac17242994.jpg?v=1718351850&width=400"
                        alt="Summer Sale"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/10 flex flex-col items-center justify-center text-white text-center">
                        <h4 className="text-[14px] md:text-[16px] font-bold tracking-[2px] uppercase mb-2">SUMMER SALE</h4>
                        <h2 className="text-[34px] md:text-[60px] font-bold uppercase leading-none">UP TO 70%</h2>
                    </div>
                </Link>
            </div>
        </section>
    );
};

export default Section4;
