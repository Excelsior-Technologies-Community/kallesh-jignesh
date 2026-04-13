import React from 'react';
import { X, Truck, RotateCcw } from 'lucide-react';

const DeliveryReturnModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white w-full max-w-[600px] rounded-sm relative max-h-[90vh] overflow-y-auto shadow-2xl">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-900 transition-colors"
        >
          <X size={24} />
        </button>

        <div className="p-8">
           <h2 className="text-[24px] font-bold text-zinc-900 mb-8 text-center uppercase tracking-widest italic">Delivery & Return</h2>
           
           <div className="space-y-12 animate-fade-in-up-manual">
              <div className="flex items-start gap-6">
                <div className="w-14 h-14 flex-shrink-0 flex items-center justify-center bg-zinc-900 text-white rounded-md shadow-lg">
                  <Truck size={32} />
                </div>
                <div>
                  <h3 className="text-[18px] font-black uppercase tracking-wider mb-2 text-zinc-900 italic">Delivery Information</h3>
                  <p className="text-[14px] text-zinc-500 leading-relaxed italic">
                    All orders are processed within 1-2 business days. Shipping charges for your order will be calculated and displayed at checkout. 
                    Free delivery for orders over $150.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-6 pt-4 border-t border-zinc-100">
                <div className="w-14 h-14 flex-shrink-0 flex items-center justify-center bg-cyan-400 text-white rounded-md shadow-lg shadow-cyan-100">
                  <RotateCcw size={32} />
                </div>
                <div>
                  <h3 className="text-[18px] font-black uppercase tracking-wider mb-2 text-zinc-900 italic">Return Policy</h3>
                  <p className="text-[14px] text-zinc-500 leading-relaxed italic">
                    We have a 30-day return policy, which means you have 30 days after receiving your item to request a return. 
                    To be eligible for a return, your item must be in the same condition that you received it.
                  </p>
                </div>
              </div>

              <div className="p-6 bg-zinc-50 rounded-sm italic text-zinc-500 text-[13px] border-l-4 border-zinc-900">
                 Need more help? <span className="text-zinc-900 font-bold hover:text-cyan-500 cursor-pointer transition-colors">Contact our support team</span> or visit our FAQs page.
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default DeliveryReturnModal;
