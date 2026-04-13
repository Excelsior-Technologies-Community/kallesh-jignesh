import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'



const Collections = () => {
    const [collections, setCollections] = React.useState([]);
    const [currentPage, setCurrentPage] = React.useState(1);
    const itemsPerPage = 6;

    React.useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/categories');
                const data = await response.json();

                // Transform data to match UI requirements
                const formattedCollections = data.map(cat => ({
                    id: cat.id,
                    title: cat.name,
                    image: cat.category_image || 'https://via.placeholder.com/532x400?text=No+Image',
                    count: cat.product_count,
                    link: `/collections/${cat.name.toLowerCase().replace(/\s+/g, '-')}`
                }));

                setCollections(formattedCollections);
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };

        fetchCategories();
    }, []);

    // Pagination Logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentCollections = collections.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(collections.length / itemsPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const renderPagination = () => {
        if (totalPages <= 1) return null;

        const pageNumbers = [];
        for (let i = 1; i <= totalPages; i++) {
            pageNumbers.push(i);
        }

        return (
            <div className="flex justify-center items-center gap-4 mt-12 mb-8">
                {pageNumbers.map(number => (
                    <button
                        key={number}
                        onClick={() => paginate(number)}
                        className={`text-sm transition-colors duration-300 ${currentPage === number
                            ? 'text-black font-bold border-b border-black'
                            : 'text-gray-500 hover:text-black'
                            }`}
                    >
                        {number}
                    </button>
                ))}

                {currentPage < totalPages && (
                    <button
                        onClick={() => paginate(currentPage + 1)}
                        className="text-sm text-gray-500 hover:text-black transition-colors duration-300 ml-4"
                    >
                        Next
                    </button>
                )}
            </div>
        );
    };

    return (
        <div className="w-full">
            {/* Banner Section */}
            <div
                className="relative w-full h-[100px] md:h-[150px] bg-cover bg-center flex items-center justify-center"
                style={{
                    backgroundImage: `url('https://kalles-5.myshopify.com/cdn/shop/files/bg-heading.jpg?v=1717580690&width=1920')`
                }}
            >
                <div className="absolute inset-0 bg-black/60"></div>
                <div className="relative z-10 text-center text-white">
                    <h1 className="text-xl md:text-2xl font-bold uppercase tracking-widest mb-4"> Collections</h1>
                    <div className="flex items-center justify-center gap-2 text-sm md:text-base">
                        <Link to="/" className="hover:text-teal-400 transition-colors">Home</Link>
                        <span>/</span>
                        <span>Collections</span>
                    </div>
                </div>
            </div>

            {/* Collections Grid */}
            <div className="container mx-auto px-4 py-16 max-w-[1200px]">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {currentCollections.map((collection) => (
                        <div key={collection.id} className="group relative overflow-hidden">
                            <Link to={collection.link} className="block w-full h-[400px] relative overflow-hidden">
                                <img
                                    src={collection.image}
                                    alt={collection.title}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    onError={(e) => { e.target.src = 'https://via.placeholder.com/600x800?text=Collection' }}
                                />
                                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300"></div>
                                <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-4">
                                    <h2 className="text-2xl font-bold uppercase tracking-wider mb-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                        {collection.title}
                                    </h2>
                                    <p className="opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300 delay-75 mb-4">
                                        {collection.count} Products
                                    </p>
                                    <span className="inline-flex items-center gap-2 uppercase text-sm font-semibold tracking-wide border-b border-white pb-1 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300 delay-100">
                                        Shop Now <ArrowRight size={16} />
                                    </span>
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>
                {/* Pagination Controls */}
                {renderPagination()}
            </div>
        </div>
    )
}

export default Collections
