import React, { useState, useEffect, useCallback } from 'react';
import Particles from 'react-tsparticles';
import { loadSlim } from 'tsparticles-slim';
import { Download } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { getHeroMarqueeData } from '../firebase';

/**
 * Hero Banner Component.
 * Displays the initial introduction banner alongside a dynamic infinite-scrolling marquee of technical skills.
 *
 * @param {Object} props
 * @param {Object} props.profileData - Basic user profile information (name, role).
 * @param {string} props.cvUrl - URL required for the Download CV CTA.
 * @returns {JSX.Element}
 */
const Hero = ({ profileData, cvUrl }) => {
    const { scrollY } = useScroll();
    const [marqueeItems, setMarqueeItems] = useState([]);

    useEffect(() => {
        const fetchMarquee = async () => {
            const data = await getHeroMarqueeData();
            setMarqueeItems([...data, ...data]); // Double the items initially just for more content if short
        };
        fetchMarquee();
    }, []);

    // Map scroll position [0px, 400px] to opacity [1, 0] and Y [0px, -150px]
    const opacity = useTransform(scrollY, [0, 400], [1, 0]);
    const y = useTransform(scrollY, [0, 400], [0, -150]);

    const particlesInit = useCallback(async (engine) => {
        await loadSlim(engine);
    }, []);

    const downloadCv = () => {
        if (cvUrl && cvUrl !== '#') {
            window.open(cvUrl, '_blank');
        }
    };

    return (
        <div className="relative w-full z-20">
            <section className="relative w-full h-screen flex items-center justify-center overflow-hidden bg-gray-950 pt-16 z-10">

                {/* Particles Background */}
                <div className="absolute inset-0 z-0 opacity-40">
                    <Particles
                        id="tsparticles"
                        init={particlesInit}
                        options={{
                            background: {
                                color: {
                                    value: "transparent",
                                },
                            },
                            fpsLimit: 120,
                            interactivity: {
                                events: {
                                    onHover: {
                                        enable: true,
                                        mode: "repulse",
                                    },
                                    resize: true,
                                },
                                modes: {
                                    repulse: {
                                        distance: 100,
                                        duration: 0.4,
                                    },
                                },
                            },
                            particles: {
                                color: {
                                    value: "#ffffff",
                                },
                                links: {
                                    color: "#ffffff",
                                    distance: 150,
                                    enable: true,
                                    opacity: 0.2,
                                    width: 1,
                                },
                                move: {
                                    direction: "none",
                                    enable: true,
                                    outModes: {
                                        default: "bounce",
                                    },
                                    random: false,
                                    speed: 1.5,
                                    straight: false,
                                },
                                number: {
                                    density: {
                                        enable: true,
                                        area: 800,
                                    },
                                    value: 80,
                                },
                                opacity: {
                                    value: 0.3,
                                },
                                shape: {
                                    type: "circle",
                                },
                                size: {
                                    value: { min: 1, max: 3 },
                                },
                            },
                            detectRetina: true,
                        }}
                    />
                </div>

                {/* Hero Content */}
                <motion.div
                    style={{ opacity, y }}
                    className="relative z-10 text-center px-4 w-full"
                >

                    {/* Outlined Name with Strikethrough relative container */}
                    <div className="relative inline-block mb-10">
                        <h1 className="text-[10vw] md:text-[160px] font-black uppercase tracking-wider text-outline-gray select-none leading-none">
                            {profileData?.name || "SHIVANAND"}
                        </h1>
                        {/* The striking orange line */}
                        <div className="absolute top-1/2 left-0 w-full h-1 md:h-2 bg-orange-500 transform -translate-y-1/2 rounded-full shadow-[0_0_20px_rgba(249,115,22,0.6)]"></div>
                    </div>

                    <h2 className="text-xl md:text-4xl font-mono text-orange-500 uppercase tracking-widest mb-16 font-semibold shadow-orange-500/20 drop-shadow-md">
                        {profileData?.tagline || "SALESFORCE/SFCC DEVELOPER"}
                    </h2>

                    {/* Only Download CV Button */}
                    <div className="flex justify-center">
                        <button
                            onClick={downloadCv}
                            className="group flex items-center gap-2 px-8 py-3 outline outline-1 outline-gray-700 hover:outline-orange-500 text-gray-300 hover:text-orange-400 font-mono tracking-wider transition-all duration-300"
                        >
                            <Download size={18} className="group-hover:-translate-y-1 transition-transform" />
                            <span>DOWNLOAD CV</span>
                        </button>
                    </div>
                </motion.div>
            </section>

            {/* Wedge Marquee Bridge Container - Tilted Top, Flat Bottom */}
            {marqueeItems.length > 0 && (
                <div className="relative w-full z-30 mt-[-3vw] filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)]">
                    <div
                        className="w-full bg-[#f97316] flex whitespace-nowrap overflow-hidden"
                        style={{ clipPath: "polygon(0 4vw, 100% 20%, 100% 100%, 0 100%)", paddingTop: "5vw", paddingBottom: "1.5vw" }}
                    >
                        {/* Wrapper to tilt the text upwards on the right side */}
                        <div className="flex w-full" style={{ transform: "rotate(-1deg) translateY(-0.5vw)" }}>
                            <div className="animate-hero-marquee shrink-0 flex items-center text-black font-black uppercase tracking-tight leading-none">
                                {marqueeItems.map((item, i) => (
                                    <React.Fragment key={`m1-${i}`}>
                                        <span className="text-4xl md:text-[50px] xl:text-[60px] whitespace-nowrap">{item}</span>
                                        <span className="px-4 md:px-8 text-black self-center pt-1 text-4xl md:text-[50px] xl:text-[60px] opacity-80">*</span>
                                    </React.Fragment>
                                ))}
                            </div>
                            {/* Duplicate for seamless infinite scrolling */}
                            <div className="animate-hero-marquee shrink-0 flex items-center text-black font-black uppercase tracking-tight leading-none pl-4 md:pl-8" aria-hidden="true">
                                {marqueeItems.map((item, i) => (
                                    <React.Fragment key={`m2-${i}`}>
                                        <span className="text-4xl md:text-[50px] xl:text-[60px] whitespace-nowrap">{item}</span>
                                        <span className="px-4 md:px-8 text-black self-center pt-1 text-4xl md:text-[50px] xl:text-[60px] opacity-80">*</span>
                                    </React.Fragment>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                @keyframes hero-marquee {
                    0% { transform: translateX(0%); }
                    100% { transform: translateX(-100%); }
                }
                .animate-hero-marquee {
                    animation: hero-marquee 20s linear infinite;
                    will-change: transform;
                }
            `}</style>
        </div>
    );
};

export default Hero;
