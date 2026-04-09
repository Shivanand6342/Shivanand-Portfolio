import React, { useState, useEffect } from 'react';
import { Quote, ChevronLeft, ChevronRight, User } from 'lucide-react';

/**
 * Interactive Testimonials Carousel Component.
 * Supports looping horizontal layout tracking dragging mechanisms (mouse + touch) 
 * and smooth CSS transition sliding. Safely degrades if data array is empty.
 *
 * @param {Object} props
 * @param {Array<Object>} props.testimonials - Array of user recommendations including Name, text, and roles.
 * @returns {JSX.Element|null} Returns section element or null if empty.
 */
const Testimonials = ({ testimonials = [] }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [visibleCount, setVisibleCount] = useState(2);
    
    // Drag state
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [dragOffset, setDragOffset] = useState(0);

    // Update visible count based on window size
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 1024) {
                setVisibleCount(1);
            } else {
                setVisibleCount(2);
            }
        };

        handleResize(); // Init
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Do not render section if there are no testimonials
    if (!testimonials || testimonials.length === 0) {
        return null;
    }

    const showControls = testimonials.length > visibleCount;
    // Determine max index we can slide to without showing empty space
    const maxIndex = Math.max(0, testimonials.length - visibleCount);

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    };

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
    };

    // Drag / Touch Handlers
    const handleDragStart = (e) => {
        setIsDragging(true);
        // Supports both mouse and touch
        setStartX(e.type.includes('mouse') ? e.pageX : e.touches[0].pageX);
    };

    const handleDragMove = (e) => {
        if (!isDragging) return;
        const currentX = e.type.includes('mouse') ? e.pageX : e.touches[0].pageX;
        const diff = currentX - startX;
        setDragOffset(diff);
    };

    const handleDragEnd = () => {
        if (!isDragging) return;
        setIsDragging(false);

        // Threshold to navigate (e.g. 75px)
        const SWIPE_THRESHOLD = 75;

        // Passed threshold to the Left (Swipe Left) -> Next Slide
        if (dragOffset <= -SWIPE_THRESHOLD) {
            nextSlide();
        } 
        // Passed threshold to the Right (Swipe Right) -> Prev Slide
        else if (dragOffset >= SWIPE_THRESHOLD) {
            prevSlide();
        }

        // Reset offset so the CSS transform takes over smoothly
        setDragOffset(0);
    };

    return (
        <section className="py-20 bg-black w-full overflow-hidden">
            <div className="w-full px-4 md:px-8 mx-auto relative">
                {/* Header Section */}
                <div className="mb-12 flex justify-between items-end">
                    <div>
                        <span className="text-[#FF6B00] text-sm font-bold tracking-widest uppercase mb-2 block">TESTIMONIALS</span>
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold uppercase tracking-tight text-white mb-6">
                            WHAT PEOPLE SAY
                        </h2>
                        
                        <div className="inline-flex items-center gap-2 border border-[#FF6B00] px-3 py-1.5 rounded-sm">
                            <User size={14} className="text-[#FF6B00]"/>
                            <span className="text-[#FF6B00] text-xs font-semibold tracking-wider uppercase">
                                Sourced from LinkedIn Recommendations
                            </span>
                        </div>
                    </div>

                    {/* Carousel Controls (Top Right) */}
                    {showControls && (
                        <div className="hidden md:flex gap-4">
                            <button 
                                onClick={prevSlide}
                                className="w-12 h-12 rounded-full border border-gray-600 flex items-center justify-center text-gray-400 hover:text-white hover:border-[#FF6B00] hover:bg-[#FF6B00]/10 transition-all focus:outline-none"
                            >
                                <ChevronLeft size={24} />
                            </button>
                            <button 
                                onClick={nextSlide}
                                className="w-12 h-12 rounded-full border border-gray-600 flex items-center justify-center text-gray-400 hover:text-white hover:border-[#FF6B00] hover:bg-[#FF6B00]/10 transition-all focus:outline-none"
                            >
                                <ChevronRight size={24} />
                            </button>
                        </div>
                    )}
                </div>

                {/* Cards Section (Draggable container) */}
                <div 
                    className="w-full overflow-hidden cursor-grab active:cursor-grabbing"
                    onMouseDown={handleDragStart}
                    onMouseMove={handleDragMove}
                    onMouseUp={handleDragEnd}
                    onMouseLeave={handleDragEnd}
                    onTouchStart={handleDragStart}
                    onTouchMove={handleDragMove}
                    onTouchEnd={handleDragEnd}
                >
                    <div 
                        // Disable transition while dragging to map 1:1 with mouse
                        className={`flex ${isDragging ? '' : 'transition-transform duration-500 ease-in-out'}`} 
                        style={{ 
                            transform: `translateX(calc(-${currentIndex * (100 / visibleCount)}% + ${dragOffset}px))`,
                            userSelect: 'none' // Prevent text from being highlighted while dragging
                        }}
                    >
                        {testimonials.map((t) => (
                            <div 
                                key={t.id} 
                                className="px-3"
                                style={{ flex: `0 0 ${100 / visibleCount}%` }}
                            >
                                <div className="bg-[#0f0f0f] border-l-4 border-l-[#FF6B00] p-8 lg:p-10 flex flex-col justify-between h-full relative rounded-r-md min-h-[450px]">
                                    {/* Top Badge & Quote Icon */}
                                    <div className="flex justify-between items-start mb-8 text-gray-400">
                                        <div className="flex items-center gap-2 uppercase tracking-wide text-xs font-bold">
                                            <User size={16} />
                                            <span>Linkedin Recommendation</span>
                                        </div>
                                        <Quote size={40} className="text-[#2a2a2a] rotate-180 absolute top-8 right-8" />
                                    </div>

                                    {/* Quote Text */}
                                    <div className="flex-1 mb-10">
                                        <p className="text-gray-300 text-base md:text-lg leading-relaxed drop-shadow-sm font-medium">
                                            {t.text}
                                        </p>
                                    </div>

                                    {/* Separator */}
                                    <hr className="border-gray-800 mb-6" />

                                    {/* Person Details */}
                                    <div>
                                        <h4 className="text-white font-bold text-xl mb-1">{t.name}</h4>
                                        <p className="text-[#FF6B00] text-sm font-semibold mb-2">{t.role}</p>
                                        <p className="text-gray-500 text-xs mb-3 italic">{t.relation}</p>
                                        <p className="text-gray-600 text-[10px] uppercase tracking-widest font-bold">{t.date}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Mobile Carousel Controls (Bottom) */}
                {showControls && (
                    <div className="flex justify-center gap-6 mt-8 md:hidden">
                        <button 
                            onClick={prevSlide}
                            className="w-14 h-14 rounded-full border border-gray-600 flex items-center justify-center text-gray-400 active:text-white active:border-[#FF6B00] active:bg-[#FF6B00]/10 transition-all focus:outline-none"
                        >
                            <ChevronLeft size={28} />
                        </button>
                        <button 
                            onClick={nextSlide}
                            className="w-14 h-14 rounded-full border border-gray-600 flex items-center justify-center text-gray-400 active:text-white active:border-[#FF6B00] active:bg-[#FF6B00]/10 transition-all focus:outline-none"
                        >
                            <ChevronRight size={28} />
                        </button>
                    </div>
                )}
            </div>
        </section>
    );
};

export default Testimonials;
