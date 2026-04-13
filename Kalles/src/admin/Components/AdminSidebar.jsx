import { Menu, LogOut, LayoutDashboard, ShoppingCart, Users as UsersIcon, Activity, Box, Tags, Mail, Briefcase, Settings } from 'lucide-react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import axios from 'axios';

const AdminSidebar = ({ isOpen, onClose }) => {
    const navigate = useNavigate();
    const location = useLocation();

    const menuItems = [
        { path: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { path: '/admin/orders', icon: ShoppingCart, label: 'Orders' },
        { path: '/admin/users', icon: UsersIcon, label: 'Users' },
        { path: '/admin/activity', icon: Activity, label: 'User Activity' },
        { path: '/admin/products', icon: Box, label: 'Products' },
        { path: '/admin/categories', icon: Tags, label: 'Categories' },
        { path: '/admin/portfolio', icon: Briefcase, label: 'Portfolio' },
        { path: '/admin/contact', icon: Mail, label: 'Contact' },
        { path: '/admin/settings', icon: Settings, label: 'Settings' },
    ];

    const handleLogout = async () => {
        try {
            const adminId = sessionStorage.getItem('adminId') || localStorage.getItem('adminId');
            const adminUser = JSON.parse(sessionStorage.getItem('admin_user') || localStorage.getItem('admin_user') || '{}');
            
            await axios.post('http://localhost:5000/admin/logout', { adminId });
            
            if (adminUser.name && adminUser.email) {
                await axios.post('http://localhost:5000/api/auth/logout', {
                    name: adminUser.name,
                    email: adminUser.email
                });
            }
        } catch (err) {
            console.error('Logout API error:', err);
        }
        
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("adminId");
        sessionStorage.removeItem("admin_user");
        localStorage.removeItem("token");
        localStorage.removeItem("adminId");
        localStorage.removeItem("admin_user");
        navigate("/admin/login");
    };

    return (
        <aside className={`
            fixed md:relative
            ${isOpen ? 'translate-x-0 w-[256px]' : '-translate-x-full md:translate-x-0 md:w-0'}
            glass-sidebar h-screen flex flex-col z-50
            transition-all duration-300 ease-in-out
            overflow-hidden
        `}>
            {/* Brand */}
            <div className="h-16 flex items-center px-6 bg-white/5 shrink-0 border-b border-white/10">
                <a href="/" className="flex items-center">
                    <img
                        src="https://kalles-5.myshopify.com/cdn/shop/files/kalles.svg?v=1717404087&width=190"
                        alt="Kalles Logo"
                        className="h-6 invert brightness-0"
                    />
                </a>
            </div>

            {/* Nav */}
            <div className="flex-1 overflow-y-auto py-4">
                <div className="px-6 py-4 text-slate-500 text-[13px] font-medium uppercase tracking-wider">
                    Main Menu
                </div>
                <nav className="px-3 space-y-1">
                    {menuItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            onClick={() => {
                                if (window.innerWidth < 768 && onClose) onClose();
                            }}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group ${location.pathname === item.path
                                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                                : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/50'
                                }`}
                        >
                            <item.icon size={20} className={location.pathname === item.path ? 'text-white' : 'text-slate-500 group-hover:text-slate-300'} />
                            <span className="text-[14px] font-medium whitespace-nowrap">{item.label}</span>
                        </Link>
                    ))}
                </nav>
            </div>

            {/* Footer */}
            <div className="h-14 flex items-center px-4 bg-white/5 border-t border-white/10 shrink-0">
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 text-slate-400 hover:text-white hover:bg-slate-800/50 p-2 rounded-lg transition-all w-full"
                >
                    <LogOut size={18} className="text-slate-500 group-hover:text-indigo-400" />
                    <span className="text-sm font-medium whitespace-nowrap">Sign Out</span>
                </button>
            </div>
        </aside>
    );
};

export default AdminSidebar;
