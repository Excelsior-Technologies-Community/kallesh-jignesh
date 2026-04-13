import React, { useState, useEffect, useRef } from 'react'
import { useCart } from '../Context/CartContext'
import { useWishlist } from '../Context/WishlistContext'
import { useCurrency } from '../Context/CurrencyContext'
import { Link, useNavigate } from 'react-router-dom'
import QuickAddModal from './QuickAddModal'
import QuickViewModal from './QuickViewModal'
import Topbar from './Topbar'
import UtilityBar from './UtilityBar'
import MobileSidebar from './MobileSidebar'
import LoginSidebar from './LoginSidebar'
import RegisterSidebar from './RegisterSidebar'
import SearchSidebar from './SearchSidebar'

import { Search, User, Heart, ShoppingCart, Menu, ChevronLeft, ChevronRight, Maximize2, RefreshCw } from 'lucide-react'

const Navbar = () => {
  const navigate = useNavigate()
  const { cartCount, openCart, reloadCart } = useCart()
  const { wishlistCount, reloadWishlist } = useWishlist()
  const { formatPrice } = useCurrency()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [accountView, setAccountView] = useState(null) // null | 'login' | 'register'
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [user, setUser] = useState(null)
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false)
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)

  const openQuickView = (product) => {
    const normalizedProduct = {
      ...product,
      image1: product.images[0],
      image2: product.images[1],
      image3: product.images[2],
      image4: product.images[3],
      image5: product.images[4],
    }
    setSelectedProduct(normalizedProduct)
    setIsQuickViewOpen(true)
  }

  const openQuickAdd = (product) => {
    const normalizedProduct = {
      ...product,
      image1: product.images[0],
      image2: product.images[1],
    }
    setSelectedProduct(normalizedProduct)
    setIsQuickAddOpen(true)
  }

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser && storedUser !== "undefined") {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("User data parse error", e);
        localStorage.removeItem('user');
      }
    }
  }, []);

  const handleUserClick = async () => {
    if (user) {
      if (window.confirm('Are you sure you want to logout?')) {
        try {
          await fetch('http://localhost:5000/api/auth/logout', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name: user.name, email: user.email }),
          });
        } catch (error) {
          console.error("Logout logging failed", error);
        }

        localStorage.removeItem('token')
        localStorage.removeItem('user')
        localStorage.removeItem('adminId')
        setUser(null)
        reloadCart(); // Reset cart for guest
        reloadWishlist(); // Reset wishlist for guest
        alert('Logged out successfully')
        navigate('/') // Go back to home after logout just in case they were on admin page
      }
    } else {
      setAccountView('login')
    }
  }
  const [activeMenu, setActiveMenu] = useState(null)
  const [isMenuLocked, setIsMenuLocked] = useState(false)
  const [blogCurrentIndex, setBlogCurrentIndex] = useState(2)
  const [isTransitioning, setIsTransitioning] = useState(true)
  const [saleCurrentIndex, setSaleCurrentIndex] = useState(4)
  const [saleIsTransitioning, setSaleIsTransitioning] = useState(true)
  const [dragOffset, setDragOffset] = useState(0)

  const navRef = useRef(null)
  const isDraggingBlog = useRef(false)
  const blogStartX = useRef(0)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setActiveMenu(null)
        setIsMenuLocked(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleMenuMouseEnter = (menuName) => {
    if (!isMenuLocked) {
      setActiveMenu(menuName)
    }
  }

  const handleMenuMouseLeave = () => {
    if (!isMenuLocked) {
      setActiveMenu(null)
    }
  }

  const handleMenuClick = (e, menuName, link) => {

    const navigableItems = ["Home", "Sale"];
    if (navigableItems.includes(menuName)) return;

    if (link === '/' || link === '#') {
      e.preventDefault()
      if (activeMenu === menuName && isMenuLocked) {
        setActiveMenu(null)
        setIsMenuLocked(false)
      } else {
        setActiveMenu(menuName)
        setIsMenuLocked(true)
      }
    }
  }

  const handleBlogNext = (e) => {
    e.stopPropagation()
    if (!isTransitioning) return
    setBlogCurrentIndex((prev) => prev + 1)
  }

  const handleBlogPrev = (e) => {
    e.stopPropagation()
    if (!isTransitioning) return
    setBlogCurrentIndex((prev) => prev - 1)
  }

  const handleSaleNext = (e) => {
    e.stopPropagation()
    if (!saleIsTransitioning) return
    setSaleCurrentIndex((prev) => prev + 1)
  }

  const handleSalePrev = (e) => {
    e.stopPropagation()
    if (!saleIsTransitioning) return
    setSaleCurrentIndex((prev) => prev - 1)
  }

  // Effect to handle infinite loop "jump"
  useEffect(() => {
    const originalCount = 7 // Number of real posts

    if (!isTransitioning) return;

    let timer;
    if (blogCurrentIndex >= originalCount + 2) {
      // Reached the end clone (index 9)
      timer = setTimeout(() => {
        setIsTransitioning(false)
        setBlogCurrentIndex(2)
      }, 500)
    } else if (blogCurrentIndex <= 1) {
      // Reached the start clone (index 1)
      timer = setTimeout(() => {
        setIsTransitioning(false)
        setBlogCurrentIndex(originalCount + 1)
      }, 500)
    }

    return () => clearTimeout(timer)
  }, [blogCurrentIndex, isTransitioning])

  // Effect to handle infinite loop "jump" for Sale
  useEffect(() => {
    const originalCount = 9 // Number of real sale products

    if (!saleIsTransitioning) return;

    let timer;
    if (saleCurrentIndex >= originalCount + 4) {
      // Reached the end clones
      timer = setTimeout(() => {
        setSaleIsTransitioning(false)
        setSaleCurrentIndex(4)
      }, 500)
    } else if (saleCurrentIndex <= 3) {
      // Reached the start clones
      timer = setTimeout(() => {
        setSaleIsTransitioning(false)
        setSaleCurrentIndex(originalCount + 3)
      }, 500)
    }

    return () => clearTimeout(timer)
  }, [saleCurrentIndex, saleIsTransitioning])

  // Reset transition for Sale after jump
  useEffect(() => {
    if (!saleIsTransitioning) {
      const timer = setTimeout(() => {
        setSaleIsTransitioning(true)
      }, 10)
      return () => clearTimeout(timer)
    }
  }, [saleIsTransitioning])

  // Reset transition after jump
  useEffect(() => {
    if (!isTransitioning) {
      const timer = setTimeout(() => {
        setIsTransitioning(true)
      }, 10)
      return () => clearTimeout(timer)
    }
  }, [isTransitioning])

  const handleBlogMouseDown = (e) => {
    isDraggingBlog.current = true
    blogStartX.current = e.pageX
    setIsTransitioning(false) // Disable transitions while dragging
  }

  const handleBlogMouseMove = (e) => {
    if (!isDraggingBlog.current) return
    const currentX = e.pageX
    const offset = currentX - blogStartX.current
    setDragOffset(offset)
  }

  const handleBlogMouseUp = () => {
    if (!isDraggingBlog.current) return
    isDraggingBlog.current = false

    const distance = dragOffset
    setDragOffset(0)
    setIsTransitioning(true) // Re-enable transitions for snapping

    if (Math.abs(distance) > 50) {
      if (distance < 0) {
        setBlogCurrentIndex((prev) => prev + 1)
      } else {
        setBlogCurrentIndex((prev) => prev - 1)
      }
    }
  }

  const menuItems = [
    { name: 'Home', link: '/' },
    { name: 'Shop', link: '/', badge: 'New', badgeColor: 'bg-[#43d1f0]' },
    { name: 'Products', link: '/' },
    { name: 'Sale', link: '/sale', badge: 'Sale', badgeColor: 'bg-[#ffa800]' },
    { name: 'Pages', link: '/' },
    { name: 'Lookbook', link: '/' },
    { name: 'Blog', link: '/' },
    { name: 'Buy Theme', link: 'https://themeforest.net/item/kalles-clean-versatile-shopify-theme/26320622?irgwc=1&afsrc=1&clickid=Swb0uKSNBxycRPL3-A1o-wRDUku2Ad31qSqO3k0&iradid=275988&irpid=1288411&iradtype=ONLINE_TRACKING_LINK&irmptype=mediapartner&mp_value1=&utm_campaign=af_impact_radius_1288411&utm_medium=affiliate&utm_source=impact_radius' },
  ]

  const shopMegaMenu = {
    categories: [
      {
        title: "SHOP PAGES",
        items: [
          { name: "Grid layout", link: "/grid-layout" },
          { name: "Left sidebar", link: "/grid-left-sidebar" },
          { name: "Right sidebar", link: "/grid-right-sidebar" },
          { name: "Drawer sidebar", link: "/drawer-sidebar" },
          { name: "Fullwidth", link: "/full-width" },
        ]
      },
      {
        title: "FEATURES",
        items: [
          { name: "Pagination default", link: "#", badge: "Hot", badgeColor: "bg-[#ff4e00]" },
          { name: "Load more", link: "#" },
          { name: "Infinite scrolling", link: "#" },
          { name: "Has progress bar", link: "#" },
          { name: "Collection list", link: "#" },
          { name: "Sub Collection", link: "#" },
          { name: "List switcher", link: "#" },
          { name: "Banner Description", link: "#", badge: "Coming...", badgeColor: "bg-[#00A500]" },
          { name: "Multi shipping bar", link: "#", badge: "New", badgeColor: "bg-[#43d1f0]" },
        ]
      },
      {
        title: "HOVER STYLE",
        items: [
          { name: "Hover Style 1", link: "#" },
          { name: "Hover Style 2", link: "#" },
          { name: "Hover Style 3", link: "#" },
          { name: "Hover Style 4", link: "#" },
          { name: "Hover Style 5", link: "#" },
          { name: "Hover Style 6", link: "#" },
        ]
      }
    ],
    images: [
      {
        title: "Women",
        image: "https://kalles-5.myshopify.com/cdn/shop/files/famer2052212158_q1_2-1.jpg?v=1717405215&width=1000",
        link: "#"
      },
      {
        title: "Men",
        image: "https://kalles-5.myshopify.com/cdn/shop/files/361349-216-2_3f0665b7-826e-4d69-a9cf-31a63277ce15.jpg?v=1720487249&width=1800",
        link: "#"
      }
    ]
  };

  const productsMegaMenu = [
    {
      title: "PRODUCT LAYOUTS",
      items: [
        { name: "Product Left thumbnails", link: "/product-left-thumbnails" },
        { name: "Product Media 1 column", link: "/product-media-1column" },
        { name: "Product Media 2 column", link: "/product-media-2column" },
        { name: "Product Media Stacked", link: "/product-media-stacked" },
        { name: "Thumbnail carousel (Bottom)", link: "/thumbnail-carousel" },
        { name: "Thumbnail carousel (Right)", link: "/thumbnail-carousel-r" },
        { name: "Without Thumbnails", link: "/without-thumbnails" },
        { name: "Product Left Sidebar", link: "/product-left-sidebar" },
        { name: "Product Right Sidebar", link: "/product-right-sidebar" },
        { name: "Product Drawer Sidebar", link: "#" },
        { name: "Product Tab Accordions", link: "/product-tab-accordions" },
        { name: "Product Tab Accordions Inner", link: "#" },
        { name: "Product ATC Full", link: "#" },
        { name: "Product FullWidth", link: "#" },
      ]
    },
    {
      title: "PRODUCT DETAILS",
      items: [
        { name: "External/Affiliate Product", link: "#" },
        { name: "Product Simple", link: "#", badge: "Hot", badgeColor: "bg-[#ff4e00]" },
        { name: "Product Group", link: "/product-group" },
        { name: "Variant Picker", link: "#" },
        { name: "Inner Zoom #1", link: "#" },
        { name: "Inner Zoom #2", link: "#" },
        { name: "External Zoom", link: "#" },
        { name: "PhotoSwipe Popup", link: "#" },
        { name: "Product Video", link: "#" },
        { name: "Product 3D, AR models", link: "#", badge: "Hot", badgeColor: "bg-[#ff4e00]" },
        { name: "Line item property", link: "#", badge: "Hot", badgeColor: "bg-[#ff4e00]" },
        { name: "Linked products", link: "#", badge: "New", badgeColor: "bg-[#43d1f0]" },
        { name: "Recipient information form for gift card products", link: "#" },
      ]
    },
    {
      title: "PRODUCT SWATCH",
      items: [
        { name: "Product Color Swatch", link: "#" },
        { name: "Product Gallery Swatch", link: "#" },
        { name: "Product Images Swatch", link: "#" },
        { name: "Swatch Rectangle", link: "#" },
        { name: "Swatch Rectangle Size", link: "#" },
        { name: "Swatch Radio", link: "#" },
        { name: "Swatch Color Radio", link: "#" },
        { name: "Swatch Simple", link: "#" },
        { name: "Swatch Simple Color", link: "#" },
      ]
    },
    {
      title: "PRODUCT FEATURES",
      items: [
        { name: "Frequently Bought Together", link: "#", badge: "Hot", badgeColor: "bg-[#ff4e00]" },
        { name: "Product Pre-orders", link: "#" },
        { name: "Product Upsell Features", link: "#" },
        { name: "Back in stock notification", link: "#" },
        { name: "Pickup availability", link: "#", badge: "New", badgeColor: "bg-[#43d1f0]" },
        { name: "Product group media", link: "#", badge: "Hot", badgeColor: "bg-[#ff4e00]" },
        { name: "Size Guide HTML", link: "#" },
        { name: "Delivery & Return", link: "#" },
        { name: "Ask a Question", link: "#" },
        { name: "Product Sticky", link: "#" },
        { name: "360° product viewer", link: "/360" },
        { name: "Dynamic Checkout Buttons", link: "#" },
        { name: "Sticky Add To Cart", link: "#" },
        { name: "Complimentary products", link: "#", badge: "New", badgeColor: "bg-[#43d1f0]" },
      ]
    }
  ];

  const pagesMegaMenu = [
    {
      title: "PORTFOLIO",
      items: [
        { name: "Portfolio 2 Columns", link: "/portfolio" },
        { name: "Portfolio 3 Columns", link: "/portfolio3" },
        { name: "Portfolio 4 Columns", link: "/" },
        { name: "Portfolio With Lookbook", link: "/" },
        { name: "Portfolio With Shop", link: "/" },
        { name: "Portfolio With Instagram Shop", link: "/" },
      ]
    },
    {
      title: "HEADER LAYOUTS",
      items: [
        { name: "Header inline", link: "#" },
        { name: "Header logo center", link: "#" },
        { name: "Header logo left, search form", link: "#" },
        { name: "Header menu split", link: "#" },
        { name: "Header transparent", link: "#" },
        { name: "Header sidebar", link: "#", badge: "Coming...", badgeColor: "bg-[#00a500]" },
        { name: "Header sidebar with search form", link: "#", badge: "Coming...", badgeColor: "bg-[#00a500]" },
        { name: "Header with categories menu", link: "#", badge: "Coming...", badgeColor: "bg-[#00a500]" },
        { name: "Header menu in bottom", link: "#" },
      ]
    },
    {
      title: "FEATURES",
      items: [
        { name: "Storefront filtering", link: "#", badge: "Hot", badgeColor: "bg-[#ff4e00]" },
        { name: "Catalog mode", link: "#", badge: "New", badgeColor: "bg-[#43d1f0]" },
        { name: "Cookies law info", link: "#" },
        { name: "Age verification", link: "#" },
        { name: "Footer sticky", link: "#" },
        { name: "Compare", link: "#", badge: "New", badgeColor: "bg-[#43d1f0]" },
        { name: "Popup Newsletter", link: "#" },
        { name: "Frequently Bought Together", link: "#" },
        { name: "Variant Images Grouped", link: "#" },
      ]
    },
    {
      title: "OTHER PAGES",
      items: [
        { name: "Contact us", link: "/contact" },
        { name: "About us", link: "/about" },
        { name: "Store locator", link: "#", badge: "Hot", badgeColor: "bg-[#ff4e00]" },
        { name: "FAQs", link: "/faqs" },
        { name: "FAQs 2", link: "/faqs2" },
        { name: "Brands", link: "/brands" },
        { name: "404", link: "#" },
        { name: "Time line", link: "/timeline" },
      ]
    }
  ];

  const homeLayouts = [
    {
      name: "Home Hiking",
      image: "https://kalles-5.myshopify.com/cdn/shop/files/home_hiking.jpg?v=1769650364&width=600",
      badge: "Coming...",
      badgeColor: "bg-[#00A500]",
    },
    {
      name: "Home Digital",
      image: "https://kalles-5.myshopify.com/cdn/shop/files/home_digital.jpg?v=1769650435&width=600",
      badge: "Coming...",
      badgeColor: "bg-[#00A500]",
    },
    {
      name: "Home Fashion default",
      image: "https://kalles-5.myshopify.com/cdn/shop/files/Frame_754.jpg?v=1763968726&width=600",
    },
    {
      name: "Multi brand",
      image: "https://kalles-5.myshopify.com/cdn/shop/files/preview_multi_brand.jpg?v=1765792642&width=600",
      badge: "Hot",
      badgeColor: "bg-[#ff4e00]",
    },
    {
      name: "Home Barber",
      image: "https://kalles-5.myshopify.com/cdn/shop/files/Frame_764.jpg?v=1768809539&width=600",
    },
    {
      name: "Home Drone",
      image: "https://kalles-5.myshopify.com/cdn/shop/files/Frame_769.jpg?v=1768809428&width=600",
      badge: "New",
      badgeColor: "bg-[#43d1f0]",
    },
    {
      name: "Home Cosmetic",
      image: "https://kalles-5.myshopify.com/cdn/shop/files/Frame_765.jpg?v=1768809508&width=600",
      badge: "New",
      badgeColor: "bg-[#43d1f0]",
    },
    {
      name: "Home Electric Vertical",
      image: "https://kalles-5.myshopify.com/cdn/shop/files/Frame_763.jpg?v=1768809372&width=600",
      badge: "New",
      badgeColor: "bg-[#43d1f0]",
    },
    {
      name: "Home Flower",
      image: "https://kalles-5.myshopify.com/cdn/shop/files/Frame_773.jpg?v=1768815155&width=600",
      badge: "New",
      badgeColor: "bg-[#43d1f0]",
    },
    {
      name: "Home Furniture 02",
      image: "https://kalles-5.myshopify.com/cdn/shop/files/Frame_768.jpg?v=1768809313&width=600",
      badge: "New",
      badgeColor: "bg-[#43d1f0]",
    },
  ];

  const lookbookMenu = [
    { name: "Lookbook slider", link: "/lookbook-slider" },
    { name: "Lookbook section", link: "#" },
    { name: "Lookbook instagram", link: "/lookbook-instagram" },
    { name: "Loobook In Portfolio", link: "#" },
    { name: "Lookbook In Blog Post", link: "/lookbook-blog" },
    { name: "Lookbook In Page", link: "/lookbook" },
  ];

  const blogLayouts = [
    { name: "Blog grid layout", link: "/blog-grid-layout" },
    { name: "Masonry layout", link: "/blog-grid-layout" },
    { name: "Left sidebar", link: "/blog-grid-layout" },
    { name: "Right sidebar", link: "/blog-grid-layout" },
    { name: "Sidebar drawer", link: "/blog-grid-layout" },
    { name: "Single Post", link: "/blog-grid-layout" },
    { name: "Single Post with Instagram Shop", link: "/blog-grid-layout" },
    { name: "Single Post with Product Listing", link: "/blog-grid-layout" },
    { name: "Single Post with Lookbook", link: "/blog-grid-layout" },
    { name: "Single Post with Categories", link: "/blog-grid-layout" },
  ];

  const blogPosts = [
    {
      id: 1,
      image: "https://kalles-5.myshopify.com/cdn/shop/articles/1-7-1.jpg?v=1752720549&width=1920",
      category: "Fashion, Travel",
      title: "Style for couple in Wedding season",
      author: "admin",
      date: "July 16, 2025"
    },
    {
      id: 2,
      image: "https://kalles-5.myshopify.com/cdn/shop/articles/2-7-1_45af8fe8-7b6a-460c-b3b4-0766b8de92a9.jpg?v=1752720529&width=1920",
      category: "Fashion, Life Style",
      title: "Style Advice All Men Should Hear",
      author: "admin",
      date: "May 10, 2022"
    },
    {
      id: 3,
      image: "https://kalles-5.myshopify.com/cdn/shop/articles/couple-7-1_6661d358-744a-4c05-b693-d80ece65bcd5.jpg?v=1752720506&width=1920",
      category: "Fashion, Wedding",
      title: "Best Wedding Outfits for Couples",
      author: "admin",
      date: "August 12, 2025"
    },
    {
      id: 4,
      image: "https://kalles-5.myshopify.com/cdn/shop/articles/handbag-1478814_1920.jpg?v=1717399462&width=1920",
      category: "Accessories, Fashion",
      title: "Choosing the Perfect Handbag",
      author: "admin",
      date: "June 05, 2025"
    },
    {
      id: 5,
      image: "https://kalles-5.myshopify.com/cdn/shop/articles/street-style-girl3-7-1.jpg?v=1717399460&width=1920",
      category: "Street Style, Fashion",
      title: "Street Style Trends to Watch",
      author: "admin",
      date: "September 20, 2025"
    },
    {
      id: 6,
      image: "https://kalles-5.myshopify.com/cdn/shop/articles/young-woman-1149643_1920-7-1.jpg?v=1717399464&width=1920",
      category: "Fashion, Portrait",
      title: "Portrait of Modern Elegance",
      author: "admin",
      date: "October 15, 2025"
    },
    {
      id: 7,
      image: "https://kalles-5.myshopify.com/cdn/shop/articles/hand-3200400_1920.jpg?v=1717399450&width=1920",
      category: "Details, Fashion",
      title: "The Art of Fashion Details",
      author: "admin",
      date: "November 02, 2025"
    }
  ];

  const saleMegaMenu = {
    categories: ["ACCESSORIES", "MEN", "WOMEN", "BAG", "FASHION", "SHOES", "DRESS", "WATCH"],
    products: [
      {
        id: 30,
        name: "Premium Cotton T-Shirt",
        price: 248.00,
        oldPrice: 350.00,
        images: ["https://kalles-5.myshopify.com/cdn/shop/files/361349-217-2_c9d91a63-b4f5-4bc4-b5e5-ab06a6c4ca63.jpg?v=1720487249&width=533", "https://kalles-5.myshopify.com/cdn/shop/files/361349-216-2_3f0665b7-826e-4d69-a9cf-31a63277ce15.jpg?v=1720487249&width=940"],
        colors: ["#ffffff", "#e5e7eb"]
      },
      {
        id: 31,
        name: "Acennan Ruby Earrings",
        price: 3368.00,
        oldPrice: 3391.00,
        images: ["https://kalles-5.myshopify.com/cdn/shop/files/Earrings-Acennan.jpg?v=1717404261&width=940", "https://kalles-5.myshopify.com/cdn/shop/files/Earrings-Acennan-2.jpg?v=1717404261&width=990"],
        colors: ["#dcdcdc", "#ececec"]
      },
      {
        id: 32,
        name: "Classic Leather Bag",
        price: 57.00,
        oldPrice: 75.00,
        images: ["https://kalles-5.myshopify.com/cdn/shop/files/product-24.jpg?v=1753410407&width=720", "https://kalles-5.myshopify.com/cdn/shop/files/product-25.jpg?v=1753410407&width=720"]
      },
      {
        id: 33,
        name: "Fashion Dress",
        price: 1083.00,
        images: ["https://kalles-5.myshopify.com/cdn/shop/files/20_a228cf39-328a-4316-9cb8-43012541a698.jpg?v=1717404055&width=720", "https://kalles-5.myshopify.com/cdn/shop/files/4_25b62db1-68e1-4c31-b72a-060b57e11f68.jpg?v=1717404055&width=720"]
      },
      {
        id: 34,
        name: "Summer Cotton Tee",
        price: 120.00,
        oldPrice: 150.00,
        images: ["https://kalles-5.myshopify.com/cdn/shop/files/product-45.jpg?v=1717402725&width=720", "https://kalles-5.myshopify.com/cdn/shop/files/product-46.jpg?v=1717402725&width=720"],
        colors: ["#f3f4f6", "#1f2937"]
      },
      {
        id: 35,
        name: "Blue Denim Jacket",
        price: 450.00,
        images: ["https://kalles-5.myshopify.com/cdn/shop/files/69957116_041_b.jpg?v=1747129694&width=940", "https://kalles-5.myshopify.com/cdn/shop/files/69957116_041_d.jpg?v=1747129694&width=940"]
      },
      {
        id: 36,
        name: "Stylish White Sneakers",
        price: 890.00,
        images: ["https://kalles-5.myshopify.com/cdn/shop/files/ezgif.com-webp-to-jpg_1.jpg?v=1717403734&width=720", "https://kalles-5.myshopify.com/cdn/shop/files/ezgif.com-webp-to-jpg_e77ecbaa-4aa5-41b7-ba2f-f057f4ae6aa7.jpg?v=1717403734&width=720"]
      },
      {
        id: 37,
        name: "Winter Warm Jacket",
        price: 1250.00,
        images: ["https://kalles-5.myshopify.com/cdn/shop/files/jacket.jpg?v=1717403710&width=823", "https://kalles-5.myshopify.com/cdn/shop/files/jacket-2.jpg?v=1717403710&width=720"]
      },
      {
        id: 38,
        name: "Casual Short Sleeve",
        price: 248.00,
        images: ["https://kalles-5.myshopify.com/cdn/shop/files/eberj4183019d5e_q1_2-0_4e036e1e-79fe-4129-958e-9a1a2698ce6a.jpg?v=1717404543&width=360", "https://kalles-5.myshopify.com/cdn/shop/files/eberj4183019d5e_q3_2-0_d06f4236-5147-48d3-83dd-13a55d4f57f7.jpg?v=1717404543&width=360"]
      }
    ]
  };

  const augmentedSaleProducts = [
    ...saleMegaMenu.products.slice(-4),
    ...saleMegaMenu.products,
    ...saleMegaMenu.products.slice(0, 4)
  ].map(p => ({
    ...p,
    image1: p.images?.[0] || null,
    image2: p.images?.[1] || null,
    image3: p.images?.[2] || null,
    image4: p.images?.[3] || null,
    image5: p.images?.[4] || null,
  }));

  const augmentedBlogPosts = [
    blogPosts[blogPosts.length - 2],
    blogPosts[blogPosts.length - 1],
    ...blogPosts,
    blogPosts[0],
    blogPosts[1]
  ];

  return (
    <>
      <Topbar />
      <UtilityBar />

      {/* Sidebar for Mobile */}
      <MobileSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        menuItems={menuItems}
        saleMegaMenu={saleMegaMenu}
        homeLayouts={homeLayouts}
        shopMegaMenu={shopMegaMenu}
        productsMegaMenu={productsMegaMenu}
        pagesMegaMenu={pagesMegaMenu}
        lookbookMenu={lookbookMenu}
        blogLayouts={blogLayouts}
        blogPosts={blogPosts}
        onSearchOpen={() => setIsSearchOpen(true)}
        onAccountClick={handleUserClick}
        wishlistCount={wishlistCount}
      />

      <nav className="bg-white border-b border-gray-100 sticky top-0 z-[100]">
        <div className="container mx-auto px-4 h-16 lg:h-20 flex items-center justify-between relative">
          {/* Mobile: Hamburger Menu (Left) */}
          <button
            className="lg:hidden text-[#222] hover:text-[#43D1F0] transition-colors"
            onClick={() => setIsSidebarOpen(true)}
          >
            <Menu size={24} strokeWidth={1.5} />
          </button>

          {/* Logo section (Centered on Mobile, Left on Desktop) */}
          <div className="flex-shrink-0 absolute left-1/2 -translate-x-1/2 lg:static lg:translate-x-0 z-10">
            <a
              href="/"
              className="text-3xl lg:text-4xl font-bold tracking-tighter text-[#222]"
            >
              <img
                src="https://kalles-5.myshopify.com/cdn/shop/files/kalles.svg?v=1717404087&width=190"
                alt=""
              />
            </a>
          </div>

          {/* Navigation Menu (Hidden on Mobile) */}
          <ul className="hidden lg:flex items-center space-x-10 h-full" ref={navRef}>
            {menuItems.map((item, index) => {
              const hasMegaMenu = ["Home", "Shop", "Products", "Pages", "Lookbook", "Blog", "Sale"].includes(item.name)
              const isOpen = activeMenu === item.name

              return (
                <li
                  key={index}
                  className="relative flex items-center h-full"
                  onMouseEnter={() => hasMegaMenu && handleMenuMouseEnter(item.name)}
                  onMouseLeave={() => hasMegaMenu && handleMenuMouseLeave()}
                >
                  <Link
                    to={item.link}
                    onClick={
                      hasMegaMenu
                        ? (e) => handleMenuClick(e, item.name, item.link)
                        : undefined
                    }
                    className={`text-[14px] font-semibold transition-colors tracking-wide py-8 ${isOpen ? 'text-[#43D1F0]' : 'text-[#222] hover:text-[#43D1F0]'}`}
                  >
                    {item.name}
                  </Link>
                  {item.badge && (
                    <span
                      className={`absolute top-4 -right-3 px-1.5 py-0.5 text-[9px] font-bold text-white uppercase rounded-sm ${item.badgeColor} leading-none`}
                    >
                      {item.badge}
                    </span>
                  )}

                  {/* Mega Menu for Home */}
                  {item.name === "Home" && (
                    <div className={`absolute top-full -left-[220px] w-[1170px] bg-white shadow-xl border-t border-gray-50 p-6 z-[1000] transition-all duration-300 ease-in-out
                      ${isOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible translate-y-4'}
                    `}>
                      <div className="grid grid-cols-5 gap-6">
                        {homeLayouts.map((layout, lIndex) => (
                          <div
                            key={lIndex}
                            className="group/item cursor-pointer text-center hover:border rounded-md border-black p-1  "
                          >
                            <div className="relative overflow-hidden rounded-md mb-3  ">
                              <img
                                src={layout.image}
                                alt={layout.name}
                                className="w-full h-auto"
                              />
                              {layout.badge && (
                                <span
                                  className={`absolute top-3 right-3 px-2 py-1 text-[10px] font-bold text-white uppercase rounded-sm ${layout.badgeColor} leading-none`}
                                >
                                  {layout.badge}
                                </span>
                              )}

                            </div>
                            <h5 className="text-[13px] font-bold text-[#222] group-hover/item:text-[#43D1F0] transition-colors">
                              {layout.name}
                            </h5>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Mega Menu for Shop */}
                  {item.name === "Shop" && (
                    <div className={`absolute top-full -left-[250px] w-[1070px] bg-white shadow-xl border-t border-gray-50 p-8 z-[1000] transition-all duration-300 ease-in-out
                      ${isOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible translate-y-4'}
                    `}>
                      <div className="grid grid-cols-5 gap-8">
                        {shopMegaMenu.categories.map((cat, cIndex) => (
                          <div key={cIndex}>
                            <h4 className="text-[14px] font-bold text-[#222] mb-6 tracking-widest uppercase">
                              {cat.title}
                            </h4>
                            <ul className="space-y-3">
                              {cat.items.map((sub, sIndex) => (
                                <li key={sIndex} className="flex items-center group/sub">
                                  <a
                                    href={sub.link}
                                    className="text-[14px] text-gray-500 hover:text-[#43D1F0] transition-colors"
                                  >
                                    {sub.name}
                                  </a>
                                  {sub.badge && (
                                    <span className={`ml-2 px-1.5 py-0.5 text-[9px] font-bold text-white uppercase rounded-sm ${sub.badgeColor} leading-none`}>
                                      {sub.badge}
                                    </span>
                                  )}
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}

                        {/* Images */}
                        {shopMegaMenu.images.map((img, iIndex) => (
                          <div key={iIndex} className="relative group/shopimg overflow-hidden cursor-pointer rounded-sm">
                            <img
                              src={img.image}
                              alt={img.title}
                              className="w-full h-full object-cover transition-transform duration-700 group-hover/shopimg:scale-105"
                            />
                            <div className="absolute inset-0 bg-black/5 group-hover/shopimg:bg-transparent transition-colors duration-300"></div>
                            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white px-8 py-2.5 text-black font-semibold shadow-md pointer-events-none text-sm transition-all duration-300 group-hover/shopimg:bg-[#43D1F0] group-hover/shopimg:text-white">
                              {img.title}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Mega Menu for Products */}
                  {item.name === "Products" && (
                    <div className={`absolute top-full -left-[335px] w-[1070px] bg-white shadow-xl border-t border-gray-50 p-8 z-[1000] transition-all duration-300 ease-in-out
                      ${isOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible translate-y-4'}
                    `}>
                      <div className="grid grid-cols-4 gap-4">
                        {productsMegaMenu.map((cat, cIndex) => (
                          <div key={cIndex}>
                            <h4 className="text-[14px] font-bold text-[#222] mb-6 tracking-widest uppercase">
                              {cat.title}
                            </h4>
                            <ul className="space-y-3">
                              {cat.items.map((sub, sIndex) => (
                                <li key={sIndex} className="flex items-center group/sub">
                                  <a
                                    href={sub.link}
                                    className="text-[14px] text-gray-500 hover:text-[#43D1F0] transition-colors"
                                  >
                                    {sub.name}
                                  </a>
                                  {sub.badge && (
                                    <span className={`ml-2 px-1.5 py-0.5 text-[9px] font-bold text-white uppercase rounded-sm ${sub.badgeColor} leading-none`}>
                                      {sub.badge}
                                    </span>
                                  )}
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Mega Menu for Pages */}
                  {item.name === "Pages" && (
                    <div className={`absolute top-full -left-[500px] w-[1170px] bg-white shadow-xl border-t border-gray-50 p-8 z-[1000] transition-all duration-300 ease-in-out
                      ${isOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible translate-y-4'}
                    `}>
                      <div className="grid grid-cols-4 gap-8">
                        {pagesMegaMenu.map((cat, cIndex) => (
                          <div key={cIndex}>
                            <h4 className="text-[14px] font-bold text-[#222] mb-6 tracking-widest uppercase">
                              {cat.title}
                            </h4>
                            <ul className="space-y-3">
                              {cat.items.map((sub, sIndex) => (
                                <li key={sIndex} className="flex items-center group/sub">
                                  <a
                                    href={sub.link}
                                    className="text-[14px] text-gray-500 hover:text-[#43D1F0] transition-colors"
                                  >
                                    {sub.name}
                                  </a>
                                  {sub.badge && (
                                    <span className={`ml-2 px-1.5 py-0.5 text-[9px] font-bold text-white uppercase rounded-sm ${sub.badgeColor} leading-none`}>
                                      {sub.badge}
                                    </span>
                                  )}
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Dropdown for Lookbook */}
                  {item.name === "Lookbook" && (
                    <div className={`absolute top-full left-0 w-[240px] bg-white shadow-xl border-t border-gray-50 z-[1000] transition-all duration-300 ease-in-out
                      ${isOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible translate-y-4'}
                    `}>
                      <ul className="py-2">
                        {lookbookMenu.map((sub, sIndex) => (
                          <li key={sIndex} className="px-5 py-3 hover:bg-gray-50 group/item">
                            <a
                              href={sub.link}
                              className="text-[14px] text-gray-500 group-hover/item:text-[#43D1F0] transition-colors"
                            >
                              {sub.name}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Mega Menu for Sale */}
                  {item.name === "Sale" && (
                    <div className={`absolute top-full -left-[450px] w-[1170px] bg-white shadow-xl border-t border-gray-50 z-[1000] transition-all duration-300 ease-in-out
                      ${isOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible translate-y-4'}
                    `}>
                      <div className="flex">
                        {/* Sidebar Categories */}
                        <div className="w-[240px] border-r border-gray-100">
                          <ul>
                            {saleMegaMenu.categories.map((cat, cIdx) => (
                              <li
                                key={cIdx}
                                onClick={() => navigate('/grid-layout')}
                                className={`px-6 py-4 flex items-center justify-between group/cat cursor-pointer hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0 ${cIdx === 1 ? 'text-[#43D1F0]' : 'text-gray-800'}`}
                              >
                                <div className="flex items-center gap-3">
                                  <span className="text-[12px] font-bold tracking-wider uppercase">
                                    {cat}
                                  </span>
                                  {cat === "MEN" && (
                                    <span className="px-1.5 py-0.5 text-[9px] font-bold text-white uppercase rounded-sm bg-[#43d1f0] leading-none">
                                      New
                                    </span>
                                  )}
                                </div>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Product Slider Area */}
                        <div className="flex-1 p-8 relative group/saleslider overflow-hidden">
                          <div
                            className={`flex ${saleIsTransitioning ? 'transition-transform duration-500 ease-in-out' : ''} gap-6`}
                            style={{ transform: `translateX(calc(-${saleCurrentIndex * 25}% - ${saleCurrentIndex * 6}px))` }}
                          >
                            {augmentedSaleProducts.map((product, pIdx) => (
                              <div key={`${product.id}-${pIdx}`} className="min-w-[calc(25%-18px)] group/prod">
                                <Link to={`/product/${product.id}`} state={{ product }} className="block relative aspect-[3/4] overflow-hidden bg-[#f6f6f6] mb-4 rounded-sm">
                                  {/* Multi-image Hover Setup */}
                                  <img
                                    src={product.images[0]}
                                    alt={product.name}
                                    className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500 group-hover/prod:opacity-0"
                                  />
                                  <img
                                    src={product.images[1]}
                                    alt={product.name}
                                    className="absolute inset-0 w-full h-full object-cover transition-all duration-500 opacity-0 group-hover/prod:opacity-100 group-hover/prod:scale-105"
                                  />
                                  {product.badge && (
                                    <span className="absolute top-3 right-3 w-10 h-10 bg-gray-400 text-white text-[10px] flex items-center justify-center rounded-full font-bold uppercase leading-tight text-center p-1 shadow-sm opacity-90 z-10">
                                      {product.badge}
                                    </span>
                                  )}

                                  {/* Action Icons (Side) */}
                                  <div className="absolute top-4 left-4 flex flex-col gap-2 transition-all duration-300 opacity-0 -translate-x-4 group-hover/prod:opacity-100 group-hover/prod:translate-x-0 z-20">
                                    <button className="bg-white p-2.5 rounded-full hover:bg-[#43D1F0] hover:text-white transition-colors shadow-sm">
                                      <Heart size={18} strokeWidth={1.5} />
                                    </button>
                                    <button className="bg-white p-2.5 rounded-full hover:bg-[#43D1F0] hover:text-white transition-colors shadow-sm">
                                      <Maximize2 size={18} strokeWidth={1.5} />
                                    </button>
                                  </div>

                                  {/* Center Quick Action Buttons */}
                                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 transition-all duration-300 opacity-0 pointer-events-none group-hover/prod:opacity-100 group-hover/prod:pointer-events-auto z-20">
                                    <button
                                      onClick={(e) => { e.preventDefault(); e.stopPropagation(); openQuickView(product); }}
                                      className="bg-white text-black px-8 py-3 rounded-full text-[13px] font-bold hover:bg-[#222] hover:text-white transition-all duration-300 translate-y-4 group-hover/prod:translate-y-0 w-[85%] pointer-events-auto"
                                    >
                                      Quick view
                                    </button>
                                    <button
                                      onClick={(e) => { e.preventDefault(); e.stopPropagation(); openQuickAdd(product); }}
                                      className="bg-[#43D1F0] text-white px-8 py-3 rounded-full text-[13px] font-bold hover:bg-[#222] transition-all duration-300 translate-y-4 group-hover/prod:translate-y-0 w-[85%] pointer-events-auto"
                                    >
                                      Quick add
                                    </button>
                                  </div>
                                </Link>
                                <Link to={`/product/${product.id}`} state={{ product }} className="block space-y-1">
                                  <h4 className="text-[14px] font-bold text-[#222] group-hover/prod:text-[#43D1F0] transition-colors line-clamp-2">
                                    {product.name}
                                  </h4>
                                  <div className="flex items-center gap-2">
                                    {product.oldPrice && (
                                      <span className="text-gray-400 line-through text-[14px]">
                                        {formatPrice(product.oldPrice)}
                                      </span>
                                    )}
                                    <span className={`text-[14px] font-semibold ${product.oldPrice ? 'text-[#ff4e00]' : 'text-[#222]'}`}>
                                      {product.oldPrice ? formatPrice(product.price) : `${formatPrice(product.price)} - ${formatPrice(product.price + 23)}`}
                                    </span>
                                  </div>
                                  {/* Color Swatches */}
                                  {product.colors && (
                                    <div className="flex gap-2 mt-2">
                                      {product.colors.map((color, cIdx) => (
                                        <div
                                          key={cIdx}
                                          className={`w-5 h-5 rounded-full border border-gray-200 cursor-pointer p-0.5 ${cIdx === 0 ? 'border-black' : ''}`}
                                        >
                                          <div className="w-full h-full rounded-full" style={{ backgroundColor: color }}></div>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </Link>
                              </div>
                            ))}
                          </div>

                          {/* Navigation Arrows for Sale Slider */}
                          <div className="absolute top-[40%] -translate-y-1/2 left-4 right-4 flex justify-between opacity-0 group-hover/saleslider:opacity-100 transition-opacity pointer-events-none">
                            <button
                              onClick={handleSalePrev}
                              className="w-10 h-10 bg-white shadow-md rounded-full flex items-center justify-center text-[#222] hover:bg-[#43D1F0] hover:text-white transition-all pointer-events-auto"
                            >
                              <ChevronLeft size={20} strokeWidth={1.5} />
                            </button>
                            <button
                              onClick={handleSaleNext}
                              className="w-10 h-10 bg-white shadow-md rounded-full flex items-center justify-center text-[#222] hover:bg-[#43D1F0] hover:text-white transition-all pointer-events-auto"
                            >
                              <ChevronRight size={20} strokeWidth={1.5} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                  }

                  {/* Mega Menu for Blog */}
                  {
                    item.name === "Blog" && (
                      <div className={`absolute top-full -left-[683px] w-[1070px] bg-white shadow-xl border-t border-gray-50 p-8 z-[1000] transition-all duration-300 ease-in-out
                      ${isOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible translate-y-4'}
                    `}>
                        <div className="grid grid-cols-12 gap-8">
                          {/* Sidebar */}
                          <div className="col-span-3 border-r border-gray-100 pr-8">
                            <h4 className="text-[14px] font-bold text-[#222] mb-6 tracking-widest uppercase">BLOG LAYOUT</h4>
                            <ul className="space-y-4">
                              {blogLayouts.map((layout, lIndex) => (
                                <li key={lIndex}>
                                  <a href={layout.link} className="text-[14px] text-gray-500 hover:text-[#43D1F0] transition-colors">
                                    {layout.name}
                                  </a>
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* Slider Content */}
                          <div className="col-span-9 relative group/blogslider">
                            <div
                              className="overflow-hidden cursor-grab active:cursor-grabbing select-none"
                              onMouseDown={handleBlogMouseDown}
                              onMouseMove={handleBlogMouseMove}
                              onMouseUp={handleBlogMouseUp}
                              onMouseLeave={handleBlogMouseUp}
                            >
                              <div
                                className={`flex ${isTransitioning ? 'transition-transform duration-500 ease-in-out' : ''} gap-6 pointer-events-none`}
                                style={{ transform: `translateX(calc(-${blogCurrentIndex * 50}% - ${blogCurrentIndex * 12}px + ${dragOffset}px))` }}
                              >
                                {augmentedBlogPosts.map((post, pIdx) => (
                                  <div key={`${post.id}-${pIdx}`} className="min-w-[calc(50%-12px)] group/post flex flex-col pointer-events-auto">
                                    <div className="relative aspect-[1.5/1] overflow-hidden mb-4 rounded-sm">
                                      <img
                                        src={post.image}
                                        alt={post.title}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover/post:scale-105"
                                      />
                                    </div>
                                    <div className="space-y-2">
                                      <p className="text-[13px] text-gray-400">{post.category}</p>
                                      <h4 className="text-[16px] font-bold text-[#222] group-hover/post:text-[#43D1F0] transition-colors leading-tight">
                                        {post.title}
                                      </h4>
                                      <p className="text-[13px] text-gray-400">
                                        By <span className="text-[#222]">{post.author}</span> on {post.date}
                                      </p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Navigation Arrows */}
                            <div className="absolute top-1/2 -translate-y-1/2 -left-4 -right-4 flex justify-between opacity-0 group-hover/blogslider:opacity-100 transition-opacity pointer-events-none">
                              <button
                                onClick={handleBlogPrev}
                                className="w-10 h-10 bg-white shadow-md rounded-full flex items-center justify-center text-[#222] hover:bg-[#43D1F0] hover:text-white transition-all pointer-events-auto"
                              >
                                <ChevronLeft size={20} strokeWidth={1.5} />
                              </button>
                              <button
                                onClick={handleBlogNext}
                                className="w-10 h-10 bg-white shadow-md rounded-full flex items-center justify-center text-[#222] hover:bg-[#43D1F0] hover:text-white transition-all pointer-events-auto"
                              >
                                <ChevronRight size={20} strokeWidth={1.5} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  }
                </li>
              )
            })}
          </ul>

          {/* Action Icons (Modified for Mobile) */}
          <div className="flex items-center space-x-3 lg:space-x-6">
            <button
              className="text-[#222] hover:text-[#43D1F0] transition-colors"
              onClick={() => setIsSearchOpen(true)}
            >
              <Search size={22} strokeWidth={1.5} />
            </button>
            <button
              className="hidden lg:block text-[#222] hover:text-[#43D1F0] transition-colors"
              onClick={handleUserClick}
              title={user ? `Logout (${user.name})` : 'Login'}
            >
              <User size={24} strokeWidth={1.5} />
            </button>
            <Link
              to="/wishlist"
              className="hidden lg:block relative text-[#222] hover:text-[#43D1F0] transition-colors"
            >
              <Heart size={24} strokeWidth={1.5} />
              {wishlistCount > 0 && (
                <span className="absolute -top-2 -right-2 w-4 h-4 bg-black text-white text-[10px] flex items-center justify-center rounded-full font-bold">
                  {wishlistCount}
                </span>
              )}
            </Link>
            <button
              className="relative text-[#222] hover:text-[#43D1F0] transition-colors"
              onClick={openCart}
            >
              <ShoppingCart size={22} strokeWidth={1.5} />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 w-4 h-4 bg-black text-white text-[10px] flex items-center justify-center rounded-full font-bold">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </nav >

      <LoginSidebar
        isOpen={accountView === 'login'}
        onClose={() => setAccountView(null)}
        onSwitchToRegister={() => setAccountView('register')}
        onLogin={setUser}
      />

      <RegisterSidebar
        isOpen={accountView === 'register'}
        onClose={() => setAccountView(null)}
        onSwitchToLogin={() => setAccountView('login')}
        onLogin={setUser}
      />

      <SearchSidebar
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
      <QuickAddModal
        key={`nav-add-${selectedProduct?.id}-${isQuickAddOpen}`}
        product={selectedProduct}
        isOpen={isQuickAddOpen}
        onClose={() => setIsQuickAddOpen(false)}
      />

      <QuickViewModal
        key={`nav-view-${selectedProduct?.id}-${isQuickViewOpen}`}
        product={selectedProduct}
        isOpen={isQuickViewOpen}
        onClose={() => setIsQuickViewOpen(false)}
      />
    </>
  )
}

export default Navbar