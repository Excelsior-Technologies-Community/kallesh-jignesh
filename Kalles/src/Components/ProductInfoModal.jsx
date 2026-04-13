import React from 'react';
import { X } from 'lucide-react';

const ProductInfoModal = ({ activeModal, setActiveModal, product }) => {
    if (!activeModal) return null;

    return (
        <div className="fixed inset-0 z-[3000] flex items-center justify-center p-4">
            {/* Increase z-index to 3000 to show above QuickViewModal (which is usually around 2000) */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" onClick={() => setActiveModal(null)}></div>
            <div className={`relative bg-white w-full ${activeModal === 'ask' ? 'max-w-[600px]' : 'max-w-[800px]'} shadow-2xl flex flex-col animate-in zoom-in duration-300`}>
                <button onClick={() => setActiveModal(null)} className="absolute top-0 right-0 z-50 w-12 h-12 bg-[#222] text-white flex items-center justify-center hover:bg-black transition-colors">
                    <X size={24} />
                </button>

                <div className="overflow-y-auto w-full max-h-[90vh]">
                {activeModal === 'size' && (
                    <div className="p-8 md:p-12">
                        <h2 className="text-[24px] font-bold text-center mb-8 text-[#222]">Size guide</h2>
                        <div className="overflow-x-auto mb-10">
                            <table className="w-full text-left border-collapse min-w-[500px]">
                                <thead>
                                    <tr>
                                        <th className="py-3 px-4 border border-[#eee] text-[#222] font-bold bg-[#f9f9f9]">Size</th>
                                        <th className="py-3 px-4 border border-[#eee] text-[#222] font-bold bg-[#f9f9f9]">US</th>
                                        <th className="py-3 px-4 border border-[#eee] text-[#222] font-bold bg-[#f9f9f9]">Bust</th>
                                        <th className="py-3 px-4 border border-[#eee] text-[#222] font-bold bg-[#f9f9f9]">Waist</th>
                                        <th className="py-3 px-4 border border-[#eee] text-[#222] font-bold bg-[#f9f9f9]">Low Hip</th>
                                    </tr>
                                </thead>
                                <tbody className="text-[#666] text-[15px]">
                                    <tr>
                                        <td className="py-3 px-4 border border-[#eee]">XS</td>
                                        <td className="py-3 px-4 border border-[#eee]">2</td>
                                        <td className="py-3 px-4 border border-[#eee]">32</td>
                                        <td className="py-3 px-4 border border-[#eee]">24 - 25</td>
                                        <td className="py-3 px-4 border border-[#eee]">33 - 34</td>
                                    </tr>
                                    <tr>
                                        <td className="py-3 px-4 border border-[#eee]">S</td>
                                        <td className="py-3 px-4 border border-[#eee]">4</td>
                                        <td className="py-3 px-4 border border-[#eee]">34 - 35</td>
                                        <td className="py-3 px-4 border border-[#eee]">26 - 27</td>
                                        <td className="py-3 px-4 border border-[#eee]">35 - 26</td>
                                    </tr>
                                    <tr>
                                        <td className="py-3 px-4 border border-[#eee]">M</td>
                                        <td className="py-3 px-4 border border-[#eee]">6</td>
                                        <td className="py-3 px-4 border border-[#eee]">36 - 37</td>
                                        <td className="py-3 px-4 border border-[#eee]">28 - 29</td>
                                        <td className="py-3 px-4 border border-[#eee]">38 - 40</td>
                                    </tr>
                                    <tr>
                                        <td className="py-3 px-4 border border-[#eee]">L</td>
                                        <td className="py-3 px-4 border border-[#eee]">8</td>
                                        <td className="py-3 px-4 border border-[#eee]">38 - 29</td>
                                        <td className="py-3 px-4 border border-[#eee]">30 - 31</td>
                                        <td className="py-3 px-4 border border-[#eee]">42 - 44</td>
                                    </tr>
                                    <tr>
                                        <td className="py-3 px-4 border border-[#eee]">XL</td>
                                        <td className="py-3 px-4 border border-[#eee]">10</td>
                                        <td className="py-3 px-4 border border-[#eee]">40 - 41</td>
                                        <td className="py-3 px-4 border border-[#eee]">32 - 33</td>
                                        <td className="py-3 px-4 border border-[#eee]">45 - 47</td>
                                    </tr>
                                    <tr>
                                        <td className="py-3 px-4 border border-[#eee]">XXL</td>
                                        <td className="py-3 px-4 border border-[#eee]">12</td>
                                        <td className="py-3 px-4 border border-[#eee]">42 - 43</td>
                                        <td className="py-3 px-4 border border-[#eee]">34 - 35</td>
                                        <td className="py-3 px-4 border border-[#eee]">48 - 50</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        
                        <h3 className="text-[20px] font-bold text-[#222] mb-6">Measuring Tips</h3>
                        <div className="flex flex-col md:flex-row gap-8 items-center">
                            <div className="flex-1 space-y-6">
                                <div>
                                    <h4 className="font-bold text-[#222] text-[16px] mb-1">Bust</h4>
                                    <p className="text-[#666] text-[15px]">Measure around the fullest part of your bust.</p>
                                </div>
                                <div>
                                    <h4 className="font-bold text-[#222] text-[16px] mb-1">Waist</h4>
                                    <p className="text-[#666] text-[15px]">Measure around the narrowest part of your torso.</p>
                                </div>
                                <div>
                                    <h4 className="font-bold text-[#222] text-[16px] mb-1">Low Hip</h4>
                                    <p className="text-[#666] text-[15px]">With your feet together, measure around the fullest part of your hips/rear.</p>
                                </div>
                            </div>
                            <div className="w-[200px] shrink-0 opacity-80">
                                <svg viewBox="0 0 200 250" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
                                    <path d="M 75 35 
                                             C 85 55, 115 55, 125 35 
                                             C 145 35, 175 45, 188 78 
                                             C 192 88, 175 105, 160 95 
                                             C 158 115, 155 130, 145 145 
                                             C 145 160, 155 175, 158 190 
                                             C 160 200, 160 210, 160 215 
                                             C 130 230, 70 230, 40 215 
                                             C 40 210, 40 200, 42 190 
                                             C 45 175, 55 160, 55 145 
                                             C 45 130, 42 115, 40 95 
                                             C 25 105, 8 88, 12 78 
                                             C 25 45, 55 35, 75 35 
                                             Z" fill="#e0e0e0"/>
                                    
                                    <path d="M 40 115 Q 100 135 158 115" stroke="#333" strokeWidth="1.5" fill="none" markerEnd="url(#arrowRt)"/>
                                    <text x="100" y="105" textAnchor="middle" fill="#333" fontSize="13" fontWeight="normal" fontFamily="sans-serif">bust</text>
                                    
                                    <path d="M 48 145 Q 100 160 152 145" stroke="#333" strokeWidth="1.5" fill="none" markerEnd="url(#arrowRt)"/>
                                    <text x="100" y="138" textAnchor="middle" fill="#333" fontSize="13" fontWeight="normal" fontFamily="sans-serif">waist</text>

                                    <path d="M 40 190 Q 100 215 160 190" stroke="#333" strokeWidth="1.5" fill="none" markerEnd="url(#arrowRt)"/>
                                    <text x="100" y="180" textAnchor="middle" fill="#333" fontSize="13" fontWeight="normal" fontFamily="sans-serif">low-hips</text>

                                    <defs>
                                        <marker id="arrowRt" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                                            <path d="M 0 1 L 8 5 L 0 9 z" fill="#333" />
                                        </marker>
                                    </defs>
                                </svg>
                            </div>
                        </div>
                    </div>
                )}

                {activeModal === 'delivery' && (
                    <div className="p-8 md:p-12">
                        <h2 className="text-[24px] font-bold text-[#222] mb-6">Delivery</h2>
                        <ul className="list-disc pl-5 text-[#222] space-y-4 mb-8">
                            <li>All orders shipped with UPS Express.</li>
                            <li>Always free shipping for orders over US $250.</li>
                            <li>All orders are shipped with a UPS tracking number.</li>
                        </ul>

                        <h2 className="text-[24px] font-bold text-[#222] mb-6">Returns</h2>
                        <ul className="list-disc pl-5 text-[#222] space-y-4 mb-8">
                            <li>Items returned within 14 days of their original shipment date in same as new condition will be eligible for a full refund or store credit.</li>
                            <li>Refunds will be charged back to the original form of payment used for purchase.</li>
                            <li>Customer is responsible for shipping charges when making returns and shipping/handling fees of original purchase is non-refundable.</li>
                            <li>All sale items are final purchases.</li>
                        </ul>

                        <h2 className="text-[24px] font-bold text-[#222] mb-4">Help</h2>
                        <p className="text-[#222] mb-4">Give us a shout if you have any other questions and/or concerns.</p>
                        <p className="text-[#878787] mb-2">Email: contact@domain.com</p>
                        <p className="text-[#878787]">Phone: +1 (23) 456 789</p>
                    </div>
                )}

                {activeModal === 'ask' && (
                    <div className="p-8 md:p-10 md:max-w-[550px] mx-auto relative rounded-lg">
                        {/* Header: Product details */}
                        {product && (
                            <div className="flex items-center gap-4 pb-6 mb-8 border-b border-[#eee]">
                                {product.image1 && (
                                    <div className="w-[60px] h-[60px] rounded-full overflow-hidden shrink-0 bg-[#f5f5f5]">
                                        <img src={product.image1} alt={product.name} className="w-full h-full object-cover" />
                                    </div>
                                )}
                                <div>
                                    <h3 className="font-bold text-[#222] text-[15px]">{product.name}</h3>
                                    <p className="text-[#878787] text-[14px]">
                                        {product.price ? `$${product.price}` : 'Price not available'}
                                    </p>
                                </div>
                            </div>
                        )}

                        <h2 className="text-[24px] font-bold text-[#222] mb-8 text-center tracking-normal">Ask a Question</h2>
                        
                        <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); alert("Message sent!"); setActiveModal(null); }}>
                            <div>
                                <label className="block text-[#878787] text-[14px] mb-2">Your Name (required)</label>
                                <input type="text" className="w-full h-[50px] px-5 border border-[#eee] rounded-[25px] focus:outline-none focus:border-[#c1c1c1] transition-colors text-[14px]" required />
                            </div>
                            
                            <div>
                                <label className="block text-[#878787] text-[14px] mb-2">Your Email (required)</label>
                                <input type="email" className="w-full h-[50px] px-5 border border-[#eee] rounded-[25px] focus:outline-none focus:border-[#c1c1c1] transition-colors text-[14px]" required />
                            </div>
                            
                            <div>
                                <label className="block text-[#878787] text-[14px] mb-2">Your Phone Number</label>
                                <input type="text" className="w-full h-[50px] px-5 border border-[#eee] rounded-[25px] focus:outline-none focus:border-[#c1c1c1] transition-colors text-[14px]" />
                            </div>
                            
                            <div>
                                <label className="block text-[#878787] text-[14px] mb-2">Message (required)</label>
                                <textarea className="w-full h-[150px] p-5 border border-[#eee] rounded-[25px] focus:outline-none focus:border-[#c1c1c1] transition-colors resize-none text-[14px]" required></textarea>
                            </div>
                            
                            <button type="submit" className="w-full h-[50px] bg-[#56cfe1] text-white font-bold text-[16px] rounded-[25px] hover:bg-[#45a3b2] transition-colors mt-2">Send</button>
                        </form>
                    </div>
                )}
                </div>
            </div>
        </div>
    );
};

export default ProductInfoModal;
