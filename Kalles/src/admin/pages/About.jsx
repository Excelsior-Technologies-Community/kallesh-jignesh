import React from 'react';
import { Quote, Facebook, Instagram } from 'lucide-react';

const About = () => {
    const team = [
        {
            name: "Lisa John",
            role: "Fashion Design",
            image: "https://kalles-5.myshopify.com/cdn/shop/files/mem-01.jpg?v=1718351549&width=500"
        },
        {
            name: "Jane Doe",
            role: "Director",
            image: "https://kalles-5.myshopify.com/cdn/shop/files/mem-02.jpg?v=1718351549&width=500"
        },
        {
            name: "Cartherin Forres",
            role: "Marketing Director",
            image: "https://kalles-5.myshopify.com/cdn/shop/files/mem-03.jpg?v=1718351550&width=500"
        }
    ];

    // Custom Behance icon since it might not be in Lucide
    const Behance = ({ size = 20, className }) => (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <path d="M12 9h4.5M17.5 7h4M16.5 7h5M2.5 12.5h5c1.1 0 2-.9 2-2v-4c0-1.1-.9-2-2-2h-5v8zm0 0v4c0 1.1.9 2 2 2h3.5c1.1 0 2-.9 2-2v-1.5c0-.98-.71-1.84-1.63-1.95M13.5 12.5h3.5a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2h-3.5v-6z" />
        </svg>
    );

    return (
        <div className="w-full">
            {/* Hero Section */}
            <div
                className="relative h-[160px] w-full bg-cover bg-center flex flex-col items-center justify-center text-white text-center px-4"
                style={{
                    backgroundImage: "url('https://kalles-5.myshopify.com/cdn/shop/files/shop-banner.jpg?v=1717570597&width=1920')"
                }}
            >
                <div className="absolute inset-0 bg-black/50"></div>
                <div className="relative z-10 space-y-4">
                    <h1 className="text-xl md:text-2xl font-semibold tracking-tight">About us</h1>
                    <p className=" md:text-md font-medium tracking-wide">Follow your passion, and success will follow you</p>
                </div>
            </div>

            <div className="max-w-[1200px] mx-auto px-4 py-10 space-y-10">
                {/* Mission & Stories */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">
                    <div className="space-y-6">
                        <h2 className="text-xl font-bold uppercase tracking-widest text-slate-900">OUR MISSION</h2>
                        <p className="text-slate-600 leading-relaxed">
                            doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo nemo enim ipsam.
                        </p>
                    </div>
                    <div className="space-y-6">
                        <h2 className="text-xl font-bold uppercase tracking-widest text-slate-900">OUR STORIES</h2>
                        <p className="text-slate-600 leading-relaxed">
                            fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                        </p>
                    </div>
                </div>

                {/* Approach & Philosophy */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">
                    <div className="space-y-6">
                        <h2 className="text-xl font-bold uppercase tracking-widest text-slate-900">OUR APPROACH</h2>
                        <p className="text-slate-600 leading-relaxed">
                            Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem.
                        </p>
                    </div>
                    <div className="space-y-6">
                        <h2 className="text-xl font-bold uppercase tracking-widest text-slate-900">OUR PHILOSOPHY</h2>
                        <p className="text-slate-600 leading-relaxed">
                            Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur? Quis nostrum exercitationem ullam.
                        </p>
                    </div>
                </div>

                {/* Quote Block */}
                <div className="glass-card p-4 md:px-14 md:py-8 rounded-2xl text-center relative">
                    <Quote className="w-10 h-10 text-[#878787] absolute top-5 left-5 mb-6 opacity-50" />
                    <p className="text-md md:text-lg text-[#878787] italic font-serif leading-loose  mx-auto">
                        "I am text block. Click edit button to change this text. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo. Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur? Quis nostrum exercitationem ullam."
                    </p>
                </div>

                {/* Team Section */}
                <div className="text-center space-y-12">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {team.map((member, index) => (
                            <div key={index} className="group cursor-pointer">
                                <div className="aspect-[3/4] overflow-hidden mb-6 relative ">
                                    <img
                                        src={member.image}
                                        alt={member.name}
                                        className="w-full h-[85%] object-cover transition-transform duration-700"
                                    />
                                    {/* Hover Overlay */}
                                    <div className="absolute inset-0 bg-white/90 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center gap-6 pb-10">
                                        <a href="#" className="transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 delay-75 hover:scale-110">
                                            <Facebook size={20} className="text-black hover:text-indigo-600 transition-colors" />
                                        </a>
                                        <a href="#" className="transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 delay-100 hover:scale-110">
                                            <Instagram size={20} className="text-black hover:text-indigo-600 transition-colors" />
                                        </a>
                                        <a href="#" className="transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 delay-150 hover:scale-110">
                                            <Behance size={20} className="text-black hover:text-indigo-600 transition-colors" />
                                        </a>
                                    </div>
                                    <div className="space-y-1 py-2 ">
                                        <h3 className="text-lg font-bold text-slate-900">{member.name}</h3>
                                        <p className="text-sm text-slate-500 uppercase tracking-wide">{member.role}</p>
                                    </div>
                                </div>

                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default About;
