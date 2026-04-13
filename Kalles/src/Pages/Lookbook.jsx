import React from 'react';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';

const Lookbook = () => {
    const galleryImages = [
        "https://kalles-5.myshopify.com/cdn/shop/files/gallery-01.jpg?v=1718351866&width=375",
        "https://kalles-5.myshopify.com/cdn/shop/files/gallery-02.jpg?v=1718351866&width=375",
        "https://kalles-5.myshopify.com/cdn/shop/files/gallery-03.jpg?v=1718351866&width=375",
        "https://kalles-5.myshopify.com/cdn/shop/files/gallery-04.jpg?v=1718351866&width=375",
        "https://kalles-5.myshopify.com/cdn/shop/files/p1-2.jpg?v=1718351866&width=720",
        "https://kalles-5.myshopify.com/cdn/shop/files/gallery-06.jpg?v=1718351866&width=375"
    ];

    const lookbookImage = "https://kalles-5.myshopify.com/cdn/shop/files/bg-loobook.jpg?v=1718351866&width=1200";

    return (
        <div className="font-['Inter',_sans-serif]">
            {/* Header section */}
            <div
                className="relative h-[250px] md:h-[300px] flex flex-col items-center justify-center bg-cover bg-center"
                style={{ backgroundImage: `url('https://kalles-5.myshopify.com/cdn/shop/files/bg-heading.jpg?v=1717580690&width=1920')` }}
            >
                <div className="absolute inset-0 bg-black/20"></div>
                <div className="relative z-10 text-center text-white px-4">
                    <h1 className="text-3xl md:text-4xl font-bold uppercase tracking-[2px] mb-4">Lookbook In Page</h1>
                    <div className="flex items-center justify-center gap-2 text-sm md:text-base font-medium">
                        <Link to="/" className="hover:text-[#43d1f0] transition-colors">Home</Link>
                        <span>/</span>
                        <span className="opacity-80">Lookbook In Page</span>
                    </div>
                </div>
            </div>

            <div className="max-w-[1240px] mx-auto py-12 md:py-20 px-4 md:px-10">
                {/* Intro Text */}
                <div className="max-w-[1000px] mx-auto text-center mb-16">
                    <p className="text-[#666] leading-[1.8] text-[15px] md:text-base italic font-medium">
                        "Typography is the work of typesetters, composers, typographers, graphic designers, art directors, manga artists, comic book artists, graffiti artists, and now—anyone who arranges words, letters, numbers, and symbols for publication, display, or distribution—from clerical workers and newsletter writers to anyone self-publishing materials."
                    </p>
                </div>

                {/* Gallery Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-1.5 mb-16">
                    {galleryImages.map((img, idx) => (
                        <div key={idx} className="overflow-hidden group relative aspect-[3/4]">
                            <img
                                src={img}
                                alt={`Gallery item ${idx + 1}`}
                                className="w-full h-full object-cover transition-transform"
                            />
                        </div>
                    ))}
                </div>

                {/* Middle Text */}
                <div className="max-w-[1300px] mx-auto">
                    <p className="text-[#666] leading-[1.8] text-[14px] md:text-[15px]">
                        Until the Digital Age, typography was a specialized occupation. Digitization opened up typography to new generations of previously unrelated designers and lay users, and David Jury, head of graphic design at Colchester Institute in England, states that "typography is now something everybody does. As the capability to create typography has become ubiquitous, the application of principles and best practices developed over generations of skilled workers and professionals has diminished. Ironically, at a time when scientific techniques..."
                    </p>
                </div>
            </div>
            <div className='border border-black'>
                {/* Lookbook Item 3 */}
                <div className="flex-1 relative overflow-hidden group">
                    <img src={lookbookImage} alt="Lookbook 3" className="w-full h-full object-cover transition-all duration-700" />

                    {/* Hotspots */}
                    <div className="absolute top-[58%] left-[90%] animate-pulse">
                        <button className="w-8 h-8 rounded-full bg-[#43d1f0] text-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                            <Plus size={18} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Lookbook;
