import React from 'react';
import { X } from 'lucide-react';

const SizeGuideModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white w-full max-w-[700px] rounded-sm relative max-h-[90vh] overflow-y-auto">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-900 transition-colors"
        >
          <X size={24} />
        </button>

        <div className="p-8">
          <h2 className="text-[24px] font-bold text-zinc-900 mb-6 text-center uppercase tracking-widest italic">Size Guide</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[14px] border-collapse">
              <thead>
                <tr className="bg-zinc-50 border-b border-zinc-200">
                  <th className="p-4 font-bold text-zinc-900 uppercase">Size</th>
                  <th className="p-4 font-bold text-zinc-900 uppercase">Bust (CM)</th>
                  <th className="p-4 font-bold text-zinc-900 uppercase">Waist (CM)</th>
                  <th className="p-4 font-bold text-zinc-900 uppercase">Hip (CM)</th>
                </tr>
              </thead>
              <tbody>
                {['S', 'M', 'L', 'XL'].map((size, idx) => (
                  <tr key={idx} className="border-b border-zinc-100 last:border-0 hover:bg-zinc-50/50 transition-colors">
                    <td className="p-4 font-bold text-zinc-900">{size}</td>
                    <td className="p-4 text-zinc-500 italic">80-85</td>
                    <td className="p-4 text-zinc-500 italic">65-70</td>
                    <td className="p-4 text-zinc-500 italic">90-95</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-8 space-y-4 text-[14px] text-zinc-500 leading-relaxed italic">
            <p>
              * Please note that this is a general size guide and some items may vary in measurement depending on the style and fabric.
            </p>
            <p>
              * If you are between sizes, we recommend choosing the larger size for a more comfortable fit.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SizeGuideModal;
