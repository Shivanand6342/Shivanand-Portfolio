import React, { useState, useEffect } from 'react';
import * as Icons from 'lucide-react';
import { getTechStackData, getCertificationsData } from '../firebase';

/**
 * TechBadge Component.
 * Renders a single technology icon and name.
 * 
 * @param {Object} props - Component props.
 * @param {Object} props.item - The technology item data.
 * @returns {JSX.Element}
 */
const TechBadge = ({ item }) => {
    // Dynamically resolve the Lucide icon, fallback to Code2 if not found
    const IconComponent = Icons[item.icon] || Icons.Code2;

    return (
        <div className="flex items-center gap-2 group cursor-default">
            {/* Minimalist square icon block */}
            <div className="w-8 h-8 rounded bg-[#111] border border-[#222] flex items-center justify-center text-orange-500 group-hover:bg-orange-500 group-hover:text-black group-hover:border-orange-400 transition-all duration-300">
                <IconComponent size={16} strokeWidth={2.5} />
            </div>
            {/* Tech Name Text */}
            <span className="text-xs font-mono text-gray-400 uppercase tracking-widest group-hover:text-white transition-colors duration-300">
                {item.name}
            </span>
        </div>
    );
};

const TechStack = () => {
    const [techCategories, setTechCategories] = useState([]);
    const [certifications, setCertifications] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const techData = await getTechStackData();
            const certData = await getCertificationsData();
            setTechCategories(techData);
            setCertifications(certData);
        };
        fetchData();
    }, []);

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'short' };
        return new Date(dateString).toLocaleDateString('en-US', options).toUpperCase();
    };

    return (
        <section id="tech-stack" className="w-full bg-gray-950 text-white py-24 select-none border-y border-[#111]">
            <div className="max-w-7xl mx-auto px-4 md:px-8">

                {/* 2-Column Grid matching the screenshot layout */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8">

                    {/* LEFT SIDE: Tech Stack (Takes up more space) */}
                    <div className="lg:col-span-7">
                        {/* Title Section */}
                        <div className="mb-12">
                            <p className="text-orange-500 font-mono text-[10px] sm:text-xs tracking-[0.2em] mb-2 uppercase font-bold">Technologies</p>
                            <h2 className="text-5xl md:text-[80px] font-black uppercase tracking-tight text-white leading-none">
                                STACK & CODE
                            </h2>
                        </div>

                        {/* Tech Categories List */}
                        <div className="flex flex-col">
                            {techCategories.map((category, index) => (
                                <div key={category.category} className="border-b border-[#1a1a1a] py-8 first:pt-0 last:border-0">
                                    <h3 className="text-2xl md:text-3xl font-black text-orange-500 mb-6 uppercase tracking-wider">
                                        {category.category}
                                    </h3>
                                    <div className="flex flex-wrap gap-x-8 gap-y-5">
                                        {category.items.map(item => (
                                            <TechBadge key={item.name} item={item} />
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>


                    {/* CENTER DIVIDER (Hidden on mobile) */}
                    <div className="hidden lg:flex lg:col-span-1 justify-center">
                        <div className="w-[4px] bg-[#111] h-full relative rounded-full">
                            {/* The active orange indicator line acting like a scroll progress or accent line */}
                            <div className="absolute top-0 left-0 w-full h-32 bg-orange-600 rounded-full"></div>
                        </div>
                    </div>


                    {/* RIGHT SIDE: Certifications (Native Flow) */}
                    <div className="lg:col-span-4 pt-2 lg:pt-0">
                        <div className="flex flex-col">
                            {/* Parallel faded title */}
                            <div className="mb-12">
                                <h2 className="text-5xl md:text-[80px] font-black uppercase tracking-tight text-[#333] leading-none">
                                    LATEST<span className="text-orange-600">.</span>
                                </h2>
                            </div>

                            {/* Certifications Box (Matches "LIVE FEED" box style) */}
                            <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-sm p-6 w-full shadow-lg">
                                {/* Box Header */}
                                <div className="flex items-center justify-between mb-8 border-b border-[#1a1a1a] pb-4">
                                    <div className="flex items-center gap-3">
                                        <Icons.Award className="text-orange-500" size={24} />
                                        <span className="text-white font-black uppercase tracking-widest text-xl">CERTIFICATIONS</span>
                                    </div>
                                    <div className="flex items-center gap-2 px-2 py-1 bg-[#1a1a1a] rounded border border-[#333]">
                                        <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></div>
                                        <span className="text-orange-500 text-[10px] font-mono tracking-wider font-bold">VERIFIED</span>
                                    </div>
                                </div>

                                {/* Certifications List (No forced max-height, expands organically) */}
                                <div className="flex flex-col gap-6 w-full">
                                    {certifications.map((cert, index) => (
                                        <a
                                            key={index}
                                            href={cert.url}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="group flex flex-col sm:flex-row sm:items-start justify-between gap-2 sm:gap-4 relative hover:pl-2 transition-all duration-300"
                                        >
                                            <div className="flex items-start gap-3">
                                                {/* Status Icon */}
                                                <div className="mt-1 flex-shrink-0 text-orange-600">
                                                    <Icons.ShieldCheck size={16} />
                                                </div>
                                                {/* Text Content */}
                                                <div className="flex flex-col">
                                                    <span className="text-gray-300 font-mono text-sm leading-tight max-w-[250px] group-hover:text-orange-400 transition-colors">
                                                        {cert.name.toUpperCase()}
                                                    </span>
                                                </div>
                                            </div>
                                            {/* Date Alignment Right */}
                                            <div className="flex items-center justify-end whitespace-nowrap pl-7 sm:pl-0">
                                                <span className="text-[#555] text-xs font-mono font-bold tracking-wider">
                                                    {formatDate(cert.date)}
                                                </span>
                                                <Icons.ArrowUpRight size={14} className="ml-2 text-gray-700 opacity-0 group-hover:opacity-100 group-hover:text-orange-500 transition-all -translate-y-1 translate-x-1" />
                                            </div>
                                        </a>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default TechStack;
