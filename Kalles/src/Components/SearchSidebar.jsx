import axios from 'axios';
import { ChevronDown, Loader2, Search, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useCurrency } from '../Context/CurrencyContext';

const SearchSidebar = ({ isOpen, onClose }) => {
    const { formatPrice } = useCurrency();
    const [searchQuery, setSearchQuery] = useState('');
    const [allProducts, setAllProducts] = useState([]);
    const [searchResults, setSearchResults] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [loading, setLoading] = useState(false);
    const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);

    // Fetch products and categories when sidebar is opened
    useEffect(() => {
        if (isOpen) {
            const fetchData = async () => {
                try {
                    setLoading(true);
                    const [productsRes, categoriesRes] = await Promise.all([
                        axios.get('http://localhost:5000/api/products'),
                        axios.get('http://localhost:5000/api/categories')
                    ]);
                    setAllProducts(productsRes.data);
                    setCategories(categoriesRes.data);
                } catch (error) {
                    console.error('Error fetching data for search:', error);
                } finally {
                    setLoading(false);
                }
            };
            fetchData();
        }
    }, [isOpen]);

    // Filter products when searchQuery or selectedCategory changes
    useEffect(() => {
        let filtered = allProducts;

        if (selectedCategory !== 'All') {
            // Find the category ID from the selected category name
            const selectedCat = categories.find(cat => cat.name === selectedCategory);
            const selectedCatId = selectedCat ? String(selectedCat.id) : null;

            if (selectedCatId) {
                filtered = filtered.filter(product => {
                    const categoryIds = product.category_id
                        ? String(product.category_id).split(',').map(c => c.trim())
                        : [];
                    return categoryIds.includes(selectedCatId);
                });
            }
        }

        if (searchQuery.trim() !== '') {
            filtered = filtered.filter(product =>
                product.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        setSearchResults(filtered);
    }, [searchQuery, selectedCategory, allProducts, categories]);



    const getProductImage = (product) => {
        if (product.image) return product.image;
        if (product.image1) return product.image1;
        if (product.images) {
            const images = typeof product.images === 'string' ? JSON.parse(product.images) : product.images;
            return images[0];
        }
        return '';
    };

    return (
        <>
            {/* Overlay */}
            <div
                className={`fixed inset-0 bg-black/50 z-[5000] transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                    }`}
                onClick={onClose}
            />

            {/* Sidebar */}
            <div
                className={`fixed inset-y-0 right-0 w-[400px] max-w-full bg-white z-[5001] transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'
                    } flex flex-col shadow-2xl`}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
                    <h2 className="text-[14px] font-bold tracking-widest text-[#222] uppercase">
                        SEARCH OUR SITE
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-[#222] hover:text-[#43D1F0] transition-colors p-1"
                    >
                        <X size={24} strokeWidth={1.5} />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 px-8 py-10 overflow-y-auto">
                    {/* Category Dropdown */}
                    <div className="mb-6 relative">
                        <div
                            className="relative border border-gray-200 rounded-full px-5 h-12 flex items-center justify-between cursor-pointer hover:border-[#43D1F0] transition-colors group"
                            onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
                        >
                            <span className="text-[14px] text-gray-500">{selectedCategory}</span>
                            <ChevronDown size={18} className={`text-gray-400 group-hover:text-[#43D1F0] transition-transform ${isCategoryDropdownOpen ? 'rotate-180' : ''}`} />
                        </div>

                        {isCategoryDropdownOpen && (
                            <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-100 rounded-lg shadow-xl z-10 max-h-[250px] overflow-y-auto overflow-x-hidden scrollbar-hide">
                                <div
                                    className={`px-5 py-3 text-[14px] cursor-pointer transition-colors ${selectedCategory === 'All' ? 'bg-[#f6f6f6] text-[#43D1F0] font-bold' : 'text-[#222] hover:bg-[#f6f6f6]'}`}
                                    onClick={() => {
                                        setSelectedCategory('All');
                                        setIsCategoryDropdownOpen(false);
                                    }}
                                >
                                    All Categories
                                </div>
                                {categories.map((cat) => (
                                    <div
                                        key={cat.id}
                                        className={`px-5 py-3 text-[14px] cursor-pointer transition-colors ${selectedCategory === cat.name ? 'bg-[#f6f6f6] text-[#43D1F0] font-bold' : 'text-[#222] hover:bg-[#f6f6f6]'}`}
                                        onClick={() => {
                                            setSelectedCategory(cat.name);
                                            setIsCategoryDropdownOpen(false);
                                        }}
                                    >
                                        {cat.name}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Search Input */}
                    <div className="relative mb-10">
                        <input
                            type="text"
                            placeholder="Search for products..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full h-12 px-5 pr-12 border border-gray-200 rounded-full focus:outline-none focus:border-[#43D1F0] transition-colors text-[14px]"
                        />
                        {loading ? (
                            <Loader2 size={20} className="absolute right-5 top-1/2 -translate-y-1/2 text-[#43D1F0] animate-spin" />
                        ) : (
                            <Search size={20} className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400" />
                        )}
                    </div>

                    {/* Search Results / Inspiration Section */}
                    <div>
                        <h3 className="text-[14px] font-bold text-[#222] mb-6">
                            {(searchQuery || selectedCategory !== 'All') ? `Search Results (${searchResults.length})` : `All Products (${searchResults.length})`}
                        </h3>
                        <div className="space-y-6">
                            {searchResults.map((product) => (
                                <Link
                                    to={`/product/${product.id}`}
                                    key={product.id}
                                    className="flex gap-4 group cursor-pointer"
                                    onClick={onClose}
                                >
                                    <div className="w-20 h-24 overflow-hidden rounded-sm bg-[#f6f6f6] flex-shrink-0">
                                        <img
                                            src={getProductImage(product)}
                                            alt={product.name}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                        />
                                    </div>
                                    <div className="flex flex-col justify-center">
                                        <p className="text-[12px] text-gray-400 mb-0.5">{product.brand || 'Kalles'}</p>
                                        <h4 className="text-[13px] font-bold text-[#222] group-hover:text-[#43D1F0] transition-colors leading-tight mb-1">
                                            {product.name}
                                        </h4>
                                        <p className="text-[13px] font-medium text-[#222]">
                                            {formatPrice(product.price)}
                                        </p>
                                    </div>
                                </Link>
                            ))}
                            {(searchQuery || selectedCategory !== 'All') && searchResults.length === 0 && !loading && (
                                <p className="text-[14px] text-gray-500 text-center py-10">
                                    No products found matching your criteria.
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default SearchSidebar;
