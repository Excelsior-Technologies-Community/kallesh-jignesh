import React, { useState } from 'react'
import { X, Plus, Heart, Search, User, Mail, Phone, ChevronDown, Minus } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useCurrency } from '../Context/CurrencyContext'

const MobileSidebar = ({
    isOpen,
    onClose,
    menuItems,
    saleMegaMenu,
    homeLayouts,
    shopMegaMenu,
    productsMegaMenu,
    pagesMegaMenu,
    lookbookMenu,
    blogLayouts,
    blogPosts,
    onSearchOpen,
    onAccountClick,
    wishlistCount
}) => {
    const [openMenuName, setOpenMenuName] = useState(null);
    const [openSubMenuName, setOpenSubMenuName] = useState(null);
    const { selectedCurrency, setSelectedCurrency } = useCurrency();
    const [selectedLanguage, setSelectedLanguage] = useState('English');

    const toggleMenu = (itemName) => {
        setOpenMenuName(prev => {
            const next = prev === itemName ? null : itemName;
            if (next !== prev) setOpenSubMenuName(null); // Reset sub-menu when main menu changes
            return next;
        });
    };

    return (
        <>
            {/* Overlay */}
            <div
                className={`fixed inset-0 bg-black/50 z-[5000] transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={onClose}
            />

            {/* Sidebar */}
            <div className={`fixed inset-y-0 left-0 w-[310px] bg-white z-[5001] transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'} flex flex-col shadow-2xl overflow-hidden`}>
                {/* Header */}
                <div className="bg-[#f6f6f6] h-14 flex items-center justify-between px-5 border-b border-gray-100 flex-shrink-0">
                    <span className="text-[12px] font-bold tracking-widest text-[#222] uppercase">MENU</span>
                    <button
                        onClick={onClose}
                        className="text-[#222] hover:text-[#43D1F0] transition-colors p-2"
                    >
                        <X size={22} strokeWidth={1.5} />
                    </button>
                </div>

                {/* Menu List */}
                <div className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-hide">
                    <ul className="border-t border-gray-100">
                        {menuItems.map((item, index) => {
                            const isParent = ['Home', 'Shop', 'Products', 'Pages', 'Lookbook', 'Blog', 'Sale'].includes(item.name);
                            const isMenuOpen = openMenuName === item.name;

                            return (
                                <li key={index} className="border-b border-gray-100">
                                    <div
                                        className="flex items-center justify-between px-5 py-4 group cursor-pointer hover:bg-[#fcfcfc] transition-colors"
                                        onClick={() => isParent && toggleMenu(item.name)}
                                    >
                                        <div className="flex items-center gap-3">
                                            <a
                                                href={item.link}
                                                className={`text-[14px] font-medium transition-colors ${isMenuOpen ? 'text-[#43D1F0]' : 'text-[#222] group-hover:text-[#43D1F0]'}`}
                                                onClick={(e) => {
                                                    if (isParent) {
                                                        e.preventDefault();
                                                        toggleMenu(item.name);
                                                    }
                                                }}
                                            >
                                                {item.name}
                                            </a>
                                            {item.badge && (
                                                <span className={`px-1.5 py-0.5 text-[9px] font-bold text-white uppercase rounded-sm ${item.badgeColor}`}>
                                                    {item.badge}
                                                </span>
                                            )}
                                        </div>
                                        {isParent && (
                                            isMenuOpen ? <Minus size={16} className="text-[#43D1F0]" /> : <Plus size={16} className="text-gray-400 group-hover:text-[#43D1F0]" />
                                        )}
                                    </div>

                                    {/* Home Sub-menu */}
                                    {item.name === 'Home' && isMenuOpen && (
                                        <div className="bg-white border-t border-gray-100 pb-2">
                                            <div className="border-b border-gray-50 last:border-b-0">
                                                <div
                                                    className="flex items-center justify-between px-10 py-4 cursor-pointer hover:bg-[#fcfcfc] group/sub"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setOpenSubMenuName(prev => prev === 'Home-Layouts' ? null : 'Home-Layouts');
                                                    }}
                                                >
                                                    <span className={`text-[14px] font-medium transition-colors ${openSubMenuName === 'Home-Layouts' ? 'text-[#43D1F0]' : 'text-[#222] group-hover/sub:text-[#43D1F0]'}`}>
                                                        Home Layouts
                                                    </span>
                                                    {openSubMenuName === 'Home-Layouts' ? <Minus size={14} className="text-[#222]" /> : <Plus size={14} className="text-[#222]" />}
                                                </div>
                                                {openSubMenuName === 'Home-Layouts' && (
                                                    <div className="bg-[#fbfbfb] px-10 py-6">
                                                        <div className="grid grid-cols-2 gap-4">
                                                            {homeLayouts?.slice(0, 10).map((layout, hIdx) => (
                                                                <div key={hIdx} className="space-y-2 group/home">
                                                                    <div className="aspect-[1/1.2] overflow-hidden rounded-sm bg-gray-100 relative">
                                                                        <img src={layout.image} alt={layout.name} className="w-full h-full object-cover transition-transform duration-500 group-hover/home:scale-105" />
                                                                        {layout.badge && (
                                                                            <span className={`absolute top-2 left-2 px-1.5 py-0.5 text-[8px] font-bold text-white uppercase rounded-sm ${layout.badgeColor}`}>
                                                                                {layout.badge}
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                    <p className="text-[12px] font-medium text-[#222] group-hover/home:text-[#43D1F0] transition-colors truncate">
                                                                        {layout.name}
                                                                    </p>
                                                                </div>
                                                            ))}
                                                        </div>
                                                        <button className="w-full mt-6 py-2.5 text-[11px] font-bold text-[#222] border border-gray-200 uppercase tracking-widest hover:bg-[#222] hover:text-white transition-all">
                                                            View More Layouts
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {/* Shop Sub-menu */}
                                    {item.name === 'Shop' && isMenuOpen && (
                                        <div className="bg-white border-t border-gray-100">
                                            {shopMegaMenu?.categories.map((cat, cIdx) => {
                                                const isSubMenuOpen = openSubMenuName === cat.title;
                                                return (
                                                    <div key={cIdx} className="border-b border-gray-50 last:border-b-0">
                                                        <div
                                                            className="flex items-center justify-between px-10 py-4 cursor-pointer hover:bg-[#fcfcfc] group/sub"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setOpenSubMenuName(prev => prev === cat.title ? null : cat.title);
                                                            }}
                                                        >
                                                            <span className={`text-[14px] font-medium transition-colors ${isSubMenuOpen ? 'text-[#43D1F0]' : 'text-[#222] group-hover/sub:text-[#43D1F0]'}`}>
                                                                {cat.title}
                                                            </span>
                                                            {isSubMenuOpen ? <Minus size={14} className="text-[#222]" /> : <Plus size={14} className="text-[#222]" />}
                                                        </div>
                                                        {isSubMenuOpen && (
                                                            <ul className="bg-[#fbfbfb] px-16 py-2 pb-4 space-y-3">
                                                                {cat.items.map((subItem, sIdx) => (
                                                                    <li key={sIdx} className="flex items-center justify-between">
                                                                        <Link
                                                                            to={subItem.link}
                                                                            className="text-[13px] text-gray-500 hover:text-[#43D1F0] transition-colors leading-tight"
                                                                            onClick={onClose}
                                                                        >
                                                                            {subItem.name}
                                                                        </Link>
                                                                        {subItem.badge && (
                                                                            <span className={`px-1 py-0.5 text-[8px] font-bold text-white uppercase rounded-sm ${subItem.badgeColor}`}>
                                                                                {subItem.badge}
                                                                            </span>
                                                                        )}
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        )}
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    )}

                                    {/* Products Sub-menu */}
                                    {item.name === 'Products' && isMenuOpen && (
                                        <div className="bg-white border-t border-gray-100">
                                            {productsMegaMenu?.map((section, sIdx) => {
                                                const subMenuKey = `Products-${section.title}`;
                                                const isSubMenuOpen = openSubMenuName === subMenuKey;
                                                return (
                                                    <div key={sIdx} className="border-b border-gray-50 last:border-b-0">
                                                        <div
                                                            className="flex items-center justify-between px-10 py-4 cursor-pointer hover:bg-[#fcfcfc] group/sub"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setOpenSubMenuName(prev => prev === subMenuKey ? null : subMenuKey);
                                                            }}
                                                        >
                                                            <span className={`text-[14px] font-medium transition-colors ${isSubMenuOpen ? 'text-[#43D1F0]' : 'text-[#222] group-hover/sub:text-[#43D1F0]'}`}>
                                                                {section.title}
                                                            </span>
                                                            {isSubMenuOpen ? <Minus size={14} className="text-[#222]" /> : <Plus size={14} className="text-[#222]" />}
                                                        </div>
                                                        {isSubMenuOpen && (
                                                            <ul className="bg-[#fbfbfb] px-16 py-2 pb-4 space-y-3">
                                                                {section.items.map((subItem, iIdx) => (
                                                                    <li key={iIdx} className="flex items-center justify-between">
                                                                        <Link
                                                                            to={subItem.link}
                                                                            className="text-[13px] text-gray-500 hover:text-[#43D1F0] transition-colors leading-tight"
                                                                            onClick={onClose}
                                                                        >
                                                                            {subItem.name}
                                                                        </Link>
                                                                        {subItem.badge && (
                                                                            <span className={`px-1 py-0.5 text-[8px] font-bold text-white uppercase rounded-sm ${subItem.badgeColor}`}>
                                                                                {subItem.badge}
                                                                            </span>
                                                                        )}
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}

                                    {/* Pages Sub-menu */}
                                    {item.name === 'Pages' && isMenuOpen && (
                                        <div className="bg-white border-t border-gray-100">
                                            {pagesMegaMenu?.map((section, sIdx) => {
                                                const subMenuKey = `Pages-${section.title}`;
                                                const isSubMenuOpen = openSubMenuName === subMenuKey;
                                                return (
                                                    <div key={sIdx} className="border-b border-gray-50 last:border-b-0">
                                                        <div
                                                            className="flex items-center justify-between px-10 py-4 cursor-pointer hover:bg-[#fcfcfc] group/sub"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setOpenSubMenuName(prev => prev === subMenuKey ? null : subMenuKey);
                                                            }}
                                                        >
                                                            <span className={`text-[14px] font-medium transition-colors ${isSubMenuOpen ? 'text-[#43D1F0]' : 'text-[#222] group-hover/sub:text-[#43D1F0]'}`}>
                                                                {section.title}
                                                            </span>
                                                            {isSubMenuOpen ? <Minus size={14} className="text-[#222]" /> : <Plus size={14} className="text-[#222]" />}
                                                        </div>
                                                        {isSubMenuOpen && (
                                                            <ul className="bg-[#fbfbfb] px-16 py-2 pb-4 space-y-3">
                                                                {section.items.map((subItem, iIdx) => (
                                                                    <li key={iIdx} className="flex items-center justify-between">
                                                                        <Link
                                                                            to={subItem.link}
                                                                            className="text-[13px] text-gray-500 hover:text-[#43D1F0] transition-colors leading-tight"
                                                                            onClick={onClose}
                                                                        >
                                                                            {subItem.name}
                                                                        </Link>
                                                                        {subItem.badge && (
                                                                            <span className={`px-1 py-0.5 text-[8px] font-bold text-white uppercase rounded-sm ${subItem.badgeColor}`}>
                                                                                {subItem.badge}
                                                                            </span>
                                                                        )}
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}

                                    {/* Lookbook Sub-menu */}
                                    {item.name === 'Lookbook' && isMenuOpen && (
                                        <div className="bg-white border-t border-gray-100 pb-2">
                                            <div className="border-b border-gray-50 last:border-b-0">
                                                <div
                                                    className="flex items-center justify-between px-10 py-4 cursor-pointer hover:bg-[#fcfcfc] group/sub"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setOpenSubMenuName(prev => prev === 'Lookbook-Pages' ? null : 'Lookbook-Pages');
                                                    }}
                                                >
                                                    <span className={`text-[14px] font-medium transition-colors ${openSubMenuName === 'Lookbook-Pages' ? 'text-[#43D1F0]' : 'text-[#222] group-hover/sub:text-[#43D1F0]'}`}>
                                                        Lookbook Pages
                                                    </span>
                                                    {openSubMenuName === 'Lookbook-Pages' ? <Minus size={14} className="text-[#222]" /> : <Plus size={14} className="text-[#222]" />}
                                                </div>
                                                {openSubMenuName === 'Lookbook-Pages' && (
                                                    <ul className="bg-[#fbfbfb] px-16 py-2 pb-4 space-y-3">
                                                        {lookbookMenu?.map((lb, lbIdx) => (
                                                            <li key={lbIdx}>
                                                                <Link
                                                                    to={lb.link}
                                                                    className="text-[13px] text-gray-600 hover:text-[#43D1F0] transition-colors"
                                                                    onClick={onClose}
                                                                >
                                                                    {lb.name}
                                                                </Link>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {/* Blog Sub-menu */}
                                    {item.name === 'Blog' && isMenuOpen && (
                                        <div className="bg-white border-t border-gray-100 pb-2">
                                            {/* Blog Layouts Accordion */}
                                            <div className="border-b border-gray-50">
                                                <div
                                                    className="flex items-center justify-between px-10 py-4 cursor-pointer hover:bg-[#fcfcfc] group/sub"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setOpenSubMenuName(prev => prev === 'Blog-Layouts' ? null : 'Blog-Layouts');
                                                    }}
                                                >
                                                    <span className={`text-[14px] font-medium transition-colors ${openSubMenuName === 'Blog-Layouts' ? 'text-[#43D1F0]' : 'text-[#222] group-hover/sub:text-[#43D1F0]'}`}>
                                                        Blog Layouts
                                                    </span>
                                                    {openSubMenuName === 'Blog-Layouts' ? <Minus size={14} className="text-[#222]" /> : <Plus size={14} className="text-[#222]" />}
                                                </div>
                                                {openSubMenuName === 'Blog-Layouts' && (
                                                    <ul className="bg-[#fbfbfb] px-16 py-2 pb-4 space-y-3">
                                                        {blogLayouts?.map((layout, lIdx) => (
                                                            <li key={lIdx}>
                                                                <Link
                                                                    to={layout.link}
                                                                    className="text-[13px] text-gray-500 hover:text-[#43D1F0] transition-colors"
                                                                    onClick={onClose}
                                                                >
                                                                    {layout.name}
                                                                </Link>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                )}
                                            </div>

                                            {/* Recent Articles Accordion */}
                                            <div className="border-b border-gray-50 last:border-b-0">
                                                <div
                                                    className="flex items-center justify-between px-10 py-4 cursor-pointer hover:bg-[#fcfcfc] group/sub"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setOpenSubMenuName(prev => prev === 'Blog-Articles' ? null : 'Blog-Articles');
                                                    }}
                                                >
                                                    <span className={`text-[14px] font-medium transition-colors ${openSubMenuName === 'Blog-Articles' ? 'text-[#43D1F0]' : 'text-[#222] group-hover/sub:text-[#43D1F0]'}`}>
                                                        Recent Articles
                                                    </span>
                                                    {openSubMenuName === 'Blog-Articles' ? <Minus size={14} className="text-[#222]" /> : <Plus size={14} className="text-[#222]" />}
                                                </div>
                                                {openSubMenuName === 'Blog-Articles' && (
                                                    <div className="bg-[#fbfbfb] px-10 py-4 space-y-4">
                                                        {blogPosts?.slice(0, 3).map((post) => (
                                                            <div key={post.id} className="flex gap-4 group/mobileblog">
                                                                <div className="w-16 h-16 overflow-hidden rounded-sm bg-[#f6f6f6] flex-shrink-0">
                                                                    <img src={post.image} alt={post.title} className="w-full h-full object-cover transition-transform duration-500 group-hover/mobileblog:scale-110" />
                                                                </div>
                                                                <div className="flex flex-col justify-center">
                                                                    <p className="text-[10px] text-[#43D1F0] uppercase font-bold mb-0.5">{post.category.split(',')[0]}</p>
                                                                    <h5 className="text-[12px] font-bold text-[#222] group-hover/mobileblog:text-[#43D1F0] transition-colors line-clamp-2 leading-tight">
                                                                        {post.title}
                                                                    </h5>
                                                                    <p className="text-[10px] text-gray-400 mt-0.5">{post.date}</p>
                                                                </div>
                                                            </div>
                                                        ))}
                                                        <a href="#" className="block text-center py-2 border border-gray-200 mt-2 text-[11px] font-bold text-[#222] hover:bg-[#222] hover:text-white transition-all uppercase tracking-widest">
                                                            Visit Our Blog
                                                        </a>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {/* Sale Sub-menu */}
                                    {item.name === 'Sale' && isMenuOpen && (
                                        <div className="bg-white border-t border-gray-100 pb-2">
                                            <div className="border-b border-gray-50 last:border-b-0">
                                                <div
                                                    className="flex items-center justify-between px-10 py-4 cursor-pointer hover:bg-[#fcfcfc] group/sub"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setOpenSubMenuName(prev => prev === 'Sale-Categories' ? null : 'Sale-Categories');
                                                    }}
                                                >
                                                    <span className={`text-[14px] font-medium transition-colors ${openSubMenuName === 'Sale-Categories' ? 'text-[#43D1F0]' : 'text-[#222] group-hover/sub:text-[#43D1F0]'}`}>
                                                        Sale Categories
                                                    </span>
                                                    {openSubMenuName === 'Sale-Categories' ? <Minus size={14} className="text-[#222]" /> : <Plus size={14} className="text-[#222]" />}
                                                </div>
                                                {openSubMenuName === 'Sale-Categories' && (
                                                    <div className="bg-[#fbfbfb] px-16 py-4 space-y-4">
                                                        <ul className="space-y-4">
                                                            {saleMegaMenu?.categories.map((cat, cIdx) => (
                                                                <li key={cIdx}>
                                                                    <a href="#" className="text-[13px] text-gray-600 hover:text-[#43D1F0] transition-colors flex items-center justify-between group/saleitem">
                                                                        <span className="group-hover/saleitem:translate-x-1 transition-transform duration-300">{cat}</span>
                                                                        {cat === 'MEN' && (
                                                                            <span className="px-1.5 py-0.5 text-[7px] font-bold text-white uppercase rounded-sm bg-[#43d1f0]">New</span>
                                                                        )}
                                                                    </a>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                        <Link to="/sale" className="block text-center py-2.5 border border-gray-200 mt-4 text-[11px] font-bold text-[#222] hover:bg-[#222] hover:text-white transition-all uppercase tracking-widest" onClick={onClose}>
                                                            View All Sale Items
                                                        </Link>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </li>
                            );
                        })}

                        {/* Utility Links */}
                        <li className="border-b border-gray-100">
                            <Link
                                to="/wishlist"
                                className="flex items-center gap-3 px-5 py-4 text-[#222] hover:text-[#43D1F0] transition-colors cursor-pointer relative"
                                onClick={onClose}
                            >
                                <div className="relative">
                                    <Heart size={18} strokeWidth={1.5} />
                                    {wishlistCount > 0 && (
                                        <span className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 bg-black text-white text-[8px] flex items-center justify-center rounded-full font-bold">
                                            {wishlistCount}
                                        </span>
                                    )}
                                </div>
                                <span className="text-[14px] font-medium">Wishlist</span>
                            </Link>
                        </li>
                        <li className="border-b border-gray-100">
                            <div
                                className="flex items-center gap-3 px-5 py-4 text-[#222] hover:text-[#43D1F0] transition-colors cursor-pointer"
                                onClick={() => {
                                    onSearchOpen();
                                    onClose();
                                }}
                            >
                                <Search size={18} strokeWidth={1.5} />
                                <span className="text-[14px] font-medium">Search</span>
                            </div>
                        </li>
                        <li className="border-b border-gray-100">
                            <div
                                className="flex items-center gap-3 px-5 py-4 text-[#222] hover:text-[#43D1F0] transition-colors cursor-pointer"
                                onClick={() => {
                                    onAccountClick();
                                    onClose();
                                }}
                            >
                                <User size={18} strokeWidth={1.5} />
                                <span className="text-[14px] font-medium">Account</span>
                            </div>
                        </li>
                    </ul>

                    {/* Contact Info Section */}
                    <div className="p-5 border-b border-gray-100">
                        <h4 className="text-[16px] font-semibold text-[#222] mb-4">Need help ?</h4>
                        <div className="space-y-3 text-[14px] text-[#222]">
                            <p className="flex flex-col">
                                <span className="text-gray-500">Email:</span>
                                <span className="font-bold">info@fashionshop.com</span>
                            </p>
                            <p className="flex flex-col">
                                <span className="text-gray-500">Phone:</span>
                                <span className="font-bold">(212) 555-1234</span>
                            </p>
                        </div>
                    </div>

                    {/* Language & Currency */}
                    <div className="p-5 space-y-2">
                        {/* Currency Accordion */}
                        <div className="border-b border-gray-50 pb-2">
                            <div
                                className="flex items-center justify-between text-[14px] text-[#222] py-2 cursor-pointer"
                                onClick={() => setOpenSubMenuName(prev => prev === 'Mobile-Currency' ? null : 'Mobile-Currency')}
                            >
                                <div className="flex items-center gap-2">
                                    <img src={`https://flagcdn.com/w20/${selectedCurrency.flag}.png`} alt={selectedCurrency.code} className="w-5 h-4 object-cover" />
                                    <span className="font-medium">{selectedCurrency.code}</span>
                                </div>
                                <ChevronDown size={14} className={`transition-transform duration-200 ${openSubMenuName === 'Mobile-Currency' ? 'rotate-180' : ''}`} />
                            </div>
                            {openSubMenuName === 'Mobile-Currency' && (
                                <div className="mt-2 bg-[#fbfbfb] rounded-sm p-4 max-h-[300px] overflow-y-auto custom-scrollbar-thin space-y-3">
                                    {[
                                        { code: 'AED', symbol: '', name: 'United Arab Emirates dirham', flag: 'ae' },
                                        { code: 'AUD', symbol: '$', name: 'Australia', flag: 'au' },
                                        { code: 'EUR', symbol: '€', name: 'Austria', flag: 'at' },
                                        { code: 'EUR', symbol: '€', name: 'Belgium', flag: 'be' },
                                        { code: 'CAD', symbol: '$', name: 'Canada', flag: 'ca' },
                                        { code: 'CZK', symbol: 'Kč', name: 'Czechia', flag: 'cz' },
                                        { code: 'DKK', symbol: 'kr.', name: 'Denmark', flag: 'dk' },
                                        { code: 'EUR', symbol: '€', name: 'Finland', flag: 'fi' },
                                        { code: 'EUR', symbol: '€', name: 'France', flag: 'fr' },
                                        { code: 'EUR', symbol: '€', name: 'Germany', flag: 'de' },
                                        { code: 'HKD', symbol: '$', name: 'Hong Kong SAR', flag: 'hk' },
                                        { code: 'EUR', symbol: '€', name: 'Ireland', flag: 'ie' },
                                        { code: 'ILS', symbol: '₪', name: 'Israel', flag: 'il' },
                                        { code: 'EUR', symbol: '€', name: 'Italy', flag: 'it' },
                                        { code: 'JPY', symbol: '¥', name: 'Japan', flag: 'jp' },
                                        { code: 'MYR', symbol: 'RM', name: 'Malaysia', flag: 'my' },
                                        { code: 'EUR', symbol: '€', name: 'Netherlands', flag: 'nl' },
                                        { code: 'NZD', symbol: '$', name: 'New Zealand', flag: 'nz' },
                                        { code: 'USD', symbol: '$', name: 'Norway', flag: 'no' },
                                        { code: 'INR', symbol: '₹', name: 'India', flag: 'in' },
                                    ].map((curr) => (
                                        <div
                                            key={`${curr.code}-${curr.name}`}
                                            className={`text-[13px] py-2 px-3 hover:bg-white rounded-sm transition-colors cursor-pointer flex items-center gap-3 ${selectedCurrency.code === curr.code && selectedCurrency.name === curr.name ? 'text-[#43D1F0] bg-white font-bold' : 'text-[#555] font-medium'}`}
                                            onClick={() => {
                                                setSelectedCurrency(curr);
                                                setOpenSubMenuName(null);
                                            }}
                                        >
                                            <img src={`https://flagcdn.com/w20/${curr.flag}.png`} alt={curr.code} className="w-5 h-3.5 object-cover shadow-sm" />
                                            <span>
                                                <span className="text-[#222] font-bold">{curr.code}</span> {curr.symbol} | {curr.name}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Language Accordion */}
                        <div className="pb-2">
                            <div
                                className="flex items-center justify-between text-[14px] text-[#222] py-2 cursor-pointer"
                                onClick={() => setOpenSubMenuName(prev => prev === 'Mobile-Language' ? null : 'Mobile-Language')}
                            >
                                <span className="font-medium">{selectedLanguage}</span>
                                <ChevronDown size={14} className={`transition-transform duration-200 ${openSubMenuName === 'Mobile-Language' ? 'rotate-180' : ''}`} />
                            </div>
                            {openSubMenuName === 'Mobile-Language' && (
                                <div className="mt-2 bg-[#fbfbfb] rounded-sm p-3 space-y-2">
                                    {[
                                        { name: 'English', id: 'en' },
                                        { name: '简体中文', id: 'zh-CN' },
                                        { name: 'العربية', id: 'ar' },
                                        { name: 'Français', id: 'fr' },
                                        { name: 'Español', id: 'es' },
                                        { name: 'Deutsch', id: 'de' }
                                    ].map((lang) => (
                                        <div
                                            key={lang.id}
                                            className={`text-[13px] py-2 px-3 hover:bg-white rounded-sm transition-colors cursor-pointer ${selectedLanguage === lang.name ? 'text-[#43D1F0] bg-white font-medium' : 'text-gray-600'}`}
                                            onClick={() => {
                                                setSelectedLanguage(lang.name);
                                                setOpenSubMenuName(null);

                                                // Trigger Google Translate
                                                const select = document.querySelector(".goog-te-combo");
                                                if (select) {
                                                    select.value = lang.id;
                                                    select.dispatchEvent(new Event("change"));
                                                } else {
                                                    document.cookie = `googtrans=/en/${lang.id}; path=/`;
                                                    window.location.reload();
                                                }
                                            }}
                                        >
                                            {lang.name}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default MobileSidebar
