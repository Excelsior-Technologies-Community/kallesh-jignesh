import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ShoppingCart, Eye, Clock, CheckCircle, Package, Truck, AlertCircle, Calendar, Mail, Phone, MapPin, X, Search } from 'lucide-react';
import { useCurrency } from '../../Context/CurrencyContext';

const Orders = () => {
    const { formatPrice } = useCurrency();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [orderItems, setOrderItems] = useState([]);
    const [loadingItems, setLoadingItems] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchOrders();
        
        // Setup polling every 5 seconds for live updates
        const interval = setInterval(fetchOrders, 5000);
        
        // Cleanup on unmount
        return () => clearInterval(interval);
    }, []);

    const fetchOrders = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/orders');
            setOrders(response.data);
        } catch (err) {
            console.error("Error fetching orders:", err);
        } finally {
            setLoading(false);
        }
    };

    const fetchOrderItems = async (orderId) => {
        setLoadingItems(true);
        try {
            const response = await axios.get(`http://localhost:5000/api/orders/${orderId}/items`);
            setOrderItems(response.data);
        } catch (err) {
            console.error("Error fetching order items:", err);
        } finally {
            setLoadingItems(false);
        }
    };

    const handleViewOrder = (order) => {
        setSelectedOrder(order);
        fetchOrderItems(order.id);
    };

    const handleStatusChange = async (orderId, newStatus) => {
        try {
            await axios.put(`http://localhost:5000/api/orders/${orderId}/status`, { status: newStatus });
            setOrders(orders.map(order =>
                order.id === orderId ? { ...order, status: newStatus } : order
            ));
            if (selectedOrder && selectedOrder.id === orderId) {
                setSelectedOrder({ ...selectedOrder, status: newStatus });
            }
        } catch (err) {
            console.error("Error updating order status:", err);
            alert("Failed to update order status");
        }
    };

    const getStatusIcon = (status) => {
        switch (status?.toLowerCase()) {
            case 'pending': return <Clock size={16} className="text-amber-500" />;
            case 'confirmed': return <CheckCircle size={16} className="text-teal-500" />;
            case 'processing': return <Package size={16} className="text-blue-500" />;
            case 'shipped': return <Truck size={16} className="text-indigo-500" />;
            case 'delivered': return <CheckCircle size={16} className="text-emerald-500" />;
            case 'cancelled': return <AlertCircle size={16} className="text-rose-500" />;
            default: return <Clock size={16} className="text-slate-500" />;
        }
    };

    const getStatusStyle = (status) => {
        switch (status?.toLowerCase()) {
            case 'pending': return 'bg-amber-50 text-amber-700 border-amber-100';
            case 'confirmed': return 'bg-teal-50 text-teal-700 border-teal-100';
            case 'processing': return 'bg-blue-50 text-blue-700 border-blue-100';
            case 'shipped': return 'bg-indigo-50 text-indigo-700 border-indigo-100';
            case 'delivered': return 'bg-emerald-50 text-emerald-700 border-emerald-100';
            case 'cancelled': return 'bg-rose-50 text-rose-700 border-rose-100';
            default: return 'bg-slate-50 text-slate-700 border-slate-100';
        }
    };

    const filteredOrders = orders.filter(order =>
        (order.customer_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (order.customer_email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        `#ORD-${order.id}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.id.toString().includes(searchTerm)
    );

    return (
        <div className="max-w-[1600px] mx-auto space-y-6 relative z-10">
            {/* Header Card */}
            <div className="glass-card rounded-2xl overflow-hidden">
                <div className="px-6 py-5 border-b border-slate-200 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h3 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                            Order Management
                            <ShoppingCart size={20} className="text-indigo-600" />
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5 uppercase tracking-wider">Monitor and process customer orders</p>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search orders..."
                                className="pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 w-[200px] md:w-[300px] text-slate-900 dark:text-white placeholder:text-slate-400"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        </div>
                        <div className="hidden md:flex px-4 py-1.5 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-full text-[11px] font-bold uppercase tracking-widest border border-indigo-100 dark:border-indigo-500/20">
                            {filteredOrders.length} Orders
                        </div>
                    </div>
                </div>

                {/* Table Section */}
                <div className="overflow-x-auto min-h-[400px] flex flex-col">
                    {loading ? (
                        <div className="flex-1 flex flex-col items-center justify-center p-20 space-y-4">
                            <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                            <p className="text-slate-500 font-medium animate-pulse">Loading orders...</p>
                        </div>
                    ) : filteredOrders.length > 0 ? (
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-slate-50/50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 uppercase text-[11px] font-extrabold tracking-wider border-b border-slate-200 dark:border-slate-800">
                                    <th className="px-6 py-4">Order ID & Date</th>
                                    <th className="px-6 py-4">Customer</th>
                                    <th className="px-6 py-4 text-center">Status</th>
                                    <th className="px-6 py-4 text-right">Total Amount</th>
                                    <th className="px-6 py-4 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                {filteredOrders.map((order) => (
                                    <tr key={order.id} className="hover:bg-slate-50/50 dark:hover:bg-indigo-500/5 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-bold text-slate-900 dark:text-white tracking-tight">#ORD-{order.id}</div>
                                            <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-medium mt-1">
                                                <Calendar size={12} />
                                                {new Date(order.created_at).toLocaleDateString()}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-bold text-slate-900 dark:text-white">{order.customer_name}</div>
                                            <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-medium">
                                                <Mail size={12} />
                                                {order.customer_email}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase border ${getStatusStyle(order.status)}`}>
                                                {getStatusIcon(order.status)}
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="text-sm font-black text-indigo-600 dark:text-indigo-400">{order.currency || 'AED'} {Number(order.total_amount).toFixed(2)}</div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={() => handleViewOrder(order)}
                                                className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 rounded-lg transition-all"
                                            >
                                                <Eye size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center p-20 text-center">
                            <ShoppingCart size={48} strokeWidth={1.5} className="text-slate-200 mb-4" />
                            <h4 className="text-slate-900 dark:text-white font-bold">No orders found</h4>
                            <p className="text-slate-500 text-sm max-w-xs mx-auto">Try adjusting your search or check back later for new orders.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Order Detail Modal */}
            {selectedOrder && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
                    <div className="bg-white dark:bg-slate-900 w-full max-w-5xl h-auto max-h-screen rounded-3xl shadow-2xl overflow-hidden animate-slideUp border border-slate-200 dark:border-slate-800 flex flex-col">
                        {/* Modal Header */}
                        <div className="px-8 py-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/50">
                            <div>
                                <h4 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-3">
                                    Order Details
                                    <span className="text-sm font-medium text-slate-400">#ORD-{selectedOrder.id}</span>
                                </h4>
                                <div className="flex items-center gap-4 mt-1">
                                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border ${getStatusStyle(selectedOrder.status)}`}>
                                        {getStatusIcon(selectedOrder.status)}
                                        {selectedOrder.status}
                                    </span>
                                    <span className="text-[11px] text-slate-400 flex items-center gap-1">
                                        <Calendar size={12} />
                                        {new Date(selectedOrder.created_at).toLocaleString()}
                                    </span>
                                </div>
                            </div>
                            <button
                                onClick={() => setSelectedOrder(null)}
                                className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition-colors text-slate-400 hover:text-slate-600"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="flex flex-col md:flex-row h-full max-h-[calc(90vh-140px)] overflow-hidden">
                            {/* Customer & Shipping Info */}
                            <div className="w-full md:w-[350px] p-8 border-r border-slate-100 dark:border-slate-800 space-y-8 bg-slate-50/30 dark:bg-slate-900/30 overflow-y-auto custom-scrollbar shrink-0">
                                <div>
                                    <h5 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4">Customer Info</h5>
                                    <div className="space-y-4">
                                        <div className="flex items-start gap-3">
                                            <div className="p-2 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 rounded-lg">
                                                <ShoppingCart size={16} />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-slate-900 dark:text-white">{selectedOrder.customer_name}</p>
                                                <p className="text-xs text-slate-500 font-medium">#{selectedOrder.user_id ? selectedOrder.user_id : 'Guest'}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 rounded-lg">
                                                <Mail size={16} />
                                            </div>
                                            <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">{selectedOrder.customer_email}</p>
                                        </div>
                                        {selectedOrder.customer_phone && (
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 rounded-lg">
                                                    <Phone size={16} />
                                                </div>
                                                <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">{selectedOrder.customer_phone}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <h5 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4">Shipping Destination</h5>
                                    <div className="space-y-4">
                                        <div className="flex items-start gap-3">
                                            <div className="p-2 bg-rose-50 dark:bg-rose-500/10 text-rose-600 rounded-lg">
                                                <MapPin size={16} />
                                            </div>
                                            <div className="text-xs text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
                                                {selectedOrder.shipping_address}<br />
                                                {selectedOrder.city}, {selectedOrder.state && `${selectedOrder.state}, `}{selectedOrder.zip_code}<br />
                                                <span className="font-bold text-slate-900 dark:text-white uppercase mt-1 inline-block">{selectedOrder.country}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h5 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4">Update Status</h5>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                        {['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map((status) => (
                                            <button
                                                key={status}
                                                onClick={() => handleStatusChange(selectedOrder.id, status)}
                                                className={`px-3 py-2 rounded-xl text-[10px] font-bold transition-all border ${selectedOrder.status === status
                                                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-md'
                                                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-indigo-400 shadow-sm'
                                                    }`}
                                            >
                                                {status}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Order Items List */}
                            <div className="flex-1 p-8 flex flex-col min-h-0 bg-white dark:bg-slate-900">
                                <h5 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4 text-right">Order Items ({orderItems.length})</h5>

                                <div className="flex-1 overflow-y-auto space-y-4 custom-scrollbar pr-2 mb-6">
                                    {loadingItems ? (
                                        <div className="flex flex-col items-center justify-center p-20 space-y-3">
                                            <div className="w-8 h-8 border-3 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                                            <p className="text-xs text-slate-400 font-medium">Fetching items...</p>
                                        </div>
                                    ) : (
                                        orderItems.map((item) => (
                                            <div key={item.id} className="flex gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 group hover:border-indigo-100 transition-all">
                                                <div className="w-16 h-20 rounded-xl bg-slate-200 dark:bg-slate-700 shrink-0 overflow-hidden flex items-center justify-center">
                                                    {(item.product_image || item.fallback_image) ? (
                                                        <img src={item.product_image || item.fallback_image} alt={item.product_name} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <Package size={24} className="text-slate-400" />
                                                    )}
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex justify-between items-start">
                                                        <p className="text-sm font-bold text-slate-900 dark:text-white tracking-tight">{item.product_name}</p>
                                                        <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400 whitespace-nowrap">{selectedOrder.currency || 'AED'} {Number(item.price).toFixed(2)}</p>
                                                    </div>
                                                    <div className="flex flex-wrap items-center gap-4 mt-2">
                                                        <div className="px-2 py-0.5 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded text-[10px] font-bold text-slate-600 dark:text-slate-300">
                                                            Qty: {item.quantity}
                                                        </div>
                                                        {item.selected_size && (
                                                            <div className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">
                                                                Size: <span className="text-slate-900 dark:text-slate-200 font-bold">{item.selected_size}</span>
                                                            </div>
                                                        )}
                                                        {item.selected_color && (
                                                            <div className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">
                                                                Color: <span className="text-slate-900 dark:text-slate-200 font-bold">{item.selected_color}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>

                                <div className="mt-auto pt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between shrink-0">
                                    <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest px-4 py-1 bg-slate-100 dark:bg-slate-800 rounded-full">Total Amount</div>
                                    <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400 tracking-tighter">{selectedOrder.currency || 'AED'} {Number(selectedOrder.total_amount).toFixed(2)}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Orders;
