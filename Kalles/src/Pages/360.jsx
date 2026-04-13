import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react';

const Product360Viewer = () => {
    const images = [
        "//kalles-5.myshopify.com/cdn/shop/files/4075232-spin-01_efbaf82f-9bb3-41e7-8795-290785eb1525.jpg?v=1717404699&width=870",
        "//kalles-5.myshopify.com/cdn/shop/files/4075232-spin-04_6f6263c0-96f6-42bd-8056-e6052231bb3f.jpg?v=1717404699&width=870",
        "//kalles-5.myshopify.com/cdn/shop/files/4075232-spin-05_1c50fd70-38f9-41d4-9b06-4c75c079f275.jpg?v=1717404699&width=870",
        "//kalles-5.myshopify.com/cdn/shop/files/4075232-spin-07_184fd29b-6500-4388-9feb-eb9b77c112ad.jpg?v=1717404699&width=870",
        "//kalles-5.myshopify.com/cdn/shop/files/4075232-spin-08_9e90dd20-8092-4908-b2e9-b008367881f2.jpg?v=1717404699&width=870",
        "//kalles-5.myshopify.com/cdn/shop/files/4075232-spin-09_1376d534-5f6f-4d29-b45c-ef3ac7308a41.jpg?v=1717404699&width=870",
        "//kalles-5.myshopify.com/cdn/shop/files/4075232-spin-10_684b2769-b5e3-4aa6-94b6-3c9749042306.jpg?v=1717404699&width=870",
        "//kalles-5.myshopify.com/cdn/shop/files/4075232-spin-11_aabe99cd-b70c-4914-aa20-f975579957fa.jpg?v=1717404699&width=870",
        "//kalles-5.myshopify.com/cdn/shop/files/4075232-spin-12_0a567750-5f84-460d-83e0-3c130d26f2be.jpg?v=1717404699&width=870",
        "//kalles-5.myshopify.com/cdn/shop/files/4075232-spin-13_42cb9c65-fd13-4489-a109-0e4999f82d1e.jpg?v=1717404699&width=870",
        "//kalles-5.myshopify.com/cdn/shop/files/4075232-spin-14_84ac9c08-a16e-403c-998e-03fca52f0ea4.jpg?v=1717404699&width=870",
        "//kalles-5.myshopify.com/cdn/shop/files/4075232-spin-15_270d3a6e-a111-4fe5-bf70-daed7fd21357.jpg?v=1717404699&width=870",
        "//kalles-5.myshopify.com/cdn/shop/files/4075232-spin-16_5ebfaa4b-b8c2-46c1-ab6a-a69e45cacb9e.jpg?v=1717404699&width=870",
        "//kalles-5.myshopify.com/cdn/shop/files/4075232-spin-17_33e472ca-a068-422c-b646-dce9c7e766ec.jpg?v=1717404699&width=870",
        "//kalles-5.myshopify.com/cdn/shop/files/4075232-spin-18_20cebf44-91fb-477f-bf3b-3bbbd52c22de.jpg?v=1717404699&width=870",
        "//kalles-5.myshopify.com/cdn/shop/files/4075232-spin-19_b809c545-490d-43b9-8c1d-47cbb43f4408.jpg?v=1717404699&width=870",
        "//kalles-5.myshopify.com/cdn/shop/files/4075232-spin-21_e2b802ff-3632-413e-9de5-7d9e68437eed.jpg?v=1717404699&width=870",
        "//kalles-5.myshopify.com/cdn/shop/files/4075232-spin-22_0c1f2c80-f6b1-4bd3-aea0-09dc0f79fa53.jpg?v=1717404699&width=870",
        "//kalles-5.myshopify.com/cdn/shop/files/4075232-spin-23_89d1ac62-0b3a-4040-b473-a127c89b4fc8.jpg?v=1717404699&width=870",
        "//kalles-5.myshopify.com/cdn/shop/files/4075232-spin-24_94d0d0ab-894d-4dd6-927c-b5efd1fc532c.jpg?v=1717404699&width=870",
        "//kalles-5.myshopify.com/cdn/shop/files/4075232-spin-25_927a5bac-8e4e-486f-b4cc-43429def0ecb.jpg?v=1717404699&width=870",
        "//kalles-5.myshopify.com/cdn/shop/files/4075232-spin-26_740257b0-3e71-4d9e-a6b6-70528adeb78c.jpg?v=1717404699&width=870",
        "//kalles-5.myshopify.com/cdn/shop/files/4075232-spin-27_9375177a-67c7-43e8-abc4-05cd80ec5a21.jpg?v=1717404699&width=870",
        "//kalles-5.myshopify.com/cdn/shop/files/4075232-spin-28_51f88f6e-daf0-49f0-addc-7ebc9f22c597.jpg?v=1717404699&width=870",
        "//kalles-5.myshopify.com/cdn/shop/files/4075232-spin-29_43586226-a060-4a78-8662-f552446efd9c.jpg?v=1717404699&width=870",
        "//kalles-5.myshopify.com/cdn/shop/files/4075232-spin-30_e68b9a9f-5e87-4d4d-8845-a08362653844.jpg?v=1717404699&width=870",
        "//kalles-5.myshopify.com/cdn/shop/files/4075232-spin-31_5fedae46-774c-4ed2-a0aa-b30ab6db373e.jpg?v=1717404699&width=870",
        "//kalles-5.myshopify.com/cdn/shop/files/4075232-spin-32_b0366a20-b633-4b31-aa95-6b6f676c7a2d.jpg?v=1717404699&width=870",
        "//kalles-5.myshopify.com/cdn/shop/files/4075232-spin-33_deffebe2-6c0c-4075-9fab-eb7dc645ef00.jpg?v=1717404699&width=870",
        "//kalles-5.myshopify.com/cdn/shop/files/4075232-spin-34_86e112c9-5d03-4386-8cdb-98e626484b77.jpg?v=1717404699&width=870",
        "//kalles-5.myshopify.com/cdn/shop/files/4075232-spin-35_4b25b838-1e67-4498-95b3-d44e7dd36c13.jpg?v=1717404699&width=870",
        "//kalles-5.myshopify.com/cdn/shop/files/4075232-spin-36_0231e345-3450-4eb8-9b6f-907d8eacf121.jpg?v=1717404699&width=870",
        "//kalles-5.myshopify.com/cdn/shop/files/4075232-spin-37_5b9e9eaa-2e55-44e1-9c76-c659f9b59fb3.jpg?v=1717404699&width=870",
        "//kalles-5.myshopify.com/cdn/shop/files/4075232-spin-38_c5602b23-1ea0-45f9-95af-12778afe9952.jpg?v=1717404699&width=870",
        "//kalles-5.myshopify.com/cdn/shop/files/4075232-spin-40_48689eb2-07e0-4b4d-9434-65cecd2267dc.jpg?v=1717404699&width=870",
        "//kalles-5.myshopify.com/cdn/shop/files/4075232-spin-41_ea274f84-67f8-4ca8-ad70-47c2f9e79487.jpg?v=1717404699&width=870",
        "//kalles-5.myshopify.com/cdn/shop/files/4075232-spin-42_771ae298-2604-410c-8a69-48a18d1ea0fd.jpg?v=1717404699&width=870",
        "//kalles-5.myshopify.com/cdn/shop/files/4075232-spin-43_49f2e3c8-0668-4b1c-95b9-e65f65b1c7cf.jpg?v=1717404699&width=870",
        "//kalles-5.myshopify.com/cdn/shop/files/4075232-spin-44_1ef41b80-7553-4c9a-8238-8ef8a880d467.jpg?v=1717404699&width=870",
    ];

    const [currentFrame, setCurrentFrame] = useState(0);
    const [isPlaying, setIsPlaying] = useState(true); // Auto-play by default
    const [isDragging, setIsDragging] = useState(false);
    const startX = useRef(0);
    const startFrame = useRef(0);
    const intervalRef = useRef(null);

    // Auto-play logic
    useEffect(() => {
        if (isPlaying && !isDragging) {
            intervalRef.current = setInterval(() => {
                setCurrentFrame((prev) => (prev + 1) % images.length);
            }, 100);
        } else {
            clearInterval(intervalRef.current);
        }
        return () => clearInterval(intervalRef.current);
    }, [isPlaying, isDragging, images.length]);

    // Drag Logic
    const handleMouseDown = (e) => {
        setIsDragging(true);
        startX.current = e.clientX || e.touches?.[0]?.clientX;
        startFrame.current = currentFrame;
    };

    const handleMouseMove = (e) => {
        if (!isDragging) return;

        const currentX = e.clientX || e.touches?.[0]?.clientX;
        const diff = currentX - startX.current;
        const sensitivity = 5; // Adjust sensitivity

        // Calculate new frame based on drag distance
        // Dragging right -> rotate right (increment frame)
        // Dragging left -> rotate left (decrement frame)
        const frameChange = Math.floor(diff / sensitivity);
        let newFrame = (startFrame.current - frameChange) % images.length;

        // Handle negative modulo
        if (newFrame < 0) newFrame += images.length;

        setCurrentFrame(newFrame);
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    // Scrubber Logic
    const handleScrubberChange = (e) => {
        setCurrentFrame(Number(e.target.value));
        setIsPlaying(false); // Pause on manual interaction
    };

    return (
        <div className="w-full flex justify-center items-center py-20 bg-white">
            <div className="max-w-[800px] w-full px-4">
                <div
                    className="relative w-full aspect-[870/1107] cursor-grab active:cursor-grabbing overflow-hidden rounded-lg shadow-sm"
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                    onTouchStart={handleMouseDown}
                    onTouchMove={handleMouseMove}
                    onTouchEnd={handleMouseUp}
                >
                    {/* Main Image */}
                    <img
                        src={images[currentFrame]}
                        alt={`360 view frame ${currentFrame + 1}`}
                        className="w-full h-full object-cover select-none pointer-events-none"
                        draggable="false"
                    />

                    {/* Drag hint overlay (optional) */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-0 hover:opacity-100 transition-opacity duration-300">
                        {/* <span className="bg-black/50 text-white px-3 py-1 rounded-full text-sm">Drag to rotate</span> */}
                    </div>
                </div>

                {/* Controls */}
                <div className="mt-6 space-y-4">
                    {/* Scrubber */}
                    <div className="w-full relative h-2 bg-gray-200 rounded-full cursor-pointer">
                        <input
                            type="range"
                            min="0"
                            max={images.length - 1}
                            value={currentFrame}
                            onChange={handleScrubberChange}
                            className="absolute z-10 w-full h-full opacity-0 cursor-pointer"
                        />
                        <div
                            className="bg-[#56cfe1] h-full rounded-full transition-all duration-75"
                            style={{ width: `${(currentFrame / (images.length - 1)) * 100}%` }}
                        ></div>
                        <div
                            className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white border-2 border-[#56cfe1] rounded-full shadow-md pointer-events-none transition-all duration-75"
                            style={{ left: `${(currentFrame / (images.length - 1)) * 100}%`, transform: `translate(-50%, -50%)` }}
                        ></div>
                    </div>

                    {/* Play/Pause & Nav Controls */}
                    <div className="flex items-center justify-center gap-6">
                        <button
                            onClick={() => {
                                setCurrentFrame(prev => (prev - 1 + images.length) % images.length);
                                setIsPlaying(false);
                            }}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                        >
                            <ChevronLeft size={24} />
                        </button>

                        <button
                            onClick={() => setIsPlaying(!isPlaying)}
                            className="w-12 h-12 flex items-center justify-center bg-black text-white rounded-full hover:bg-[#56cfe1] transition-colors"
                        >
                            {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" className="ml-1" />}
                        </button>

                        <button
                            onClick={() => {
                                setCurrentFrame(prev => (prev + 1) % images.length);
                                setIsPlaying(false);
                            }}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                        >
                            <ChevronRight size={24} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Product360Viewer;
