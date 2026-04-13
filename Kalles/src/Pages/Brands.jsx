import React, { useState } from "react";
import { Link } from "react-router-dom";
// import bannerImage from "../assets/images/shop/shop-banner.jpg"; 

const BRANDS = [
    // 123
    "5 October",
    "6397",
    // A
    "A Detacher",
    "Album di Famiglia",
    "Aleksandr Manamis",
    "Aude Men's",
    "Amalia Toro",
    "Annette Gortz",
    "Antoni & Alison",
    "Artemas Quibble",
    "AS98",
    "Atelier Oblique",
    "AVN",
    // B
    "Baby & Company",
    "Bedford 11th",
    "Blue Buck",
    "Bradar",
    "By Malene Birger",
    // C
    "CA4LA",
    "Commune de Paris",
    // D
    "David Beaucieu",
    "Demoo",
    // E
    "Echappees Belles",
    "Ekaterina Kukhareva",
    "Epice",
    "Etiquette",
    "Evam Eva",
    // F
    "Fabiana Pigna",
    "Flagpole Swim",
    "Flamingos",
    "Frank and Eileen",
    "Fred Perry",
    // G
    "Ginette NY",
    "Giselle",
    "Guglielminotti",
    "Guibert",
    "G-Lab",
    // H
    "Hache",
    "Hannes Roether Men's",
    "Hannes Roether Women's",
    "Hannah Wezel",
    "Happy Haus",
    "Harvey Faircloth",
    "Hazel Brown",
    "Homecore",
    "Human",
    // I
    "Ivan Grundahl",
    // J
    "Jaga",
    "Jesse Kamm",
    "Jewels by Piper",
    // K
    "Kolasama Jewelry",
    "Kristensen Du Nord",
    // L
    "La Prestick Ouiston",
    "Labo Art",
    "Labo.Art Men's",
    "Lareida",
    "Laura Urbinati",
    "Le Sarte Pettegole",
    "Lola",
    "Lost & Found",
    "Louiza Babouryan",
    // M
    "Mad et Len",
    "Manuela Guibal",
    "Margaret Howell Men's",
    "Margaret Howell Women's",
    "Marsell Men's",
    "Marsell Women's",
    "Massimo Palomba",
    "Maurizio Miri",
    "Mirit Weinstock",
    // N
    "Nells Nelson",
    "NICO",
    "Nigel Cabourn",
    "N.L.S.T Men's",
    "Nocturne #22",
    "Norden",
    // O
    "OAMC",
    "Odeeh",
    "Officine Creative",
    "Only Hearts",
    "Organic by John Patrick",
    // P
    "Péro",
    "Pete Sorensen",
    "Philippe Model Women's",
    "Pijama",
    "Plutot & C",
    "Printed Artworks",
    // R
    "R13 Men's",
    "R13 Women's",
    "Raffauf",
    "Rose and Rose",
    // S
    "Saga de Crot",
    "Sara Lanzi",
    "Sara Roka",
    "Sartoria Vico",
    "Sehnsucht",
    "Shiro Sakai",
    "Shoto Shoe",
    "Sibel Saral",
    "Simon Miller",
    "Skom Studio",
    "Smoke x Mirrors",
    "Spencer Vladimir",
    // T
    "Taschen",
    "Tei et Lantin",
    "The Gigi",
    "Tintoria Mattei 954",
    // U
    "Uma Wang",
    // V
    "Valla Gabriel",
    "Verte Essentials",
    "Vittorio Branchizio",
    // W
    "White / Space",
    "Wooster + Lardini",
    // Y
    "Yestadt Millinery",
    "YOGY",
    "YMC Men's",
    "YMC Women's",
    "Yoshi Kondo",
    // Z
    "Zacarias 1925",
];

const FilterBar = ({ activeFilter, onFilterClick }) => {
    const filters = [
        "SHOW ALL",
        "123",
        ..."ABCDEFGHIJKLMNOPQRSTUVWXYZ".split(""),
    ];

    return (
        <div className="flex flex-wrap  items-center border border-gray-200 my-8 text-sm">
            {filters.map((filter) => (
                <button
                    key={filter}
                    onClick={() => onFilterClick(filter)}
                    className={`px-3.5 py-1 uppercase border-x transition-colors duration-200 ${activeFilter === filter
                        ? "font-bold text-black"
                        : "text-gray-500 font-semibold hover:text-black"
                        }`}
                >
                    {filter}
                </button>
            ))}
        </div>
    );
};

const Brands = () => {
    const [activeFilter, setActiveFilter] = useState("SHOW ALL");

    // Helper to get the group key (123, A, B, etc.)
    const getGroupKey = (brandName) => {
        const firstChar = brandName.charAt(0).toUpperCase();
        if (/[0-9]/.test(firstChar)) {
            return "123";
        }
        return firstChar;
    };

    // Group brands
    const groupedBrands = BRANDS.reduce((groups, brand) => {
        const key = getGroupKey(brand);
        if (!groups[key]) {
            groups[key] = [];
        }
        groups[key].push(brand);
        return groups;
    }, {});

    // Sort keys: 123 first, then A-Z
    const sortedKeys = Object.keys(groupedBrands).sort((a, b) => {
        if (a === "123") return -1;
        if (b === "123") return 1;
        return a.localeCompare(b);
    });

    // Filter based on selection
    const visibleKeys =
        activeFilter === "SHOW ALL"
            ? sortedKeys
            : sortedKeys.filter((key) => key === activeFilter);

    return (
        <div className="w-full">
            {/* Banner Section */}
            <div
                className="relative w-full h-[80px] md:h-[120px] bg-cover bg-center flex items-center justify-center"
                style={{
                    backgroundImage: `url('https://kalles-5.myshopify.com/cdn/shop/files/bg-heading.jpg?v=1717580690&width=1920')`, // Using a placeholder that matches theme or fallback
                    backgroundColor: '#f5f5f5'
                }}
            >
                <div className="absolute inset-0 bg-black/50"></div>
                <div className="relative z-10 text-center text-white">
                    <h1 className="text-xl font-semibold uppercase tracking-wider mb-2">Brands</h1>
                </div>
            </div>

            <div className="container mx-auto max-w-[1200px]">
                {/* Filter Bar */}
                <FilterBar activeFilter={activeFilter} onFilterClick={setActiveFilter} />

                {/* Brands Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 mb-16">
                    {visibleKeys.map((key) => (
                        <div key={key} className=" border p-3">
                            <h2 className="text-xl font-bold  pb-2 mb-4 text-black">
                                {key}
                            </h2>
                            <ul className="space-y-1">
                                {groupedBrands[key].sort().map((brand) => (
                                    <li key={brand}>
                                        <Link
                                            to="#"
                                            onClick={(e) => e.preventDefault()}
                                            className="text-gray-500 hover:text-teal-600 transition-colors text-[15px]"
                                        >
                                            {brand}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}

                    {visibleKeys.length === 0 && (
                        <div className="col-span-full text-center py-10 text-gray-500">
                            No brands found for filter "{activeFilter}".
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Brands;
