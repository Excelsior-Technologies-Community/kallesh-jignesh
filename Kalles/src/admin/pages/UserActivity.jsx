import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Activity,
    Smartphone,
    Globe,
    Clock,
    CheckCircle2,
    AlertTriangle,
    Search,
    Filter,
    Download,
    Trash2
} from 'lucide-react';

const UserActivity = () => {
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchActivities = async () => {
            try {
                const response = await axios.get('http://localhost:5000/user-activities');
                setActivities(response.data);
            } catch (err) {
                console.error("Error fetching activities:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchActivities(); // Initial fetch
        
        // Setup polling every 5 seconds for live updates
        const interval = setInterval(fetchActivities, 5000);
        
        // Cleanup on unmount
        return () => clearInterval(interval);
    }, []);

    const getStatusStyles = (status) => {
        switch (status) {
            case 'Success': return 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400 border-emerald-100 dark:border-emerald-500/20';
            case 'Pending': return 'bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400 border-amber-100 dark:border-amber-500/20';
            case 'Alert': return 'bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400 border-rose-100 dark:border-rose-500/20';
            default: return 'bg-slate-50 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border-slate-100 dark:border-slate-800';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Success': return <CheckCircle2 size={12} />;
            case 'Alert': return <AlertTriangle size={12} />;
            case 'Pending': return <Clock size={12} />;
            default: return null;
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this activity log?")) {
            try {
                await axios.delete(`http://localhost:5000/user-activities/${id}`);
                setActivities(activities.filter(activity => activity.id !== id));
            } catch (err) {
                console.error("Error deleting activity:", err);
                alert("Failed to delete activity");
            }
        }
    };


    return (
        <div className="max-w-[1600px] mx-auto space-y-8 relative z-10">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
                        User Activity
                        <Activity className="text-indigo-600" />
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium">Real-time audit logs and user interactions.</p>
                </div>
                <div className="flex items-center gap-2">
                    <button className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-sm font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-all shadow-sm">
                        <Download size={18} />
                        Export Logs
                    </button>
                </div>
            </div>

            {/* Filter Bar */}
            <div className="glass-card p-4 rounded-2xl flex flex-wrap items-center gap-4">
                <div className="relative flex-1 min-w-[240px]">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search activities, users, or IP..."
                        className="w-full pl-11 pr-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm text-slate-900 dark:text-white placeholder:text-slate-400"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <button className="flex items-center gap-2 px-4 py-2.5 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-xl text-sm font-bold hover:bg-slate-100 dark:hover:bg-slate-700 transition-all">
                    <Filter size={18} />
                    Filters
                </button>
            </div>

            {/* Activity Table */}
            <div className="glass-card rounded-2xl overflow-hidden min-h-[400px] flex flex-col">
                {loading ? (
                    <div className="flex-1 flex flex-col items-center justify-center p-20 space-y-4">
                        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                        <p className="text-slate-500 font-bold animate-pulse text-lg tracking-tight">Retrieving audit logs...</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-slate-50/50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 uppercase text-[11px] font-extrabold tracking-wider border-b border-slate-200 dark:border-slate-800">
                                    <th className="px-6 py-4">Actor</th>
                                    <th className="px-6 py-4">Action & Details</th>
                                    <th className="px-6 py-4 text-center">Platform</th>
                                    <th className="px-6 py-4 text-center">Status</th>
                                    <th className="px-6 py-4 text-right">Time</th>
                                    <th className="px-6 py-4 text-center">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                {activities.filter(activity => 
                                    (activity.user_name || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
                                    (activity.user_email || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
                                    (activity.action || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
                                    (activity.ip || '').toLowerCase().includes(searchTerm.toLowerCase())
                                ).map((activity) => (
                                    <tr key={activity.id} className="hover:bg-slate-50/50 dark:hover:bg-indigo-500/5 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-lg shadow-indigo-600/20">
                                                    {activity.user_name?.split(' ').map(n => n[0]).join('') || 'U'}
                                                </div>
                                                <div>
                                                    <div className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-tight">{activity.user_name || "Unknown"}</div>
                                                    <div className="text-[12px] text-slate-500 font-medium">{activity.user_email || "no-email"}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-bold text-indigo-600 dark:text-indigo-400 mb-0.5">{activity.action}</div>
                                            <div className="text-[12px] text-slate-500 dark:text-slate-400 font-medium break-words max-w-xs">{activity.details}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col items-center gap-1.5">
                                                <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                                                    {activity.device?.includes('Windows') ? <Globe size={14} /> : <Smartphone size={14} />}
                                                    <span className="text-[12px] font-bold">{activity.device || "Unknown"}</span>
                                                </div>
                                                <span className="text-[11px] text-slate-400 font-mono tracking-tighter">{activity.ip || "0.0.0.0"}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold uppercase border ${getStatusStyles(activity.status)}`}>
                                                {getStatusIcon(activity.status)}
                                                {activity.status || "Unknown"}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="text-[13px] font-bold text-slate-900 dark:text-white">{activity.created_at ? new Date(activity.created_at).toLocaleString() : "Recently"}</div>
                                            <div className="text-[11px] text-slate-400 font-medium">Audit Log ID: #LOG-{activity.id}</div>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <button
                                                onClick={() => handleDelete(activity.id)}
                                                className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"
                                                title="Delete Log"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
            <div className="px-6 py-4 bg-slate-50/30 dark:bg-slate-800/30 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <p className="text-xs font-bold text-slate-500 tracking-wide uppercase">Showing {activities.filter(activity => (activity.user_name || '').toLowerCase().includes(searchTerm.toLowerCase()) || (activity.user_email || '').toLowerCase().includes(searchTerm.toLowerCase()) || (activity.action || '').toLowerCase().includes(searchTerm.toLowerCase()) || (activity.ip || '').toLowerCase().includes(searchTerm.toLowerCase())).length} total logs</p>
                <div className="flex items-center gap-2">
                    <button className="px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-bold text-slate-400 cursor-not-allowed">Previous</button>
                    <button className="px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 shadow-sm transition-all">Next</button>
                </div>
            </div>
        </div>
    );
};

export default UserActivity;
