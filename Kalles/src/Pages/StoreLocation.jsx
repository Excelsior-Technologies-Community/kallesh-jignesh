import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Search, MapPin, Phone, Minus, Plus } from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icon in Leaflet + React
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconUrl: markerIcon,
    iconRetinaUrl: markerIcon2x,
    shadowUrl: markerShadow,
});

const storeLocations = [
    {
        id: 1,
        name: "1471 P St NW",
        city: "Washington DC",
        phone: "(202) 234 7336",
        coords: [38.9097, -77.0346]
    },
    {
        id: 2,
        name: "2221 I Tokyo JP",
        city: "Tokyo, JP",
        phone: "(306) 123 654",
        coords: [35.6895, 139.6917]
    },
    {
        id: 3,
        name: "HaNoi",
        city: "VIETNAM",
        phone: "(84) 123 456 789",
        coords: [21.0285, 105.8542]
    },
    {
        id: 4,
        name: "1977 Taiwan",
        city: "Taiwan",
        phone: "(12) 345 336",
        coords: [23.6978, 120.9605]
    },
    {
        id: 5,
        name: "16479 Shanghai",
        city: "Shanghai",
        phone: "(993) 1902 1366",
        coords: [31.2304, 121.4737]
    },
    {
        id: 6,
        name: "336 DaNang",
        city: "DaNang City",
        phone: "(84) 339 993",
        coords: [16.0544, 108.2022]
    },
    {
        id: 7,
        name: "9978 Seoul",
        city: "Seoul Capital",
        phone: "(778) 1122 3335",
        coords: [37.5665, 126.9780]
    }
];

// Component to handle map view changes
function MapController({ center, zoom }) {
    const map = useMap();
    useEffect(() => {
        map.setView(center, zoom);
    }, [center, zoom, map]);
    return null;
}

const StoreLocation = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedStore, setSelectedStore] = useState(storeLocations[0]);
    const [mapCenter, setMapCenter] = useState(storeLocations[0].coords);
    const [zoom, setZoom] = useState(13);

    const filteredStores = storeLocations.filter(store =>
        store.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        store.city.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleStoreClick = (store) => {
        setSelectedStore(store);
        setMapCenter(store.coords);
        setZoom(15);
    };

    return (
        <div className="flex flex-col md:flex-row h-screen w-full font-['Inter',_sans-serif] bg-white text-[#222] md:px-20">
            {/* Sidebar */}
            <div className="w-full md:w-[400px] flex flex-col border-r border-gray-200 h-full">
                {/* Search Bar - Fixed at top of sidebar */}
                <div className="p-4 border-b border-gray-200">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Find a store..."
                            className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-sm focus:outline-none focus:ring-1 focus:ring-[#43d1f0] transition-all"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    </div>
                    <div className="mt-2 text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                        {filteredStores.length} STORES FOUND
                    </div>
                </div>

                {/* Location List - Scrollable */}
                <div className="flex-1 overflow-y-auto scrollbar-hide">
                    {filteredStores.map((store) => (
                        <div
                            key={store.id}
                            onClick={() => handleStoreClick(store)}
                            className={`p-6 cursor-pointer border-b border-gray-100 transition-all duration-300 hover:bg-gray-50 group ${selectedStore.id === store.id ? 'bg-[#f6f6f6] border-l-4 border-l-[#43d1f0]' : ''
                                }`}
                        >
                            <h3 className="text-[15px] font-bold mb-1 group-hover:text-[#43d1f0] transition-colors uppercase tracking-tight">
                                {store.name}
                            </h3>
                            <p className="text-[13px] text-gray-500 mb-1">{store.city}</p>
                            <p className="text-[13px] text-gray-400 flex items-center gap-2">
                                {store.phone}
                            </p>
                        </div>
                    ))}
                    {filteredStores.length === 0 && (
                        <div className="p-10 text-center text-gray-400 italic">
                            No stores found matching your search.
                        </div>
                    )}
                </div>
            </div>

            {/* Map Container */}
            <div className="flex-1 relative h-[50vh] md:h-full">
                <MapContainer
                    center={mapCenter}
                    zoom={zoom}
                    scrollWheelZoom={true}
                    className="h-full w-full z-0"
                    zoomControl={false}
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <MapController center={mapCenter} zoom={zoom} />

                    {storeLocations.map((store) => (
                        <Marker
                            key={store.id}
                            position={store.coords}
                            eventHandlers={{
                                click: () => handleStoreClick(store)
                            }}
                        >
                            <Popup className="custom-popup">
                                <div className="p-1">
                                    <h4 className="font-bold text-[14px] text-[#222] mb-1">{store.name}</h4>
                                    <p className="text-[12px] text-gray-500 mb-1">{store.city}</p>
                                    <p className="text-[12px] text-gray-400">{store.phone}</p>
                                </div>
                            </Popup>
                        </Marker>
                    ))}
                </MapContainer>

                {/* Map Navigation UI */}
                <div className="absolute right-6 top-6 z-10 flex flex-col gap-2">
                    <button
                        onClick={() => setZoom(prev => Math.min(prev + 1, 18))}
                        className="w-10 h-10 bg-white shadow-xl rounded-full flex items-center justify-center text-[#222] hover:bg-[#43d1f0] hover:text-white transition-all transform hover:scale-105"
                    >
                        <Plus size={20} />
                    </button>
                    <button
                        onClick={() => setZoom(prev => Math.max(prev - 1, 3))}
                        className="w-10 h-10 bg-white shadow-xl rounded-full flex items-center justify-center text-[#222] hover:bg-[#43d1f0] hover:text-white transition-all transform hover:scale-105"
                    >
                        <Minus size={20} />
                    </button>
                    <div className="w-10 h-10 bg-[#43d1f0] shadow-xl rounded-full flex items-center justify-center text-white cursor-pointer mt-2 transform hover:rotate-12 transition-transform">
                        <MapPin size={20} />
                    </div>
                </div>

                {/* Floating Store Count (Desktop) */}
                <div className="hidden md:flex absolute left-6 top-6 z-10 bg-white/90 backdrop-blur-md px-6 py-3 rounded-sm shadow-xl items-center gap-4 border border-white/20">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-[13px] font-bold tracking-[2px] text-[#222] uppercase">
                        {storeLocations.length} Global Stores
                    </span>
                </div>
            </div>

            {/* Injected Style for Leaflet Popup */}
            <style jsx="true">{`
                .custom-popup .leaflet-popup-content-wrapper {
                    border-radius: 4px;
                    padding: 4px;
                    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
                }
                .custom-popup .leaflet-popup-tip {
                    background: white;
                }
                .leaflet-container {
                    background: #f0f0f0;
                }
            `}</style>
        </div>
    );
};

export default StoreLocation;
