import React from 'react';
import { Github, Linkedin, Mail, Mountain } from 'lucide-react';

const Header = ({ profileData }) => {
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <header className="fixed top-0 left-0 w-full z-50 bg-transparent transition-colors duration-300 pt-6">
            <div className="w-full px-8 md:px-12 h-12 flex items-center justify-between">

                {/* Logo text instead of circle */}
                <button
                    onClick={scrollToTop}
                    className="flex-shrink-0 text-white font-extrabold text-2xl hover:text-[var(--theme-color)] transition-colors tracking-widest"
                >
                    SV
                </button>

                {/* Right Actions — Order: LinkedIn, Trailhead, Github, Email */}
                <div className="flex items-center space-x-6">
                    {profileData?.linkedin && (
                        <a href={profileData.linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                            <Linkedin size={20} strokeWidth={1.5} />
                        </a>
                    )}
                    {profileData?.trailhead && (
                        <a href={profileData.trailhead} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                            <Mountain size={20} strokeWidth={1.5} />
                        </a>
                    )}
                    {profileData?.github && (
                        <a href={profileData.github} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                            <Github size={20} strokeWidth={1.5} />
                        </a>
                    )}
                    {profileData?.email && (
                        <a href={`mailto:${profileData.email}`} className="text-gray-400 hover:text-white transition-colors">
                            <Mail size={20} strokeWidth={1.5} />
                        </a>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;
