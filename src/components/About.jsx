import React from 'react';

/**
 * About Section Component.
 * Visualizes personal background, driving philosophy, and years of experience into a structured summary grid.
 *
 * @param {Object} props
 * @param {Object} props.profileData - Profile details containing bio array, title, and years of experience.
 * @returns {JSX.Element}
 */
const About = ({ profileData }) => {
    const renderBioParagraphs = () => {
        if (!profileData?.bio) return <p className="text-gray-400">Loading biography...</p>;

        const bioArray = Array.isArray(profileData.bio) ? profileData.bio : [profileData.bio];

        return bioArray.map((paragraph, index) => (
            <p key={index} className="text-gray-300 leading-relaxed text-sm md:text-base mb-6 font-light">
                {paragraph}
            </p>
        ));
    };

    // Helper to generate scattered text elements
    const renderScatteredSVs = () => {
        const positions = [
            { top: '10%', left: '10%', rotate: '-15deg', size: 'text-6xl', opacity: 'opacity-10' },
            { top: '20%', left: '80%', rotate: '25deg', size: 'text-8xl', opacity: 'opacity-5' },
            { top: '70%', left: '15%', rotate: '-5deg', size: 'text-7xl', opacity: 'opacity-10' },
            { top: '80%', left: '75%', rotate: '15deg', size: 'text-9xl', opacity: 'opacity-5' },
            { top: '40%', left: '50%', rotate: '45deg', size: 'text-8xl', opacity: 'opacity-[0.03]' },
            { top: '15%', left: '45%', rotate: '-25deg', size: 'text-5xl', opacity: 'opacity-10' },
            { top: '85%', left: '40%', rotate: '10deg', size: 'text-6xl', opacity: 'opacity-10' },
        ];

        return positions.map((pos, i) => (
            <div
                key={i}
                className={`absolute font-black italic tracking-tighter text-blue-600 ${pos.size} ${pos.opacity} select-none`}
                style={{
                    top: pos.top,
                    left: pos.left,
                    transform: `rotate(${pos.rotate})`,
                    // Using a subtle dark blue square to mimic the boxes in the user's reference image
                    backgroundColor: 'rgba(30, 58, 138, 0.2)',
                    padding: '20px',
                    lineHeight: '1',
                }}
            >
                SV
            </div>
        ));
    };

    return (
        <section id="about" className="min-h-screen bg-gray-950 flex flex-col md:flex-row relative overflow-hidden">

            {/* Left Column: Typographical Background / Years Exp */}
            <div className="w-full md:w-1/2 flex relative border-b md:border-b-0 border-gray-900 bg-[#171717] min-h-[400px] md:min-h-full">

                {/* Scattered SV background elements */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
                    {renderScatteredSVs()}
                </div>

                <div className="absolute inset-0 flex items-center justify-center w-full h-full z-10">
                    <div className="grid place-items-center -translate-x-4 md:-translate-x-8">
                        <span className="col-start-1 row-start-1 text-[8rem] md:text-[12rem] lg:text-[14rem] font-bold text-[#2a2a2a] leading-none select-none tracking-tighter mix-blend-difference whitespace-nowrap">
                            {profileData?.yearsOfExperience ? `${String(profileData.yearsOfExperience).replace(/\+/g, '').trim()}+` : "4+"}
                        </span>

                        {/* The "YEARS OF EXPERIENCE" text - perfectly centered over the number */}
                        <div className="col-start-1 row-start-1 flex flex-col items-center justify-center text-sm md:text-xl text-gray-400 font-bold uppercase tracking-widest leading-tight mix-blend-difference text-center pointer-events-none z-20">
                            <span>YEARS OF</span>
                            <span>EXPERIENCE</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Column: Bio Narrative */}
            {/* Adjusted padding to reduce space on the left side (closer to center divider) and increase space on right side */}
            <div className="w-full md:w-1/2 bg-[#050505] flex flex-col justify-center py-12 px-8 md:py-24 md:pl-12 md:pr-12 lg:py-32 lg:pl-16 lg:pr-24 xl:py-40 xl:pl-24 xl:pr-48">
                <div className="max-w-[700px] w-full mr-auto">
                    <div className="text-orange-500 font-bold text-xs md:text-sm uppercase tracking-[0.2em] mb-6">
                        ABOUT
                    </div>

                    <h2 className="text-4xl lg:text-5xl xl:text-6xl font-black text-white uppercase tracking-wider mb-12 drop-shadow-md leading-[1.1] whitespace-nowrap">
                        THE<br />
                        <span className="text-orange-500">'WHY'</span><br />
                        BEHIND WHO I AM
                    </h2>

                    <div className="text-gray-200">
                        {renderBioParagraphs()}
                    </div>
                </div>
            </div>

        </section>
    );
};

export default About;
