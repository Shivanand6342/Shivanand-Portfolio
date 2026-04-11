import React from 'react';

/**
 * Contact Component.
 * Displays call-to-action blocks, dynamic social buttons, and an endless marquee banner.
 *
 * @param {Object} props
 * @param {Object} props.profileData - User profile data for email and social links.
 * @param {Object} props.contactData - Dynamic textual data representing headings and bottom marquee items.
 * @returns {JSX.Element}
 */
const Contact = ({ profileData, contactData }) => {
    // Generate a long string for the marquee securely relying on either DB fetch or standard fallback
    const rawMarquee = contactData?.marqueeText || "SHIVANAND VISHWAKARMA * SENIOR SALESFORCE DEVELOPER * UP, INDIA * ";
    const marqueeText = rawMarquee.repeat(20);


    return (
        <section id="contact" className="w-full relative flex flex-col">
            {/* Top Orange Section */}
            <div className="py-32 px-4 flex flex-col items-center justify-center text-center" style={{ backgroundColor: 'var(--theme-color-contact)' }}>
                <h2 className="text-[12vw] sm:text-[8vw] md:text-8xl font-black text-black leading-[0.9] tracking-tighter uppercase font-sans mb-12 flex flex-col items-center">
                    {contactData?.headingLines?.map((line, index) => (
                        <span key={index}>{line}</span>
                    ))}
                </h2>

                <div className="flex flex-col sm:flex-row gap-6 mt-4">
                    <a
                        href={`mailto:${profileData?.email || 'test@example.com'}`}
                        className="px-8 py-4 bg-black text-white font-bold text-lg uppercase tracking-wider hover:bg-gray-900 transition-colors border-2 border-transparent hover:border-black"
                    >
                        {contactData?.buttonTexts?.primary || "GET IN TOUCH"}
                    </a>

                    <a
                        href={profileData?.linkedin || '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-8 py-4 bg-transparent text-black font-bold text-lg uppercase tracking-wider border-2 border-black hover:bg-black hover:text-white transition-colors"
                    >
                        {contactData?.buttonTexts?.secondary || "VIEW LINKEDIN"}
                    </a>
                </div>
            </div>

            {/* Bottom Marquee Section */}
            <div className="bg-black py-5 overflow-hidden flex whitespace-nowrap border-t-4 border-[#111]">
                <div className="animate-marquee shrink-0 flex items-center gap-4 text-[#333] font-black text-2xl tracking-widest uppercase">
                    {/* Render the text natively with inline flex structure to center the asterisk */}
                    {marqueeText.split('*').map((part, i) => {
                        if (i === marqueeText.split('*').length - 1 && part.trim() === '') return null; // skip trailing empty split
                        return (
                            <React.Fragment key={i}>
                                <span>{part.trim()}</span>
                                <span className="text-[#222] px-2 self-center translate-y-1 flex items-center justify-center text-3xl">*</span>
                            </React.Fragment>
                        );
                    })}
                </div>
                {/* Duplicate for seamless infinite scrolling */}
                <div className="animate-marquee shrink-0 flex items-center gap-4 text-[#333] font-black text-2xl tracking-widest uppercase pl-4" aria-hidden="true">
                    {marqueeText.split('*').map((part, i) => {
                        if (i === marqueeText.split('*').length - 1 && part.trim() === '') return null;
                        return (
                            <React.Fragment key={i}>
                                <span>{part.trim()}</span>
                                <span className="text-[#222] px-2 self-center translate-y-1 flex items-center justify-center text-3xl">*</span>
                            </React.Fragment>
                        );
                    })}
                </div>
            </div>

            <style>{`
                @keyframes marquee {
                    0% { transform: translateX(0%); }
                    100% { transform: translateX(-100%); }
                }
                .animate-marquee {
                    animation: marquee 150s linear infinite;
                    will-change: transform;
                }
            `}</style>
        </section>
    );
};

export default Contact;
