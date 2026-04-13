import React from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Layout from "./Layout/Layout";
import AdminLayout from "./Layout/AdminLayout";
import Home from "./Pages/Home";
import Contact from "./Pages/Contact";
import Faqs from "./Pages/Faqs";
import Faqs2 from "./Pages/Faqs2";
import Page404 from "./Pages/404";
import AdminContact from "./admin/pages/Contact";
import Dashboard from "./admin/pages/Dashboard";
import Users from "./admin/pages/Users";
import UserActivity from "./admin/pages/UserActivity";
import Login from "./admin/pages/Login";
import ProtectedRoute from "./admin/ProtectedRoute";
import AdminProducts from "./admin/pages/Products";
import PublicProducts from "./Pages/Products";
import ProductDetails from "./admin/pages/ProductDetails";
import Categories from "./admin/pages/Categories";
import Orders from "./admin/pages/Orders";
import BlogGridLayout from "./Pages/BlogGridLayout";
import Blogdetails from "./Pages/Blogdetails";
import Profile from "./admin/pages/Profile";
import About from "./admin/pages/About"; 
import Brands from "./Pages/Brands";
import Timeline from "./Pages/Timeline";
import Portfolio from "./admin/pages/Portfolio";
import Settings from "./admin/pages/Settings";
import PublicPortfolio from "./Pages/Portfolio";
import Portfolio3 from "./Pages/Portfolio3";
import Collections from "./Pages/Collections";
import Gridlayout from "./Pages/Gridlayout";
import GridwithLeftSidebar from "./Pages/GridwithLeftSidebar";
import GridwithRightSidebar from "./Pages/GridwithRightSidebar";
import Product360Viewer from "./Pages/360";
import DrawerSidebar from "./Pages/DrawerSidebar";
import Lookbook from "./Pages/Lookbook";
import LookbookSlider from "./Pages/lookbook-slider";
import FullWidth from "./Pages/FullWidth";
import AddtoCart from "./Pages/AddtoCart";
import Wishlist from "./Pages/Wishlist";
import Checkout from "./Pages/Checkout";
import LookbookInstagram from "./Pages/LookbookInstagram";
import StoreLocation from "./Pages/StoreLocation";
import LookbookBlog from "./Pages/LookbookBlog";
import VerifyOtp from "./Pages/VerifyOtp";
import ForgotPassword from "./Pages/ForgotPassword";
import ResetPassword from "./Pages/ResetPassword";
import Sale from "./Pages/Sale";
import ProductGroup from "./Pages/ProductGroup";
import ProductLeftSidebar from "./Pages/ProductLeftSidebar";
import ProductLeftThumbnails from "./Pages/ProductLeftThumbnails";
import ProductMedia1column from "./Pages/ProductMedia1column";
import ProductMediaStacked from "./Pages/ProductMediaStacked";
import ProductRightSidebar from "./Pages/ProductRightSidebar";
import ProductTabAccordions from "./Pages/ProductTabAccordions";
import ThumbnailcarouselR from "./Pages/Thumbnailcarousel-R";
import Thumbnailcarousel from "./Pages/Thumbnailcarousel";
import WithoutThumbnails from "./Pages/WithoutThumbnails";
import ProductMedia2column from "./Pages/ProductMedia2column";
import ScrollToTop from "./Components/ScrollToTop";


const App = () => {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        {/* Public Route
        
        s */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/about" element={<About />} />
          <Route path="/faqs" element={<Faqs />} />
          <Route path="/faqs2" element={<Faqs2 />} />
          <Route path="/brands" element={<Brands />} />
          <Route path="/timeline" element={<Timeline />} />
          <Route path="/portfolio" element={<PublicPortfolio />} />
          <Route path="/portfolio3" element={<Portfolio3 />} />
          <Route path="/collections" element={<Collections />} />
          <Route path="/grid-layout" element={<Gridlayout />} />
          <Route path="/grid-left-sidebar" element={<GridwithLeftSidebar />} />
          <Route path="/grid-right-sidebar" element={<GridwithRightSidebar />} />
          <Route path="/drawer-sidebar" element={<DrawerSidebar />} />
          <Route path="/full-width" element={<FullWidth />} />
          <Route path="/lookbook" element={<Lookbook />} />
          <Route path="/lookbook-slider" element={<LookbookSlider />} />
          <Route path="/cart" element={<AddtoCart />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/360" element={<Product360Viewer />} />
          <Route path="/blog-grid-layout" element={<BlogGridLayout />} />
          <Route path="/blog/:id" element={<Blogdetails />} />
          <Route path="/product/:id" element={<PublicProducts />} />
          <Route path="/lookbook-instagram" element={<LookbookInstagram />} />
          <Route path="/store-location" element={<StoreLocation />} />
          <Route path="/lookbook-blog" element={<LookbookBlog />} />
          <Route path="/sale" element={<Sale />} />
          <Route path="/product-group" element={<ProductGroup />} />
          <Route path="/product-left-sidebar" element={<ProductLeftSidebar />} />
          <Route path="/product-left-thumbnails" element={<ProductLeftThumbnails />} />
          <Route path="/product-media-1column" element={<ProductMedia1column />} />
          <Route path="/product-media-stacked" element={<ProductMediaStacked />} />
          <Route path="/product-right-sidebar" element={<ProductRightSidebar />} />
          <Route path="/product-tab-accordions" element={<ProductTabAccordions />} />
          <Route path="/thumbnail-carousel-r" element={<ThumbnailcarouselR />} />
          <Route path="/thumbnail-carousel" element={<Thumbnailcarousel />} />
          <Route path="/without-thumbnails" element={<WithoutThumbnails />} />
          <Route path="/product-media-2column" element={<ProductMedia2column />} />
          <Route path="*" element={<Page404 />} />
        </Route>
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Admin Login - Isolated */}
        <Route path="/admin/login" element={<Login />} />

        {/* Admin Routes with Layout */}
        <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="users" element={<ProtectedRoute><Users /></ProtectedRoute>} />
          <Route path="orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
          <Route path="activity" element={<ProtectedRoute><UserActivity /></ProtectedRoute>} />
          <Route path="products" element={<ProtectedRoute><AdminProducts /></ProtectedRoute>} />
          <Route path="products/:id" element={<ProtectedRoute><ProductDetails /></ProtectedRoute>} />
          <Route path="categories" element={<ProtectedRoute><Categories /></ProtectedRoute>} />
          <Route path="contact" element={<ProtectedRoute><AdminContact /></ProtectedRoute>} />
          <Route path="profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="brands" element={<ProtectedRoute><Brands /></ProtectedRoute>} />
          <Route path="portfolio" element={<ProtectedRoute><Portfolio /></ProtectedRoute>} />
          <Route path="settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
