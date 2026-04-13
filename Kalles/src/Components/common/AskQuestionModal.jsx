import React from 'react';
import { X, Mail, Send } from 'lucide-react';

const AskQuestionModal = ({ isOpen, onClose, productName, productPrice, productImage }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white w-full max-w-[500px] rounded-sm relative max-h-[90vh] overflow-y-auto shadow-2xl">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-900 transition-colors"
        >
          <X size={24} />
        </button>

        <div className="p-8">
          <h2 className="text-[24px] font-bold text-zinc-900 mb-6 text-center uppercase tracking-widest italic">Ask a Question</h2>
          
          <div className="flex items-center gap-6 p-4 bg-[#fdfafb] rounded-md border border-[#fde8eb] mb-8 animate-fade-in-up-manual">
             <div className="w-20 h-24 flex-shrink-0 bg-white rounded-sm overflow-hidden shadow-sm border border-zinc-100">
               <img src={productImage} alt={productName} className="w-full h-full object-cover" />
             </div>
             <div>
               <h3 className="text-[16px] font-black uppercase tracking-tight text-zinc-900 leading-tight mb-2 italic">{productName}</h3>
               <p className="text-[18px] font-black text-[#f15412] italic">{productPrice}</p>
             </div>
          </div>

          <form onSubmit={(e) => { e.preventDefault(); onClose(); }} className="space-y-4">
             <div className="space-y-2">
                <label className="text-[13px] font-black uppercase tracking-widest text-zinc-900 italic">Your Name</label>
                <input 
                  type="text" 
                  placeholder="Enter your name" 
                  className="w-full h-11 px-4 text-[14px] font-medium text-zinc-900 border border-zinc-100 rounded-sm focus:border-cyan-400 focus:outline-none transition-colors italic"
                  required
                />
             </div>
             <div className="space-y-2">
                <label className="text-[13px] font-black uppercase tracking-widest text-zinc-900 italic">Your Email</label>
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  className="w-full h-11 px-4 text-[14px] font-medium text-zinc-900 border border-zinc-100 rounded-sm focus:border-cyan-400 focus:outline-none transition-colors italic"
                  required
                />
             </div>
             <div className="space-y-2">
                <label className="text-[13px] font-black uppercase tracking-widest text-zinc-900 italic">Your Message</label>
                <textarea 
                  rows="4"
                  placeholder="Ask your question about this product..." 
                  className="w-full p-4 text-[14px] font-medium text-zinc-900 border border-zinc-100 rounded-sm focus:border-cyan-400 focus:outline-none transition-colors italic resize-none"
                  required
                ></textarea>
             </div>

             <button type="submit" className="w-full h-12 bg-cyan-400 hover:bg-zinc-900 text-white font-black uppercase tracking-widest text-[13px] rounded-full transition-all flex items-center justify-center gap-3 shadow-lg shadow-cyan-100 mt-4 group">
                <Send size={16} className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                SEND QUESTION
             </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AskQuestionModal;
