import axios from 'axios';
import {
    Bell,
    LogOut,
    Mail,
    Menu,
    Moon,
    Settings,
    Sun
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminTopbar = ({ toggleSidebar }) => {
    const [notifications, setNotifications] = useState([]);
    const [showNotifications, setShowNotifications] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(localStorage.getItem('theme') === 'dark');
    const navigate = useNavigate();
    const notificationRef = useRef(null);

    // Local state for user info to allow real-time updates
    const [userData, setUserData] = useState(JSON.parse(sessionStorage.getItem('admin_user') || localStorage.getItem('admin_user') || '{}'));

    useEffect(() => {
        const handleUserUpdate = () => {
            const updated = JSON.parse(sessionStorage.getItem('admin_user') || localStorage.getItem('admin_user') || '{}');
            setUserData(updated);
        };

        window.addEventListener('userUpdated', handleUserUpdate);
        window.addEventListener('storage', handleUserUpdate); // For multi-tab support
        
        return () => {
            window.removeEventListener('userUpdated', handleUserUpdate);
            window.removeEventListener('storage', handleUserUpdate);
        };
    }, []);

    const handleLogout = async () => {
        if (window.confirm('Are you sure you want to logout?')) {
            try {
                const adminId = sessionStorage.getItem('adminId') || localStorage.getItem('adminId');
                const adminUser = JSON.parse(sessionStorage.getItem('admin_user') || localStorage.getItem('admin_user') || '{}');
                
                // Set admin as offline in DB
                await axios.post('http://localhost:5000/admin/logout', { adminId });
                
                // Log the activity
                if (adminUser.name && adminUser.email) {
                    await axios.post('http://localhost:5000/api/auth/logout', {
                        name: adminUser.name,
                        email: adminUser.email
                    });
                }
            } catch (err) {
                console.error('Logout API error:', err);
            }
            
            sessionStorage.removeItem('token');
            sessionStorage.removeItem('admin_user');
            sessionStorage.removeItem('adminId');
            localStorage.removeItem('token');
            localStorage.removeItem('admin_user');
            localStorage.removeItem('adminId');
            navigate('/admin/login');
        }
    };

    // Set admin offline when browser tab is closed
    useEffect(() => {
        const handleBeforeUnload = () => {
            const adminId = sessionStorage.getItem('adminId') || localStorage.getItem('adminId');
            if (adminId) {
                navigator.sendBeacon(
                    'http://localhost:5000/admin/logout',
                    new Blob([JSON.stringify({ adminId })], { type: 'application/json' })
                );
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, []);

    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [isDarkMode]);

    const toggleTheme = () => {
        setIsDarkMode(!isDarkMode);
    };

    const fetchNotifications = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/notifications');
            setNotifications(res.data);
        } catch (err) {
            console.error("Error fetching notifications", err);
        }
    };

    useEffect(() => {
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 30000);

        const handleClickOutside = (event) => {
            if (notificationRef.current && !notificationRef.current.contains(event.target)) {
                setShowNotifications(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            clearInterval(interval);
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const unreadCount = notifications.filter(n => !n.is_read).length;

    const markAsRead = async (id) => {
        try {
            await axios.put(`http://localhost:5000/api/notifications/${id}/read`);
            setNotifications(notifications.map(n => n.id === id ? { ...n, is_read: 1 } : n));
        } catch (err) {
            console.error("Error marking as read", err);
        }
    };

    const markAllAsRead = async () => {
        try {
            await axios.put(`http://localhost:5000/api/notifications/read-all`);
            setNotifications(notifications.map(n => ({ ...n, is_read: 1 })));
        } catch (err) {
            console.error("Error marking all as read", err);
        }
    };
    return (
        <header className="h-16 glass flex items-center px-6 justify-between shrink-0 sticky top-0 z-40 transition-colors duration-300">
            {/* Left */}
            <div className="flex items-center gap-6">
                <button
                    onClick={toggleSidebar}
                    className="p-2 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all"
                >
                    <Menu size={20} />
                </button>
            </div>

            {/* Right */}
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 border-r pr-4 border-slate-200 dark:border-slate-800 mr-2">
                    <div className="relative" ref={notificationRef}>
                        <button
                            onClick={() => setShowNotifications(!showNotifications)}
                            className="p-2 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all relative"
                        >
                            <Bell size={18} />
                            {unreadCount > 0 && (
                                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-950"></span>
                            )}
                        </button>

                        {showNotifications && (
                            <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-lg z-50 overflow-hidden">
                                <div className="p-3 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-950/50">
                                    <h3 className="font-semibold text-sm text-slate-800 dark:text-slate-200">Notifications</h3>
                                    {unreadCount > 0 && (
                                        <button onClick={markAllAsRead} className="text-xs text-indigo-500 hover:text-indigo-600 font-medium">
                                            Mark all read
                                        </button>
                                    )}
                                </div>
                                <div className="max-h-[300px] overflow-y-auto">
                                    {notifications.length === 0 ? (
                                        <div className="p-4 text-center text-slate-500 text-sm">No notifications</div>
                                    ) : (
                                        notifications.map((notif) => (
                                            <div
                                                key={notif.id}
                                                onClick={() => !notif.is_read && markAsRead(notif.id)}
                                                className={`p-3 border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer ${!notif.is_read ? 'bg-slate-50 dark:bg-slate-800/30' : ''}`}
                                            >
                                                <div className="flex gap-3">
                                                    <div className={`mt-1 w-2 h-2 rounded-full shrink-0 ${notif.type === 'error' ? 'bg-red-500' : 'bg-indigo-500'}`}></div>
                                                    <div>
                                                        <p className={`text-sm ${!notif.is_read ? 'font-medium text-slate-800 dark:text-slate-200' : 'text-slate-600 dark:text-slate-400'}`}>
                                                            {notif.message}
                                                        </p>
                                                        <p className="text-xs text-slate-400 mt-1">{new Date(notif.created_at).toLocaleString()}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                    {/* <button className="hidden sm:inline-flex p-2 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all">
                        <List size={18} />
                    </button> */}
                    <button className="p-2 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all">
                        <Mail size={18} />
                    </button>
                </div>

                <div className="flex items-center gap-2 mr-2">
                    <button
                        onClick={toggleTheme}
                        className="p-2 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all"
                    >
                        {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
                    </button>
                    <button 
                        onClick={() => navigate('/admin/settings')}
                        className="p-2 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all"
                    >
                        <Settings size={18} />
                    </button>
                </div>

                <div onClick={() => navigate('/admin/profile')} className="flex items-center gap-3 pl-2 group cursor-pointer transition-all active:scale-95">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-bold text-slate-800 dark:text-slate-200 leading-none mb-1 group-hover:text-indigo-600 transition-colors">{userData.name || 'Admin'}</p>
                        <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 leading-none uppercase tracking-widest">{userData.role || userData.designation || 'Staff'}</p>
                    </div>
                    <div className="w-10 h-10 rounded-xl overflow-hidden border-2 border-slate-200 dark:border-slate-800 group-hover:border-indigo-500 transition-all shadow-sm ring-indigo-500/10 group-hover:ring-4">
                        <img
                            src={userData.avatar || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSex0_2jKFFviUr3QZCCN_v31N5_gF4_U_Z9Q&s"}
                            alt="Avatar"
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>

                <div className="flex items-center gap-2 border-l pl-4 border-slate-200 dark:border-slate-800 ml-2">
                    <button
                        onClick={handleLogout}
                        className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-all flex items-center gap-2 text-xs font-bold uppercase tracking-wider"
                        title="Log Out"
                    >
                        <LogOut size={18} />
                        <span className="hidden sm:inline">Log Out</span>
                    </button>
                </div>
            </div>
        </header>
    );
};

export default AdminTopbar;
