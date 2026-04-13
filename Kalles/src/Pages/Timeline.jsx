import React from "react";
import { motion } from "framer-motion";

const timelineData = [
    {
        year: "1980",
        phase: "PHASE 1",
        title: "Inception and Brand Establishment",
        description:
            "Inception, in the context of brand establishment, refers to the initial phase of creating and introducing a brand to the market. It involves laying down the foundational elements that will define the brand's identity, values, and positioning in the minds of consumers.",
        image: "https://kalles-5.myshopify.com/cdn/shop/files/timeline1.jpg?v=1746782498&width=767", // Replace with actual image or placeholder
    },
    {
        year: "2000",
        phase: "PHASE 2",
        title: "Debut Collection and Market Entry",
        description:
            "Entering the market with a debut collection requires careful planning, creativity, and perseverance. By following these steps and staying true to your vision, you can increase your chances of success in the fashion industry.",
        image: "https://kalles-5.myshopify.com/cdn/shop/files/timeline2.jpg?v=1746782498&width=767",
    },
    {
        year: "2010",
        phase: "PHASE 3",
        title: "Growth and Recognition",
        description:
            "During the growth and recognition phase of a brand's journey, several key elements come into play to propel its expansion and solidify its position in the market. Here's an outline of what typically occurs during this phase.",
        image: "https://kalles-5.myshopify.com/cdn/shop/files/timeline3.jpg?v=1746782499&width=767",
    },
    {
        year: "2025",
        phase: "PHASE 4",
        title: "Sustainable Initiatives",
        description:
            "Sustainable initiatives play a crucial role in the growth and development of a brand, especially in today's environmentally conscious and socially responsible market landscape. Here are some examples of sustainable initiatives that brands may undertake.",
        image: "https://kalles-5.myshopify.com/cdn/shop/files/timeline4.jpg?v=1746782498&width=767",
    },
];

const Timeline = () => {
    // Animation variants
    const itemVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
    };

    return (
        <>
            <div className="w-full bg-white relative">
                {/* Header Image Area - Optional based on design, simplified here as a spacer or title */}
                <div className="relative h-40 bg-gray-900 flex items-center justify-center mb-16">
                    <div className="absolute inset-0 overflow-hidden">
                        <img src="https://kalles-5.myshopify.com/cdn/shop/files/shopping-cart-head.jpg?v=1746690986&width=1920" alt="Timeline Header" className="w-full h-full object-cover opacity-60" />
                    </div>
                    <h1 className="relative text-white text-xl font-semibold z-10">Timeline</h1>
                </div>
            </div>
            {/* Timeline Container */}
            <div className="w-full max-w-[1200px] container mx-auto px-4 py-10 relative">
                {/* Central Vertical Line (Desktop) */}
                <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 h-full w-px bg-gray-200 top-0 z-0"></div>



                {/* Re-writing the loop content for clarity */}
                <div className="space-y-12 md:space-y-24">
                    {timelineData.map((item, index) => (
                        <div key={index} className="relative w-full">
                            {/* Year Marker */}
                            <div className="flex justify-center mb-8 md:mb-0 md:absolute md:left-1/2 md:-translate-x-1/2 md:top-0 z-20">
                                <span className="bg-[#5BC0DE] text-white px-3 py-1 text-sm font-semibold shadow-sm">{item.year}</span>
                            </div>

                            {/* Content Row */}
                            <motion.div
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true, amount: 0.2 }}
                                variants={itemVariants}
                                className={`flex flex-col md:flex-row items-center w-full ${index % 2 !== 0 ? 'md:flex-row-reverse' : ''}`}
                            >
                                {/* Image Side */}
                                <div className="w-full md:w-1/2 p-4 md:pr-12 md:pl-4">
                                    <div className={`overflow-hidden rounded-sm shadow-sm ${index % 2 !== 0 ? 'md:ml-auto' : 'md:mr-auto'}`}>
                                        <img src={item.image} alt={item.title} className="w-full h-auto object-cover transition-transform duration-500" />
                                    </div>
                                </div>

                                {/* Center Spacer */}
                                {/* <div className="hidden md:block w-px bg-transparent mx-4"></div> */}

                                {/* Text Side */}
                                <div className="w-full md:w-1/2 p-4 md:pl-12 md:pr-12 text-center md:text-left">
                                    <div className={`${index % 2 !== 0 ? 'md:text-right' : 'md:text-left'}`}>
                                        <h4 className="text-[#5BC0DE] text-sm uppercase tracking-wider font-semibold mb-2">{item.phase}</h4>
                                        <h3 className="text-2xl font-bold text-gray-900 mb-4">{item.title}</h3>
                                        <p className="text-gray-600 leading-relaxed text-sm">
                                            {item.description}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Dot on the line */}
                            <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 top-[220px] z-10">
                                <div className="w-3 h-3 bg-[#5BC0DE] rounded-full border-2 border-white shadow-sm"></div>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </>
    );
};

export default Timeline;
