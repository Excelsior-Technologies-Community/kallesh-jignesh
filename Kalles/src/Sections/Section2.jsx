import React from 'react';
import { Link } from 'react-router-dom';

const categories = [
    {
        id: 1,
        title: "Women",
        image: "https://kalles-5.myshopify.com/cdn/shop/files/1_2a9471ff-024d-40f7-a4b3-a15a058ff334_2022-03-24.jpg?v=1717405998&width=700",
        link: "/sale",
        gridArea: "women"
    },
    {
        id: 2,
        title: "Accessories",
        image: "https://kalles-5.myshopify.com/cdn/shop/files/2_2022-03-02.jpg?v=1746862922&width=500",
        link: "/sale",
        gridArea: "accessories"
    },
    {
        id: 3,
        title: "Footwear",
        image: "https://kalles-5.myshopify.com/cdn/shop/files/3_2022-03-02.jpg?v=1717405997&width=300",
        link: "/sale",
        gridArea: "footwear"
    },
    {
        id: 4,
        title: "Watches",
        image: "https://kalles-5.myshopify.com/cdn/shop/files/4_f8612457-70c3-4a0f-b808-0f322a71741c_2022-03-02.jpg?v=1717405997&width=300",
        link: "/sale",
        gridArea: "watches"
    }
];

const Section2 = () => {
    return (
        <section className="py-10 px-4">
            <div className="max-w-[1200px] mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-5 md:h-[600px]">
                    {/* Women - Large Tile */}
                    <Link to={categories[0].link} className="md:col-span-2 relative group overflow-hidden cursor-pointer h-[400px] md:h-full">
                        <img
                            src={categories[0].image}
                            alt={categories[0].title}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 bg-white px-10 py-2.5 text-black font-medium shadow-sm text-sm tracking-wide cursor-pointer hover:bg-black hover:text-white transition-all duration-300">
                            {categories[0].title}
                        </div>
                    </Link>

                    {/* Middle Column - Accessories & Footwear */}
                    <div className="md:col-span-1 flex flex-col gap-5 h-full">
                        {/* Accessories */}
                        <Link to={categories[1].link} className="flex relative group overflow-hidden cursor-pointer bg-[#f6f6f6] flex items-center justify-center h-[280px] md:h-auto">
                            <img
                                src={categories[1].image}
                                alt={categories[1].title}
                                className="max-w-full max-h-full border object-contain transition-transform duration-700 group-hover:scale-110"
                            />
                            <div className="absolute bottom-5 left-1/2 -translate-x-1/2 bg-white px-8 py-2.5 text-black font-medium shadow-sm text-sm tracking-wide cursor-pointer hover:bg-black hover:text-white transition-all duration-300">
                                {categories[1].title}
                            </div>
                        </Link>
                        {/* Footwear */}
                        <Link to={categories[2].link} className="flex relative group overflow-hidden cursor-pointer bg-[#f6f6f6] flex items-center justify-center h-[280px] md:h-auto">
                            <img
                                src={categories[2].image}
                                alt={categories[2].title}
                                className="max-w-full max-h-full object-contain transition-transform duration-700 group-hover:scale-110"
                            />
                            <div className="absolute bottom-5 left-1/2 -translate-x-1/2 bg-white px-8 py-2.5 text-black font-medium shadow-sm text-sm tracking-wide cursor-pointer hover:bg-black hover:text-white transition-all duration-300">
                                {categories[2].title}
                            </div>
                        </Link>
                    </div>

                    {/* Watches - Tall Tile */}
                    <Link to={categories[3].link} className="md:col-span-1 relative group overflow-hidden cursor-pointer flex items-center justify-center h-[400px] md:h-full">
                        <img
                            src={categories[3].image}
                            alt={categories[3].title}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 bg-white px-10 py-2.5 text-black font-medium shadow-sm text-sm tracking-wide cursor-pointer hover:bg-black hover:text-white transition-all duration-300">
                            {categories[3].title}
                        </div>
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default Section2;
