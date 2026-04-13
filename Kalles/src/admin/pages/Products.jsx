import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {
    Box,
    Search,
    Filter,
    Plus,
    Edit,
    Trash2,
    Tag,
    Package,
    X,
    Save
} from 'lucide-react';

const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return { headers: { 'Authorization': `Bearer ${token}` } };
};

const Products = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        stock: '',
        image1: '',
        image2: '',
        image3: '',
        image4: '',
        image5: '',
        discount_percent: '',
        is_preorder: false,
        is_new: false,
        description: '',
        category_ids: [],
        size: [] // Add size array
    });
    const [categories, setCategories] = useState([]);
    const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
    const [showSizeDropdown, setShowSizeDropdown] = useState(false);

    // Filter State
    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState({
        search: '',
        category: '',
        min_price: '',
        max_price: '',
        stock_status: '',
        size: ''
    });



    const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'Free Size'];

    const fetchProducts = React.useCallback(async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams();
            if (filters.search) params.append('search', filters.search);
            if (filters.category) params.append('category', filters.category);
            if (filters.min_price) params.append('min_price', filters.min_price);
            if (filters.max_price) params.append('max_price', filters.max_price);
            if (filters.stock_status) params.append('stock_status', filters.stock_status);
            if (filters.size) params.append('size', filters.size);

            const response = await axios.get(`http://localhost:5000/api/products?${params.toString()}`);
            setProducts(response.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching products:", error);
            setLoading(false);
        }
    }, [filters]);

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            fetchProducts();
        }, 500);
        return () => clearTimeout(timer);
    }, [fetchProducts]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/categories');
                setCategories(response.data);
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        };
        fetchCategories();
    }, []);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const clearFilters = () => {
        setFilters({
            search: '',
            category: '',
            min_price: '',
            max_price: '',
            stock_status: '',
            size: ''
        });
        setShowFilters(false);
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleCategoryToggle = (categoryId) => {
        setFormData(prev => {
            const currentIds = prev.category_ids || [];
            if (currentIds.includes(categoryId)) {
                return { ...prev, category_ids: currentIds.filter(id => id !== categoryId) };
            } else {
                return { ...prev, category_ids: [...currentIds, categoryId] };
            }
        });
    };

    const handleSizeToggle = (size) => {
        setFormData(prev => {
            const currentSizes = prev.size || [];
            if (currentSizes.includes(size)) {
                return { ...prev, size: currentSizes.filter(s => s !== size) };
            } else {
                return { ...prev, size: [...currentSizes, size] };
            }
        });
    };

    const resetForm = () => {
        setFormData({
            name: '',
            price: '',
            stock: '',
            image1: '',
            image2: '',
            image3: '',
            image4: '',
            image5: '',
            discount_percent: '',
            is_preorder: false,
            is_new: false,
            description: '',
            category_ids: [],
            size: []
        });
        setEditingProduct(null);
        setShowModal(false);
        setShowCategoryDropdown(false);
        setShowSizeDropdown(false);
    };

    const handleEdit = (product) => {
        setEditingProduct(product);

        // Parse category_id string to array of integers
        let initialCategories = [];
        if (product.category_id) {
            // Handle both "1,2,3" string and plain numbers if any legacy data exists
            const catString = String(product.category_id);
            if (catString) {
                initialCategories = catString.split(',').map(id => parseInt(id.trim(), 10)).filter(n => !isNaN(n));
            }
        }

        let initialSizes = [];
        if (product.size) {
            initialSizes = String(product.size).split(',').map(s => s.trim());
        }

        setFormData({
            name: product.name,
            price: product.price,
            stock: product.stock,
            image1: product.image1 || '',
            image2: product.image2 || '',
            image3: product.image3 || '',
            image4: product.image4 || '',
            image5: product.image5 || '',
            discount_percent: product.discount_percent || '',
            is_preorder: product.is_preorder === 1,
            is_new: product.is_new === 1,
            description: product.description || '',
            category_ids: initialCategories,
            size: initialSizes
        });
        setShowModal(true);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            // Prepare payload - map category_ids to category_id for backend compatibility
            const payload = {
                ...formData,
                category_id: formData.category_ids // Backend now handles array
            };

            if (editingProduct) {
                await axios.put(`http://localhost:5000/api/products/${editingProduct.id}`, payload, getAuthHeaders());
            } else {
                await axios.post('http://localhost:5000/api/products', payload, getAuthHeaders());
            }
            fetchProducts();
            resetForm();
        } catch (error) {
            console.error("Error saving product:", error);
            if (error.response?.status === 401) {
                alert("Session expired. Please login again.");
                localStorage.removeItem('token');
                window.location.href = '/admin/login';
                return;
            }
            const errorMessage = error.response?.data?.error || error.response?.data?.message || error.message;
            alert(`Failed to save product: ${errorMessage}`);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this product?")) {
            try {
                await axios.delete(`http://localhost:5000/api/products/${id}`, getAuthHeaders());
                fetchProducts();
                fetchProducts();
            } catch (error) {
                console.error("Error deleting product:", error);
                if (error.response?.status === 401) {
                    alert("Session expired. Please login again.");
                    localStorage.removeItem('token');
                    window.location.href = '/admin/login';
                    return;
                }
                const errorMessage = error.response?.data?.error || error.response?.data?.message || error.message;
                alert(`Failed to delete product: ${errorMessage}`);
            }
        }
    };

    // Calculate display status based on stock
    const getDisplayStatus = (stock) => {
        if (stock === 0) return 'Out of Stock';
        if (stock < 10) return 'Low Stock';
        return 'In Stock';
    };

    const getStatusStyles = (status) => {
        switch (status) {
            case 'In Stock': return 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400 border-emerald-100 dark:border-emerald-500/20';
            case 'Low Stock': return 'bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400 border-amber-100 dark:border-amber-500/20';
            case 'Out of Stock': return 'bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400 border-rose-100 dark:border-rose-500/20';
            default: return 'bg-slate-50 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border-slate-100 dark:border-slate-800';
        }
    };

    return (
        <div className="max-w-[1600px] mx-auto space-y-8 relative z-10">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
                        Products
                        <Box className="text-indigo-600" />
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium">Manage your product inventory and catalog.</p>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => { resetForm(); setShowModal(true); }}
                        className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold transition-all shadow-lg shadow-indigo-600/20"
                    >
                        <Plus size={18} />
                        Add Product
                    </button>
                </div>
            </div>

            {/* Filter Bar */}
            <div className="space-y-4">
                <div className="glass-card p-4 rounded-2xl flex flex-wrap items-center gap-4">
                    <div className="relative flex-1 min-w-[240px]">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            name="search"
                            value={filters.search}
                            onChange={handleFilterChange}
                            placeholder="Search products..."
                            className="w-full pl-11 pr-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm text-slate-900 dark:text-white placeholder:text-slate-400"
                        />
                    </div>
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${showFilters
                            ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20"
                            : "bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700"
                            }`}
                    >
                        <Filter size={18} />
                        Filters
                    </button>
                </div>

                {/* Expanded Filter Panel */}
                {showFilters && (
                    <div className="glass-card p-6 rounded-2xl grid grid-cols-1 md:grid-cols-4 gap-6 animate-in slide-in-from-top-2 duration-200">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Category</label>
                            <select
                                name="category"
                                value={filters.category}
                                onChange={handleFilterChange}
                                className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm text-slate-900 dark:text-white"
                            >
                                <option value="">All Categories</option>
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Stock Status</label>
                            <select
                                name="stock_status"
                                value={filters.stock_status}
                                onChange={handleFilterChange}
                                className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm text-slate-900 dark:text-white"
                            >
                                <option value="">All Statuses</option>
                                <option value="in_stock">In Stock</option>
                                <option value="low_stock">Low Stock</option>
                                <option value="out_of_stock">Out of Stock</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Size</label>
                            <select
                                name="size"
                                value={filters.size}
                                onChange={handleFilterChange}
                                className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm text-slate-900 dark:text-white"
                            >
                                <option value="">All Sizes</option>
                                {SIZES.map(size => (
                                    <option key={size} value={size}>{size}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Price Range</label>
                            <div className="flex items-center gap-2">
                                <input
                                    type="number"
                                    name="min_price"
                                    value={filters.min_price}
                                    onChange={handleFilterChange}
                                    placeholder="Min"
                                    className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm text-slate-900 dark:text-white"
                                />
                                <span className="text-slate-400">-</span>
                                <input
                                    type="number"
                                    name="max_price"
                                    value={filters.max_price}
                                    onChange={handleFilterChange}
                                    placeholder="Max"
                                    className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm text-slate-900 dark:text-white"
                                />
                            </div>
                        </div>
                        <div className="flex items-end">
                            <button
                                onClick={clearFilters}
                                className="w-full px-4 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-all text-sm flex items-center justify-center gap-2"
                            >
                                <X size={16} />
                                Clear Filters
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Products Table */}
            <div className="glass-card rounded-2xl overflow-hidden min-h-[500px] flex flex-col">
                {loading ? (
                    <div className="flex-1 flex flex-col items-center justify-center p-20 space-y-4">
                        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                        <p className="text-slate-500 font-bold animate-pulse text-lg tracking-tight">Loading products database...</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-slate-50/50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 uppercase text-[11px] font-extrabold tracking-wider border-b border-slate-200 dark:border-slate-800">
                                    <th className="px-6 py-4">Product Name</th>
                                    <th className="px-6 py-4">Price</th>
                                    <th className="px-6 py-4">Discount</th>
                                    <th className="px-6 py-4">Size</th>
                                    <th className="px-6 py-4">Stock</th>
                                    <th className="px-6 py-4 text-center">Status</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                {products.map((product) => {
                                    const displayStatus = getDisplayStatus(product.stock);
                                    return (
                                        <tr key={product.id} className="hover:bg-slate-50/50 dark:hover:bg-indigo-500/5 transition-colors group">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-4">
                                                    <Link to={`/admin/products/${product.id}`} className="w-12 h-12 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 overflow-hidden flex-shrink-0 cursor-pointer">
                                                        {product.image1 ? (
                                                            <img
                                                                src={product.image1}
                                                                alt={product.name}
                                                                className="w-full h-full object-cover"
                                                                onError={(e) => { e.target.src = 'https://via.placeholder.com/150' }}
                                                            />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center text-slate-400">
                                                                <Package size={20} />
                                                            </div>
                                                        )}
                                                    </Link>
                                                    <div>
                                                        <Link to={`/admin/products/${product.id}`} className="text-sm font-bold text-slate-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                                                            {product.name}
                                                        </Link>
                                                        <div className="text-[11px] text-slate-500 font-medium">ID: {product.id}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="font-bold text-slate-900 dark:text-white flex items-center gap-0.5">
                                                    <span className="text-xs text-slate-400">$</span>
                                                    {product.price}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
                                                    {product.discount_percent}%
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-wrap gap-1">
                                                    {product.size ? (
                                                        String(product.size).split(',').map((s, i) => (
                                                            <span key={i} className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[10px] uppercase font-bold rounded border border-slate-200 dark:border-slate-700">
                                                                {s}
                                                            </span>
                                                        ))
                                                    ) : (
                                                        <span className="text-slate-400 text-xs">-</span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300 text-sm">
                                                    <Package size={14} className="text-slate-400" />
                                                    {product.stock} units
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase border ${getStatusStyles(displayStatus)}`}>
                                                    {displayStatus}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => handleEdit(product)}
                                                        className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-400 hover:text-amber-500 transition-colors"
                                                    >
                                                        <Edit size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(product.id)}
                                                        className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-400 hover:text-rose-500 transition-colors"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                                {products.length === 0 && !loading && (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-12 text-center text-slate-500">
                                            No products found. Add some products to get started.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
            {/* Pagination */}
            <div className="px-6 py-4 bg-slate-50/30 dark:bg-slate-800/30 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <p className="text-xs font-bold text-slate-500 tracking-wide uppercase">Showing {products.length} products</p>
                <div className="flex items-center gap-2">
                    <button className="px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-bold text-slate-400 cursor-not-allowed">Previous</button>
                    <button className="px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 shadow-sm transition-all">Next</button>
                </div>
            </div>

            {/* Add/Edit Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm text-white">
                    <div className="glass rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
                        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50 flex-none">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                                {editingProduct ? 'Edit Product' : 'Add New Product'}
                            </h3>
                            <button onClick={resetForm} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleSave} className="p-6 space-y-4 overflow-y-auto flex-1">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">Product Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-3 py-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm text-slate-900 dark:text-white"
                                    placeholder="e.g. Classic White Tee"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">Categories</label>
                                <div className="relative">
                                    <button
                                        type="button"
                                        onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                                        className="w-full px-3 py-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm text-slate-900 dark:text-white text-left flex justify-between items-center"
                                    >
                                        <span className={formData.category_ids.length === 0 ? "text-slate-400" : ""}>
                                            {formData.category_ids.length > 0
                                                ? `${formData.category_ids.length} Selected`
                                                : "Select Categories"}
                                        </span>
                                        <Tag size={16} className="text-slate-400" />
                                    </button>

                                    {showCategoryDropdown && (
                                        <div className="absolute z-10 w-full mt-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl max-h-60 overflow-hidden flex flex-col">
                                            <div className="p-2 overflow-y-auto flex-1 space-y-1">
                                                {categories.map(cat => (
                                                    <label key={cat.id} className="flex items-center gap-3 px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg cursor-pointer transition-colors">
                                                        <div className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${formData.category_ids.includes(cat.id)
                                                            ? "bg-indigo-600 border-indigo-600 text-white"
                                                            : "border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-950"
                                                            }`}>
                                                            {formData.category_ids.includes(cat.id) && <Box size={12} className="fill-current" />}
                                                        </div>
                                                        <input
                                                            type="checkbox"
                                                            className="hidden"
                                                            checked={formData.category_ids.includes(cat.id)}
                                                            onChange={() => handleCategoryToggle(cat.id)}
                                                        />
                                                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{cat.name}</span>
                                                    </label>
                                                ))}
                                            </div>
                                            <div className="p-2 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
                                                <button
                                                    type="button"
                                                    onClick={() => setShowCategoryDropdown(false)}
                                                    className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-bold transition-all shadow-lg shadow-indigo-600/20"
                                                >
                                                    OK
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">Sizes</label>
                                <div className="relative">
                                    <button
                                        type="button"
                                        onClick={() => setShowSizeDropdown(!showSizeDropdown)}
                                        className="w-full px-3 py-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm text-slate-900 dark:text-white text-left flex justify-between items-center"
                                    >
                                        <span className={(formData.size || []).length === 0 ? "text-slate-400" : ""}>
                                            {(formData.size || []).length > 0
                                                ? `${(formData.size || []).length} Selected`
                                                : "Select Sizes"}
                                        </span>
                                        <Tag size={16} className="text-slate-400" />
                                    </button>

                                    {showSizeDropdown && (
                                        <div className="absolute z-10 w-full mt-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl max-h-60 overflow-hidden flex flex-col">
                                            <div className="p-2 overflow-y-auto flex-1 space-y-1">
                                                {SIZES.map(size => (
                                                    <label key={size} className="flex items-center gap-3 px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg cursor-pointer transition-colors">
                                                        <div className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${formData.size.includes(size)
                                                            ? "bg-indigo-600 border-indigo-600 text-white"
                                                            : "border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-950"
                                                            }`}>
                                                            {formData.size.includes(size) && <Box size={12} className="fill-current" />}
                                                        </div>
                                                        <input
                                                            type="checkbox"
                                                            className="hidden"
                                                            checked={formData.size.includes(size)}
                                                            onChange={() => handleSizeToggle(size)}
                                                        />
                                                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{size}</span>
                                                    </label>
                                                ))}
                                            </div>
                                            <div className="p-2 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
                                                <button
                                                    type="button"
                                                    onClick={() => setShowSizeDropdown(false)}
                                                    className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-bold transition-all shadow-lg shadow-indigo-600/20"
                                                >
                                                    OK
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">Price ($)</label>
                                    <input
                                        type="number"
                                        name="price"
                                        value={formData.price}
                                        onChange={handleInputChange}
                                        required
                                        step="0.01"
                                        className="w-full px-3 py-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm text-slate-900 dark:text-white"
                                        placeholder="0.00"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">Stock</label>
                                    <input
                                        type="number"
                                        name="stock"
                                        value={formData.stock}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-3 py-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm text-slate-900 dark:text-white"
                                        placeholder="0"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">Discount (%)</label>
                                    <input
                                        type="number"
                                        name="discount_percent"
                                        value={formData.discount_percent}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm text-slate-900 dark:text-white"
                                        placeholder="0"
                                    />
                                </div>
                                <div className="flex items-center pt-8 gap-4">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            name="is_preorder"
                                            checked={formData.is_preorder}
                                            onChange={handleInputChange}
                                            className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500 border-gray-300"
                                        />
                                        <span className="text-sm font-bold text-slate-700 dark:text-slate-300">Is Pre-order?</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            name="is_new"
                                            checked={formData.is_new}
                                            onChange={handleInputChange}
                                            className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500 border-gray-300"
                                        />
                                        <span className="text-sm font-bold text-slate-700 dark:text-slate-300">Is New Arrival?</span>
                                    </label>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">Image URLs</label>
                                <div className="space-y-2">
                                    <input
                                        type="text"
                                        name="image1"
                                        value={formData.image1}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm text-slate-900 dark:text-white"
                                        placeholder="Main Image URL"
                                    />
                                    <div className="grid grid-cols-2 gap-2">
                                        <input type="text" name="image2" value={formData.image2} onChange={handleInputChange} className="w-full px-3 py-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm text-slate-900 dark:text-white" placeholder="Image 2 URL" />
                                        <input type="text" name="image3" value={formData.image3} onChange={handleInputChange} className="w-full px-3 py-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm text-slate-900 dark:text-white" placeholder="Image 3 URL" />
                                        <input type="text" name="image4" value={formData.image4} onChange={handleInputChange} className="w-full px-3 py-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm text-slate-900 dark:text-white" placeholder="Image 4 URL" />
                                        <input type="text" name="image5" value={formData.image5} onChange={handleInputChange} className="w-full px-3 py-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm text-slate-900 dark:text-white" placeholder="Image 5 URL" />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">Description</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    rows="4"
                                    className="w-full px-3 py-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm text-slate-900 dark:text-white"
                                    placeholder="Product description... (Enter text or HTML)"
                                />
                            </div>
                            <div className="pt-4 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={resetForm}
                                    className="px-4 py-2 text-sm font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold transition-all shadow-lg shadow-indigo-600/20 flex items-center gap-2"
                                >
                                    <Save size={16} />
                                    {editingProduct ? 'Update Product' : 'Save Product'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Products;
