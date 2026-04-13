import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';

const slides = [
    {
        image: "https://kalles-5.myshopify.com/cdn/shop/files/slider-01.jpg?v=1717405801&width=1800",
        subtitle: "SUMMER 2025",
        title: "New Arrival Collection",
        btnText: "Explore Now",
        position: "left"
    },
    {
        image: "https://kalles-5.myshopify.com/cdn/shop/files/slide2.webp?v=1731485447&width=1800",
        subtitle: "NEW SEASON",
        title: "Lookbook Collection",
        btnText: "Explore Now",
        position: "left"
    },
    {
        image: "https://kalles-5.myshopify.com/cdn/shop/files/slide3.webp?v=1731485381&width=1800",
        subtitle: "SUMMER SALE",
        title: "Save up to 70%",
        btnText: "Explore Now",
        position: "right"
    }
];

const Section1 = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const startX = useRef(0);
    const containerRef = useRef(null);

    const handleNext = useCallback(() => {
        setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, []);

    const handlePrev = useCallback(() => {
        setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            handleNext();
        }, 6000); // Slightly slower for better appreciation of the 3D effect

        return () => clearInterval(interval);
    }, [handleNext]);

    const handleMouseMove = (e) => {
        if (!containerRef.current) return;
        const { left, top, width, height } = containerRef.current.getBoundingClientRect();
        const x = (e.clientX - left) / width - 0.5;
        const y = (e.clientY - top) / height - 0.5;
        setMousePos({ x, y });
    };

    const handleMouseLeaveContainer = () => {
        setMousePos({ x: 0, y: 0 });
        setIsDragging(false);
    };

    const handleDotClick = (index) => {
        setCurrentSlide(index);
    };

    const handleDragStart = (e) => {
        setIsDragging(true);
        startX.current = e.pageX || (e.touches ? e.touches[0].pageX : 0);
    };

    const handleDragEnd = (e) => {
        if (!isDragging) return;
        const endX = e.pageX || (e.changedTouches ? e.changedTouches[0].pageX : e.pageX);
        const distance = startX.current - endX;

        if (distance > 50) {
            handleNext();
        } else if (distance < -50) {
            handlePrev();
        }
        setIsDragging(false);
    };

    return (
        <>
            <style>
                {`
                @keyframes slideUp3D {
                    0% { 
                        opacity: 0; 
                        transform: translateY(60px) translateZ(-100px) rotateX(-20deg); 
                    }
                    100% { 
                        opacity: 1; 
                        transform: translateY(0) translateZ(0) rotateX(0); 
                    }
                }
                
                .perspective-container {
                    perspective: 1500px;
                }

                .animate-3d-in {
                    opacity: 0;
                    animation: slideUp3D 1.2s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
                }

                .delay-200 { animation-delay: 0.2s; }
                .delay-400 { animation-delay: 0.4s; }
                .delay-600 { animation-delay: 0.6s; }

                .slide-bg {
                    transition: transform 0.6s cubic-bezier(0.1, 0, 0.3, 1), opacity 1s ease-in-out;
                }
                
                .parallax-layer {
                    transition: transform 0.2s ease-out;
                }
                `}
            </style>
            <section
                ref={containerRef}
                className="perspective-container relative w-full h-[70vh] md:h-[95vh] overflow-hidden bg-[#111] cursor-grab active:cursor-grabbing select-none"
                onMouseMove={handleMouseMove}
                onMouseDown={handleDragStart}
                onMouseUp={handleDragEnd}
                onMouseLeave={handleMouseLeaveContainer}
                onTouchStart={handleDragStart}
                onTouchEnd={handleDragEnd}
            >
                {slides.map((slide, index) => (
                    <div
                        key={index}
                        className={`absolute inset-0 w-full h-full flex items-center transition-all duration-1000 ease-in-out ${
                            index === currentSlide ? 'opacity-100 z-10 scale-100' : 'opacity-0 z-0 scale-110 pointer-events-none'
                        }`}
                    >
                        {/* 3D Background Layer */}
                        <div 
                            className="absolute inset-0 bg-cover bg-center slide-bg"
                            style={{ 
                                backgroundImage: `url(${slide.image})`,
                                transform: `scale(1.1) translate(${mousePos.x * -20}px, ${mousePos.y * -20}px) rotateY(${mousePos.x * 2}deg) rotateX(${mousePos.y * -2}deg)`,
                                filter: index === currentSlide ? 'none' : 'blur(5px)'
                            }}
                        />
                        
                        {/* Overlay for better depth */}
                        <div className="absolute inset-0 bg-black/5 z-10 pointer-events-none" />

                        {/* Content Layer with specialized 3D Parallax */}
                        <div className={`relative w-full max-w-[1400px] mx-auto px-[5%] md:px-[8%] z-20 flex ${slide.position === 'right' ? 'md:justify-end md:text-right' : 'md:justify-start md:text-left'} justify-center text-center`}>
                            <div 
                                className="parallax-layer max-w-[700px]"
                                style={{
                                    transform: `translate(${mousePos.x * 40}px, ${mousePos.y * 40}px) translateZ(50px)`
                                }}
                            >
                                <p className={`inline-block py-1 px-3 bg-white/10 backdrop-blur-md text-[10px] md:text-xs font-bold uppercase tracking-[4px] mb-4 text-[#222] border-l-2 border-[#222] ${index === currentSlide ? 'animate-3d-in delay-200' : ''}`}>
                                    {slide.subtitle}
                                </p>
                                <h1 className={`text-3xl md:text-6xl font-bold mb-6 md:mb-8 text-[#1a1a1a] drop-shadow-2xl ${index === currentSlide ? 'animate-3d-in delay-400' : ''}`}>
                                    {slide.title}
                                </h1>
                                <div className={`${index === currentSlide ? 'animate-3d-in delay-600' : ''}`}>
                                    <Link to={slide.subtitle.includes("SALE") ? "/sale" : "/collections"}>
                                        <button className="group relative overflow-hidden px-10 md:px-12 py-3 md:py-4 bg-[#222] text-white rounded-none text-xs md:text-sm font-bold uppercase tracking-widest hover:text-white transition-all duration-300">
                                            <span className="relative z-10">{slide.btnText}</span>
                                            <div className="absolute inset-0 bg-[#43D1F0] translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                                        </button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

                {/* Vertical Progress Indicator - Hidden on mobile */}
                <div className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 hidden md:flex flex-col gap-6 z-50">
                    {slides.map((_, index) => (
                        <div key={index} className="flex items-center gap-4 group cursor-pointer" onClick={() => handleDotClick(index)}>
                            <span className={`text-[10px] font-bold transition-all duration-300 ${index === currentSlide ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-2'}`}>
                                0{index + 1}
                            </span>
                            <div 
                                className={`w-1 transition-all duration-500 ${index === currentSlide ? 'h-12 bg-[#222]' : 'h-4 bg-black/20 group-hover:bg-black/40'}`}
                            />
                        </div>
                    ))}
                </div>

                {/* Simple Dots for Mobile */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex md:hidden gap-3 z-50">
                    {slides.map((_, index) => (
                        <button
                            key={index}
                            className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${index === currentSlide ? 'bg-[#222] w-6' : 'bg-black/20'}`}
                            onClick={() => handleDotClick(index)}
                        />
                    ))}
                </div>
                
                {/* Visual Depth Elements */}
                <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-white/20 to-transparent z-20 pointer-events-none" />
            </section>
        </>
    );
};

export default Section1;
