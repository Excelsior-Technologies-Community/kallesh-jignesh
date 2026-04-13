  import React from 'react'
import { ShoppingCart, User, Search } from 'lucide-react'

const MobileBottomNav = () => {
    return (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-6 py-2 z-50 shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
            <div className="flex items-center justify-around">
                <button className="flex flex-col items-center gap-1 group text-[#222] hover:text-[#43D1F0] transition-colors">
                    <div className="relative">
                        <ShoppingCart size={22} strokeWidth={1.5} />
                        <span className="absolute -top-2 -right-2 w-4 h-4 bg-black text-white text-[10px] flex items-center justify-center rounded-full font-bold">
                            0
                        </span>
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider">Cart</span>
                </button>
                <button className="flex flex-col items-center gap-1 group text-[#222] hover:text-[#43D1F0] transition-colors">
                    <User size={22} strokeWidth={1.5} />
                    <span className="text-[10px] font-bold uppercase tracking-wider">Account</span>
                </button>

                <button className="flex flex-col items-center gap-1 group text-[#222] hover:text-[#43D1F0] transition-colors">
                    <Search size={22} strokeWidth={1.5} />
                    <span className="text-[10px] font-bold uppercase tracking-wider">Search</span>
                </button>
            </div>
        </div>
    )
}

export default MobileBottomNav
