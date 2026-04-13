import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import {
    Facebook,
    Twitter,
    Link as LinkIcon,
    ChevronLeft,
    ChevronRight,
    LayoutGrid,
    User,
    Calendar,
    MessageCircle,
    Loader2
} from 'lucide-react';

const Blogdetails = () => {
    const { id } = useParams();
    const [blog, setBlog] = useState(null);
    const [relatedBlogs, setRelatedBlogs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBlogData = async () => {
            try {
                // Fetch current blog
                const blogResponse = await axios.get(`http://localhost:5000/api/blogs/${id}`);
                setBlog(blogResponse.data);

                // Fetch all blogs for "Related" section
                const allBlogsResponse = await axios.get('http://localhost:5000/api/blogs');
                // Filter out current blog and take top 3
                const related = allBlogsResponse.data
                    .filter(b => b.id !== parseInt(id))
                    .slice(0, 3);
                setRelatedBlogs(related);

                setLoading(false);
                window.scrollTo(0, 0);
            } catch (error) {
                console.error("Error fetching blog details:", error);
                setLoading(false);
            }
        };

        fetchBlogData();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center">
                <Loader2 className="w-10 h-10 animate-spin text-[#43d1f0] mb-4" />
                <p className="text-gray-500 font-medium tracking-widest text-[12px]">LOADING ARTICLE...</p>
            </div>
        );
    }

    if (!blog) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center">
                <h2 className="text-2xl font-bold mb-4">Article Not Found</h2>
                <Link to="/blog-grid-layout" className="text-[#43d1f0] font-bold underline">Back to Blog</Link>
            </div>
        );
    }

    return (
        <div className="w-full font-['Inter',_sans-serif]">
            {/* Hero Section */}
            <div className="relative w-full h-[40vh] md:h-[50vh] overflow-hidden">
                <img
                    src={blog.image}
                    alt={blog.title}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-center p-4">
                    <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white uppercase tracking-[0.2em] mb-4 max-w-[900px]">
                        {blog.title}
                    </h1>
                    <p className="text-white/80 text-[13px] font-serif italic tracking-widest">
                        {blog.date}
                    </p>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="max-w-[1240px] mx-auto px-4 py-20">
                <div className="max-w-[800px] mx-auto">
                    {/* Secondary Image */}
                    <div className="mb-12 rounded-sm overflow-hidden bg-[#f6f6f6]">
                        <img
                            src={blog.image}
                            alt="Featured content"
                            className="w-full h-auto object-cover"
                        />
                    </div>

                    {/* Content Text */}
                    <div className="prose prose-lg max-w-none text-[#555] leading-[1.8] text-[15px]">
                        <p className="mb-8">
                            {blog.excerpt}
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                        </p>

                        <blockquote className="border-l-0 bg-[#f6f6f6] p-10 my-12 text-center relative italic text-[#222] font-serif text-lg leading-relaxed">
                            " {blog.excerpt.split('.')[0]} "
                        </blockquote>

                        <h3 className="text-xl font-bold text-[#222] uppercase tracking-widest mt-12 mb-6">SHOP THE LOOK</h3>
                        <p className="mb-8">
                            Typography is the work of typesetters, composers, typographers, graphic designers, art directors, manga artists, comic book artists, graffiti artists, and now—anyone who arranges words, letters, numbers, and symbols for publication, display, or distribution.
                        </p>

                        <h3 className="text-xl font-bold text-[#222] uppercase tracking-widest mt-12 mb-6">OUTFIT COLLECTIONS</h3>
                        <p className="mb-12">
                            With the digital age, typography has vanished as a specialized craft to become a tool for everyone, as typography is now something everybody does. As the capability to create typography has become ubiquitous, the application of principles and best practices developed over generations of skilled workers and professionals has diminished accordingly.
                        </p>
                    </div>

                    {/* Footer Meta */}
                    <div className="flex flex-col md:flex-row items-center justify-between py-8 border-t border-b border-[#eee] mb-12 gap-6">
                        <div className="flex items-center gap-2 text-[12px] font-bold text-[#878787] uppercase tracking-widest">
                            <LayoutGrid size={16} className="text-[#43d1f0]" />
                            <span>{blog.category}</span>
                        </div>
                        <div className="flex items-center gap-1 text-[12px] font-bold text-[#878787] uppercase tracking-widest">
                            <MessageCircle size={16} className="text-[#43d1f0]" />
                            <span>0 COMMENTS</span>
                        </div>
                    </div>

                    {/* Social Sharing */}
                    <div className="flex items-center justify-center gap-4 mb-20">
                        <button className="w-10 h-10 rounded-full border border-[#eee] flex items-center justify-center text-[#222] hover:bg-[#222] hover:text-white transition-all cursor-pointer"><Facebook size={18} /></button>
                        <button className="w-10 h-10 rounded-full border border-[#eee] flex items-center justify-center text-[#222] hover:bg-[#222] hover:text-white transition-all cursor-pointer"><Twitter size={18} /></button>
                        <button className="w-10 h-10 rounded-full border border-[#eee] flex items-center justify-center text-[#222] hover:bg-[#222] hover:text-white transition-all cursor-pointer"><LinkIcon size={18} /></button>
                    </div>

                    {/* Navigation */}
                    <div className="flex items-center justify-center gap-12 mb-20">
                        <button className="text-[#878787] hover:text-[#222] transition-colors cursor-pointer"><ChevronLeft size={32} strokeWidth={1} /></button>
                        <Link to="/blog-grid-layout" className="text-[#222] hover:text-[#43d1f0] transition-colors"><LayoutGrid size={24} /></Link>
                        <button className="text-[#878787] hover:text-[#222] transition-colors cursor-pointer"><ChevronRight size={32} strokeWidth={1} /></button>
                    </div>

                    {/* Related Articles */}
                    <div className="text-center mb-12">
                        <h3 className="text-xl font-bold text-[#222] uppercase tracking-widest mb-10">You Might Also Like</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {relatedBlogs.map((item) => (
                                <Link key={item.id} to={`/blog/${item.id}`} className="group block text-left">
                                    <div className="aspect-[4/3] overflow-hidden mb-4 bg-[#f6f6f6] rounded-sm">
                                        <img
                                            src={item.image}
                                            alt={item.title}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                    </div>
                                    <h4 className="text-[14px] font-bold text-[#222] group-hover:text-[#43d1f0] transition-colors uppercase tracking-tight line-clamp-2">
                                        {item.title}
                                    </h4>
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Comment Form */}
                    <div className="mt-20 pt-20 border-t border-[#eee]">
                        <h3 className="text-xl font-bold text-[#222] uppercase tracking-widest mb-2">Leave a Comment</h3>
                        <p className="text-[13px] text-[#878787] mb-10 italic">Your email address will not be published. Required fields are marked *</p>

                        <form className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-[12px] font-bold text-[#222] uppercase tracking-widest mb-2">Name *</label>
                                    <input type="text" className="w-full border border-[#eee] p-4 text-[14px] focus:outline-none focus:border-[#222] transition-colors" />
                                </div>
                                <div>
                                    <label className="block text-[12px] font-bold text-[#222] uppercase tracking-widest mb-2">Email *</label>
                                    <input type="email" className="w-full border border-[#eee] p-4 text-[14px] focus:outline-none focus:border-[#222] transition-colors" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-[12px] font-bold text-[#222] uppercase tracking-widest mb-2">Comment *</label>
                                <textarea rows="6" className="w-full border border-[#eee] p-4 text-[14px] focus:outline-none focus:border-[#222] transition-colors"></textarea>
                            </div>
                            <button className="bg-[#222] text-white px-10 py-4 text-[12px] font-bold uppercase tracking-[0.2em] hover:bg-[#43d1f0] transition-all cursor-pointer shadow-lg active:scale-95">Post Comment</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Blogdetails;
 