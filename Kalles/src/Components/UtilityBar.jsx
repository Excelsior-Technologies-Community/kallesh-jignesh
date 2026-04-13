import React, { useState, useRef, useEffect } from 'react'
import { Phone, Mail, MapPin, ChevronDown, Search } from 'lucide-react'
import { useCurrency } from '../Context/CurrencyContext'

const UtilityBar = () => {
    const [isCurrencyOpen, setIsCurrencyOpen] = useState(false)
    const [isLanguageOpen, setIsLanguageOpen] = useState(false)
    const [currencySearch, setCurrencySearch] = useState('')

    const currencyRef = useRef(null)
    const languageRef = useRef(null)

    const { selectedCurrency, setSelectedCurrency } = useCurrency()
    const [selectedLanguage, setSelectedLanguage] = useState({ name: 'English', id: 'en' })


    const currencies = [
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
        { code: 'GBP', symbol: '£', name: 'United Kingdom', flag: 'gb' },
        { code: 'USD', symbol: '$', name: 'United States', flag: 'us' },
        { code: 'INR', symbol: '₹', name: 'India', flag: 'in' },
    ]

    const languages = [
        { name: 'English', id: 'en' },
        { name: '简体中文', id: 'zh-CN' },
        { name: 'العربية', id: 'ar' },
        { name: 'Français', id: 'fr' },
        { name: 'Español', id: 'es' },
        { name: 'Deutsch', id: 'de' },
    ]

    const handleLanguageChange = (item) => {
        setSelectedLanguage(item);
        setIsLanguageOpen(false);

        // Trigger Google Translate
        const select = document.querySelector(".goog-te-combo");
        if (select) {
            select.value = item.id;
            select.dispatchEvent(new Event("change"));
        } else {
            // Fallback: set cookie and reload if widget isn't fully ready but user wants immediate switch
            document.cookie = `googtrans=/en/${item.id}; path=/`;
            window.location.reload();
        }
    };

    const filteredCurrencies = currencies.filter(c =>
        c.name.toLowerCase().includes(currencySearch.toLowerCase()) ||
        c.code.toLowerCase().includes(currencySearch.toLowerCase())
    )

    // Close dropdowns on click outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (currencyRef.current && !currencyRef.current.contains(event.target)) setIsCurrencyOpen(false)
            if (languageRef.current && !languageRef.current.contains(event.target)) setIsLanguageOpen(false)
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    return (
        <div className="bg-[#f6f6f6] border-b border-gray-100 py-3 relative z-[110]">
            <div className="container mx-auto px-4 flex items-center justify-between text-[12px] text-[#878787]">
                {/* Left Section: Contact Info */}
                <div className="hidden md:flex items-center space-x-6 text-[#222]">
                    <div className="flex items-center gap-2 hover:text-[#43D1F0] cursor-pointer transition-colors font-medium">
                        <Phone size={14} strokeWidth={2} />
                        <span>+01 23456789</span>
                    </div>
                    <div className="flex items-center gap-2 hover:text-[#43D1F0] cursor-pointer transition-colors font-medium">
                        <Mail size={14} strokeWidth={2} />
                        <span>kalles@domain.com</span>
                    </div>
                </div>

                {/* Center Section: Promo message */}
                <div className="flex-1 text-center md:flex-none text-[#222] font-medium">
                    <p>
                        Summer sale discount off <span className="text-[#43D1F0] font-bold">50%</span>! <a href="/shop" className="hover:underline text-[#43D1F0]">Shop Now</a>
                    </p>
                </div>

                {/* Right Section: Utility Settings */}
                <div className="hidden md:flex items-center space-x-8">
                    <div className="flex items-center gap-1.5 hover:text-[#43D1F0] cursor-pointer transition-colors text-[#222] font-medium">
                        <MapPin size={14} strokeWidth={2} />
                        <span>Location</span>
                    </div>

                    {/* Currency Dropdown */}
                    <div className="relative" ref={currencyRef}>
                        <div
                            className="flex items-center gap-1.5 hover:text-[#43D1F0] cursor-pointer transition-colors"
                            onClick={() => {
                                setIsCurrencyOpen(!isCurrencyOpen);
                                setIsLanguageOpen(false);
                            }}
                        >
                            <img src={`https://flagcdn.com/w20/${selectedCurrency.flag}.png`} alt={selectedCurrency.code} className="w-5 h-3.5 object-cover rounded-[1px]" />
                            <span className="font-medium text-[#222] uppercase tracking-wider">{selectedCurrency.code}</span>
                            <ChevronDown size={12} className={`transition-transform duration-200 ${isCurrencyOpen ? 'rotate-180' : ''}`} />
                        </div>

                        {isCurrencyOpen && (
                            <div className="absolute top-full right-0 mt-4 w-[280px] bg-white shadow-[0_10px_30px_rgba(0,0,0,0.08)] border border-gray-100 rounded-sm py-5 animate-in fade-in slide-in-from-top-2 duration-300 z-[110]">
                                {/* Arrow Tail */}
                                <div className="absolute -top-[7px] right-6 w-3 h-3 bg-white border-t border-l border-gray-100 rotate-45" />

                                <div className="px-5 mb-4">
                                    <div className="relative">
                                        <input
                                            type="text"
                                            placeholder="Search"
                                            className="w-full h-11 px-6 border border-gray-200 rounded-full text-[14px] focus:outline-none focus:border-[#43D1F0] transition-colors placeholder:text-gray-300"
                                            value={currencySearch}
                                            onChange={(e) => setCurrencySearch(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="max-h-[350px] overflow-y-auto custom-scrollbar-thin">
                                    {filteredCurrencies.map((item, idx) => (
                                        <div
                                            key={idx}
                                            className="px-6 py-2.5 hover:bg-gray-50 cursor-pointer flex items-center gap-3 group transition-colors"
                                            onClick={() => {
                                                setSelectedCurrency(item);
                                                setIsCurrencyOpen(false);
                                            }}
                                        >
                                            <img src={`https://flagcdn.com/w20/${item.flag}.png`} alt={item.code} className="w-5 h-3.5 object-cover shadow-sm" />
                                            <span className="text-[14px] text-[#555] group-hover:text-[#43D1F0] transition-colors">
                                                <span className="font-bold text-[#222] group-hover:text-[#43D1F0]">{item.code}</span> {item.symbol} | {item.name}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Language Dropdown */}
                    <div className="relative" ref={languageRef}>
                        <div
                            className="flex items-center gap-1 group cursor-pointer hover:text-[#43D1F0] transition-colors"
                            onClick={() => {
                                setIsLanguageOpen(!isLanguageOpen);
                                setIsCurrencyOpen(false);
                            }}
                        >
                            <span className="font-medium text-[#222]">{selectedLanguage.name}</span>
                            <ChevronDown size={12} className={`transition-transform duration-200 ${isLanguageOpen ? 'rotate-180' : ''}`} />
                        </div>

                        {isLanguageOpen && (
                            <div className="absolute top-full right-0 mt-4 w-[160px] bg-white shadow-[0_10px_30px_rgba(0,0,0,0.08)] border border-gray-100 rounded-sm py-4 animate-in fade-in slide-in-from-top-2 duration-300 z-[110]">
                                {/* Arrow Tail */}
                                <div className="absolute -top-[7px] right-5 w-3 h-3 bg-white border-t border-l border-gray-100 rotate-45" />

                                <div className="flex flex-col">
                                    {languages.map((item) => (
                                        <div
                                            key={item.id}
                                            className={`px-6 py-2.5 cursor-pointer text-[14px] hover:bg-gray-50 transition-colors ${selectedLanguage.id === item.id ? 'text-[#43D1F0] font-bold' : 'text-[#222] font-medium'}`}
                                            onClick={() => handleLanguageChange(item)}
                                        >
                                            {item.name}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default UtilityBar
