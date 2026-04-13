import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { User, Mail, Calendar, ShieldCheck, Search } from 'lucide-react';

const Users = () => {
    const [users, setUsers] = useState([]);
    const [admins, setAdmins] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const isUserOnline = (userEmail) => {
        if (!userEmail) return false;
        // Check in users table
        const user = users.find(u => u.email === userEmail);
        if (user && user.is_online === 1) return true;
        return false;
    };

    const filteredUsers = users.filter(user => 
        (user.name || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
        (user.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.id.toString().includes(searchTerm)
    );

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [usersRes, adminsRes] = await Promise.all([
                    axios.get('http://localhost:5000/users'),
                    axios.get('http://localhost:5000/admins/online-status')
                ]);
                setUsers(usersRes.data);
                setAdmins(adminsRes.data);
            } catch (err) {
                console.error("Error fetching data:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
        const interval = setInterval(fetchData, 10000); // Refresh every 10s
        return () => clearInterval(interval);
    }, []);

    const getStatusColor = (status) => {
        switch (status) {
            case 1: return 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400 border-emerald-100 dark:border-emerald-500/20';
            case 0: return 'bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400 border-rose-100 dark:border-rose-500/20';
            default: return 'bg-slate-50 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border-slate-100 dark:border-slate-800';
        }
    };

    const handleStatusToggle = async (id, currentStatus) => {
        const newStatus = currentStatus === 1 ? 0 : 1;
        try {
            await axios.put(`http://localhost:5000/users/${id}/status`, { status: newStatus });
            setUsers(users.map(user =>
                user.id === id ? { ...user, status: newStatus } : user
            ));
        } catch (error) {
            console.error("Error updating status:", error);
            alert("Failed to update status");
        }
    };


    return (
        <div className="max-w-[1600px] mx-auto space-y-6 relative z-10">
            <div className="glass-card rounded-2xl overflow-hidden">
                <div className="px-6 py-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                    <div>
                        <h3 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                            User Management
                            <ShieldCheck size={20} className="text-indigo-600" />
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5 uppercase tracking-wider">Manage system users and permissions</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search users..."
                                className="pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 w-[200px] md:w-[300px] text-slate-900 dark:text-white placeholder:text-slate-400"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        </div>
                        {!loading && (
                            <div className="hidden md:flex px-4 py-1.5 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-full text-[11px] font-bold uppercase tracking-widest border border-indigo-100 dark:border-indigo-500/20">
                                {filteredUsers.length} Users
                            </div>
                        )}
                    </div>
                </div>

                <div className="overflow-x-auto min-h-[400px] flex flex-col">
                    {loading ? (
                        <div className="flex-1 flex flex-col items-center justify-center p-20 space-y-4">
                            <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                            <p className="text-slate-500 font-medium animate-pulse">Loading users base...</p>
                        </div>
                    ) : (
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-slate-50/50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 uppercase text-[11px] font-extrabold tracking-wider border-b border-slate-200 dark:border-slate-800">
                                    <th className="px-6 py-4">User Details</th>
                                    <th className="px-6 py-4">Email Address</th>
                                    <th className="px-6 py-4 text-center">Status</th>
                                    <th className="px-6 py-4 text-right">Join Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                {filteredUsers.map((user) => (
                                    <tr key={user.id} className="hover:bg-slate-50/50 dark:hover:bg-indigo-500/5 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center font-bold text-sm border border-slate-200 dark:border-slate-700">
                                                    {user.name?.split(' ').map(n => n[0]).join('') || 'U'}
                                                </div>
                                                <div>
                                                    <div className="text-sm font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                                                        {user.name || "Unnamed"}
                                                        {isUserOnline(user.email) && (
                                                            <span className="flex h-2 w-2 relative">
                                                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                                                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                                                            </span>
                                                        )}
                                                    </div>
                                                    <p className="text-[11px] text-slate-500 font-medium tracking-tight">ID: #USR-{user.id}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300 text-sm font-medium">
                                                <Mail size={14} className="text-slate-400" />
                                                {user.email}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <div className="flex flex-col items-center gap-1">
                                                <button
                                                    onClick={() => handleStatusToggle(user.id, user.status)}
                                                    className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-extrabold uppercase border cursor-pointer hover:opacity-80 transition-opacity ${getStatusColor(user.status)}`}
                                                >
                                                    {user.status === 1 ? 'Active' : 'Deactivated'}
                                                </button>
                                                {isUserOnline(user.email) ? (
                                                    <span className="text-[9px] font-extrabold text-emerald-500 uppercase tracking-widest animate-pulse">Online Now</span>
                                                ) : (
                                                    <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest">Offline</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2 text-slate-500 dark:text-slate-400 text-[13px] font-bold">
                                                <Calendar size={14} />
                                                {new Date(user.created_at).toLocaleDateString("en-US", { year: 'numeric', month: 'short', day: 'numeric' })}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>

                {filteredUsers.length === 0 && (
                    <div className="p-12 text-center">
                        <User size={48} className="mx-auto text-slate-200 mb-4" />
                        <h4 className="text-slate-900 dark:text-white font-bold">No users found</h4>
                        <p className="text-slate-500 text-sm">Synchronize with your user base.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Users;
