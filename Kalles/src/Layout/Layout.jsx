import React, { useEffect, useState } from 'react'
import Navbar from '../Components/Navbar'
import { Outlet } from 'react-router-dom'
import Footer from '../Components/Footer'
import CartSidebar from '../Components/CartSidebar'
import DiscountPopup from '../Components/DiscountPopup'

const Layout = () => {
  const [isScrolling, setIsScrolling] = useState(false);
  const [showDiscountPopup, setShowDiscountPopup] = useState(false);

  useEffect(() => {
    // Check if popup was already shown in this session
    const hasShownPopup = sessionStorage.getItem('hasShownDiscountPopup');

    if (!hasShownPopup) {
      const timer = setTimeout(() => {
        setShowDiscountPopup(true);
        sessionStorage.setItem('hasShownDiscountPopup', 'true');
      }, 10000); // 10 seconds

      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    let scrollTimeout;
    const handleScroll = () => {
      if (!isScrolling) setIsScrolling(true);

      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        setIsScrolling(false);
      }, 50);

    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isScrolling]);

  return (
    <div className={isScrolling ? 'pointer-events-none' : ''}>
      <Navbar />
      <Outlet />
      <Footer />
      <CartSidebar />
      <DiscountPopup
        isOpen={showDiscountPopup}
        onClose={() => setShowDiscountPopup(false)}
      />
    </div>
  )
}

export default Layout