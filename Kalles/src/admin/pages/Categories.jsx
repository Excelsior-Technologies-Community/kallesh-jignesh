import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Tags, Plus, Pencil, Trash2, Search, X, Package } from 'lucide-react';


const Categories = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentCategory, setCurrentCategory] = useState(null);
    const [formData, setFormData] = useState({ name: '', parent_id: '', status: 1 });

    // Drawer State
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [categoryProducts, setCategoryProducts] = useState([]);
    const [productsLoading, setProductsLoading] = useState(false);

    const fetchCategories = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/categories');
            setCategories(response.data);
        } catch (err) {
            console.error("Error fetching categories:", err);
        } finally {
            setLoading(false);
        }
    };

    const fetchCategoryProducts = async (categoryId) => {
        try {
            setProductsLoading(true);
            const response = await axios.get(`http://localhost:5000/api/products?category=${categoryId}`);
            setCategoryProducts(response.data);
        } catch (err) {
            console.error("Error fetching category products:", err);
        } finally {
            setProductsLoading(false);
        }
    };

    const handleCategoryClick = (category) => {
        setSelectedCategory(category);
        fetchCategoryProducts(category.id);
    };

    const closeDrawer = () => {
        setSelectedCategory(null);
        setCategoryProducts([]);
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleOpenModal = (category = null) => {
        if (category) {
            setCurrentCategory(category);
            setFormData({ name: category.name, parent_id: category.parent_id || '', status: category.status });
        } else {
            setCurrentCategory(null);
            setFormData({ name: '', parent_id: '', status: 1 });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setCurrentCategory(null);
        setFormData({ name: '', parent_id: '', status: 1 });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (currentCategory) {
                await axios.put(`http://localhost:5000/api/categories/${currentCategory.id}`, formData);
            } else {
                await axios.post('http://localhost:5000/api/categories', formData);
            }
            fetchCategories();
            handleCloseModal();
        } catch (err) {
            console.error("Error saving category:", err);
            alert("Failed to save category");
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this category?")) {
            try {
                await axios.delete(`http://localhost:5000/api/categories/${id}`);
                fetchCategories();
            } catch (err) {
                console.error("Error deleting category:", err);
                alert("Failed to delete category");
            }
        }
    };


    return (
        <div className="max-w-[1600px] mx-auto space-y-6 relative z-10">
            <div className="glass-card rounded-2xl overflow-hidden">
                <div className="px-6 py-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                    <div>
                        <h3 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                            Category Management
                            <Tags size={20} className="text-indigo-600" />
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5 uppercase tracking-wider">Manage product categories</p>
                    </div>
                    <div className="flex gap-3">
                        {!loading && (
                            <div className="px-4 py-1.5 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-full text-[11px] font-bold uppercase tracking-widest border border-indigo-100 dark:border-indigo-500/20 flex items-center">
                                {categories.length} Total
                            </div>
                        )}
                        <button
                            onClick={() => handleOpenModal()}
                            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-bold uppercase tracking-wider flex items-center gap-2 transition-colors"
                        >
                            <Plus size={16} />
                            Add Category
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto min-h-[400px] flex flex-col">
                    {loading ? (
                        <div className="flex-1 flex flex-col items-center justify-center p-20 space-y-4">
                            <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                            <p className="text-slate-500 font-medium animate-pulse">Loading categories...</p>
                        </div>
                    ) : (
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-slate-50/50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 uppercase text-[11px] font-extrabold tracking-wider border-b border-slate-200 dark:border-slate-800">
                                    <th className="px-6 py-4">ID</th>
                                    <th className="px-6 py-4">Name</th>
                                    <th className="px-6 py-4 text-center">Products</th>
                                    <th className="px-6 py-4">Parent ID</th>
                                    <th className="px-6 py-4 text-center">Status</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                {categories.map((category) => (
                                    <tr
                                        key={category.id}
                                        onClick={(e) => {
                                            // Prevent drawer opening when clicking actions
                                            if (e.target.closest('button')) return;
                                            handleCategoryClick(category);
                                        }}
                                        className="hover:bg-slate-50/50 dark:hover:bg-indigo-500/5 transition-colors group cursor-pointer"
                                    >
                                        <td className="px-6 py-4 text-slate-500 text-sm font-medium">#{category.id}</td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-bold text-slate-900 dark:text-white tracking-tight">{category.name}</div>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-full text-xs font-bold border border-indigo-100 dark:border-indigo-500/20">
                                                <Package size={12} />
                                                {category.product_count || 0}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-slate-500 text-sm">{category.parent_id || '-'}</td>
                                        <td className="px-6 py-4 text-center">
                                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-extrabold uppercase border ${category.status === 1 ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'}`}>
                                                {category.status === 1 ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => handleOpenModal(category)}
                                                    className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                                                >
                                                    <Pencil size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(category.id)}
                                                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
                    <div className="glass rounded-2xl w-full max-w-md overflow-hidden">
                        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/50">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                                {currentCategory ? 'Edit Category' : 'Add New Category'}
                            </h3>
                            <button onClick={handleCloseModal} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Category Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                                    placeholder="e.g., Men's Fashion"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Parent Category ID (Optional)</label>
                                <input
                                    type="number"
                                    name="parent_id"
                                    value={formData.parent_id}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                                    placeholder="Enter parent ID if any"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Status</label>
                                <select
                                    name="status"
                                    value={formData.status}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                                >
                                    <option value={1}>Active</option>
                                    <option value={0}>Inactive</option>
                                </select>
                            </div>
                            <div className="pt-4 flex gap-3">
                                <button
                                    type="button"
                                    onClick={handleCloseModal}
                                    className="flex-1 px-4 py-2 text-slate-700 dark:text-slate-300 font-bold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-2 text-white font-bold bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-all"
                                >
                                    {currentCategory ? 'Update' : 'Create'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Category Details Modal (Centered) */}
            {selectedCategory && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
                    {/* Modal Content */}
                    <div className="glass rounded-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[80vh] animate-in zoom-in-95 duration-200">
                        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/50 flex-none">
                            <div>
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                                    {selectedCategory.name}
                                </h3>
                                <p className="text-xs text-slate-500 font-medium">ID: {selectedCategory.id}</p>
                            </div>
                            <button onClick={closeDrawer} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-all">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 space-y-6">
                            {/* Meta Info */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl space-y-1">
                                    <p className="text-xs text-slate-500 uppercase font-bold">Status</p>
                                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold uppercase ${selectedCategory.status === 1 ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                                        {selectedCategory.status === 1 ? 'Active' : 'Inactive'}
                                    </span>
                                </div>
                                <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl space-y-1">
                                    <p className="text-xs text-slate-500 uppercase font-bold">Parent Category</p>
                                    <p className="text-sm font-bold text-slate-900 dark:text-white">{selectedCategory.parent_id || 'None'}</p>
                                </div>
                            </div>

                            {/* Products List */}
                            <div>
                                <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                                    Products in this Category
                                    <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded-full text-xs">
                                        {categoryProducts.length}
                                    </span>
                                </h4>

                                {productsLoading ? (
                                    <div className="text-center py-8">
                                        <div className="inline-block w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                                        <p className="text-xs text-slate-500 mt-2">Loading products...</p>
                                    </div>
                                ) : categoryProducts.length > 0 ? (
                                    <div className="space-y-3">
                                        {categoryProducts.map(prod => (
                                            <div key={prod.id} className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                                <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 overflow-hidden flex-shrink-0">
                                                    {prod.image1 ? (
                                                        <img src={prod.image1} alt={prod.name} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-slate-400">
                                                            <Package size={16} />
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{prod.name}</p>
                                                    <p className="text-xs text-slate-500 font-medium">${prod.price}</p>
                                                </div>
                                                <div className={`w-2 h-2 rounded-full ${prod.stock > 0 ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-dashed border-slate-200 dark:border-slate-700">
                                        <p className="text-sm text-slate-500">No products found in this category.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Categories;
