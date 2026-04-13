import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
    ArrowLeft,
    Package,
    Tag,
    DollarSign,
    Layers,
    Clock,
    CheckCircle,
    XCircle,
    Edit,
    Trash2
} from 'lucide-react';

const ProductDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeImage, setActiveImage] = useState(0);
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState(null);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [productRes, categoryRes] = await Promise.all([
                    axios.get(`http://localhost:5000/api/products/${id}`),
                    axios.get('http://localhost:5000/api/categories')
                ]);
                setProduct(productRes.data);
                setEditData(productRes.data);
                setCategories(categoryRes.data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching data:", error);
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    const handleEditToggle = () => {
        setIsEditing(!isEditing);
        if (!isEditing) setEditData({ ...product });
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setEditData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? (checked ? 1 : 0) : value
        }));
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const token = localStorage.getItem('token');
            await axios.put(`http://localhost:5000/api/products/${id}`, editData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setProduct({ ...editData });
            setIsEditing(false);
            alert('Product updated successfully!');
        } catch (error) {
            console.error("Error updating product:", error);
            alert('Failed to update product. Please check your connection and login status.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen text-slate-500">
                <Package size={48} className="mb-4 text-slate-300" />
                <p className="text-lg font-medium">Product not found</p>
                <button
                    onClick={() => navigate('/admin/products')}
                    className="mt-4 px-4 py-2 text-indigo-600 hover:text-indigo-700 font-medium"
                >
                    Go back to Products
                </button>
            </div>
        );
    }

    const images = [
        product.image1,
        product.image2,
        product.image3,
        product.image4,
        product.image5
    ].filter(Boolean);

    const getStatusParams = (stock) => {
        if (stock === 0) return { label: 'Out of Stock', color: 'text-rose-500', bg: 'bg-rose-50 dark:bg-rose-500/10' };
        if (stock < 10) return { label: 'Low Stock', color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-500/10' };
        return { label: 'In Stock', color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-500/10' };
    };

    const status = getStatusParams(product.stock);

    const getCategoryName = (catId) => {
        const cat = categories.find(c => c.id === parseInt(catId));
        return cat ? cat.name : `Unknown (${catId})`;
    };

    return (
        <div className="max-w-7xl mx-auto space-y-6 pb-20">
            {/* Header */}
            <div className="flex items-center gap-4">
                <button
                    onClick={() => navigate('/admin/products')}
                    className="p-2 hover:bg-white dark:hover:bg-slate-800 rounded-xl transition-all text-slate-500 hover:text-indigo-600"
                >
                    <ArrowLeft size={20} />
                </button>
                <div className="flex-1">
                    {isEditing ? (
                        <input
                            type="text"
                            name="name"
                            value={editData.name}
                            onChange={handleInputChange}
                            className="text-2xl font-bold bg-transparent border-b border-indigo-500 focus:outline-none w-full"
                        />
                    ) : (
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                            {product.name}
                            {product.is_new === 1 && (
                                <span className="px-2 py-0.5 text-[10px] uppercase font-bold bg-indigo-500 text-white rounded-full tracking-wide">New</span>
                            )}
                            {product.is_preorder === 1 && (
                                <span className="px-2 py-0.5 text-[10px] uppercase font-bold bg-amber-500 text-white rounded-full tracking-wide">Pre-order</span>
                            )}
                        </h1>
                    )}
                    <p className="text-slate-500 text-sm mt-0.5">ID: #{product.id}</p>
                </div>
                <div className="ml-auto flex gap-3">
                    {isEditing ? (
                        <>
                            <button
                                onClick={handleEditToggle}
                                className="px-4 py-2 text-slate-500 font-bold text-xs uppercase hover:bg-slate-100 rounded-xl transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={saving}
                                className="px-6 py-2 bg-indigo-600 text-white font-bold text-xs uppercase rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20 disabled:opacity-50"
                            >
                                {saving ? 'Saving...' : 'Save Changes'}
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={handleEditToggle}
                            className="flex items-center gap-2 px-6 py-2 bg-[#222] text-white font-bold text-xs uppercase rounded-xl hover:bg-[#43d1f0] transition-colors shadow-lg shadow-black/10"
                        >
                            <Edit size={16} /> Edit Product
                        </button>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column - Images */}
                <div className="lg:col-span-1 space-y-4">
                    <div className="aspect-square glass-card rounded-2xl overflow-hidden relative group">
                        {images.length > 0 ? (
                            <img
                                src={images[activeImage]}
                                alt={product.name}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-400">
                                <Package size={48} />
                            </div>
                        )}
                    </div>
                    {images.length > 1 && (
                        <div className="grid grid-cols-5 gap-2">
                            {images.map((img, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setActiveImage(idx)}
                                    className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${activeImage === idx
                                        ? 'border-indigo-600 ring-2 ring-indigo-600/20'
                                        : 'border-transparent hover:border-slate-300 dark:hover:border-slate-700'
                                        }`}
                                >
                                    <img src={img} alt="" className="w-full h-full object-cover" />
                                </button>
                            ))}
                        </div>
                    )}

                    {isEditing && (
                        <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                            {[1, 2, 3, 4, 5].map(num => (
                                <div key={num}>
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Image {num} URL</label>
                                    <input
                                        type="text"
                                        name={`image${num}`}
                                        value={editData[`image${num}`] || ''}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-xs"
                                        placeholder="https://..."
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Middle Column - Main Details */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Key Stats Cards */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        <div className="p-4 glass-card rounded-xl">
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Price</p>
                            {isEditing ? (
                                <div className="flex items-center">
                                    <span className="text-slate-400 mr-1">$</span>
                                    <input
                                        type="number"
                                        name="price"
                                        value={editData.price}
                                        onChange={handleInputChange}
                                        className="w-full bg-transparent font-bold text-xl border-b border-indigo-200 focus:outline-none"
                                    />
                                </div>
                            ) : (
                                <p className="text-xl font-bold text-slate-900 dark:text-white flex items-center">
                                    <span className="text-base font-normal text-slate-400 mr-0.5">$</span>
                                    {product.price}
                                </p>
                            )}
                        </div>
                        <div className="p-4 glass-card rounded-xl">
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Stock</p>
                            {isEditing ? (
                                <input
                                    type="number"
                                    name="stock"
                                    value={editData.stock}
                                    onChange={handleInputChange}
                                    className="w-full bg-transparent font-bold text-xl border-b border-indigo-200 focus:outline-none"
                                />
                            ) : (
                                <div className="flex items-center gap-2">
                                    <p className="text-xl font-bold text-slate-900 dark:text-white">
                                        {product.stock}
                                    </p>
                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${status.bg} ${status.color}`}>
                                        {status.label}
                                    </span>
                                </div>
                            )}
                        </div>
                        <div className="p-4 glass-card rounded-xl">
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Discount %</p>
                            {isEditing ? (
                                <input
                                    type="number"
                                    name="discount_percent"
                                    value={editData.discount_percent}
                                    onChange={handleInputChange}
                                    className="w-full bg-transparent font-bold text-xl border-b border-indigo-200 focus:outline-none"
                                />
                            ) : (
                                <p className="text-xl font-bold text-slate-900 dark:text-white">
                                    {product.discount_percent}%
                                </p>
                            )}
                        </div>
                        <div className="p-4 glass-card rounded-xl">
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Settings</p>
                            {isEditing ? (
                                <div className="space-y-1 mt-1">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            name="is_new"
                                            checked={editData.is_new === 1}
                                            onChange={handleInputChange}
                                            className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 h-3 w-3"
                                        />
                                        <span className="text-[10px] font-bold text-slate-600 uppercase">New</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            name="is_preorder"
                                            checked={editData.is_preorder === 1}
                                            onChange={handleInputChange}
                                            className="rounded border-slate-300 text-amber-600 focus:ring-amber-500 h-3 w-3"
                                        />
                                        <span className="text-[10px] font-bold text-slate-600 uppercase">Pre-order</span>
                                    </label>
                                </div>
                            ) : (
                                <p className="text-sm font-bold text-slate-900 dark:text-white mt-1">
                                    {new Date(product.created_at).toLocaleDateString()}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Description Section */}
                    <div className="glass-card rounded-2xl overflow-hidden">
                        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                            <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                <Layers size={18} className="text-indigo-500" />
                                Product Description
                            </h3>
                        </div>
                        <div className="p-6">
                            {isEditing ? (
                                <textarea
                                    name="description"
                                    value={editData.description}
                                    onChange={handleInputChange}
                                    rows="6"
                                    className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
                                />
                            ) : (
                                <div className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm">
                                    {product.description || "No description available."}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="glass-card rounded-2xl overflow-hidden p-6">
                            <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-4">
                                <Tag size={18} className="text-indigo-500" />
                                Categories (IDs, separated by comma)
                            </h3>
                            {isEditing ? (
                                <input
                                    type="text"
                                    name="category_id"
                                    value={editData.category_id}
                                    onChange={handleInputChange}
                                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-xs font-bold focus:outline-none"
                                    placeholder="1, 2, 3"
                                />
                            ) : (
                                <div className="flex flex-wrap gap-2">
                                    {product.category_id ? (
                                        String(product.category_id).split(',').map((catId, i) => (
                                            <span key={i} className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-lg text-xs font-bold">
                                                {getCategoryName(catId.trim())}
                                            </span>
                                        ))
                                    ) : (
                                        <span className="text-slate-400 text-xs text-italic">Uncategorized</span>
                                    )}
                                </div>
                            )}
                        </div>

                        <div className="glass-card rounded-2xl overflow-hidden p-6">
                            <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-4">
                                <Package size={18} className="text-indigo-500" />
                                Available Sizes (Separated by comma)
                            </h3>
                            {isEditing ? (
                                <input
                                    type="text"
                                    name="size"
                                    value={editData.size}
                                    onChange={handleInputChange}
                                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-xs font-bold focus:outline-none"
                                    placeholder="S, M, L, XL"
                                />
                            ) : (
                                <div className="flex flex-wrap gap-2">
                                    {product.size ? (
                                        String(product.size).split(',').map((size, i) => (
                                            <span key={i} className="w-10 h-10 flex items-center justify-center bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-700 dark:text-slate-300 text-xs font-bold shadow-sm">
                                                {size}
                                            </span>
                                        ))
                                    ) : (
                                        <span className="text-slate-400 text-xs text-italic">No sizes defined</span>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Delete Option at Bottom for safety */}
            {!isEditing && (
                <div className="flex justify-end pt-10">
                    <button
                        onClick={() => {
                            if (window.confirm('Are you sure you want to delete this product?')) {
                                // Implement delete logic if needed
                                alert('In a real scenario, this would delete the product.');
                            }
                        }}
                        className="flex items-center gap-2 px-6 py-3 border border-rose-200 text-rose-500 hover:bg-rose-50 rounded-2xl transition-all text-xs font-bold uppercase tracking-wider"
                    >
                        <Trash2 size={18} /> Delete Product
                    </button>
                </div>
            )}
        </div>
    );
};

export default ProductDetails;
