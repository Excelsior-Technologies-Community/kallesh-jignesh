import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  MapPin,
  Mail,
  Phone,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Plus,
  Minus
} from "lucide-react";
import { FaPinterest } from "react-icons/fa6";

const Footer = () => {
  const [openSection, setOpenSection] = useState(null);

  const toggleSection = (section) => {
    setOpenSection(openSection === section ? null : section);
  };

  return (
    <footer className="bg-white pt-8 md:pt-16 border-t border-gray-100">
      <div className="container mx-auto px-4 lg:px-20 xl:px-48 bg-[#f5f4f5]">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-0 md:gap-10 py-10 md:py-14">
          
          {/* Column 1: Logo & Contact */}
          <div className="lg:col-span-1 mb-8 md:mb-0">
            <div className="mb-6">
              <img
                src="https://kalles-5.myshopify.com/cdn/shop/files/kalles.svg?v=1717404087&width=110"
                alt="kalles"
                className="w-28 opacity-90 mx-0"
              />
            </div>
            <div className="space-y-4 text-[14px] text-[#878787] text-left">
              <div className="flex items-start gap-4">
                <MapPin size={20} strokeWidth={1} className="mt-0.5 flex-shrink-0 text-[#222]" />
                <p className="leading-relaxed">184 Main Rd E, St Albans VIC 3021, Australia</p>
              </div>
              <div className="flex items-center gap-4 hover:text-[#43D1F0] cursor-pointer transition-colors">
                <Mail size={18} strokeWidth={1} className="flex-shrink-0 text-[#222]" />
                <p>contact@company.com</p>
              </div>
              <div className="flex items-center gap-4 hover:text-[#43D1F0] cursor-pointer transition-colors">
                <Phone size={18} strokeWidth={1} className="flex-shrink-0 text-[#222]" />
                <p>+001 2233 456</p>
              </div>
            </div>
            {/* Social Icons */}
            <div className="flex items-center gap-5 mt-8 text-[#222] opacity-80">
              <Facebook size={20} className="hover:text-[#43D1F0] cursor-pointer transition-colors" />
              <Twitter size={20} className="hover:text-[#43D1F0] cursor-pointer transition-colors" />
              <Instagram size={20} className="hover:text-[#43D1F0] cursor-pointer transition-colors" />
              <Youtube size={20} className="hover:text-[#43D1F0] cursor-pointer transition-colors" />
              <FaPinterest size={20} className="hover:text-[#43D1F0] cursor-pointer transition-colors" />
            </div>
          </div>

          {[
            {
              id: "categories",
              title: "Categories",
              links: [
                { name: "Men", to: "/grid-layout" },
                { name: "Women", to: "/grid-layout" },
                { name: "Accessories", to: "/grid-layout" },
                { name: "Shoes", to: "/grid-layout" },
                { name: "Watch", to: "/grid-layout" },
                { name: "Dress", to: "/grid-layout" }
              ]
            },
            {
              id: "information",
              title: "Information",
              links: [
                { name: "About us", to: "/about" },
                { name: "Contact us", to: "/contact" },
                { name: "Store Location", to: "/store-location" },
                { name: "Blog", to: "/blog-grid-layout" },
                { name: "FAQ", to: "/faqs" }
              ]
            },
            {
              id: "useful_links",
              title: "Useful links",
              links: [
                { name: "Latest News", to: "/latest-news" },
                { name: "My Account", to: "/wishlist" },
                { name: "Size Guide", to: "/size-guide" },
                { name: "FAQs", to: "/faqs" },
                { name: "FAQs 2", to: "/faqs-2" }
              ]
            }
          ].map((section) => (
            <div key={section.id} className="border-b md:border-none border-gray-200">
              <div 
                className="flex items-center justify-between py-4 md:py-0 md:mb-6 cursor-pointer md:cursor-default"
                onClick={() => window.innerWidth < 768 && toggleSection(section.id)}
              >
                <h4 className="text-[15px] md:text-[16px] font-bold text-[#222]">
                  {section.title}
                </h4>
                <div className="md:hidden text-[#878787]">
                  {openSection === section.id ? <Minus size={16} /> : <Plus size={16} />}
                </div>
              </div>
              <div className={`flex flex-col space-y-3 text-[14px] text-[#878787] transition-all duration-300 md:block ${openSection === section.id ? 'block pb-6' : 'hidden'}`}>
                {section.links.map((link, idx) => (
                  <Link key={idx} to={link.to} className="hover:text-[#43D1F0] transition-colors w-fit block py-0.5">
                    {link.name}
                  </Link>
                ))}
              </div>
            </div>
          ))}

          {/* Column 5: Newsletter - Also Accordion on mobile */}
          <div className="border-b md:border-none border-gray-200">
            <div 
              className="flex items-center justify-between py-4 md:py-0 md:mb-6 cursor-pointer md:cursor-default"
              onClick={() => window.innerWidth < 768 && toggleSection('newsletter')}
            >
              <h4 className="text-[15px] md:text-[16px] font-bold text-[#222]">
                Newsletter Signup
              </h4>
              <div className="md:hidden text-[#878787]">
                {openSection === 'newsletter' ? <Minus size={16} /> : <Plus size={16} />}
              </div>
            </div>
            <div className={`transition-all duration-300 md:block ${openSection === 'newsletter' ? 'block pb-8' : 'hidden'}`}>
              <p className="text-[14px] text-[#878787] mb-6 leading-relaxed">
                Subscribe to our newsletter and get 10% off your first purchase
              </p>
              <div className="relative mb-6">
                <input
                  type="email"
                  placeholder="Enter email address..."
                  className="w-full h-11 px-4 bg-transparent border border-black rounded-full text-[13px] transition-colors focus:outline-none focus:border-[#43D1F0]"
                />
                <button className="absolute top-0 right-0 h-9 mt-1 mr-1 px-5 bg-[#222] text-white text-[11px] font-bold rounded-full hover:bg-[#43D1F0] transition-colors uppercase tracking-wider">
                  Subscribe
                </button>
              </div>
              {/* Payment Logos */}
              <div className="flex flex-wrap items-center gap-5 opacity-70">
                <img src="https://raw.githubusercontent.com/activemerchant/payment_icons/refs/heads/master/app/assets/images/payment_icons/visa.svg" alt="Visa" className="h-4" />
                <img src="https://raw.githubusercontent.com/activemerchant/payment_icons/refs/heads/master/app/assets/images/payment_icons/paypal.svg" alt="PayPal" className="h-4" />
                <img src="https://raw.githubusercontent.com/activemerchant/payment_icons/refs/heads/master/app/assets/images/payment_icons/master.svg" alt="Mastercard" className="h-4" />
                <img src="https://raw.githubusercontent.com/activemerchant/payment_icons/refs/heads/master/app/assets/images/payment_icons/american_express.svg" alt="Amex" className="h-4" />
                <img src="https://raw.githubusercontent.com/activemerchant/payment_icons/refs/heads/master/app/assets/images/payment_icons/amazon.svg" alt="Amazon" className="h-4" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section: Copyright & Links */}
      <div className="py-8 bg-white px-4 lg:px-20 xl:px-48 border-t border-gray-100">
        <div className="flex flex-col items-center justify-center gap-6">
          <div className="text-[13px] text-[#878787] text-center">
            All Rights Reserved © 2025{" "}
            <span className="text-[#43D1F0] font-semibold">Kalles</span> - Developed
            by <span className="text-[#222] font-semibold">The4</span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-6 md:gap-8 text-[14px] font-medium text-[#878787]">
            <Link to="/shop" className="hover:text-[#43D1F0] transition-colors">Shop</Link>
            <Link to="/contact-us" className="hover:text-[#43D1F0] transition-colors">Contact us</Link>
            <Link to="/about-us" className="hover:text-[#43D1F0] transition-colors">About us</Link>
            <Link to="/blog" className="hover:text-[#43D1F0] transition-colors">Blog</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
