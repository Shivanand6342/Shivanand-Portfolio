import React, { useState } from 'react';
import ExperienceCanvas from './ExperienceCanvas';

/**
 * Professional Experience Timeline Component.
 * Presents a collapsible tree-like structured graph highlighting companies, timelines, and discrete projects 
 * utilizing a canvas engine.
 *
 * @param {Object} props
 * @param {Object} props.profileData - Profile information.
 * @param {Array<Object>} props.experiences - Ordered listing of past roles.
 * @returns {JSX.Element}
 */
const Experience = ({ profileData, experiences }) => {
    const [selectedExpId, setSelectedExpId] = useState(null);

    // Handle click on timeline node
    const handleTimelineClick = (expId) => {
        setSelectedExpId(expId === selectedExpId ? null : expId); // Toggle
    };

    return (
        <section id="experience" className="py-24 bg-[#080808] transition-colors duration-300">
            <div className="w-full px-4 sm:px-6 lg:px-12 mx-auto">
                <div className="flex flex-col lg:flex-row gap-4 min-h-[700px] h-[85vh]">

                    {/* Left Column (Timeline) */}
                    <div className="w-full lg:w-[350px] shrink-0 p-6 overflow-y-auto custom-scrollbar flex flex-col pt-12">

                        {/* Title Section */}
                        <div className="mb-16">
                            <div className="text-orange-500 font-bold text-xs tracking-[0.2em] mb-2 uppercase">Journey</div>
                            <h2 className="text-4xl font-extrabold text-white tracking-widest uppercase">Experience</h2>
                        </div>

                        {/* Timeline */}
                        <div className="relative pl-4 border-l border-gray-800 space-y-16 ml-3">
                            {experiences?.map((exp, index) => {
                                const isSelected = selectedExpId === exp.id;

                                return (
                                    <div
                                        key={exp.id}
                                        className="relative cursor-pointer transition-all duration-300 group"
                                        onClick={() => handleTimelineClick(exp.id)}
                                    >
                                        {/* Square Node Indicator */}
                                        <div
                                            className="absolute -left-[20px] top-1 w-2.5 h-2.5 transition-all duration-300"
                                            style={{
                                                backgroundColor: exp.color || '#3b82f6',
                                                boxShadow: isSelected ? `0 0 10px ${exp.color}` : 'none',
                                                transform: isSelected ? 'scale(1.2)' : 'scale(1)'
                                            }}
                                        ></div>

                                        <div className="pl-6">
                                            {/* Date */}
                                            <div className="mb-2 text-sm font-mono text-gray-400 font-medium tracking-wide">
                                                {exp.timeline}
                                            </div>

                                            {/* Company Name */}
                                            <h4 className="text-2xl font-black text-white uppercase tracking-wider mb-2 group-hover:opacity-80 transition-opacity">
                                                {exp.companyName}
                                            </h4>

                                            {/* Position */}
                                            <div
                                                className="text-sm font-mono tracking-wide"
                                                style={{ color: exp.color || '#3b82f6' }}
                                            >
                                                {exp.position}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}

                            {!experiences || experiences.length === 0 && (
                                <div className="text-gray-500 font-mono text-sm ml-6">Loading experiences...</div>
                            )}
                        </div>
                    </div>

                    {/* Right Column (React Flow Canvas) */}
                    <div className="w-full lg:flex-1 bg-[#0a0a0a] rounded-2xl border border-gray-800 overflow-hidden relative shadow-2xl">
                        <ExperienceCanvas
                            profileData={profileData}
                            experiences={experiences}
                            selectedExpId={selectedExpId}
                        />
                    </div>

                </div>
            </div>
        </section>
    );
};

export default Experience;
