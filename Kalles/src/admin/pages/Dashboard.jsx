import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Users, TrendingUp, Package, Layers, MessageSquare, Briefcase, ShoppingCart, AlertCircle, ArrowUpRight } from 'lucide-react';
import { PieChart, Pie, Sector, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';


import { useCurrency } from '../../Context/CurrencyContext';

const Dashboard = () => {
    const { formatPrice } = useCurrency();
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalProducts: 0,
        totalCategories: 0,
        totalMessages: 0,
        totalPortfolio: 0,
        totalOrders: 0,
        recentOrders: [],
        salesTrend: [],
        topProducts: [],
        lowStockProducts: []
    });
    const [loading, setLoading] = useState(true);
    const [daysRange, setDaysRange] = useState(7);
    const [isCustomizing, setIsCustomizing] = useState(false);

    const handleExportReport = () => {
        // Create a simple CSV content from current stats
        const reportData = [
            ['Metric', 'Value'],
            ['Total Users', stats.totalUsers],
            ['Total Products', stats.totalProducts],
            ['Total Categories', stats.totalCategories],
            ['Total Orders', stats.totalOrders],
            ['Total Messages', stats.totalMessages],
            ['Timestamp', new Date().toLocaleString()]
        ];

        const csvContent = "data:text/csv;charset=utf-8," 
            + reportData.map(e => e.join(",")).join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `dashboard_report_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleCustomizeWidgets = () => {
        setIsCustomizing(true);
        setTimeout(() => {
            alert("Widget customization mode activated! (You can now drag and drop - mock feature)");
            setIsCustomizing(false);
        }, 500);
    };

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await axios.get('http://localhost:5000/dashboard-stats');
                setStats(response.data);
            } catch (error) {
                console.error("Error fetching dashboard stats:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats(); // Initial fetch
        
        // Setup polling every 5 seconds for live updates
        const interval = setInterval(fetchStats, 5000);
        
        // Cleanup on unmount
        return () => clearInterval(interval);
    }, []);

    const chartData = [...Array(daysRange)].map((_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - (daysRange - 1 - i));
        
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        const dateStr = `${year}-${month}-${day}`;
        
        const matchingStats = stats.salesTrend?.filter(item => item.date === dateStr) || [];
        
        let point = { name: d.toLocaleDateString('en-US', { day: '2-digit', month: 'short' }) };
        
        matchingStats.forEach(stat => {
            const cur = stat.currency || 'AED';
            point[cur] = Number(stat.revenue);
        });
        
        return point;
    });

    const activeCurrencies = Array.from(new Set(stats.salesTrend?.map(item => item.currency || 'AED') || []));
    if (activeCurrencies.length === 0) activeCurrencies.push('AED');

    return (
        <div className="max-w-[1600px] mx-auto space-y-8 relative z-10 p-2 md:p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Dashboard Overview</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium">Monitoring your system performance and user growth.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button 
                        onClick={handleExportReport}
                        className="px-5 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-sm font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-all shadow-sm flex items-center gap-2 active:scale-95"
                    >
                        <ArrowUpRight size={16} /> Export Report
                    </button>
                    <button 
                        onClick={handleCustomizeWidgets}
                        className={`px-5 py-2.5 ${isCustomizing ? 'bg-indigo-400' : 'bg-indigo-600 hover:bg-indigo-700'} text-white rounded-xl text-sm font-bold shadow-lg shadow-indigo-600/20 transition-all transition-transform hover:-translate-y-0.5 active:translate-y-0 active:scale-95`}
                    >
                        {isCustomizing ? 'Loading...' : 'Customize Widgets'}
                    </button>
                </div>
            </div>

            {/* Main Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { title: 'Total Users', value: stats.totalUsers, icon: <Users size={28} />, color: 'indigo', link: '/admin/users' },
                    { title: 'Products', value: stats.totalProducts, icon: <Package size={28} />, color: 'blue', link: '/admin/products' },
                    { title: 'Categories', value: stats.totalCategories, icon: <Layers size={28} />, color: 'amber', link: '/admin/categories' },
                    { title: 'Total Orders', value: stats.totalOrders, icon: <ShoppingCart size={28} />, color: 'emerald', link: '/admin/orders' },
                ].map((card, idx) => (
                    <Link key={idx} to={card.link} className="glass-card p-6 rounded-2xl flex items-center justify-between group cursor-pointer relative overflow-hidden active:scale-95 transition-transform duration-200">
                        <div className="space-y-3 z-10">
                            <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">{card.title}</p>
                            <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white tabular-nums">
                                {loading ? <div className="h-9 w-16 bg-slate-200 dark:bg-slate-800 animate-pulse rounded" /> : card.value}
                            </h3>
                        </div>
                        <div className={`p-4 bg-${card.color}-50 dark:bg-${card.color}-500/10 text-${card.color}-600 dark:text-${card.color}-400 rounded-2xl transition-transform group-hover:scale-110 duration-300 z-10`}>
                            {card.icon}
                        </div>
                    </Link>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Sales Trend Chart */}
                <div className="lg:col-span-2 glass-card rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-lg font-extrabold text-slate-900 dark:text-white tracking-tight">Sales Analytics</h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Revenue growth over the last {daysRange} days</p>
                        </div>
                        <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
                            <button 
                                onClick={() => setDaysRange(7)}
                                className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${daysRange === 7 ? 'bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-white' : 'text-slate-500 hover:text-slate-700'}`}
                            >
                                7 Days
                            </button>
                            <button 
                                onClick={() => setDaysRange(30)}
                                className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${daysRange === 30 ? 'bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-white' : 'text-slate-500 hover:text-slate-700'}`}
                            >
                                30 Days
                            </button>
                        </div>
                    </div>
                    <div className="h-[300px] w-full">
                        {loading ? (
                            <div className="w-full h-full bg-slate-50 dark:bg-slate-900/50 animate-pulse rounded-xl" />
                        ) : (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={chartData} margin={{ top: 20, right: 20, left: 0, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" opacity={0.5} />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8', fontWeight: 'bold' }} dy={10} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8', fontWeight: 'bold' }} tickFormatter={(val) => val >= 1000 ? (val/1000).toFixed(1) + 'k' : val} />
                                    <RechartsTooltip
                                        contentStyle={{ backgroundColor: '#222', borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', color: '#fff', fontWeight: 'bold' }}
                                        itemStyle={{ color: '#fff' }}
                                        formatter={(value, name) => [`${name} ${Number(value).toFixed(2)}`, 'Revenue']}
                                        cursor={{ fill: '#f1f5f9' }}
                                    />
                                    <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', fontWeight: 'bold', paddingTop: '20px' }} />
                                    {activeCurrencies.map((cur, idx) => {
                                        const colors = ['#43D1F0', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444'];
                                        const curColor = colors[idx % colors.length];
                                        return (
                                            <Bar 
                                                key={cur}
                                                dataKey={cur} 
                                                name={`${cur} Orders`}
                                                fill={curColor} 
                                                radius={[6, 6, 0, 0]}
                                                maxBarSize={50}
                                                animationDuration={1500}
                                            />
                                        );
                                    })}
                                </BarChart>
                            </ResponsiveContainer>
                        )}
                    </div>
                </div>

                {/* Top Selling Products */}
                <div className="glass-card rounded-2xl p-6">
                    <div className="mb-6">
                        <h3 className="text-lg font-extrabold text-slate-900 dark:text-white tracking-tight">Top Products</h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Best performing items by quantity</p>
                    </div>
                    <div className="space-y-4">
                        {loading ? (
                            [...Array(5)].map((_, i) => <div key={i} className="h-16 bg-slate-50 dark:bg-slate-800 animate-pulse rounded-xl" />)
                        ) : stats.topProducts?.length > 0 ? (
                            stats.topProducts.map((product, idx) => (
                                <div key={idx} className="flex items-center justify-between p-3 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-colors group">
                                    <div className="flex items-center gap-3">
                                        <img src={product.image1} alt="" className="w-10 h-10 rounded-lg object-cover bg-slate-100" />
                                        <div>
                                            <p className="text-sm font-bold text-slate-900 dark:text-white truncate lg:max-w-[120px]">{product.name}</p>
                                            <p className="text-[11px] text-slate-500 font-medium">{product.total_sold} Sold</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <TrendingUp className="text-emerald-500 group-hover:scale-110 transition-transform" size={18} />
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-10 text-slate-500 text-xs">No sales data found.</div>
                        )}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Recent Orders Table */}
                <div className="glass-card rounded-2xl overflow-hidden">
                    <div className="px-6 py-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-extrabold text-slate-900 dark:text-white tracking-tight">Recent Orders</h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Overview of the latest customer orders</p>
                        </div>
                        <Link to="/admin/orders" className="text-sm font-bold text-indigo-600 hover:text-indigo-700 transition-colors">View All</Link>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-slate-50/50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 uppercase text-[10px] font-extrabold tracking-wider border-b border-slate-200 dark:border-slate-800">
                                    <th className="px-6 py-4">Order</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-right">Amount</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                {loading ? (
                                    [...Array(3)].map((_, i) => (
                                        <tr key={i}><td colSpan="3" className="px-6 py-4"><div className="h-10 bg-slate-50 animate-pulse rounded" /></td></tr>
                                    ))
                                ) : stats.recentOrders?.map((order) => (
                                    <tr key={order.id} className="hover:bg-slate-50/50 dark:hover:bg-indigo-500/5 transition-colors group">
                                        <td className="px-6 py-4">
                                            <p className="text-sm font-bold text-slate-900 dark:text-white truncate">#{order.id} - {order.customer_name}</p>
                                            <p className="text-[10px] text-slate-400">{new Date(order.created_at).toLocaleDateString()}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${order.status?.toLowerCase() === 'delivered' ? 'bg-emerald-100 text-emerald-700' :
                                                order.status?.toLowerCase() === 'pending' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'
                                                }`}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <span className="text-sm font-black text-indigo-600 dark:text-indigo-400">{order.currency || 'AED'} {Number(order.total_amount).toFixed(2)}</span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Low Stock Alerts */}
                <div className="glass-card rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-lg font-extrabold text-slate-900 dark:text-white tracking-tight">Inventory Alerts</h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Products running low on stock</p>
                        </div>
                        <AlertCircle className="text-amber-500 animate-pulse" size={20} />
                    </div>
                    <div className="space-y-4">
                        {loading ? (
                            [...Array(3)].map((_, i) => <div key={i} className="h-16 bg-slate-50 dark:bg-slate-800 animate-pulse rounded-xl" />)
                        ) : stats.lowStockProducts?.length > 0 ? (
                            stats.lowStockProducts.map((product, idx) => (
                                <div key={idx} className="flex items-center justify-between p-4 bg-amber-50/50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/20 rounded-2xl group transition-all hover:bg-amber-100/50">
                                    <div className="flex items-center gap-4">
                                        <img src={product.image1} alt="" className="w-12 h-12 rounded-xl object-cover bg-white" />
                                        <div>
                                            <p className="text-sm font-bold text-slate-900 dark:text-white">{product.name}</p>
                                            <p className="text-xs font-bold text-red-600 uppercase">Only {product.stock} left</p>
                                        </div>
                                    </div>
                                    <Link
                                        to={`/admin/products/${product.id}`}
                                        className="px-4 py-2 bg-[#222] text-white text-[10px] font-bold uppercase rounded-xl hover:bg-[#43d1f0] transition-colors"
                                    >
                                        Restock
                                    </Link>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-10">
                                <Package className="mx-auto text-slate-300 mb-2" size={40} />
                                <p className="text-slate-500 text-xs">All inventory levels are healthy.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;

