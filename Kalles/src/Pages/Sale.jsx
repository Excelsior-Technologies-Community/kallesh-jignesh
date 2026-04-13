import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

const Sale = () => {
  const collections = [
    {
      id: 1,
      title: 'Accessories',
      img: 'https://kalles-5.myshopify.com/cdn/shop/files/p34-1_79126e14-3594-4938-8e67-0a98279d27ef.jpg?v=1717404749&width=800'
    },
    {
      id: 2,
      title: 'All',
      img: 'https://kalles-5.myshopify.com/cdn/shop/files/eberj4183019d5e_q1_2-0_4e036e1e-79fe-4129-958e-9a1a2698ce6a.jpg?v=1717404543&width=1000'
    },
    {
      id: 3,
      title: 'Armchairs',
      img: 'https://kalles-5.myshopify.com/cdn/shop/collections/f2.webp?v=1759132255&width=360'
    },
    {
      id: 4,
      title: 'Automated Collection',
      img: 'https://kalles-5.myshopify.com/cdn/shop/files/image4_6.png?v=1759367586&width=1920'
    },
    {
      id: 5,
      title: 'Bags',
      img: 'https://kalles-5.myshopify.com/cdn/shop/files/dance_nylon_main_7ac80de8-ce83-477a-9890-bffad32624e8.png?v=1717405226&width=1000'
    },
    {
      id: 6,
      title: 'Bedroom Collection',
      img: 'https://kalles-5.myshopify.com/cdn/shop/collections/slide-bedroom-1.png?v=1759214388&width=1920'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div 
        className="relative h-[200px] flex items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: `url('https://kalles-5.myshopify.com/cdn/shop/files/bg-heading.jpg?v=1717580690&width=1920')` }}
      >
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative text-center animate-rotate-in">
          <h1 className="text-[32px] md:text-[42px] font-black text-white mb-2 tracking-tight">Collections</h1>
          <nav className="text-[14px] font-bold text-white flex items-center justify-center space-x-1">
            <Link to="/" className="hover:text-cyan-400 transition-colors">Home</Link>
            <ChevronRight size={14} strokeWidth={3} className="text-white/70" />
            <span className="opacity-70">Collections</span>
          </nav>
        </div>
      </div>

      {/* Collections Grid */}
      <div className="container mx-auto px-4 md:px-20 lg:px-48 py-16 max-w-[1600px]">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {collections.map((item, index) => (
            <div 
              key={item.id} 
              className="group relative cursor-pointer overflow-hidden rounded-[4px] animate-rotate-in"
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              <div className="aspect-square bg-zinc-100 overflow-hidden">
                <img 
                  src={item.img} 
                  alt={item.title} 
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                />
              </div>
              <div className="absolute bottom-10 left-1/2 -translate-x-1/2">
                <div className="bg-white px-8 py-3 rounded-[2px] shadow-lg min-w-[160px] text-center transform transition-all duration-300 group-hover:-translate-y-2 group-hover:bg-zinc-900 whitespace-nowrap">
                  <span className="text-[13px] font-black text-zinc-900 uppercase tracking-wide transition-colors duration-300 group-hover:text-white">
                    {item.title}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="mt-16 flex justify-center items-center space-x-6 text-[14px] font-bold text-zinc-400">
          <span className="text-zinc-900 cursor-default border-b-2 border-zinc-900 px-1 pb-0.5">1</span>
          <button className="hover:text-zinc-900 transition-colors">2</button>
          <button className="hover:text-zinc-900 transition-colors">3</button>
          <span>...</span>
          <button className="hover:text-zinc-900 transition-colors">13</button>
          <button className="hover:text-cyan-500 transition-colors flex items-center">
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sale;
