import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Briefcase, Calendar, User, Image, Plus, X, Save, Edit, Trash2 } from 'lucide-react';

const Portfolio = () => {
    const [portfolios, setPortfolios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        img: '',
        created_by: '',
        date: new Date().toISOString().split('T')[0],
        description: '',
        collection: ''
    });
    const [editingId, setEditingId] = useState(null);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const fetchPortfolios = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/portfolio');
            setPortfolios(response.data);
            setLoading(false);
        } catch (err) {
            console.error("Error fetching portfolios:", err);
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            console.log("Submitting form data:", formData);
            if (editingId) {
                await axios.put(`http://localhost:5000/api/portfolio/${editingId}`, formData);
                console.log("Update successful");
            } else {
                await axios.post('http://localhost:5000/api/portfolio', formData);
                console.log("Create successful");
            }

            fetchPortfolios();
            setIsDrawerOpen(false);
            resetForm();
            alert("Saved successfully!");
        } catch (error) {
            console.error("Error saving portfolio item:", error);
            const errorMessage = error.response?.data?.message || error.response?.data || error.message;
            alert(`Failed to save item: ${errorMessage}`);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this item?")) {
            try {
                await axios.delete(`http://localhost:5000/api/portfolio/${id}`);
                fetchPortfolios();
            } catch (error) {
                console.error("Error deleting portfolio item:", error);
                alert("Failed to delete item. Please try again.");
            }
        }
    };

    const handleEdit = (item) => {
        setEditingId(item.id);
        const formattedDate = item.date ? new Date(item.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0];
        setFormData({
            name: item.name,
            img: item.img,
            created_by: item.created_by,
            date: formattedDate,
            description: item.description,
            collection: item.collection
        });
        setIsDrawerOpen(true);
    };

    const resetForm = () => {
        setFormData({
            name: '',
            img: '',
            created_by: '',
            date: new Date().toISOString().split('T')[0],
            description: '',
            collection: ''
        });
        setEditingId(null);
    };

    const openNewForm = () => {
        resetForm();
        setIsDrawerOpen(true);
    };

    useEffect(() => {
        fetchPortfolios();
    }, []);


    return (
        <div className="max-w-[1600px] mx-auto space-y-6 relative z-10">
            <div className="glass-card rounded-2xl overflow-hidden">
                <div className="px-6 py-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                    <div>
                        <h3 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                            Portfolio Management
                            <Briefcase size={20} className="text-indigo-600" />
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5 uppercase tracking-wider">Manage your portfolio items</p>
                    </div>
                    <div className="flex gap-3">
                        {!loading && (
                            <div className="px-4 py-1.5 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-full text-[11px] font-bold uppercase tracking-widest border border-indigo-100 dark:border-indigo-500/20 flex items-center">
                                {portfolios.length} Items
                            </div>
                        )}
                        <button
                            onClick={openNewForm}
                            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-1.5 rounded-lg text-sm font-medium transition-colors"
                        >
                            <Plus size={16} />
                            Add New
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto min-h-[400px] flex flex-col">
                    {loading ? (
                        <div className="flex-1 flex flex-col items-center justify-center p-20 space-y-4">
                            <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                            <p className="text-slate-500 font-medium animate-pulse">Loading portfolio items...</p>
                        </div>
                    ) : (
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-slate-50/50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 uppercase text-[11px] font-extrabold tracking-wider border-b border-slate-200 dark:border-slate-800">
                                    <th className="px-6 py-4">ID</th>
                                    <th className="px-6 py-4">Image</th>
                                    <th className="px-6 py-4">Name</th>
                                    <th className="px-6 py-4">Created By</th>
                                    <th className="px-6 py-4">Date</th>
                                    <th className="px-6 py-4">Description</th>
                                    <th className="px-6 py-4">Collection</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                {portfolios.map((item) => (
                                    <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-indigo-500/5 transition-colors group">
                                        <td className="px-6 py-4 text-slate-500 font-mono text-xs">
                                            #{item.id}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="w-16 h-10 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-100">
                                                <img
                                                    src={item.img}
                                                    alt={item.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-bold text-slate-900 dark:text-white tracking-tight">{item.name}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300 text-sm">
                                                <User size={14} className="text-slate-400" />
                                                {item.created_by}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-[13px] font-bold">
                                                <Calendar size={14} />
                                                {item.date}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 max-w-[200px]">
                                                {item.description}
                                            </p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                                                {item.collection}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => handleEdit(item)}
                                                    className="p-1.5 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                                                    title="Edit"
                                                >
                                                    <Edit size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(item.id)}
                                                    className="p-1.5 text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                                                    title="Delete"
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

                {portfolios.length === 0 && (
                    <div className="p-12 text-center">
                        <Image size={48} className="mx-auto text-slate-200 mb-4" />
                        <h4 className="text-slate-900 dark:text-white font-bold">No portfolio items found</h4>
                        <p className="text-slate-500 text-sm">Get started by creating a new portfolio item.</p>
                    </div>
                )}
            </div>

            {/* Drawer Overlay */}
            {isDrawerOpen && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex min-h-screen items-center justify-center p-4 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity" onClick={() => setIsDrawerOpen(false)} />

                        {/* This element is to trick the browser into centering the modal contents. */}
                        <span className="hidden sm:inline-block sm:h-screen sm:align-middle" aria-hidden="true">&#8203;</span>

                        <div className="relative inline-block transform overflow-hidden rounded-2xl glass text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-xl sm:align-middle">

                            {/* Modal Header */}
                            <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/50">
                                <div>
                                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                                        {editingId ? 'Edit Item' : 'Add New Item'}
                                    </h2>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">
                                        {editingId ? 'Update portfolio details' : 'Create a new portfolio entry'}
                                    </p>
                                </div>
                                <button
                                    onClick={() => setIsDrawerOpen(false)}
                                    className="p-2 -mr-2 text-slate-400 hover:text-slate-500 dark:hover:text-slate-300 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            {/* Modal Body - Form */}
                            <div className="max-h-[70vh] overflow-y-auto px-6 py-6">
                                <form id="portfolio-form" onSubmit={handleSubmit} className="space-y-5">

                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Project Name <span className="text-red-500">*</span></label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-sm outline-none"
                                            placeholder="Enter project name"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Image URL <span className="text-red-500">*</span></label>
                                        <input
                                            type="url"
                                            name="img"
                                            value={formData.img}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-sm outline-none"
                                            placeholder="https://example.com/image.jpg"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Created By</label>
                                            <div className="relative">
                                                <User size={16} className="absolute left-3 top-3 text-slate-400" />
                                                <input
                                                    type="text"
                                                    name="created_by"
                                                    value={formData.created_by}
                                                    onChange={handleInputChange}
                                                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-sm outline-none"
                                                    placeholder="Author"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Date</label>
                                            <div className="relative">
                                                <Calendar size={16} className="absolute left-3 top-3 text-slate-400" />
                                                <input
                                                    type="date"
                                                    name="date"
                                                    value={formData.date}
                                                    onChange={handleInputChange}
                                                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-sm outline-none"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Collection</label>
                                        <input
                                            type="text"
                                            name="collection"
                                            value={formData.collection}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-sm outline-none"
                                            placeholder="e.g. Summer 2024"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Description</label>
                                        <textarea
                                            name="description"
                                            value={formData.description}
                                            onChange={handleInputChange}
                                            rows="4"
                                            className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-sm outline-none resize-none"
                                            placeholder="Enter project details..."
                                        />
                                    </div>
                                </form>
                            </div>

                            {/* Modal Footer */}
                            <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 flex gap-3 justify-end">
                                <button
                                    onClick={() => setIsDrawerOpen(false)}
                                    className="px-5 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-semibold text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    form="portfolio-form"
                                    className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-sm transition-all focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                >
                                    <Save size={16} />
                                    {editingId ? 'Update Item' : 'Save Item'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div >
    );
};

export default Portfolio;
