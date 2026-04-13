import React from 'react';
import { Link } from 'react-router-dom';
import { Search, ArrowLeft, Home, Sparkles, ShoppingBag, Shirt, Heart, LifeBuoy } from 'lucide-react';

const Page404 = () => {
    return (
        <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-white px-4 py-20 font-sans">
            {/* Soft Background Accents */}
            <div className="absolute top-[-10%] right-[-5%] w-[60%] h-[60%] bg-blue-50/50 blur-[100px] rounded-full pointer-events-none" />
            <div className="absolute bottom-[-10%] left-[-5%] w-[60%] h-[60%] bg-indigo-50/50 blur-[100px] rounded-full pointer-events-none" />
            
            <div className="relative z-10 max-w-5xl w-full text-center">
                {/* Visual Section */}
                <div className="relative inline-block mb-16">
                    {/* Floating Elements - Abstract */}
                    <div className="absolute -top-12 -left-12 w-24 h-24 bg-indigo-100/40 rounded-3xl rotate-12 animate-pulse" />
                    <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-slate-100/60 rounded-full animate-bounce" style={{ animationDuration: '4s' }} />
                    
                    <h1 className="text-[160px] md:text-[320px] font-black leading-none tracking-tighter select-none text-zinc-900/5 drop-shadow-sm italic">
                        404
                    </h1>
                    
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full">
                        <h2 className="text-4xl md:text-7xl font-bold text-zinc-900 tracking-tight mb-4">
                            Page Not Found
                        </h2>
                    </div>
                </div>

                {/* Content Section */}
                <div className="max-w-2xl mx-auto space-y-8">
                    <p className="text-zinc-500 text-lg md:text-2xl font-medium leading-relaxed">
                        The page you are looking for has been moved or doesn't exist anymore. 
                        Let's get you back to the collection.
                    </p>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-5 pt-8">
                        <Link 
                            to="/" 
                            className="group relative flex items-center gap-3 px-10 py-5 bg-zinc-900 text-white rounded-full font-bold uppercase tracking-widest overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 active:scale-95"
                        >
                            <Home size={20} className="group-hover:scale-110 transition-transform" />
                            Back to Home
                        </Link>
                        
                        <button 
                            onClick={() => window.history.back()}
                            className="group flex items-center gap-3 px-10 py-5 bg-white text-zinc-900 border-2 border-zinc-200 rounded-full font-bold uppercase tracking-widest hover:border-zinc-900 hover:bg-zinc-50 transition-all duration-300 hover:-translate-y-1 active:scale-95"
                        >
                            <ArrowLeft size={20} className="group-hover:-translate-x-2 transition-transform" />
                            Go Back
                        </button>
                    </div>
                </div>
            </div>

            {/* Decorative Grid - Light */}
            <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none" 
                 style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        </div>
    );
};

export default Page404;
